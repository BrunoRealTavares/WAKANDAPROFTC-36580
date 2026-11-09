import { ZodError } from "zod";

// Estado padrão consumido por <ActionForm> (useActionState)
export type ActionState = {
  ok: boolean;
  mensagem?: string;
  erros?: Record<string, string>;
  segredo?: string; // ex.: senha temporária exibida uma única vez
} | null;

export const OK = (mensagem?: string, extra?: Partial<Exclude<ActionState, null>>): ActionState => ({
  ok: true,
  mensagem,
  ...extra,
});

export const ERRO = (_erros: Record<string, string>, mensagem?: string): ActionState => ({
  ok: false,
  mensagem,
  erros: _erros,
});

export function errosZod(e: ZodError): Record<string, string> {
  const saida: Record<string, string> = {};
  for (const issue of e.issues) {
    const campo = issue.path.join(".") || "_";
    if (!saida[campo]) saida[campo] = issue.message;
  }
  return saida;
}

export function textoOuUndefined(v: FormDataEntryValue | null): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t === "" ? undefined : t;
}

export function numeroOuUndefined(v: FormDataEntryValue | null): number | undefined {
  const t = textoOuUndefined(v);
  if (t === undefined) return undefined;
  const n = Number(t.replace(",", "."));
  return Number.isFinite(n) ? n : undefined;
}

/** valor de input datetime-local -> Date | undefined */
export function dataOuUndefined(v: FormDataEntryValue | null): Date | undefined {
  const t = textoOuUndefined(v);
  if (!t) return undefined;
  const d = new Date(t);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

/** valor de input date (YYYY-MM-DD) -> Date | undefined */
export function dataISOOuUndefined(v: FormDataEntryValue | null): Date | undefined {
  const t = textoOuUndefined(v);
  if (!t) return undefined;
  const d = new Date(t + (t.length === 10 ? "T12:00:00" : ""));
  return Number.isNaN(d.getTime()) ? undefined : d;
}
