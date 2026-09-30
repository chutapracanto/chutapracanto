# CHUTA PRA CANTO — LEDGER OPERACIONAL E MEMÓRIA DE CONTINUIDADE
## Documento único para novas IAs / agentes
**Última reorganização:** 2026-09-30
**Repositório:** `chutapracanto/chutapracanto`
**Branch de produção:** `main`
**Site:** `https://chutapracanto.com`
**HEAD verificado:** `33fd0a904b1f6884cddbd019f2525be83a5b0669`
**Último commit:** `docs: record home and competition fixes`

> **FUNÇÃO DESTE DOCUMENTO**
>
> Este ledger não é uma lista cronológica para leitura integral. É uma memória operacional para impedir que uma IA nova repita experiências, reabra problemas fechados, confunda infraestrutura ou avance a partir de hipóteses antigas.
>
> **Regra de autoridade:** GitHub/produção atual > Rules > Roadmap > este ledger > bíblias/handoffs históricos.
>
> Antes de qualquer alteração significativa, ler também:
> 1. `.github/AI_START_HERE.md`
> 2. `.github/AI_PROJECT_RULES.md`
> 3. `.github/CODEX_RULES.md`
> 4. `docs/AI_EXECUTION_PROTOCOL.md`
> 5. `docs/AI_PROJECT_ROADMAP.md`
> 6. este ledger
> 7. a bíblia mestra quando o contexto arquitetural/identitário for relevante.

---

# 1. ESTADO ATUAL — LER PRIMEIRO

## 1.1 Projeto
O Chuta Pra Canto é um projeto editorial de futebol português em produção, com:
- notícias;
- opinião/análise;
- competições e dados de futebol;
- conteúdo audiovisual e social;
- Admin/publicação por Markdown;
- SEO técnico;
- monetização preparada.

Não tratar o projeto como protótipo.

## 1.2 Situação técnica atual
- Site principal: `https://chutapracanto.com`
- Produção: GitHub `main` → Cloudflare Pages/Worker.
- Conteúdo: Markdown + `content/noticias-index.json`.
- Futebol: BSD → Pages Worker → D1 → API → frontend.
- Atualização agendada: Worker Cloudflare separado `cpc-football-cron`.
- Cron real: `*/5 * * * *`.
- D1 futebol: `FOOTBALL_CACHE_DB`, id `92e3ef93-4c44-46c8-a1a4-ff5c09f4b49f`.
- D1 likes: `ARTICLE_LIKES_DB`, id `ba093005-9101-43f4-98fa-69d913edb09c`.
- Fonte de futebol: **BZZOIRO SPORTS DATA (BSD)**.
- BSD base: `https://sports.bzzoiro.com/api/v2/`.
- BSD docs: `https://goaldir.com/docs/football/`.
- Secret: `BSD_API_KEY`.

**API-Football está descartada. Não reintroduzir.**

## 1.3 Estado das grandes frentes
- Fundação/site/editorial: funcional.
- SEO base/OG/canonical/sitemap: implementado.
- Conteúdo histórico: lote validado e reconciliação de metadata concluída; não assumir migração total do arquivo Framer.
- Competições: implementação principal feita; houve várias correções de cache, LIVE, fases e filtros.
- Home: cartões LIVE, refresh LIVE, Shorts e imagem de destaque corrigidos no último ciclo.
- AdSense: infraestrutura preparada; aprovação não deve ser assumida.
- Search Console: sitemap submetido; indexação real depende de dados externos.
- Performance: primeira passagem de LCP implementada; não existe baseline quantitativo final "antes/depois" suficientemente rigoroso.
- Roadmap: confirmar sempre o estado atual no `AI_START_HERE.md` e no GitHub, porque documentos antigos podem ter ficado atrás do estado real.

---

# 2. REGRAS DE EXECUÇÃO QUE A IA NOVA NÃO PODE ESQUECER

## 2.1 A utilizadora autorizou execução direta
Quando a ferramenta permitir:
**inspecionar → implementar → validar → corrigir → validar → documentar → continuar.**

Não entregar apenas instruções para a utilizadora se a ação puder ser feita diretamente.

