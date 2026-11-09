import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { auditLogs, sessions, users } from "@/db/schema";
import type { Papel } from "@/db/schema";
import { ensureDynamic } from "@/lib/dynamic-render";

export { PAPEIS } from "@/db/schema";
export type Usuario = {
  id: number;
  nome: string;
  email: string;
  papel: Papel;
  ativo: number;
  convitePendente: number;
};

export const SESSION_COOKIE = "wp_session";
const TTL_SESSAO_S = 7 * 24 * 60 * 60; // 7 dias

// ---------- Senha (node:crypto scrypt) ----------
const KEYLEN = 64;

export function hashSenha(senha: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(senha, salt, KEYLEN);
  return `hashgrip:${salt.toString("hex")}:${hash.toString("hex")}`;
}

export function verificarSenha(senha: string, armazenada: string): boolean {
  try {
    const [tipo, saltHex, hashHex] = armazenada.split(":");
    if (tipo !== "hashgrip" || !saltHex || !hashHex) return false;
    const salt = Buffer.from(saltHex, "hex");
    const esperado = Buffer.from(hashHex, "hex");
    const atual = scryptSync(senha, salt, esperado.length);
    return timingSafeEqual(esperado, atual);
  } catch {
    return false;
  }
}

// ---------- Segredo de sessão (HMAC) ----------
function segredoSessao(): string {
  const doEnv = process.env.WP_SESSION_SECRET?.trim();
  if (doEnv) return doEnv;
  // Fallback DEV: arquivo em data/ (gitignored). Em produção defina WP_SESSION_SECRET.
  const arquivo = path.join(process.cwd(), "data", ".session-secret");
  try {
    const salvo = fs.readFileSync(arquivo, "utf8").trim();
    if (salvo) return salvo;
  } catch {
    /* inexistente */
  }
  const novo = randomBytes(32).toString("hex");
  fs.mkdirSync(path.dirname(arquivo), { recursive: true });
  fs.writeFileSync(arquivo, novo + "\n");
  return novo;
}

function assinar(token: string): string {
  return token + "." + createHmac("sha256", segredoSessao()).update(token).digest("hex");
}

function compararMac(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
// ---------- Sessão ----------
export async function createSession(userId: number): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const expiraEm = new Date(Date.now() + TTL_SESSAO_S * 1000);
  await db.insert(sessions).values({ token, userId, expiraEm });
  const jar = await cookies(); // Next 16: cookies() é async
  jar.set(SESSION_COOKIE, assinar(token), {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // LOCAL: sem HTTPS. Em produção (HTTPS) troque para `true`.
    path: "/",
    expires: expiraEm,
  });
}

export async function getUsuarioSessao(): Promise<Usuario | null> {
  await ensureDynamic();
  const jar = await cookies();
  const bruto = jar.get(SESSION_COOKIE)?.value;
  if (!bruto) return null;
  const ponto = bruto.lastIndexOf(".");
  if (ponto <= 0) return null;
  const token = bruto.slice(0, ponto);
  const mac = bruto.slice(ponto + 1);
  if (!compararMac(mac, createHmac("sha256", segredoSessao()).update(token).digest("hex"))) return null;

  const linhas = await db
    .select({
      id: users.id,
      nome: users.nome,
      email: users.email,
      papel: users.papel,
      ativo: users.ativo,
      convitePendente: users.convitePendente,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.token, token), gt(sessions.expiraEm, new Date())))
    .limit(1);

  const linha = linhas[0];
  if (!linha || linha.ativo !== 1) return null;
  return {
    id: linha.id,
    nome: linha.nome,
    email: linha.email,
    papel: linha.papel as Papel,
    ativo: linha.ativo,
    convitePendente: linha.convitePendente,
  };
}

export async function logout(): Promise<void> {
  const jar = await cookies();
  const bruto = jar.get(SESSION_COOKIE)?.value;
  if (bruto) {
    const token = bruto.slice(0, bruto.lastIndexOf("."));
    try {
      await db.delete(sessions).where(eq(sessions.token, token));
    } catch {
      /* sessão já removida */
    }
  }
  jar.delete(SESSION_COOKIE);
}

// ---------- Guards ----------
export async function requireUser(
  papeis?: readonly Papel[],
  opcoes?: { permitirConvitePendente?: boolean },
): Promise<Usuario> {
  await ensureDynamic();
  const usuario = await getUsuarioSessao();
  if (!usuario) redirect("/painel/login");
  if (!opcoes?.permitirConvitePendente && usuario.convitePendente === 1) redirect("/painel/trocar-senha");
  if (papeis && papeis.length > 0 && !papeis.includes(usuario.papel)) redirect("/painel?erro=permissao");
  return usuario;
}

export async function ipResumido(): Promise<string | null> {
  try {
    const h = await headers(); // async no Next 16
    const bruto = h.get("x-forwarded-for") ?? h.get("x-real-ip") ?? "local";
    // mantém só o primeiro segmento (anonimização leve; sem dados sensíveis extras)
    return bruto.split(",")[0]?.trim().slice(0, 64) ?? null;
  } catch {
    return null;
  }
}

// ---------- Auditoria ----------
export async function auditor(
  acao: string,
  opcoes?: { usuarioId?: number | null; detalhe?: string | null; ip?: string | null },
): Promise<void> {
  try {
    await db.insert(auditLogs).values({
      acao,
      detalheResumido: opcoes?.detalhe ?? null,
      usuarioId: opcoes?.usuarioId ?? null,
      ip: opcoes?.ip ?? null,
    });
  } catch (erro) {
    console.warn("[audit] falha ao registrar:", acao, (erro as Error)?.message);
  }
}

// ---------- ACL (papel -> recurso) ----------
// admin: tudo.
// lider: tudo exceto gestão de usuários e exclusão de documentos.
// integrante: leitura geral (não financeiro); escrita em tarefas/eventos/presença/engenharia/robô/inventário; leitura de documentos.
export function isAdmin(papel: Papel): boolean {
  return papel === "admin";
}
export function podeGerenciarUsuarios(papel: Papel): boolean {
  return papel === "admin";
}
export function podeVerFinanceiro(papel: Papel): boolean {
  return papel === "admin" || papel === "lider";
}
export function podePublicarConteudo(papel: Papel): boolean {
  return papel === "admin";
}
export function podeExcluirDocumento(papel: Papel): boolean {
  return papel === "admin";
}
export function podeExcluirRegistro(papel: Papel): boolean {
  // lider pode apagar registros operacionais; integrante não
  return papel === "admin" || papel === "lider";
}
