import Image from "next/image";
import { assets } from "@/data/assets";

type ShieldProps = {
  /** Tamanho em pixels (a imagem base é quadrada). */
  size?: number;
  className?: string;
};

export function Shield({ size = 120, className = "" }: ShieldProps) {
  return (
    <Image
      src={assets.escudo}
      alt="Escudo da equipe Wakanda Pro Camaçari-BA"
      width={size}
      height={size}
      priority
      className={`h-auto w-full ${className}`}
    />
  );
}
