"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Carrega o simulador externo sob demanda: sem iframe até o usuário pedir
 * (ou até a seção chegar perto da viewport), com skeleton e fallback
 * permanente de abertura em nova aba.
 */
export function SimulatorEmbed({ url }: { url: string }) {
  const [armed, setArmed] = useState(false);
  const [ready, setReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (armed || !containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setArmed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px" }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [armed]);

  return (
    <div ref={containerRef} className="mt-10">
      <div
        className="relative w-full overflow-hidden rounded-xl border border-[var(--wp-edge)] bg-[var(--wp-void)]"
        style={{ aspectRatio: "16 / 9", minHeight: 520 }}
      >
        {armed ? (
          <>
            {!ready && (
              <div
                aria-hidden
                className="absolute inset-0 z-10 grid animate-pulse place-items-center bg-[var(--wp-void)]"
              >
                <div className="text-center">
                  <div className="mx-auto h-1 w-40 rounded-full bg-gradient-to-r from-[var(--wp-red)] via-[var(--wp-gold)] to-[var(--wp-cyan)]" />
                  <p className="tech-meta mt-4">CARREGANDO SIMULADOR…</p>
                  <p className="mt-2 text-sm text-[var(--wp-silver-dim)]">
                    A primeira carga pode demorar alguns segundos.
                  </p>
                </div>
              </div>
            )}
            <iframe
              src={url}
              title="Simulador 3D do campo BIOBUZZ"
              allow="autoplay; fullscreen"
              loading="lazy"
              onLoad={() => setReady(true)}
              className="absolute inset-0 h-full w-full border-0"
            />
          </>
        ) : (
          <div className="absolute inset-0 grid place-items-center p-6 text-center">
            <div>
              <p className="tech-meta text-[var(--wp-gold-soft)]">CAMPO / BIOBUZZ 3D</p>
              <p className="font-display mx-auto mt-4 max-w-md text-2xl font-extrabold text-[var(--wp-white)]">
                O campo da temporada, direto no navegador
              </p>
              <button
                type="button"
                onClick={() => setArmed(true)}
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--wp-red)] px-6 py-3 font-mono text-xs uppercase tracking-[0.18em] text-[var(--wp-white)] transition-colors hover:bg-[var(--wp-red)]"
              >
                Carregar simulador
              </button>
              <p className="mt-4 text-xs text-[var(--wp-silver-dim)]">
                Ferramenta externa: nada carrega antes do seu clique.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="tech-meta">SIMULADOR EXTERNO · PANDARA.ORG</p>
        <a
          href={url}
          target="_blank"
          rel="noopener"
          className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--wp-silver-mute)] underline-offset-4 transition-colors hover:text-[var(--wp-white)] hover:underline"
        >
          Abrir em nova aba ↗
        </a>
      </div>
    </div>
  );
}
