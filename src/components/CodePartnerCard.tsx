import Image from "next/image";

type CodePartnerCardProps = {
  title: string;
  logoSrc: string;
  logoAlt: string;
  logoWidth: number;
  logoHeight: number;
  body?: string;
  href?: string;
};

/**
 * CodePartnerCard — card estilo editor de código (linhas de número, símbolos
 * >_ e </>, bordas escuras), com logo centralizado.
 */
export function CodePartnerCard({
  title,
  logoSrc,
  logoAlt,
  logoWidth,
  logoHeight,
  body,
  href,
}: CodePartnerCardProps) {
  const placeholder =
    body ??
    "Informações da parceria serão preenchidas em breve pela equipe. Acompanhe o diário de bordo para atualizações.";

  return (
    <article className="relative rounded-xl border border-[var(--wp-edge)] bg-[var(--wp-coal)] p-6 transition-colors hover:border-[var(--wp-cyan)]/50">
      {/* Linhas de número à esquerda (estilo editor) */}
      <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col items-center text-[10px] text-[var(--wp-silver-dim)] pointer-events-none">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="h-6" />
        ))}
      </div>

      <div className="ml-6">
        {/* Header com símbolo >_ */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-[var(--wp-red)]">{">_"}</span>
          <h3 className="font-display text-sm font-extrabold text-[var(--wp-white)] uppercase tracking-[0.1em]">
            {title}
          </h3>
        </div>

        {/* Logo centralizado */}
        <div className="flex items-center justify-center mb-6">
          <Image
            src={logoSrc}
            alt={logoAlt}
            width={logoWidth}
            height={logoHeight}
            className="h-20 w-auto object-contain drop-shadow-[0_0_14px_rgba(0,0,0,0.6)]"
          />
        </div>

        {/* Corpo com símbolo de fechamento */}
        <div className="relative pl-2">
          <span className="absolute -left-3 top-0 text-[var(--wp-gold-soft)]/60 text-[10px]">`</span>
          <p className="text-sm text-[var(--wp-silver-mute)] leading-relaxed">
            {placeholder}
          </p>
          <span className="absolute -right-1 bottom-[-10px] text-[var(--wp-gold-soft)]/50 text-[10px]">
            `</span>
          {href && (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1 rounded border border-[var(--wp-edge)] px-3 py-1 font-mono text-xs text-[var(--wp-gold-soft)] hover:bg-[var(--wp-gold)] hover:text-[var(--wp-void)]"
              aria-label={`Conheça a ${title} (abre em nova aba)`}
            >
              Conheça a {title} →
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
