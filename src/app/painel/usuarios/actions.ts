"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { PAPEIS, users } from "@/db/schema";
import { requireUser, auditor, hashSenha, ipResumido } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ERRO, OK, errosZod, numeroOuUndefined, type ActionState } from "@/lib/action-state";
function aleatoria(): string {
  // senha temporária legível por telefone (sem 0/O, 1/l)
  const alfabeto = "abcdefghjkmnpqrstuvwxyz23456789";
  let s = "";
  for (let i = 0; i < 10; i++) s += alfabeto[Math.floor(Math.random() * alfabeto.length)];
  return s + "-A";
}
function campo(fd: FormData, nome: string): string {
  const v = fd.get(nome);
  return typeof v === "string" ? v.trim() : "";
}

const esquemaCriar = z.object({
  nome: z.string().trim().min(2, "Mínimo de 2 caracteres"),
  email: z.string().trim().toLowerCase().email("E-mail inválido"),
  papel: z.enum(PAPEIS),
});

export async function acaoCriarUsuario(_estado: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireUser(["admin"]);
  const dados = esquemaCriar.safeParse({ nome: campo(fd, "nome"), email: campo(fd, "email"), papel: campo(fd, "papel") || "integrante" });
  if (!dados.success) return ERRO(errosZod(dados.error));
  const d = dados.data;
  const senhaTemp = aleatoria();

  try {
    await db.insert(users).values({
      nome: d.nome,
      email: d.email,
      senhaHash: hashSenha(senhaTemp),
      papel: d.papel,
      ativo: 1,
      convitePendente: 1, // força troca de senha no primeiro login (/painel/trocar-senha)
    });
  } catch (e) {
    const msg = String((e as Error).message ?? e);
    if (/UNIQUE/i.test(msg)) return ERRO({ nome: "Nome ou e-mail já existe." });
    return ERRO({}, "Falha ao criar usuário.");
  }  await auditor("criar_usuario", { usuarioId: user.id, detalhe: `${d.papel} ${d.email}`, ip: await ipResumido() });
  revalidatePath("/painel/usuarios");
  return OK(`Usuário ${d.nome} (${d.papel}) criado. `, { segredo: senhaTemp });
}

export async function acaoDesativarUsuario(_estado: ActionState, fd: FormData): Promise<ActionState> {
  const admin = await requireUser(["admin"]);
  const id = numeroOuUndefined(fd.get("id"));
  if (!id) return ERRO({ id: "Usuário inválido." });
  if (id === admin.id) return ERRO({}, "Você não pode desativar a própria conta (evita perder acesso de admin).");
  const alvo = (await db.select().from(users).where(eq(users.id, id)).limit(1))[0];
  if (!alvo) return ERRO({ id: "Usuário não encontrado." });
  await db.update(users).set({ ativo: alvo.ativo === 1 ? 0 : 1 }).where(eq(users.id, id));
  await auditor("atualizar_usuario", { usuarioId: admin.id, detalhe: `${alvo.ativo === 1 ? "desativou" : "reativou"} ${alvo.email}`, ip: await ipResumido() });
  revalidatePath("/painel/usuarios");
  return OK(alvo.ativo === 1 ? "Usuário desativado." : "Usuário reativado.");
}

export async function acaoResetarSenha(_estado: ActionState, fd: FormData): Promise<ActionState> {
  const admin = await requireUser(["admin"]);
  const id = numeroOuUndefined(fd.get("id"));
  if (!id) return ERRO({ id: "Usuário inválido." });
  const senhaTemp = aleatoria();
  await db.update(users).set({ senhaHash: hashSenha(senhaTemp), convitePendente: 1 }).where(eq(users.id, id));
  await auditor("reset_senha_usuario", { usuarioId: admin.id, detalhe: `user:${id}`, ip: await ipResumido() });
  revalidatePath("/painel/usuarios");
  return OK("Senha resetada — entregue pessoalmente.", { segredo: senhaTemp });
}

// Acoes one-shot para <form action={fn}> (sem useActionState).
export async function acaoDesativarUsuarioForm(fd: FormData): Promise<void> {
  await acaoDesativarUsuario(null, fd);
}

export async function acaoResetarSenhaForm(fd: FormData): Promise<void> {
  await acaoResetarSenha(null, fd);
}
