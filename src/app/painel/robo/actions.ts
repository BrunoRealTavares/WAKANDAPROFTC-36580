"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { TIPOS_ROBO, robotTests, robotVersions } from "@/db/schema";
import { requireUser, auditor, ipResumido, podeExcluirRegistro } from "@/lib/auth";
import { ERRO, OK, errosZod, numeroOuUndefined, textoOuUndefined, type ActionState } from "@/lib/action-state";

function campo(fd: FormData, nome: string): string {
  const v = fd.get(nome);
  return typeof v === "string" ? v.trim() : "";
}

const esquemaVersao = z.object({
  nome: z.string().trim().min(2, "Mínimo de 2 caracteres"),
  tipo: z.enum(TIPOS_ROBO),
  notas: z.string().trim().optional(),
  alteracoes: z.string().trim().optional(),
});

export async function acaoCriarVersao(_estado: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireUser();
  const dados = esquemaVersao.safeParse({
    nome: campo(fd, "nome"),
    tipo: campo(fd, "tipo") || "mecanica",
    notas: textoOuUndefined(fd.get("notas")),
    alteracoes: textoOuUndefined(fd.get("alteracoes")),
  });
  if (!dados.success) return ERRO(errosZod(dados.error));
  const d = dados.data;
  await db.insert(robotVersions).values({
    nome: d.nome,
    tipo: d.tipo,
    notas: d.notas || null,
    alteracoes: d.alteracoes || null,
    registradoPorId: user.id,
  });
  await auditor("criar_versao_robo", { usuarioId: user.id, detalhe: d.nome, ip: await ipResumido() });
  revalidatePath("/painel/robo");
  return OK("Versão registrada.");
}

const esquemaTeste = z.object({
  versionId: z.number().int().positive("Escolha a versão testada"),
  objetivo: z.string().trim().min(3, "Descreva o objetivo"),
  procedimento: z.string().trim().optional(),
  resultado: z.string().trim().optional(),
  problemas: z.string().trim().optional(),
});

export async function acaoCriarTeste(_estado: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireUser();
  const dados = esquemaTeste.safeParse({
    versionId: numeroOuUndefined(fd.get("versionId")) ?? 0,
    objetivo: campo(fd, "objetivo"),
    procedimento: textoOuUndefined(fd.get("procedimento")),
    resultado: textoOuUndefined(fd.get("resultado")),
    problemas: textoOuUndefined(fd.get("problemas")),
  });
  if (!dados.success) return ERRO(errosZod(dados.error));
  const d = dados.data;
  const versao = (await db.select({ id: robotVersions.id }).from(robotVersions).where(eq(robotVersions.id, d.versionId)).limit(1))[0];
  if (!versao) return ERRO({ versionId: "Versão não encontrada." });
  await db.insert(robotTests).values({
    versionId: d.versionId,
    objetivo: d.objetivo,
    procedimento: d.procedimento || null,
    resultado: d.resultado || null,
    problemas: d.problemas || null,
  });
  await auditor("criar_teste_robo", { usuarioId: user.id, detalhe: `versao:${d.versionId}`, ip: await ipResumido() });
  revalidatePath("/painel/robo");
  return OK("Teste registrado.");
}

export async function acaoExcluirVersao(fd: FormData): Promise<void> {
  const user = await requireUser();
  const id = numeroOuUndefined(fd.get("id"));
  if (id && podeExcluirRegistro(user.papel)) {
    await db.delete(robotVersions).where(eq(robotVersions.id, id));
    await auditor("excluir_versao_robo", { usuarioId: user.id, detalhe: `versao:${id}`, ip: await ipResumido() });
  }
  revalidatePath("/painel/robo");
}
