import Image from "next/image";

type ShieldProps = {
  /** Tamanho em pixels (a imagem base é quadrada). */
  size?: number;
  className?: string;
};

export function Shield({ size = 120, className = "" }: ShieldProps) {
  return (
    <Image
      src="/img/escudo-wakanda-pro.png"
      alt="Escudo da equipe Wakanda Pro Camaçari-BA"
      width={size}
      height={size}
      priority
      className={`h-auto w-full ${className}`}
    />
  );
}
