export const instant = false;
// Rota bloqueante por design: le a sessao/cookies em todo request (Cache Components).

import { requireUser } from "@/lib/auth";
import { ActionForm } from "@/components/painel/action-form";
import { Campo, inputClasse } from "@/components/painel/ui";
import { acaoTrocarSenha } from "./actions";

// Obrigatória quando convitePendente = 1 (primeiro login com senha temporária).
export default async function PaginaTrocarSenha() {
  await requireUser(undefined, { permitirConvitePendente: true });
  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-2 text-xl font-semibold text-[color:var(--wp-silver)]">Trocar senha</h1>
      <p className="mb-6 text-sm text-[color:var(--wp-silver-mute)]">
        Sua conta está com senha temporária (convite pendente). Defina uma senha nova para continuar.
      </p>
      <div className="rounded-lg border border-[color:var(--wp-edge)] bg-[color:var(--wp-graphite)] p-5">
        <ActionForm action={acaoTrocarSenha} rotulo="Definir senha nova">
          <Campo legenda="Senha atual">
            <input name="atual" type="password" required className={inputClasse} />
          </Campo>
          <Campo legenda="Senha nova (mín. 8 caracteres)">
            <input name="nova" type="password" required minLength={8} className={inputClasse} />
          </Campo>
          <Campo legenda="Repita a senha nova">
            <input name="repetida" type="password" required minLength={8} className={inputClasse} />
          </Campo>
        </ActionForm>
      </div>
    </div>
  );
}
