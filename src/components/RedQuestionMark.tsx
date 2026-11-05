/**
 * Interrogação Vermelha — elemento central de identidade.
 * Ocupa o lugar da imagem do robô até a autorização de revelação.
 * Implementação: SVG vetorial próprio (estilo linha de engenharia),
 * independente de fonte, com gradiente e glow consistentes.
 * Server component — sem JS necessário; animação via CSS (globals),
 * respeitando prefers-reduced-motion automaticamente.
 */
const DIMS = {
  sm: "4rem",
  lg: "min(16rem, 40vw)",
  xl: "min(50vh, 24rem)",
} as const;

export function RedQuestionMark({
  size = "lg",
  className = "",
}: {
  size?: "sm" | "lg" | "xl";
  className?: string;
}) {
  const dim = DIMS[size];

  return (
    <div
      className={`wp-qm-anim relative select-none ${className}`}
      style={{ width: dim }}
      role="img"
      aria-label="Interrogação vermelha — símbolo do projeto em construção"
      data-testid="red-question-mark"
    >
      <svg viewBox="0 0 200 280" className="block h-auto w-full" aria-hidden="true">
        <defs>
          <linearGradient id="wp-qm-red" x1="0.15" y1="0" x2="0.85" y2="1">
            <stop offset="0" stopColor="#ff5a68" />
            <stop offset="0.42" stopColor="#e01e2f" />
            <stop offset="1" stopColor="#8f1020" />
          </linearGradient>
          <filter id="wp-qm-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#e01e2f" floodOpacity="0.55" />
          </filter>
        </defs>

        {/* Cantoneiras técnicas — moldura de engenharia */}
        <g stroke="#3a4150" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" aria-hidden="true">
          <path d="M6 34 V6 H34" fill="none" />
          <path d="M194 34 V6 H166" fill="none" />
          <path d="M6 246 V274 H34" fill="none" />
          <path d="M194 246 V274 H166" fill="none" />
        </g>

        {/* Retícula central */}
        <g stroke="#22262e" strokeWidth="1.5" aria-hidden="true">
          <line x1="100" y1="14" x2="100" y2="266" />
          <line x1="10" y1="140" x2="190" y2="140" />
          <circle cx="100" cy="140" r="88" fill="none" strokeDasharray="4 8" />
          <circle cx="100" cy="140" r="56" fill="none" strokeDasharray="2 10" />
        </g>

        {/* Glifo "?" desenhado */}
        <g filter="url(#wp-qm-glow)">
          <path
            d="M52 56 C 52 24 84 10 112 16 C 142 23 154 52 142 80 C 132 102 106 112 94 134 L 94 172"
            fill="none"
            stroke="url(#wp-qm-red)"
            strokeWidth="27"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="94" cy="217" r="17.5" fill="url(#wp-qm-red)" />
        </g>
      </svg>
    </div>
  );
}
