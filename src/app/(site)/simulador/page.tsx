import type { Metadata } from "next";
import siteConfig from "@/lib/site-config";
import { TechText } from "@/components/TechText";
import { SimulatorEmbed } from "./SimulatorEmbed";

export const metadata: Metadata = {
  title: "Simulador | Wakanda Pro 36580",
  description:
    "Entre no campo BIOBUZZ: explorar o simulador 3D da temporada para estudar as missões do jogo da FIRST Tech Challenge antes de programar o robô.",
};

export default function SimulatorPage() {
  return (
    <>
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="tech-meta">FERRAMENTA EXTERNA / ESTUDO DE CAMPO</p>
          <h1 className="font-display mt-4 text-4xl font-extrabold text-[var(--wp-white)] sm:text-5xl lg:text-6xl">
            <TechText texto="Entre no campo BIOBUZZ" destaque="BIOBUZZ" />
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[var(--wp-silver-mute)]">
            Antes de apertar o primeiro parafuso, a gente estuda o jogo. Este
            simulador 3D externo permite girar o campo, medir distâncias e
            entender cada missão da temporada direto no navegador — nada é
            carregado até você pedir.
          </p>

          <SimulatorEmbed url={siteConfig.linksExternos.simuladorBioBuzz} />

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <p className="rounded-xl border border-[var(--wp-edge)] bg-[var(--wp-coal)] p-5 text-sm text-[var(--wp-silver-dim)]">
              <span className="tech-meta block text-[var(--wp-silver-mute)]">O que é</span>
              <span className="mt-2 block">
                Ferramenta mantida por terceiros fora do nosso domínio. A
                Wakanda Pro usa o simulador para estudo de campo; a experiência
                completa pode variar conforme o dispositivo e a conexão.
              </span>
            </p>
            <p className="rounded-xl border border-[var(--wp-edge)] bg-[var(--wp-coal)] p-5 text-sm text-[var(--wp-silver-dim)]">
              <span className="tech-meta block text-[var(--wp-silver-mute)]">Regras do jogo</span>
              <span className="mt-2 block">
                Regras e detalhes de pontuação seguem apenas a documentação
                oficial da temporada. Números exibidos no simulador são
                referência de estudo e consulta.
              </span>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
