import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { HeroMystery } from "@/components/anim/HeroMystery";
import { Reveal } from "@/components/anim/Reveal";
import { RevealSequence } from "@/components/anim/RevealSequence";
import { MembroAvatar } from "@/components/MembroAvatar";
import { SimulatorEmbed } from "@/app/(site)/simulador/SimulatorEmbed";
import siteConfig from "@/lib/site-config";
import { getTimelineEvents } from "@/lib/public-content";
import { equipe, type GrupoEquipe } from "@/data/equipe";

const porQueWakanda = [
  {
    titulo: "Afrofuturismo e Tecnologia",
    texto: "Ciência e inovação coexistindo com raízes ancestrais e tradições africanas.",
  },
  {
    titulo: "Resistência à Colonização",
    texto: "O sonho ancestral de como a África poderia ser sem a exploração e o saque de suas riquezas.",
  },
  {
    titulo: "Pan-africanismo e Pertencimento",
    texto: "Elementos de várias regiões e etnias reais, unindo os povos africanos e a diáspora preta.",
  },
  {
    titulo: "Protagonismo e Dignidade",
    texto: "Elenco majoritariamente negro em posições de poder, inteligência, liderança e realeza — \"Wakanda Forever\" como símbolo de respeito e orgulho.",
  },
];

const selos = [
  { src: "/img/logo-first-tech-challenge.png", alt: "Logotipo do FIRST Tech Challenge", largura: 356, altura: 280 },
  { src: "/img/logo-biobuzz.jpg", alt: "Logotipo da temporada BIOBUZZ", largura: 447, altura: 447 },
  { src: "/img/logo-liga-robotica-sesi-bahia.jpg", alt: "Logotipo da Liga de Robótica SESI Bahia", largura: 500, altura: 500 },
];