## 2.2 Preservar o que funciona
- alterações pequenas e localizadas;
- não refatorar sem necessidade;
- não alterar notícias/URLs quando a tarefa é outra;
- não mudar arquitetura só porque existe uma arquitetura "mais moderna";
- não duplicar soluções;
- não mexer em secrets/configuração sensível sem necessidade;
- não criar custos;
- não criar ZIPs/documentos/imagens para a utilizadora.

## 2.3 GitHub é a implementação principal
O Codex é complementar. Só usar quando for necessária uma capacidade externa que o Assistente não tenha, sobretudo:
- browser/Chrome real;
- DevTools;
- Network/Performance;
- Lighthouse/PageSpeed;
- sessão local/credenciais;
- Cloudflare Dashboard/CLI quando indisponível diretamente.

Se o Codex encontrar um bug de código, devolve evidência; a correção deve ser feita no GitHub pelo Assistente.

## 2.4 Não repetir experiências fechadas
Uma abordagem marcada como falhada só pode voltar a ser usada com uma hipótese técnica nova e explícita.

## 2.5 Um deployment SUCCESS não prova UX correta
Sempre separar:
- sintaxe;
- deployment;
- resposta HTTP;
- dados;
- comportamento frontend;
- validação visual/runtime.

---

# 3. ARQUITETURA REAL — NÃO CONFUNDIR

## 3.1 Publicação
`GitHub main` → `Cloudflare Pages` → site/Pages Worker.

O Pages Worker trata, entre outras coisas:
- conteúdo;
- Admin;
- autenticação;
- uploads;
- pedidos GitHub;
- shell inicial de notícias;
- endpoint `/api/competicoes`.

## 3.2 Futebol
A arquitetura é:

`cpc-football-cron`
→ chama `https://chutapracanto.com/api/competicoes?competition=...`
→ Pages Worker
→ BSD quando a cache precisa de atualização
→ D1 `FOOTBALL_CACHE_DB`
→ resposta normalizada
→ frontend.

## 3.3 Cron
Worker separado:
- nome: `cpc-football-cron`;
- handler: `scheduled`;
- Cron: `*/5 * * * *`;
- binding: `FOOTBALL_CACHE_DB`.

O cron roda uma competição por slot, em rotação pelas 7 competições.

### NÃO FAZER
- não colocar `[triggers]` no Wrangler do Pages;
- não duplicar `scheduled()` no `_worker.js` do Pages;
- não criar outro Worker de cron;
- não apagar/recriar o `cpc-football-cron`.

Esta arquitetura foi inicialmente diagnosticada de forma errada; o estado correto é o descrito acima.

---

# 4. URLs E REGRAS DE CONTEÚDO

## 4.1 Notícias
URL canónica:
`/noticia?slug=<slug>`

Não migrar novamente para:
`/noticia/<slug>`

A rota `/noticia/<slug>` só existe como compatibilidade/redirect quando aplicável.

## 4.2 Domínio
Canónico:
`https://chutapracanto.com`

Não reintroduzir `pages.dev` como URL editorial/canónica.

## 4.3 Header
Ordem:
Home → Notícias → Opinião → Competições → Sobre → Contacto.

## 4.4 Conteúdo
Não inventar:
- artigos;
- datas;
- autores;
- resultados;
- estatísticas;
- imagens;
- fontes.

Opinião deve continuar separada de notícia.

---

# 5. COMPETIÇÕES — ESTADO E REGRAS CRÍTICAS

## 5.1 Fonte
**BSD é a única fonte atual validada.**

Mapeamento atual:
- Liga Portugal → leagueId 2
- Taça de Portugal → leagueId 92
- Taça da Liga → leagueId 93
- Champions League → leagueId 7
- Europa League / Conference / Nations → consultar o mapeamento atual no código; não inventar IDs.

## 5.2 Cache
Constantes atuais:
- `FOOTBALL_CACHE_FRESH_MS = 15 min`
- `FOOTBALL_CACHE_LIVE_FRESH_MS = 10 s`
- `FOOTBALL_CACHE_STALE_MS = 24 h`

**Regra crítica:** stale é fallback de segurança, não resposta normal quando a cache expirou.

Causa raiz já encontrada:
o endpoint devolvia uma cache stale antes de tentar BSD. Isso podia manter dados errados durante muitas horas apesar do cron funcionar.

Correção:
`696460ad5b3a26df7e5b916e5c40550a007a30f6`
— `fix: refresh stale football cache instead of serving it`.

