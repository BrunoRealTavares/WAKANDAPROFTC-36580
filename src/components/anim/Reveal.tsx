"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Deslocamento vertical inicial em px */
  y?: number;
  delay?: number;
  stagger?: number;
};

/**
 * Reveal ? entrada de conte?do vinculada ao scroll.
 * Fallback: com prefers-reduced-motion ou sem JS, o conte?do
 * aparece imediatamente (nunca escondemos informação).
 */
export function Reveal({ children, className = "", y = 28, delay = 0, stagger }: RevealProps) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(el, {
        autoAlpha: 0,
        y,
        delay,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
      if (stagger !== undefined) {
        gsap.from(el.children, {
          autoAlpha: 0,
          y: 14,
          stagger,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      }
    }, el);

    return () => ctx.revert();
  }, [y, delay, stagger]);

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
