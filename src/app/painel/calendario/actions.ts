"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { TIPOS_EVENTO, events } from "@/db/schema";
import { requireUser, auditor, ipResumido, podeExcluirRegistro } from "@/lib/auth";
import { ERRO, OK, errosZod, numeroOuUndefined, dataOuUndefined, dataISOOuUndefined, type ActionState } from "@/lib/action-state";

const esquema = z.object({
  titulo: z.string().trim().min(2, "Mínimo de 2 caracteres"),
  tipo: z.enum(TIPOS_EVENTO),
  inicio: z.date("Informe data e hora"),
  local: z.string().trim().optional(),
  notas: z.string().trim().optional(),
});

function campo(fd: FormData, nome: string): string {
  const v = fd.get(nome);
  return typeof v === "string" ? v.trim() : "";
}

export async function acaoCriarEvento(_estado: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireUser();
  const dados = esquema.safeParse({
    titulo: campo(fd, "titulo"),
    tipo: campo(fd, "tipo") || "reuniao",
    inicio: dataOuUndefined(fd.get("inicio")),
    local: campo(fd, "local"),
    notas: campo(fd, "notas"),
  });
  if (!dados.success) return ERRO(errosZod(dados.error));
  const d = dados.data;
  await db.insert(events).values({
    titulo: d.titulo,
    tipo: d.tipo,
    inicio: d.inicio,
    local: d.local || null,
    notas: d.notas || null,
    criadoPorId: user.id,
  });
  await auditor("criar_evento", { usuarioId: user.id, detalhe: d.titulo, ip: await ipResumido() });
  revalidatePath("/painel/calendario");
  revalidatePath("/painel");
  return OK("Evento criado.");
}

export async function acaoSalvarEvento(_estado: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireUser();
  const id = numeroOuUndefined(fd.get("id"));
  if (!id) return ERRO({ id: "Evento inválido." });
  const dados = esquema.safeParse({
    titulo: campo(fd, "titulo"),
    tipo: campo(fd, "tipo") || "reuniao",
    inicio: dataOuUndefined(fd.get("inicio")),
    local: campo(fd, "local"),
    notas: campo(fd, "notas"),
  });
  if (!dados.success) return ERRO(errosZod(dados.error));
  const d = dados.data;
  const anterior = (await db.select().from(events).where(eq(events.id, id)).limit(1))[0];
  if (!anterior) return ERRO({ id: "Evento não encontrado." });
  await db
    .update(events)
    .set({ titulo: d.titulo, tipo: d.tipo, inicio: d.inicio, local: d.local || null, notas: d.notas || null })
    .where(eq(events.id, id));
  await auditor("atualizar_evento", { usuarioId: user.id, detalhe: `evento:${id}`, ip: await ipResumido() });
  revalidatePath("/painel/calendario");
  revalidatePath("/painel");
  return OK("Evento atualizado.");
}

export async function acaoExcluirEvento(fd: FormData): Promise<void> {
  const user = await requireUser();
  const id = numeroOuUndefined(fd.get("id"));
  if (id && podeExcluirRegistro(user.papel)) {
    await db.delete(events).where(eq(events.id, id));
    await auditor("excluir_evento", { usuarioId: user.id, detalhe: `evento:${id}`, ip: await ipResumido() });
  }
  revalidatePath("/painel/calendario");
  revalidatePath("/painel");
}
