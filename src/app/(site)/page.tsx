import Link from "next/link";
import { HeroMystery } from "@/components/anim/HeroMystery";
import { Reveal } from "@/components/anim/Reveal";
import { RevealSequence } from "@/components/anim/RevealSequence";
import siteConfig from "@/lib/site-config";

const valores = [
  { indice: "01", titulo: "Afrofuturismo", texto: "Ancestralidade, ciência e criatividade construindo futuros possíveis a partir das nossas raízes." },
  { indice: "02", titulo: "Protagonismo", texto: "Orgulho, representatividade e liderança em cada decisão da equipe." },
  { indice: "03", titulo: "Autonomia", texto: "Construir oportunidades, superar limites e desenvolver soluções próprias." },
  { indice: "04", titulo: "Conhecimento coletivo", texto: "Compartilhar habilidades, colaborar e aprender continuamente." },
  { indice: "05", titulo: "Inovação", texto: "Transformar ideias em projetos concretos por meio da engenharia e da experimentação." },
];

export default function Home() {
  return (
    <>
      <HeroMystery />

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

          <ul className="mt-20 grid gap-px overflow-hidden rounded-xl border border-[var(--wp-graphite)] bg-[var(--wp-graphite)] sm:grid-cols-2 lg:grid-cols-5">
            {valores.map((v) => (
              <li key={v.indice} className="group bg-[var(--wp-void)] p-6 transition-colors hover:bg-[var(--wp-coal)]">
                <span className="tech-meta text-[var(--wp-red)]">{v.indice}</span>
                <h3 className="font-display mt-3 text-base font-bold text-[var(--wp-white)]">{v.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--wp-silver-mute)]">{v.texto}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <RevealSequence />

      <section id="biobuzz" className="relative border-t border-[var(--wp-graphite)] bg-[var(--wp-coal)] py-20 lg:py-24">
        <Reveal className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-10 px-5 lg:flex-row lg:items-center lg:px-8">
          <div>
            <p className="tech-meta">TEMPORADA {siteConfig.cicloTemporada}</p>
            <h2 className="font-display mt-4 text-[clamp(1.8rem,4vw,3rem)] font-extrabold text-[var(--wp-white)]">
              BIOBUZZ <span className="text-[var(--wp-cyan)]">·</span> nossa primeira temporada
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-[var(--wp-silver-mute)]">
              Participamos do FIRST Tech Challenge com ambições sem limites.
              Acompanhe o diário de bordo e entre no campo com o simulador BioBuzz 3D.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              href="/simulador"
              className="inline-flex h-12 items-center justify-center rounded bg-[var(--wp-red)] px-6 text-sm font-semibold text-white transition-colors hover:bg-[var(--wp-red-deep)]"
            >
              Entre no campo BIOBUZZ
            </Link>
            <Link
              href="/diario"
              className="inline-flex h-12 items-center justify-center rounded border border-[var(--wp-edge)] px-6 text-sm text-[var(--wp-silver-mute)] transition-colors hover:text-[var(--wp-white)]"
            >
              Diário de bordo
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
