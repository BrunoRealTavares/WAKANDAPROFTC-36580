import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { assets } from "@/data/assets";
import { FirstLogo } from "@/components/FirstLogo";
import siteConfig from "@/lib/site-config";

export const metadata: Metadata = {
  title: "BIOBUZZ 2026–27 | Wakanda Pro 36580",
  description:
    "A temporada BIOBUZZ 2026–27 da FIRST Tech Challenge: o que é a competição, o marco da estreia da Wakanda Pro e onde acompanhar o diário de preparação e o simulador do campo.",
};

export default function BioBuzzPage() {
  return (
    <>
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="tech-meta">{`TEMPORADA / ${siteConfig.temporada.toUpperCase()} / ${siteConfig.cicloTemporada}`}</p>
          <h1 className="font-display mt-4 text-4xl font-extrabold text-[var(--wp-white)] sm:text-5xl lg:text-6xl">
            BIOBUZZ <span className="text-[var(--wp-gold-soft)]">2026–27</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[var(--wp-silver-mute)]">
            A primeira temporada da Wakanda Pro na FIRST Tech Challenge. Este é
            o mapa do desafio: o que é a FTC, o que esperamos do jogo e onde
            vamos contar cada passo.
          </p>
        </div>
      </section>

      <section className="border-t border-[var(--wp-edge)] py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[auto_1fr] lg:items-center lg:px-8">
          <figure className="mx-auto rounded-xl border border-[var(--wp-edge)] bg-[var(--wp-coal)] p-8">
            <FirstLogo width={356} height={280} className="w-48 lg:w-64" />
          </figure>
          <div>
            <p className="tech-meta">A COMPETIÇÃO</p>
            <h2 className="font-display mt-3 text-3xl font-extrabold text-[var(--wp-white)] lg:text-4xl">
              FIRST Tech Challenge
            </h2>
            <div className="mt-6 max-w-2xl space-y-4 text-[var(--wp-silver-mute)]">
              <p>
                A FTC é uma competição mundial de robótica para estudantes de
                ensino médio: cada equipe projeta, constrói e programa um robô
                para cumprir as missões do desafio da temporada — em autonomia
                e em operação controlada.
              </p>
              <p>
                Mas a competição vai além de resultados: avalia também o
                processo de engenharia, o registro do trabalho, o impacto na
                comunidade e os fortes valores de cooperação que o programa
                incentiva (desde o princípio chamamos de <i>gracious
                professionalism</i>).
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--wp-edge)] bg-[var(--wp-coal)] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="tech-meta mb-12">O DESAFIO DA TEMPORADA</p>
          <div className="grid gap-10 lg:grid-cols-2">
            <article className="rounded-xl border border-[var(--wp-edge)] bg-[var(--wp-void)] p-8 lg:p-10">
              <div className="mx-auto flex items-center justify-center mb-6 rounded-xl border border-[var(--wp-gold)]/30 bg-[var(--wp-coal)] p-8">
                <FirstLogo width={356} height={280} className="w-48 lg:w-64 object-contain" />
              </div>
              <h3 className="font-display mt-6 text-2xl font-extrabold text-[var(--wp-white)]">
                A estreia da Wakanda Pro
              </h3>
              <p className="mt-3 text-sm text-[var(--wp-silver-mute)] leading-relaxed">
                Nossa equipe entra no circuito com o número FTC 36580 e com a
                responsabilidade de representar {siteConfig.nomeEscolaPendente},
                de {siteConfig.cidade}/{siteConfig.estado}, em toda a trajetória
                da temporada.
              </p>
            </article>
            <article className="rounded-xl border border-[var(--wp-edge)] bg-[var(--wp-void)] p-8 lg:p-10">
              <div className="mx-auto flex items-center justify-center mb-6 rounded-xl border border-[var(--wp-gold)]/30 bg-[var(--wp-coal)] p-8">
                <Image
                  src={assets.logoBiobuzz}
                  alt="Logo do desafio BIOBUZZ 2026–27"
                  width={447}
                  height={447}
                  className="h-auto w-48 lg:w-56 object-contain"
                />
              </div>
              <h3 className="font-display mt-6 text-2xl font-extrabold text-[var(--wp-white)]">
                O tema BIOBUZZ
              </h3>
              <p className="mt-3 text-sm text-[var(--wp-silver-mute)] leading-relaxed">
                O desafio da temporada traz um campo cheio de missões inspiradas
                no mundo natural: colheitas, polinização e o equilíbrio entre
                organismo, tecnologia e ecologia. A cada repetição, a gente
                aprende que a engenharia também cuida do planeta.
              </p>
            </article>
          </div>

          <div className="mt-12 rounded-xl border border-[var(--wp-edge)] bg-[var(--wp-coal)] p-8 lg:p-12">
            <p className="tech-meta text-[var(--wp-gold-soft)] mb-3">PLATAFORMA OFICIAL</p>
            <p className="mb-6 max-w-2xl text-sm text-[var(--wp-silver-mute)] leading-relaxed">
              Para regras oficiais, cronograma e pontuação da temporada, acesse
              a plataforma da FIRST Tech Challenge:
            </p>
            <a
              href="https://www.firstinspires.org/programs/ftc/"
              target="_blank"
              rel="noopener"
              className="inline-flex h-11 items-center justify-center rounded border border-[var(--wp-gold)] px-7 py-3 font-mono text-xs uppercase tracking-[0.18em] text-[var(--wp-gold-soft)] transition-colors hover:bg-[var(--wp-gold)] hover:text-[var(--wp-void)]"
            >
              https://www.firstinspires.org/programs/ftc/ →
            </a>
          </div>

          <p className="mt-12 max-w-3xl border-l-2 border-[var(--wp-cyan)] pl-4 text-sm text-[var(--wp-silver-dim)]">
            Regras e detalhes de pontuação seguem apenas a documentação oficial
            da temporada. Aqui no site não repetimos valores do jogo: nós
            treinamos, executamos e registramos.
          </p>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 lg:grid-cols-2 lg:px-8">
          <Link
            href="/simulador"
            className="group rounded-xl border border-[var(--wp-edge)] bg-[var(--wp-coal)] p-8 transition-colors hover:border-[var(--wp-red-deep)]"
          >
            <p className="tech-meta">EXPLORAR O CAMPO</p>
            <h3 className="font-display mt-3 text-2xl font-extrabold text-[var(--wp-white)]">
              Abrir o simulador 3D →
            </h3>
            <p className="mt-3 text-sm text-[var(--wp-silver-mute)]">
              Testar trajetórias e estudar as missões do campo BIOBUZZ sem
              sair do navegador.
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}