## 5.3 Época e fixtures
A época atual deve ser resolvida pela BSD, com fallback adequado, e não por datas hardcoded.

Fixtures são obtidos por janela temporal da época + paginação, evitando o antigo limite de 50 que fazia aparecer jogos demasiado distantes na época.

Não voltar ao modelo "primeira página de 50".

## 5.4 LIVE
O BSD tem endpoint de eventos LIVE compacto.

O backend:
- consulta LIVE;
- enriquece eventos quando necessário através de `/events/{id}/`;
- preserva jornada/ronda/stage;
- incorpora estado LIVE no snapshot normalizado.

O frontend:
- atualiza jogos LIVE;
- deteta entrada/saída de LIVE;
- atualiza minuto/golos;
- mantém metadados de jornada/ronda.

### Ciclo que deve ser validado quando a frente LIVE for reaberta
1. jogo entra LIVE;
2. aparece;
3. minuto atualiza;
4. golo atualiza;
5. jogo termina e deixa de LIVE;
6. outro jogo entra LIVE;
7. novo jogo aparece;
8. jornada/ronda continua disponível.

Não declarar a frente LIVE resolvida só porque o código compila.

## 5.5 Polling /competicoes
- quando existe LIVE conhecido: aproximadamente 15 s;
- quando não existe LIVE conhecido: aproximadamente 60 s para descoberta.

Correção:
`d99465e02bd0840598a4a6a91b5ec62409bdd444`.

## 5.6 Fases de competição — REGRA MUITO IMPORTANTE
A UI **não pode assumir que uma competição tem a mesma estrutura durante toda a época**.

A fase deve ser inferida a partir do estado atual BSD:
- `stageName` / `stage` / `stageKey`;
- `groupName`;
- `roundKey` / `roundLabel`.

Função:
`cpcInferCompetitionPhase()`.

Prioridade:
1. knockout/qualificação/play-offs/quartos/meias/final;
2. fase de liga;
3. grupos;
4. tabela única.

Não hardcode:
- Nations = grupos para sempre;
- Champions = fase de liga para sempre;
- Taça da Liga = quartos para sempre;
- Taça de Portugal = ronda 3 para sempre.

### Regras de UI
**Liga Portugal**
- tabela única;
- jornada.

**Fase agrupada**
- grupo;
- jornada;
- grupo + jornada podem coexistir.

**Fase de liga**
- jornada;
- sem grupo artificial.

**Knockout**
- ronda/fase;
- sem grupo.

"Todos" deve limpar grupo e jornada.

Commits:
- `16a6b4a8fe09caaddc97bb9b4ba28405da92e364` — inferência dinâmica;
- `7052244c7d24485fac4001b8889392525ed138f9` — filtros dinâmicos;
- `f9ba435c9ce4aa64816645845cb70039cfa98360` — round filter em competições agrupadas;
- `d75675ed4475fd37a0e069e389b8aff4e099ddf3` — documentação desta regra.

## 5.7 Nations League 2026/27
A fase atual é organizada por grupos dentro das Ligas A/B/C/D:
- A1–A4;
- B1–B4;
- C1–C4;
- D1–D2.

Quando a BSD mudar para quartos/play-offs/fase final, a UI deve mudar automaticamente.

### Bug de grupo já resolvido
Causa:
- label: `Liga A · Grupo A3`;
- valor interno normalizado: `A3`;
- select guardava a label em vez do identificador.

Correção:
- option value = `A1`, `A2`, ..., `D2`;
- label continua humana: `Liga A · Grupo A1`, etc.

Commit:
`1225af6dd6188069ac4870537a432e8abbc2a7b6`.

Requisito:
selecionar um grupo a partir de "Todos" deve mostrar todos os jogos desse grupo: passados, presentes e futuros.

## 5.8 Labels duplicadas
Problemas antigos:
- `Fase de liga · Fase de liga · Jornada`;
- `Quartos de final` repetido;
- `Ronda 3` repetido.

A normalização `roundIdentity()` remove informação duplicada.

Não reintroduzir concatenação cega de `stageLabel + roundLabel`.

---

# 6. TAÇA DA LIGA — HISTÓRICO DE BUG IMPORTANTE

Calendário correto validado para 2026/27:
- Sporting – Marítimo: 27/10/2026 20:15;
- FC Porto – Académico de Viseu: 28/10/2026 20:30;
- SC Braga – Famalicão: 29/10/2026 18:45;
- Benfica – Gil Vicente: 29/10/2026 20:45.

