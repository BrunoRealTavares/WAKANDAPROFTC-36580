import Link from "next/link";
import { notFound } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { auditLogs, CATEGORIAS_TASK, PRIORIDADES, STATUS_TASK, taskComments, tasks, users } from "@/db/schema";
import { requireUser, podeExcluirRegistro } from "@/lib/auth";
import { ActionForm } from "@/components/painel/action-form";
import { Badge, Campo, EmptyState, Secao, diaCurto, inputClasse } from "@/components/painel/ui";
import { acaoExcluirTarefa, acaoSalvarTarefa } from "../actions";
import { acaoComentarTarefa } from "./actions";

function paraDataLocal(d: Date): string {
  const a = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, "0"), dia = String(d.getDate()).padStart(2, "0"), h = String(d.getHours()).padStart(2, "0"), min = String(d.getMinutes()).padStart(2, "0");
  return `${a}-${m}-${dia}T${h}:${min}`;
}

export default async function PaginaTarefa({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const numero = Number(id);
  if (!Number.isInteger(numero) || numero <= 0) notFound();

  const tarefa = (await db.select().from(tasks).where(eq(tasks.id, numero)).limit(1))[0];
  if (!tarefa) notFound();

  const [comentarios, responsaveis, historico, autorComentarios] = await Promise.all([
    db.select().from(taskComments).where(eq(taskComments.taskId, numero)).orderBy(asc(taskComments.createdAt)),
    db.select({ id: users.id, nome: users.nome }).from(users).where(eq(users.ativo, 1)).orderBy(users.nome),
    db.select({ id: auditLogs.id, acao: auditLogs.acao, detalhe: auditLogs.detalheResumido, criado: auditLogs.createdAt }).from(auditLogs).where(and(eq(auditLogs.acao, "atualizar_task"))).orderBy(asc(auditLogs.createdAt)),
    db.select({ id: users.id, nome: users.nome }).from(users),
  ]);

  const nomes = new Map(responsaveis.map((u) => [u.id, u.nome] as const).concat(autorComentarios.map((u) => [u.id, u.nome] as const)));
  const nomeResponsavel = tarefa.responsavelId ? nomes.get(tarefa.responsavelId) ?? "?" : "?";
  const historicoDaTarefa = historico.filter((h) => {
    try { return JSON.parse(h.detalhe ?? "{}").taskId === numero; } catch { return false; }
  });

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs text-[color:var(--wp-silver-dim)]"><Link href="/painel/tarefas" className="underline">← Tarefas</Link></p>
          <h1 className="mt-1 text-xl font-semibold text-[color:var(--wp-silver)]">{tarefa.titulo}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-1 text-sm text-[color:var(--wp-silver-mute)]">
            <Badge cor={tarefa.prioridade === "alta" ? "red" : tarefa.prioridade === "media" ? "gold" : "edge"}>{tarefa.prioridade}</Badge>
            <Badge cor="cyan">{tarefa.categoria}</Badge>
            <Badge>{ROTULO(tarefa.status)}</Badge>
            <span>Responsável: {nomeResponsavel}</span>
            <span>Prazo: {diaCurto(tarefa.prazo)}</span>
            <span>Criada por {nomes.get(tarefa.criadoPorId) ?? "?"} em {diaCurto(tarefa.createdAt)}</span>
          </p>
        </div>
        {podeExcluirRegistro(user.papel) ? (
          <form action={acaoExcluirTarefa}>
            <input type="hidden" name="id" value={tarefa.id} />
            <button type="submit" className="rounded-md border border-[color:var(--wp-red)] px-3 py-1.5 text-sm text-[color:var(--wp-red)] hover:bg-[color:var(--wp-graphite)]">Excluir tarefa</button>
          </form>
        ) : null}
      </header>

      {tarefa.descricao ? <p className="text-sm text-[color:var(--wp-silver-mute)]">{tarefa.descricao}</p> : null}

      <Secao titulo="Editar tarefa">
        <ActionForm action={acaoSalvarTarefa} rotulo="Salvar alterações">
          <input type="hidden" name="id" value={tarefa.id} />
          <Campo legenda="Título">
            <input name="titulo" defaultValue={tarefa.titulo} required minLength={2} className={inputClasse} />
          </Campo>
          <div className="grid gap-3 md:grid-cols-3">
            <Campo legenda="Categoria">
              <select name="categoria" defaultValue={tarefa.categoria} className={inputClasse}>
                {CATEGORIAS_TASK.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Campo>
            <Campo legenda="Prioridade">
              <select name="prioridade" defaultValue={tarefa.prioridade} className={inputClasse}>
                {PRIORIDADES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </Campo>
            <Campo legenda="Status">
              <select name="status" defaultValue={tarefa.status} className={inputClasse}>
                {STATUS_TASK.map((s) => <option key={s} value={s}>{ROTULO(s)}</option>)}
              </select>
            </Campo>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Campo legenda="Responsável">
              <select name="responsavelId" defaultValue={tarefa.responsavelId ?? ""} className={inputClasse}>
                <option value="">—</option>
                {responsaveis.map((u) => <option key={u.id} value={u.id}>{u.nome}</option>)}
              </select>
            </Campo>
            <Campo legenda="Prazo">
              <input name="prazo" type="datetime-local" defaultValue={tarefa.prazo ? paraDataLocal(tarefa.prazo) : ""} className={inputClasse} />
            </Campo>
          </div>
          <Campo legenda="Descrição">
            <textarea name="descricao" rows={3} defaultValue={tarefa.descricao ?? ""} className={inputClasse} />
          </Campo>
        </ActionForm>
      </Secao>

      <Secao titulo={`Comentários (${comentarios.length})`}>
        {comentarios.length === 0 ? (
          <EmptyState titulo="Nenhum comentário" mensagem="Use o formulário abaixo para a primeira observação." />
        ) : (
          <ul className="flex flex-col gap-3">
            {comentarios.map((c) => (
              <li key={c.id} className="rounded-md border border-[color:var(--wp-edge)] bg-[color:var(--wp-coal)] p-3 text-sm">
                <p className="text-[color:var(--wp-silver)]">{c.texto}</p>
                <p className="mt-1 text-xs text-[color:var(--wp-silver-dim)]">{nomes.get(c.autorId) ?? "?"} — {diaCurto(c.createdAt)}</p>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3">
          <ActionForm action={acaoComentarTarefa} rotulo="Comentar" compacto>
            <input type="hidden" name="taskId" value={tarefa.id} />
            <textarea name="texto" rows={2} required className={inputClasse} placeholder="Escreva um comentário…" />
          </ActionForm>
        </div>
      </Secao>

      <Secao titulo={`Histórico de alterações (${historicoDaTarefa.length})`}>
        {historicoDaTarefa.length === 0 ? (
          <p className="text-sm text-[color:var(--wp-silver-dim)]">Nenhuma alteração registrada além da criação.</p>
        ) : (
          <ul className="flex flex-col gap-2 text-sm">
            {historicoDaTarefa.map((h) => {
              let campos = "";
              try { campos = Object.keys(JSON.parse(h.detalhe ?? "{}").alteracoes ?? {}).filter((k) => k !== "taskId").join(", "); } catch {}
              return (
                <li key={h.id} className="text-[color:var(--wp-silver-mute)]">
                  {diaCurto(h.criado)} — {campos ? `alterado: ${campos}` : "atualizada"}
                </li>
              );
            })}
          </ul>
        )}
      </Secao>
    </div>
  );
}

function ROTULO(status: string): string {
  const mapa: Record<string, string> = { pendente: "pendente", em_andamento: "andamento", em_revisao: "revisão", concluida: "concluída" };
  return mapa[status] ?? status;
}
