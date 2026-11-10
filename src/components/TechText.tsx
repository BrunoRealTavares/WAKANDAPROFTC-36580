/**
 * TechText — destaca um trecho do texto com brilho tecnológico (dourado + vinho).
 * Implementação sem JavaScript: funciona em Server Components e a animação
 * fica no CSS, respeitando prefers-reduced-motion automaticamente.
 */
export function TechText({
  texto,
  destaque,
  className = "",
}: {
  texto: string;
  destaque?: string;
  className?: string;
}) {
  const idx = destaque ? texto.indexOf(destaque) : -1;

  if (!destaque || idx === -1) {
    return <span className={className}>{texto}</span>;
  }

  return (
    <span className={className}>
      {texto.slice(0, idx)}
      <span className="wp-tech-text">{destaque}</span>
      {texto.slice(idx + destaque.length)}
    </span>
  );
}
