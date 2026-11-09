import Image from "next/image";
import { assets } from "@/data/assets";

/**
 * MembroAvatarBadge — avatar circular do membro da equipe.
 * - Se `foto` for informada, exibe a foto preenchendo o círculo.
 * - Caso contrário, exibe silhouette neutra com iniciais.
 * Sobre o avatar, dois emblemas dentro do círculo:
 * - Liga Robótica SESI Bahia (bottom-left)
 * - Escudo Wakanda Pro (bottom-right)
 */
export function MembroAvatarBadge({
  nome,
  foto,
  tamanho = "md",
}: {
  nome: string;
  foto?: string;
  tamanho?: "sm" | "md" | "lg";
}) {
  const iniciais = nome
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "WP";

  // Dimensões do avatar conforme o tamanho
  const dims = {
    sm: { wrapper: "h-12 w-12", img: "w-12 h-12", badge: "h-6 w-6", badgeImg: "h-5 w-5", offset: "-bottom-2 -left-2 -right-2", texto: "text-xs" },
    md: { wrapper: "h-24 w-24", img: "w-24 h-24", badge: "h-8 w-8", badgeImg: "h-7 w-7", offset: "-bottom-3 -left-3 -right-3", texto: "text-sm" },
    lg: { wrapper: "h-32 w-32", img: "w-32 h-32", badge: "h-10 w-10", badgeImg: "h-9 w-9", offset: "-bottom-4 -left-4 -right-4", texto: "text-base" },
  }[tamanho];

  const temFoto = Boolean(foto);

  return (
    <div className={`relative ${dims.wrapper} mx-auto shrink-0`}>
      {/* Foto do membro ou silhouette neutra */}
      {temFoto ? (
        <Image
          src={foto!}
          alt={`Foto de ${nome}`}
          width={96}
          height={96}
          className={`${dims.img} rounded-full object-cover border border-[var(--wp-edge)]`}
          priority
        />
      ) : (
        <div className={`${dims.img} rounded-full bg-[var(--wp-graphite)] flex items-center justify-center overflow-hidden relative`}>
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
            <span className={`${dims.texto} text-[var(--wp-silver-dim)] font-mono font-medium uppercase tracking-[0.08em]`}>
              {iniciais}
            </span>
          </div>
        </div>
      )}

      {/* Badge Liga Robótica — bottom-left dentro do círculo */}
      <div className={`absolute ${dims.offset.split(' ')[0]} ${dims.offset.split(' ')[1]} ${dims.offset.split(' ')[2]} ${dims.offset.split(' ')[3]} z-20 rounded-full border-2 border-[var(--wp-gold-soft)] bg-[var(--wp-void)] flex items-center justify-center shadow-[0_0_12px_rgba(224,176,80,0.4)]`}>
        <Image
          src={assets.logoLigaRobotica}
          alt="Liga Robótica SESI Bahia"
          width={48}
          height={48}
          className={`${dims.badgeImg} object-contain`}
        />
      </div>

      {/* Badge Wakanda Pro — bottom-right dentro do círculo */}
      <div className={`absolute ${dims.offset.split(' ')[0]} ${dims.offset.split(' ')[2]} z-20 rounded-full border-2 border-[var(--wp-gold-soft)] bg-[var(--wp-void)] flex items-center justify-center shadow-[0_0_12px_rgba(224,176,80,0.4)]`}>
        <Image
          src={assets.escudo}
          alt="Escudo Wakanda Pro"
          width={48}
          height={48}
          className={`${dims.badgeImg} object-contain`}
        />
      </div>
    </div>
  );
}
