import Link from "next/link";
import { RedQuestionMark } from "@/components/RedQuestionMark";

export default function NotFound() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-6 text-center">
      <div className="wp-grid-bg absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="relative">
        <div className="mx-auto mb-6 w-fit opacity-90">
          <RedQuestionMark size="sm" />
        </div>
        <p className="tech-meta">ERRO 404</p>
        <h1 className="font-display mt-4 text-[clamp(2rem,5vw,3.4rem)] font-extrabold text-[var(--wp-white)]">
          Esta rota ainda não existe — como o nosso robô,
          <span className="block text-[var(--wp-red)]">ainda está sendo construída.</span>
        </h1>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="inline-flex h-12 items-center rounded bg-[var(--wp-red)] px-7 text-sm font-semibold text-white transition-colors hover:bg-[var(--wp-red-deep)]"
          >
            Voltar ao início
          </Link>
          <Link
            href="/contato"
            className="inline-flex h-12 items-center rounded border border-[var(--wp-edge)] px-7 text-sm text-[var(--wp-silver-mute)] transition-colors hover:text-[var(--wp-white)]"
          >
            Falar com a equipe
          </Link>
        </div>
      </div>
    </main>
  );
}
