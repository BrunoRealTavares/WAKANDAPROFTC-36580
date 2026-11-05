/**
 * WAKANDA PRO 36580 — Configuração central editável
 * ------------------------------------------------
 * Este é o único lugar para atualizar informações pendentes
 * da equipe. Nada aqui deve conter dados inventados.
 * Campos com `null` ou marcados como pendente devem ser
 * preenchidos quando as informações forem confirmadas.
 */

export const siteConfig = {
  nomeEquipe: "Wakanda Pro",
  numeroFtc: "36580",
  temporada: "BIOBUZZ",
  cicloTemporada: "2026–27",
  metaTecnica: "FTC / 36580 / BIOBUZZ / 2026–27",

  /** URL base do site público — atualizar quando o domínio final for confirmado */
  urlSite: "http://localhost:3000",

  /** ⚠️ Confirmar nomenclatura institucional oficial antes de publicar */
  nomeEscolaPendente: "Escola SESI Milton Santos", // possivelmente "ESI Milton Santos"

  cidade: "Camaçari",
  estado: "Bahia",
  pais: "Brasil",

  /** Revelação do robô — só tornar `true` quando a equipe autorizar */
  roboRevelado: false,
  nomeRobo: "Vibranium",

  /** ⚠️ Preencher quando confirmado — nunca inventar */
  emailPublico: null as string | null,
  redesSociais: {
    instagram: null as string | null,
    youtube: null as string | null,
    linkedin: null as string | null,
  },

  treinadora: {
    nome: null as string | null, // pendente
    biografiaPendente: "Apresentação da treinadora em construção — informação pendente de confirmação.",
  },

  /** Frases de direção criativa */
  headlines: {
    heroLinha1: "O futuro não se espera.",
    heroLinha2: "Ele se constrói.",
  },

  linksExternos: {
    simuladorBioBuzz: "https://www.pandara.org/BioBuzz3D/",
  },
} as const;

export type SiteConfig = typeof siteConfig;
export default siteConfig;
