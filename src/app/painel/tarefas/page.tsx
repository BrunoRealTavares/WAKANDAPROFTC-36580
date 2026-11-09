export const instant = false;
// Rota bloqueante por design: le a sessao/cookies em todo request (Cache Components).

import Link from "next/link";
import { and, eq, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { CATEGORIAS_TASK, PRIORIDADES, STATUS_TASK, tasks, users } from "@/db/schema";
import { requireUser, podeExcluirRegistro } from "@/lib/auth";
import { ActionForm } from "@/components/painel/action-form";
import { Badge, Campo, EmptyState, inputClasse, diaCurto } from "@/components/painel/ui";
import { acaoCriarTarefa } from "./actions";

const ROTULO_STATUS: Record<string, string> = {
  pendente: "Pendentes",
  em_andamento: "Em andamento",
  em_revisao: "Em revisão",
  concluida: "Concluídas",
};

export default async function PaginaTarefas({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; categoria?: string; criada?: string; atualizada?: string; excluida?: string }>;
}) {
  await requireUser();
  const sp = await searchParams;

  const filtros: SQL[] = [];
  if (sp.status && (STATUS_TASK as readonly string[]).includes(sp.status)) filtros.push(eq(tasks.status, sp.status));
  if (sp.categoria && (CATEGORIAS_TASK as readonly string[]).includes(sp.categoria)) filtros.push(eq(tasks.categoria, sp.categoria));

  const [lista, responsaveis] = await Promise.all([
    db.select().from(tasks).where(filtros.length ? and(...filtros) : undefined).orderBy(tasks.updatedAt),
    db.select({ id: users.id, nome: users.nome }).from(users).where(eq(users.ativo, 1)).orderBy(users.nome),
  ]);

  const aberta = lista.length === 0 || sp.criada === "1" || sp.atualizada === "1";
  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-[color:var(--wp-silver)]">Tarefas</h1>
          <p className="text-sm text-[color:var(--wp-silver-mute)]">Quadro simples por status, com filtros.</p>
        </div>
        <form method="get" className="flex items-center gap-2 text-sm">
          <select name="status" defaultValue={sp.status ?? ""} className={inputClasse}>
            <option value="">Todos os status</option>
            {STATUS_TASK.map((s) => (
              <option key={s} value={s}>{ROTULO_STATUS[s]}</option>
            ))}
          </select>
          <select name="categoria" defaultValue={sp.categoria ?? ""} className={inputClasse}>
            <option value="">Todas as categorias</option>
            {CATEGORIAS_TASK.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button type="submit" className="rounded-md border border-[color:var(--wp-edge)] px-3 py-1.5 text-sm hover:bg-[color:var(--wp-graphite)]">Filtrar</button>
          <Link href="/painel/tarefas" className="text-[color:var(--wp-silver-dim)] underline">limpar</Link>
        </form>
      </header>

      <details open={aberta} className="rounded-lg border border-[color:var(--wp-edge)] bg-[color:var(--wp-graphite)] p-4">
        <summary className="cursor-pointer select-none font-medium text-[color:var(--wp-silver)]">Nova tarefa</summary>
        <div className="mt-3">
          <ActionForm action={acaoCriarTarefa} rotulo="Criar tarefa">
            <Campo legenda="Título">
              <input name="titulo" required minLength={2} className={inputClasse} placeholder="Ex.: Montar chassi do robô" />
            </Campo>
            <div className="grid gap-3 md:grid-cols-3">
              <Campo legenda="Categoria">
                <select name="categoria" className={inputClasse} defaultValue="engenharia">
                  {CATEGORIAS_TASK.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Campo>
              <Campo legenda="Prioridade">
                <select name="prioridade" className={inputClasse} defaultValue="media">
                  {PRIORIDADES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </Campo>
              <Campo legenda="Status">
                <select name="status" className={inputClasse} defaultValue="pendente">
                  {STATUS_TASK.map((s) => <option key={s} value={s}>{ROTULO_STATUS[s]}</option>)}
                </select>
              </Campo>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Campo legenda="Responsável (opcional)">
                <select name="responsavelId" className={inputClasse} defaultValue="">
                  <option value="">—</option>
                  {responsaveis.map((u) => <option key={u.id} value={u.id}>{u.nome}</option>)}
                </select>
              </Campo>
              <Campo legenda="Prazo (opcional)">
                <input name="prazo" type="datetime-local" className={inputClasse} />
              </Campo>
            </div>
            <Campo legenda="Descrição (opcional)">
              <textarea name="descricao" rows={3} className={inputClasse} />
            </Campo>
          </ActionForm>
        </div>
      </details>

      {lista.length === 0 ? (
        <EmptyState titulo="Nenhuma tarefa encontrada" mensagem="Ajuste os filtros ou crie a primeira tarefa acima." />
      ) : (
        <div className="grid gap-4 md:grid-cols-4">
          {STATUS_TASK.map((status) => {
            const grupo = lista.filter((t) => t.status === status);
            return (
              <div key={status} className="flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--wp-silver-dim)]">{ROTULO_STATUS[status]} ({grupo.length})</p>
                {grupo.map((t) => (
                  <Link
                    key={t.id}
                    href={`/painel/tarefas/${t.id}`}
                    className="block rounded-lg border border-[color:var(--wp-edge)] bg-[color:var(--wp-graphite)] p-3 hover:border-[color:var(--wp-cyan)]"
                  >
                    <p className="text-sm font-medium text-[color:var(--wp-silver)]">{t.titulo}</p>
                    <p className="mt-1 flex flex-wrap gap-1">
                      <Badge cor={t.prioridade === "alta" ? "red" : t.prioridade === "media" ? "gold" : "edge"}>{t.prioridade}</Badge>
                      <Badge cor="cyan">{t.categoria}</Badge>
                    </p>
                    {t.prazo ? <p className="mt-1 text-xs text-[color:var(--wp-silver-mute)]">Prazo: {diaCurto(t.prazo)}</p> : null}
                  </Link>
                ))}
                {grupo.length === 0 ? <p className="text-xs text-[color:var(--wp-silver-dim)]">vazio</p> : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
