"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { tasks, users, CATEGORIAS_TASK, PRIORIDADES, STATUS_TASK } from "@/db/schema";

import { requireUser, auditor, ipResumido, podeExcluirRegistro } from "@/lib/auth";
import { ERRO, OK, errosZod, textoOuUndefined, numeroOuUndefined, dataOuUndefined, type ActionState } from "@/lib/action-state";
import type { Papel } from "@/db/schema";
function campo(fd: FormData, nome: string): string {
  const v = fd.get(nome);
  return typeof v === "string" ? v.trim() : "";
}

const esquemaTarefa = z.object({
  titulo: z.string().trim().min(2, "Mínimo de 2 caracteres"),
  descricao: z.string().trim().optional(),
  categoria: z.enum(CATEGORIAS_TASK),
  prioridade: z.enum(PRIORIDADES).default("media"),
  status: z.enum(STATUS_TASK).default("pendente"),
  responsavelId: z.number().int().positive().nullable(),
  prazo: z.date().nullable(),
});

type DadosTarefa = z.infer<typeof esquemaTarefa>;

export async function lerCamposTarefa(fd: FormData): Promise<{ dados?: DadosTarefa; erros?: Record<string, string> }> {
  const dados = esquemaTarefa.safeParse({
    titulo: campo(fd, "titulo"),
    descricao: textoOuUndefined(fd.get("descricao")),
    categoria: campo(fd, "categoria") || "engenharia",
    prioridade: campo(fd, "prioridade") || "media",
    status: campo(fd, "status") || "pendente",
    responsavelId: numeroOuUndefined(fd.get("responsavelId")) ?? null,
    prazo: dataOuUndefined(fd.get("prazo")) ?? null,
  });
  if (!dados.success) return { erros: errosZod(dados.error) };
  return { dados: dados.data };
}

export async function acaoCriarTarefa(_estado: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireUser();
  const leitura = await lerCamposTarefa(fd);
  if (!leitura.dados) return ERRO(leitura.erros ?? {});
  const d = leitura.dados;
  await db.insert(tasks).values({
    titulo: d.titulo,
    descricao: d.descricao || null,
    categoria: d.categoria,
    prioridade: d.prioridade,
    status: d.status,
    responsavelId: await validarResponsavel(d.responsavelId),
    prazo: d.prazo,
    criadoPorId: user.id,
  });
  await auditor("criar_task", { usuarioId: user.id, detalhe: d.titulo, ip: await ipResumido() });
  revalidatePath("/painel");
  revalidatePath("/painel/tarefas");
  return OK("Tarefa criada.");
}

async function validarResponsavel(id: number | null): Promise<number | null> {
  if (id === null) return null;
  const r = await db.select({ id: users.id }).from(users).where(eq(users.id, id)).limit(1);
  return r[0]?.id ?? null;
}

export async function acaoSalvarTarefa(_estado: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireUser();
  const id = numeroOuUndefined(fd.get("id"));
  if (!id) return ERRO({ id: "Tarefa inválida." });
  const leitura = await lerCamposTarefa(fd);
  if (!leitura.dados) return ERRO(leitura.erros ?? {});
  const d = leitura.dados;

  const anterior = (await db.select().from(tasks).where(eq(tasks.id, id)).limit(1))[0];
  if (!anterior) return ERRO({ id: "Tarefa não encontrada." });

  const novoResponsavel = await validarResponsavel(d.responsavelId);
  await db
    .update(tasks)
    .set({
      titulo: d.titulo,
      descricao: d.descricao || null,
      categoria: d.categoria,
      prioridade: d.prioridade,
      status: d.status,
      responsavelId: novoResponsavel,
      prazo: d.prazo,
      updatedAt: new Date(),
    })
    .where(eq(tasks.id, id));

  // histórico simples de alterações em audit_logs (acao: atualizar_task)
  const mudou: Record<string, unknown> = { taskId: id };
  if (anterior.titulo !== d.titulo) mudou.titulo = d.titulo;
  if (anterior.categoria !== d.categoria) mudou.categoria = d.categoria;
  if (anterior.prioridade !== d.prioridade) mudou.prioridade = d.prioridade;
  if (anterior.status !== d.status) mudou.status = d.status;
  if ((anterior.responsavelId ?? null) !== (novoResponsavel ?? null)) mudou.responsavelId = novoResponsavel;
  if ((anterior.prazo?.getTime() ?? null) !== (d.prazo?.getTime() ?? null)) mudou.prazo = d.prazo?.toISOString() ?? null;
  if (Object.keys(mudou).length > 1 || anterior.descricao !== (d.descricao || null)) {
    if (anterior.descricao !== (d.descricao || null)) mudou.descricao = "atualizada";
    await auditor("atualizar_task", { usuarioId: user.id, detalhe: JSON.stringify({ taskId: id, alteracoes: mudou }), ip: await ipResumido() });
  }
  revalidatePath("/painel");
  revalidatePath(`/painel/tarefas/${id}`);
  revalidatePath("/painel/tarefas");
  return OK("Tarefa atualizada.");
}

/** Ação única (form action={fn}) para excluir — GET não; POST via form. */
export async function acaoExcluirTarefa(fd: FormData): Promise<void> {
  const user = await requireUser();
  const id = numeroOuUndefined(fd.get("id"));
  if (id && podeExcluirRegistro(user.papel)) {
    await db.delete(tasks).where(eq(tasks.id, id));
    await auditor("excluir_task", { usuarioId: user.id, detalhe: `taskId:${id}`, ip: await ipResumido() });
  }
  revalidatePath("/painel/tarefas");
  revalidatePath("/painel");
}
