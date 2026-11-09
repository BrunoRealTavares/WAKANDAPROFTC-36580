"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, verificarSenha, auditor, ipResumido } from "@/lib/auth";
import { ERRO, errosZod, type ActionState } from "@/lib/action-state";

const esquema = z.object({
  email: z.string().trim().toLowerCase().email("E-mail inválido"),
  senha: z.string().min(1, "Informe a senha"),
});

function campo(fd: FormData, nome: string): string {
  const v = fd.get(nome);
  return typeof v === "string" ? v : "";
}

export async function acaoLogin(_estado: ActionState, fd: FormData): Promise<ActionState> {
  const dados = esquema.safeParse({ email: campo(fd, "email"), senha: campo(fd, "senha") });
  if (!dados.success) return ERRO(errosZod(dados.error), "Verifique os campos.");

  const linhas = await db.select().from(users).where(eq(users.email, dados.data.email)).limit(1);
  const usuario = linhas[0];
  // Mensagem genérica (não revela existência do e-mail)
  if (!usuario || !verificarSenha(dados.data.senha, usuario.senhaHash)) {
    await auditor("login_falhou", { detalhe: dados.data.email, ip: await ipResumido() });
    return ERRO({ senha: "E-mail ou senha incorretos." }, "Não foi possível entrar.");
  }
  if (usuario.ativo !== 1) {
    return ERRO({}, "Conta desativada. Fale com a administração da equipe.");
  }

  await db.update(users).set({ ultimoLogin: new Date() }).where(eq(users.id, usuario.id));
  await createSession(usuario.id);
  await auditor("login", { usuarioId: usuario.id, ip: await ipResumido() });

  redirect(usuario.convitePendente === 1 ? "/painel/trocar-senha" : "/painel");
}

/** Sem SMTP: apenas registra a solicitação para a administração (audit log). */
export async function acaoSolicitarRecuperacao(_estado: ActionState, fd: FormData): Promise<ActionState> {
  const email = campo(fd, "email").trim().toLowerCase();
  if (!email.includes("@")) return ERRO({ email: "Informe um e-mail válido." });
  await auditor("recuperacao_solicitada", { detalhe: email, ip: await ipResumido() });
  return {
    ok: true,
    mensagem: "Recuperação de senha solicitada ao(s) administrador(es) da equipe. A administração deve gerar uma senha temporária (flag convitePendente) e entregar a você em pessoa.",
  };
}
