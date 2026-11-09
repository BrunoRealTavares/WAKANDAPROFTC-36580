import Link from "next/link";
import { notFound } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { engineeringLogs, robotVersions, tasks, users } from "@/db/schema";
import { requireUser, podeExcluirRegistro } from "@/lib/auth";
import { ActionForm } from "@/components/painel/action-form";
import { Badge, Campo, Secao, diaCurto, inputClasse } from "@/components/painel/ui";
import { acaoExcluirLog, acaoSalvarLog } from "../actions";

function paraDataLocal(d: Date): string {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, "0"), dia = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dia}`;
}

const CAMPOS_TEXTUAIS: Array<[string, "hipotese" | "solucao" | "experimento" | "materiais" | "resultado" | "aprendizados" | "proximasAcoes"]> = [
  ["Hipótese", "hipotese"],
  ["Solução", "solucao"],
  ["Experimento", "experimento"],
  ["Materiais", "materiais"],
  ["Resultado", "resultado"],
  ["Aprendizados", "aprendizados"],
  ["Próximas ações", "proximasAcoes"],
];

export default async function PaginaLogEngenharia({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const numero = Number(id);
  if (!Number.isInteger(numero) || numero <= 0) notFound();
  const log = (await db.select().from(engineeringLogs).where(eq(engineeringLogs.id, numero)).limit(1))[0];
  if (!log) notFound();

  const [listaTarefas, versoes, autores, versaoVinculada] = await Promise.all([
    db.select({ id: tasks.id, titulo: tasks.titulo }).from(tasks).orderBy(desc(tasks.updatedAt)).limit(50),
    db.select({ id: robotVersions.id, nome: robotVersions.nome }).from(robotVersions).orderBy(desc(robotVersions.updatedAt)).limit(50),
    db.select({ id: users.id, nome: users.nome }).from(users),
    log.robotVersionId ? db.select({ nome: robotVersions.nome }).from(robotVersions).where(eq(robotVersions.id, log.robotVersionId)).limit(1) : Promise.resolve([] as Array<{ nome: string }>),
  ]);
  const nomes = new Map(autores.map((u) => [u.id, u.nome]));
  const nomeTarefa = log.taskId ? listaTarefas.find((t) => t.id === log.taskId)?.titulo : undefined;

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs text-[color:var(--wp-silver-dim)]"><Link href="/painel/engenharia" className="underline">← Engenharia</Link></p>
          <h1 className="mt-1 max-w-2xl text-lg font-semibold text-[color:var(--wp-silver)]">{log.problema}</h1>
          <p className="mt-1 flex flex-wrap gap-1">
            <Badge cor="edge">{nomes.get(log.autorId) ?? "?"}</Badge>
            <Badge cor="cyan">{diaCurto(log.data)}</Badge>
            {nomeTarefa ? <Badge cor="gold">task: {nomeTarefa}</Badge> : null}
            {log.robotVersionId ? <Badge cor="gold">v: {versaoVinculada[0]?.nome ?? "?"}</Badge> : null}
          </p>
        </div>
      </header>

      <dl className="flex flex-col gap-3">
        {CAMPOS_TEXTUAIS.map(([rotulo, chave]) => {
          const valor = log[chave];
          if (!valor) return null;
          return (
            <div key={chave} className="rounded-lg border border-[color:var(--wp-edge)] bg-[color:var(--wp-graphite)] p-3">
              <dt className="text-xs uppercase tracking-wide text-[color:var(--wp-silver-dim)]">{rotulo}</dt>
              <dd className="mt-1 whitespace-pre-wrap text-sm text-[color:var(--wp-silver)]">{valor}</dd>
            </div>
          );
        })}
      </dl>

      <Secao titulo="Editar registro">
        <ActionForm action={acaoSalvarLog} rotulo="Salvar registro">
          <input type="hidden" name="id" value={log.id} />
          <Campo legenda="Problema">
            <input name="problema" required minLength={5} defaultValue={log.problema} className={inputClasse} />
          </Campo>
          <div className="grid gap-3 md:grid-cols-2">
            <Campo legenda="Hipótese"><textarea name="hipotese" rows={2} defaultValue={log.hipotese ?? ""} className={inputClasse} /></Campo>
            <Campo legenda="Solução"><textarea name="solucao" rows={2} defaultValue={log.solucao ?? ""} className={inputClasse} /></Campo>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Campo legenda="Experimento"><textarea name="experimento" rows={3} defaultValue={log.experimento ?? ""} className={inputClasse} /></Campo>
            <Campo legenda="Materiais"><textarea name="materiais" rows={3} defaultValue={log.materiais ?? ""} className={inputClasse} /></Campo>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Campo legenda="Resultado"><textarea name="resultado" rows={2} defaultValue={log.resultado ?? ""} className={inputClasse} /></Campo>
            <Campo legenda="Aprendizados"><textarea name="aprendizados" rows={2} defaultValue={log.aprendizados ?? ""} className={inputClasse} /></Campo>
          </div>
          <Campo legenda="Próximas ações"><textarea name="proximasAcoes" rows={2} defaultValue={log.proximasAcoes ?? ""} className={inputClasse} /></Campo>
          <div className="grid gap-3 md:grid-cols-3">
            <Campo legenda="Tarefa vinculada">
              <select name="taskId" defaultValue={log.taskId ?? ""} className={inputClasse}>
                <option value="">—</option>
                {listaTarefas.map((t) => <option key={t.id} value={t.id}>{t.titulo}</option>)}
              </select>
            </Campo>
            <Campo legenda="Versão do robô">
              <select name="robotVersionId" defaultValue={log.robotVersionId ?? ""} className={inputClasse}>
                <option value="">—</option>
                {versoes.map((v) => <option key={v.id} value={v.id}>{v.nome}</option>)}
              </select>
            </Campo>
            <Campo legenda="Data">
              <input name="data" type="date" defaultValue={paraDataLocal(log.data)} className={inputClasse} />
            </Campo>
          </div>
        </ActionForm>
      </Secao>

      {podeExcluirRegistro(user.papel) ? (
        <form action={acaoExcluirLog}>
          <input type="hidden" name="id" value={log.id} />
          <button type="submit" className="rounded-md border border-[color:var(--wp-red)] px-3 py-1.5 text-sm text-[color:var(--wp-red)] hover:bg-[color:var(--wp-graphite)]">Excluir registro</button>
        </form>
      ) : null}
    </div>
  );
}
