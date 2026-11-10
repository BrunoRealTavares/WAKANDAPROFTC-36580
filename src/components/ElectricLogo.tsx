"use client";

import Image from "next/image";
import { useState, useSyncExternalStore } from "react";
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
 * ElectricLogo — logo com brilho elétrico e pulso dourado.
 * Usado no cabeçalho do site e como assinatura visual da equipe.
 * Respeita prefers-reduced-motion e tem fallback estático se a imagem falhar.
 */
export function ElectricLogo({
  src = assets.escudo,
  alt = "Escudo Wakanda Pro",
  tamanho = "md",
  className = "",
}: {
  src?: string;
  alt?: string;
  tamanho?: "sm" | "md" | "lg";
  className?: string;
}) {
  const [erro, setErro] = useState(false);

  const isReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  const dims = {
    sm: {
      w: "w-8",
      h: "h-8",
      px: 32,
      shadow: "drop-shadow-[0_0_8px_rgba(224,176,80,0.6)]",
    },
    md: {
      w: "w-12",
      h: "h-12",
      px: 48,
      shadow:
        "drop-shadow-[0_0_12px_rgba(139,28,43,0.8)] drop-shadow-[0_0_20px_rgba(224,176,80,0.5)]",
    },
    lg: {
      w: "w-16",
      h: "h-16",
      px: 64,
      shadow:
        "drop-shadow-[0_0_16px_rgba(139,28,43,0.9)] drop-shadow-[0_0_32px_rgba(224,176,80,0.7)]",
    },
  }[tamanho];

  return (
    <span className={`relative inline-block ${className}`}>
      {/* Brilho de fundo */}
      {!isReducedMotion && (
        <span
          aria-hidden="true"
          className="absolute inset-0 -z-10 rounded-full bg-[var(--wp-gold)]/25 blur-md"
        />
      )}

      {erro ? (
        <span
          className={`${dims.w} ${dims.h} flex items-center justify-center rounded-full bg-[var(--wp-red)] font-mono text-xs font-bold text-[var(--wp-gold-soft)]`}
          aria-label={alt}
        >
          W
        </span>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={dims.px}
          height={dims.px}
          preload
          onError={() => setErro(true)}
          className={`${dims.w} ${dims.h} rounded-full object-cover ${dims.shadow}`}
        />
      )}
    </span>
  );
}
