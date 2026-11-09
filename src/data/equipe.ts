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
 * Foto padrão de todos os membros: Design sem nome (6)
 */
export const equipe: MembroEquipe[] = [
  // Liderança em destaque
  { nome: "Juliana de Jesus", papel: "tecnica", foto: "/img/Design sem nome (6).jpg" },
  { nome: "Catarina Lima", papel: "mentora", foto: "/img/Design sem nome (6).jpg" },

  // Grupo MCI
  { nome: "Bruno Real", papel: "membro", grupo: "MCI", foto: "/img/Design sem nome (6).jpg" },
  { nome: "Pedro Freire", papel: "membro", grupo: "MCI", foto: "/img/Design sem nome (6).jpg" },
  { nome: "Maria Eduarda", papel: "membro", grupo: "MCI", foto: "/img/Design sem nome (6).jpg" },
  { nome: "Marcelo Henrique", papel: "membro", grupo: "MCI", foto: "/img/Design sem nome (6).jpg" },
  { nome: "Murilo Paz", papel: "membro", grupo: "MCI", foto: "/img/Design sem nome (6).jpg" },
  { nome: "Pedro Lucas", papel: "membro", grupo: "MCI", foto: "/img/Design sem nome (6).jpg" },

  // Grupo AE
  { nome: "Hannah Maia", papel: "membro", grupo: "AE", foto: "/img/Design sem nome (6).jpg" },
  { nome: "Nathália Jesus", papel: "membro", grupo: "AE", foto: "/img/Design sem nome (6).jpg" },
  { nome: "Sofia Souza", papel: "membro", grupo: "AE", foto: "/img/Design sem nome (6).jpg" },
];
