/**
 * Acesso ao conteúdo público do diário. O contrato final da equipe
 * exporta getPublishedPosts em @/lib/public-content; este adaptador
 * também funciona no stub atual (função ainda não exportada), e
 * devolve lista vazia enquanto o banco não estiver pronto.
 */
import type { PostPublico } from "@/lib/public-content";
import * as publico from "@/lib/public-content";

type PostsFn = () => Promise<PostPublico[]>;

const fn = (publico as unknown as { getPublishedPosts?: PostsFn })
  .getPublishedPosts;

export async function getPosts(): Promise<PostPublico[]> {
  return fn ? fn() : [];
}
