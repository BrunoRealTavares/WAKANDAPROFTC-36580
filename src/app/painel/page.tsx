export const instant = false;
// Rota bloqueante por design: le a sessao/cookies em todo request (Cache Components).

import Link from "next/link";
import { and, count, desc, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "@/db";
import { attendance, events, inventoryItems, tasks, users } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { EmptyState, PainelDeContagem, Secao, Badge, dataHoraCurta } from "@/components/painel/ui";

export default async function PaginaDashboard({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const user = await requireUser();
  const sp = await searchParams;
  const agora = new Date();

  const [pendentes, emAndamento, revisao, proximosEventos, itensBaixos, membrosAtivos, vaTarefas] = await Promise.all([
    db.select({ n: count() }).from(tasks).where(eq(tasks.status, "pendente")),
    db.select({ n: count() }).from(tasks).where(eq(tasks.status, "em_andamento")),
    db.select({ n: count() }).from(tasks).where(eq(tasks.status, "em_revisao")),
    db.select().from(events).where(gte(events.inicio, agora)).orderBy(events.inicio).limit(5),
    db.select().from(inventoryItems).where(sql`${inventoryItems.quantidade} < ${inventoryItems.minimo}`),
    db.select({ n: count() }).from(users).where(eq(users.ativo, 1)),
    db.select({ id: tasks.id, titulo: tasks.titulo, status: tasks.status, prioridade: tasks.prioridade }).from(tasks).orderBy(desc(tasks.updatedAt)).limit(5),
  ]);

  // Presença média dos últimos 3 eventos passados
  const ultimos = await db
    .select({ id: events.id })
    .from(events)
    .where(lte(events.inicio, agora))
    .orderBy(desc(events.inicio))
    .limit(3);
  let presencaMedia: number | null = null;
  if (ultimos.length > 0 && membrosAtivos[0].n > 0) {
    const presentes = await db
      .select({ n: count() })
      .from(attendance)
      .where(and(eq(attendance.presente, 1), sql`${attendance.eventId} in (${sql.join(ultimos.map((e) => sql`${e.id}`), sql`, `)})`));
    presencaMedia = Math.round((Number(presentes[0].n) / (ultimos.length * Number(membrosAtivos[0].n))) * 100);
  }

  const temTarefas = Number(pendentes[0].n) + Number(emAndamento[0].n) + Number(revisao[0].n) > 0;

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="text-xl font-semibold text-[color:var(--wp-silver)]">Olá, {user.nome.split(" ")[0]}</h1>
        <p className="text-sm text-[color:var(--wp-silver-mute)]">Estado real da equipe — nada inventado.</p>
      </header>
      {sp.erro === "permissao" ? (
        <p className="rounded-md border border-[color:var(--wp-red)] bg-[color:var(--wp-graphite)] px-3 py-2 text-sm text-[color:var(--wp-red)]">
          Você não tem permissão para essa área.
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <PainelDeContagem rotulo="Tarefas pendentes" valor={Number(pendentes[0].n)} destaque="gold" />
        <PainelDeContagem rotulo="Em andamento" valor={Number(emAndamento[0].n)} destaque="cyan" />
        <PainelDeContagem rotulo="Em revisão" valor={Number(revisao[0].n)} />
        <PainelDeContagem rotulo="Itens abaixo do mínimo" valor={itensBaixos.length} destaque={itensBaixos.length > 0 ? "red" : "cyan"} />
      </div>

      <Secao titulo="Próximos 5 eventos">
        {proximosEventos.length === 0 ? (
          <EmptyState titulo="Nenhum evento futuro" mensagem="Cadastre treinos, reuniões e competições no Calendário." acao="Ir ao calendário" acaoHref="/painel/calendario" />
        ) : (
          <ul className="divide-y divide-[color:var(--wp-edge)]">
            {proximosEventos.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <span className="text-[color:var(--wp-silver)]">{e.titulo}</span>
                <span className="flex items-center gap-2">
                  <Badge cor="cyan">{e.tipo}</Badge>
                  <span className="text-[color:var(--wp-silver-mute)]">{dataHoraCurta(e.inicio)}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </Secao>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Secao titulo="Presença nos últimos eventos">
          {presencaMedia === null ? (
            <EmptyState titulo="Sem histórico de presença ainda" mensagem="Registre presença nos eventos passados em Presença." acao="Registrar presença" acaoHref="/painel/presenca" />
          ) : (
            <p className="py-2 text-center text-3xl font-semibold text-[color:var(--wp-cyan)]">
              {presencaMedia}% <span className="block text-xs font-normal text-[color:var(--wp-silver-mute)]">média dos últimos {ultimos.length} evento(s)</span>
            </p>
          )}
        </Secao>

        <Secao titulo="Tarefas recentes">
          {!temTarefas ? (
            <EmptyState titulo="Nenhuma tarefa no quadro" mensagem="Crie a primeira tarefa da equipe." acao="Nova tarefa" acaoHref="/painel/tarefas" />
          ) : (
            <ul className="divide-y divide-[color:var(--wp-edge)]">
              {vaTarefas.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <Link href={`/painel/tarefas/${t.id}`} className="text-[color:var(--wp-silver)] hover:text-[color:var(--wp-cyan)]">{t.titulo}</Link>
                  <Badge cor={t.prioridade === "alta" ? "red" : t.prioridade === "media" ? "gold" : "edge"}>
                    {t.status === "pendente" ? "pendente" : t.status === "em_andamento" ? "andamento" : t.status === "em_revisao" ? "revisão" : "concluída"}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Secao>
      </div>
    </div>
  );
}