export default function Home() {
  const grupos: GrupoEquipe[] = Array.from(
    new Set(
      equipe
        .map((m) => m.grupo)
        .filter((g): g is GrupoEquipe => Boolean(g)),
    ),
  );

  const lideranca = equipe.filter(
    (m) => m.papel === "tecnica" || m.papel === "mentora",
  );

  return (
    <>
      <HeroMystery />

      {/* Selos do ecossistema da temporada */}
      <section aria-label="Selos da temporada" className="border-y border-[var(--wp-graphite)] bg-[var(--wp-coal)] py-10">
        <Reveal className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-14 gap-y-6 px-5 lg:px-8">
          {selos.map((s) => (
            <Image
              key={s.src}
              src={s.src}
              alt={s.alt}
              width={s.largura}
              height={s.altura}
              className="h-14 w-auto object-contain opacity-90"
            />
          ))}
        </Reveal>
      </section>

      {/* 1 · Sobre a equipe (destino do CTA do hero) */}
      <section id="equipe" className="border-t border-[var(--wp-graphite)] py-24 lg:py-32" aria-label="Sobre a equipe">
        <Reveal className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="tech-meta">A EQUIPE NASCE</p>
              <h2 className="font-display mt-4 text-[clamp(1.9rem,4vw,3.2rem)] font-extrabold text-[var(--wp-white)]">
                Raízes fortes.
                <span className="block text-[var(--wp-gold-soft)]">Ideias extraordinárias.</span>
              </h2>
            </div>
            <div className="space-y-6 text-lg leading-relaxed text-[var(--wp-silver-mute)]">
              <p>
                O nome <strong className="font-semibold text-[var(--wp-white)]">Wakanda</strong> é inspirado na
                nação fictícia de Pantera Negra — um símbolo de afrofuturismo,
                protagonismo e tecnologia com identidade própria.
              </p>
              <p>
                Somos estudantes aprendendo engenharia, programação e trabalho em
                equipe. Cada linha de código, cada peça usinada, cada teste vencido
                constrói um pedaço dessa história.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 2 · Nossa história — dados editáveis em src/data/timeline.ts */}
      <section id="historia" className="border-y border-[var(--wp-graphite)] py-24 lg:py-32" aria-label="Nossa história">
        <Reveal className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div>
            <p className="tech-meta">NOSSA HISTÓRIA</p>
            <h2 className="font-display mt-4 text-[clamp(1.9rem,4vw,3rem)] font-extrabold text-[var(--wp-white)]">
              Primeiro ano da escola na FTC.
              <span className="block text-[var(--wp-gold-soft)]">E não nos conformamos com pouco.</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--wp-silver-mute)]">
              É a primeira vez que a nossa escola entra na FIRST Tech Challenge —
              e a estreia é feita de coragem mesmo: equipe formada em meio ao ano
              letivo, robô em construção e uma esperança grande demais para caber
              no laboratório.
            </p>
            <div className="mt-8">
              <Link
                href="/historia"
                className="inline-flex h-11 items-center rounded border border-[var(--wp-edge)] px-6 font-mono text-xs uppercase tracking-[0.18em] text-[var(--wp-silver-mute)] transition-colors hover:border-[var(--wp-gold)] hover:text-[var(--wp-gold-soft)]"
              >
                Ver a linha do tempo completa →
              </Link>
            </div>
          </div>
          <Suspense fallback={<LinhaTempoFallback />}>
            <LinhaTempoResumo />
          </Suspense>
        </Reveal>
      </section>

      {/* 3 · Por que Wakanda? */}
      <section id="wakanda" className="border-t border-[var(--wp-graphite)] py-24 lg:py-32" aria-label="Por que Wakanda?">
        <Reveal className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="tech-meta">POR QUE WAKANDA?</p>
          <h2 className="font-display mt-4 max-w-2xl text-[clamp(1.9rem,4vw,3.2rem)] font-extrabold text-[var(--wp-white)]">
            Um nome que afirma de onde a gente fala
          </h2>
          <ul className="mt-14 grid gap-px overflow-hidden rounded-xl border border-[var(--wp-graphite)] bg-[var(--wp-graphite)] sm:grid-cols-2 lg:grid-cols-4">
            {porQueWakanda.map((card, i) => (
              <li key={card.titulo} className="group bg-[var(--wp-void)] p-6 transition-colors hover:bg-[var(--wp-coal)]">
                <span className="tech-meta text-[var(--wp-red)]">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-display mt-3 text-base font-bold text-[var(--wp-white)]">{card.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--wp-silver-mute)]">{card.texto}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* 4 · Nossa escola */}
      <section id="escola" className="border-t border-[var(--wp-graphite)] bg-[var(--wp-coal)] py-24 lg:py-32" aria-label="Nossa escola">
        <Reveal className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8">
          <div>
            <p className="tech-meta">NOSSA ESCOLA</p>
            <h2 className="font-display mt-4 text-[clamp(1.9rem,4vw,3rem)] font-extrabold text-[var(--wp-white)]">
              {siteConfig.nomeEscolaPendente}
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--wp-silver-mute)]">
              Em Camaçari, {siteConfig.estado}, a escola é berço do projeto:
              é lá que a equipe se forma, treina e descobre que engenharia
              também é herança cultural.
            </p>
            <p className="tech-meta mt-6 inline-block rounded border border-dashed border-[var(--wp-edge)] px-3 py-2">
              Nomenclatura institucional sujeita a confirmação
            </p>
            <div className="mt-8">
              <Link
                href="/escola"
                className="inline-flex h-11 items-center rounded border border-[var(--wp-edge)] px-6 font-mono text-xs uppercase tracking-[0.18em] text-[var(--wp-silver-mute)] transition-colors hover:border-[var(--wp-gold)] hover:text-[var(--wp-gold-soft)]"
              >
                Conheça a escola →
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <figure className="rounded-xl border border-[var(--wp-edge)] bg-[var(--wp-void)] p-4">
              <Image
                src="/img/bandeira-bahia.png"
                alt="Bandeira do estado da Bahia"
                width={479}
                height={324}
                className="h-auto w-full rounded-lg object-cover"
              />
              <figcaption className="tech-meta mt-3">BAHIA · BERÇO DO PROJETO</figcaption>
            </figure>
            <figure className="rounded-xl border border-[var(--wp-edge)] bg-[var(--wp-void)] p-4">
              <Image
                src="/img/bandeira-brasil.jpg"
                alt="Bandeira do Brasil"
                width={480}
                height={340}
                className="h-auto w-full rounded-lg object-cover"
              />
              <figcaption className="tech-meta mt-3">BRASIL · PALCO DA FTC</figcaption>
            </figure>
          </div>
        </Reveal>
      </section>

      {/* 5 · Treinadora e participantes — fonte única: src/data/equipe.ts */}
      <section id="pessoas" className="border-t border-[var(--wp-graphite)] py-24 lg:py-32" aria-label="Treinadora e participantes">
        <Reveal className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="tech-meta">TREINADORA E PARTICIPANTES</p>
          <h2 className="font-display mt-4 text-[clamp(1.9rem,4vw,3rem)] font-extrabold text-[var(--wp-white)]">
            As pessoas da temporada
          </h2>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {lideranca.map((m) => (
              <article
                key={m.nome}
                className="flex items-center gap-5 rounded-xl border border-[var(--wp-edge)] bg-[var(--wp-coal)] p-6 lg:p-8"
              >
                <MembroAvatar nome={m.nome} foto={m.foto} />
                <div>
                  <h3 className="font-display text-xl font-extrabold text-[var(--wp-white)]">
                    {m.nome}
                  </h3>
                  <p
                    className={
                      m.papel === "tecnica"
                        ? "tech-meta mt-1 text-[var(--wp-red)]"
                        : "tech-meta mt-1 text-[var(--wp-gold-soft)]"
                    }
                  >
                    {m.papel === "tecnica" ? "TÉCNICA · LIDERANÇA" : "MENTORA · MENTORIA"}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {grupos.map((grupo) => (
            <div key={grupo} className="mt-10">
              <p className="tech-meta text-[var(--wp-gold-soft)]">GRUPO {grupo}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {equipe
                  .filter((m) => m.grupo === grupo && m.papel === "membro")
                  .map((m) => (
                    <li
                      key={m.nome}
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--wp-edge)] bg-[var(--wp-void)] px-4 py-2 text-sm text-[var(--wp-silver)]"
                    >
                      <span aria-hidden className="h-2 w-2 rounded-full bg-[var(--wp-red)]" />
                      {m.nome}
                    </li>
                  ))}
              </ul>
            </div>
          ))}

          <div className="mt-12">
            <Link
              href="/equipe"
              className="inline-flex h-11 items-center rounded border border-[var(--wp-edge)] px-6 font-mono text-xs uppercase tracking-[0.18em] text-[var(--wp-silver-mute)] transition-colors hover:border-[var(--wp-gold)] hover:text-[var(--wp-gold-soft)]"
            >
              Conheça a equipe completa →
            </Link>
          </div>
        </Reveal>
      </section>

      {/* 6 · O robô Vibranium — narrativa de revelação */}
      <RevealSequence />

      {/* 6.1 · Origem do nome */}
      <section className="border-t border-[var(--wp-graphite)] py-24 lg:py-32" aria-label="Origem do nome Vibranium">
        <Reveal className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="tech-meta">O NOME</p>
            <h2 className="font-display mt-4 max-w-xl text-[clamp(1.8rem,3.6vw,2.6rem)] font-extrabold text-[var(--wp-white)]">
              Vibranium: absorver o impacto e virar força
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-[var(--wp-silver-mute)]">
              Na ficção de Wakanda, o Vibranium é um metal vindo de um meteorito —
              a base da tecnologia do reino. Está no escudo do Capitão América e
              no uniforme do Pantera Negra, e absorve a energia de golpes e
              explosões em vez de transferi-la.
            </p>
          </div>
          <div>
            <p className="tech-meta">NA NOSSA TEMPORADA</p>
            <h2 className="font-display mt-4 max-w-xl text-[clamp(1.8rem,3.6vw,2.6rem)] font-extrabold text-[var(--wp-white)]">
              Desafio absorvido, força de volta
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-[var(--wp-silver-mute)]">
              É essa a nossa leitura: tempo curto, peça que falha, código que
              quebra — tudo vira energia absorvida e transformada em método,
              teste e trabalho de equipe. O metal é fictício; a força não.
            </p>
            <div className="mt-8">
              <Link
                href="/robo"
                className="inline-flex h-11 items-center rounded border border-[var(--wp-edge)] px-6 font-mono text-xs uppercase tracking-[0.18em] text-[var(--wp-silver-mute)] transition-colors hover:border-[var(--wp-gold)] hover:text-[var(--wp-gold-soft)]"
              >
                Conheça o projeto do robô →
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 7 · Temporada BIOBUZZ + simulador 3D */}
      <section id="biobuzz" className="relative border-t border-[var(--wp-graphite)] bg-[var(--wp-coal)] py-20 lg:py-24">
        <Reveal className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-10 px-5 lg:flex-row lg:items-center lg:px-8">
          <div>
            <p className="tech-meta">TEMPORADA {siteConfig.cicloTemporada}</p>
            <h2 className="font-display mt-4 text-[clamp(1.8rem,4vw,3rem)] font-extrabold text-[var(--wp-white)]">
              BIOBUZZ <span className="text-[var(--wp-cyan)]">·</span> nossa primeira temporada
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-[var(--wp-silver-mute)]">
              Participamos do FIRST Tech Challenge com ambições sem limites.
              Entre no campo com o simulador 3D e acompanhe o diário de bordo.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              href="/diario"
              className="inline-flex h-12 items-center justify-center rounded border border-[var(--wp-edge)] px-6 text-sm text-[var(--wp-silver-mute)] transition-colors hover:text-[var(--wp-white)]"
            >
              Diário de bordo
            </Link>
          </div>
        </Reveal>
        <div className="mx-auto max-w-7xl px-5 pb-24 lg:px-8 lg:pb-32">
          <SimulatorEmbed url={siteConfig.linksExternos.simuladorBioBuzz} />
        </div>
      </section>
    </>
  );
}

