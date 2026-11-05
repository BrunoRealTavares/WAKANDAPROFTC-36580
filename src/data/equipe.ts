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
 */
export const equipe: MembroEquipe[] = [
  // Liderança em destaque
  { nome: "Juliana de Jesus", papel: "tecnica" },
  { nome: "Catarina Lima", papel: "mentora" },

  // Grupo MCI
  { nome: "Bruno Real", papel: "membro", grupo: "MCI" },
  { nome: "Pedro Freire", papel: "membro", grupo: "MCI" },
  { nome: "Maria Eduarda", papel: "membro", grupo: "MCI" },
  { nome: "Marcelo Henrique", papel: "membro", grupo: "MCI" },
  { nome: "Murilo Paz", papel: "membro", grupo: "MCI" },
  { nome: "Pedro Lucas", papel: "membro", grupo: "MCI" },

  // Grupo AE
  { nome: "Hannah Maia", papel: "membro", grupo: "AE" },
  { nome: "Nathália Jesus", papel: "membro", grupo: "AE" },
  { nome: "Sofia Souza", papel: "membro", grupo: "AE" },
];
