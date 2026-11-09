import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MembroAvatarBadge } from "@/components/MembroAvatarBadge";
import { equipe, type GrupoEquipe } from "@/data/equipe";
import siteConfig from "@/lib/site-config";

export const metadata: Metadata = {
  title: "A Equipe | Wakanda Pro 36580",
  description:
    "Quem é a Wakanda Pro, equipe de robótica estudantil de Camaçari/BA em estreia na FIRST Tech Challenge: origem do nome, número 36580, missão, visão, valores e filosofia.",
};

const valores = [
  "Colaboração acima de protagonismo individual",
  "Disciplina técnica e ética em cada projeto",
  "Orgulho da nossa origem e da nossa gente",
  "Conhecimento compartilhado, nunca guardado",
];

const objetivos = [
  "Estrear na FIRST Tech Challenge com método, constância e aprendizado real",
  "Construir e programar um robô competitivo, confiável e bem documentado",
  "Levar ciência e tecnologia a mais estudantes da nossa região",
  "Formar uma base de engenharia que sobreviva além da primeira temporada",
];

export default function TeamPage() {
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
      <section className="py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[1.4fr_auto] lg:items-center lg:px-8">
          <div>
            <p className="tech-meta">
              {`A EQUIPE / FTC ${siteConfig.numeroFtc} / ${siteConfig.cidade.toUpperCase()} · ${siteConfig.estado.toUpperCase()}`}
            </p>
            <h1 className="font-display mt-4 text-4xl font-extrabold text-[var(--wp-white)] sm:text-5xl lg:text-6xl">
              {siteConfig.nomeEquipe}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-[var(--wp-silver-mute)]">
              Somos uma equipe de robótica feita por estudantes: mãos na moldura,
              código no notebook e uma certeza que não sai da cabeça — talento
              existe em todo lugar, o que falta é oportunidade. A nossa chegou.
            </p>
          </div>
          <Image
            src="/img/escudo-wakanda-pro.png"
            alt={`Escudo da equipe ${siteConfig.nomeEquipe}`}
            width={240}
            height={240}
            className="mx-auto h-40 w-40 rounded-xl border border-[var(--wp-edge)] lg:h-56 lg:w-56"
          />
        </div>
      </section>

      <section className="border-t border-[var(--wp-edge)] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="tech-meta">
            EQUIPE / FTC {siteConfig.numeroFtc} / {siteConfig.cidade.toUpperCase()}
          </p>
          <h2 className="font-display mt-3 max-w-3xl text-3xl font-extrabold text-[var(--wp-white)] lg:text-4xl">
            Mãos na moldura, código no notebook
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-[var(--wp-silver-mute)]">
            A liderança técnica e a mentoria conduzem; os grupos executam. A
            ordem é deliberada: primeiro o cuidado, depois o time.
          </p>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {lideranca.map((m) => (
              <article
                key={m.nome}
                className="rounded-xl border border-[var(--wp-edge)] bg-[var(--wp-coal)] p-6 lg:p-8"
              >
                <MembroAvatarBadge nome={m.nome} />
                <h3 className="font-display mt-5 text-2xl font-extrabold text-[var(--wp-white)]">
                  {m.nome}
                </h3>
                <p
                  className={
                    m.papel === "tecnica"
                      ? "tech-meta mt-2 text-[var(--wp-red)]"
                      : "tech-meta mt-2 text-[var(--wp-gold-soft)]"
                  }
                >
                  {m.papel === "tecnica" ? "Técnica · Liderança" : "Mentora · Mentoria"}
                </p>
                {m.frase && (
                  <p className="mt-4 text-[var(--wp-silver-mute)]">{m.frase}</p>
                )}
              </article>
            ))}
          </div>

          {grupos.map((grupo) => (
            <div key={grupo} className="mt-16">
              <p className="tech-meta text-[var(--wp-gold-soft)]">GRUPO {grupo}</p>
              <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {equipe
                  .filter((m) => m.grupo === grupo && m.papel === "membro")
                  .map((m) => (
                    <li
                      key={m.nome}
                      className="rounded-xl border border-[var(--wp-edge)] bg-[var(--wp-coal)] p-6 transition-colors hover:border-[var(--wp-red-deep)]"
                    >
                      <MembroAvatarBadge nome={m.nome} />
                      <h3 className="mt-4 font-semibold text-[var(--wp-white)]">
                        {m.nome}
                      </h3>
                      {m.frase && (
                        <p className="mt-2 text-sm text-[var(--wp-silver-mute)]">
                          {m.frase}
                        </p>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--wp-edge)] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="tech-meta">ORIGEM DO NOME</p>
          <h2 className="font-display mt-3 max-w-3xl text-3xl font-extrabold text-[var(--wp-white)] lg:text-4xl">
            Wakanda não é destino. É decisão de construir o próprio futuro.
          </h2>
          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <div className="space-y-4 text-[var(--wp-silver-mute)]">
              <p>
                Escolhemos o nome pela força do afrofuturismo: a ideia de que o
                amanhã também pertence a quem hoje é subestimado. Wakanda
                representa autonomia, conhecimento coletivo e inovação nascida
                da própria comunidade — os mesmos recursos que uma boa equipe de
                engenharia precisa ter.
              </p>
              <p>
                O <dfn>Pro</dfn> é a nossa parte no trato: profissionalismo
                nascente, o tempo que se aprende fazendo. Cada temporada é um
                degrau entre o que sonhamos e o que já sabemos construir.
              </p>
            </div>
            <div className="space-y-4 text-[var(--wp-silver-mute)]">
              <p>
                Somos estreantes na FIRST Tech Challenge — e assumimos isso com
                orgulho. Ser estreante significa aprender rápido, errar em voz
                alta e anotar tudo. É assim que a gente transforma coragem em
                método.
              </p>
            </div>
          </div>
          <p className="mt-10 max-w-3xl border-l-2 border-[var(--wp-cyan)] bg-[var(--wp-coal)] p-4 text-sm text-[var(--wp-silver-dim)]">
            Wakanda é um reino de ficção. O nome é inspiração estética e
            simbólica; a equipe não possui qualquer vínculo com a Marvel ou com
            qualquer marca.
          </p>
        </div>
      </section>

      <section className="border-t border-[var(--wp-edge)] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="tech-meta">MISSÃO · VISÃO · VALORES</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <article className="rounded-xl border border-[var(--wp-edge)] bg-[var(--wp-coal)] p-6">
              <p className="tech-meta text-[var(--wp-red)]">MISSÃO</p>
              <p className="mt-4 text-[var(--wp-silver)]">
                Aprender engenharia de verdade: projetar, construir, testar,
                programar e documentar com responsabilidade técnica e trabalho
                em equipe.
              </p>
            </article>
            <article className="rounded-xl border border-[var(--wp-edge)] bg-[var(--wp-coal)] p-6">
              <p className="tech-meta text-[var(--wp-gold-soft)]">VISÃO</p>
              <p className="mt-4 text-[var(--wp-silver)]">
                Mostrar que uma primeira temporada bem construída pode inspirar
                outras equipes em Camaçari e no Brasil inteiro.
              </p>
            </article>
            <article className="rounded-xl border border-[var(--wp-edge)] bg-[var(--wp-coal)] p-6">
              <p className="tech-meta text-[var(--wp-cyan)]">VALORES</p>
              <ul className="mt-4 space-y-2 text-sm text-[var(--wp-silver)]">
                {valores.map((v) => (
                  <li key={v} className="flex gap-2">
                    <span aria-hidden className="text-[var(--wp-red)]">
                      ▸
                    </span>
                    {v}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--wp-edge)] bg-[var(--wp-coal)] py-14">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-5 lg:flex-row lg:items-center lg:gap-12 lg:px-8">
          <span className="font-display text-6xl font-extrabold text-[var(--wp-gold-soft)] lg:text-8xl">
            {siteConfig.numeroFtc}
          </span>
          <div>
            <p className="tech-meta">NÚMERO DE EQUIPE · FIRST TECH CHALLENGE</p>
            <p className="mt-2 max-w-xl text-sm text-[var(--wp-silver-mute)]">
              O número é a nossa assinatura em campo: identifica a Wakanda Pro
              em toda a temporada e em todo o circuito da competição.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="tech-meta">FILOSOFIA</p>
          <h2 className="font-display mt-3 text-3xl font-extrabold text-[var(--wp-white)] lg:text-4xl">
            Conhecimento é a nossa armadura
          </h2>
          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <div className="space-y-4 text-[var(--wp-silver-mute)]">
              <p>
                Primeira temporada é humildade com prazo. Ninguém aqui finge que
                domina tudo: a gente estuda, pergunta, desfaz e refaz. Erro
                anotado é engenharia; erro escondido é acidente esperando hora.
              </p>
              <p>
                A filosofia da Wakanda Pro é simples: compartilhar o que se
                aprende. Ferramenta, ideia e conhecimento valem mais quando
                circulam — dentro da equipe, na escola e fora dela.
              </p>
            </div>
            <div>
              <p className="tech-meta mb-4">OBJETIVOS DA TEMPORADA</p>
              <ol className="space-y-4">
                {objetivos.map((o, i) => (
                  <li key={o} className="flex items-start gap-4">
                    <span className="font-display text-2xl font-extrabold text-[var(--wp-silver-dim)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm text-[var(--wp-silver)]">{o}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="mt-16 flex flex-col gap-6 rounded-xl border border-[var(--wp-edge)] bg-[var(--wp-coal)] p-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="font-display text-2xl font-extrabold text-[var(--wp-white)]">
                Quer conhecer quem faz acontecer?
              </h3>
              <p className="mt-2 max-w-xl text-sm text-[var(--wp-silver-mute)]">
                Na página de integrantes está a gente concreta: quem projeta,
                quem programa, quem compacta tudo em dia de decisão apertada.
              </p>
            </div>
            <Link
              href="/integrantes"
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--wp-red)] px-6 py-3 font-mono text-xs uppercase tracking-[0.18em] text-[var(--wp-white)] transition-colors hover:bg-[var(--wp-red)]"
            >
              Conhecer os integrantes →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
