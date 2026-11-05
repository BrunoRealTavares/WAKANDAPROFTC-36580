import Image from "next/image";
import type { MembroEquipe } from "@/data/equipe";

/**
 * Avatar do integrante: mostra a foto quando existir; caso contrário,
 * as iniciais sobre vinho (#8b1c2b) com dourado (#e0b050).
 * Server component — sem JS necessário.
 */
export function MembroAvatar({ nome, foto }: Pick<MembroEquipe, "nome" | "foto">) {
  if (foto) {
    return (
      <Image
        src={foto}
        alt={`Foto de ${nome}`}
        width={96}
        height={96}
        className="h-24 w-24 rounded-full border border-[var(--wp-edge)] object-cover"
      />
    );
  }

  const partes = nome.trim().split(/\s+/).filter(Boolean);
  const primeira = partes[0]?.[0] ?? "";
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  const iniciais = (primeira + ultima).toUpperCase() || "W";

  return (
    <span
      aria-hidden
      className="grid h-24 w-24 place-items-center rounded-full border border-[var(--wp-gold)] bg-[var(--wp-red)] font-display text-2xl font-extrabold text-[var(--wp-gold-soft)]"
    >
      {iniciais}
    </span>
  );
}
