export const instant = false;
// Rota bloqueante por design: le a sessao/cookies em todo request (Cache Components).

import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { TIPOS_ROBO, robotTests, robotVersions, users } from "@/db/schema";
import { requireUser, podeExcluirRegistro } from "@/lib/auth";
import { ActionForm } from "@/components/painel/action-form";
import { Badge, Campo, EmptyState, Secao, diaCurto, inputClasse } from "@/components/painel/ui";
import { acaoCriarTeste, acaoCriarVersao, acaoExcluirVersao } from "./actions";

export default async function PaginaRobo() {
  const user = await requireUser();
  const [versoes, testes, autores] = await Promise.all([
    db.select().from(robotVersions),
    db.select().from(robotTests),
    db.select({ id: users.id, nome: users.nome }).from(users),
  ]);
  const nomes = new Map(autores.map((u) => [u.id, u.nome]));
  const cronologico = [...versoes]
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    .map((v) => ({ v, testes: testes.filter((t) => t.versionId === v.id).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()) }));

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="text-xl font-semibold text-[color:var(--wp-silver)]">Robô</h1>
        <p className="text-sm text-[color:var(--wp-silver-mute)]">Versões mecânicas e de programação, com testes por versão.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Secao titulo="Registrar versão">
          <ActionForm action={acaoCriarVersao} rotulo="Registrar versão">
            <div className="grid gap-3 md:grid-cols-2">
              <Campo legenda="Nome">
                <input name="nome" required minLength={2} className={inputClasse} placeholder="Ex.: Protótipo 3 — esteira" />
              </Campo>
              <Campo legenda="Tipo">
                <select name="tipo" className={inputClasse} defaultValue="mecanica">
                  {TIPOS_ROBO.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Campo>
            </div>
            <Campo legenda="Notas"><textarea name="notas" rows={2} className={inputClasse} /></Campo>
            <Campo legenda="Alterações"><textarea name="alteracoes" rows={2} className={inputClasse} /></Campo>
          </ActionForm>
        </Secao>

        <Secao titulo="Registrar teste">
          <ActionForm action={acaoCriarTeste} rotulo="Registrar teste">
            <Campo legenda="Versão testada">
              <select name="versionId" className={inputClasse} defaultValue="" required>
                <option value="">—</option>
                {versoes.map((v) => <option key={v.id} value={v.id}>{v.nome}</option>)}
              </select>
            </Campo>
            <Campo legenda="Objetivo">
              <input name="objetivo" required minLength={3} className={inputClasse} placeholder="Ex.: validar velocidade de desarme da rampa" />
            </Campo>
            <Campo legenda="Procedimento"><textarea name="procedimento" rows={2} className={inputClasse} /></Campo>
            <div className="grid gap-3 md:grid-cols-2">
              <Campo legenda="Resultado"><textarea name="resultado" rows={2} className={inputClasse} /></Campo>
              <Campo legenda="Problemas"><textarea name="problemas" rows={2} className={inputClasse} /></Campo>
            </div>
          </ActionForm>
        </Secao>
      </div>

      {versoes.length >= 2 ? (
        <Secao titulo="Comparar versões">
          <p className="text-sm text-[color:var(--wp-silver-mute)]">
            Compare duas versões lado a lado em <Link href={`/painel/robo/comparar?a=${versoes[0].id}&b=${versoes[1].id}`} className="text-[color:var(--wp-cyan)] underline">/painel/robo/comparar?a=&amp;b=</Link>
          </p>
        </Secao>
      ) : null}

      <Secao titulo={`Histórico cronológico (${versoes.length} versões, ${testes.length} testes)`}>
        {versoes.length === 0 ? (
          <EmptyState titulo="Nenhuma versão registrada" mensagem="Registre a primeira versão do robô (mecânica ou programação)." />
        ) : (
          <ol className="flex flex-col gap-4 text-sm">
            {cronologico.map(({ v, testes: ts }) => (
              <li key={v.id} className="rounded-lg border border-[color:var(--wp-edge)] bg-[color:var(--wp-coal)] p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-[color:var(--wp-silver)]">
                    {v.nome} <Badge cor="cyan">{v.tipo}</Badge>
                  </p>
                  <span className="flex items-center gap-2 text-xs text-[color:var(--wp-silver-mute)]">
                    <Badge cor="edge">{nomes.get(v.registradoPorId) ?? "?"}</Badge>
                    <span>{diaCurto(v.createdAt)}</span>
                    <Link href={`/painel/robo/comparar?a=${v.id}&b=${v.id}`} className="underline">comparar</Link>
                    {podeExcluirRegistro(user.papel) ? (
                      <form action={acaoExcluirVersao}>
                        <input type="hidden" name="id" value={v.id} />
                        <button type="submit" className="rounded border border-[color:var(--wp-edge)] px-2 py-0.5 hover:border-[color:var(--wp-red)] hover:text-[color:var(--wp-red)]">excluir</button>
                      </form>
                    ) : null}
                  </span>
                </div>
                {v.notas ? <p className="mt-1 text-[color:var(--wp-silver-mute)]">Notas: {v.notas}</p> : null}
                {v.alteracoes ? <p className="mt-1 text-[color:var(--wp-silver-mute)]">Alterações: {v.alteracoes}</p> : null}
                {ts.length > 0 ? (
                  <ul className="mt-2 flex flex-col gap-1 border-l border-[color:var(--wp-edge)] pl-3">
                    {ts.map((t) => (
                      <li key={t.id}>
                        <span className="text-[color:var(--wp-silver)]">{t.objetivo}</span> — {t.resultado ? t.resultado : "sem resultado registrado"}
                        <span className="ml-1 text-xs text-[color:var(--wp-silver-dim)]">({diaCurto(t.createdAt)})</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ol>
        )}
      </Secao>
    </div>
  );
}
