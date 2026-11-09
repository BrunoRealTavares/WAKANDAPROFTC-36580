/**
 * Fonte central de assets do site Wakanda Pro 36580.
 * Todas as imagens devem ser referenciadas por este arquivo para evitar
 * caminhos quebrados e facilitar manutenção.
 */

export const assets = {
  // Identidade visual
  escudo: "/images/escudo-wakanda-pro.png",

  // Logos de parceiros / ecossistema
  logoFtc: "/images/logo-ftc.png",
  logoBiobuzz: "/images/logo-biobuzz.png",
  logoLigaRobotica: "/images/logo-liga-robotica.png",

  // Bandeiras
  bandeiraBahia: "/images/bandeira-bahia.png",
  bandeiraBrasil: "/images/bandeira-brasil.jpg",

  // Foto padrão dos membros da equipe
  imagemFundoIntegrantes: "/images/imagem-fundo-integrantes.png",

  // Interrogação do robô (secreto)
  interrogaoReferencia: "/images/interrogacao-referencia.jpg",
} as const;

export type AssetKey = keyof typeof assets;
