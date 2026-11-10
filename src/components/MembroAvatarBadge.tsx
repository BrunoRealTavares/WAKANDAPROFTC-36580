import Image from "next/image";

/**
 * MembroAvatarBadge — avatar circular do membro da equipe.
 * - Se `foto` for informada, exibe a foto preenchendo o círculo.
 * - Caso contrário, exibe silhouette neutra com iniciais.
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
    sm: { wrapper: "h-12 w-12", img: "w-12 h-12", texto: "text-xs" },
    md: { wrapper: "h-24 w-24", img: "w-24 h-24", texto: "text-sm" },
    lg: { wrapper: "h-32 w-32", img: "w-32 h-32", texto: "text-base" },
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
          className={`${dims.img} rounded-full object-cover border border-[var(--wp-edge)] hover:border-[var(--wp-gold)]`}
          preload
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
    </div>
  );
}

