"use client";

import { useActionState } from "react";
import type { ReactNode } from "react";
import type { ActionState } from "@/lib/action-state";
import { SubmitButton } from "./submit-button";

/**
 * Formulário padrão do painel: server action com useActionState.
 * `children` são os campos (inputs/selects/textarea em servlet).
 * Mensagens de erro por campo e mensagem de sucesso são exibidas aqui.
 */
export function ActionForm({
  action,
  children,
  rotulo = "Salvar",
  className,
  compacto,
}: {
  action: (estado: ActionState, fd: FormData) => Promise<ActionState>;
  children: ReactNode;
  rotulo?: string;
  className?: string;
  compacto?: boolean;
}) {
  const [estado, formulario, pendente] = useActionState(action, null);
  return (
    <form action={formulario} className={className ?? "flex flex-col gap-3"}>
      {children}
      {estado?.ok && estado.mensagem ? (
        <p className={`text-sm ${compacto ? "" : "rounded-md border border-[color:var(--wp-edge)]"} bg-[color:var(--wp-graphite)] px-3 py-2 text-[color:var(--wp-cyan)]`}>
          {estado.mensagem}
        </p>
      ) : null}
      {estado?.ok && estado.segredo ? (
        <p className="rounded-md border border-[color:var(--wp-edge)] bg-[color:var(--wp-coal)] px-3 py-2 text-sm text-[color:var(--wp-gold-soft)]">
          Senha temporária (copie agora — não será exibida novamente): <code className="select-all whitespace-pre-wrap font-mono">{estado.segredo}</code>
        </p>
      ) : null}
      {estado && !estado.ok ? (
        <div className="rounded-md border border-[color:var(--wp-edge)] bg-[color:var(--wp-graphite)] px-3 py-2 text-sm">
          {estado.mensagem ? <p className="mb-1 text-[color:var(--wp-red)]">{estado.mensagem}</p> : null}
          {estado.erros ? (
            <ul className="list-inside list-disc text-[color:var(--wp-silver-mute)]">
              {Object.entries(estado.erros).map(([campo, msg]) => (
                <li key={campo}>
                  <span className="text-[color:var(--wp-silver)]">{campo}</span>: {msg}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
      <div>
        <SubmitButton filhos={rotulo} />
      </div>
    </form>
  );
}

/** Displays erros de formulários simples sem useActionState (raro). */
export function ErrosInline({ erros }: { erros?: Record<string, string> }) {
  if (!erros) return null;
  return (
    <ul className="list-inside list-disc text-sm text-[color:var(--wp-red)]">
      {Object.entries(erros).map(([campo, msg]) => (
        <li key={campo}>{`${campo}: ${msg}`}</li>
      ))}
    </ul>
  );
}
