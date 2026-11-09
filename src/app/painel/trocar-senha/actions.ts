"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getUsuarioSessao, hashSenha, verificarSenha, auditor, ipResumido } from "@/lib/auth";
import { ERRO, OK, errosZod, type ActionState } from "@/lib/action-state";

const esquema = z
  .object({
    atual: z.string().min(1, "Informe a senha atual"),
    nova: z.string().min(8, "Mínimo de 8 caracteres"),
    repetida: z.string().min(1, "Repita a nova senha"),
  })
  .refine((d) => d.nova === d.repetida, { message: "As senhas não conferem", path: ["repetida"] });

function campo(fd: FormData, nome: string): string {
  const v = fd.get(nome);
  return typeof v === "string" ? v : "";
}

export async function acaoTrocarSenha(_estado: ActionState, fd: FormData): Promise<ActionState> {
  const usuario = await getUsuarioSessao();
  if (!usuario) redirect("/painel/login");

  const dados = esquema.safeParse({
    atual: campo(fd, "atual"),
    nova: campo(fd, "nova"),
    repetida: campo(fd, "repetida"),
  });
  if (!dados.success) return ERRO(errosZod(dados.error));

  const linhas = await db.select().from(users).where(eq(users.id, usuario.id)).limit(1);
  const registro = linhas[0];
  if (!registro || !verificarSenha(dados.data.atual, registro.senhaHash)) {
    return ERRO({ atual: "Senha atual incorreta." });
  }

  await db
    .update(users)
    .set({ senhaHash: hashSenha(dados.data.nova), convitePendente: 0, updatedAt: new Date() })
    .where(eq(users.id, usuario.id));
  await auditor("atualizar_usuario", { usuarioId: usuario.id, detalhe: "troca de senha (primeiro acesso ou própria)", ip: await ipResumido() });
  redirect("/painel");
}