Problema antigo:
a D1 mantinha horários errados porque uma cache stale bloqueava a atualização BSD.

A correção de calendário foi acompanhada por invalidação de identidade/cache e filtros BSD.

Correções relevantes:
- `08f8bb4953fb86c07f63ce6c9b3d82d0a90a5e01`;
- depois a arquitetura de stale-refresh foi corrigida por `696460ad...`.

Também existe no código uma correção por IDs de equipas para os horários conhecidos:
- Braga–Famalicão → `2026-10-29T18:45:00+00:00`;
- Benfica–Gil Vicente → `2026-10-29T20:45:00+00:00`.

**Se este calendário voltar a aparecer errado, primeiro verificar D1/BSD/cache e não criar outra correção hardcoded.**

---

# 7. HOME — ESTADO ATUAL

## 7.1 Jogos LIVE
Foi adicionada abaixo de "PRÓXIMOS JOGOS IMPORTANTES":
**JOGOS EM DIRETO**

Cada cartão pode mostrar:
- LED vermelho com pulsação lenta;
- competição;
- grupo;
- jornada/ronda;
- emblema ou bandeira;
- resultado;
- minuto;
- golos, minuto e marcador quando BSD fornece os eventos.

Polling:
- descoberta global: 60 s;
- competições já LIVE: 15 s;
- não fazer 7 pedidos a cada 15 s.

Commits:
- `3ec40584983ecfe7b320abf0a440e11c26bd2c80`;
- `bc3165b1261df31037764db149b50ea143b8176d`.

## 7.2 Destaque de notícia
A imagem do destaque principal foi reduzida para aproximadamente 50% da largura desktop.

## 7.3 Shorts
A Home usa o playlist/feed configurado no código.

Foi adicionado:
- cache-buster ao pedido RSS2JSON;
- refresh do feed a cada 10 min depois do carregamento inicial.

Commit:
`bf7e0851c83d9f6d1dbfe4a4dab4c7e203c9f074`.

**Importante:** se os Shorts continuarem errados/antigos, não aumentar simplesmente o polling. Verificar primeiro se o playlist ID configurado ainda corresponde ao conjunto atual de Shorts do canal.

## 7.4 Última validação Home
JavaScript compilado/testado sem erro.

Deployment Pages validado:
- deployment: `784f59a7-a274-4123-bb01-defb842bcfae`;
- status: success;
- domínio: `https://chutapracanto.com`;
- deployment iniciado em 2026-09-30 por volta das 13:01 UTC.

Commit documental mais recente:
`33fd0a904b1f6884cddbd019f2525be83a5b0669`.

---

# 8. HISTÓRICO DE CORREÇÕES DE COMPETIÇÕES — NÃO REABRIR SEM NOVA EVIDÊNCIA

Principais commits já feitos:

- `57fe7ca` — Worker/cache, `v4-nations`;
- `950b844` — filtro de jornadas;
- `df2994f` — correção de sintaxe;
- `ddd50764d3dbb024bca93492dd6dc2ad36bfeb93` — restaurou tabs sem reintroduzir chamada removida;
- `c77dcae44a8cd074165554b20b8668ec0fd7cbf7` — normalização Nations;
- `80c7e8577c569ae4491fdf99d9c64747aae81239` — helpers BSD + standings;
- `3ace38f644df1c09a59c4c47c54d373774c9d59a` — tentativa de matcher de grupos; posteriormente corrigida;
- `0bc6e0d9ae9a40e65107ad25c4dda16bb606e8c6` — matcher corrigido;
- `415dab9924d527d672b77e913f4b5a4b34f5ff1b` — refresh de estado live;
- `c6bb273c09d37c881de93bee5e087d532c9010e6` — preservação de round no live overlay;
- `57cf3206d582806ceaf09080733f84168f2c0f22` — live metadata + Taça da Liga;
- `22d2130d15983def54348b44c58a2431001fb271` — refresh frontend quando live entra/sai;
- `696460ad5b3a26df7e5b916e5c40550a007a30f6` — stale cache não bloqueia refresh;
- `d99465e02bd0840598a4a6a91b5ec62409bdd444` — descoberta LIVE sem LIVE conhecido;
- `a9b08eeb962ba55048a66e987aa9db9f9192aadf` — ledger stale/live;
- `16a6b4a8fe09caaddc97bb9b4ba28405da92e364` — inferência de fase;
- `7052244c7d24485fac4001b8889392525ed138f9` — filtros dinâmicos;
- `f9ba435c9ce4aa64816645845cb70039cfa98360` — round filter grouped;
- `1225af6dd6188069ac4870537a432e8abbc2a7b6` — Nations group selection;
- `3ec40584983ecfe7b320abf0a440e11c26bd2c80` — Home live cards;
- `bc3165b1261df31037764db149b50ea143b8176d` — Home live polling;
- `bf7e0851c83d9f6d1dbfe4a4dab4c7e203c9f074` — Shorts refresh;
- `33fd0a904b1f6884cddbd019f2525be83a5b0669` — documentação final desta sequência.

