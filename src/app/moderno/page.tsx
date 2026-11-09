import { ModernNavbar } from "@/components/ModernNavbar";
import { HolographicUserIcon } from "@/components/HolographicUserIcon";
import { CodePartnerCard } from "@/components/CodePartnerCard";

export default function ModernoPage() {
  return (
    <>
      <ModernNavbar />

      <main className="flex-1 pt-24 pb-32">
        {/* Hero section */}
        <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-5 lg:px-8">
          {/* Grade de fundo sutil */}
          <div className="absolute inset-0" aria-hidden="true" />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `
                linear-gradient(var(--wp-edge) 1px, transparent 1px),
                linear-gradient(90deg, var(--wp-edge) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              background: `radial-gradient(ellipse 60% 50% at 50% 40%, rgba(53,201,222,0.12), transparent 60%)`,
            }}
          />

          <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-8">
            <HolographicUserIcon size={240} />

            <div className="flex flex-col items-center gap-6">
              <p className="tech-meta text-[var(--wp-cyan)] uppercase tracking-[0.2em]">
                Sistema de Perfil Â· Ativo
              </p>
              <h1 className="font-display text-[clamp(2rem,6vw,4rem)] font-extrabold text-[var(--wp-white)] leading-[0.95]">
                Wakanda Pro
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-[var(--wp-silver-mute)]">
                Interface moderna â€” modo escuro Â· identidade de alta tecnologia Â·<br />
                pronta para a temporada BIOBUZZ 2026â€“27.
              </p>
            </div>
          </div>
        </section>

        {/* Lower section â€” Team Member Profiles and Partners */}
        <section className="border-t border-[var(--wp-edge)] bg-[var(--wp-void)] py-24 lg:py-32 px-5 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-16">
              <h2 className="font-mono text-2xl font-bold text-[var(--wp-white)] tracking-tight">
                Team Member Profiles and Partners
              </h2>
              <p className="text-sm text-[var(--wp-silver-dim)] italic">
                CÃ³digo aberto Â· Parcerias da temporada
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              <CodePartnerCard
                title="FIRST Tech Challenge"
                logoSrc="/img/FIRST-TECH-CHALLENGE.png.png"
                logoAlt="Logotipo oficial do FIRST Tech Challenge"
                logoWidth={356}
                logoHeight={280}
                body="Equipe 36580 em estreia na competiÃ§Ã£o FTC â€” temporada BIOBUZZ. Projeto Vibranium em construÃ§Ã£o, caderno de engenharia ativo."
              />
              <CodePartnerCard
                title="BIOBUZZ Initiative"
                logoSrc="/img/logo-biobuzz.png.png"
                logoAlt="Logotipo oficial da temporada BIOBUZZ"
                logoWidth={447}
                logoHeight={447}
                body="Simulador 3D do campo BioBuzz e desafios da temporada. IntegraÃ§Ã£o com o site pÃºblico e diÃ¡rio de bordo da equipe."
              />
              <CodePartnerCard
                title="LIGA DE ROBÃ“TICA"
                logoSrc="/img/liga-sesi-robotica.png.png"
                logoAlt="Logotipo escudo da Liga de RobÃ³tica SESI Bahia"
                logoWidth={500}
                logoHeight={500}
                body="Liga de RobÃ³tica SESI Bahia â€” suporte institucional Ã  primeira temporada da Escola SESI Milton Santos na FTC."
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

