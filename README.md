# Wakanda Pro 36580 — Site + Plataforma interna

Site público premium e intranet de gestão da **Wakanda Pro 36580**, equipe de robótica educacional da Escola SESI Milton Santos (Camaçari/BA), em estreia na FIRST Tech Challenge — temporada BIOBUZZ 2026–27. Robô: **Vibranium** (imagem secreta até autorização da equipe).

> **Aviso de identidade:** a referência a Wakanda/Pantera Negra é *inspiração de ficção* (afrofuturismo, protagonismo). Não há vínculo com a Marvel. O robô "Vibranium" é uma homenagem de equipe, sem relação comercial.

## Stack

- Next.js 16 (App Router, Turbopack, Cache Components) + TypeScript
- Tailwind CSS v4 (tokens em `src/app/globals.css`)
- GSAP + ScrollTrigger (hero, Reveal, sequência pinada do robô; `prefers-reduced-motion` respeitado)
- Dados: **SQLite** via `@libsql/client` + **Drizzle ORM** (`data/production.db`, gitignored)
- Auth própria: scrypt (node:crypto) + sessões em banco + cookie httpOnly; papéis `admin | lider | integrante` verificados no servidor (páginas, actions e rotas de API)
- Validação: Zod (client e server)

## Como rodar

```bash
npm install
npm run dev -- -p 8000     # desenvolvimento em http://localhost:8000
npm run build              # build de produção
npm run db:push            # aplicar mudanças de schema no SQLite
npm run create-admin       # cria o primeiro admin usando .env (APENAS UMA VEZ)
```

`.env` (local, gitignored) — ver `.env.example`:

- `WP_SESSION_SECRET` — assinatura das sessões (32+ bytes)
- `ADMIN_NAME / ADMIN_EMAIL / ADMIN_PASSWORD` — usados **somente** pelo create-admin; esvazie depois
- `WP_DB_NAME` — nome/arquivo do banco (default `production.db`)

## Primeiro acesso à intranet

1. `npm run create-admin` gera o administrador (papel `admin`) a partir do `.env`.
2. A senha gerada nesta instalação ficou em `.credencial-admin.txt` (gitignored). **Troque a senha** em `/painel/usuarios`.
3. Novos integrantes são criados pela administradora em `/painel/usuarios` (não há cadastro público); senha temporária existe só na criação.

`README-BACKEND.md` detalha: ACL por papel, tabelas/auditoria e o roteiro de migração para Supabase/Postgres quando a equipe quiser hospedagem online.

## Estrutura

- `src/app/(site)/` — páginas públicas: `/`, `/equipe`, `/historia`, `/integrantes`, `/escola`, `/robo`, `/biobuzz`, `/simulador`, `/diario` (+ `[slug]`), `/galeria`, `/parceiros`, `/contato`
- `src/app/painel/` — intranet: dashboard, tarefas (+ comentários/histórico), calendário, presença, documentos (upload privado, download via `/api/files/[id]` autenticado), engenharia, robô (versões/testes/comparação), inventário (alertas de mínimo), recursos financeiros (admin+lider), conteúdo (CMS com rascunho/revisão/publicado/arquivado), usuários (admin)
- `src/db/schema.ts` — 19+ entidades (tasks, events, attendance, documents, engineering_logs, robot_versions, robot_tests, inventory_*, financial_entries, posts, gallery_assets, partners, contact_messages, audit_logs…)
- `src/components/` — `RedQuestionMark` (SVG vetorial, ocupa o lugar da foto do robô), `SiteHeader/SiteFooter`, `anim/` (Reveal, HeroMystery, RevealSequence)

## Segurança e privacidade

- Controle por papel **no servidor** em cada página/action/rota (não é só esconder botões)
- Uploads privados fora de `/public`, servidos por rota autenticada com auditoria
- Formulários públicos: zod + honeypot + limites de taxa; `contact_messages` no banco
- `audit_logs` para login, criação de usuário, uploads, publicações, aprovações financeiras e ajustes de inventário
- LGPD: consentimento no contato, sem coleta de dados de menores sem autorização; melhorar aviso completo é pendência documentada

## Liberar a revelação do robô

`/painel/conteudo` → alternar **"Robô revelado"** (`site_settings.roboRevelado`). Enquanto desativada, a interrogação vermelha permanece em toda a interface — sem reconstruir nada.

## Informações pendentes (preencher no CMS/config)

Nada foi inventado. Aguardando informações reais da equipe:

- Nome e biografia da treinadora — `/painel/conteudo` e `src/lib/site-config.ts`
- Integrantes, funções, áreas, bios (com autorizações de imagem) — `/painel/conteudo`
- Identidade oficial da escola (SESI Milton Santos ou ESI) — `nomeEscolaPendente` em `site-config.ts`
- Datas da linha do tempo — `/painel/conteudo` (timeline_events)
- E-mail público, redes sociais — `site-config.ts`
- Fotos da galeria e posts do diário — `/painel/conteudo` (só publicar com autorização)
- Código fonte do robô/CAD — vínculos internos no `/painel/robo` (não publicados ao site público)

## Pendências de engenharia (próxima fase)

- Testes E2E das jornadas principais (hoje: `tsc` limpo + smoke manual do banco/API)
- Envio real de e-mail (formulário grava no banco; SMTP configurável quando houver conta)
- Implantação em hospedagem (HTTPS + sessão `secure: true`) — roteiro em `README-BACKEND.md`
