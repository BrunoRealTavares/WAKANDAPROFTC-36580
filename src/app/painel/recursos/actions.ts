"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { TIPOS_FINANCEIRO, documents, financialEntries } from "@/db/schema";
import { requireUser, auditor, ipResumido, isAdmin } from "@/lib/auth";
import { ERRO, OK, errosZod, numeroOuUndefined, dataISOOuUndefined, textoOuUndefined, type ActionState } from "@/lib/action-state";
function campo(fd: FormData, nome: string): string {
  const v = fd.get(nome);
  return typeof v === "string" ? v.trim() : "";
}

const esquema = z.object({
  tipo: z.enum(TIPOS_FINANCEIRO),
  categoria: z.string().trim().min(1).default("geral"),
  valor: z.number("Informe o valor").positive("Valor deve ser positivo"),
  data: z.date("Informe a data"),
  descricao: z.string().trim().optional(),
  comprovanteDocId: z.number().int().positive().nullable(),
});

export async function acaoCriarLancamento(_estado: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireUser(["admin", "lider"]);
  const dados = esquema.safeParse({
    tipo: campo(fd, "tipo") || "entrada",
    categoria: campo(fd, "categoria") || "geral",
    valor: numeroOuUndefined(fd.get("valor")) ?? 0,
    data: dataISOOuUndefined(fd.get("data")),
    descricao: textoOuUndefined(fd.get("descricao")),
    comprovanteDocId: numeroOuUndefined(fd.get("comprovanteDocId")) ?? null,
  });
  if (!dados.success) return ERRO(errosZod(dados.error));
  const d = dados.data;
  const docId = d.comprovanteDocId
    ? ((await db.select({ id: documents.id }).from(documents).where(eq(documents.id, d.comprovanteDocId)).limit(1))[0]?.id ?? null)
    : null;

  await db.insert(financialEntries).values({
    tipo: d.tipo,
    categoria: d.categoria,
    valorEmCentavos: Math.round(d.valor * 100),
    data: d.data,
    descricao: d.descricao || null,
    comprovanteDocId: docId,
    aprovado: isAdmin(user.papel) ? 1 : 0, // admin cria aprovado; lider cria pendente
    criadoPorId: user.id,
  });
  await auditor("criar_financeiro", { usuarioId: user.id, detalhe: `${d.tipo} ${d.valor}`, ip: await ipResumido() });
  revalidatePath("/painel/recursos");
  return OK("Lançamento registrado." + (isAdmin(user.papel) ? "" : " Pendente de aprovação."));
}

export async function acaoAprovarLancamento(_estado: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireUser(["admin", "lider"]);
  const id = numeroOuUndefined(fd.get("id"));
  if (!id) return ERRO({ id: "Lançamento inválido." });
  if (!isAdmin(user.papel)) return ERRO({}, "Apenas administração aprova lançamentos.");
  await db.update(financialEntries).set({ aprovado: 1 }).where(eq(financialEntries.id, id));
  await auditor("aprovar_financeiro", { usuarioId: user.id, detalhe: `lancamento:${id}`, ip: await ipResumido() });
  revalidatePath("/painel/recursos");
  return OK("Lançamento aprovado.");
}

export async function acaoExcluirLancamento(fd: FormData): Promise<void> {
  const user = await requireUser(["admin", "lider"]);
  const id = numeroOuUndefined(fd.get("id"));
  if (id && isAdmin(user.papel)) {
    await db.delete(financialEntries).where(eq(financialEntries.id, id));
    await auditor("excluir_financeiro", { usuarioId: user.id, detalhe: `lancamento:${id}`, ip: await ipResumido() });
  }
  revalidatePath("/painel/recursos");
}
