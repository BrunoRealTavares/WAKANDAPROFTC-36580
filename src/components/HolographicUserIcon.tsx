"use client";

import { useEffect, useRef } from "react";

/**
 * HolographicUserIcon — ícone de perfil do usuário com brilho neon ciano/teal
 * dentro de um retículo de mira (target). Sem dependências de imagem externa.
 * Respeita prefers-reduced-motion.
 */
export function HolographicUserIcon({ size = 220 }: { size?: number }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const scan = el.querySelector<HTMLDivElement>("[data-holo='scan']");
    if (!scan) return;
    let frame: number;
    function animate() {
      const t = Date.now() / 1000;
      const y = ((t * 40) % (size + 60)) - 30;
      scan!.style.transform = `translateY(${y}px)`;
      frame = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(frame);
  }, [size]);

  return (
    <div
      ref={root}
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Target reticle — grades concêntricas */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full h-full rounded-full border border-[var(--wp-cyan)]/35" />
        <div className="w-[70%] h-[70%] rounded-full border border-[var(--wp-cyan)]/20" />
        <div className="w-[45%] h-[45%] rounded-full border border-[var(--wp-cyan)]/25" />
        <div className="w-[20%] h-[20%] rounded-full border-[2px] border-[var(--wp-cyan)]" />

        {/* Crosshair (linhas de mira) */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[var(--wp-cyan)]/30" />
          <div className="absolute left-1/2 top-0 h-full w-[1px] bg-[var(--wp-cyan)]/30" />
          {/* Cantões do retículo */}
          <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-[var(--wp-cyan)]" />
          <div className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-[var(--wp-cyan)]" />
          <div className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 border-[var(--wp-cyan)]" />
          <div className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-[var(--wp-cyan)]" />
        </div>
      </div>

      {/* Scanline horizontal */}
      <div
        data-holo="scan"
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--wp-cyan)] to-transparent opacity-60 blur-[1px] pointer-events-none"
      />

      {/* Ícone de usuário — glow ciano */}
      <div className="relative z-10 flex items-center justify-center">
        <div className="absolute -inset-2 rounded-full bg-[var(--wp-cyan)]/25 blur-[3xl] animate-pulse" />
        <svg
          viewBox="0 0 24 24"
          className="h-14 w-14 text-[var(--wp-cyan)] drop-shadow-[0_0_16px_rgba(53,201,222,0.9)]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>
    </div>
  );
}
