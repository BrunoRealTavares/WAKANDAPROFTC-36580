# To-Do — Lista de 9 itens (correções de design)

Status: ✅ concluído · 🔄 em andamento · ⬜ pendente

## Itens

- [x] **1. Imagens não carregavam** — pasta `public/images/` com nomes simples, `src/data/assets.ts` central, todas as referências atualizadas. Commit `d8dbcd2`.
- [x] **2. Interrogação → Escudo** — componente `EscudoRevelacao` (miras, brilho, anel tracejado, parallax, reduced-motion) usado na página `/robo`. Commit `6798158`.
- [x] **3. Remover "Nomenclatura institucional sujeita a confirmação"** — texto removido + botão da escola com link externo escolasesiba.com.br. Commits `3561d82` e `d385ea7`.
- [x] **4. Link da Liga SESI Robótica** — `CodePartnerCard` ganhou prop `href`, link no card da Liga. Commit `a3d09e5`.
- [x] **5. Texto Bahia/Camaçari** — `src/data/conteudo.ts` com 3 parágrafos, aplicado no cartão "Nossas Raízes" (mantido "Berço do projeto"). Commit `a595ea8`.
- [x] **6. Todos os membros no padrão técnica/mentora** — avatar `imagem-fundo-integrantes` + grade 3/2/1 responsiva. Commit `4136bb6`.
- [x] **7. Página `/integrantes`** — sem iniciais/siglas, sem barra de logo, borda dourada no hover, avatar `object-cover` circular. Commit `b09f144`.
- [x] **8. Contato** — `src/data/contato.ts` (e-mail + Instagram), aplicado na página `/contato` e no rodapé. Commit `89ef5ec`.
- [x] **9. Animações React Bits** — Commit `a838d2b`.
  - [x] `TechText` — destaque tecnológico dourado em títulos (server-safe, CSS puro, reduced-motion)
  - [x] `ElectricLogo` — brilho elétrico no escudo; aplicado no cabeçalho do site (`SiteHeader`) e no `/moderno`
  - [x] `BellToggle` — sino "avise-me" na página `/robo`, apenas localStorage (sem coleta de dados)
  - [x] `EscudoRevelacao` migrado para `useSyncExternalStore` (SSR-safe) e `preload` (Next 16)
  - [x] Títulos com `TechText`: contato, escola, integrantes, equipe, parceiros, simulador e `/moderno`

## Verificação final

- [x] `npx tsc --noEmit` — 0 erros
- [x] `npm run lint` — 0 erros (24 warnings pré-existentes)
- [x] `npm run build` — 36 rotas geradas com sucesso
- [x] Páginas testadas: `/`, `/robo`, `/integrantes`, `/contato`, `/escola`, `/moderno` → 200
- [x] Imagens testadas: escudo, FTC, BIOBUZZ, Liga, avatar, bandeira → 200 `image/png`
- [x] `/painel` → 307 (redireciona para login, esperado)
- [x] `git push origin main` — commit final `a838d2b`
