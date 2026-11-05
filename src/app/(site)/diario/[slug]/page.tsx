import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getPosts } from "../content";
import { formatIsoDatePtBR } from "../date";

export const metadata: Metadata = {
  title: "Registro | Diário de bordo | Wakanda Pro 36580",
  description:
    "Registro do diário de bordo da Wakanda Pro, equipe FTC 36580 na temporada BIOBUZZ.",
};

type PageProps = { params: Promise<{ slug: string }> };

export default function JournalPostPage(props: PageProps) {
  return (
    <>
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <Link
            href="/diario"
            className="tech-meta hover:text-[var(--wp-white)] transition-colors"
          >
            ← Diário de bordo
          </Link>
          <Suspense fallback={<SkeletonPost />}>
            <PostBody params={props.params} />
          </Suspense>
        </div>
      </section>
    </>
  );
}

function SkeletonPost() {
  return (
    <div className="mt-10 space-y-4">
      <div className="h-6 w-32 animate-pulse rounded bg-[var(--wp-coal)]" />
      <div className="h-10 w-3/4 animate-pulse rounded bg-[var(--wp-coal)]" />
      <div className="h-24 w-full animate-pulse rounded bg-[var(--wp-coal)]" />
    </div>
  );
}

async function PostBody({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getPosts();
  const post = posts.find((p) => p.slug === slug);

  if (!post) notFound();

  return (
    <article className="mt-10">
      <p className="tech-meta">
        <span className="text-[var(--wp-red)]">{post.categoria}</span>
      </p>
      <h1 className="font-display mt-4 text-3xl font-extrabold text-[var(--wp-white)] lg:text-5xl">
        {post.titulo}
      </h1>
      <p className="tech-meta mt-6 border-y border-[var(--wp-edge)] py-4">
        {post.autor} · {formatIsoDatePtBR(post.publicadoEm)}
      </p>
      {post.resumo && (
        <p className="mt-8 text-lg text-[var(--wp-silver)]">{post.resumo}</p>
      )}
      <p className="mt-8 max-w-2xl border-l-2 border-[var(--wp-cyan)] pl-4 text-sm text-[var(--wp-silver-dim)]">
        O conteúdo completo deste registro é publicado conforme cadastrado no
        CMS da equipe, com revisão de autorização antes de exibir.
      </p>
    </article>
  );
}
