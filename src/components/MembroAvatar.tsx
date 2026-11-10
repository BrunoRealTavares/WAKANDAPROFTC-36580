import Image from "next/image";
import type { MembroEquipe } from "@/data/equipe";
import { assets } from "@/data/assets";

/**
 * Avatar do integrante: mostra a foto quando existir; caso contrário,
 * a imagem padrão imagem-fundo-integrantes.png.
 * Server component — sem JS necessário.
 */
export function MembroAvatar({ nome, foto }: Pick<MembroEquipe, "nome" | "foto">) {
  const src = foto ?? assets.imagemFundoIntegrantes;
  const ehPadrao = !foto;

  return (
    <Image
      src={src}
      alt={ehPadrao ? `Avatar de ${nome}` : `Foto de ${nome}`}
      width={96}
      height={96}
      className="h-24 w-24 rounded-full border border-[var(--wp-edge)] object-cover"
      preload
    />
  );
}
