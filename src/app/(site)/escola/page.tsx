import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { assets } from "@/data/assets";
import { conteudo } from "@/data/conteudo";

export const metadata: Metadata = {
  title: "Nossa Escola | Wakanda Pro 36580",
  description:
    "Escola SESI Milton Santos, em Camaçari/BA: berço da equipe Wakanda Pro de robótica, centro de treinamento e ponto de encontro entre engenharia e patrimônio cultural.",
};

export default function SchoolPage() {
  return (
    <>
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="tech-meta">NOSSA ESCOLA</p>
          <h1 className="font-display mt-4 text-4xl font-extrabold text-[var(--wp-white)] sm:text-5xl lg:text-6xl">
            Escola SESI Milton Santos
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--wp-silver-mute)]">
            A Escola SESI Milton Santos, em Camaçari, Bahia, é o berço do
            projeto Wakanda Pro. É lá que a equipe se forma, treina e descobre
            que a engenharia também é herança cultural — um espaço onde ciência,
            tecnologia e a tradição local se encontram para formar futuras
            carreiras em robótica e inovação.
          </p>
          <div className="mt-10">
            <Link
              href="/escola"
              className="inline-flex h-11 items-center rounded border border-[var(--wp-edge)] px-6 font-mono text-xs uppercase tracking-[0.18em] text-[var(--wp-silver-mute)] transition-colors hover:border-[var(--wp-gold)] hover:text-[var(--wp-gold-soft)]"
            >
              Conheça a escola →
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--wp-edge)] bg-[var(--wp-coal)] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="tech-meta mb-12">NOSSAS RAÍZES</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:gap-10">
            <figure className="rounded-xl border border-[var(--wp-edge)] p-6">
              <div className="overflow-hidden rounded-lg bg-[var(--wp-graphite)]">
                <Image
                  src={assets.bandeiraBahia}
                  alt="Bandeira do estado da Bahia"
                  width={479}
                  height={324}
                  className="h-auto w-full object-cover"
                />
              </div>
              <figcaption className="mt-4">
                <p className="font-display text-lg font-extrabold text-[var(--wp-white)]">
                  Bahia
                </p>
                <p className="tech-meta mt-1">BERÇO DO PROJETO</p>
              </figcaption>
              <div className="mt-4 space-y-2 text-sm text-[var(--wp-silver-mute)] leading-relaxed">
                {conteudo.bahia.paragrafos.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </figure>
            <figure className="rounded-xl border border-[var(--wp-edge)] p-6">
              <div className="overflow-hidden rounded-lg bg-[var(--wp-graphite)]">
                <Image
                  src={assets.bandeiraBrasil}
                  alt="Bandeira do Brasil"
                  width={480}
                  height={340}
                  className="h-auto w-full object-cover"
                />
              </div>
              <figcaption className="mt-4">
                <p className="font-display text-lg font-extrabold text-[var(--wp-white)]">
                  Brasil
                </p>
                <p className="tech-meta mt-1">PALCO DA TEMPORADA FTC</p>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
    </>
  );
}
