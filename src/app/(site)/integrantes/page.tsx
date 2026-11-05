import type { Metadata } from "next";
import { Suspense } from "react";
import siteConfig from "@/lib/site-config";
import { getPublishedMembers } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Integrantes | Wakanda Pro 36580",
  description:
    "Quem compõe a Wakanda Pro: treinadora e integrantes da equipe de robótica de Camaçari/BA em sua primeira temporada na FIRST Tech Challenge.",
};

type Membro = Awaited<ReturnType<typeof getPublishedMembers>>[number];

function iniciais(nome: string) {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  const primeira = partes[0]?.[0] ?? "";
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + ultima).toUpperCase() || "W";
}

export default function MembersPage() {
  return (
    <>
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="tech-meta">PESSOAS / EQUIPE 36580</p>
          <h1 className="font-display mt-4 text-4xl font-extrabold text-[var(--wp-white)] sm:text-5xl lg:text-6xl">
            Os integrantes
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[var(--wp-silver-mute)]">
            Por trás de cada parafuso apertado e de cada linha de código, tem
            gente de verdade. Aqui é o lugar onde apresentamos a nós mesmos.
          </p>
        </div>
      </section>

      <section className="border-t border-[var(--wp-edge)] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="tech-meta text-[var(--wp-gold-soft)]">TREINADORA</p>
          <article className="mt-6 grid gap-8 rounded-xl border border-[var(--wp-gold)] bg-[var(--wp-coal)] p-8 lg:grid-cols-[auto_1fr] lg:items-center lg:p-10">
            <span
              aria-hidden
              className="grid h-20 w-20 place-items-center rounded-full border border-[var(--wp-gold)] bg-[var(--wp-graphite)] font-display text-3xl font-extrabold text-[var(--wp-gold-soft)]"
            >
              ?
            </span>
            <div>
              <h2 className="font-display text-2xl font-extrabold text-[var(--wp-white)] lg:text-3xl">
                {siteConfig.treinadora.nome ?? "Nome pendente de confirmação"}
              </h2>
              <p className="mt-4 max-w-2xl text-[var(--wp-silver-mute)]">
                {siteConfig.treinadora.biografiaPendente}
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="border-t border-[var(--wp-edge)] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="tech-meta mb-12">INTEGRANTES</p>
          <Suspense
            fallback={
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-44 animate-pulse rounded-xl bg-[var(--wp-coal)]" />
                ))}
              </div>
            }
          >
            <MembersGrid />
          </Suspense>

          <p className="mt-12 max-w-3xl border-l-2 border-[var(--wp-cyan)] pl-4 text-sm text-[var(--wp-silver-dim)]">
            Fotos e identificações de menores dependem de autorização. Telefones,
            endereços e horários individuais nunca são publicados.
          </p>
        </div>
      </section>
    </>
  );
}

async function MembersGrid() {
  const membros = await getPublishedMembers();

  if (membros.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--wp-edge)] bg-[var(--wp-coal)] p-10 text-center lg:p-14">
        <p className="font-display mx-auto max-w-xl text-xl font-extrabold text-[var(--wp-silver)] lg:text-2xl">
          Apresentação dos integrantes em preparação.
        </p>
        <p className="mt-3 text-sm text-[var(--wp-silver-dim)]">
          Cada perfil chega aqui conforme os integrantes e suas famílias
          autorizarem a publicação.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {membros.map((m: Membro) => (
        <li
          key={m.id}
          className="rounded-xl border border-[var(--wp-edge)] bg-[var(--wp-coal)] p-6 transition-colors hover:border-[var(--wp-red-deep)]"
        >
          <div className="flex items-center gap-4">
            <span
              aria-hidden
              className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-[var(--wp-edge)] bg-[var(--wp-graphite)] font-display text-lg font-extrabold text-[var(--wp-red)]"
            >
              {iniciais(m.nome)}
            </span>
            <div>
              <h3 className="font-semibold text-[var(--wp-white)]">{m.nome}</h3>
              <p className="tech-meta mt-1">{m.funcao}</p>
            </div>
          </div>
          <p className="mt-4">
            <span className="inline-block rounded-full border border-[var(--wp-edge)] px-3 py-1 text-xs text-[var(--wp-cyan)]">
              {m.area}
            </span>
          </p>
          {m.bio && (
            <p className="mt-4 text-sm text-[var(--wp-silver-mute)]">{m.bio}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
