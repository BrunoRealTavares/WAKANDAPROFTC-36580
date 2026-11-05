import type { Metadata } from "next";
import Image from "next/image";
import siteConfig from "@/lib/site-config";

export const metadata: Metadata = {
  title: "A Escola | Wakanda Pro 36580",
  description:
    "A escola SESI Milton Santos, em Camaçari/BA, berço da equipe Wakanda Pro de robótica: o valor da educação científica e a formação de futuras carreiras em engenharia.",
};

export default function SchoolPage() {
  return (
    <>
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="tech-meta">ESCOLA / {siteConfig.cidade.toUpperCase()} · {siteConfig.estado.toUpperCase()}</p>
          <h1 className="font-display mt-4 text-4xl font-extrabold text-[var(--wp-white)] sm:text-5xl lg:text-6xl">
            Onde a ciência encontra a nossa gente
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[var(--wp-silver-mute)]">
            A {siteConfig.nomeEscolaPendente}, em {siteConfig.cidade}/{siteConfig.estado},
            é o ponto de partida do projeto: é lá que a Wakanda Pro se forma,
            se treina e descobre que engenharia também é herança cultural.
          </p>
          <p className="tech-meta mt-6 inline-block rounded border border-dashed border-[var(--wp-edge)] px-3 py-2">
            Nomenclatura institucional sujeita a confirmação
          </p>
        </div>
      </section>

      <section className="border-t border-[var(--wp-edge)] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="tech-meta">EDUCAÇÃO CIENTÍFICA</p>
          <h2 className="font-display mt-3 max-w-3xl text-3xl font-extrabold text-[var(--wp-white)] lg:text-4xl">
            Robótica é o tipo de aula que muda trajetória de vida
          </h2>
          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <div className="space-y-4 text-[var(--wp-silver-mute)]">
              <p>
                Quando uma escola abre espaço para ciência e tecnologia, ela
                entrega ao estudante algo raro: a experiência de transformar
                curiosidade em código concreto. Não é sobre trocar caneta por
                chave de fenda — é sobre decidir, medir, testar e melhorar.
              </p>
              <p>
                Projetos como a FIRST Tech Challenge ampliam isso. O desafio
                técnico vira desculpa para aprender trabalho em equipe,
                comunicação, gestão de tempo e troca de ideias. Essas
                habilidades atravessam a vida inteira de quem as aprende cedo.
              </p>
            </div>
            <div className="space-y-4 text-[var(--wp-silver-mute)]">
              <p>
                Em {siteConfig.cidade} e região, cada estudante que percebe que é
                capaz de projetar um robô também percebe que é capaz de projetar
                outra trajetória no amplo sentido: cursinho, universidade,
                carreira. A educação científica multiplica o futuro.
              </p>
              <p>
                Se o nome da escola homenagear o geógrafo Milton Santos,
                referência de pensamento crítico e de técnica a serviço das
                pessoas, a missão da equipe conversa direto com essa herança.
              </p>
            </div>
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
                  src="/img/bandeira-bahia.png"
                  alt="Bandeira do estado da Bahia"
                  width={479}
                  height={324}
                  className="h-auto w-full object-cover"
                />
              </div>
              <figcaption className="mt-4">
                <p className="font-display text-lg font-extrabold text-[var(--wp-white)]">
                  {siteConfig.estado}
                </p>
                <p className="tech-meta mt-1">BERÇO DO PROJETO</p>
              </figcaption>
            </figure>
            <figure className="rounded-xl border border-[var(--wp-edge)] p-6">
              <div className="overflow-hidden rounded-lg bg-[var(--wp-graphite)]">
                <Image
                  src="/img/bandeira-brasil.jpg"
                  alt="Bandeira do Brasil"
                  width={480}
                  height={340}
                  className="h-auto w-full object-cover"
                />
              </div>
              <figcaption className="mt-4">
                <p className="font-display text-lg font-extrabold text-[var(--wp-white)]">
                  {siteConfig.pais}
                </p>
                <p className="tech-meta mt-1">PALCO DA TEMPORADA FTC</p>
              </figcaption>
            </figure>
          </div>

          <p className="mt-12 max-w-3xl border-l-2 border-[var(--wp-cyan)] pl-4 text-sm text-[var(--wp-silver-dim)]">
            Informações institucionais detalhadas — história da unidade,
            instalações, equipamentos e região de abrangência — serão
            publicadas apenas quando confirmadas pela escola.
          </p>
        </div>
      </section>
    </>
  );
}
