"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { RedQuestionMark } from "@/components/RedQuestionMark";
import siteConfig from "@/lib/site-config";

/**
 * HeroMystery — hero cinematográfico com entrada tipográfica.
 * useLayoutEffect garante o estado inicial antes do primeiro paint;
 * sem JS: conteúdo 100% visível (nenhuma informação é escondida).
 */
export function HeroMystery() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from("[data-hero='meta']", { autoAlpha: 0, y: 10, duration: 0.5 })
        .from("[data-hero='l1']", { autoAlpha: 0, y: 36, duration: 0.9 }, "-=0.2")
        .from("[data-hero='l2']", { autoAlpha: 0, y: 36, duration: 0.9 }, "-=0.65")
        .from("[data-hero='p']", { autoAlpha: 0, y: 20, duration: 0.7, stagger: 0.12 }, "-=0.5")
        .from("[data-hero='cta']", { autoAlpha: 0, y: 16, duration: 0.6, stagger: 0.1 }, "-=0.4")
        .from("[data-hero='qmark']", { autoAlpha: 0, scale: 0.86, duration: 1.1, ease: "expo.out" }, "-=0.8")
        .from("[data-hero='cue']", { autoAlpha: 0, duration: 0.6 }, "-=0.3");
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative flex min-h-screen items-center overflow-hidden"
      aria-label="Apresentação da equipe"
    >
      <div className="wp-grid-bg absolute inset-0 opacity-60" aria-hidden="true" />
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{ background: "radial-gradient(ellipse 60% 50% at 65% 45%, var(--wp-red-glow), transparent 60%)" }}
      />

      <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-5 pt-24 pb-20 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
        <div className="flex flex-col justify-center">
          <p className="tech-meta mb-6" data-hero="meta">{siteConfig.metaTecnica}</p>

          <h1 className="font-display text-[clamp(2.6rem,7vw,5.5rem)] font-extrabold text-[var(--wp-white)]">
            <span className="block" data-hero="l1">{siteConfig.headlines.heroLinha1}</span>
            <span className="mt-2 block text-[var(--wp-red)]" data-hero="l2">{siteConfig.headlines.heroLinha2}</span>
          </h1>

          <p className="mt-8 max-w-lg text-lg leading-relaxed text-[var(--wp-silver-mute)]" data-hero="p">
            Somos a <strong className="font-semibold text-[var(--wp-white)]">Wakanda Pro 36580</strong> —
            uma equipe de robótica da Escola SESI Milton Santos, em Camaçari (BA),
            em nossa primeira temporada na FIRST Tech Challenge.
          </p>
          <p className="mt-3 max-w-lg leading-relaxed text-[var(--wp-silver-mute)]" data-hero="p">
            Nossa estreia não é uma limitação: é o começo de uma história
            construída com trabalho, estudo e ambição.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="#equipe"
              data-hero="cta"
              className="group relative inline-flex h-12 items-center overflow-hidden rounded px-7 text-sm font-semibold tracking-wide text-white transition-transform hover:scale-[1.02]"
              style={{ background: "linear-gradient(120deg, var(--wp-red), var(--wp-red-deep))" }}
            >
              Conheça a equipe
              <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="#vibranium"
              data-hero="cta"
              className="inline-flex h-12 items-center rounded border border-[var(--wp-edge)] px-7 font-mono text-xs uppercase tracking-[0.18em] text-[var(--wp-silver-mute)] transition-colors hover:border-[var(--wp-gold)] hover:text-[var(--wp-gold-soft)]"
            >
              Projeto secreto
            </Link>
          </div>
        </div>

        <div className="relative flex items-center justify-center" data-hero="qmark">
          <div className="absolute inset-0 grid place-items-center">
            <div className="h-64 w-64 rounded-full bg-[var(--wp-red)] opacity-[0.07] blur-3xl" aria-hidden="true" />
          </div>
          <RedQuestionMark size="xl" />
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2" data-hero="cue" aria-hidden="true">
        <div className="flex h-10 w-6 justify-center rounded-full border border-[var(--wp-edge)] p-1.5">
          <span
            className="block h-2 w-1 rounded-full bg-[var(--wp-silver-mute)]"
            style={{ animation: "wp-scroll-cue 2.2s ease-in-out infinite" }}
          />
        </div>
      </div>
    </section>
  );
}
