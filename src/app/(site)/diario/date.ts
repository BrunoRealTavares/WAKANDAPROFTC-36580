/**
 * Formata uma data ISO (YYYY-MM-DD) para pt-BR de forma determinística,
 * sem depender de `new Date()` no servidor — evita divergências de
 * fuso entre a renderização no servidor e a hidratação no cliente.
 */
const MESES = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

export function formatIsoDatePtBR(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const mes = MESES[Number(m[2]) - 1] ?? "?";
  return `${m[3]} ${mes} ${m[1]}`;
}
