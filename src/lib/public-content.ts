/**
 * CONTRATO: conteúdo público com fallback seguro.
 * Versão stub (Fase 2): lista e galeria retornam vazio e membros vêm do
 * arquivo `src/data/timeline.ts` enquanto o banco da intranet não está
 * pronto. A versão final lê as tabelas publicadas via DB.
 */

import { timelineTemporada } from "@/data/timeline";

export type PostPublico = {
  id: number;
  slug: string;
  titulo: string;
  categoria: string;
  autor: string;
  imagemUrl: string | null;
  resumo: string | null;
  publicadoEm: string;
};

export type GaleriaAsset = {
  id: number;
  titulo: string;
  categoria: string;
  url: string;
  descricao: string | null;
  publicadoEm: string;
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

async function getPublishedPosts(): Promise<PostPublico[]> {
  return [];
}

export async function getPublishedGalleryAssets(): Promise<GaleriaAsset[]> {
  return [];
}

export async function getPublishedMembers(): Promise<MembroPublico[]> {
  return [];
}

export async function getPublishedPartners(): Promise<ParceiroPublico[]> {
  return [];
}

export async function getTimelineEvents(): Promise<EventoLinhaTempo[]> {
  return timelineTemporada.map((evento, i) => ({
    id: i,
    titulo: evento.titulo,
    data: evento.data,
    descricao: evento.descricao,
    ordem: evento.ordem,
  }));
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return { roboRevelado: false };
}
