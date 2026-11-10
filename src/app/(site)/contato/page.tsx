import type { Metadata } from "next";
import { contato } from "@/data/contato";
import { TechText } from "@/components/TechText";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contato | Wakanda Pro 36580",
  description:
    "Fale com a Wakanda Pro, equipe FTC 36580 de Camaçari/BA: discussão geral, interesse em patrocínio, imprensa ou outros assuntos da temporada BIOBUZZ.",
};

export default function ContactPage() {
  return (
    <>
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="tech-meta">CANAL / EQUIPE 36580</p>
          <h1 className="font-display mt-4 text-4xl font-extrabold text-[var(--wp-white)] sm:text-5xl lg:text-6xl">
            <TechText texto="Fale com a Wakanda Pro" destaque="Wakanda Pro" />
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[var(--wp-silver-mute)]">
            Imprensa, patrocínio, dúvidas ou só energia boa: tudo passa por
            aqui. A gente lê com carinho e responde conforme a agenda de
            treinos da temporada.
          </p>
        </div>
      </section>

      <section className="border-t border-[var(--wp-edge)] py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[1fr_1.3fr] lg:px-8">
          <div>
            <p className="tech-meta">CONTATO INSTITUCIONAL</p>
            <div className="mt-6 space-y-6">
              <div className="rounded-xl border border-[var(--wp-edge)] bg-[var(--wp-coal)] p-6">
                <p className="tech-meta">E-MAIL OFICIAL</p>
                <a
                  href={`mailto:${contato.email}`}
                  className="mt-3 block text-[var(--wp-silver)] hover:text-[var(--wp-white)]"
                >
                  {contato.email}
                </a>
              </div>

              <div className="rounded-xl border border-[var(--wp-edge)] bg-[var(--wp-coal)] p-6">
                <p className="tech-meta">REDES SOCIAIS</p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li>
                    <a
                      href={contato.redesSociais.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--wp-silver)] hover:text-[var(--wp-white)]"
                      aria-label="Instagram da Wakanda Pro (abre em nova aba)"
                    >
                      Instagram @wakandaproftc ↗
                    </a>
                  </li>
                </ul>
              </div>

              <p className="border-l-2 border-[var(--wp-cyan)] pl-4 text-sm text-[var(--wp-silver-dim)]">
                A localização exata da equipe e a agenda de treinos nunca são
                publicadas — proteção de menores vem antes de tudo.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--wp-edge)] bg-[var(--wp-coal)] p-6 lg:p-10">
            <h2 className="font-display text-2xl font-extrabold text-[var(--wp-white)] lg:text-3xl">
              Manda a mensagem
            </h2>
            <p className="mt-3 text-sm text-[var(--wp-silver-mute)]">
              Campos obrigatórios marcados com *.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
