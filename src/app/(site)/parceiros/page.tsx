import type { Metadata } from "next";
import { Suspense } from "react";
import { getPublishedPartners } from "@/lib/public-content";
import { ContactForm } from "../contato/ContactForm";

export const metadata: Metadata = {
  title: "Parceiros | Wakanda Pro 36580",
  description:
    "Como apoiar a Wakanda Pro, equipe FTC 36580 de Camaçari/BA: materiais, ferramentas, transporte, formas de apoio técnico e o canal de interesse em parceria.",
};

type Parceiro = Awaited<ReturnType<typeof getPublishedPartners>>[number];

/**
 * Lista editável de necessidades — pendência explícita: os itens abaixo
 * são exemplos genéricos e devem ser preenchidos pela equipe.
 */
const necessidadesPendentes: Array<{ area: string; item: string }> = [
  {
    area: "Material",
    item: "Apoiadores de materiais de construção, alumínio e fixadores — item genérico, pendente de preenchimento pela equipe.",
  },
  {
    area: "Ferramentas",
    item: "Apoiadores de ferramentas básicas de oficina — item genérico, pendente de preenchimento pela equipe.",
  },
  {
    area: "Transporte",
    item: "Apoiadores de deslocamentos da equipe — item genérico, pendente de preenchimento pela equipe.",
  },
];

const formasApoio = [
  {
    titulo: "Financeiro",
    texto:
      "Contribuição para custos de registro, peças e agenda de competições, com reconhecimento nas rotas oficiais da equipe.",
  },
  {
    titulo: "Material",
    texto:
      "Doação ou empréstimo de peças, componentes, ferramentas e insumos de oficina que mantêm o robô em construção.",
  },
  {
    titulo: "Técnico",
    texto:
      "Mentoria de engenharia, programação ou gestão de projeto — uma hora da semana de um profissional muda a temporada.",
  },
  {
    titulo: "Educacional",
    texto:
      "Acesso a palestras, visitas técnicas e apresentações para que a equipe inspire outras escolas da região.",
  },
];

export default function PartnersPage() {
  return (
    <>
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="tech-meta">APOIO / EQUIPE 36580</p>
          <h1 className="font-display mt-4 text-4xl font-extrabold text-[var(--wp-white)] sm:text-5xl lg:text-6xl">
            Parceiros e apoiadores
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[var(--wp-silver-mute)]">
            Nenhuma engenharia de estreia acontece sozinha. Quem apoia a
            Wakanda Pro financia muito mais do que um robô: financia
            estudantes de Camaçari descobrindo o próprio talento técnico.
          </p>
        </div>
      </section>

      <section className="border-t border-[var(--wp-edge)] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="tech-meta">O QUE A EQUIPE PRECISA</p>
          <p className="mt-3 inline-block rounded border border-dashed border-[var(--wp-edge)] px-3 py-2 text-xs text-[var(--wp-silver-dim)]">
            Pendência: lista de necessidades a ser preenchida pela equipe — os
            itens abaixo são exemplos genéricos.
          </p>
          <table className="mt-8 w-full text-left">
            <caption className="sr-only">
              Necessidades do projeto por área de apoio
            </caption>
            <thead>
              <tr className="border-b border-[var(--wp-edge)]">
                <th scope="col" className="tech-meta px-4 pb-3">Área</th>
                <th scope="col" className="tech-meta px-4 pb-3">Necessidade</th>
              </tr>
            </thead>
            <tbody>
              {necessidadesPendentes.map((n) => (
                <tr key={n.area} className="border-b border-[var(--wp-graphite)]">
                  <th scope="row" className="px-4 py-4 align-top font-semibold text-[var(--wp-white)]">
                    {n.area}
                  </th>
                  <td className="px-4 py-4 text-sm text-[var(--wp-silver-mute)]">{n.item}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="border-t border-[var(--wp-edge)] bg-[var(--wp-coal)] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="tech-meta mb-12">FORMAS DE APOIO</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {formasApoio.map((f, i) => (
              <article
                key={f.titulo}
                className="rounded-xl border border-[var(--wp-edge)] bg-[var(--wp-void)] p-6"
              >
                <span className="font-display text-2xl font-extrabold text-[var(--wp-silver-dim)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display mt-2 text-xl font-extrabold text-[var(--wp-white)]">
                  {f.titulo}
                </h3>
                <p className="mt-3 text-sm text-[var(--wp-silver-mute)]">{f.texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--wp-edge)] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="tech-meta">PARCEIROS OFICIAIS</p>
          <Suspense
            fallback={
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-28 animate-pulse rounded-xl bg-[var(--wp-coal)]" />
                ))}
              </div>
            }
          >
            <PartnersGrid />
          </Suspense>
        </div>
      </section>

      <section className="border-t border-[var(--wp-edge)] py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <p className="tech-meta">QUERO APOIAR</p>
          <h2 className="font-display mt-3 text-3xl font-extrabold text-[var(--wp-white)] lg:text-4xl">
            Marque interesse em parceria
          </h2>
          <p className="mt-4 text-[var(--wp-silver-mute)]">
            Preencha o formulário abaixo: a mensagem chega à equipe com
            assunto de parceria e ninguém responde com bulk. Preencha os
            campos marcados com *.
          </p>
          <div className="mt-8 rounded-xl border border-[var(--wp-edge)] bg-[var(--wp-coal)] p-6 lg:p-10">
            <ContactForm assuntoFixo="interesse-parceria" />
          </div>
        </div>
      </section>
    </>
  );
}

async function PartnersGrid() {
  const parceiros = await getPublishedPartners();

  if (parceiros.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--wp-edge)] bg-[var(--wp-coal)] p-10 text-center lg:p-14">
        <p className="font-display mx-auto max-w-xl text-xl font-extrabold text-[var(--wp-silver)]">
          Parceiros oficiais serão anunciados.
        </p>
        <p className="mt-3 text-sm text-[var(--wp-silver-dim)]">
          Cada parceria é formalizada e aprovada antes de aparecer aqui, com o
          mesmo respeito pelo nosso escudo.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {parceiros.map((p: Parceiro) => (
        <li
          key={p.id}
          className="rounded-xl border border-[var(--wp-edge)] bg-[var(--wp-coal)] p-6"
        >
          <p className="tech-meta">{p.nivel.toUpperCase()}</p>
          {p.url ? (
            <a
              href={p.url}
              target="_blank"
              rel="noopener"
              className="font-display mt-2 block text-lg font-extrabold text-[var(--wp-white)] hover:text-[var(--wp-gold-soft)]"
            >
              {p.nome} ↗
            </a>
          ) : (
            <p className="font-display mt-2 text-lg font-extrabold text-[var(--wp-white)]">
              {p.nome}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
