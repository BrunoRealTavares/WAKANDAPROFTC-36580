"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RedQuestionMark } from "@/components/RedQuestionMark";
import siteConfig from "@/lib/site-config";

gsap.registerPlugin(ScrollTrigger);

const anotacoes = [
  { rotulo: "SIST-36580 / PROTÓTIPO", posicao: "top-[8%] left-[4%]", linha: "w-24" },
  { rotulo: "COOR 12°40' S 38°22' W", posicao: "top-[22%] right-[6%]", linha: "w-16" },
  { rotulo: "CANAL DE DADOS: ATIVO", posicao: "bottom-[30%] left-[8%]", linha: "w-20" },
  { rotulo: "TENSÃO NOMINAL", posicao: "bottom-[16%] right-[10%]", linha: "w-14" },
];

/**
 * RevealSequence — narrativa de revelação vinculada ao scroll.
 * Desktop: seção pinada com progressão contínua (scrub).
 * Mobile/reduced-motion: apresentação sequencial estática, sem pin.
 */
export function RevealSequence() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=2200",
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
          },
        });
        tl.from("[data-ann]", { autoAlpha: 0, y: 14, duration: 0.35, stagger: 0.28, ease: "none" })
          .from("[data-nameplate]", { autoAlpha: 0, y: 20, duration: 0.4, ease: "none" })
          .from("[data-reveal-note]", { autoAlpha: 0, duration: 0.25, ease: "none" })
          .to('[data-sysline="fill"]', { scaleX: 1, duration: 0.5, ease: "none" }, 0.1);
      }, el);
      return () => ctx.revert();
    });

    mm.add("(max-width: 1023px)", () => {
      const ctx = gsap.context(() => {
        gsap.from("[data-ann], [data-nameplate], [data-reveal-note]", {
          autoAlpha: 0,
          y: 18,
          duration: 0.7,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 75%", once: true },
        });
      }, el);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={root} id="vibranium" className="relative overflow-hidden border-t border-[var(--wp-graphite)]">
      {/* Palco desktop pinado */}
      <div className="relative hidden min-h-screen items-center lg:flex">
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{ background: "radial-gradient(ellipse 55% 60% at 50% 55%, var(--wp-red-glow), transparent 70%)" }}
        />

        {anotacoes.map((a, i) => (
          <div key={a.rotulo} className={`tech-meta absolute ${a.posicao}`} data-ann aria-hidden="true" style={{ order: i }}>
            {a.rotulo}
            <span className={`mt-1 block h-px border-t border-dashed border-[var(--wp-edge)] ${a.linha}`} />
          </div>
        ))}

        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-8 py-16 text-center">
          <p className="tech-meta mb-6">PROJETO EM DESENVOLVIMENTO</p>
          <div className="relative inline-block">
            <RedQuestionMark size="lg" />
            <span
              className="absolute -bottom-2 left-4 right-4 h-px origin-left scale-x-0 bg-[var(--wp-red)]/50"
              aria-hidden="true"
              data-sysline="fill"
            />
          </div>

          <div className="mt-10" data-nameplate>
            <p className="tech-meta" style={{ color: "var(--wp-gold-soft)" }}>DESIGNAÇÃO OFICIAL</p>
            <h2 className="font-display mt-3 text-[clamp(2.4rem,6vw,4.5rem)] font-extrabold tracking-[0.08em] text-[var(--wp-white)]">
              {siteConfig.nomeRobo.toUpperCase()}
            </h2>
            <p className="mx-auto mt-5 max-w-xl leading-relaxed text-[var(--wp-silver-mute)]" data-reveal-note>
              Um nome inspirado no metal fictício que absorve energia — a nossa
              ambição de construir um robô que aproveita cada recurso ao máximo.
              A imagem oficial chega quando a equipe autorizar a divulgação.
            </p>
          </div>
        </div>
      </div>

      {/* Versão mobile — sequência estática, sem pin */}
      <div className="relative flex min-h-[90vh] flex-col items-center px-5 py-20 text-center lg:hidden">
        {anotacoes.map((a) => (
          <p key={a.rotulo} className="tech-meta mb-4 w-full" data-ann aria-hidden="true">
            {a.rotulo}
          </p>
        ))}
        <div className="my-6">
          <RedQuestionMark size="lg" />
        </div>
        <div className="mt-6" data-nameplate>
          <p className="tech-meta" style={{ color: "var(--wp-gold-soft)" }}>DESIGNAÇÃO OFICIAL</p>
          <h2 className="font-display mt-3 text-[clamp(2.2rem,9vw,3.4rem)] font-extrabold tracking-[0.06em] text-[var(--wp-white)]">
            {siteConfig.nomeRobo.toUpperCase()}
          </h2>
        </div>
        <p className="mt-6 max-w-md leading-relaxed text-[var(--wp-silver-mute)]" data-reveal-note>
          Nome inspirado no metal fictício que absorve energia — a nossa ambição de
          aproveitar cada recurso ao máximo. A imagem oficial chega quando a equipe liberar.
        </p>
      </div>
    </div>
  );
}
