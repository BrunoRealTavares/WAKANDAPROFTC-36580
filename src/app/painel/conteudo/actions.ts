"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { CATEGORIAS_GALERIA, STATUS_PUBLICACAO, galleryAssets, partners, posts, siteSettings, teamMembers, timelineEvents } from "@/db/schema";
import { requireUser, auditor, ipResumido, isAdmin, podePublicarConteudo } from "@/lib/auth";
import { ERRO, OK, errosZod, numeroOuUndefined, type ActionState } from "@/lib/action-state";

function str(fd: FormData, nome: string): string | undefined {
  const v = fd.get(nome);
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t === "" ? undefined : t;
}
function inteiro(fd: FormData, nome: string): number | undefined {
  return numeroOuUndefined(fd.get(nome));
}

function slugDe(titulo: string): string {
  return titulo
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90) || "post";
}
// ---------------- posts ----------------
const esquemaPost = z.object({
  titulo: z.string().trim().min(2, "Mínimo de 2 caracteres"),
  categoria: z.string().trim().min(1).default("geral"),
  autor: z.string().trim().min(1, "Informe o autor"),
  resumo: z.string().trim().optional(),
  conteudo: z.string().trim().optional(),
  imagemUrl: z.string().trim().url("URL inválida").optional().or(z.literal("")),
});

export async function acaoCriarPost(_estado: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireUser(["admin", "lider"]);
  const dados = esquemaPost.safeParse({ titulo: str(fd, "titulo") ?? "", categoria: str(fd, "categoria") ?? "geral", autor: str(fd, "autor") ?? "", resumo: str(fd, "resumo"), conteudo: str(fd, "conteudo"), imagemUrl: str(fd, "imagemUrl") });
  if (!dados.success) return ERRO(errosZod(dados.error));
  const d = dados.data;
  await db.insert(posts).values({ slug: slugDe(d.titulo), titulo: d.titulo, categoria: d.categoria, autor: d.autor, resumo: d.resumo ?? null, conteudo: d.conteudo ?? null, imagemUrl: d.imagemUrl || null, status: "rascunho" });
  await auditor("criar_post", { usuarioId: user.id, detalhe: d.titulo, ip: await ipResumido() });
  revalidatePath("/painel/conteudo");
  return OK("Post criado como rascunho.");
}

export async function acaoSalvarPost(_estado: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireUser(["admin", "lider"]);
  const id = inteiro(fd, "id");
  if (!id) return ERRO({ id: "Post inválido." });
  const dados = esquemaPost.safeParse({ titulo: str(fd, "titulo") ?? "", categoria: str(fd, "categoria") ?? "geral", autor: str(fd, "autor") ?? "", resumo: str(fd, "resumo"), conteudo: str(fd, "conteudo"), imagemUrl: str(fd, "imagemUrl") });
  if (!dados.success) return ERRO(errosZod(dados.error));
  const d = dados.data;
  await db.update(posts).set({ titulo: d.titulo, categoria: d.categoria, autor: d.autor, resumo: d.resumo ?? null, conteudo: d.conteudo ?? null, imagemUrl: d.imagemUrl || null }).where(eq(posts.id, id));
  await auditor("atualizar_post", { usuarioId: user.id, detalhe: `post:${id}`, ip: await ipResumido() });
  revalidatePath("/painel/conteudo");
  return OK("Post salvo.");
}

/** Publicação exige admin. */
export async function acaoPublicar(fd: FormData): Promise<void> {
  const user = await requireUser(["admin", "lider"]);
  const secao = str(fd, "secao") ?? "";
  const id = inteiro(fd, "id");
  if (!id || !podePublicarConteudo(user.papel)) return;
  const publicadoEm = new Date();
  if (secao === "posts") await db.update(posts).set({ status: "publicado", publicadoEm }).where(eq(posts.id, id));
  else if (secao === "galeria") await db.update(galleryAssets).set({ status: "publicado", publicadoEm }).where(eq(galleryAssets.id, id));
  else if (secao === "membros") await db.update(teamMembers).set({ status: "publicado" }).where(eq(teamMembers.id, id));
  else if (secao === "parceiros") await db.update(partners).set({ status: "publicado", publicadoEm }).where(eq(partners.id, id));
  else if (secao === "timeline") await db.update(timelineEvents).set({ status: "publicado", publicadoEm }).where(eq(timelineEvents.id, id));
  await auditor("publicar_post", { usuarioId: user.id, detalhe: `${secao}:${id}`, ip: await ipResumido() });
  revalidatePath("/painel/conteudo");
}

