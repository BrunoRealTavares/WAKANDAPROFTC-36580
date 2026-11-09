"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { engineeringLogs, robotVersions, tasks } from "@/db/schema";
import { requireUser, auditor, ipResumido, podeExcluirRegistro } from "@/lib/auth";
import { ERRO, OK, errosZod, numeroOuUndefined, dataISOOuUndefined, textoOuUndefined, type ActionState } from "@/lib/action-state";

const esquema = z.object({
  problema: z.string().trim().min(5, "Descreva o problema (mín. 5 caracteres)"),
  hipotese: z.string().trim().optional(),
  solucao: z.string().trim().optional(),
  experimento: z.string().trim().optional(),
  materiais: z.string().trim().optional(),
  resultado: z.string().trim().optional(),
  aprendizados: z.string().trim().optional(),
  proximasAcoes: z.string().trim().optional(),
  taskId: z.number().int().positive().nullable(),
  robotVersionId: z.number().int().positive().nullable(),
  data: z.date(),
});

function campo(fd: FormData, nome: string): string {
  const v = fd.get(nome);
  return typeof v === "string" ? v.trim() : "";
}

async function lerDados(fd: FormData) {
  const dados = esquema.safeParse({
    problema: campo(fd, "problema"),
    hipotese: textoOuUndefined(fd.get("hipotese")),
    solucao: textoOuUndefined(fd.get("solucao")),
    experimento: textoOuUndefined(fd.get("experimento")),
    materiais: textoOuUndefined(fd.get("materiais")),
    resultado: textoOuUndefined(fd.get("resultado")),
    aprendizados: textoOuUndefined(fd.get("aprendizados")),
    proximasAcoes: textoOuUndefined(fd.get("proximasAcoes")),
    taskId: numeroOuUndefined(fd.get("taskId")) ?? null,
    robotVersionId: numeroOuUndefined(fd.get("robotVersionId")) ?? null,
    data: dataISOOuUndefined(fd.get("data")) ?? new Date(),
  });
  if (!dados.success) return { ok: false as const, erros: errosZod(dados.error) as Record<string, string> };
  return { ok: true as const, dados: dados.data };
}

export async function acaoCriarLog(_estado: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireUser();
  const leitura = await lerDados(fd);
  if (!leitura.ok) return ERRO(leitura.erros);
  const d = leitura.dados;
  await db.insert(engineeringLogs).values({
    problema: d.problema,
    hipotese: d.hipotese || null,
    solucao: d.solucao || null,
    experimento: d.experimento || null,
    materiais: d.materiais || null,
    resultado: d.resultado || null,
    aprendizados: d.aprendizados || null,
    proximasAcoes: d.proximasAcoes || null,
    taskId: d.taskId,
    robotVersionId: d.robotVersionId,
    autorId: user.id,
    data: d.data,
  });
  await auditor("criar_engenharia", { usuarioId: user.id, detalhe: d.problema.slice(0, 60), ip: await ipResumido() });
  revalidatePath("/painel/engenharia");
  return OK("Registro de engenharia criado.");
}

export async function acaoSalvarLog(_estado: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireUser();
  const id = numeroOuUndefined(fd.get("id"));
  if (!id) return ERRO({ id: "Registro inválido." });
  const leitura = await lerDados(fd);
  if (!leitura.ok) return ERRO(leitura.erros);
  const d = leitura.dados;
  await db
    .update(engineeringLogs)
    .set({
      problema: d.problema,
      hipotese: d.hipotese || null,
      solucao: d.solucao || null,
      experimento: d.experimento || null,
      materiais: d.materiais || null,
      resultado: d.resultado || null,
      aprendizados: d.aprendizados || null,
      proximasAcoes: d.proximasAcoes || null,
      taskId: d.taskId,
      robotVersionId: d.robotVersionId,
      data: d.data,
    })
    .where(eq(engineeringLogs.id, id));
  await auditor("atualizar_engenharia", { usuarioId: user.id, detalhe: `log:${id}`, ip: await ipResumido() });
  revalidatePath("/painel/engenharia");
  revalidatePath(`/painel/engenharia/${id}`);
  return OK("Registro atualizado.");
}

export async function acaoExcluirLog(fd: FormData): Promise<void> {
  const user = await requireUser();
  const id = numeroOuUndefined(fd.get("id"));
  if (id && podeExcluirRegistro(user.papel)) {
    await db.delete(engineeringLogs).where(eq(engineeringLogs.id, id));
    await auditor("excluir_engenharia", { usuarioId: user.id, detalhe: `log:${id}`, ip: await ipResumido() });
  }
  revalidatePath("/painel/engenharia");
}
