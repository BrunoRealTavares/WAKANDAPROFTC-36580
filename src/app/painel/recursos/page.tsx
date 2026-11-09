export const instant = false;
// Rota bloqueante por design: le a sessao/cookies em todo request (Cache Components).

import { and, desc, eq, gte, lte } from "drizzle-orm";
import { db } from "@/db";
import { TIPOS_FINANCEIRO, documents, financialEntries, users } from "@/db/schema";
import { requireUser, isAdmin } from "@/lib/auth";
import { ActionForm } from "@/components/painel/action-form";
import { Badge, Campo, EmptyState, PainelDeContagem, Secao, diaCurto, inputClasse } from "@/components/painel/ui";
import { acaoAprovarLancamento, acaoCriarLancamento, acaoExcluirLancamento } from "./actions";

function reais(centavos: number): string {
  return (centavos / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function PaginaRecursos() {
  const user = await requireUser(["admin", "lider"]);
  const agora = new Date();
  const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1, 0, 0, 0);
  const fimMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 0, 23, 59, 59);

  const [lista, docs, autores] = await Promise.all([
    db.select().from(financialEntries).orderBy(desc(financialEntries.data), desc(financialEntries.id)),
    db.select({ id: documents.id, titulo: documents.titulo }).from(documents).orderBy(desc(documents.createdAt)).limit(50),
    db.select({ id: users.id, nome: users.nome }).from(users),
  ]);
  const nomes = new Map(autores.map((u) => [u.id, u.nome]));

  const doMes = lista.filter((l) => l.data >= inicioMes && l.data <= fimMes && l.aprovado === 1);
  const entradasMes = doMes.filter((l) => l.tipo === "entrada").reduce((s, l) => s + l.valorEmCentavos, 0);
  const despesasMes = doMes.filter((l) => l.tipo === "despesa").reduce((s, l) => s + l.valorEmCentavos, 0);

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="text-xl font-semibold text-[color:var(--wp-silver)]">Recursos</h1>
        <p className="text-sm text-[color:var(--wp-silver-mute)]">Entradas, despesas e aprovação (admin + liderança).</p>
      </header>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <PainelDeContagem rotulo="Entradas do mês (aprovadas)" valor={reais(entradasMes)} destaque="cyan" />
        <PainelDeContagem rotulo="Despesas do mês (aprovadas)" valor={reais(despesasMes)} destaque="red" />
        <PainelDeContagem rotulo="Saldo do mês" valor={reais(entradasMes - despesasMes)} destaque={entradasMes - despesasMes >= 0 ? "cyan" : "red"} />
      </div>

      <Secao titulo="Registrar lançamento">
        <ActionForm action={acaoCriarLancamento} rotulo="Registrar">
          <div className="grid gap-3 md:grid-cols-3">
            <Campo legenda="Tipo">
              <select name="tipo" className={inputClasse} defaultValue="entrada">
                {TIPOS_FINANCEIRO.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Campo>
            <Campo legenda="Valor (R$)">
              <input name="valor" type="number" step="0.01" min={0.01} required className={inputClasse} />
            </Campo>
            <Campo legenda="Data">
              <input name="data" type="date" required className={inputClasse} />
            </Campo>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Campo legenda="Categoria">
              <input name="categoria" defaultValue="geral" className={inputClasse} placeholder="patrocinio, material, transporte…" />
            </Campo>
            <Campo legenda="Comprovante (opcional — registre em Documentos e vincule)">
              <select name="comprovanteDocId" className={inputClasse} defaultValue="">
                <option value="">—</option>
                {docs.map((d) => <option key={d.id} value={d.id}>{d.titulo}</option>)}
              </select>
            </Campo>
          </div>
          <Campo legenda="Descrição">
            <textarea name="descricao" rows={2} className={inputClasse} />
          </Campo>
          {!isAdmin(user.papel) ? <p className="text-xs text-[color:var(--wp-silver-mute)]">Lançamentos de liderança entram pendentes até a administração aprovar.</p> : null}
        </ActionForm>
      </Secao>

      <Secao titulo={`Lançamentos pendentes de aprovação (${lista.filter((l) => l.aprovado === 0).length})`}>
        {lista.filter((l) => l.aprovado === 0).length === 0 ? (
          <p className="text-sm text-[color:var(--wp-silver-dim)]">Nada pendente.</p>
        ) : (
          <ul className="flex flex-col gap-2 text-sm">
            {lista.filter((l) => l.aprovado === 0).map((l) => (
              <li key={l.id} className="flex flex-wrap items-center justify-between gap-2 rounded border border-[color:var(--wp-edge)] bg-[color:var(--wp-coal)] p-2">
                <span>
                  <Badge cor={l.tipo === "entrada" ? "cyan" : "red"}>{l.tipo}</Badge> {reais(l.valorEmCentavos)} — {l.descricao ?? l.categoria}
                  <span className="ml-1 text-xs text-[color:var(--wp-silver-dim)]">({nomes.get(l.criadoPorId) ?? "?"} — {diaCurto(l.data)})</span>
                </span>
                {isAdmin(user.papel) ? (
                  <ActionForm action={acaoAprovarLancamento} rotulo="Aprovar" compacto>
                    <input type="hidden" name="id" value={l.id} />
                  </ActionForm>
                ) : (
                  <Badge cor="gold">aguardando admin</Badge>
                )}
              </li>
            ))}
          </ul>
        )}
      </Secao>

      <Secao titulo={`Histórico (${lista.length})`}>
        {lista.length === 0 ? (
          <EmptyState titulo="Nenhum lançamento" mensagem="Registre a primeira entrada ou despesa." />
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-[color:var(--wp-silver-dim)]">
              <tr>
                <th className="py-2">Data</th>
                <th className="py-2">Tipo</th>
                <th className="py-2">Valor</th>
                <th className="py-2">Descrição</th>
                <th className="py-2">Status</th>
                <th className="py-2">Comprovante</th>
                {isAdmin(user.papel) ? <th className="py-2">Ações</th> : null}
              </tr>
            </thead>
            <tbody>
              {lista.map((l) => (
                <tr key={l.id} className="border-t border-[color:var(--wp-edge)]">
                  <td className="py-2 text-[color:var(--wp-silver-mute)]">{diaCurto(l.data)}</td>
                  <td className="py-2"><Badge cor={l.tipo === "entrada" ? "cyan" : "red"}>{l.tipo}</Badge></td>
                  <td className="py-2 text-[color:var(--wp-silver)]">{reais(l.valorEmCentavos)}</td>
                  <td className="py-2 text-[color:var(--wp-silver-mute)]">{l.descricao ?? l.categoria}</td>
                  <td className="py-2">{l.aprovado === 1 ? <Badge cor="cyan">aprovado</Badge> : <Badge cor="gold">pendente</Badge>}</td>
                  <td className="py-2">{l.comprovanteDocId ? <a href={`/api/files/${l.comprovanteDocId}`} className="text-[color:var(--wp-cyan)] underline">ver</a> : "—"}</td>
                  {isAdmin(user.papel) ? (
                    <td className="py-2">
                      <form action={acaoExcluirLancamento}>
                        <input type="hidden" name="id" value={l.id} />
                        <button type="submit" className="rounded border border-[color:var(--wp-edge)] px-2 py-0.5 text-xs hover:border-[color:var(--wp-red)] hover:text-[color:var(--wp-red)]">excluir</button>
                      </form>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Secao>
    </div>
  );
}