export async function acaoArquivar(fd: FormData): Promise<void> {
  const user = await requireUser(["admin", "lider"]);
  const secao = str(fd, "secao") ?? "";
  const id = inteiro(fd, "id");
  if (!id) return;
  if (secao === "posts") await db.update(posts).set({ status: "arquivado" }).where(eq(posts.id, id));
  else if (secao === "galeria") await db.update(galleryAssets).set({ status: "arquivado" }).where(eq(galleryAssets.id, id));
  else if (secao === "membros") await db.update(teamMembers).set({ status: "arquivado" }).where(eq(teamMembers.id, id));
  else if (secao === "parceiros") await db.update(partners).set({ status: "arquivado" }).where(eq(partners.id, id));
  else if (secao === "timeline") await db.update(timelineEvents).set({ status: "arquivado" }).where(eq(timelineEvents.id, id));
  await auditor("arquivar_conteudo", { usuarioId: user.id, detalhe: `${secao}:${id}`, ip: await ipResumido() });
  revalidatePath("/painel/conteudo");
}
// ---------------- galeria ----------------
const esquemaGaleria = z.object({
  titulo: z.string().trim().min(2, "Mínimo de 2 caracteres"),
  categoria: z.enum(CATEGORIAS_GALERIA),
  url: z.string().trim().min(1, "Informe a URL da imagem"),
  descricao: z.string().trim().optional(),
});

export async function acaoCriarAsset(_estado: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireUser(["admin", "lider"]);
  const dados = esquemaGaleria.safeParse({ titulo: str(fd, "titulo") ?? "", categoria: str(fd, "categoria") ?? "equipe", url: str(fd, "url") ?? "", descricao: str(fd, "descricao") });
  if (!dados.success) return ERRO(errosZod(dados.error));
  const d = dados.data;
  await db.insert(galleryAssets).values({ titulo: d.titulo, categoria: d.categoria, url: d.url, descricao: d.descricao ?? null, status: "rascunho" });
  await auditor("criar_galeria", { usuarioId: user.id, detalhe: d.titulo, ip: await ipResumido() });
  revalidatePath("/painel/conteudo");
  return OK("Média criada como rascunho.");
}

export async function acaoSalvarAsset(_estado: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser(["admin", "lider"]);
  const id = inteiro(fd, "id");
  if (!id) return ERRO({ id: "Item inválido." });
  const dados = esquemaGaleria.safeParse({ titulo: str(fd, "titulo") ?? "", categoria: str(fd, "categoria") ?? "equipe", url: str(fd, "url") ?? "", descricao: str(fd, "descricao") });
  if (!dados.success) return ERRO(errosZod(dados.error));
  const d = dados.data;
  await db.update(galleryAssets).set({ titulo: d.titulo, categoria: d.categoria, url: d.url, descricao: d.descricao ?? null }).where(eq(galleryAssets.id, id));
  revalidatePath("/painel/conteudo");
  return OK("Média salva.");
}

// ---------------- membros ----------------
const esquemaMembro = z.object({
  nome: z.string().trim().min(2, "Mínimo de 2 caracteres"),
  funcao: z.string().trim().min(1, "Informe a função"),
  area: z.string().trim().min(1, "Informe a área"),
  bio: z.string().trim().optional(),
  fotoUrl: z.string().trim().optional().or(z.literal("")),
  exibir: z.number().int().min(0).max(1),
});

export async function acaoCriarMembro(_estado: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireUser(["admin", "lider"]);
  const dados = esquemaMembro.safeParse({
    nome: str(fd, "nome") ?? "", funcao: str(fd, "funcao") ?? "", area: str(fd, "area") ?? "",
    bio: str(fd, "bio"), fotoUrl: str(fd, "fotoUrl"), exibir: fd.get("exibir") === "on" ? 1 : 0,
  });
  if (!dados.success) return ERRO(errosZod(dados.error));
  const d = dados.data;
  await db.insert(teamMembers).values({ nome: d.nome, funcao: d.funcao, area: d.area, bio: d.bio ?? null, fotoUrl: d.fotoUrl || null, exibir: d.exibir, status: "rascunho" });
  await auditor("criar_membro", { usuarioId: user.id, detalhe: d.nome, ip: await ipResumido() });
  revalidatePath("/painel/conteudo");
  return OK("Membro criado como rascunho.");
}

export async function acaoSalvarMembro(_estado: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser(["admin", "lider"]);
  const id = inteiro(fd, "id");
  if (!id) return ERRO({ id: "Membro inválido." });
  const dados = esquemaMembro.safeParse({
    nome: str(fd, "nome") ?? "", funcao: str(fd, "funcao") ?? "", area: str(fd, "area") ?? "",
    bio: str(fd, "bio"), fotoUrl: str(fd, "fotoUrl"), exibir: fd.get("exibir") === "on" ? 1 : 0,
  });
  if (!dados.success) return ERRO(errosZod(dados.error));
  const d = dados.data;
  await db.update(teamMembers).set({ nome: d.nome, funcao: d.funcao, area: d.area, bio: d.bio ?? null, fotoUrl: d.fotoUrl || null, exibir: d.exibir }).where(eq(teamMembers.id, id));
  revalidatePath("/painel/conteudo");
  return OK("Membro salvo.");
}
// ---------------- parceiros ----------------
const esquemaParceiro = z.object({
  nome: z.string().trim().min(2, "Mínimo de 2 caracteres"),
  nivel: z.string().trim().min(1, "Informe o nível"),
  url: z.string().trim().optional().or(z.literal("")),
});

