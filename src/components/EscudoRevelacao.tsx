"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { assets } from "@/data/assets";

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_QUERY).matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

/**
 * EscudoRevelacao — substitui a interrogação vermelha pelo escudo da Wakanda Pro.
 * Mantém o clima de suspense com enquadramento tipo mira, brilho pulsante,
 * rotação lenta do anel tracejado e parallax sutil do mouse.
 * Respeita prefers-reduced-motion e funciona em SSR (sem acessar window no render).
 */
export function EscudoRevelacao({
  size = "lg",
}: {
  size?: "sm" | "lg" | "xl";
}) {
  const dims = {
    sm: { wrapper: "h-48 w-48", shield: "h-32 w-32" },
    lg: { wrapper: "h-64 w-64", shield: "h-48 w-48" },
    xl: { wrapper: "h-80 w-80", shield: "h-64 w-64" },
  }[size];

  const isReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isReducedMotion) return;
    const handler = (e: MouseEvent) => {
      const el = rootRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left - rect.width / 2) / rect.width) * 20;
      const y = ((e.clientY - rect.top - rect.height / 2) / rect.height) * 20;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [isReducedMotion]);

  return (
    <div
      ref={rootRef}
      data-testid="escudo-revelacao"
      className={`relative flex items-center justify-center ${dims.wrapper}`}
    >
      {/* Enquadramento tipo mira — cantos e anéis */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Cantoneiras técnicas */}
        <div className="absolute inset-0">
          <div className="absolute left-2 top-2 h-4 w-4 border-l-2 border-t-2 border-[var(--wp-red)]" />
          <div className="absolute right-2 top-2 h-4 w-4 border-r-2 border-t-2 border-[var(--wp-red)]" />
          <div className="absolute bottom-2 left-2 h-4 w-4 border-b-2 border-l-2 border-[var(--wp-red)]" />
          <div className="absolute bottom-2 right-2 h-4 w-4 border-b-2 border-r-2 border-[var(--wp-red)]" />
        </div>

        {/* Anel tracejado externo com rotação lenta */}
        <div
          className="absolute inset-0 rounded-full border-2 border-dashed border-[var(--wp-red)]/40"
          style={{
            animation: isReducedMotion ? "none" : "spin-slow 20s linear infinite",
          }}
        />

        {/* Círculo tracejado interno */}
        <div className="absolute inset-2 rounded-full border border-dashed border-[var(--wp-gold)]/30" />
      </div>

      {/* Brilho pulsante atrás do escudo */}
      <div
        className="absolute inset-0 rounded-full bg-[var(--wp-red)]/20 blur-2xl"
        style={{
          animation: isReducedMotion ? "none" : "pulse-slow 4s ease-in-out infinite",
          opacity: isReducedMotion ? 0.3 : 0.6,
        }}
      />

      {/* Escudo centralizado com parallax sutil */}
      <div
        className="relative z-10 flex items-center justify-center"
        style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
      >
        <Image
          src={assets.escudo}
          alt="Escudo da equipe Wakanda Pro — revelação em breve"
          width={192}
          height={192}
          preload
          className={`${dims.shield} rounded-full object-cover drop-shadow-[0_0_24px_rgba(139,28,43,0.8)]`}
        />
      </div>

      {/* Efeito elétrico elíptico ao redor do escudo */}
      <div
        className="absolute inset-2 rounded-full"
        style={{
          boxShadow: isReducedMotion
            ? "0 0 20px rgba(139, 28, 43, 0.4)"
            : "0 0 30px rgba(224, 176, 80, 0.5), 0 0 40px rgba(139, 28, 43, 0.6)",
          animation: isReducedMotion
            ? "none"
            : "electric-glow 3s ease-in-out infinite alternate",
        }}
      />
    </div>
  );
}
