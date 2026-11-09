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
  { nome: "Juliana de Jesus", papel: "tecnica", foto: "/img/imagem-fundo-integrantes.png.png" },
  { nome: "Catarina Lima", papel: "mentora", foto: "/img/imagem-fundo-integrantes.png.png" },

  // Grupo MCI
  { nome: "Bruno Real", papel: "membro", grupo: "MCI", foto: "/img/imagem-fundo-integrantes.png.png" },
  { nome: "Pedro Freire", papel: "membro", grupo: "MCI", foto: "/img/imagem-fundo-integrantes.png.png" },
  { nome: "Maria Eduarda", papel: "membro", grupo: "MCI", foto: "/img/imagem-fundo-integrantes.png.png" },
  { nome: "Marcelo Henrique", papel: "membro", grupo: "MCI", foto: "/img/imagem-fundo-integrantes.png.png" },
  { nome: "Murilo Paz", papel: "membro", grupo: "MCI", foto: "/img/imagem-fundo-integrantes.png.png" },
  { nome: "Pedro Lucas", papel: "membro", grupo: "MCI", foto: "/img/imagem-fundo-integrantes.png.png" },

  // Grupo AE
  { nome: "Hannah Maia", papel: "membro", grupo: "AE", foto: "/img/imagem-fundo-integrantes.png.png" },
  { nome: "Nathália Jesus", papel: "membro", grupo: "AE", foto: "/img/imagem-fundo-integrantes.png.png" },
  { nome: "Sofia Souza", papel: "membro", grupo: "AE", foto: "/img/imagem-fundo-integrantes.png.png" },
];
