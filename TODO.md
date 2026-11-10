# To-Do — Lista de 9 itens (correções de design)

Status: ✅ concluído · 🔄 em andamento · ⬜ pendente

## Itens

- [x] **1. Imagens não carregavam** — pasta `public/images/` com nomes simples, `src/data/assets.ts` central, todas as referências atualizadas. Commit `d8dbcd2`.
- [x] **2. Interrogação → Escudo** — componente `EscudoRevelacao` (miras, brilho, anel tracejado, parallax, reduced-motion) usado na página `/robo`. Commit `6798158`.
- [x] **3. Remover "Nomenclatura institucional sujeita a confirmação"** — texto removido + botão da escola com link externo escolasesiba.com.br. Commit `3561d82`.
- [x] **4. Link da Liga SESI Robótica** — `CodePartnerCard` ganhou prop `href`, link no card da Liga. Commit `a3d09e5`.
- [x] **5. Texto Bahia/Camaçari** — `src/data/conteudo.ts` com 3 parágrafos, aplicado no cartão "Nossas Raízes" (mantido "Berço do projeto"). Commit `a595ea8`.
- [x] **6. Todos os membros no padrão técnica/mentora** — avatar `imagem-fundo-integrantes` + grade 3/2/1 responsiva. Commit `4136bb6`.
- [x] **7. Página `/integrantes`** — sem iniciais/siglas, sem barra de logo, borda dourada no hover, avatar `object-cover` circular. Commit `b09f144`.
- [x] **8. Contato** — `src/data/contato.ts` (e-mail + Instagram), aplicado na página `/contato` e no rodapé. Commit `89ef5ec`.
- [ ] **9. Animações React Bits** — 🔄 em andamento
  - [x] `TechText` criado e aplicado nos títulos do `/moderno`
  - [x] `ElectricLogo` criado (corrigido import `useState`)
  - [x] `BellToggle` criado (localStorage) + aplicado na página `/robo`
  - [ ] Aplicar `TechText` nos títulos das seções do site público (hero, escola, equipe, contato…)
  - [ ] Aplicar `ElectricLogo` no `Shield`/cabeçalho do site público (não só no `/moderno`)
  - [ ] Rodar `npx tsc --noEmit` + `npm run lint` (gate de qualidade)
  - [ ] Commit + push final `git push origin main`

## Pendências gerais

- [ ] Push final de todos os commits para `origin/main` (8 commits locais aguardando)
- [ ] Verificar 200s das imagens no navegador (dev server parado)
