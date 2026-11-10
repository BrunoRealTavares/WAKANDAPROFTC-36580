export type PapelEquipe = "tecnica" | "mentora" | "membro";

export type GrupoEquipe = "MCI" | "AE";

export type MembroEquipe = {
  nome: string;
  papel: PapelEquipe;
  grupo?: GrupoEquipe;
  foto?: string;
  frase?: string;
};

/**
 * Fonte única da equipe do site público.
 * Fases seguintes preencherão `foto` e `frase` quando a informação for confirmada.
 * Foto padrão de todos os membros: imagem-fundo-integrantes.png
 */
export const equipe: MembroEquipe[] = [
  // Liderança em destaque
  { nome: "Juliana de Jesus", papel: "tecnica", foto: "/images/imagem-fundo-integrantes.png" },
  { nome: "Catarina Lima", papel: "mentora", foto: "/images/imagem-fundo-integrantes.png" },

  // Grupo MCI
  { nome: "Bruno Real", papel: "membro", grupo: "MCI", foto: "/images/imagem-fundo-integrantes.png" },
  { nome: "Pedro Freire", papel: "membro", grupo: "MCI", foto: "/images/imagem-fundo-integrantes.png" },
  { nome: "Maria Eduarda", papel: "membro", grupo: "MCI", foto: "/images/imagem-fundo-integrantes.png" },
  { nome: "Marcelo Henrique", papel: "membro", grupo: "MCI", foto: "/images/imagem-fundo-integrantes.png" },
  { nome: "Murilo Paz", papel: "membro", grupo: "MCI", foto: "/images/imagem-fundo-integrantes.png" },
  { nome: "Pedro Lucas", papel: "membro", grupo: "MCI", foto: "/images/imagem-fundo-integrantes.png" },

  // Grupo AE
  { nome: "Hannah Maia", papel: "membro", grupo: "AE", foto: "/images/imagem-fundo-integrantes.png" },
  { nome: "Nathália Jesus", papel: "membro", grupo: "AE", foto: "/images/imagem-fundo-integrantes.png" },
  { nome: "Sofia Souza", papel: "membro", grupo: "AE", foto: "/images/imagem-fundo-integrantes.png" },
];
