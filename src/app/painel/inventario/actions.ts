"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { TIPOS_MOVIMENTO, inventoryItems, inventoryMovements } from "@/db/schema";
import { requireUser, auditor, ipResumido } from "@/lib/auth";
import { ERRO, OK, errosZod, numeroOuUndefined, textoOuUndefined, type ActionState } from "@/lib/action-state";

function campo(fd: FormData, nome: string): string {
  const v = fd.get(nome);
  return typeof v === "string" ? v.trim() : "";
}

const esquemaItem = z.object({
  nome: z.string().trim().min(2, "Mínimo de 2 caracteres"),
  categoria: z.string().trim().min(1).default("geral"),
  quantidade: z.number().int().min(0),
  minimo: z.number().int().min(0),
  localizacao: z.string().trim().optional(),
  estado: z.string().trim().min(1).default("bom"),
  observacoes: z.string().trim().optional(),
});

export async function acaoCriarItem(_estado: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireUser();
  const dados = esquemaItem.safeParse({
    nome: campo(fd, "nome"),
    categoria: campo(fd, "categoria") || "geral",
    quantidade: numeroOuUndefined(fd.get("quantidade")) ?? 0,
    minimo: numeroOuUndefined(fd.get("minimo")) ?? 0,
    localizacao: textoOuUndefined(fd.get("localizacao")),
    estado: campo(fd, "estado") || "bom",
    observacoes: textoOuUndefined(fd.get("observacoes")),
  });
  if (!dados.success) return ERRO(errosZod(dados.error));
  const d = dados.data;
  await db.insert(inventoryItems).values({ nome: d.nome, categoria: d.categoria, quantidade: d.quantidade, minimo: d.minimo, localizacao: d.localizacao || null, estado: d.estado, observacoes: d.observacoes || null });
  await auditor("criar_item_inventario", { usuarioId: user.id, detalhe: d.nome, ip: await ipResumido() });
  revalidatePath("/painel/inventario");
  return OK("Item criado.");
}


const esquemaMov = z.object({
  itemId: z.number().int().positive("Escolha o item"),
  tipo: z.enum(TIPOS_MOVIMENTO),
  quantidade: z.number().int().min(0),
  motivo: z.string().trim().optional(),
});

export async function acaoSalvarItem(_estado: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireUser();
  const id = numeroOuUndefined(fd.get("id"));
  if (!id) return ERRO({ id: "Item inválido." });
  const dados = esquemaItem.safeParse({
    nome: campo(fd, "nome"),
    categoria: campo(fd, "categoria") || "geral",
    quantidade: numeroOuUndefined(fd.get("quantidade")) ?? 0,
    minimo: numeroOuUndefined(fd.get("minimo")) ?? 0,
    localizacao: textoOuUndefined(fd.get("localizacao")),
    estado: campo(fd, "estado") || "bom",
    observacoes: textoOuUndefined(fd.get("observacoes")),
  });
  if (!dados.success) return ERRO(errosZod(dados.error));
  const d = dados.data;
  const anterior = (await db.select().from(inventoryItems).where(eq(inventoryItems.id, id)).limit(1))[0];
  if (!anterior) return ERRO({ id: "Item não encontrado." });
  await db
    .update(inventoryItems)
    .set({ nome: d.nome, categoria: d.categoria, quantidade: d.quantidade, minimo: d.minimo, localizacao: d.localizacao || null, estado: d.estado, observacoes: d.observacoes || null })
    .where(eq(inventoryItems.id, id));
  await auditor("atualizar_item_inventario", { usuarioId: user.id, detalhe: `item:${id}`, ip: await ipResumido() });
  revalidatePath("/painel/inventario");
  return OK("Item atualizado.");
}

export async function acaoRegistrarMovimentacao(_estado: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireUser();
  const dados = esquemaMov.safeParse({
    itemId: numeroOuUndefined(fd.get("itemId")) ?? 0,
    tipo: campo(fd, "tipo") || "entrada",
    quantidade: numeroOuUndefined(fd.get("quantidade")) ?? 0,
    motivo: textoOuUndefined(fd.get("motivo")),
  });
  if (!dados.success) return ERRO(errosZod(dados.error));
  const d = dados.data;
  const item = (await db.select().from(inventoryItems).where(eq(inventoryItems.id, d.itemId)).limit(1))[0];
  if (!item) return ERRO({ itemId: "Item não encontrado." });

  // ajuste: diferencia para o novo total; entrada soma; saída subtrai (não deixa negativo)
  let novoTotal: number;
  if (d.tipo === "entrada") novoTotal = item.quantidade + d.quantidade;
  else if (d.tipo === "saida") {
    novoTotal = item.quantidade - d.quantidade;
    if (novoTotal < 0) return ERRO({ quantidade: "Saída maior que o estoque atual." });
  } else novoTotal = d.quantidade;

  await db.insert(inventoryMovements).values({ itemId: d.itemId, tipo: d.tipo, quantidade: d.quantidade, motivo: d.motivo || null, usuarioId: user.id });
  await db.update(inventoryItems).set({ quantidade: novoTotal }).where(eq(inventoryItems.id, d.itemId));
  await auditor("movimentacao_inventario", { usuarioId: user.id, detalhe: `${d.tipo} item:${d.itemId} q:${d.quantidade}`, ip: await ipResumido() });
  revalidatePath("/painel/inventario");
  return OK(`Movimentação registrada. Novo total: ${novoTotal}.`);
}
