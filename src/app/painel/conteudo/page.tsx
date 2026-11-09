import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { CATEGORIAS_GALERIA, galleryAssets, partners, posts, siteSettings, teamMembers, timelineEvents } from "@/db/schema";
import { requireUser, isAdmin } from "@/lib/auth";
import { ActionForm } from "@/components/painel/action-form";
import { Badge, Campo, EmptyState, Secao, diaCurto, inputClasse } from "@/components/painel/ui";
import {
  acaoAlternarRoboRevelado, acaoArquivar, acaoCriarAsset, acaoCriarMembro, acaoCriarParceiro,
  acaoCriarPost, acaoCriarTimeline, acaoExcluirConteudo, acaoPublicar, acaoSalvarAsset,
  acaoSalvarMembro, acaoSalvarParceiro, acaoSalvarPost, acaoSalvarTimeline,
} from "./actions";

const SECOES = ["posts", "galeria", "membros", "parceiros", "timeline"] as const;
type Secao = (typeof SECOES)[number];

function BadgeStatus({ status }: { status: string }) {
  const cor = status === "publicado" ? "cyan" : status === "revisao" ? "gold" : status === "rascunho" ? "edge" : "red";
  return <Badge cor={cor}>{
    status === "rascunho" ? "rascunho" : status === "revisao" ? "revisão" : status === "publicado" ? "publicado" : "arquivado"
  }</Badge>;
}

