import type { Metadata } from "next";
import { equipe, type GrupoEquipe, type MembroEquipe } from "@/data/equipe";
import { MembroAvatarBadge } from "@/components/MembroAvatarBadge";
import { TechText } from "@/components/TechText";

export const metadata: Metadata = {
  title: "Integrantes | Wakanda Pro 36580",
  description:
    "Quem compõe a Wakanda Pro: treinadora e integrantes da equipe de robótica de Camaçari/BA em sua primeira temporada na FIRST Tech Challenge.",
};

export default function MembersPage() {
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
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="tech-meta">PESSOAS / EQUIPE 36580</p>
          <h1 className="font-display mt-4 text-4xl font-extrabold text-[var(--wp-white)] sm:text-5xl lg:text-6xl">
            <TechText texto="Os integrantes" destaque="integrantes" />
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[var(--wp-silver-mute)]">
            Por trás de cada parafuso apertado e de cada linha de código, tem
            gente de verdade. Aqui é o lugar onde apresentamos a nós mesmos.
          </p>
        </div>
      </section>

      <section className="border-t border-[var(--wp-edge)] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="tech-meta text-[var(--wp-gold-soft)]">TREINADORA E TÉCNICA</p>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {lideranca.map((m) => (
              <article
                key={m.nome}
                className="flex items-center gap-6 rounded-xl border border-[var(--wp-edge)] bg-[var(--wp-coal)] p-6 lg:p-8"
              >
                <MembroAvatarBadge nome={m.nome} foto={m.foto} tamanho="lg" />
                <div>
                  <h2 className="font-display text-2xl font-extrabold text-[var(--wp-white)] lg:text-3xl">
                    {m.nome}
                  </h2>
                  <p
                    className={
                      m.papel === "tecnica"
                        ? "tech-meta mt-2 text-[var(--wp-red)]"
                        : "tech-meta mt-2 text-[var(--wp-gold-soft)]"
                    }
                  >
                    {m.papel === "tecnica" ? "TÉCNICA · LIDERANÇA" : "MENTORA · MENTORIA"}
                  </p>
                  {m.frase && (
                    <p className="mt-4 text-[var(--wp-silver-mute)]">{m.frase}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--wp-edge)] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="tech-meta mb-12">INTEGRANTES</p>

          {grupos.map((grupo) => (
            <div key={grupo} className="mb-16">
              <p className="tech-meta text-[var(--wp-gold-soft)]">GRUPO {grupo}</p>
              <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {equipe
                  .filter((m) => m.grupo === grupo && m.papel === "membro")
                  .map((m: MembroEquipe) => (
                    <li
                      key={m.nome}
                      className="rounded-xl border border-[var(--wp-edge)] bg-[var(--wp-coal)] p-6 transition-colors hover:border-[var(--wp-red-deep)]"
                    >
                      <MembroAvatarBadge nome={m.nome} foto={m.foto} tamanho="sm" />
                      <h3 className="mt-4 font-semibold text-[var(--wp-white)]">
                        {m.nome}
                      </h3>
                      <p className="tech-meta mt-1 text-[var(--wp-silver-mute)]">
                        {m.grupo}
                      </p>
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

          <p className="mt-12 max-w-3xl border-l-2 border-[var(--wp-cyan)] pl-4 text-sm text-[var(--wp-silver-dim)]">
            Fotos e identificações de menores dependem de autorização. Telefones,
            endereços e horários individuais nunca são publicados.
          </p>
        </div>
      </section>
    </>
  );
}
