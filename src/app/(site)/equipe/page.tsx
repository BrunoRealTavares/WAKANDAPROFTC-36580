import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MembroAvatarBadge } from "@/components/MembroAvatarBadge";
import { assets } from "@/data/assets";
import { equipe, type GrupoEquipe } from "@/data/equipe";
import siteConfig from "@/lib/site-config";

export const metadata: Metadata = {
  title: "A Equipe | Wakanda Pro 36580",
  description:
    "Quem Ã© a Wakanda Pro, equipe de robÃ³tica estudantil de CamaÃ§ari/BA em estreia na FIRST Tech Challenge: origem do nome, nÃºmero 36580, missÃ£o, visÃ£o, valores e filosofia.",
};

const valores = [
  "ColaboraÃ§Ã£o acima de protagonismo individual",
  "Disciplina tÃ©cnica e Ã©tica em cada projeto",
  "Orgulho da nossa origem e da nossa gente",
  "Conhecimento compartilhado, nunca guardado",
];

const objetivos = [
  "Estrear na FIRST Tech Challenge com mÃ©todo, constÃ¢ncia e aprendizado real",
  "Construir e programar um robÃ´ competitivo, confiÃ¡vel e bem documentado",
  "Levar ciÃªncia e tecnologia a mais estudantes da nossa regiÃ£o",
  "Formar uma base de engenharia que sobreviva alÃ©m da primeira temporada",
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
              {`A EQUIPE / FTC ${siteConfig.numeroFtc} / ${siteConfig.cidade.toUpperCase()} Â· ${siteConfig.estado.toUpperCase()}`}
            </p>
            <h1 className="font-display mt-4 text-4xl font-extrabold text-[var(--wp-white)] sm:text-5xl lg:text-6xl">
              {siteConfig.nomeEquipe}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-[var(--wp-silver-mute)]">
              Somos uma equipe de robÃ³tica feita por estudantes: mÃ£os na moldura,
              cÃ³digo no notebook e uma certeza que nÃ£o sai da cabeÃ§a â€” talento
              existe em todo lugar, o que falta Ã© oportunidade. A nossa chegou.
            </p>
          </div>
          <Image
            src={assets.escudo}
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
            MÃ£os na moldura, cÃ³digo no notebook
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-[var(--wp-silver-mute)]">
            A lideranÃ§a tÃ©cnica e a mentoria conduzem; os grupos executam. A
            ordem Ã© deliberada: primeiro o cuidado, depois o time.
          </p>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {lideranca.map((m) => (
              <article
                key={m.nome}
                className="rounded-xl border border-[var(--wp-edge)] bg-[var(--wp-coal)] p-6 lg:p-8"
              >
                <MembroAvatarBadge nome={m.nome} tamanho="lg" />
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
                  {m.papel === "tecnica" ? "TÃ©cnica Â· LideranÃ§a" : "Mentora Â· Mentoria"}
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
              <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {equipe
                  .filter((m) => m.grupo === grupo && m.papel === "membro")
                  .map((m) => (
                    <li
                      key={m.nome}
                      className="rounded-xl border border-[var(--wp-edge)] bg-[var(--wp-coal)] p-6 transition-colors hover:border-[var(--wp-red-deep)]"
                    >
                      <MembroAvatarBadge nome={m.nome} tamanho="sm" />
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
            Wakanda nÃ£o Ã© destino. Ã‰ decisÃ£o de construir o prÃ³prio futuro.
          </h2>
          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <div className="space-y-4 text-[var(--wp-silver-mute)]">
              <p>
                Escolhemos o nome pela forÃ§a do afrofuturismo: a ideia de que o
                amanhÃ£ tambÃ©m pertence a quem hoje Ã© subestimado. Wakanda
                representa autonomia, conhecimento coletivo e inovaÃ§Ã£o nascida
                da prÃ³pria comunidade â€” os mesmos recursos que uma boa equipe de
                engenharia precisa ter.
              </p>
              <p>
                O <dfn>Pro</dfn> Ã© a nossa parte no trato: profissionalismo
                nascente, o tempo que se aprende fazendo. Cada temporada Ã© um
                degrau entre o que sonhamos e o que jÃ¡ sabemos construir.
              </p>
            </div>
            <div className="space-y-4 text-[var(--wp-silver-mute)]">
              <p>
                Somos estreantes na FIRST Tech Challenge â€” e assumimos isso com
                orgulho. Ser estreante significa aprender rÃ¡pido, errar em voz
                alta e anotar tudo. Ã‰ assim que a gente transforma coragem em
                mÃ©todo.
              </p>
            </div>
          </div>
          <p className="mt-10 max-w-3xl border-l-2 border-[var(--wp-cyan)] bg-[var(--wp-coal)] p-4 text-sm text-[var(--wp-silver-dim)]">
            Wakanda Ã© um reino de ficÃ§Ã£o. O nome Ã© inspiraÃ§Ã£o estÃ©tica e
            simbÃ³lica; a equipe nÃ£o possui qualquer vÃ­nculo com a Marvel ou com
            qualquer marca.
          </p>
        </div>
      </section>

      <section className="border-t border-[var(--wp-edge)] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="tech-meta">MISSÃƒO Â· VISÃƒO Â· VALORES</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <article className="rounded-xl border border-[var(--wp-edge)] bg-[var(--wp-coal)] p-6">
              <p className="tech-meta text-[var(--wp-red)]">MISSÃƒO</p>
              <p className="mt-4 text-[var(--wp-silver)]">
                Aprender engenharia de verdade: projetar, construir, testar,
                programar e documentar com responsabilidade tÃ©cnica e trabalho
                em equipe.
              </p>
            </article>
            <article className="rounded-xl border border-[var(--wp-edge)] bg-[var(--wp-coal)] p-6">
              <p className="tech-meta text-[var(--wp-gold-soft)]">VISÃƒO</p>
              <p className="mt-4 text-[var(--wp-silver)]">
                Mostrar que uma primeira temporada bem construÃ­da pode inspirar
                outras equipes em CamaÃ§ari e no Brasil inteiro.
              </p>
            </article>
            <article className="rounded-xl border border-[var(--wp-edge)] bg-[var(--wp-coal)] p-6">
              <p className="tech-meta text-[var(--wp-cyan)]">VALORES</p>
              <ul className="mt-4 space-y-2 text-sm text-[var(--wp-silver)]">
                {valores.map((v) => (
                  <li key={v} className="flex gap-2">
                    <span aria-hidden className="text-[var(--wp-red)]">
                      â–¸
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
            <p className="tech-meta">NÃšMERO DE EQUIPE Â· FIRST TECH CHALLENGE</p>
            <p className="mt-2 max-w-xl text-sm text-[var(--wp-silver-mute)]">
              O nÃºmero Ã© a nossa assinatura em campo: identifica a Wakanda Pro
              em toda a temporada e em todo o circuito da competiÃ§Ã£o.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="tech-meta">FILOSOFIA</p>
          <h2 className="font-display mt-3 text-3xl font-extrabold text-[var(--wp-white)] lg:text-4xl">
            Conhecimento Ã© a nossa armadura
          </h2>
          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <div className="space-y-4 text-[var(--wp-silver-mute)]">
              <p>
                Primeira temporada Ã© humildade com prazo. NinguÃ©m aqui finge que
                domina tudo: a gente estuda, pergunta, desfaz e refaz. Erro
                anotado Ã© engenharia; erro escondido Ã© acidente esperando hora.
              </p>
              <p>
                A filosofia da Wakanda Pro Ã© simples: compartilhar o que se
                aprende. Ferramenta, ideia e conhecimento valem mais quando
                circulam â€” dentro da equipe, na escola e fora dela.
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
                Na pÃ¡gina de integrantes estÃ¡ a gente concreta: quem projeta,
                quem programa, quem compacta tudo em dia de decisÃ£o apertada.
              </p>
            </div>
            <Link
              href="/integrantes"
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--wp-red)] px-6 py-3 font-mono text-xs uppercase tracking-[0.18em] text-[var(--wp-white)] transition-colors hover:bg-[var(--wp-red)]"
            >
              Conhecer os integrantes â†’
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

