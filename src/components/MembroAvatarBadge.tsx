import Image from "next/image";
import { assets } from "@/data/assets";

/**
 * MembroAvatarBadge — avatar circular do membro da equipe.
 * - Se `foto` for informada, exibe a foto preenchendo o círculo.
 * - Caso contrário, exibe a imagem padrão imagem-fundo-integrantes.png.
 * Nunca exibe iniciais.
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
  // Dimensões do avatar conforme o tamanho
  const dims = {
    sm: { wrapper: "h-12 w-12", img: "w-12 h-12" },
    md: { wrapper: "h-24 w-24", img: "w-24 h-24" },
    lg: { wrapper: "h-32 w-32", img: "w-32 h-32" },
  }[tamanho];

  const src = foto ?? assets.imagemFundoIntegrantes;
  const ehPadrao = !foto;

  return (
    <div className={`relative ${dims.wrapper} mx-auto shrink-0`}>
      <Image
        src={src}
        alt={ehPadrao ? `Avatar de ${nome}` : `Foto de ${nome}`}
        width={96}
        height={96}
        className={`${dims.img} rounded-full object-cover border border-[var(--wp-edge)] hover:border-[var(--wp-gold)]`}
        preload
      />
    </div>
  );
}