export async function acaoCriarParceiro(_estado: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireUser(["admin", "lider"]);
  const dados = esquemaParceiro.safeParse({ nome: str(fd, "nome") ?? "", nivel: str(fd, "nivel") ?? "apoio", url: str(fd, "url") });
  if (!dados.success) return ERRO(errosZod(dados.error));
  const d = dados.data;
  await db.insert(partners).values({ nome: d.nome, nivel: d.nivel, url: d.url || null, status: "rascunho" });
  await auditor("criar_parceiro", { usuarioId: user.id, detalhe: d.nome, ip: await ipResumido() });
  revalidatePath("/painel/conteudo");
  return OK("Parceiro criado como rascunho.");
}

export async function acaoSalvarParceiro(_estado: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser(["admin", "lider"]);
  const id = inteiro(fd, "id");
  if (!id) return ERRO({ id: "Parceiro inválido." });
  const dados = esquemaParceiro.safeParse({ nome: str(fd, "nome") ?? "", nivel: str(fd, "nivel") ?? "apoio", url: str(fd, "url") });
  if (!dados.success) return ERRO(errosZod(dados.error));
  const d = dados.data;
  await db.update(partners).set({ nome: d.nome, nivel: d.nivel, url: d.url || null }).where(eq(partners.id, id));
  revalidatePath("/painel/conteudo");
  return OK("Parceiro salvo.");
}

// ---------------- timeline ----------------
const esquemaTimeline = z.object({
  titulo: z.string().trim().min(2, "Mínimo de 2 caracteres"),
  data: z.string().trim().optional(), // texto livre (ex.: "Data a preencher")
  descricao: z.string().trim().optional(),
  ordem: z.number().int().min(0),
});

export async function acaoCriarTimeline(_estado: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireUser(["admin", "lider"]);
  const dados = esquemaTimeline.safeParse({ titulo: str(fd, "titulo") ?? "", data: str(fd, "data"), descricao: str(fd, "descricao"), ordem: inteiro(fd, "ordem") ?? 0 });
  if (!dados.success) return ERRO(errosZod(dados.error));
  const d = dados.data;
  await db.insert(timelineEvents).values({ titulo: d.titulo, data: d.data || null, descricao: d.descricao ?? null, ordem: d.ordem, status: "rascunho" });
  await auditor("criar_timeline", { usuarioId: user.id, detalhe: d.titulo, ip: await ipResumido() });
  revalidatePath("/painel/conteudo");
  return OK("Marco criado como rascunho.");
}

export async function acaoSalvarTimeline(_estado: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser(["admin", "lider"]);
  const id = inteiro(fd, "id");
  if (!id) return ERRO({ id: "Marco inválido." });
  const dados = esquemaTimeline.safeParse({ titulo: str(fd, "titulo") ?? "", data: str(fd, "data"), descricao: str(fd, "descricao"), ordem: inteiro(fd, "ordem") ?? 0 });
  if (!dados.success) return ERRO(errosZod(dados.error));
  const d = dados.data;
  await db.update(timelineEvents).set({ titulo: d.titulo, data: d.data || null, descricao: d.descricao ?? null, ordem: d.ordem }).where(eq(timelineEvents.id, id));
  revalidatePath("/painel/conteudo");
  return OK("Marco salvo.");
}

// ---------------- excluir (por seção) ----------------
export async function acaoExcluirConteudo(fd: FormData): Promise<void> {
  const user = await requireUser(["admin", "lider"]);
  const secao = str(fd, "secao") ?? "";
  const id = inteiro(fd, "id");
  if (!id) return;
  // somente admin exclui conteúdo (historico em audit)
  if (isAdmin(user.papel)) {
    if (secao === "posts") await db.delete(posts).where(eq(posts.id, id));
    else if (secao === "galeria") await db.delete(galleryAssets).where(eq(galleryAssets.id, id));
    else if (secao === "membros") await db.delete(teamMembers).where(eq(teamMembers.id, id));
    else if (secao === "parceiros") await db.delete(partners).where(eq(partners.id, id));
    else if (secao === "timeline") await db.delete(timelineEvents).where(eq(timelineEvents.id, id));
  }
  await auditor("excluir_conteudo", { usuarioId: user.id, detalhe: `${secao}:${id}`, ip: await ipResumido() });
  revalidatePath("/painel/conteudo");
}

// ---------------- configurações (tarefas do público) ----------------
export async function acaoAlternarRoboRevelado(_estado: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireUser(["admin", "lider"]);
  const desejado = fd.get("valor") === "1" ? 1 : 0;
  const chave = "roboRevelado";
  const existente = (await db.select().from(siteSettings).where(eq(siteSettings.chave, chave)).limit(1))[0];
  if (existente) {
    await db.update(siteSettings).set({ valor: String(desejado) }).where(eq(siteSettings.chave, chave));
  } else {
    await db.insert(siteSettings).values({ chave, valor: String(desejado) });
  }
  await auditor("atualizar_settings", { usuarioId: user.id, detalhe: `roboRevelado=${desejado}`, ip: await ipResumido() });
  revalidatePath("/painel/conteudo");
  revalidatePath("/");
  return OK(desejado === 1 ? "Robô revelado público." : "Robô em modo sigiloso no site público.");
}
