import Link from "next/link";
import type { ReactNode } from "react";

// UI kit server-side do painel (sem estado). Cores: tokens globals.css.

export function Secao({ titulo, acoes, children, acaoLink }: { titulo: string; acoes?: ReactNode; children: ReactNode; acaoLink?: string }) {
  return (
    <section className={`rounded-lg border border-[color:var(--wp-edge)] bg-[color:var(--wp-graphite)] ${acaoLink ? "pt-4" : "pt-4"} p-4`}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--wp-silver)]">{titulo}</h2>
        {acoes}
      </div>
      {children}
    </section>
  );
}

export function EmptyState({ titulo, mensagem, acao, acaoHref }: { titulo: string; mensagem: string; acao?: string; acaoHref?: string }) {
  return (
    <div className="rounded-lg border border-dashed border-[color:var(--wp-edge)] bg-[color:var(--wp-coal)] p-6 text-center">
      <p className="font-medium text-[color:var(--wp-silver)]">{titulo}</p>
      <p className="mt-1 text-sm text-[color:var(--wp-silver-mute)]">{mensagem}</p>
      {acao && acaoHref ? (
        <Link href={acaoHref} className="mt-3 inline-block rounded-md border border-[color:var(--wp-edge)] px-3 py-1.5 text-sm text-[color:var(--wp-gold)] hover:bg-[color:var(--wp-graphite)]">
          {acao}
        </Link>
      ) : null}
    </div>
  );
}

export function PainelDeContagem({ rotulo, valor, destaque }: { rotulo: string; valor: number | string; destaque?: "red" | "gold" | "cyan" }) {
  const cor = destaque === "red" ? "text-[color:var(--wp-red)]" : destaque === "gold" ? "text-[color:var(--wp-gold)]" : "text-[color:var(--wp-cyan)]";
  return (
    <div className="rounded-lg border border-[color:var(--wp-edge)] bg-[color:var(--wp-graphite)] p-4">
      <p className="text-xs uppercase tracking-wide text-[color:var(--wp-silver-dim)]">{rotulo}</p>
      <p className={`mt-1 text-2xl font-semibold ${cor}`}>{valor}</p>
    </div>
  );
}

export function Badge({ cor = "edge", children }: { cor?: "edge" | "red" | "gold" | "cyan"; children: ReactNode }) {
  const cls =
    cor === "red"
      ? "border-[color:var(--wp-red)] text-[color:var(--wp-red)]"
      : cor === "gold"
        ? "border-[color:var(--wp-gold)] text-[color:var(--wp-gold)]"
        : cor === "cyan"
          ? "border-[color:var(--wp-cyan)] text-[color:var(--wp-cyan)]"
          : "border-[color:var(--wp-edge)] text-[color:var(--wp-silver-mute)]";
  return <span className={`inline-block rounded-full border px-2 py-0.5 text-xs ${cls}`}>{children}</span>;
}

export function Campo({ legenda, children }: { legenda: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-[color:var(--wp-silver-mute)]">{legenda}</span>
      {children}
    </label>
  );
}

export const inputClasse =
  "rounded-md border border-[color:var(--wp-edge)] bg-[color:var(--wp-coal)] px-3 py-2 text-sm text-[color:var(--wp-silver)] outline-none focus:border-[color:var(--wp-cyan)]";

export function diaCurto(d: Date | null | undefined): string {
  if (!d) return "—";
  return d.toLocaleDateString("pt-BR"); // timestamps são segundos unixepoch (UTC)
}

export function dataHoraCurta(d: Date | null | undefined): string {
  if (!d) return "—";
  return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}
