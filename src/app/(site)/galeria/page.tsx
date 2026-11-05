import type { Metadata } from "next";
import { Suspense } from "react";
import { getPublishedGalleryAssets } from "@/lib/public-content";
import { GalleryClient } from "./GalleryClient";

export const metadata: Metadata = {
  title: "Galeria | Wakanda Pro 36580",
  description:
    "Registros autorizados da Wakanda Pro: equipe, treinos, engenharia e o robô Vibranium na temporada BIOBUZZ. Fotos publicadas só com autorização.",
};

export default function GalleryPage() {
  return (
    <>
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="tech-meta">ACERVO / REGISTROS AUTORIZADOS</p>
          <h1 className="font-display mt-4 text-4xl font-extrabold text-[var(--wp-white)] sm:text-5xl lg:text-6xl">
            Galeria
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[var(--wp-silver-mute)]">
            Treinos, testes, torneios, risadas e ciclos de engenharia: a memória
            visual da primeira temporada. Publicamos sempre com autorização.
          </p>
        </div>
      </section>

      <section className="border-t border-[var(--wp-edge)] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Suspense
            fallback={
              <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="mb-4 aspect-[4/3] animate-pulse rounded-xl bg-[var(--wp-coal)]" />
                ))}
              </div>
            }
          >
            <GalleryArea />
          </Suspense>
        </div>
      </section>
    </>
  );
}

async function GalleryArea() {
  const assets = await getPublishedGalleryAssets();
  return <GalleryClient assets={assets} />;
}
