import { asc, eq, gte } from "drizzle-orm";
import { db } from "@/db";
import { attendance, events, users } from "@/db/schema";
import { requireUser, podeVerFinanceiro } from "@/lib/auth";
import { ActionForm } from "@/components/painel/action-form";
import { Badge, EmptyState, Secao, diaCurto, inputClasse, dataHoraCurta } from "@/components/painel/ui";
import { acaoMarcarPresencaPropria, acaoRegistrarPresencaEquipe } from "./actions";

export default async function PaginaPresenca({
  searchParams,
}: {
  searchParams: Promise<{ evento?: string }>;
}) {
  const user = await requireUser();
  const sp = await searchParams;
  const agora = new Date();

  const [futuros, membros] = await Promise.all([
    db.select().from(events).where(gte(events.inicio, agora)).orderBy(events.inicio),
    db.select({ id: users.id, nome: users.nome }).from(users).where(eq(users.ativo, 1)).orderBy(asc(users.nome)),
  ]);

  const eventoId = Number(sp.evento) || futuros[0]?.id;
  const evento = futuros.find((e) => e.id === eventoId) ?? null;
  const atuais = evento ? await db.select().from(attendance).where(eq(attendance.eventId, evento.id)) : [];
  const marcadosIds = new Set(atuais.filter((a) => a.presente === 1).map((a) => a.userId));
  const possoGerenciar = podeVerFinanceiro(user.papel);

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="text-xl font-semibold text-[color:var(--wp-silver)]">Presença</h1>
        <p className="text-sm text-[color:var(--wp-silver-mute)]">Eventos futuros. {possoGerenciar ? "Administração/liderança marcam a equipe." : "Você marca apenas a sua própria presença."}</p>
      </header>

      {futuros.length === 0 ? (
        <EmptyState titulo="Nenhum evento futuro" mensagem="Cadastre um evento no Calendário para registrar presença." acao="Ir ao calendário" acaoHref="/painel/calendario" />
      ) : (
        <Secao titulo="Escolher evento">
          <form method="get" className="flex flex-wrap items-center gap-2 text-sm">
            <select name="evento" defaultValue={eventoId ?? ""} className={inputClasse}>
              {futuros.map((e) => (
                <option key={e.id} value={e.id}>{e.titulo} — {dataHoraCurta(e.inicio)}</option>
              ))}
            </select>
            <button type="submit" className="rounded-md border border-[color:var(--wp-edge)] px-3 py-1.5 hover:bg-[color:var(--wp-graphite)]">Abrir</button>
          </form>
        </Secao>
      )}

      {evento ? (
        possoGerenciar ? (
          <Secao titulo="Presença da equipe" >
            <p className="mb-3 text-xs text-[color:var(--wp-silver-mute)]">Marcados hoje neste evento: <Badge cor="cyan">{marcadosIds.size}</Badge></p>
            <ActionForm action={acaoRegistrarPresencaEquipe} rotulo="Salvar presença">
              <input type="hidden" name="eventoId" value={evento.id} />
              <ul className="grid gap-2 md:grid-cols-2">
                {membros.map((m) => (
                  <li key={m.id} className="flex items-center gap-2 rounded-md border border-[color:var(--wp-edge)] bg-[color:var(--wp-coal)] px-3 py-2 text-sm">
                    <input type="checkbox" name="presentes" value={m.id} defaultChecked={marcadosIds.has(m.id)} className="size-4 accent-[color:var(--wp-red)]" />
                    <span className="text-[color:var(--wp-silver)]">{m.nome}</span>
                  </li>
                ))}
              </ul>
            </ActionForm>
          </Secao>
        ) : (
          <Secao titulo="Fiquei no encontro">
            <p className="mb-3 text-sm text-[color:var(--wp-silver-mute)]">
              {marcadosIds.has(user.id)
                ? "Sua presença já está registrada neste evento."
                : "Confirme que você comparecerá/esteve neste encontro."}
            </p>
            <ActionForm action={acaoMarcarPresencaPropria} rotulo="Marcar minha presença" compacto>
              <input type="hidden" name="eventoId" value={evento.id} />
            </ActionForm>
          </Secao>
        )
      ) : null}
    </div>
  );
}
