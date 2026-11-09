export const instant = false;
// Rota bloqueante por design: le a sessao/cookies em todo request (Cache Components).

import { notFound } from "next/navigation";
import { inArray } from "drizzle-orm";
import { db } from "@/db";
import { robotTests, robotVersions, users } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { Badge, EmptyState, diaCurto } from "@/components/painel/ui";

type Teste = { id: number; objetivo: string; procedimento: string | null; resultado: string | null; problemas: string | null; criado: Date };

function Coluna({
  titulo,
  tipo,
  notas,
  alteracoes,
  registrado,
  criado,
  testes,
}: {
  titulo: string;
  tipo: string;
  notas: string | null;
  alteracoes: string | null;
  registrado: string;
  criado: string;
  testes: Teste[];
}) {
  return (
    <div className="min-w-0 flex-1 rounded-lg border border-[color:var(--wp-edge)] bg-[color:var(--wp-graphite)] p-4">
      <h2 className="font-semibold text-[color:var(--wp-silver)]">
        {titulo} <Badge cor="cyan">{tipo}</Badge>
      </h2>
      <p className="mt-1 text-xs text-[color:var(--wp-silver-mute)]">registrado por {registrado} em {criado}</p>
      {notas ? <p className="mt-2 text-sm text-[color:var(--wp-silver)]">Notas: {notas}</p> : null}
      {alteracoes ? <p className="mt-1 text-sm text-[color:var(--wp-silver-mute)]">Alterações: {alteracoes}</p> : null}
      <p className="mt-3 text-xs uppercase tracking-wide text-[color:var(--wp-silver-dim)]">Testes ({testes.length})</p>
      <ul className="mt-1 flex flex-col gap-2 text-sm">
        {testes.length === 0 ? <li className="text-[color:var(--wp-silver-dim)]">nenhum teste registrado</li> : null}
        {testes.map((t) => (
          <li key={t.id} className="rounded border border-[color:var(--wp-edge)] bg-[color:var(--wp-coal)] p-2">
            <p className="text-[color:var(--wp-silver)]">
              {t.objetivo} <span className="text-xs text-[color:var(--wp-silver-dim)]">({diaCurto(t.criado)})</span>
            </p>
            {t.procedimento ? <p className="text-[color:var(--wp-silver-mute)]">Procedimento: {t.procedimento}</p> : null}
            {t.resultado ? <p className="text-[color:var(--wp-cyan)]">Resultado: {t.resultado}</p> : null}
            {t.problemas ? <p className="text-[color:var(--wp-red)]">Problemas: {t.problemas}</p> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function PaginaComparar({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string }>;
}) {
  await requireUser();
  const sp = await searchParams;
  const idA = Number(sp.a);
  const idB = Number(sp.b);

  if (!Number.isInteger(idA) || !Number.isInteger(idB) || idA <= 0 || idB <= 0 || idA === idB) {
    return (
      <div className="flex flex-col gap-5">
        <h1 className="text-xl font-semibold text-[color:var(--wp-silver)]">Comparar versões</h1>
        <EmptyState titulo="Escolha duas versões diferentes" mensagem="Use /painel/robo/comparar?a=ID&b=ID com IDs distintos (veja a lista em /painel/robo)." acao="Voltar ao robô" acaoHref="/painel/robo" />
      </div>
    );
  }

  const [versoes, testesBrutos, autores] = await Promise.all([
    db.select().from(robotVersions).where(inArray(robotVersions.id, [idA, idB])),
    db.select().from(robotTests).where(inArray(robotTests.versionId, [idA, idB])),
    db.select({ id: users.id, nome: users.nome }).from(users),
  ]);

  const vA = versoes.find((v) => v.id === idA);
  const vB = versoes.find((v) => v.id === idB);
  if (!vA || !vB) notFound();

  const nomes = new Map(autores.map((u) => [u.id, u.nome]));
  const testesDe = (vid: number): Teste[] =>
    testesBrutos
      .filter((t) => t.versionId === vid)
      .map((t) => ({ id: t.id, objetivo: t.objetivo, procedimento: t.procedimento, resultado: t.resultado, problemas: t.problemas, criado: t.createdAt }))
      .sort((a, b) => a.criado.getTime() - b.criado.getTime());

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-semibold text-[color:var(--wp-silver)]">Comparar versões</h1>
      <div className="flex flex-col gap-4 md:flex-row">
        <Coluna titulo={vA.nome} tipo={vA.tipo} notas={vA.notas} alteracoes={vA.alteracoes} registrado={nomes.get(vA.registradoPorId) ?? "?"} criado={diaCurto(vA.createdAt)} testes={testesDe(idA)} />
        <Coluna titulo={vB.nome} tipo={vB.tipo} notas={vB.notas} alteracoes={vB.alteracoes} registrado={nomes.get(vB.registradoPorId) ?? "?"} criado={diaCurto(vB.createdAt)} testes={testesDe(idB)} />
      </div>
    </div>
  );
}