---

# 9. D1 / FOOTBALL CACHE — EVIDÊNCIAS ÚTEIS JÁ OBTIDAS

Nations League:
- snapshot `all`: 156 fixtures;
- 52 finished;
- 104 upcoming;
- 0 live;
- A1–A4/B1–B4/C1–C4: 12 fixtures cada;
- D1/D2: 6 fixtures cada.

Isto provou que o histórico existia no servidor e que alguns problemas eram de filtro/UI, não de ausência de dados.

Taça da Liga:
snapshot fresco validado em 2026-09-30:
- Porto–Académico Viseu: 2026-10-28 20:30 UTC, Quarterfinals;
- Sporting–Marítimo: 2026-10-27 20:15 UTC, Quarterfinals;
- Braga–Famalicão: 2026-10-29 18:45 UTC, Quarterfinals;
- Benfica–Gil Vicente: 2026-10-29 20:45 UTC, Quarterfinals.

Se estes dados regressarem a estado antigo, investigar cache/refresh antes de alterar o frontend.

---

# 10. CONTEÚDO HISTÓRICO / FRAMER

## Lote validado
- 213 URLs únicas encontradas;
- 179 importadas;
- 34 duplicadas/ignoradas;
- 0 falhas;
- 232 notícias;
- 1 opinião;
- 233 entradas no índice;
- 241 URLs no sitemap.

Commit:
`6701b981302dea5955047812e83e92e6a5c17dbe`.

Workflow temporário removido:
`ced7e4113b9a4fb76102c2a32cd9325fc84ce8bd`.

## Reconciliação posterior
Metadata de 163/163 registos pós-22/08 foi reconciliada:
- 0 mismatches;
- 0 ausências no índice;
- PR #27 mergeada.

### Não confundir
O lote de 213 URLs não prova que todo o arquivo posterior do Framer tenha sido migrado.

Não importar por inferência.

Não repetir o lote já validado.

---

# 11. NEWS / SEO / SHELL — ESTADO FECHADO

Já implementado:
- canonical;
- robots;
- sitemap;
- OG;
- Twitter cards;
- dados estruturados;
- NewsArticle;
- Article;
- BreadcrumbList;
- autores/datas/tipos;
- pesquisa pelo índice;
- relacionados;
- partilha;
- páginas Notícias/Opinião;
- sitemap no domínio .com.

## Shell inicial de artigo
O Worker consulta `content/noticias-index.json` para `/noticia?slug=...` e entrega no HTML inicial:
- categoria;
- tipo;
- H1;
- subtítulo;
- autoria;
- data;
- imagem principal;
- breadcrumb.

O JavaScript continua a carregar/renderizar o Markdown.

Foi validado:
- HTTP 200;
- H1 presente;
- uma estrutura de heading;
- hero presente;
- hero eager/high;
- sem duplicação após JS;
- Markdown completo;
- partilha/relacionados/navegação funcionais.

Não voltar a migrar a estrutura de URL.

---

# 12. PERFORMANCE — O QUE FOI PROVADO E O QUE NÃO FOI

## 12.1 Primeira passagem LCP
Implementado:
- Google Fonts sem `@import` bloqueante;
- Font Awesome não bloqueante;
- preconnects;
- prioridade reduzida do logo global;
- footer logo lazy;
- primeira imagem de Notícias eager/high;
- restantes imagens lazy/low;
- `decoding="async"`;
- shell inicial de artigo.

PR #26 foi mergeada e representa o trabalho LCP em produção.

