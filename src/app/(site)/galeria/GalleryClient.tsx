"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

export type GalleryAsset = {
  id: number;
  titulo: string;
  categoria: string;
  url: string;
  descricao: string | null;
  publicadoEm: string;
};

const FILTROS_BASE = ["Equipe", "Treinos", "Escola", "Engenharia", "Competições", "Robô"];

export function GalleryClient({ assets }: { assets: GalleryAsset[] }) {
  const[chips, setChips] = useState<string[]>(() => {
    const base = FILTROS_BASE.filter((f) => assets.some((a) => a.categoria === f));
    const extras = [...new Set(assets.map((a) => a.categoria))].filter(
      (c) => !FILTROS_BASE.includes(c)
    );
    return ["Todas", ...base, ...extras];
  });
  const [filtro, setFiltro] = useState("Todas");

  const visiveis = useMemo(
    () => (filtro === "Todas" ? assets : assets.filter((a) => a.categoria === filtro)),
    [assets, filtro]
  );

  if (assets.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--wp-edge)] bg-[var(--wp-coal)] p-10 text-center lg:p-16">
        <p className="font-display mx-auto max-w-2xl text-2xl font-extrabold text-[var(--wp-silver)] lg:text-3xl">
          A galeria só exibe registros autorizados — as primeiras fotos chegam
          em breve.
        </p>
        <p className="mt-4 text-sm text-[var(--wp-silver-dim)]">
          Cada imagem passa por autorização antes de entrar aqui. O acervo é
          curado com o mesmo cuidado da construção do robô.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div role="group" aria-label="Filtrar galeria por categoria" className="flex flex-wrap gap-2">
        {chips.map((chip) => {
          const ativo = filtro === chip;
          return (
            <button
              key={chip}
              type="button"
              aria-pressed={ativo}
              onClick={() => setFiltro(chip)}
              className={`rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                ativo
                  ? "border-[var(--wp-red)] bg-[var(--wp-red)] text-[var(--wp-white)]"
                  : "border-[var(--wp-edge)] text-[var(--wp-silver-mute)] hover:border-[var(--wp-silver-dim)] hover:text-[var(--wp-white)]"
              }`}
            >
              {chip}
            </button>
          );
        })}
      </div>

      <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {visiveis.map((asset) => (
          <figure
            key={asset.id}
            className="break-inside-avoid overflow-hidden rounded-xl border border-[var(--wp-edge)] bg-[var(--wp-coal)]"
          >
            <div className="relative aspect-[4/3] w-full bg-[var(--wp-graphite)]">
              <Image
                src={asset.url}
                alt={asset.descricao ?? asset.titulo}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                unoptimized={asset.url.startsWith("http")}
                className="object-cover"
              />
            </div>
            <figcaption className="p-4">
              <p className="font-semibold text-[var(--wp-silver)]">{asset.titulo}</p>
              <p className="tech-meta mt-1">{asset.categoria}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
