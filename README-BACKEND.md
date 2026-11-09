# Wakanda PRO — Backend + Intranet (/painel)

Documentação do recorte de backend implementado: banco de dados, autenticação,
CRUDs do painel, API de download privado e API de contato.

## Stack

- **Next.js 16 (Cache Components ativo)** — nenhuma página usa `export const dynamic`;
  rotas que leem banco/cookies chamam `await ensureDynamic()` (helper em
  `src/lib/dynamic-render.ts`, que usa `connection()` de `next/server`).
  `cookies()`/`headers()` sempre com `await` (API async no Next 16).
- **SQLite via `@libsql/client` + Drizzle ORM** (`drizzle-orm@0.45.x`).
- **Auth própria**: scrypt (`node:crypto`) para senha, cookie httpOnly assinado
  com HMAC-SHA256 (`WP_SESSION_SECRET`), sessões persistidas na tabela `sessions`.

## Estrutura de dados

- Banco: `data/production.db` (nome configurável em `WP_DB_NAME`) — pasta `data/`
  é **privada e gitignored**. Nunca coloque uploads ou banco em `public/`.
- Uploads: `data/uploads/` — servidos apenas por `/api/files/[id]`, que valida
  sessão ativa e responde com `Content-Disposition: attachment`.
- Esquema: fonte de verdade em `src/db/schema.ts` (21 tabelas). DDL espelho em
  `scripts/sqlite-ddl.mjs` para recriação offline.

## Comandos

```bash
npm install                 # já com @libsql/client, drizzle-orm, drizzle-kit (dev)
npm run db:push             # sincroniza src/db/schema.ts com o banco (drizzle-kit push)
npm run db:create           # fallback: cria todas as tabelas via SQL puro (idempotente)
npm run create-admin        # cria o PRIMEIRO admin (lê ADMIN_* do .env)
npm run smoke-db            # teste de fumaça em data/smoke.db (apaga o banco ao final)
npm run db:studio           # drizzle-kit studio (inspeção)
npx tsc --noEmit            # checagem de tipos
```

### Bootstrap passo a passo

1. Copie `.env.example` → `.env`.
2. Gere o segredo:
   ```bash
   node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
   ```
   e coloque em `WP_SESSION_SECRET`.
3. Preencha `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` no `.env`
   (ou exporte as variáveis na sessão do terminal).
4. `npm run create-admin` — recusa se já existir um admin. Depois esvazie as
   credenciais ADMIN_* do `.env` por segurança.

## Autenticação e papéis

- Login: `POST` (server action) em `/painel/login`; e-mail + senha (scrypt).
- Sessão: cookie `wp_session` = `token.hex + "." + HMAC(token, segredo)`;
  TTL de 7 dias;guard em `requireUser(papeis?, { permitirConvitePendente })`.
- `convitePendente=1` (conta criada/resetada pelo admin) força redirecionamento
  para `/painel/trocar-senha` no primeiro login.
- **Sem SMTP**: recuperação de senha é um pedido registrado em `audit_logs`
  (`recuperacao_solicitada`); o admin gera uma senha temporária em
  `/painel/usuarios` (exibida **uma única vez** em tela).

ACL (funções em `src/lib/auth.ts`):

| Ação | admin | lider | integrante |
| --- | --- | --- | --- |
| Gerenciar usuários | ✅ | ❌ | ❌ |
| Ver recursos financeiros | ✅ | ✅ | ❌ |
| Criar lançamento financeiro | ✅ (aprovado) | ✅ (pendente) | ❌ |
| Aprovar/excluir financeiro | ✅ | ❌ | ❌ |
| Excluir documentos | ✅ | ❌ | ❌ |
| Publicar conteúdo (CMS) | ✅ | rascunhos | ❌ |
| Excluir registros operacionais | ✅ | ✅ | ❌ |
| Escrita em tarefas/eventos/presença/engenharia/robô/inventário | ✅ | ✅ | ✅ |
| Leitura geral | ✅ | ✅ | ✅ (sem financeiro) |

## Auditoria

Eventos gravados em `audit_logs` (com IP truncado): login, login_falhou, logout,
criar_usuario, atualizar_usuario, reset_senha_usuario,
recuperacao_solicitada, upload_doc, excluir_doc, criar_task, atualizar_task
(JSON das alterações), comentar_task, criar_evento, atualizar_evento,
excluir_evento, presenca_registrada, criar_engenharia, atualizar_engenharia,
criar_versao_robo, criar_teste_robo, criar_item_inventario,
movimentacao_inventario, criar_financeiro, aprovar_financeiro, criar_post,
publicar_post, arquivar_conteudo, excluir_conteudo, atualizar_settings,
contato_recebido.

## APIs de rota

- `POST /api/contact` — JSON `{ nome, email, assunto, mensagem, consentimento }`.
  Zod valida; honeypot `website`; rate-limit 5/h por IP (Map em memória —
  trocar por Redis se escalar horizontalmente). Grava em `contact_messages`
  e audita `contato_recebido`. Respostas: `{ ok: true }`,
  `{ ok: false, erros }` (400/429/500).
- `GET /api/files/[id]` — download privado de documentos (401 sem sessão).

## Migração futura para Supabase/Postgres

O schema de SQLite é mapeado quase 1:1. Pontos a trocar:

1. **Driver**: substituir `@libsql/client` por `@vercel/postgres`/`pg` ou
   `postgres` e usar `drizzle-orm/postgres-js` em `src/db/index.ts`.
2. **Tipos de coluna** em `src/db/schema.ts`:
   - `integer(...) { mode: "timestamp" }` → `timestamp(...)`;
   - `integer(...).default(sql\`(unixepoch())\`)` → `timestamp().defaultNow()`;
   - `text`/`integer` PK `autoIncrement` → `serial` ou `integer().generatedAlwaysAsIdentity()`;
   - booleans 0/1 → `boolean()`.
3. **DDL**: `scripts/sqlite-ddl.mjs` é só para SQLite — gere SQL de Postgres com
   `drizzle-kit generate` no dialect `postgresql` e rode no editor SQL do
   Supabase.
4. **Delete em cascata**: os `ON DELETE CASCADE/SET NULL` existentes convertem
   diretamente; conferir índices úmicos (`users_email_uq`, `posts_slug_uq`,
   etc.), que são idênticos.
5. **Query SQL inline**: os scripts `.mjs` em `scripts/` usam `unixepoch()` —
   só úteis no modo SQLite; no Postgres use `now()`.
6. **Config**: `drizzle.config.ts` ganha `dialect: "postgresql"` e a URL do
   Postgres em `dbCredentials`.

Algo inteiramente necessário: cookies de sessão continuam ok (a lógica de auth
não depende do driver), mas lembre de `secure: true` no cookie depois que o
deploy estiver em HTTPS (`src/lib/auth.ts`, função `createSession`).
