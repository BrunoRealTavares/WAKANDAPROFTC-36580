/**
 * Fonte única da linha do tempo pública.
 * Fase 2: dados iniciais em arquivo. Na Fase 3 (CMS) este array é o
 * seed oficial e a edição passa a ser feita no painel.
 * Use `data: null` enquanto a data real não for confirmada pela equipe.
 */
export type EventoTimeline = {
  /** Rótulo curto, ex.: "OUT 2026". null = data a confirmar. */
  data: string | null;
  titulo: string;
  descricao: string | null;
  ordem: number;
};

export const timelineTemporada: EventoTimeline[] = [
  {
    titulo: "Formação da equipe",
    data: null,
    descricao: "Convocação e montagem dos grupos. Data real a confirmar pela equipe.",
    ordem: 1,
  },
  {
    titulo: "Primeiros encontros e estudos",
    data: null,
    descricao: "Estudo do regulamento da temporada e divisão de áreas: mecânica, programação, design, portfólio e comunicação.",
    ordem: 2,
  },
  {
    titulo: "Planejamento da temporada BIOBUZZ",
    data: null,
    descricao: "Definição de metas, cronograma de treinos e requisitos do robô.",
    ordem: 3,
  },
  {
    titulo: "Construção do robô Vibranium",
    data: null,
    descricao: "Projeto e montagem — o relato detalhado vive no caderno de engenharia.",
    ordem: 4,
  },
  {
    titulo: "Testes, ajustes e autonomia",
    data: null,
    descricao: "Ciclos curtos de teste no campo e na mesa: mecânica, código e autonomia.",
    ordem: 5,
  },
  {
    titulo: "Eventos e conquistas",
    data: null,
    descricao: "Marcos da temporada: onde competimos e o que conquistamos.",
    ordem: 6,
  },
];
