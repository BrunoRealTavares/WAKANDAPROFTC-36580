export const instant = false;
// Rota bloqueante por design: le a sessao/cookies em todo request (Cache Components).

import { and, desc, eq, like, or, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { documents, users } from "@/db/schema";
import { requireUser, podeExcluirDocumento } from "@/lib/auth";
import { ActionForm } from "@/components/painel/action-form";
import { Campo, EmptyState, Secao, dataHoraCurta, inputClasse } from "@/components/painel/ui";
import { acaoEnviarDocumento, acaoExcluirDocumento } from "./actions";

function kb(t: number): string {
  if (t >= 1048576) return (t / 1048576).toFixed(1) + " MB";
  return Math.max(1, Math.round(t / 1024)) + " KB";
}

export default async function PaginaDocumentos({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoria?: string }>;
}) {
  const user = await requireUser();
  const sp = await searchParams;

  const filtros: SQL[] = [];
  if (sp.q) filtros.push(like(documents.titulo, `%${sp.q}%`));
  if (sp.categoria) filtros.push(eq(documents.categoria, sp.categoria));

  const [lista, enviadores, categorias] = await Promise.all([
    db.select().from(documents).where(filtros.length ? and(...filtros) : undefined).orderBy(desc(documents.createdAt)),
    db.select({ id: users.id, nome: users.nome }).from(users),
    db.selectDistinct({ categoria: documents.categoria }).from(documents),
  ]);
  const nomes = new Map(enviadores.map((u) => [u.id, u.nome]));

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="text-xl font-semibold text-[color:var(--wp-silver)]">Documentos</h1>
        <p className="text-sm text-[color:var(--wp-silver-mute)]">Arquivos privados da equipe em data/uploads — download apenas com sessão ativa.</p>
      </header>

      <Secao titulo="Enviar documento">
        <ActionForm action={acaoEnviarDocumento} rotulo="Enviar">
          <div className="grid gap-3 md:grid-cols-2">
            <Campo legenda="Título">
              <input name="titulo" required minLength={2} className={inputClasse} placeholder="Ex.: Planilha da banca" />
            </Campo>
            <Campo legenda="Categoria">
              <input name="categoria" className={inputClasse} defaultValue="geral" placeholder="geral, apostila, comprovante…" />
            </Campo>
          </div>
          <Campo legenda="Arquivo (até 20 MB)">
            <input name="arquivo" type="file" required className="text-sm" />
          </Campo>
        </ActionForm>
      </Secao>

      <Secao titulo={`Lista (${lista.length})`}>
        <form method="get" className="mb-3 flex flex-wrap items-center gap-2 text-sm">
          <input name="q" defaultValue={sp.q ?? ""} placeholder="Buscar por título…" className={inputClasse} />
          <select name="categoria" defaultValue={sp.categoria ?? ""} className={inputClasse}>
            <option value="">Todas as categorias</option>
            {categorias.map((c) => <option key={c.categoria} value={c.categoria}>{c.categoria}</option>)}
          </select>
          <button type="submit" className="rounded-md border border-[color:var(--wp-edge)] px-3 py-1.5 hover:bg-[color:var(--wp-graphite)]">Buscar</button>
        </form>
        {lista.length === 0 ? (
          <EmptyState titulo="Nenhum documento" mensagem="Envie o primeiro arquivo acima ou ajuste a busca." />
        ) : (
          <ul className="divide-y divide-[color:var(--wp-edge)] text-sm">
            {lista.map((d) => (
              <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                <span className="text-[color:var(--wp-silver)]">{d.titulo}</span>
                <span className="flex flex-wrap items-center gap-2 text-xs text-[color:var(--wp-silver-mute)]">
                  <span className="rounded border border-[color:var(--wp-edge)] px-1.5 py-0.5">{d.categoria}</span>
                  <span>{kb(d.tamanho)}</span>
                  <span>{nomes.get(d.enviadoPorId) ?? "?"}</span>
                  <span>{dataHoraCurta(d.createdAt)}</span>
                  <a href={`/api/files/${d.id}`} className="rounded border border-[color:var(--wp-cyan)] px-2 py-0.5 text-[color:var(--wp-cyan)]">baixar</a>
                  {podeExcluirDocumento(user.papel) ? (
                    <form action={acaoExcluirDocumento}>
                      <input type="hidden" name="id" value={d.id} />
                      <button type="submit" className="rounded border border-[color:var(--wp-edge)] px-2 py-0.5 hover:border-[color:var(--wp-red)] hover:text-[color:var(--wp-red)]">excluir</button>
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
