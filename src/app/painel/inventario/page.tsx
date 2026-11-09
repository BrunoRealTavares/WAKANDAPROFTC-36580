export const instant = false;
// Rota bloqueante por design: le a sessao/cookies em todo request (Cache Components).

import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { TIPOS_MOVIMENTO, inventoryItems, inventoryMovements, users } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { ActionForm } from "@/components/painel/action-form";
import { Badge, Campo, EmptyState, Secao, dataHoraCurta, inputClasse } from "@/components/painel/ui";
import { acaoCriarItem, acaoRegistrarMovimentacao, acaoSalvarItem } from "./actions";

export default async function PaginaInventario({
  searchParams,
}: {
  searchParams: Promise<{ editar?: string }>;
}) {
  await requireUser();
  const sp = await searchParams;

  const [itens, movimentos, usuarios] = await Promise.all([
    db.select().from(inventoryItems).orderBy(inventoryItems.nome),
    db.select().from(inventoryMovements).orderBy(desc(inventoryMovements.createdAt)).limit(10),
    db.select({ id: users.id, nome: users.nome }).from(users),
  ]);
  const nomes = new Map(usuarios.map((u) => [u.id, u.nome]));
  const abaixo = itens.filter((i) => i.quantidade < i.minimo);
  const editar = sp.editar ? itens.find((i) => i.id === Number(sp.editar)) : undefined;

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="text-xl font-semibold text-[color:var(--wp-silver)]">Inventário</h1>
        <p className="text-sm text-[color:var(--wp-silver-mute)]">Estoque de materiais com alerta quando a quantidade fica abaixo do mínimo.</p>
      </header>

      {abaixo.length > 0 ? (
        <p className="rounded-md border border-[color:var(--wp-red)] bg-[color:var(--wp-graphite)] px-3 py-2 text-sm text-[color:var(--wp-red)]">
          {abaixo.length} item(ns) abaixo do mínimo: {abaixo.map((i) => i.nome).join(", ")}
        </p>
      ) : null}

      <Secao titulo={editar ? "Editar item" : "Criar item"}>
        {editar ? <p className="mb-2 text-xs text-[color:var(--wp-silver-mute)]">Editando “{editar.nome}” — <a href="/painel/inventario" className="underline">cancelar</a></p> : null}
        <ActionForm action={editar ? acaoSalvarItem : acaoCriarItem} rotulo={editar ? "Salvar item" : "Criar item"}>
          {editar ? <input type="hidden" name="id" value={editar.id} /> : null}
          <div className="grid gap-3 md:grid-cols-2">
            <Campo legenda="Nome">
              <input name="nome" required minLength={2} defaultValue={editar?.nome ?? ""} className={inputClasse} placeholder="Ex.: Parafuso M3" />
            </Campo>
            <Campo legenda="Categoria">
              <input name="categoria" defaultValue={editar?.categoria ?? "geral"} className={inputClasse} placeholder="motor, chassi, ferramenta…" />
            </Campo>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            <Campo legenda="Quantidade">
              <input name="quantidade" type="number" min={0} defaultValue={editar?.quantidade ?? 0} className={inputClasse} />
            </Campo>
            <Campo legenda="Mínimo">
              <input name="minimo" type="number" min={0} defaultValue={editar?.minimo ?? 0} className={inputClasse} />
            </Campo>
            <Campo legenda="Localização">
              <input name="localizacao" defaultValue={editar?.localizacao ?? ""} className={inputClasse} placeholder="Ex.: caixa vermelha" />
            </Campo>
            <Campo legenda="Estado">
              <input name="estado" defaultValue={editar?.estado ?? "bom"} className={inputClasse} placeholder="bom, danificado…" />
            </Campo>
          </div>
          <Campo legenda="Observações">
            <textarea name="observacoes" rows={2} defaultValue={editar?.observacoes ?? ""} className={inputClasse} />
          </Campo>
        </ActionForm>
      </Secao>

      <Secao titulo="Registrar movimentação">
        <ActionForm action={acaoRegistrarMovimentacao} rotulo="Registrar movimentação" compacto>
          <div className="grid gap-3 md:grid-cols-3">
            <Campo legenda="Item">
              <select name="itemId" className={inputClasse} defaultValue="" required>
                <option value="">—</option>
                {itens.map((i) => <option key={i.id} value={i.id}>{i.nome} (atual: {i.quantidade})</option>)}
              </select>
            </Campo>
            <Campo legenda="Tipo">
              <select name="tipo" className={inputClasse} defaultValue="entrada">
                {TIPOS_MOVIMENTO.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Campo>
            <Campo legenda="Quantidade (ajuste = novo total)">
              <input name="quantidade" type="number" min={0} required className={inputClasse} />
            </Campo>
          </div>
          <Campo legenda="Motivo">
            <input name="motivo" className={inputClasse} placeholder="Ex.: consumo no treino de campo" />
          </Campo>
        </ActionForm>
      </Secao>

      <Secao titulo={`Estoque (${itens.length})`}>
        {itens.length === 0 ? (
          <EmptyState titulo="Nenhum item cadastrado" mensagem="Cadastre os primeiros materiais da bancada." />
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-[color:var(--wp-silver-dim)]">
              <tr>
                <th className="py-2">Item</th>
                <th className="py-2">Categoria</th>
                <th className="py-2">Qtd / mín</th>
                <th className="py-2">Local</th>
                <th className="py-2">Estado</th>
                <th className="py-2">Editar</th>
              </tr>
            </thead>
            <tbody>
              {itens.map((i) => (
                <tr key={i.id} className="border-t border-[color:var(--wp-edge)]">
                  <td className="py-2 text-[color:var(--wp-silver)]">
                    {i.nome}{" "}
                    {i.quantidade < i.minimo ? <Badge cor="red">abaixo do mínimo</Badge> : null}
                  </td>
                  <td className="py-2 text-[color:var(--wp-silver-mute)]">{i.categoria}</td>
                  <td className="py-2 text-[color:var(--wp-silver-mute)]">{i.quantidade} / {i.minimo}</td>
                  <td className="py-2 text-[color:var(--wp-silver-mute)]">{i.localizacao ?? "?"}</td>
                  <td className="py-2 text-[color:var(--wp-silver-mute)]">{i.estado}</td>
                  <td className="py-2">
                    <a href={`/painel/inventario?editar=${i.id}`} className="text-[color:var(--wp-cyan)] underline">editar</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Secao>

      <Secao titulo="útimas movimentações">
        {movimentos.length === 0 ? (
          <p className="text-sm text-[color:var(--wp-silver-dim)]">Nenhuma movimentação até agora.</p>
        ) : (
          <ul className="flex flex-col gap-1 text-sm">
            {movimentos.map((m) => (
              <li key={m.id} className="text-[color:var(--wp-silver-mute)]">
                <Badge cor={m.tipo === "entrada" ? "cyan" : m.tipo === "saida" ? "red" : "gold"}>{m.tipo}</Badge>{" "}
                {itens.find((i) => i.id === m.itemId)?.nome ?? `item:${m.itemId}`} — q:{m.quantidade} — {m.motivo ?? "sem motivo"} — {nomes.get(m.usuarioId) ?? "?"} — {dataHoraCurta(m.createdAt)}
              </li>
            ))}
          </ul>
        )}
      </Secao>
    </div>
  );
}