function LinhaTempoFallback() {
  return (
    <div aria-hidden className="ml-2 space-y-10 border-l border-[var(--wp-edge)] pl-8">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-4 w-40 animate-pulse rounded bg-[var(--wp-graphite)]" />
      ))}
    </div>
  );
}

async function LinhaTempoResumo() {
  const eventos = (await getTimelineEvents()).sort((a, b) => a.ordem - b.ordem).slice(0, 4);

  return (
    <ol className="ml-2 max-w-md space-y-10 border-l border-[var(--wp-edge)] pl-8">
      {eventos.map((evento) => (
        <li key={evento.id} className="relative">
          <span
            aria-hidden
            className="absolute -left-[41px] top-1.5 h-3 w-3 rounded-full bg-[var(--wp-red)] ring-4 ring-[var(--wp-void)]"
          />
          <p className="tech-meta">
            {evento.data ? evento.data.toUpperCase() : "DATA A CONFIRMAR"}
          </p>
          <h3 className="font-display mt-1 text-lg font-extrabold text-[var(--wp-silver)]">
            {evento.titulo}
          </h3>
          {evento.descricao && (
            <p className="mt-1 text-sm text-[var(--wp-silver-mute)]">{evento.descricao}</p>
          )}
        </li>
      ))}
    </ol>
  );
}
