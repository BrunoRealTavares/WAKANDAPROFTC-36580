import type { Metadata } from "next";
import siteConfig from "@/lib/site-config";
import { RedQuestionMark } from "@/components/RedQuestionMark";

export const metadata: Metadata = {
  title: "O Robô | Wakanda Pro 36580",
  description:
    "Vibranium, o robô da Wakanda Pro para a temporada BIOBUZZ da FIRST Tech Challenge: inspiração, objetivos de engenharia e status de construção. A imagem oficial ainda não foi revelada.",
};

const objetivosEngenharia = [
  {
    titulo: "Consistência mecânica",
    texto:
      "Mecanismos que respondem igual, autonomia atrás de autonomia. Robô bom é o robô que não surpreende a própria equipe.",
  },
  {
    titulo: "Programação orientada a missões",
    texto:
      "Código escrito para o jogo: trajetórias testadas, respostas rápidas por controle e autonomia confiável nos primeiros segundos.",
  },
  {
    titulo: "Diagnóstico e testes",
    texto:
      "Ciclos curtos de testar, medir, ajustar e repetir. Cada falha registrada vira hipótese; cada hipótese testada vira melhoria.",
  },
  {
    titulo: "Processo documentado",
    texto:
      "Caderno de engenharia em ordem dia após dia: decisões, justificativas e aprendizados prontos para ser apresentados a qualquer juiz.",
  },
];

export default function RobotPage() {
  return (
    <>
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="tech-meta">PROJETO / ROBÔ / FTC {siteConfig.numeroFtc}</p>
          <h1 className="font-display mt-4 text-4xl font-extrabold text-[var(--wp-white)] sm:text-5xl lg:text-6xl">
            {siteConfig.nomeRobo}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[var(--wp-silver-mute)]">
            O nosso robô de competição para a temporada BIOBUZZ 2026–27. Ele
            ainda está sendo construído — e o mistério faz parte do projeto.
          </p>
        </div>
      </section>

      <section className="border-t border-[var(--wp-edge)] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid place-items-center rounded-xl border border-dashed border-[var(--wp-edge)] bg-[var(--wp-coal)] px-5 py-16 lg:py-24">
            <RedQuestionMark size="lg" />
            <p className="tech-meta mt-8">VISUAL DO ROBÔ NÃO REVELADO</p>
          </div>

          <ul className="mt-10 flex flex-wrap justify-center gap-x-10 gap-y-3">
            <li className="tech-meta">STATUS: EM CONSTRUÇÃO</li>
            <li className="tech-meta">PROJ-36580</li>
            <li className="tech-meta">TEMPORADA BIOBUZZ 2026–27</li>
          </ul>

          {siteConfig.roboRevelado ? (
            <p className="mt-10 max-w-2xl border-l-2 border-[var(--wp-cyan)] pl-4 text-sm text-[var(--wp-silver-dim)]">
              A imagem oficial do robô foi autorizada pela equipe e será
              exibida a partir do CMS assim que publicada.
            </p>
          ) : (
            <div className="mt-10 text-center">
              <div className="mx-auto max-w-2xl rounded-xl border border-dashed border-[var(--wp-gold)] bg-[var(--wp-coal)] p-6">
                <p className="tech-meta text-[var(--wp-gold-soft)]">REVELAÇÃO OFICIAL</p>
                <p className="mt-2 text-sm text-[var(--wp-silver-mute)]">
                  A imagem oficial do Vibranium será revelada em breve.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-[var(--wp-edge)] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-2">
            <div>
              <p className="tech-meta">O NOME</p>
              <h2 className="font-display mt-3 text-3xl font-extrabold text-[var(--wp-white)] lg:text-4xl">
                Menos magia, mais método
              </h2>
              <div className="mt-6 space-y-4 text-[var(--wp-silver-mute)]">
                <p>
                  Na ficção de Wakanda, o Vibranium é um metal vindo de um
                  meteorito: leve, quase indestrutível e capaz de absorver a
                  energia de golpes e explosões em vez de transferi-la. É a
                  base da tecnologia de Wakanda — e aparece no escudo do
                  Capitão América e no uniforme do Pantera Negra.
                </p>
                <p>
                  É essa ideia que a gente leva para o campo: absorver os
                  desafios da temporada — tempo curto, peças que falham, código
                  que quebra — e transformá-los em força real: método, testes e
                  trabalho de equipe.
                </p>
                <p>
                  A referência é puramente simbólica e nasce no mesmo lugar da
                  inspiração da equipe: afrofuturismo e imaginação a serviço da
                  engenharia. O metal fictício não entra no bill of materials —
                  o que entra é alumínio, parafuso, motor e lógica.
                </p>
              </div>
            </div>
            <div>
              <p className="tech-meta">NA MESA DE ENGENHARIA</p>
              <h2 className="font-display mt-3 text-3xl font-extrabold text-[var(--wp-white)] lg:text-4xl">
                O que importa de verdade
              </h2>
              <ul className="mt-6 space-y-6">
                {objetivosEngenharia.map((o, i) => (
                  <li key={o.titulo} className="flex items-start gap-4">
                    <span className="font-display text-xl font-extrabold text-[var(--wp-silver-dim)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-semibold text-[var(--wp-silver)]">{o.titulo}</h3>
                      <p className="mt-1 text-sm text-[var(--wp-silver-mute)]">{o.texto}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
