import Image from "next/image";
import { assets } from "@/data/assets";

/**
 * FirstLogo — logo da FIRST Tech Challenge exibido dentro de um chip branco
 * com cantos arredondados e padding, para ficar legível sobre o tema escuro.
 */
export function FirstLogo({
  width = 356,
  height = 280,
  className = "",
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-lg bg-white p-2 ${className}`}
      aria-label="Logo da FIRST Tech Challenge"
    >
      <Image
        src={assets.logoFtc}
        alt="Logo da FIRST Tech Challenge"
        width={width}
        height={height}
        className="object-contain"
      />
    </div>
  );
}
