"use client";

import { ActionForm } from "@/components/painel/action-form";
import { acaoLogin, acaoSolicitarRecuperacao } from "./actions";

export function FormularioLogin() {
  return (
    <div className="flex flex-col gap-6">
      <ActionForm action={acaoLogin} rotulo="Entrar">
        <input name="email" type="email" required placeholder="E-mail" className="w-full rounded-md border border-[color:var(--wp-edge)] bg-[color:var(--wp-coal)] px-3 py-2 text-sm" />
        <input name="senha" type="password" required placeholder="Senha" className="w-full rounded-md border border-[color:var(--wp-edge)] bg-[color:var(--wp-coal)] px-3 py-2 text-sm" />
      </ActionForm>
      <details className="text-sm text-[color:var(--wp-silver-mute)]">
        <summary className="cursor-pointer select-none">Perdeu a senha? Recuperação simples (sem e-mail)</summary>
        <div className="mt-3">
          <ActionForm action={acaoSolicitarRecuperacao} rotulo="Solicitar ao admin" compacto>
            <input name="email" type="email" required placeholder="Seu e-mail cadastrado" className="w-full rounded-md border border-[color:var(--wp-edge)] bg-[color:var(--wp-coal)] px-3 py-2 text-sm" />
          </ActionForm>
        </div>
      </details>
    </div>
  );
}
