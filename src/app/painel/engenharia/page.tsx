export const instant = false;
// Rota bloqueante por design: le a sessao/cookies em todo request (Cache Components).

import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { engineeringLogs, robotVersions, tasks, users } from "@/db/schema";
import { requireUser, podeExcluirRegistro } from "@/lib/auth";
import { ActionForm } from "@/components/painel/action-form";
import { Badge, Campo, EmptyState, Secao, diaCurto, inputClasse } from "@/components/painel/ui";
import { acaoCriarLog, acaoExcluirLog } from "./actions";

export default async function PaginaEngenharia() {
  const user = await requireUser();
  const [logs, listaTarefas, versoes, autores] = await Promise.all([
    db.select().from(engineeringLogs).orderBy(desc(engineeringLogs.data), desc(engineeringLogs.id)),
    db.select({ id: tasks.id, titulo: tasks.titulo }).from(tasks).orderBy(desc(tasks.updatedAt)).limit(50),
    db.select({ id: robotVersions.id, nome: robotVersions.nome }).from(robotVersions).orderBy(desc(robotVersions.updatedAt)).limit(50),
    db.select({ id: users.id, nome: users.nome }).from(users),
  ]);
  const nomes = new Map(autores.map((u) => [u.id, u.nome]));
  const nomesTarefas = new Map(listaTarefas.map((t) => [t.id, t.titulo]));

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="text-xl font-semibold text-[color:var(--wp-silver)]">Engenharia</h1>
        <p className="text-sm text-[color:var(--wp-silver-mute)]">Método científico: problema, hipótese, experimento, resultado e aprendizados.</p>
      </header>

      <Secao titulo="Novo registro">
        <ActionForm action={acaoCriarLog} rotulo="Registrar">
          <Campo legenda="Problema">
            <input name="problema" required minLength={5} className={inputClasse} placeholder="O robô deslinha: caixa de redução folgada…" />
          </Campo>
          <div className="grid gap-3 md:grid-cols-2">
            <Campo legenda="Hipótese"><textarea name="hipotese" rows={2} className={inputClasse} /></Campo>
            <Campo legenda="Solução"><textarea name="solucao" rows={2} className={inputClasse} /></Campo>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Campo legenda="Experimento"><textarea name="experimento" rows={3} className={inputClasse} /></Campo>
            <Campo legenda="Materiais"><textarea name="materiais" rows={3} className={inputClasse} /></Campo>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Campo legenda="Resultado"><textarea name="resultado" rows={2} className={inputClasse} /></Campo>
            <Campo legenda="Aprendizados"><textarea name="aprendizados" rows={2} className={inputClasse} /></Campo>
          </div>
          <Campo legenda="Próximas ações"><textarea name="proximasAcoes" rows={2} className={inputClasse} /></Campo>
          <div className="grid gap-3 md:grid-cols-3">
            <Campo legenda="Tarefa vinculada (opcional)">
              <select name="taskId" defaultValue="" className={inputClasse}>
                <option value="">—</option>
                {listaTarefas.map((t) => <option key={t.id} value={t.id}>{t.titulo}</option>)}
              </select>
            </Campo>
            <Campo legenda="Versão do robô (opcional)">
              <select name="robotVersionId" defaultValue="" className={inputClasse}>
                <option value="">—</option>
                {versoes.map((v) => <option key={v.id} value={v.id}>{v.nome}</option>)}
              </select>
            </Campo>
            <Campo legenda="Data do experimento">
              <input name="data" type="date" className={inputClasse} />
            </Campo>
          </div>
        </ActionForm>
      </Secao>

      <Secao titulo={`Registros (${logs.length})`}>
        {logs.length === 0 ? (
          <EmptyState titulo="Nenhum registro ainda" mensagem="Documente o primeiro experimento — mesmo testes que falharam contam." />
        ) : (
          <ul className="flex flex-col gap-3 text-sm">
            {logs.map((l) => (
              <li key={l.id} className="rounded-lg border border-[color:var(--wp-edge)] bg-[color:var(--wp-coal)] p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link href={`/painel/engenharia/${l.id}`} className="font-medium text-[color:var(--wp-silver)] hover:text-[color:var(--wp-cyan)]">{l.problema}</Link>
                  <span className="flex flex-wrap items-center gap-1">
                    <Badge cor="edge">{nomes.get(l.autorId) ?? "?"}</Badge>
                    <Badge cor="cyan">{diaCurto(l.data)}</Badge>
                    {l.taskId ? <Badge cor="gold">task: {nomesTarefas.get(l.taskId) ?? "?"}</Badge> : null}
                    {l.robotVersionId ? <Badge cor="gold">v: {versoes.find((v) => v.id === l.robotVersionId)?.nome ?? "?"}</Badge> : null}
                    {podeExcluirRegistro(user.papel) ? (
                      <form action={acaoExcluirLog}>
                        <input type="hidden" name="id" value={l.id} />
                        <button type="submit" className="rounded border border-[color:var(--wp-edge)] px-2 py-0.5 text-xs text-[color:var(--wp-silver-mute)] hover:border-[color:var(--wp-red)] hover:text-[color:var(--wp-red)]">excluir</button>
                      </form>
                    ) : null}
                  </span>
                </div>
                {l.resultado ? <p className="mt-1 text-[color:var(--wp-silver-mute)]">Resultado: {l.resultado.slice(0, 120)}{l.resultado.length > 120 ? "…" : ""}</p> : null}
              </li>
            ))}
          </ul>
        )}
      </Secao>
    </div>
  );
}