## 12.2 Experiência que FALHOU
Tentativa de injetar preload no `<head>` com HTMLRewriter fez a resposta HTML ficar truncada/branca.

Correção:
- não usar essa abordagem;
- preload via header HTTP `Link`;
- reconstruir Response preservando body;
- não manter `Content-Length` manual em body transformado.

**Não repetir a abordagem sem hipótese nova.**

## 12.3 LCP
Medições antigas foram muito variáveis:
- Home mobile ~3,2–17,8 s;
- Notícias mobile ~18,1 s;
- artigo mobile ~18,2–19 s.

Não usar estes números como baseline de campo.

Não existe uma comparação rigorosa antes/depois suficiente para afirmar uma percentagem de melhoria.

## 12.4 Logo pesado
`/images/logo.png` foi observado com aproximadamente 2 MiB e 1536×1024.

É objetivamente pesado, mas não foi provado como causa principal do LCP.

Não substituir/comprimir por palpite.

## 12.5 CLS
Foi observada uma medição com CLS ~0,571, mas não foi estabelecida causalidade.

Não remover sticky/header/fonts/hero/shell só por associação de auditoria.

Se voltar a investigar:
trace → timestamp do layout shift → elemento afetado → elemento causador → correção mínima → nova medição.

## 12.6 Opinião
Uma medição PSI mostrou bom desempenho, mas o DOM estava com "Não foi possível carregar esta notícia". Essa medição é inválida e não deve ser usada como baseline.

## 12.7 Regra
**sintoma → evidência → causa → correção mínima → validação.**

---

# 13. UX FECHADA — NÃO REABRIR SEM REGRESSÃO

Implementado e validado historicamente:
- sticky editorial progressivo;
- H1 reduz progressivamente;
- header opaco durante scroll;
- partilha compacta;
- mobile Notícias vertical;
- imagens 16:9;
- desktop preservado;
- breakpoints 320/390/768/1280 sem regressões relevantes documentadas.

PR #24 representa a implementação sticky.

PR #25:
- fechada;
- não mergeada;
- apenas histórico.

PR #26:
- reaplicou LCP sobre main atual;
- mergeada;
- não confundir com #25.

---

# 14. ADSENSE / MONETIZAÇÃO TÉCNICA

Publisher ID:
`ca-pub-1556367149800029`.

Infraestrutura técnica preparada.

Não assumir:
- aprovação;
- monetização ativa;
- aprovação do site só porque o código está presente.

Não criar segunda conta AdSense.

Não alterar monetização durante investigação técnica sem necessidade.

---

# 15. SEGURANÇA / ADMIN

Já implementado/documentado:
- sessão HMAC;
- cookies HttpOnly;
- Secure;
- SameSite=Strict;
- limites de upload;
- validação de extensão;
- validação do conteúdo de imagem;
- caminhos permitidos;
- proteção contra `..`;
- autenticação Admin;
- sanitização DOMPurify onde aplicável.

Não enfraquecer estas proteções para resolver problemas de UX.

---

# 16. SCRIPTS E WORKFLOWS HISTÓRICOS

`scripts/import-framer-news.py` permanece como histórico/manutenção.

O workflow temporário de importação foi removido.

Não apagar scripts históricos sem razão.

Não reativar workflows temporários sem necessidade nova.

Um workflow SUCCESS não garante que índices/sitemaps derivados foram atualizados: validar artefactos.

---

# 17. FALHAS HISTÓRICAS QUE DEVEM FICAR VISÍVEIS

## Não repetir
1. HTMLRewriter para preload no head → HTML truncado.
2. Servir stale D1 antes de tentar BSD → dados antigos/live presos.
3. Usar primeira página de 50 fixtures → época errada.
4. Assumir que ausência de dados UI significa ausência na D1.
5. Guardar label humana de grupo como valor interno normalizado.
6. Concatenar stage + round sem deduplicação.
7. Colocar cron no Pages Wrangler.
8. Duplicar scheduled handler no Pages.
9. Reabrir PR fechada como se fosse produção.
10. Usar medição PSI com conteúdo não carregado como benchmark.
11. Corrigir performance por associação de auditoria sem causalidade.
12. Aumentar polling quando a fonte/playlist está errada.
13. Migrar URLs de notícias para formato clean sem pedido explícito.

---

# 18. CHECKLIST OBRIGATÓRIA ANTES DE ALTERAR COMPETIÇÕES

