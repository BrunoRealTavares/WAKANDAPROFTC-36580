export const instant = false;
// Rota bloqueante por design: le a sessao/cookies em todo request (Cache Components).

import { asc } from "drizzle-orm";
import { db } from "@/db";
import { PAPEIS, users } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { ActionForm } from "@/components/painel/action-form";
import { Badge, Campo, EmptyState, Secao, dataHoraCurta, inputClasse } from "@/components/painel/ui";
import { acaoCriarUsuario, acaoDesativarUsuario, acaoDesativarUsuarioForm, acaoResetarSenha, acaoResetarSenhaForm } from "./actions";

export default async function PaginaUsuarios() {
  const admin = await requireUser(["admin"]);
  const lista = await db
    .select({ id: users.id, nome: users.nome, email: users.email, papel: users.papel, ativo: users.ativo, convitePendente: users.convitePendente, ultimoLogin: users.ultimoLogin })
    .from(users)
    .orderBy(asc(users.nome));

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="text-xl font-semibold text-[color:var(--wp-silver)]">Usuários</h1>
        <p className="text-sm text-[color:var(--wp-silver-mute)]">Somente administração. Senhas temporárias aparecem UMA vez.</p>
      </header>

      <Secao titulo="Criar usuário">
        <ActionForm action={acaoCriarUsuario} rotulo="Criar e gerar senha temporária">
          <div className="grid gap-3 md:grid-cols-3">
            <Campo legenda="Nome (único)"><input name="nome" required minLength={2} className={inputClasse} /></Campo>
            <Campo legenda="E-mail (único)"><input name="email" type="email" required className={inputClasse} /></Campo>
            <Campo legenda="Papel">
              <select name="papel" className={inputClasse} defaultValue="integrante">
                {PAPEIS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </Campo>
          </div>
          <p className="text-xs text-[color:var(--wp-silver-mute)]">O usuário fica com convitePendente=1 e é levado a /painel/trocar-senha no primeiro login.</p>
        </ActionForm>
      </Secao>

      <Secao titulo={`Lista (${lista.length})`}>
        {lista.length === 0 ? (
          <EmptyState titulo="Nenhum usuário" mensagem="Crie o primeiro usuário acima (além do admin bootstrap)." />
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-[color:var(--wp-silver-dim)]">
              <tr>
                <th className="py-2">Nome</th>
                <th className="py-2">E-mail</th>
                <th className="py-2">Papel</th>
                <th className="py-2">último login</th>
                <th className="py-2">Estado</th>
                <th className="py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((u) => (
                <tr key={u.id} className="border-t border-[color:var(--wp-edge)]">
                  <td className="py-2 text-[color:var(--wp-silver)]">{u.nome} {u.id === admin.id ? <Badge cor="gold">você</Badge> : null}</td>
                  <td className="py-2 text-[color:var(--wp-silver-mute)]">{u.email}</td>
                  <td className="py-2"><Badge cor={u.papel === "admin" ? "red" : u.papel === "lider" ? "gold" : "edge"}>{u.papel}</Badge></td>
                  <td className="py-2 text-[color:var(--wp-silver-mute)]">{u.ultimoLogin ? dataHoraCurta(u.ultimoLogin) : "nunca"}</td>
                  <td className="py-2">
                    {u.ativo === 1 ? (u.convitePendente === 1 ? <Badge cor="gold">convite pendente</Badge> : <Badge cor="cyan">ativo</Badge>) : <Badge cor="red">desativado</Badge>}
                  </td>
                  <td className="py-2">
                    <div className="flex items-center gap-1">
                      <form action={acaoDesativarUsuarioForm}>
                        <input type="hidden" name="id" value={u.id} />
                        <button type="submit" className="rounded border border-[color:var(--wp-edge)] px-2 py-0.5 text-xs hover:border-[color:var(--wp-red)] hover:text-[color:var(--wp-red)]">
                          {u.ativo === 1 ? "desativar" : "reativar"}
                        </button>
                      </form>
                      <form action={acaoResetarSenhaForm} className="flex items-center gap-1">
                        <input type="hidden" name="id" value={u.id} />
                        <button type="submit" className="rounded border border-[color:var(--wp-edge)] px-2 py-0.5 text-xs">resetar senha</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Secao>
    </div>
  );
}