// FORMULÁRIOS POR SESSÃO (criar/editar usar action() certo via variavel)
export default async function PaginaConteudo({
  searchParams,
}: {
  searchParams: Promise<{ secao?: string; editar?: string }>;
}) {
  const user = await requireUser(["admin", "lider"]);
  const sp = await searchParams;
  const secao = (SECOES as readonly string[]).includes(sp.secao ?? "") ? (sp.secao as Secao) : "posts";
  const admin = isAdmin(user.papel);

  const [listaPosts, listaGaleria, listaMembros, listaParceiros, listaTimeline, configuracao] = await Promise.all([
    db.select().from(posts).orderBy(desc(posts.updatedAt)),
    db.select().from(galleryAssets).orderBy(desc(galleryAssets.updatedAt)),
    db.select().from(teamMembers).orderBy(desc(teamMembers.updatedAt)),
    db.select().from(partners).orderBy(desc(partners.updatedAt)),
    db.select().from(timelineEvents).orderBy(timelineEvents.ordem),
    db.select().from(siteSettings).where(eq(siteSettings.chave, "roboRevelado")),
  ]);
  const roboRevelado = configuracao[0]?.valor === "1";
  const editarId = sp.editar ? Number(sp.editar) : null;

  const postEditar = secao === "posts" ? listaPosts.find((p) => p.id === editarId) : undefined;
  const assetEditar = secao === "galeria" ? listaGaleria.find((p) => p.id === editarId) : undefined;
  const membroEditar = secao === "membros" ? listaMembros.find((p) => p.id === editarId) : undefined;
  const parceiroEditar = secao === "parceiros" ? listaParceiros.find((p) => p.id === editarId) : undefined;
  const timelineEditar = secao === "timeline" ? listaTimeline.find((p) => p.id === editarId) : undefined;

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-[color:var(--wp-silver)]">Conteúdo</h1>
          <p className="text-sm text-[color:var(--wp-silver-mute)]">CMS do site público. Rascunhos de liderança; publicar exige administração.</p>
        </div>
        <form method="get" className="flex items-center gap-2 text-sm">
          <select name="secao" defaultValue={secao} className={inputClasse}>
            <option value="posts">Posts (diário)</option>
            <option value="galeria">Galeria</option>
            <option value="membros">Membros (equipe)</option>
            <option value="parceiros">Parceiros</option>
            <option value="timeline">Linha do tempo</option>
          </select>
          <button type="submit" className="rounded-md border border-[color:var(--wp-edge)] px-3 py-1.5 hover:bg-[color:var(--wp-graphite)]">Selecionar</button>
        </form>
      </header>

      <Secao titulo="Publicação: robô revelado (setting do site)">
        <p className="mb-3 text-sm text-[color:var(--wp-silver-mute)]">
          Estado atual: {roboRevelado ? <Badge cor="cyan">roboRevelado=1 (público vê o robô)</Badge> : <Badge cor="red">roboRevelado=0 (sigiloso)</Badge>}
        </p>
        <ActionForm action={acaoAlternarRoboRevelado} rotulo={roboRevelado ? "Esconder robô (sigilo)" : "Revelar robô"} compacto>
          <input type="hidden" name="valor" value={roboRevelado ? "0" : "1"} />
        </ActionForm>
      </Secao>
      {secao === "posts" ? (
        <Secao titulo={postEditar ? "Editar post" : "Criar post"}>
          <ActionForm action={postEditar ? acaoSalvarPost : acaoCriarPost} rotulo={postEditar ? "Salvar" : "Criar rascunho"}>
            {postEditar ? <input type="hidden" name="id" value={postEditar.id} /> : null}
            <div className="grid gap-3 md:grid-cols-3">
              <Campo legenda="Título"><input name="titulo" required minLength={2} defaultValue={postEditar?.titulo ?? ""} className={inputClasse} /></Campo>
              <Campo legenda="Categoria"><input name="categoria" defaultValue={postEditar?.categoria ?? "geral"} className={inputClasse} /></Campo>
              <Campo legenda="Autor"><input name="autor" required defaultValue={postEditar?.autor ?? user.nome} className={inputClasse} /></Campo>
            </div>
            <Campo legenda="Imagem (URL, opcional)"><input name="imagemUrl" type="url" defaultValue={postEditar?.imagemUrl ?? ""} className={inputClasse} /></Campo>
            <Campo legenda="Resumo"><textarea name="resumo" rows={2} defaultValue={postEditar?.resumo ?? ""} className={inputClasse} /></Campo>
            <Campo legenda="Conteúdo"><textarea name="conteudo" rows={6} defaultValue={postEditar?.conteudo ?? ""} className={inputClasse} /></Campo>
          </ActionForm>
        </Secao>
      ) : null}

      {secao === "galeria" ? (
        <Secao titulo={assetEditar ? "Editar média" : "Criar média"}>
          <ActionForm action={assetEditar ? acaoSalvarAsset : acaoCriarAsset} rotulo={assetEditar ? "Salvar" : "Criar rascunho"}>
            {assetEditar ? <input type="hidden" name="id" value={assetEditar.id} /> : null}
            <div className="grid gap-3 md:grid-cols-2">
              <Campo legenda="Título"><input name="titulo" required minLength={2} defaultValue={assetEditar?.titulo ?? ""} className={inputClasse} /></Campo>
              <Campo legenda="Categoria">
                <select name="categoria" defaultValue={assetEditar?.categoria ?? "equipe"} className={inputClasse}>
                  {CATEGORIAS_GALERIA.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Campo>
            </div>
            <Campo legenda="URL da imagem"><input name="url" required defaultValue={assetEditar?.url ?? ""} className={inputClasse} /></Campo>
            <Campo legenda="Descrição"><textarea name="descricao" rows={2} defaultValue={assetEditar?.descricao ?? ""} className={inputClasse} /></Campo>
          </ActionForm>
        </Secao>
      ) : null}

      {secao === "membros" ? (
        <Secao titulo={membroEditar ? "Editar membro público" : "Criar membro público"}>
          <ActionForm action={membroEditar ? acaoSalvarMembro : acaoCriarMembro} rotulo={membroEditar ? "Salvar" : "Criar rascunho"}>
            {membroEditar ? <input type="hidden" name="id" value={membroEditar.id} /> : null}
            <div className="grid gap-3 md:grid-cols-3">
              <Campo legenda="Nome"><input name="nome" required minLength={2} defaultValue={membroEditar?.nome ?? ""} className={inputClasse} /></Campo>
              <Campo legenda="Função"><input name="funcao" required defaultValue={membroEditar?.funcao ?? ""} className={inputClasse} /></Campo>
              <Campo legenda="área"><input name="area" required defaultValue={membroEditar?.area ?? ""} className={inputClasse} /></Campo>
            </div>
            <Campo legenda="Bio"><textarea name="bio" rows={3} defaultValue={membroEditar?.bio ?? ""} className={inputClasse} /></Campo>
            <Campo legenda="Foto (URL, opcional)"><input name="fotoUrl" type="url" defaultValue={membroEditar?.fotoUrl ?? ""} className={inputClasse} /></Campo>
            <label className="flex items-center gap-2 text-sm text-[color:var(--wp-silver-mute)]">
              <input type="checkbox" name="exibir" defaultChecked={membroEditar ? membroEditar.exibir === 1 : true} className="size-4 accent-[color:var(--wp-red)]" /> Exibir no site
            </label>
          </ActionForm>
        </Secao>
      ) : null}
      {secao === "parceiros" ? (
        <Secao titulo={parceiroEditar ? "Editar parceiro" : "Criar parceiro"}>
          <ActionForm action={parceiroEditar ? acaoSalvarParceiro : acaoCriarParceiro} rotulo={parceiroEditar ? "Salvar" : "Criar rascunho"}>
            {parceiroEditar ? <input type="hidden" name="id" value={parceiroEditar.id} /> : null}
            <div className="grid gap-3 md:grid-cols-3">
              <Campo legenda="Nome"><input name="nome" required minLength={2} defaultValue={parceiroEditar?.nome ?? ""} className={inputClasse} /></Campo>
              <Campo legenda="Nível"><input name="nivel" required defaultValue={parceiroEditar?.nivel ?? "apoio"} className={inputClasse} placeholder="apoio, bronze, ouro…" /></Campo>
              <Campo legenda="URL (opcional)"><input name="url" type="url" defaultValue={parceiroEditar?.url ?? ""} className={inputClasse} /></Campo>
            </div>
          </ActionForm>
        </Secao>
      ) : null}

      {secao === "timeline" ? (
        <Secao titulo={timelineEditar ? "Editar marco" : "Criar marco"}>
          <ActionForm action={timelineEditar ? acaoSalvarTimeline : acaoCriarTimeline} rotulo={timelineEditar ? "Salvar" : "Criar rascunho"}>
            {timelineEditar ? <input type="hidden" name="id" value={timelineEditar.id} /> : null}
            <div className="grid gap-3 md:grid-cols-2">
              <Campo legenda="Título"><input name="titulo" required minLength={2} defaultValue={timelineEditar?.titulo ?? ""} className={inputClasse} /></Campo>
              <Campo legenda="Ordem"><input name="ordem" type="number" defaultValue={timelineEditar?.ordem ?? 0} className={inputClasse} /></Campo>
            </div>
            <Campo legenda="Data (texto livre; ex.: 'Data a preencher')"><input name="data" defaultValue={timelineEditar?.data ?? ""} className={inputClasse} /></Campo>
            <Campo legenda="Descrição"><textarea name="descricao" rows={2} defaultValue={timelineEditar?.descricao ?? ""} className={inputClasse} /></Campo>
          </ActionForm>
        </Secao>
      ) : null}

      <Secao titulo="Itens da seção selecionada">
        {secao === "posts" ? (
          listaPosts.length === 0 ? <EmptyState titulo="Nenhum post" mensagem="Crie o primeiro rascunho." /> : (
            <ul className="divide-y divide-[color:var(--wp-edge)] text-sm">
              {listaPosts.map((p) => (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                  <span className="text-[color:var(--wp-silver)]">{p.titulo} <span className="text-xs text-[color:var(--wp-silver-dim)]">/{p.slug}</span></span>
                  <span className="flex flex-wrap items-center gap-1">
                    <BadgeStatus status={p.status} />
                    <a href={`/painel/conteudo?secao=posts&editar=${p.id}`} className="text-[color:var(--wp-cyan)] underline">editar</a>
                    {admin ? <form action={acaoPublicar}><input type="hidden" name="secao" value="posts" /><input type="hidden" name="id" value={p.id} /><button type="submit" className="rounded border border-[color:var(--wp-cyan)] px-2 py-0.5 text-xs text-[color:var(--wp-cyan)]">publicar</button></form> : null}
                    <form action={acaoArquivar}><input type="hidden" name="secao" value="posts" /><input type="hidden" name="id" value={p.id} /><button type="submit" className="rounded border border-[color:var(--wp-edge)] px-2 py-0.5 text-xs">arquivar</button></form>
                    {admin ? <form action={acaoExcluirConteudo}><input type="hidden" name="secao" value="posts" /><input type="hidden" name="id" value={p.id} /><button type="submit" className="rounded border border-[color:var(--wp-edge)] px-2 py-0.5 text-xs hover:border-[color:var(--wp-red)] hover:text-[color:var(--wp-red)]">excluir</button></form> : null}
                    <span className="text-xs text-[color:var(--wp-silver-dim)]">{p.publicadoEm ? "publicado em " + diaCurto(p.publicadoEm) : ""}</span>
                  </span>
                </li>
              ))}
            </ul>
          )
        ) : null}
        {secao === "galeria" ? (
          listaGaleria.length === 0 ? <EmptyState titulo="Nenhuma média" mensagem="Crie o primeiro item da galeria." /> : (
            <ul className="divide-y divide-[color:var(--wp-edge)] text-sm">
              {listaGaleria.map((g) => (
                <li key={g.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                  <span className="text-[color:var(--wp-silver)]">{g.titulo} <span className="text-xs text-[color:var(--wp-silver-dim)]">{g.categoria}</span></span>
                  <span className="flex flex-wrap items-center gap-1">
                    <BadgeStatus status={g.status} />
                    <a href={`/painel/conteudo?secao=galeria&editar=${g.id}`} className="text-[color:var(--wp-cyan)] underline">editar</a>
                    {admin ? <form action={acaoPublicar}><input type="hidden" name="secao" value="galeria" /><input type="hidden" name="id" value={g.id} /><button type="submit" className="rounded border border-[color:var(--wp-cyan)] px-2 py-0.5 text-xs text-[color:var(--wp-cyan)]">publicar</button></form> : null}
                    <form action={acaoArquivar}><input type="hidden" name="secao" value="galeria" /><input type="hidden" name="id" value={g.id} /><button type="submit" className="rounded border border-[color:var(--wp-edge)] px-2 py-0.5 text-xs">arquivar</button></form>
                    {admin ? <form action={acaoExcluirConteudo}><input type="hidden" name="secao" value="galeria" /><input type="hidden" name="id" value={g.id} /><button type="submit" className="rounded border border-[color:var(--wp-edge)] px-2 py-0.5 text-xs hover:border-[color:var(--wp-red)] hover:text-[color:var(--wp-red)]">excluir</button></form> : null}
                  </span>
                </li>
              ))}
            </ul>
          )
        ) : null}
        {secao === "membros" ? (
          listaMembros.length === 0 ? <EmptyState titulo="Nenhum membro público" mensagem="Crie o primeiro membro." /> : (
            <ul className="divide-y divide-[color:var(--wp-edge)] text-sm">
              {listaMembros.map((m) => (
                <li key={m.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                  <span className="text-[color:var(--wp-silver)]">{m.nome} <span className="text-xs text-[color:var(--wp-silver-dim)]">{m.funcao} — {m.area} — exibir:{m.exibir}</span></span>
                  <span className="flex flex-wrap items-center gap-1">
                    <BadgeStatus status={m.status} />
                    <a href={`/painel/conteudo?secao=membros&editar=${m.id}`} className="text-[color:var(--wp-cyan)] underline">editar</a>
                    {admin ? <form action={acaoPublicar}><input type="hidden" name="secao" value="membros" /><input type="hidden" name="id" value={m.id} /><button type="submit" className="rounded border border-[color:var(--wp-cyan)] px-2 py-0.5 text-xs text-[color:var(--wp-cyan)]">publicar</button></form> : null}
                    <form action={acaoArquivar}><input type="hidden" name="secao" value="membros" /><input type="hidden" name="id" value={m.id} /><button type="submit" className="rounded border border-[color:var(--wp-edge)] px-2 py-0.5 text-xs">arquivar</button></form>
                    {admin ? <form action={acaoExcluirConteudo}><input type="hidden" name="secao" value="membros" /><input type="hidden" name="id" value={m.id} /><button type="submit" className="rounded border border-[color:var(--wp-edge)] px-2 py-0.5 text-xs hover:border-[color:var(--wp-red)] hover:text-[color:var(--wp-red)]">excluir</button></form> : null}
                  </span>
                </li>
              ))}
            </ul>
          )
        ) : null}
        {secao === "parceiros" ? (
          listaParceiros.length === 0 ? <EmptyState titulo="Nenhum parceiro" mensagem="Crie o primeiro parceiro." /> : (
            <ul className="divide-y divide-[color:var(--wp-edge)] text-sm">
              {listaParceiros.map((p) => (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                  <span className="text-[color:var(--wp-silver)]">{p.nome} <span className="text-xs text-[color:var(--wp-silver-dim)]">{p.nivel}</span></span>
                  <span className="flex flex-wrap items-center gap-1">
                    <BadgeStatus status={p.status} />
                    <a href={`/painel/conteudo?secao=parceiros&editar=${p.id}`} className="text-[color:var(--wp-cyan)] underline">editar</a>
                    {admin ? <form action={acaoPublicar}><input type="hidden" name="secao" value="parceiros" /><input type="hidden" name="id" value={p.id} /><button type="submit" className="rounded border border-[color:var(--wp-cyan)] px-2 py-0.5 text-xs text-[color:var(--wp-cyan)]">publicar</button></form> : null}
                    <form action={acaoArquivar}><input type="hidden" name="secao" value="parceiros" /><input type="hidden" name="id" value={p.id} /><button type="submit" className="rounded border border-[color:var(--wp-edge)] px-2 py-0.5 text-xs">arquivar</button></form>
                    {admin ? <form action={acaoExcluirConteudo}><input type="hidden" name="secao" value="parceiros" /><input type="hidden" name="id" value={p.id} /><button type="submit" className="rounded border border-[color:var(--wp-edge)] px-2 py-0.5 text-xs hover:border-[color:var(--wp-red)] hover:text-[color:var(--wp-red)]">excluir</button></form> : null}
                  </span>
                </li>
              ))}
            </ul>
          )
        ) : null}
        {secao === "timeline" ? (
          listaTimeline.length === 0 ? <EmptyState titulo="Nenhum marco" mensagem="Crie o primeiro marco da história." /> : (
            <ol className="divide-y divide-[color:var(--wp-edge)] text-sm">
              {listaTimeline.map((m) => (
                <li key={m.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                  <span className="text-[color:var(--wp-silver)]">#{m.ordem} {m.titulo} <span className="text-xs text-[color:var(--wp-silver-dim)]">{m.data ?? "sem data"}</span></span>
                  <span className="flex flex-wrap items-center gap-1">
                    <BadgeStatus status={m.status} />
                    <a href={`/painel/conteudo?secao=timeline&editar=${m.id}`} className="text-[color:var(--wp-cyan)] underline">editar</a>
                    {admin ? <form action={acaoPublicar}><input type="hidden" name="secao" value="timeline" /><input type="hidden" name="id" value={m.id} /><button type="submit" className="rounded border border-[color:var(--wp-cyan)] px-2 py-0.5 text-xs text-[color:var(--wp-cyan)]">publicar</button></form> : null}
                    <form action={acaoArquivar}><input type="hidden" name="secao" value="timeline" /><input type="hidden" name="id" value={m.id} /><button type="submit" className="rounded border border-[color:var(--wp-edge)] px-2 py-0.5 text-xs">arquivar</button></form>
                    {admin ? <form action={acaoExcluirConteudo}><input type="hidden" name="secao" value="timeline" /><input type="hidden" name="id" value={m.id} /><button type="submit" className="rounded border border-[color:var(--wp-edge)] px-2 py-0.5 text-xs hover:border-[color:var(--wp-red)] hover:text-[color:var(--wp-red)]">excluir</button></form> : null}
                  </span>
                </li>
              ))}
            </ol>
          )
        ) : null}
      </Secao>
    </div>
  );
}
