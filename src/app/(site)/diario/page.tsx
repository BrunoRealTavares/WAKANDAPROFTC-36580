import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getPosts } from "./content";
import { formatIsoDatePtBR } from "./date";

export const metadata: Metadata = {
  title: "Diário de bordo | Wakanda Pro 36580",
  description:
    "O registro honesto do dia a dia da Wakanda Pro na temporada BIOBUZZ: treinos, decisões de engenharia, erros registrados e aprendizados da primeira temporada FTC.",
};

type Post = Awaited<ReturnType<typeof getPosts>>[number];

export default function JournalPage() {
  return (
    <>
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="tech-meta">REGISTRO / TEMPORADA 2026–27</p>
          <h1 className="font-display mt-4 text-4xl font-extrabold text-[var(--wp-white)] sm:text-5xl lg:text-6xl">
            Diário de bordo
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[var(--wp-silver-mute)]">
            Aqui a gente conta como foi sem maquiar: treino puxado, peça que
            quebrou, código que finalmente rodou. Errar registrado é aprender
            duas vezes.
          </p>
        </div>
      </section>

      <section className="border-t border-[var(--wp-edge)] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Suspense
            fallback={
              <div className="space-y-4">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-24 animate-pulse rounded-xl bg-[var(--wp-coal)]" />
                ))}
              </div>
            }
          >
            <PostsArea />
          </Suspense>
        </div>
      </section>
    </>
  );
}

async function PostsArea() {
  const posts = await getPosts();

  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--wp-edge)] bg-[var(--wp-coal)] p-10 text-center lg:p-16">
        <p className="font-display mx-auto max-w-2xl text-2xl font-extrabold text-[var(--wp-silver)] lg:text-3xl">
          O diário de bordo está abrindo as primeiras páginas.
        </p>
        <p className="mt-4 text-sm text-[var(--wp-silver-dim)]">
          As publicações passam pela curadoria da equipe no CMS antes de
          aparecerem aqui — respeitando sempre o que pode ser público.
        </p>
      </div>
    );
  }

  const categorias: string[] = [];
  const grupos = new Map<string, Post[]>();
  for (const post of posts) {
    if (!grupos.has(post.categoria)) {
      grupos.set(post.categoria, []);
      categorias.push(post.categoria);
    }
    grupos.get(post.categoria)!.push(post);
  }

  return (
    <div className="space-y-16">
      {categorias.map((categoria) => (
        <div key={categoria}>
          <h2 className="tech-meta text-[var(--wp-gold-soft)]">{categoria.toUpperCase()}</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {grupos.get(categoria)!.map((post) => (
              <article
                key={post.id}
                className="flex flex-col rounded-xl border border-[var(--wp-edge)] bg-[var(--wp-coal)] p-6 transition-colors hover:border-[var(--wp-red-deep)]"
              >
                <p className="tech-meta">
                  <span className="text-[var(--wp-red)]">{post.categoria}</span>
                </p>
                <h3 className="font-display mt-3 text-xl font-extrabold text-[var(--wp-white)]">
                  <Link href={`/diario/${post.slug}`} className="hover:text-[var(--wp-gold-soft)]">
                    {post.titulo}
                  </Link>
                </h3>
                {post.resumo && (
                  <p className="mt-3 line-clamp-4 text-sm text-[var(--wp-silver-mute)]">
                    {post.resumo}
                  </p>
                )}
                <p className="tech-meta mt-auto pt-6">
                  {post.autor} · {formatIsoDatePtBR(post.publicadoEm)}
                </p>
              </article>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
