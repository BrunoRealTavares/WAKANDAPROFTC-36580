import type { Metadata } from "next";
import { Suspense } from "react";
import { getTimelineEvents } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Nossa História | Wakanda Pro 36580",
  description:
    "A linha do tempo da Wakanda Pro, equipe FTC 36580 de Camaçari/BA: da formação da equipe à construção do robô e à preparação para a temporada BIOBUZZ.",
};

const etapasPendentes = [
  "Formação da equipe",
  "Primeiros encontros",
  "Planejamento do projeto",
  "Construção do robô",
  "Testes e ajustes",
  "Preparação para a competição",
  "Eventos e conquistas",
];

export default function HistoryPage() {
  return (
    <>
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="tech-meta">LINHA DO TEMPO / EQUIPE 36580</p>
          <h1 className="font-display mt-4 text-4xl font-extrabold text-[var(--wp-white)] sm:text-5xl lg:text-6xl">
            Nossa história
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[var(--wp-silver-mute)]">
            Toda grande engenharia começa com um rabisco no papel. Aqui
            registramos, etapa por etapa, como a Wakanda Pro saiu da ideia e
            entrou em campo.
          </p>
        </div>
      </section>

      <section className="border-t border-[var(--wp-edge)] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="tech-meta mb-12">TIMELINE / TEMPORADA 2026–27</p>
          <Suspense fallback={<TimelineFallback />}>
            <Timeline />
          </Suspense>
        </div>
      </section>
    </>
  );
}

function TimelineFallback() {
  return (
    <div className="space-y-10">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="ml-3 flex items-center gap-4 border-l border-[var(--wp-edge)] pl-8">
          <span className="h-3 w-3 rounded-full bg-[var(--wp-edge)]" />
          <div className="h-4 w-40 animate-pulse rounded bg-[var(--wp-graphite)]" />
        </div>
      ))}
    </div>
  );
}

async function Timeline() {
  const eventos = await getTimelineEvents();
  const lista = [...eventos].sort((a, b) => a.ordem - b.ordem);

  if (lista.length === 0) {
    return (
      <>
        <ol className="relative ml-2 max-w-3xl space-y-10 border-l border-dashed border-[var(--wp-edge)] pl-8">
          {etapasPendentes.map((etapa, i) => (
            <li key={etapa} className="relative opacity-70">
              <span
                aria-hidden
                className="absolute -left-[40px] top-1.5 h-3.5 w-3.5 rounded-full border border-dashed border-[var(--wp-silver-dim)] bg-[var(--wp-void)]"
              />
              <p className="tech-meta">ETAPA {String(i + 1).padStart(2, "0")} · DATA A PREENCHER</p>
              <h3 className="font-display mt-2 text-xl font-extrabold text-[var(--wp-silver)]">
                {etapa}
              </h3>
              <p className="mt-1 text-sm italic text-[var(--wp-silver-dim)]">
                Informação pendente de preenchimento.
              </p>
            </li>
          ))}
        </ol>
        <p className="mt-12 max-w-2xl border-l-2 border-[var(--wp-cyan)] pl-4 text-sm text-[var(--wp-silver-dim)]">
          Esta linha do tempo é alimentada pela equipe através do CMS. Os relatos e as
          datas reais entram aqui quando os registros forem autorizados.
        </p>
      </>
    );
  }

  return (
    <ol className="relative ml-2 max-w-3xl space-y-12 border-l border-[var(--wp-edge)] pl-8">
      {lista.map((evento, i) => (
        <li key={evento.id} className="relative">
          <span
            aria-hidden
            className="absolute -left-[40px] top-1.5 h-3.5 w-3.5 rounded-full bg-[var(--wp-red)] ring-4 ring-[var(--wp-void)]"
          />
          <p className="tech-meta">
            ETAPA {String(i + 1).padStart(2, "0")} ·{" "}
            {evento.data ? evento.data.toUpperCase() : "DATA A PREENCHER"}
          </p>
          <h3 className="font-display mt-2 text-xl font-extrabold text-[var(--wp-white)]">
            {evento.titulo}
          </h3>
          {evento.descricao && (
            <p className="mt-2 max-w-xl text-sm text-[var(--wp-silver-mute)]">
              {evento.descricao}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}