1. Ler Rules + ledger.
2. Verificar HEAD de `main`.
3. Verificar commits recentes.
4. Verificar estado real de `_worker.js` e `competicoes.html`.
5. Identificar se o problema é:
   - BSD;
   - cache D1;
   - cron;
   - API;
   - normalização;
   - filtro;
   - frontend;
   - dados de produção.
6. Se for temporal/live, verificar D1/cache antes de mexer na UI.
7. Se for fase, verificar `stage/group/round` reais.
8. Não hardcode datas/fases se BSD puder fornecer a informação.
9. Fazer alteração mínima.
10. Validar sintaxe.
11. Validar deployment.
12. Validar runtime quando possível.
13. Atualizar este ledger.

---

# 19. CHECKLIST OBRIGATÓRIA ANTES DE ALTERAR HOME

1. Não mexer em Notícias/URLs sem pedido.
2. Confirmar origem real dos dados.
3. Para LIVE, distinguir descoberta de polling rápido.
4. Não criar 7 pedidos a cada 15 s.
5. Para Shorts, verificar primeiro playlist/feed.
6. Preservar o restante Home.
7. Compilar JS.
8. Validar deployment.
9. Atualizar ledger.

---

# 20. PRÓXIMO PONTO DE CONTINUIDADE

No momento desta reorganização, a última sequência implementada foi:
- Nations group selection;
- dynamic competition phase model;
- Home LIVE cards;
- Home LIVE polling;
- Home Shorts refresh;
- Home featured image adjustment;
- documentação consolidada.

**Não assumir automaticamente que tudo está validado em runtime só porque a sintaxe/deployment passaram.**

Se a utilizadora reportar um novo problema, começar pelo estado real da produção e pelos dados envolvidos, não por uma teoria antiga.

---

# 21. REGRA FINAL PARA UMA IA NOVA

Antes de tocar no código, responder internamente:

**"Estou a corrigir um problema novo ou estou a repetir uma coisa que este ledger diz que já foi resolvida?"**

Se for repetição:
- procurar a evidência nova que justifica reabrir;
- sem evidência nova, não reabrir.

Se for problema novo:
- localizar camada;
- alterar o mínimo;
- validar;
- documentar.

Se houver bloqueio:
- identificar exatamente o que falta;
- dizer quem pode desbloquear;
- fornecer a ação concreta;
- nunca transformar um bloqueio num "próximo passo" vago.

**O objetivo não é produzir mais alterações. É manter o sistema correto enquanto se avança.**


# 64. HEADER INSTITUCIONAL + VALIDAÇÃO LIVE — 2026-09-30

## 64.1 Header
- "Sobre Nós" e "Contacto" foram removidos do menu principal em todas as páginas que usam o header do site.
- Permanecem acessíveis no bloco de navegação do footer.
- O header principal fica uniformizado com: Home → Notícias → Opinião → Competições.
- Foram preservados os links institucionais no footer e as páginas existentes.

## 64.2 AdSense / navegação
- A documentação atual do Google AdSense exige conteúdo/divulgações de privacidade e cookies adequadas, mas não determina que "Sobre Nós" ou "Contacto" estejam no menu principal.
- A decisão de UX é manter esses links no footer, sem os tornar menos acessíveis.

## 64.3 LIVE — validação real no D1
- O Worker de cron cpc-football-cron está ativo e chama /api/competicoes em rotação pelas 7 competições.
- D1 FOOTBALL_CACHE_DB foi consultado diretamente.
- Nas entradas atuais da cache não existe nenhum fixture com estado LIVE/in_progress/in_play/inplay/ongoing.
- Existem jogos futuros na cache; portanto a ausência do bloco "JOGOS EM DIRETO" na Home, neste momento, é compatível com o comportamento implementado: o bloco é renderizado apenas quando existe pelo menos um jogo efetivamente LIVE.
- Exemplo de próximo jogo encontrado: Azerbaijão — Liechtenstein, 01/10/2026 16:00 UTC, estado notstarted.
- Não foram encontradas evidências, nesta verificação, de que o Worker/cache esteja atualmente a bloquear jogos LIVE.

## 64.4 Shorts
- A utilizadora confirmou que novos Shorts começaram a entrar na Home; isto é consistente com o refresh periódico/cache-buster já implementado.
