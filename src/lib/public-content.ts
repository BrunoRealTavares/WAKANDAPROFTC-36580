/**
 * CONTRATO: conteúdo público com fallback seguro (nunca quebrar o site por banco).
 * Assinaturas/tipos estáveis consumidos pelas páginas de src/app/(site).
 * NÃO renomear funções/tipos exportados.
 */
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { galleryAssets, partners, posts, siteSettings, teamMembers, timelineEvents } from "@/db/schema";

export type PostPublico = {
  id: number;
  slug: string;
  titulo: string;
  categoria: string;
  autor: string;
  imagemUrl: string | null;
  resumo: string | null;
  publicadoEm: string; // "YYYY-MM-DD"
};

export type GaleriaAsset = {
  id: number;
  titulo: string;
  categoria: string;
  url: string;
  descricao: string | null;
  publicadoEm: string; // "YYYY-MM-DD"
};

export type MembroPublico = {
  id: number;
  nome: string;
  funcao: string;
  area: string;
  bio: string | null;
};

export type ParceiroPublico = {
  id: number;
  nome: string;
  nivel: string;
  url: string | null;
};

export type EventoLinhaTempo = {
  id: number;
  titulo: string;
  data: string | null;
  descricao: string | null;
  ordem: number;
};

export type SiteSettings = { roboRevelado: boolean };
// alias legado
export type ConfiguracoesSite = SiteSettings;

function paraDiaIso(d: Date | null | undefined): string | null {
  return d ? d.toISOString().slice(0, 10) : null;
}

export async function getPublishedPosts(): Promise<PostPublico[]> {
  try {
    const linhas = await db
      .select({
        id: posts.id,
        slug: posts.slug,
        titulo: posts.titulo,
        categoria: posts.categoria,
        autor: posts.autor,
        imagemUrl: posts.imagemUrl,
        resumo: posts.resumo,
        publicadoEm: posts.publicadoEm,
      })
      .from(posts)
      .where(eq(posts.status, "publicado"))
      .orderBy(desc(posts.publicadoEm), desc(posts.id));
    return linhas.map((l) => ({
      ...l,
      imagemUrl: l.imagemUrl ?? null,
      resumo: l.resumo ?? null,
      publicadoEm: paraDiaIso(l.publicadoEm) ?? "",
    }));
  } catch {
    return [];
  }
}

export async function getPublishedGalleryAssets(): Promise<GaleriaAsset[]> {
  try {
    const linhas = await db
      .select({
        id: galleryAssets.id,
        titulo: galleryAssets.titulo,
        categoria: galleryAssets.categoria,
        url: galleryAssets.url,
        descricao: galleryAssets.descricao,
        publicadoEm: galleryAssets.publicadoEm,
      })
      .from(galleryAssets)
      .where(eq(galleryAssets.status, "publicado"))
      .orderBy(desc(galleryAssets.publicadoEm), desc(galleryAssets.id));
    return linhas.map((l) => ({
      ...l,
      descricao: l.descricao ?? null,
      publicadoEm: paraDiaIso(l.publicadoEm) ?? "",
    }));
  } catch {
    return [];
  }
}

export async function getPublishedMembers(): Promise<MembroPublico[]> {
  try {
    return await db
      .select({ id: teamMembers.id, nome: teamMembers.nome, funcao: teamMembers.funcao, area: teamMembers.area, bio: teamMembers.bio })
      .from(teamMembers)
      .where(eq(teamMembers.exibir, 1))
      .orderBy(asc(teamMembers.nome));
  } catch {
    return [];
  }
}

export async function getPublishedPartners(): Promise<ParceiroPublico[]> {
  try {
    return await db
      .select({ id: partners.id, nome: partners.nome, nivel: partners.nivel, url: partners.url })
      .from(partners)
      .where(eq(partners.status, "publicado"))
      .orderBy(asc(partners.nome));
  } catch {
    return [];
  }
}

export async function getTimelineEvents(): Promise<EventoLinhaTempo[]> {
  try {
    const linhas = await db
      .select({ id: timelineEvents.id, titulo: timelineEvents.titulo, data: timelineEvents.data, descricao: timelineEvents.descricao, ordem: timelineEvents.ordem })
      .from(timelineEvents)
      .where(eq(timelineEvents.status, "publicado"))
      .orderBy(asc(timelineEvents.ordem), asc(timelineEvents.id));
    return linhas.map((l) => ({ ...l, data: l.data ?? null, descricao: l.descricao ?? null }));
  } catch {
    return [];
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const linhas = await db.select({ chave: siteSettings.chave, valor: siteSettings.valor }).from(siteSettings);
    const mapa = new Map(linhas.map((l) => [l.chave, l.valor]));
    return { roboRevelado: mapa.get("roboRevelado") === "1" };
  } catch {
    return { roboRevelado: false };
  }
}
