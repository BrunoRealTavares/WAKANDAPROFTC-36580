import Link from "next/link";
import { and, gte, lte } from "drizzle-orm";
import { db } from "@/db";
import { TIPOS_EVENTO, events } from "@/db/schema";
import { requireUser, podeExcluirRegistro } from "@/lib/auth";
import { ActionForm } from "@/components/painel/action-form";
import { Badge, Campo, EmptyState, Secao, dataHoraCurta, inputClasse } from "@/components/painel/ui";
import { acaoCriarEvento, acaoExcluirEvento, acaoSalvarEvento } from "./actions";

const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const DIAS = ["D","S","T","Q","Q","S","S"];

function chave(d: Date): string {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, "0"), dia = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dia}`;
}
function paraDataLocal(d: Date): string {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, "0"), dia = String(d.getDate()).padStart(2, "0"), h = String(d.getHours()).padStart(2, "0"), min = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${dia}T${h}:${min}`;
}

export default async function PaginaCalendario({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string; ano?: string; editar?: string }>;
}) {
  const user = await requireUser();
  const sp = await searchParams;
  const hoje = new Date();
  const mes = Math.min(12, Math.max(1, Number(sp.mes) || hoje.getMonth() + 1));
  const ano = Math.min(2100, Math.max(2000, Number(sp.ano) || hoje.getFullYear()));

  const inicioMes = new Date(ano, mes - 1, 1, 0, 0, 0);
  const fimMes = new Date(ano, mes, 0, 23, 59, 59);
  const [doMes, proximos, todos] = await Promise.all([
    db.select().from(events).where(and(gte(events.inicio, inicioMes), lte(events.inicio, fimMes))).orderBy(events.inicio),
    db.select().from(events).where(gte(events.inicio, hoje)).orderBy(events.inicio).limit(8),
    db.select().from(events).orderBy(events.inicio),
  ]);

  const porDia = new Map<string, typeof doMes>();
  for (const e of doMes) {
    const k = chave(e.inicio);
    const arr = porDia.get(k) ?? [];
    arr.push(e);
    porDia.set(k, arr);
  }

  const primeiroDia = new Date(ano, mes - 1, 1).getDay();
  const totalDias = new Date(ano, mes, 0).getDate();
  const celulas: Array<number | null> = [];
  for (let i = 0; i < primeiroDia; i++) celulas.push(null);
  for (let d = 1; d <= totalDias; d++) celulas.push(d);

  const editar = sp.editar ? todos.find((e) => e.id === Number(sp.editar)) : undefined;

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-[color:var(--wp-silver)]">Calendário</h1>
        <div className="flex items-center gap-2 text-sm">
          <Link href={`/painel/calendario?mes=${mes === 1 ? 12 : mes - 1}&ano=${mes === 1 ? ano - 1 : ano}`} className="rounded-md border border-[color:var(--wp-edge)] px-2 py-1 hover:bg-[color:var(--wp-graphite)]">?</Link>
          <span className="text-[color:var(--wp-silver)]">{MESES[mes - 1]} {ano}</span>
          <Link href={`/painel/calendario?mes=${mes === 12 ? 1 : mes + 1}&ano=${mes === 12 ? ano + 1 : ano}`} className="rounded-md border border-[color:var(--wp-edge)] px-2 py-1 hover:bg-[color:var(--wp-graphite)]">?</Link>
        </div>
      </header>

      <div className="overflow-x-auto rounded-lg border border-[color:var(--wp-edge)] bg-[color:var(--wp-graphite)] p-3">
        <div className="grid min-w-[50rem] grid-cols-7 gap-1 text-xs">
          {DIAS.map((d, i) => (
            <div key={i} className="px-1 py-1 text-center text-[color:var(--wp-silver-dim)]">{d}</div>
          ))}
          {celulas.map((d, i) => (
            <div key={i} className={`min-h-20 rounded border border-[color:var(--wp-edge)] bg-[color:var(--wp-coal)] p-1 ${d === null ? "opacity-0" : ""}`}>
              {d !== null ? (
                <>
                  <p className="text-[color:var(--wp-silver-dim)]">{d}</p>
                  {(porDia.get(`${ano}-${String(mes).padStart(2, "0")}-${String(d).padStart(2, "0")}`) ?? []).map((e) => (
                    <Link key={e.id} href={`/painel/calendario?mes=${mes}&ano=${ano}&editar=${e.id}`} className="mt-1 block truncate rounded bg-[color:var(--wp-void)] px-1 py-0.5 text-[color:var(--wp-cyan)]" title={`${e.titulo} ? ${dataHoraCurta(e.inicio)}`}>
                      {e.titulo}
                    </Link>
                  ))}
                </>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <Secao titulo={editar ? "Editar evento" : "Criar evento"}>
        {editar ? <p className="mb-2 text-xs text-[color:var(--wp-silver-mute)]">Editando “{editar.titulo}” — <Link href={`/painel/calendario?mes=${mes}&ano=${ano}`} className="underline">cancelar edi??o</Link></p> : null}
        <ActionForm action={editar ? acaoSalvarEvento : acaoCriarEvento} rotulo={editar ? "Salvar evento" : "Criar evento"}>
          {editar ? <input type="hidden" name="id" value={editar.id} /> : null}
          <div className="grid gap-3 md:grid-cols-2">
            <Campo legenda="Título">
              <input name="titulo" required minLength={2} defaultValue={editar?.titulo ?? ""} className={inputClasse} placeholder="Ex.: Treino de campo" />
            </Campo>
            <Campo legenda="Tipo">
              <select name="tipo" defaultValue={editar?.tipo ?? "reuniao"} className={inputClasse}>
                {TIPOS_EVENTO.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Campo>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Campo legenda="Início (dia e hora)">
              <input name="inicio" type="datetime-local" required defaultValue={editar ? paraDataLocal(editar.inicio) : ""} className={inputClasse} />
            </Campo>
            <Campo legenda="Local (opcional)">
              <input name="local" defaultValue={editar?.local ?? ""} className={inputClasse} placeholder="Ex.: LAB 3" />
            </Campo>
          </div>
          <Campo legenda="Notas (opcional)">
            <textarea name="notas" rows={2} defaultValue={editar?.notas ?? ""} className={inputClasse} />
          </Campo>
        </ActionForm>
      </Secao>

      <Secao titulo="Próximos eventos">
        {proximos.length === 0 ? (
          <EmptyState titulo="Nenhum evento futuro" mensagem="Cadastre o próximo encontro da equipe no formulário acima." />
        ) : (
          <ul className="divide-y divide-[color:var(--wp-edge)] text-sm">
            {proximos.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                <span className="text-[color:var(--wp-silver)]">{e.titulo}</span>
                <span className="flex flex-wrap items-center gap-2">
                  <Badge cor="cyan">{e.tipo}</Badge>
                  {e.local ? <span className="text-[color:var(--wp-silver-mute)]">{e.local}</span> : null}
                  <span className="text-[color:var(--wp-silver-mute)]">{dataHoraCurta(e.inicio)}</span>
                  {podeExcluirRegistro(user.papel) ? (
                    <form action={acaoExcluirEvento}>
                      <input type="hidden" name="id" value={e.id} />
                      <button type="submit" className="rounded border border-[color:var(--wp-edge)] px-2 py-0.5 text-xs text-[color:var(--wp-silver-mute)] hover:border-[color:var(--wp-red)] hover:text-[color:var(--wp-red)]">excluir</button>
                    </form>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Secao>
    </div>
  );
}
