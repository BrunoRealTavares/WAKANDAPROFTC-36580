"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { assets } from "@/data/assets";

/**
 * EscudoRevelacao — substitui a interrogação vermelha pelo escudo da Wakanda Pro.
 * Mantém o clima de suspense com enquadramento tipo mira, brilho pulsante,
 * flutuação vertical, rotação lenta do anel tracejado e parallax sutil do mouse.
 * Respeita prefers-reduced-motion.
 */
export function EscudoRevelacao({ size = "lg" }: { size?: "sm" | "lg" | "xl" }) {
  const dims = {
    sm: { wrapper: "h-48 w-48", shield: "h-32 w-32", ring: "w-48 h-48" },
    lg: { wrapper: "h-64 w-64", shield: "h-48 w-48", ring: "w-64 h-64" },
    xl: { wrapper: "h-80 w-80", shield: "h-64 w-64", ring: "w-80 h-80" },
  }[size];

  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const [isReducedMotion, setIsReducedMotion] = useState(mq.matches);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = () => setIsReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mq]);

  useEffect(() => {
    if (isReducedMotion) return;
    const handler = (e: MouseEvent) => {
      const el = document.querySelector('[data-testid="escudo-revelacao"]');
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left - rect.width / 2) / rect.width) * 20;
      const y = ((e.clientY - rect.top - rect.height / 2) / rect.height) * 20;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [isReducedMotion]);

  const shieldStyle: React.CSSProperties = {
    transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
  };

  return (
    <div
      data-testid="escudo-revelacao"
      className="relative flex flex-col items-center justify-center"
      style={{ width: dims.wrapper.replace("h-", "").split(" ")[0] + "rem" }}
    >
      {/* Enquadramento tipo mira — cantos e grade */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ width: dims.ring, height: dims.ring }}>
        {/* Cantoneiras técnicas */}
        <div className="absolute inset-0">
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[var(--wp-red)]" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[var(--wp-red)]" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[var(--wp-red)]" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[var(--wp-red)]" />
        </div>

        {/* Anel tracejado externo com rotação lenta */}
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-[var(--wp-red)]/40" style={{ animation: isReducedMotion ? "none" : "spin-slow 20s linear infinite" }} />

        {/* Círculo tracejado interno */}
        <div className="absolute inset-2 rounded-full border border-dashed border-[var(--wp-gold)]/30" />
      </div>

      {/* Brilho pulsante atrás do escudo */}
      <div className="absolute inset-0 rounded-full bg-[var(--wp-red)]/20 blur-[3xl]" style={{ animation: isReducedMotion ? "none" : "pulse-slow 4s ease-in-out infinite", opacity: isReducedMotion ? 0.3 : 0.6 }} />

      {/* Escudo centralizado */}
      <div className="relative z-10 flex items-center justify-center" style={shieldStyle}>
        <Image
          src={assets.escudo}
          alt="Escudo da equipe Wakanda Pro — revelação em breve"
          width={192}
          height={192}
          className={`${dims.shield} rounded-full object-cover drop-shadow-[0_0_24px_rgba(139,28,43,0.8)]`}
          priority
        />
      </div>

      {/* Efeito elétrico (fallback estático se ElectricLogo não carregar) */}
      <div className="absolute inset-0 rounded-full" style={{ boxShadow: isReducedMotion ? "0 0 20px rgba(139, 28, 43, 0.4)" : "0 0 30px rgba(224, 176, 80, 0.5), 0 0 40px rgba(139, 28, 43, 0.6)", animation: isReducedMotion ? "none" : "electric-glow 3s ease-in-out infinite alternate" }} />
    </div>
  );
}
