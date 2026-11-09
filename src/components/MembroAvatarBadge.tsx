import Image from "next/image";

/**
 * MembroAvatarBadge — avatar circular com silhouette neutra e dois emblemas
 * sobrepostos dentro do círculo:
 * - Liga Robótica SESI Bahia (bottom-left)
 * - Escudo Wakanda Pro (bottom-right)
 */
export function MembroAvatarBadge({ nome }: { nome: string }) {
  const iniciais = nome
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "WP";

  return (
    <div className="relative h-24 w-24 mx-auto shrink-0">
      {/* Silhouette neutra circular */}
      <div className="h-full w-full rounded-full bg-[var(--wp-graphite)] flex items-center justify-center overflow-hidden relative">
        <div className="flex flex-col items-center justify-center h-full w-full">
          <ellipse
            cx="50%"
            cy="40%"
            rx="38%"
            ry="44%"
            fill="var(--wp-coal)"
            className="relative z-10"
          />
          <circle cx="50%" cy="30%" r="18%" fill="var(--wp-coal)" className="relative z-10" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[var(--wp-silver-dim)] text-sm font-mono font-medium uppercase tracking-[0.08em]">
            {iniciais}
          </span>
        </div>
      </div>

      {/* Badge Liga Robótica — bottom-left dentro do círculo */}
      <div className="absolute -bottom-3 -left-3 h-8 w-8 z-20 rounded-full border-2 border-[var(--wp-gold-soft)] bg-[var(--wp-void)] flex items-center justify-center shadow-[0_0_12px_rgba(224,176,80,0.4)]">
        <Image
          src="/img/logo-liga-robotica-sesi-bahia.jpg"
          alt="Liga Robótica SESI Bahia"
          width={48}
          height={48}
          className="h-7 w-7 object-contain"
        />
      </div>

      {/* Badge Wakanda Pro — bottom-right dentro do círculo */}
      <div className="absolute -bottom-3 -right-3 h-8 w-8 z-20 rounded-full border-2 border-[var(--wp-gold-soft)] bg-[var(--wp-void)] flex items-center justify-center shadow-[0_0_12px_rgba(224,176,80,0.4)]">
        <Image
          src="/img/escudo-wakanda-pro.png"
          alt="Escudo Wakanda Pro"
          width={48}
          height={48}
          className="h-7 w-7 object-contain"
        />
      </div>
    </div>
  );
}
