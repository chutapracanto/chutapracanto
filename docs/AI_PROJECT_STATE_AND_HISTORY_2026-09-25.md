# CHUTA PRA CANTO — LEDGER OPERACIONAL E MEMÓRIA DE CONTINUIDADE
## Documento único para novas IAs / agentes
**Última reorganização:** 2026-09-30
**Repositório:** `chutapracanto/chutapracanto`
**Branch de produção:** `main`
**Site:** `https://chutapracanto.com`
**HEAD verificado:** `b0b75366a6f137a87ed43385bd61394c0dd49f53`
**Último commit de código: `docs: limpar referencias internas da matriz de video`

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

**fornecedor alternativo rejeitado está descartada. Não reintroduzir.**

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


# 65. ROADMAP + LIMPEZA DE FORNECEDOR + INDEXAÇÃO — 2026-09-30

## 65.1 Roadmap reconciliado
- Roadmap substituído por uma versão operacional limpa de 2026-09-30.
- Fase 3 passou a constar como **CONCLUÍDA OPERACIONALMENTE**.
- Fase 4 permanece **ATIVA**, dependente da evidência do Search Console.
- Fase 5 ficou em manutenção e só reabre com evidência.
- Fase 6 ficou em preparação enquanto o AdSense permanece "em preparação".
- Fase 8 passou a ser a próxima grande frente técnica, com distribuição de vídeo como candidato concreto.
- Pesquisa global do site ficou como ideia futura, abaixo das prioridades atuais.

## 65.2 Search Console
- Sitemap foi submetido em 28/09/2026 e aceite para processamento.
- Em 30/09 já passaram mais de 24h.
- Pesquisa pública site:chutapracanto.com não devolveu resultados na verificação realizada.
- Isto não substitui o Search Console e não prova, por si só, ausência de indexação.
- Próxima validação: Sitemaps → Page indexing → excluídas → canonical → erros/avisos → páginas indexadas, assim que os relatórios tiverem dados.

## 65.3 Limpeza de fornecedor antigo
- O fornecedor antigo que já não faz parte da arquitetura foi removido do código ativo e da documentação operacional.
- Removidos do GitHub os documentos específicos de matriz/decisão desse fornecedor.
- Removidos do _worker.js os endpoints diagnósticos temporários.
- Removida do Cloudflare Pages Production a secret antiga associada a esse fornecedor.
- Produção/Preview ficam apenas com ADMIN_PASSWORD, BSD_API_KEY e GITHUB_TOKEN como secrets do projeto.
- BSD permanece como fonte de futebol em produção.
- Não reintroduzir o fornecedor removido.

## 65.4 Nations League — confirmação da arquitetura
- cpcInferCompetitionPhase() está implementada no Worker.
- A função usa o estado atual fornecido pela BSD (stageName/stage/stageKey, grupos e ronda), sem calendário hardcoded.
- Se a BSD mudar de fase, o tipo de fase e a estrutura de filtros mudam com os dados atuais.
- Na fase agrupada, o grupo continua disponível; em knockout, a estrutura passa para ronda/fase sem grupo.
- A arquitetura é dinâmica nos dois sentidos: se os dados atuais da fonte representarem novamente uma fase agrupada, a inferência volta a uma estrutura agrupada.
- O requisito de Nations de A1–A4/B1–B4/C1–C4/D1–D2 e seleção de grupo com passado/presente/futuro continua fechado.

## 65.5 Distribuição de vídeo — investigação futura
- É tecnicamente viável construir um fluxo de upload único e publicação por APIs oficiais, mas cada plataforma tem autenticação, permissões, quotas e regras próprias.
- YouTube permite upload via videos.insert.
- Instagram possui Reels Publishing API.
- Facebook possui Reels Publishing API.
- TikTok possui Content Posting API com Direct Post, sujeito a aprovação/autorização da app.
- Antes de implementar, deve ser feita uma matriz real de permissões, aprovação de apps, formatos, quotas e publicação para as contas CPC.


---

# 66. CONSOLIDAÇÃO OPERACIONAL — 2026-09-30.1

Esta secção é o resumo que uma IA nova deve absorver sem reler todo o histórico.

## Admin
O fluxo atual publica Markdown via Pages Worker/GitHub. Quando há upload próprio, a imagem é criada primeiro em `images/uploads/` e depois o Markdown é criado/atualizado. A pesquisa externa usa Openverse + Wikimedia Commons e referencia a imagem por URL externa.

Backlog confirmado: robustez/diagnóstico de uploads de imagem; melhoria de relevância da pesquisa de imagens; cancelar/remover imagem; Guardar como rascunho; garantir que rascunhos não entram no índice público/sitemap.

## SEO
Infraestrutura técnica já existe: canonical, robots, sitemap, OG/Twitter e JSON-LD. Sitemap submetido ao Search Console em 28/09/2026. Próxima análise: Sitemaps → Page indexing → URL Inspection → canonical escolhido → exclusões/erros → dados estruturados. Não alterar SEO só porque `site:` não mostra resultados.

## Vídeo
Objetivo: upload único e distribuição por plataforma com estados independentes, retry e proteção contra duplicação.
- YouTube: upload + resumable upload oficiais. (Google Developers: YouTube Data API upload/resumable upload)
- TikTok: Direct Post + Upload para rascunho; app/OAuth/scopes e requisitos de aprovação/auditoria; `PULL_FROM_URL` disponível. (TikTok for Developers: Content Posting API)
- Meta/Instagram/Facebook: matriz de APIs/permissões ainda por validar.
Não implementar o MVP antes de fechar contas, OAuth, permissões, quotas, formatos e aprovação.

## Arquitetura de referência
`GitHub main → Cloudflare Pages/_worker.js → site/Admin/APIs`.
`cpc-football-cron → Pages Worker → BSD → D1/cache → frontend`.
Pages project: `chutapracanto`; Worker separado: `cpc-football-cron`; cron `*/5 * * * *`; D1 futebol `FOOTBALL_CACHE_DB`; D1 likes `ARTICLE_LIKES_DB`; secrets runtime `ADMIN_PASSWORD`, `GITHUB_TOKEN`, `BSD_API_KEY`; produção em `main`; domínio `https://chutapracanto.com`.

## Standby
Reduzir deploys duplicados de conteúdo + índice/sitemap; pesquisa global; automações adicionais; performance apenas com evidência.


---

# 67. ADMIN IMAGENS — MELHORIA 2026-09-30

Implementada no commit `7eac9aa18c04e5d3abcd7aa3b3c112ef643f3608`.

A pesquisa de imagens do Admin agora usa dimensões e proporção disponíveis nas respostas do Openverse/Wikimedia, dá prioridade a imagens horizontais e suficientemente grandes para capas e considera correspondência textual com os termos pesquisados. Os resultados são limitados aos mais adequados e mostram dimensões quando disponíveis.

A investigação confirmou também uma diferença importante:
- uploads próprios passam pelo Worker, são validados por formato/conteúdo e têm limite de 5 MiB;
- imagens escolhidas na pesquisa externa permanecem alojadas no servidor de origem e são usadas por URL. Isso significa que um fornecedor pode impedir hotlink ou deixar de servir a imagem, algo que o CPC não controla.

Futura melhoria possível: importar/capturar a imagem externa para alojamento próprio, mas só depois de desenhar validação de origem, limites e preservação de atribuição/licença. Não foi implementada nesta fase.

Deployment de produção do commit `7eac9aa...`: `ffca2ec6`, concluído com sucesso e alias `https://chutapracanto.com`.

## Deploys duplicados — confirmado
A alteração voltou a produzir um deployment Pages normal. O histórico também mostra builds consecutivos e pelo menos um `superseded_queued_build`. A causa conhecida permanece: Pages está com watch paths amplos e commits distintos de conteúdo/índice podem provocar deployments separados.

Isto fica em **standby controlado**, não esquecido: a documentação Cloudflare confirma que Build Watch Paths permitem excluir diretórios/ficheiros do trigger de build. A futura alteração deve ser isolada, validada com uma publicação real e ter rollback fácil.


---

# 68. RASCUNHOS LOCAIS DO ADMIN — 2026-09-30

Implementado no Admin com IndexedDB. O rascunho atual guarda localmente título, subtítulo, categoria, data, autor, tipo editorial, URL de imagem, HTML do Quill e o ficheiro de imagem local quando existe. Pode ser recuperado pelo botão **Recuperar rascunho**. Após publicação de novo conteúdo, o rascunho local é limpo.

Decisão arquitetural: não usar GitHub/D1 para esta primeira versão. Assim um rascunho não cria commit, não entra em `content/noticias-index.json`, não aparece no sitemap e não provoca deployment. Se no futuro for necessário rascunho partilhado entre dispositivos/utilizadores, será desenhado separadamente.


# 69. DEPLOYMENTS + PESQUISA DE IMAGENS — 2026-09-30

## 69.1 Build Watch Paths — implementado
A configuração do Cloudflare Pages foi corrigida para evitar deployments provocados por commits que não alteram a aplicação publicada.

Configuração atual do projeto `chutapracanto`:
- `path_includes: ["*"]`;
- `path_excludes: ["docs/*", "images/uploads/*", "content/noticias/*"]`;
- produção: `main`;
- deployments automáticos de produção continuam ativos;
- previews continuam ativos.

Decisão arquitetural:
- alterações em documentação não precisam de novo deployment;
- upload de imagem pode chegar ao GitHub sem disparar um deployment isolado;
- Markdown individual de notícia não dispara deployment isolado;
- o índice `content/noticias-index.json` continua dentro do watch global e pode servir de publicação/gate para o estado editorial;
- alterações de código continuam a disparar deployment.

Isto reduz o risco de builds concorrentes/intermédios e evita que um fluxo Admin com vários commits publique estados parciais. A documentação atual do Cloudflare confirma que Build Watch Paths são precisamente o mecanismo para excluir caminhos do trigger de build.

### Validação
- Antes: `path_includes=["*"]`, `path_excludes=[]`.
- Depois: exclusões aplicadas diretamente no projeto Pages.
- O primeiro commit posterior que alterou código (`b0b75366a6f137a87ed43385bd61394c0dd49f53`) gerou exatamente um deployment de produção: `56b7ce0d-a40d-4665-ac72-be167739d178`, concluído com sucesso e alias `https://chutapracanto.com`.
- A validação negativa por commit apenas documental fica para o próximo commit em `docs/*`; esse commit deve ser observado para confirmar `skip_reason=path_config`/ausência de novo build.

## 69.2 Pesquisa de imagens — melhoria implementada
Commit de código: `b0b75366a6f137a87ed43385bd61394c0dd49f53`.

Alterações:
- pesquisa sem ano acrescenta o ano atual e o ano anterior para aumentar a probabilidade de encontrar material recente;
- Openverse passa a conservar `created_on`/`updated_on` quando disponíveis;
- Wikimedia passa a recolher timestamp/data original quando disponível;
- ranking considera atualidade, além de relevância textual, resolução e proporção;
- prioridade maior para imagens horizontais de qualidade de capa;
- penalização mais forte para retratos e formatos extremos;
- suporte a URL do Google Images no campo manual: o Admin tenta extrair parâmetros `imgurl`, `mediaurl`, `imageurl`, `url` ou `q` quando apontam para uma imagem HTTP/HTTPS;
- URLs selecionadas são normalizadas antes da pré-visualização.

### Limitação importante
A data `created_on` do Openverse é a data de entrada no catálogo, não necessariamente a data em que a fotografia foi criada/publicada. Portanto, não tratar essa data como prova de atualidade jornalística. A pesquisa por ano + metadados disponíveis é apenas um reforço de relevância.

As imagens externas continuam alojadas na origem. A futura melhoria de maior robustez é importar a imagem escolhida para `images/uploads/`, mantendo origem/licença/atribuição, em vez de depender de hotlink externo. Não implementar essa cópia sem preservar a informação de licença/atribuição.


# 70. ADMIN IMAGENS — CORREÇÃO DE REGRESSÃO + PESQUISA 2026-09-30

## 70.1 Regressão identificada e corrigida

Após a melhoria de pesquisa/importação externa, os previews das imagens antigas no Admin deixaram de aparecer. A investigação confirmou que **os ficheiros antigos em `images/uploads/` não foram apagados nem alterados** e que o site continuava a servi-los normalmente.

Causa exata:
- o normalizador novo de URLs passava primeiro por `extrairUrlImagemDireta()`;
- essa função aceitava URLs `http/https`, mas não caminhos locais como `/images/uploads/nome.jpg`;
- por isso, o índice continuava a fornecer corretamente as imagens, mas o Admin transformava os caminhos locais em string vazia e escondia o preview.

Correção:
- caminhos locais absolutos do próprio site, incluindo `/images/uploads/*`, são agora aceites diretamente pelo normalizador;
- não foi feita qualquer migração, limpeza ou alteração da pasta de uploads.

Commit de correção funcional: `793526b6c9993fd5bb0003fcd55e2970bc264fa0`.

## 70.2 Pesquisa de imagens — nova abordagem

A pesquisa anterior estava demasiado dependente de pontuação posterior sobre um conjunto limitado de resultados. Foi substituída por uma abordagem com maior cobertura e relevância:

- Openverse: 3 páginas de resultados, mantendo licenças reutilizáveis;
- Wikimedia Commons: pesquisa textual até 100 ficheiros;
- Wikimedia Commons: quando existe uma categoria com o nome pesquisado, consulta também diretamente essa categoria até 100 ficheiros;
- resultados da categoria recebem sinal de correspondência forte, mesmo quando o nome do jogador não aparece no título do ficheiro;
- correspondência textual passou a ser normalizada corretamente, incluindo acentos e espaços;
- resultados sem qualquer correspondência textual/categórica são excluídos;
- só depois da relevância são aplicadas preferências de capa: resolução e formato horizontal;
- até 60 resultados são apresentados;
- continuam a ser mostradas licença, dimensões, autor quando disponível e fonte.

Exemplo validado externamente: o Wikimedia Commons mantém uma categoria específica de Chris Smalling com várias fotografias e subcategorias por ano; existem ficheiros horizontais de alta resolução nessa coleção. A pesquisa textual simples não estava a explorar essa categoria. 

## 70.3 Limitação consciente

Isto melhora muito a cobertura de imagens reutilizáveis, mas não transforma o Admin num espelho do Google Images. Muitas imagens que aparecem no Google pertencem a sites/fotógrafos sem licença reutilizável e não devem ser importadas automaticamente como se fossem livres.

A pesquisa agora procura deliberadamente material que possa ser reutilizado dentro das fontes consultadas, em vez de trocar relevância por imagens potencialmente não licenciadas.

## 70.4 Estado de deployment

`793526b6...` concluiu deployment de produção `398ae289` com sucesso e alias `https://chutapracanto.com`.

A correção seguinte das expressões regulares da pesquisa foi commit `8720f78850dfe723a740d118b2ba7cc702573819`; no momento do registo, o deployment `7ce3235a` encontrava-se em fase `deploy`. A produção deve ser revalidada após conclusão.

Regra para IA futura: não confundir ausência de preview no Admin com perda de ficheiros em `images/uploads/`. Primeiro verificar o caminho local e o normalizador antes de tocar nos uploads.


# 65. CICLO 2026-09-30 — MONETIZAÇÃO + MATRIZ DE DISTRIBUIÇÃO

## 65.1 Auditoria AdSense / monetização
Verificado diretamente no GitHub:
- `ads.txt` existe com `google.com, pub-1556367149800029, DIRECT, f08c47fec0942fa0`.
- `privacidade.html` já documenta o AdSense, distingue código técnico de anúncios efetivamente publicados e prevê CMP/consentimento antes da publicação efetiva.
- `termos.html` existe e cobre conteúdo, informação editorial, recursos externos e alterações.
- `politica-editorial.html` distingue publicidade de conteúdo editorial.
- `contacto.html` já inclui propostas de parceria e formulário funcional.

Conclusão: não existe uma lacuna autónoma de baixo risco que justifique alterar estas páginas neste momento. A próxima etapa de consentimento depende da configuração da conta AdSense/Privacy & messaging. A Google exige CMP certificada integrada com IAB TCF para anúncios personalizados no EEE/Reino Unido/Suíça.

## 65.2 Investigação oficial — distribuição de vídeo
Matriz fechada sem implementação prematura:
- YouTube: `videos.insert` + OAuth + `youtube.upload`; resumable upload suportado; projetos não verificados podem ficar limitados a vídeos privados até auditoria.
- TikTok: Content Posting API + Direct Post + `video.publish`; requer app/configuração/autorização e aprovação; clientes não auditados ficam privados. `PULL_FROM_URL` é suportado.
- Facebook Page: publicação de vídeos através de Page Access Token/permissões; Reels têm fluxo de upload/publicação próprio.
- Instagram: Content Publishing para contas profissionais; Reels podem usar URL pública ou upload resumable e depois `media_publish`.

## 65.3 Estado / bloqueio real
O MVP de distribuição não deve ser implementado ainda porque faltam autorizações externas específicas. São necessárias:
1. YouTube OAuth/consentimento da conta CPC.
2. TikTok app com Content Posting API e scope `video.publish` autorizado/aprovado.
3. Meta app com permissões de publicação, Page Access Token e ligação/identificação da conta Instagram profissional.

Esta dependência é externa ao GitHub/Cloudflare. Não foram criados tokens, endpoints fictícios nem armazenamento de credenciais.

**Standby:** imagens do Admin continuam deliberadamente fora desta linha de trabalho.


# 66. INCIDENTE 2026-09-30 — ÚLTIMA NOTÍCIA NÃO PUBLICADA

## Diagnóstico
A notícia “Passaporte carimbado nos Açores: Seleção Sub-21 goleia Gibraltar (4-0) com 'golaço' de Rodrigo Mora e garante Euro 2027” foi corretamente gravada no GitHub em `content/noticias/...`. A imagem também foi gravada. O problema estava no índice editorial: `content/noticias-index.json` não tinha a nova entrada.

O Admin utilizava `PUT /api/admin/news` para guardar o Markdown, mas essa rota não sincronizava o índice. Como o Build Watch Paths exclui `content/noticias/*`, o commit do Markdown foi corretamente ignorado pelo Cloudflare. Sem atualização do índice, a produção continuou a servir o índice anterior.

## Correção imediata
- Entrada da notícia adicionada a `content/noticias-index.json`.
- Índice ordenado por data de publicação.
- Commit: `b4181c9c80b97d4f63b4feb88f948dcaddd9f1d2`.

## Correção estrutural
O `_worker.js` passou a sincronizar automaticamente `content/noticias-index.json` após PUT/DELETE de conteúdo editorial, preservando metadados existentes quando disponíveis.
- Commit: `70b1b1af483c1a6f2f4305fc6b0e11bbe4d5921e`.
- Deployment: `6cb198fe`.

A configuração de Build Watch Paths mantém-se intencional: o índice é o artefacto que desencadeia a publicação do estado editorial; uploads e Markdown individual não criam builds intermédios.

**Estado:** correção aplicada; aguardar conclusão do deployment para validação final em produção.


# 67. PUBLICAÇÃO ADMINISTRATIVA + BUILD WATCH PATHS — CONSOLIDAÇÃO 2026-09-30

## 67.1 Decisão sobre deployments
A configuração de Build Watch Paths foi mantida deliberadamente seletiva:
- `path_includes: ["*"]`;
- `path_excludes: ["docs/*", "images/uploads/*", "content/noticias/*"]`;
- produção em `main`;
- deployments automáticos de produção continuam ativos.

A intenção original foi evitar builds intermédios/duplicados quando uma operação do Admin gera vários commits relacionados com conteúdo, imagens e documentação. O Cloudflare Pages suporta explicitamente este mecanismo: paths excluídos são ignorados antes da avaliação dos paths incluídos; se nenhum path restante corresponder, o build é ignorado. citeturn0search0

## 67.2 O que correu mal
A estratégia de excluir `content/noticias/*` revelou uma lacuna no fluxo de publicação: o Admin gravava o Markdown da notícia, mas não atualizava automaticamente `content/noticias-index.json`.

Resultado:
- o commit do Markdown foi corretamente ignorado pelo Build Watch Paths;
- o índice público permaneceu desatualizado;
- a notícia existia no GitHub, mas não era descoberta/publicada no site.

Isto não significou que a configuração de deployments automáticos estivesse desligada. Os deployments automáticos de produção continuavam ativos; o problema era especificamente o filtro de paths e a ausência de sincronização do índice.

## 67.3 Correção estrutural
O `_worker.js` passou a sincronizar `content/noticias-index.json` automaticamente após PUT/DELETE de notícias.

Commit:
`70b1b1af483c1a6f2f4305fc6b0e11bbe4d5921e`

Deployment de produção:
`6cb198fe` — SUCCESS.

A publicação fica agora com esta sequência lógica:
1. Admin grava/atualiza o Markdown;
2. Worker sincroniza o índice editorial;
3. a alteração do índice permanece dentro dos watch paths;
4. o índice funciona como gate de publicação;
5. Cloudflare faz o deployment do estado editorial completo.

Se a sincronização do índice falhar, a API sinaliza a falha em vez de considerar a publicação concluída.

## 67.4 Regra para futuras IAs
Não remover os Build Watch Paths apenas porque um Markdown individual não dispara deployment.

Antes de alterar esta arquitetura, verificar:
- se o índice editorial continua a ser atualizado atomicamente pelo fluxo de publicação;
- se uma publicação real gera o deployment esperado;
- se commits isolados de `docs/*`, `images/uploads/*` e `content/noticias/*` continuam a ser ignorados quando apropriado.

A configuração não deve ser confundida com "Cloudflare configurado para não fazer deployments": os deployments automáticos continuam ligados; apenas determinados paths são excluídos do trigger.

## 67.5 Estado
**RESOLVIDO E CONSOLIDADO.**
Não reabrir esta decisão sem nova evidência de regressão ou duplicação de deployments.


# 71. VERIFICAÇÃO AUTÓNOMA 2026-10-01

## 71.1 Search Console
Não existe conector Search Console disponível nesta sessão. Não foi simulada nem inferida informação privada do Search Console. A documentação atual da Google confirma que o relatório de Sitemaps mostra se o sitemap foi processado e que o Page indexing é o local apropriado para os estados de indexação. citeturn0search0turn0search1

Resultado: **sem alteração SEO** até existir acesso aos dados reais.

## 71.2 Admin / rascunhos
Verificação do admin/index.html em main confirmou a implementação de rascunho local com IndexedDB:
- armazenamento local cpc_admin_local / store rascunhos;
- guardar campos, conteúdo Quill e ficheiro de imagem local;
- recuperar o rascunho e repor os campos/editor;
- não existe chamada editorial durante guardar/recuperar;
- o fluxo é local ao navegador.

Resultado: implementação presente. Teste funcional final requer execução no navegador real; não foi introduzida alteração sem evidência de regressão.

## 71.3 Monetização
Reconfirmados diretamente no GitHub:
- ads.txt com o Publisher ID atual;
- Política de Privacidade com documentação do AdSense e da necessidade de CMP/consentimento aplicável;
- Termos;
- Política Editorial;
- Contacto com propostas de parceria.

Resultado: nenhuma alteração de baixo risco necessária neste momento.

## 71.4 Cloudflare
Estado verificado diretamente:
- projeto Pages chutapracanto ligado ao GitHub chutapracanto/chutapracanto, produção em main;
- Build Watch Paths mantidos;
- deployment 0fede328... ignorado corretamente por path_config;
- deployment canónico 6cb198fe... SUCCESS e alias https://chutapracanto.com.

**Estado geral:** nenhuma regressão nova encontrada. A próxima dependência real é acesso ao Search Console ou, em alternativa, teste funcional do rascunho no Admin quando houver browser disponível.

# 72. CICLO 2026-10-01 — ADMIN IMAGENS: IMPORTAÇÃO EXTERNA + PREVIEWS

## 72.1 Estado real após os últimos commits

Depois da verificação anterior, o fluxo de imagens do Admin avançou além do estado registado na secção 71:

- a importação de imagem externa para `images/uploads/` está implementada no `_worker.js` através de `POST /api/admin/image/import`;
- commits que apenas adicionam ficheiros em `images/uploads/*` continuam corretamente a ser ignorados pelo Build Watch Paths;
- a publicação da alteração de código ocorre quando `admin/index.html` / `_worker.js` são alterados, porque esses caminhos continuam incluídos no trigger;
- o Admin passou a manter a origem de preview separada do caminho persistido, evitando que uma imagem temporária do navegador seja perdida antes da importação/publicação.

## 72.2 Correções de preview

Sequência relevante em `main`:

- `64e792c752f1fd3bd0fea80965bee3c413a1837d` — correção da pré-visualização da imagem no editor;
- `1a153ebc3e593fdda1f7bcd0113a972219aab500` — correção de preview de imagens locais/importadas;
- `71a55d55039fa0a4e5415688aa50ac0a30850856` — preservação de URLs `blob:`/`data:` para previews locais do navegador.

A correção final em `71a55d...` também removeu a revogação prematura do `blob:` URL no `onload`, que poderia invalidar a fonte temporária enquanto o Admin ainda precisava dela.

## 72.3 Importação externa e Build Watch Paths

Foram observados commits de importação como:

- `9313e05903bc635fec413e9e89173c8aaf2513f8`
- `d122aa889d5bcd045037485e751a1b9534347d24`
- `c5700b4e72fb3109471888004069b18215c6ab56`
- `369faf62c841d618e5f488887244c824ec861090`

A inspeção confirmou que estes commits são alterações em `images/uploads/*`, pelo que os deployments correspondentes foram corretamente marcados `skipped / path_config`. Isto não é uma falha de deployment.

## 72.4 Cloudflare / produção

Estado real verificado diretamente:

- Pages `chutapracanto`: produção = `main`;
- domínio canónico: `https://chutapracanto.com`;
- Build Watch Paths:
  - include `*`;
  - exclude `docs/*`;
  - exclude `images/uploads/*`;
  - exclude `content/noticias/*`;
- deployment de produção mais recente:
  - commit `71a55d55039fa0a4e5415688aa50ac0a30850856`;
  - deployment `60d23290-1f94-44a0-b327-574abd1bcf82`;
  - estado `success`;
  - alias canónico `https://chutapracanto.com`.

O deployment confirma que o estado atual de `main` está publicado.

## 72.5 Worker de futebol

Cloudflare continua a mostrar exatamente um Worker separado:

- `cpc-football-cron`;
- handler `scheduled`;
- cron `*/5 * * * *`;
- sem duplicação de triggers observada;
- D1 `FOOTBALL_CACHE_DB` continua ligado ao Pages project.

Não foi criada nem ressuscitada qualquer infraestrutura Worker adicional para o site.

## 72.6 Estado operacional atualizado

A frente Admin/imagens já não está no estado descrito pelos primeiros registos de 30/09. A importação externa e as correções de preview estão efetivamente em `main` e publicadas.

Permanece como backlog separado a futura **pesquisa inteligente de imagens**, que deve inferir termos a partir do conteúdo da notícia antes da pesquisa, sem substituir a pesquisa manual.

A validação funcional final de interação no Admin continua a depender de execução num browser autenticado. Não foi inventada essa evidência.

# 73. INCIDENTE 2026-10-01 — COMPETIÇÕES INDISPONÍVEIS

## 73.1 Diagnóstico inicial confirmado

A regressão afeta simultaneamente:
- Home → classificações/jogos/LIVE;
- página Competições.

A camada comum é `/api/competicoes`, servida pelo Pages Worker. A UI continua a apontar para este endpoint; não foi encontrada alteração recente na lógica de competições em `main` depois do último código de futebol validado.

A investigação direta ao D1 confirmou que **nenhuma competição foi refrescada desde 2026-09-30 15:35 UTC**:
- Taça de Portugal: 15:35:19;
- Liga Portugal: 15:34:17;
- Nations League: 15:34:17;
- Europa League: 15:34:17;
- Conference League: 15:34:17;
- Champions League: 15:30:12;
- Taça da Liga: 15:25:06.

As épocas guardadas são válidas para 2026/27 e terminam em 2027-06-30, portanto a idade da cache é o problema observado, não uma mudança legítima de época.

## 73.2 Cron / Cloudflare

O Worker separado `cpc-football-cron` continua existente com:
- único cron `*/5 * * * *`;
- handler `scheduled`;
- binding D1 correto `FOOTBALL_CACHE_DB`;
- versões recentes 186–193 têm o mesmo etag de script e o mesmo binding.

O cron estava configurado corretamente, mas o D1 não recebia novas escritas.

Em 2026-10-01 18:08 UTC a trigger foi reaplicada explicitamente com exatamente o mesmo único cron:
`*/5 * * * *`.
Cloudflare confirmou a alteração com sucesso e atualizou `modified_on`.

**Não foram criadas triggers adicionais nem alterado o intervalo.**

Após o primeiro slot seguinte, às 18:10 UTC, ainda não havia nova escrita no D1. A alteração de trigger pode demorar vários minutos a propagar globalmente.

## 73.3 Hipótese operacional atual

A evidência aponta para uma falha/interrupção do ciclo de execução do `cpc-football-cron` ou da chamada que este faz ao `/api/competicoes`, e não para uma regressão da UI das competições.

O código atual do cron:
1. escolhe uma competição por slot de 5 minutos;
2. lê o último `season_id` dessa competição no D1;
3. chama `https://chutapracanto.com/api/competicoes?competition=...`;
4. não grava diretamente no D1;
5. marca `noRetry()` se o endpoint responder com status não-2xx.

A próxima validação deve determinar se o cron voltou a executar após a reaplicação da trigger e, caso execute, qual status está a receber do endpoint.

## 73.4 Regra de não-regressão

Não alterar:
- `cpcInferCompetitionPhase()`;
- filtros Nations League;
- arquitetura BSD/D1/cache;
- frontend de Home/Competições;
- fornecedor BSD.

Primeiro recuperar a execução do ciclo de atualização e identificar a causa do erro. Só depois fazer alteração mínima, caso exista evidência de falha no código.

## 73.5 Imagens

A ideia de pesquisa inteligente de imagens baseada no teor da notícia está **já registada no Roadmap, secção 20, como BACKLOG / NÃO IMPLEMENTAR AGORA**. Permanece em standby e não faz parte deste incidente.


# 74. INCIDENTE 2026-10-01 — DIAGNÓSTICO DO CRON APÓS REATIVAÇÃO

Estado no ciclo atual:
- O problema continua a afetar Home e Competições através da camada comum /api/competicoes.
- O Worker cpc-football-cron continua com exatamente um Cron Trigger: */5 * * * *.
- A configuração foi reaplicada via API Cloudflare às 18:38:25 UTC para forçar a atualização do trigger.
- A versão 194 continua publicada com handler scheduled e binding D1 FOOTBALL_CACHE_DB.
- Após a reaplicação, a telemetria Cloudflare consultada entre 18:23:45 e 18:47:55 UTC devolveu ZERO eventos com $metadata.origin = cron.
- A D1 continua sem novos fetched_at desde 30/09, confirmando que nenhuma execução cron observável chegou a produzir refresh.
- Foi iniciado um Worker Tail no cpc-football-cron às 18:48:34 UTC para captura de futuras invocações; o endpoint devolveu URL de tail válida. A sessão atual não permite consumir o WebSocket do tail diretamente.
- Documentação Cloudflare atual confirma que alterações de Cron Trigger podem demorar até 15 minutos a propagar.
- Portanto, neste momento a evidência aponta para execução/propagação do Cron Trigger, mas NÃO prova ainda a causa exata.
- Não foram alterados frontend, BSD adapter, cache/D1 ou lógica das competições durante este diagnóstico.
- Não repetir PUT do mesmo schedule sem evidência nova. Próxima decisão técnica deve depender de nova evidência de execução após a janela de propagação ou de uma alternativa de observabilidade que permita confirmar a invocação.


### Atualização 18:51 UTC
- Nova consulta de telemetria até 18:50 UTC também não encontrou a mensagem `Football cron` nem qualquer evento cron observável.
- A pesquisa da API Cloudflare confirmou que não existe endpoint REST de execução manual de `scheduled()`; apenas gestão do schedule está exposta.
- Foi confirmada a configuração Wrangler `workers/football-cron/wrangler.toml`: `crons = ["*/5 * * * *"]`, D1 correto e sem segundo trigger.
- A documentação Cloudflare atual confirma propagação de alterações de Cron Trigger até 15 minutos; neste momento não há evidência suficiente para afirmar falha do código do Worker.
- A linha de investigação autónoma chegou ao limite das ferramentas desta sessão: falta observar diretamente o Cron Events/Tail no Dashboard/CLI depois da janela de propagação.


# 75. REGRA OPERACIONAL CONSOLIDADA — DEPLOYMENTS VS CRON — 2026-10-01

Esta secção consolida algo que **já estava explicitamente registado antes**, mas que agora foi reforçado porque o incidente atual demonstrou o risco de voltar a interpretar um problema de execução do Cron como necessidade de novo deployment.

## 75.1 O que já estava documentado antes deste incidente
O ledger/roadmap já dizia, desde 2026-09-28:
- `cpc-football-cron` é um Worker separado do Pages;
- o deployment do Worker já tinha sido confirmado como PASS;
- o trigger `*/5 * * * *` já tinha sido confirmado no Cloudflare;
- o binding D1 já tinha sido confirmado;
- a ausência de Logs impedia apenas observabilidade detalhada do ciclo Cron → API → D1;
- **não fazer novo deployment apenas para produzir logs/testes artificiais**;
- depois do deployment confirmado, a direção deveria ser validação/runtime/UI, não repetir deployment do Worker.

## 75.2 Distinção obrigatória para futuras IAs
Há três operações diferentes e não devem ser confundidas:

1. **Deploy do código do Worker**
   - necessário quando `workers/football-cron/index.js` ou a configuração Wrangler muda;
   - publica uma nova versão do Worker.

2. **Alteração do Cron Trigger**
   - operação de infraestrutura Cloudflare;
   - pode ser feita sem alterar o código do Worker;
   - não exige novo deployment do código se o código/configuração já estiver correta.

3. **Observabilidade/runtime**
   - verificar Cron Events, Workers Logs, Tail, D1 e resposta do endpoint;
   - observar não significa fazer deploy.

## 75.3 O que NÃO deve voltar a acontecer
Se no futuro as competições pararem de atualizar e houver evidência de que:
- o Worker publicado tem `scheduled`;
- o Wrangler mantém `crons = ["*/5 * * * *"]`;
- o binding D1 está correto;
- não há mudanças de código que expliquem a regressão;
- D1 deixou de receber refreshes;

**não fazer automaticamente:**
- novo deployment do `cpc-football-cron`;
- criar outro Worker;
- criar segundo Cron;
- alterar o intervalo;
- reescrever o handler `scheduled()`;
- alterar BSD/cache/D1/frontend;
- fazer deploy do Pages apenas para "acordar" o Cron.

Primeiro observar a execução real do trigger.

## 75.4 O que já foi testado neste incidente
- configuração do schedule via API Cloudflare: correta;
- reaplicação do mesmo schedule `*/5 * * * *`: feita às 18:38:25 UTC;
- versão Worker 194: correta, com `scheduled` e D1 correto;
- Wrangler: correto;
- telemetria: zero eventos cron observáveis no período consultado;
- D1: sem novos `fetched_at`;
- Tail: sessão criada, mas esta ferramenta não consegue consumir o WebSocket diretamente;
- endpoint público testado a partir da ferramenta Cloudflare: bloqueado pelo ambiente da ferramenta (403 "requests to chutapracanto.com are not allowed"), portanto esse resultado **não é evidência de falha do endpoint em produção**.

## 75.5 Regra de decisão
**Cron parado ≠ código do Cron defeituoso.**

Só alterar/deployar o Worker se existir evidência de que a execução ocorre e o próprio código/configuração está a falhar.

Se a execução não aparece, a investigação deve permanecer em Cloudflare Trigger / Cron Events / Tail / propagação / infraestrutura.

Se a execução aparece e o endpoint falha, investigar o endpoint.

Se a execução e endpoint funcionam mas D1 não atualiza, investigar cache/D1.

Se backend e D1 funcionam mas a UI não mostra dados, investigar frontend.

Esta sequência passa a ser a ordem oficial de diagnóstico para incidentes de atualização de competições.

## 75.6 Resultado da auditoria do ledger
**Já havia informação explícita suficiente para evitar um novo deployment do Worker neste incidente.** O que faltava era transformar essa informação histórica numa regra operacional inequívoca e consolidada no topo da memória do incidente.

A partir daqui, qualquer IA nova deve consultar esta secção antes de publicar novamente `cpc-football-cron` durante uma falha de atualização.


# 76. CORREÇÃO 2026-10-01 — CRON DE COMPETIÇÕES E CACHE HTTP

## 76.1 Causa técnica identificada no código
O Worker `cpc-football-cron` fazia o refresh através de um `fetch()` HTTP GET para o próprio domínio `https://chutapracanto.com/api/competicoes`, mas não declarava qualquer bypass de cache no subrequest.

O endpoint de competições devolve respostas `200` com `Cache-Control: public, max-age=60, stale-while-revalidate=300` em vários caminhos. Um cron que depende de executar o Pages Worker para provocar o refresh da D1 não pode aceitar uma resposta HTTP potencialmente servida da cache como equivalente a executar a lógica do endpoint.

Isto explica a discrepância observada no incidente:
- Cron Trigger: execução `Success`;
- HTTP: podia ser `2xx`;
- D1: sem novas escritas;
- código do cron: não distinguia resposta cacheada de execução real do endpoint.

A documentação atual do Cloudflare confirma que subrequests `fetch()` passam pela cache e que `cache: "no-store"` impede a consulta/armazenamento dessa cache.

## 76.2 Correção aplicada
Commit:
- `0f55e48e9735cb550492f785db84bb7319ed065e` — `fix: bypass HTTP cache in football cron refresh`

O fetch do cron passou a usar:
- `cache: "no-store"`;
- header `Cache-Control: no-store`;
- mantendo o mesmo endpoint, rotação, D1 e arquitetura.

Não foram criados Workers, triggers ou bindings adicionais.

## 76.3 Deployment
O Worker `cpc-football-cron` foi publicado diretamente no Cloudflare após a alteração, com:
- handler `scheduled`;
- D1 `FOOTBALL_CACHE_DB`;
- compatibility date `2026-09-16`;
- usage model `standard`;
- exatamente um Cron Trigger `*/5 * * * *`.

Deployment Cloudflare:
- deployment id `309faa5c228e4c2387077f259c4e2b14`;
- tag `0515365069a84a3b9e0da6c3f66e9847`;
- publicação concluída às `2026-10-01T19:35:04.419391Z`.

## 76.4 Validação ainda em curso
Às `19:39:40 UTC`, uma consulta de Observability aos últimos 10 minutos ainda mostrava zero eventos `origin=cron`, porque o próximo slot após o deployment é às `19:40 UTC`.

A D1 consultada antes desse slot continuava sem novas escritas.

A validação final deve ser feita após uma execução posterior ao deployment:
1. confirmar invocação do cron;
2. confirmar que o subrequest chega ao `/api/competicoes`;
3. confirmar novo `fetched_at` na D1;
4. confirmar Home e Competições.

Até essa validação, a correção está **deployada mas não declarada como PASS runtime**.


# 77. CORREÇÃO 2026-10-01 — CRON FORCE-REFRESH NO ENDPOINT

## 77.1 Remendo adicional após a correção HTTP
A correção de cache: "no-store" no cpc-football-cron eliminava a cache HTTP do subrequest, mas a investigação do _worker.js encontrou uma segunda camada independente: o próprio /api/competicoes podia devolver uma entrada D1 fresca antes de chegar ao BSD.

Assim, mesmo que o Cron executasse corretamente e o subrequest não fosse servido da cache HTTP, isso não garantia que a D1 fosse renovada.

## 77.2 Correção aplicada
No _worker.js, /api/competicoes passou a reconhecer a presença do parâmetro interno _cron.

Quando _cron está presente:
- não reutiliza diretamente getFootballCache() para a chave pedida;
- segue para o fluxo de refresh BSD;
- grava o novo snapshot através de putFootballCache();
- mantém o comportamento normal para pedidos públicos sem _cron.

O Cron já envia _cron=controller.scheduledTime, tornando cada pedido único. O no-store continua presente.

Commit:
- 6d1c117bdc6717f93753ab387b0fa8d6de966560
- fix(football): force cron requests to refresh BSD cache

## 77.3 Deploy Pages
O commit desencadeou novo deployment de produção do Pages:
- deployment: 6b8e6ad7-04a4-4efa-97f1-062bbe3bfe06;
- commit: 6d1c117bdc6717f93753ab387b0fa8d6de966560;
- build confirmado como SUCCESS;
- no momento do registo, a etapa de deploy ainda estava ACTIVE.

## 77.4 O que foi alterado e o que NÃO foi alterado
Alterado:
- bypass da cache HTTP no Cron;
- URL única por execução do Cron;
- bypass da cache D1 para pedidos marcados internamente pelo Cron.

Não alterado:
- frontend Home/Competições;
- inferência de fases;
- filtros/grupos/jornadas;
- fornecedor BSD;
- schema D1;
- arquitetura Pages → D1 → frontend;
- frequência do Cron (*/5 * * * *);
- existência do único Worker cpc-football-cron.

## 77.5 Risco/regressão a vigiar
Esta correção é deliberadamente mínima, mas o efeito real deve ser observado porque força cada execução do Cron a consultar o BSD em vez de reutilizar a cache D1.

Se aparecer comportamento incorreto depois desta alteração, verificar primeiro:
1. respostas/erros do BSD;
2. normalização do adapter BSD;
3. escrita putFootballCache();
4. fetched_at e payload na D1;
5. só depois Home/Competições.

Não desfazer nem criar outro remendo apenas porque a UI parece errada; comparar primeiro o snapshot D1 e a resposta do endpoint.

## 77.6 Critério objetivo de PASS
A correção não é considerada definitivamente validada apenas por deployment SUCCESS.

PASS runtime quando, após uma execução real do Cron:
- fetched_at de pelo menos uma competição fica posterior ao último valor de 2026-09-30;
- o payload D1 corresponde ao snapshot atual esperado;
- Home e Competições deixam de apresentar os dados congelados;
- uma execução posterior continua a renovar a cache sem criar duplicações ou novos Workers/triggers.

Se estes pontos forem confirmados, o incidente pode ser marcado como resolvido.


# 73. INCIDENTE CRON → /api/competicoes 503 — 2026-10-01

## Diagnóstico confirmado
- O trigger existente continua único: `*/5 * * * *` no Worker `cpc-football-cron`.
- O último evento de erro observável confirmado foi `Football cron HTTP error champions-league 503` às 19:30:03 UTC.
- O D1 deixou de receber refreshes desde 15:35 UTC; não há nova escrita de cache de competição posterior a esse ponto.
- O Worker Cron continuou a existir e a agenda não foi duplicada.
- A investigação descartou alterações adicionais de cache como solução. O problema está no caminho Cron → Pages Worker.

## Causa técnica encontrada
O Cron faz `fetch("https://chutapracanto.com/api/competicoes?...")`. Isto é um fetch de Worker para outro Worker/Pages Worker dentro da mesma zona. A configuração efetiva do `cpc-football-cron` estava sem `global_fetch_strictly_public`.

A documentação atual da Cloudflare indica que chamadas Worker→Worker por `fetch()` podem ser feitas através de Service Bindings ou habilitando `global_fetch_strictly_public`; sem o mecanismo apropriado, chamadas para outro Worker na mesma zona podem falhar com o erro 1042. citeturn4search0turn4search2

## Correção aplicada diretamente em Cloudflare
Foi aplicada ao Worker existente, sem criar outro Worker:
- `compatibility_flags = ["global_fetch_strictly_public"]`;
- D1 `FOOTBALL_CACHE_DB` preservado;
- Cron `*/5 * * * *` preservado.

A alteração criou a versão/deployment `ccc410e9-05e0-4720-a30b-91187fb81550`, com 100% do tráfego, às 20:44:38 UTC.

## Persistência necessária no repositório
O runtime Cloudflare já está corrigido. O mesmo flag precisa ficar em `workers/football-cron/wrangler.toml` para não ser removido pelo próximo deploy via Wrangler/Codex.
**Dependência:** o write automático do conector GitHub foi bloqueado pela verificação de segurança ao tentar alterar diretamente a configuração do Worker. O código de produção já está corrigido; a persistência no GitHub é a única parte que requer Codex.

## Validação
A configuração Cloudflare foi relida após a alteração e confirma:
- `global_fetch_strictly_public` ativo;
- único Cron `*/5 * * * *`;
- único binding D1 `FOOTBALL_CACHE_DB`.

Próximo sinal de sucesso: o próximo ciclo Cron deve voltar a gerar invocação e o D1 deve receber uma nova linha/refresh de competição. A documentação Cloudflare recomenda observar Functions/Workers Logs para validar erros e invocações. citeturn3search10turn0search2


# 78. CONFIGURAÇÃO CLOUDFLARE — SECRETS E VALIDAÇÃO DO BSD — 2026-10-01

## 78.1 Padrão identificado
Durante incidentes consecutivos, o runtime do Pages devolveu como indisponíveis secrets que estavam visíveis/configurados no projeto Cloudflare: ADMIN_PASSWORD e BSD_API_KEY.

Em ambos os casos, a recriação do secret resolveu o comportamento. A documentação Cloudflare confirma que secrets são bindings de runtime e que devem existir antes do deployment que os utiliza.

Regra operacional nova: quando um secret do Pages estiver configurado no painel mas o runtime disser que está ausente, confirmar o nome exato, confirmar Production/Preview, recriar se necessário, fazer novo deployment e só depois investigar código/backend/D1.

## 78.2 Auditoria de configuração realizada
Pages chutapracanto: ADMIN_PASSWORD, BSD_API_KEY e GITHUB_TOKEN como secrets em Production + Preview; ARTICLE_LIKES_DB aponta para ba093005-9101-43f4-98fa-69d913edb09c; FOOTBALL_CACHE_DB aponta para 92e3ef93-4c44-46c8-a1a4-ff5c09f4b49f.

O Wrangler do Pages declara os mesmos dois D1 e os mesmos IDs. O Worker cpc-football-cron também usa exatamente o mesmo FOOTBALL_CACHE_DB.

Não foi apagada nem recriada nenhuma base D1. Não havia evidência para isso.

## 78.3 Reinstanciação do Pages após recriação do secret
Depois de o BSD_API_KEY ser apagado/recriado, foi feito retry do deployment de produção existente, sem alteração de código: deployment 59b4f492-2f14-4e61-9eb8-a4c908d5b69d, commit c918a103adb3e707b4fee10eb31a0f6e9dbb8ad4, resultado SUCCESS.

## 78.4 Validação runtime — PASS BSD → Pages → D1
Para não esperar cinco minutos pelo cron normal, a agenda foi temporariamente alterada de */5 * * * * para * * * * * apenas para validação. Depois de uma execução, a D1 apresentou uma escrita nova em conference-league, fetched_at 2026-10-01T22:35:48.835Z, season_id 1606.

Antes desta validação, a última escrita era de 2026-09-30. Portanto, existe agora prova objetiva de que o circuito voltou a executar e a persistir dados depois da recriação do BSD_API_KEY + redeployment do Pages.

A agenda foi imediatamente restaurada para */5 * * * *.

Não foram criados segundos Workers, triggers ou bindings.

## 78.5 Estado atual
BSD/API/cache: PASS runtime.

O incidente das competições deixa de ser classificado como D1 parado por causa desconhecida. O backend voltou a escrever no cache.

Ainda não se deve apagar/recriar D1 nem alterar o adapter BSD sem nova evidência.

## 78.6 Auditoria dos restantes secrets
Os três secrets atuais do Pages são ADMIN_PASSWORD, BSD_API_KEY e GITHUB_TOKEN.

BSD_API_KEY foi validado pelo refresh real acima. ADMIN_PASSWORD já tinha demonstrado comportamento semelhante num incidente anterior e foi recriado. GITHUB_TOKEN permanece configurado; o seu valor não é legível pela API Cloudflare e não deve ser exposto.

Se uma funcionalidade que depende do GITHUB_TOKEN voltar a reportar indisponível, aplicar a mesma sequência: confirmar secret, recriar se necessário, redeploy e teste real. Não alterar D1 como primeira resposta.

## 78.7 Infraestrutura que NÃO deve ser desfeita
FOOTBALL_CACHE_DB permanece intacto; ARTICLE_LIKES_DB permanece intacto; cpc-football-cron permanece único; Cron normal permanece */5 * * * *; global_fetch_strictly_public permanece no cpc-football-cron; cache no-store e Cache-Control no-store permanecem no fetch do cron; _cron continua a forçar o caminho de refresh BSD no endpoint de competições.

Estas alterações têm histórico próprio e não devem ser removidas apenas por suspeita.

## 78.8 Próxima validação funcional
Com o backend agora a renovar a D1, a próxima verificação deve ser de consumo: Home, /competicoes, filtros/grupos/jornadas, uma execução posterior para confirmar nova atualização de fetched_at e, se necessário, Admin para confirmar ADMIN_PASSWORD/GITHUB_TOKEN no runtime.

Imagens relacionadas por teor da notícia continuam em BACKLOG/STANDBY e não fazem parte deste incidente.


# 79. MÉTRICAS EDITORIAIS / AUDIÊNCIA — 2026-10-02

A utilizadora pediu para não perder de vista duas necessidades de medição:
- saber quantas pessoas fizeram like em cada notícia;
- saber quantas pessoas entram/visualizam cada notícia e obter rates úteis.

## Auditoria inicial
- O projeto possui o binding D1 ARTICLE_LIKES_DB, já existente em produção.
- A pesquisa do código atual não encontrou uma área de analytics/relatório que apresente likes por notícia ao utilizador.
- A pesquisa do código atual também não encontrou integração ativa identificável de Google Analytics/GA4/gtag ou equivalente para pageviews.
- Não foi feita qualquer alteração nesta frente nesta sessão.

## Decisão
Registado no roadmap como frente própria de métricas editoriais/audiência. Não mexer no sistema de likes nem adicionar analytics antes de definir o modelo e a solução mais adequada.

## Métricas pretendidas
Likes por notícia; pageviews/visualizações; utilizadores/sessões quando suportados; origem de tráfego; evolução temporal; relação visualizações/likes e outras rates úteis.

## Nota operacional
O próximo desenho deve distinguir claramente pageview, sessão, utilizador e engagement rate. A solução deve ser simples, de baixo custo, compatível com privacidade/AdSense e não degradar performance.


# 80. PAINEL DE MÉTRICAS NO ADMIN — FASE 1 — 2026-10-02

Foi pedido um painel único no Admin para consultar likes, visitas e rates por notícia.

## Implementação realizada diretamente
- Endpoint autenticado: /api/admin/metrics/likes.
- Consulta agrupada diretamente ao ARTICLE_LIKES_DB.
- Nova área 📊 Métricas no Admin.
- Mostra total de likes, número de notícias com likes e tabela por notícia/data/likes.
- Área de visualizações fica preparada no mesmo painel, mas não apresenta valores fictícios enquanto a medição de pageviews não existir.
- Endpoint de métricas fica protegido pela autenticação já existente do Admin.

## Deploy
- Worker/API: commit fb9147dcf072c0305d1f812d198933460c909ab0, deployment 59c1ca98, SUCCESS.
- Admin UI: commit 21a8bc10ed05e1938377fbd7a38c15ac14b9876d, deployment abc360e2, SUCCESS e alias de produção.
- Alteração documental 3d0b73786604d2b4c9fce73983ef31b0df9cda01 ficou corretamente skipped por path_config.

## Próxima fase
Implementar medição real de pageviews/visualizações e, se tecnicamente adequado e respeitador da privacidade, métricas de visitantes únicos e rates. O mesmo painel deverá consumir esses dados.

## Regra de execução até 22/10/2026
Não depender de Codex enquanto os créditos da utilizadora estiverem esgotados. Preferir implementação direta pelos acessos disponíveis; recorrer a Codex apenas quando necessário após essa data.


# 81. PAGEVIEWS E PAINEL DE MÉTRICAS — 2026-10-02

Após a Fase 1 de likes, foi implementada a medição real de visualizações das notícias sem depender de Codex ou fornecedor externo.

## Alterações
- criada migrations/0002_article_views.sql;
- criada tabela article_views na D1 ARTICLE_LIKES_DB de produção, com índice por slug e data;
- endpoint público POST /api/article-view, com validação do slug contra o índice editorial;
- noticia.html envia uma visualização depois de a notícia ser carregada com sucesso;
- Admin passou a consultar /api/admin/metrics/views e calcular o **Like rate = likes / pageviews**;
- painel mostra likes, visualizações e rate por notícia.

## Privacidade / definição da métrica
A tabela de pageviews guarda apenas slug e timestamp. Não guarda IP, email, nome nem o identificador anónimo utilizado para likes. Portanto a métrica é **pageview**, não visitante único.

## D1 / validação
Antes da implementação: likes_total=1, views_total=0. Nenhum pageview artificial foi inserido para testar o painel.
A tabela foi criada diretamente na D1 de produção e a migration foi adicionada ao repositório para persistência.

## Deploys
- _worker.js: fea653288e77a269941d5fce3304023fe996da66 — SUCCESS / produção.
- noticia.html: a077f7ec2782e675b09c495d16a84cdbd16ec846 — SUCCESS.
- admin/index.html: bc45da65baa3d68325203cb314b3e460e176cf94 — deployment e608bc59, SUCCESS, alias de produção.
- migration: 00a696ec115ce0c99d01fc0a6b3271232fad2807 — deployment concluído; a D1 foi também aplicada diretamente para garantir existência imediata.

## Limitação da validação externa
Não foi possível fazer um pedido HTTP externo a chutapracanto.com a partir do ambiente de execução por ausência de resolução DNS nesse ambiente. A validação de deployment/D1 foi feita diretamente via Cloudflare. Não foram inventados pageviews para substituir o teste.


# 82. CORREÇÃO — ROUTE DE PAGEVIEW — 2026-10-02

Durante a revisão final foi encontrado um erro de integração: a função handleArticleViewAPI e a chamada em noticia.html já existiam, mas o dispatcher principal do Worker ainda não encaminhava /api/article-view para essa função.

Correção aplicada diretamente:
- adicionada a rota /api/article-view no Worker;
- commit 33e49aa8f0174051755f72ae0a318ae28cbb4d10;
- deployment cc35198e;
- SUCCESS em produção com alias https://chutapracanto.com.

Este remendo fica registado para que a implementação futura não seja confundida com uma alteração de arquitetura. A medição continua baseada apenas em pageviews, sem identificadores pessoais.


## 2026-10-02 — Métricas por período

- Atualizado o painel **Admin → Métricas** para permitir leitura por janela temporal: **últimas 24 horas, últimos 7 dias e últimos 30 dias**.
- Os endpoints autenticados `/api/admin/metrics/views` e `/api/admin/metrics/likes` passaram a aceitar `?period=1d|7d|30d` e filtram, respetivamente, `article_views.viewed_at` e `article_likes.created_at`.
- O painel aplica o mesmo período a visualizações e likes, recalcula totais, notícias com atividade e o **Like rate** dentro dessa janela.
- O sistema continua a medir **pageviews**, não pessoas únicas.
- Não foram criados dados históricos artificiais; o período apenas filtra os registos que já existem.
- Implementação direta, sem Codex, devido à indisponibilidade de créditos até 22/10/2026.
- Commits: `_worker.js` `19b987bc0a15aca22756ec0d429d4fa24c456c8b`; `admin/index.html` `3fdfba17c5958cd47a1b4c188ba297e3b24a2d8a`.
- Remendo/precaução: o filtro usa uma whitelist de períodos no backend, evitando aceitar modificadores SQL arbitrários vindos do cliente.


# 83. ANALYTICS FIRST-PARTY + ORIGENS + JORNADA + RELACIONADAS — 2026-10-02

A utilizadora clarificou que a análise de aquisição deve distinguir também tráfego vindo de Linktree, Threads, X, Google Search/pesquisa direta por Chuta Pra Canto, além de Facebook, Instagram, YouTube, TikTok, Reddit e tráfego direto. Clarificou ainda que não existe um botão "Continua a ler": existem notícias relacionadas no fundo da notícia, e estas devem tornar-se mais relevantes, dando preferência a notícias recentes quando o conteúdo também for relacionado.

## Implementação direta, sem Codex
Foi criada uma primeira camada de analytics própria do Chuta Pra Canto, sem fornecedor externo e sem depender de Codex.

### Tracking
- novo analytics.js carregado em Home, Notícias, Opinião, Competições e página individual de notícia;
- sessão anónima por sessionStorage, sem IP, nome ou email;
- eventos: page_view, page_exit, active_time, scroll_depth, related_article_impression, related_article_click, competition_more_click, short_impression e short_click;
- tempo ativo usa visibilitychange, evitando tratar simplesmente uma aba aberta e inativa como tempo de leitura;
- observação por IntersectionObserver, incluindo componentes carregados dinamicamente através de MutationObserver.

### Origem
Classificação inicial por utm_source quando presente e, caso contrário, pelo domínio de referência:
- Facebook;
- Instagram;
- Google / pesquisa orgânica;
- YouTube;
- TikTok;
- Reddit;
- Linktree;
- Threads;
- X/Twitter;
- Bing;
- referral genérico;
- interno;
- direto.

UTM é preferível quando o Chuta controla o link. O referrer pode ser removido por algumas aplicações/navegadores, portanto não é uma classificação perfeita. A pesquisa Google permite identificar a origem Google quando o referrer chega, mas não guarda a pesquisa feita pelo utilizador nesta primeira fase. Para consultas de pesquisa propriamente ditas, Search Console continua a ser a fonte adequada.

### Eventos específicos
- Notícias relacionadas: impressão quando entram no viewport e clique no artigo destino.
- Home → Competições: clique em VER TODAS.
- Home → Shorts: impressão do cartão e clique para reproduzir.
- Página/URL anterior e origem inicial da sessão ficam associados aos eventos.

### Notícias relacionadas
O algoritmo anterior escolhia primeiro todas as notícias da mesma categoria e depois as restantes por data. Foi substituído por uma pontuação simples que combina:
1. sobreposição de termos relevantes entre título/subtítulo/categoria;
2. mesma categoria;
3. recência;
4. desempate por maior sobreposição e data.

Mantêm-se 3 notícias relacionadas, sem alteração do layout estrutural. A intenção é que uma notícia recente e realmente sobre o mesmo assunto apareça antes de uma notícia apenas recente da mesma categoria.

### Backend / Admin
- nova tabela analytics_events;
- nova migration migrations/0003_analytics_events.sql;
- rota pública mínima POST /api/analytics/event, protegida por same-origin, validação de payload e sem dados pessoais;
- schema também é garantido lazy no primeiro evento, para não depender de aplicação manual da D1 antes do primeiro uso;
- novo endpoint autenticado /api/admin/metrics/analytics?period=1d|7d|30d;
- Admin → Métricas passou a mostrar sessões, tempo ativo médio, sessões de uma página, origens e ações/jornadas.

### Definições importantes
- Visualizações continuam a ser pageviews, não pessoas únicas.
- Sessão é o identificador técnico temporário usado para reconstruir uma jornada no mesmo contexto de navegação; não equivale a uma pessoa.
- Sessões de 1 página são apresentadas como tal e não como uma taxa de bounce oficial.
- O tempo apresentado é tempo ativo médio, não simplesmente tempo desde a abertura da aba.

## Commits e produção
- migration: 33b5c197919953523466bcd8333484789427de90;
- analytics.js: bb8545448dd636ce3c27d155ba93c038493d55dc, seguido de correção de observação dinâmica b17af73b128045f971a085747c2b247919b52be2;
- Worker analytics: 21dfc3d6004d4253dbea8eab75e49800b165c03b, seguido de resumo de sessões/tempo 65d96050dfb5b65bdfb39193bff43d44504c1de8;
- melhoria das notícias relacionadas: d27671255bdeece047b9ba1a1ce7c7f3a819d829;
- marcação de impressões das relacionadas: 574b85b8fd05d55f98511e19134dd219911d8421;
- Home Shorts: 0df7cd682b9e754889f3a8fffc2ae041faf0078c;
- ativação de analytics nas páginas: 9da6cb2137a9c03c2af93a458664bcc5270bf8e4, 3a4bceea92c582ee38f06744f35aee967e8f2be, 995e09ad1af4e59b2155a67a88c11f7751af74a0, a0dd21c29347adb34534abfb2524c067afa8fa45, 7031d9e07bbd5906c8291cff753f3e445cd6e88a;
- Admin: d5f075903bf8f88038999b04d148b50b0ee6a73c;
- deployment final desta sequência: 88386ea7, SUCCESS, produção, alias https://chutapracanto.com.

## Limitação de validação
O deployment foi validado diretamente via Cloudflare. O ambiente de execução não conseguiu abrir externamente o domínio/pages.dev para fazer um browser test HTTP real, por isso não se deve afirmar que foi feito um teste visual externo. Não foram inseridos eventos/pageviews artificiais.

## Remendo importante
Foram gerados vários deployments em sequência; Cloudflare marcou alguns como skipped por serem builds ultrapassados por commits seguintes. O deployment 88386ea7 é o final desta sequência e terminou em SUCCESS. Não é necessário reverter nem tentar reativar os deployments skipped.

migrations/0003_analytics_events.sql fica no repositório como fonte de persistência. O Worker também cria a tabela/índices de forma idempotente no primeiro uso para evitar uma dependência de migração manual.


## 2026-10-02 — CORREÇÃO DO PAINEL ADMIN: MÉTRICAS E LAYOUT EDITORIAL

- Problema identificado: o bloco `#metrics-screen` tinha sido colocado **dentro** de `#list-screen`. Como `abrirMetricasAdmin()` esconde `#list-screen`, as próprias métricas ficavam escondidas e não podiam carregar/aparecer.
- Correção direta, sem Codex: commit `f8f8931ad5f8c6b28679a402fac9590ca705d88b`.
- `#metrics-screen` foi retirado de dentro de `#list-screen` e passou a ser irmão dos ecrãs de conteúdos/formulário, permitindo que o botão 📊 Métricas o mostre corretamente.
- O bloco superior do Admin foi também corrigido para preservar o layout anterior: título à esquerda e os botões `+ Nova Notícia`, `+ Nova Crónica` e `Sair` do lado direito.
- Deployment Cloudflare Pages: `83c87c55`, production, commit acima, build/deploy SUCCESS, alias `https://chutapracanto.com`.
- Não foram alteradas as funções de criação/edição de notícias ou crónicas, nem o backend de futebol.
- Regra para futuras alterações: não aninhar `#metrics-screen` dentro de `#list-screen`; qualquer nova secção analítica deve permanecer dentro de 📊 Métricas. Manter os botões de criação no lado direito do cabeçalho editorial.


## 2026-10-02 — AJUSTE FINAL DA ESTRUTURA DAS MÉTRICAS NO ADMIN

- Correção solicitada: as métricas não devem aparecer por baixo das listas de 📰 Notícias ou ✍️ Crónicas. As três áreas principais continuam separadas: Notícias, Crónicas e 📊 Métricas.
- Dentro de 📊 Métricas, os separadores internos 📰 Notícias / ✍️ Crónicas permanecem e passam a ficar **acima** do filtro de período e da descrição da página, conforme o layout pretendido.
- Removido o botão `← Voltar aos conteúdos` da área de métricas; a navegação deve ser feita pelos separadores principais.
- O título da secção editorial dentro das métricas passa a acompanhar o separador interno selecionado.
- Reforçada a inicialização do Admin para esconder explicitamente `#metrics-screen` e `#form-screen` quando o painel é aberto, evitando que métricas apareçam simultaneamente com a lista editorial.
- Commit direto no GitHub, sem Codex: `4c087e63957f78ca927a4d2832ea3e301e184d59`.
- Deployment Cloudflare Pages: `14e3b2a9`, production, build/deploy SUCCESS, alias `https://chutapracanto.com`.
- Não foram alterados futebol, D1, analytics backend, likes/pageviews ou criação/edição de conteúdos.


## 2026-10-02 — REFORMULAÇÃO DAS MÉTRICAS: VISÃO GLOBAL + DETALHE POR CONTEÚDO

- Correção da interpretação anterior: as abas internas que separavam métricas de Notícias e Crónicas foram removidas. A área 📊 Métricas é agora **uma visão conjunta** de Notícias + Crónicas.
- As abas principais do Admin (`📰 Notícias`, `✍️ Crónicas`, `📊 Métricas`) continuam a ser a navegação para voltar a cada área editorial. Não existem subabas dentro das métricas.
- A área global começa por: visitas/pageviews totais, sessões totais, tempo ativo médio, sessões de 1 página e bounce calculado como sessões de 1 página / sessões totais.
- A seguir mostra origem das visitas, países e sites/referrers.
- Depois mostra Notícias + Crónicas juntas, ordenadas por visualizações, com likes e ações de partilha por conteúdo.
- Cada notícia/crónica no Admin ganhou `📊 Ver métricas`, abrindo detalhe individual com visualizações, likes, partilhas registadas e onde, tempo ativo médio, origem de entrada, entrada a partir de outra notícia e navegação seguinte/encerramento.
- O detalhe usa a jornada já recolhida pelo analytics first-party; não inventa dados históricos.
- País passou a ser associado aos eventos através do código de país fornecido pelo Cloudflare (`CF-IPCountry`), sem guardar IP.
- O endpoint `/api/admin/metrics/analytics` passou a contar origens como pageviews (em vez de todos os eventos) e a devolver países, referrers e partilhas por conteúdo.
- Novo endpoint `/api/admin/metrics/article?slug=...&period=...` para detalhe individual.
- Commits diretos, sem Codex: `a96b0f8d72960a389624ecd5d88244d3a501cbfa` (Admin) e `f6958e65de60f1e0fa8496c108983fbe6aefa7f1` (Worker/analytics).
- Deployment final Cloudflare Pages: `310bf5d5`, production, SUCCESS, alias `https://chutapracanto.com`.
- Não foram alterados futebol, D1 de competições ou o funcionamento editorial de criação/edição.
- Nota: “partilhas” externas são ações de partilha/click registadas pelo site; o site não consegue confirmar que Facebook/WhatsApp/X/Telegram efetivamente publicaram a partilha. `Link copiado` é uma ação concluída pelo navegador.


## 2026-10-02 — Remendo imediato do Admin: lista de conteúdos + métricas anteriores
- Foi detetada uma regressão introduzida durante a reorganização das métricas: a função `mostrarLista` e as funções auxiliares de paginação/pesquisa deixaram de existir no `admin/index.html`, causando `mostrarLista is not defined` e impedindo o carregamento de Notícias e Crónicas.
- Corrigido diretamente no GitHub, sem Codex: commit `3980cd083fb4ed71caa46db41f8169735ff8754a`.
- Restauradas `mostrarLista`, `mostrarPaginacao`, `mudarPagina` e `filtrarLista`, preservando Ver, Partilhar, Editar e Apagar e acrescentando `📊 Ver métricas` por conteúdo.
- As métricas globais foram complementadas, não substituídas: visualizações de conteúdos, likes totais, conteúdos com likes, partilhas totais e `Like rate` por conteúdo, mantendo o dashboard único de Notícias + Crónicas e o seletor de período.
- Cloudflare Pages produção: deployment `ecd0a194-6867-4f51-8197-098ae4d51dba`, commit `3980cd083fb4ed71caa46db41f8169735ff8754a`, build/deploy SUCCESS, alias `https://chutapracanto.com`.
- Regra para próximas alterações: em `admin/index.html`, nunca remover funções de renderização/listagem ao reorganizar a área de métricas; métricas são acrescentadas à área própria e não substituem a gestão de conteúdos.

## 2026-10-02 — Métricas: restauração integral + integração com visão do Site
- Comparação direta com a versão anterior das métricas confirmou que, ao acrescentar a visão do Site, tinham desaparecido da UI quatro elementos anteriores: `metric-total-views`, `metric-liked-articles`, `metrics-shares-body` e `metrics-journeys-body`.
- Restaurados. A visão do Site foi mantida como camada adicional, e as métricas editoriais anteriores não foram substituídas.
- O ranking conjunto Notícias + Crónicas mantém visualizações, likes, Like rate e partilhas, e voltou a mostrar a data do conteúdo.
- Voltaram as tabelas de Partilhas e Percursos/Ações. A tabela de origens existente foi preservada e enriquecida com países e sites/referências na área Site.
- Comparação base usada: commit `8a6c2b05097fcfd80524b6da0d77f6c86b41ff52`; correções finais: `76b6a273773c06c5ebec5d485e3a41707e9d6768` e `e7f4c0dbe278c0c9fdc05d8c20a85be8168787bc`.
- Produção Cloudflare: deployment `d1d7c081-90fa-44d5-9b1e-362fed423e3b`, SUCCESS, alias `https://chutapracanto.com`.
- Regra reforçada: ao adicionar uma camada nova de métricas, comparar a UI anterior e preservar todos os indicadores/tabelas existentes; adicionar, melhorar ou reorganizar, nunca remover por presumir duplicação.

## 2026-10-02 — Métricas: retorno editorial e layout vertical
- Ajuste solicitado no Admin: dentro de **Métricas** foram adicionadas duas abas/botões de retorno direto para **📰 Notícias** e **✍️ Crónicas**, sem criar sub-abas para separar as métricas.
- As tabelas **📤 Partilhas** e **🚦 Percursos e ações** deixaram de ficar lado a lado na mesma linha. O bloco de métricas analíticas passou para uma única coluna, com cada tabela em largura total e linhas separadas.
- Preservado o dashboard combinado de Notícias + Crónicas e todas as métricas existentes.
- Commit: `5401424f86dbb1ffb18045e003ffd495a3cc3635`.
- Regra: as métricas continuam juntas; apenas a navegação de retorno e a disposição visual foram alteradas. Não remover métricas existentes ao acrescentar novas.

## 2026-10-02 — VERIFICAÇÃO REAL DAS MÉTRICAS + SEO PÚBLICO + CONTINUA A LER

### Analytics: teste funcional realizado pela utilizadora
Foram realizados testes reais em produção através de três percursos:
1. Facebook → notícia partilhada → leitura/exploração → like;
2. URL direta → Notícias → outra notícia → leitura/exploração → like;
3. pesquisa Google por "Chuta Pra Canto" → resultado do site → Home → outra notícia → permanência na página → like.

### Evidência D1
A recolha está funcional. A D1 de likes contém likes reais dos testes e a D1 de analytics contém eventos reais de navegação/tempo/scroll. Portanto, o problema observado no Admin não está demonstrado como falha da recolha frontend → Worker → D1.

Evidência observada na D1 durante a validação:
- article_likes: 5 registos no momento da consulta;
- analytics_events: eventos reais de page_view/page_exit/active_time/scroll_depth;
- article_views: visualizações de artigos reais, incluindo artigos usados nos testes.

### Regra de diagnóstico para o Admin
Não alterar o sistema de likes/pageviews/tracking sem nova evidência. A próxima camada a validar é:
D1 → endpoint autenticado de métricas → JavaScript do Admin → cartões/tabelas.

### Continuação de leitura
A utilizadora reportou que nenhum cartão aparece em "Continua a ler". A análise do índice atual mostrou que existem várias notícias semanticamente relacionadas para os artigos testados, incluindo correspondências fortes por título/categoria/termos.
Estado: bug de renderização/execução a investigar. Não assumir que é falta de dados ou falha do algoritmo antes de inspecionar o runtime.

### Google / pesquisa pública
Na pesquisa pública por "Chuta Pra Canto", a utilizadora observou primeiro páginas institucionais do domínio (Sobre Nós, Contacto, Termos) e redes sociais, enquanto o domínio principal aparece mais abaixo.
Isto não significa que o Google tenha escolhido "a página menos vista" por engano: ranking e indexação não são ordenados por pageviews internos do Chuta. A página apresentada para uma consulta depende da correspondência/relevância e de sinais de pesquisa do Google; pageviews internos não são uma instrução de ordenação.
O objetivo editorial continua a ser reforçar a compreensão do domínio como site de futebol, mas não alterar páginas institucionais ou criar sinais artificiais para forçar a Home. Google recomenda conteúdo útil, propósito claro do site e títulos/heading descritivos.

### Competições / LIVE — auditoria antes de nova alteração
A arquitetura existente foi reaberta apenas para inspeção, não para refatoração:
- BSD continua a ser a única fonte validada;
- cpc-football-cron continua separado, */5 * * * *;
- FOOTBALL_CACHE_DB permanece o D1 oficial;
- stale continua fallback de segurança, não resposta normal;
- endpoint /api/competicoes já consulta/enriquece LIVE e integra LIVE no snapshot normalizado;
- Home já possui secção JOGOS EM DIRETO, LED vermelho pulsante, competição/grupo/jornada, equipas, marcador, minuto e eventos de golo;
- Home faz descoberta global aproximadamente a cada 60 s e polling de competições já LIVE a cada 15 s, sem fazer 7 pedidos a cada 15 s;
- Competições já possui estado LIVE por competição, atualização a cada ~15 s quando existe LIVE, e atualização de descoberta a cada ~60 s quando não existe LIVE conhecido;
- fases/grupos/rondas continuam dinâmicos.

Regra para a próxima implementação: melhorar os cartões LIVE apenas por alteração localizada e com validação do ciclo completo: entrada LIVE → cartão → minuto → golo → fim → remoção → novo jogo LIVE. Não alterar cache, adapter BSD, D1, cron ou filtros de competição sem evidência específica.

### SEO / LIVE — não misturar frentes
O comportamento da pesquisa Google e a indexação não justificam alterar a arquitetura dos jogos LIVE. São frentes independentes.


## 2026-10-02 — LIVE: CARTÃO HOME + DESTAQUE DE COMPETIÇÕES — MELHORIA APLICADA

### Evidência de runtime
Foi observado em produção um jogo LIVE real da UEFA Nations League:
- Cazaquistão — Moldávia;
- grupo: Liga C · Grupo C3;
- jornada: 3;
- o cartão LIVE já aparecia corretamente na Home;
- FOOTBALL_CACHE_DB confirmou o mesmo fixture em estado `live` (25' no momento da consulta).

### Alterações aplicadas
**Home — cartão LIVE**
- nomes das seleções passam a ser apresentados em português;
- removida a duplicação inglesa do contexto da jornada: fica a competição, a Liga/Grupo e **Jornada N**;
- quando a imagem da seleção não é utilizável, existe fallback visual de bandeira em vez de imagem quebrada;
- o cartão LIVE passou a ser clicável;
- o destino é construído com competição + grupo + jornada, por exemplo `/competicoes?competition=nations-league&group=C3&round=3`.

**Competições — Jogo em destaque**
- os LIVE passam a ter prioridade sobre os próximos;
- no filtro **Todos**, quando há vários candidatos, existe uma seta discreta para avançar pelo destaque;
- a seta só aparece em **Todos** e quando há vários jogos;
- nomes das seleções e dos autores dos golos passam a ser apresentados em português;
- imagens quebradas de seleções têm fallback visual de bandeira;
- ao abrir um LIVE vindo da Home, o contexto de grupo e jornada é preservado.

### Proteção da arquitetura
- não foram alterados BSD, adapter, D1, cache, cron ou filtros estruturais;
- a alteração é de apresentação/navegação no frontend;
- não foram introduzidos dados LIVE artificiais.

### Commits / produção
- Home: `9158e9158e091c1820cdf1beb8e6543f565a91d0` — deployment `db7b7df9` SUCCESS.
- Competições base: `c7aa057533e007ad5b81672c328c64390d1f4c51` — deployment `f2de4778` SUCCESS.
- Prioridade LIVE no destaque: `2daa580a7e5986256c5abcd80a27bbf3e3d3dcd6` — deployment `b1ca26a9` SUCCESS.
- Navegação suave em **Todos**: `3ddeffd3b0a28bd17b1006f333831c765f5cd390` — deployment SUCCESS.
- Preservação de grupo/jornada no destino: `304918fdd47ee2f9243eb5268657126d68aecfcb` — deployment `58299270`, build SUCCESS e deploy ativo no momento do registo.

### Validação técnica
- JavaScript inline de `competicoes.html`: compilação sintática OK.
- Script funcional inline de `index.html`: compilação sintática OK; o primeiro `script` é JSON-LD, não JavaScript executável.
- Ainda falta validação visual final no navegador em produção; não foi fabricado nenhum jogo para esse teste.

### Regra
Para seleções nacionais, a bandeira é fallback aceitável. Não trocar novamente o sistema de imagens/API sem evidência de que a solução atual é insuficiente.


## 2026-10-02 — CORREÇÃO DO REGRESSO VISUAL DOS JOGOS/LIVE

Foi identificado um erro introduzido na primeira implementação dos fallbacks visuais dos cartões LIVE/Competições.

### Causa raiz
- `safeUrl("")` estava a transformar uma string vazia em `https://chutapracanto.com/`, porque `new URL("", location.origin)` devolve a origem.
- Isto fazia com que imagens sem URL válida fossem renderizadas como imagens apontando para a própria Home.
- O fallback visual tinha sido construído com `onerror` dentro de uma string HTML e ficou mal escapado, produzindo texto/markup partido visível no cartão.
- O resultado foi exatamente o padrão observado: imagem apontada para Home, bandeira/markup exposto e nomes visualmente “lixados”.

### Correção
- `safeUrl` agora rejeita imediatamente valores vazios antes de criar o URL.
- O fallback de equipa passou a ser markup simples e seguro: imagem válida + bandeira/bola escondida, revelada apenas se a imagem falhar.
- A imagem usa primeiro o `logo` fornecido pelo BSD e só depois `flag`.
- Nomes foram centralizados num mapa PT para seleções e clubes relevantes; nomes não mapeados continuam a usar o nome real recebido do fornecedor, sem inventar traduções.
- Home: a etiqueta da jornada voltou a ser mostrada explicitamente como **Jornada N**. Ex.: **Liga C · Grupo C3 · Jornada 3**.
- Competições: o mesmo tratamento de nomes/imagens foi aplicado ao destaque e à lista de jogos.
- Não foram alterados BSD, D1, cron ou o modelo de cache.

### Commits
- Home: `0843826c79cc699063064f6c661ad0c234d35f20`, seguido de correção de escaping em `fe8967575fe9ee3b90825f4c8f78fe22bc782d36`.
- Competições: `6247a6931299c3609a78a603f1021870d5cb4fd6`, seguido de correção de escaping em `be58fca1a7ad65edb1b0a0f59bc849d1e6537ec2`.
- Último deployment de Competições: `b8060631-ac2e-447b-9c1c-ee84bd38abb2` — SUCCESS — alias `https://chutapracanto.com`.
- Último deployment da Home da mesma correção: `0ab9e8f1-e04c-429b-bb8d-60e14a89b141` — SUCCESS — alias `https://chutapracanto.com`.

### Validação
- `competicoes.html`: JavaScript executável compila.
- `index.html`: o único erro da validação sintática automática é o primeiro bloco JSON-LD, que não é JavaScript executável; o bloco funcional compila.
- O pipeline LIVE continua a usar os dados reais do BSD/D1.


## 2026-10-02 — AJUSTE FINAL DOS CARTÕES LIVE: GOLOS POR EQUIPA + MINUTO NO LIVE

A pedido da utilizadora, foi feita uma alteração exclusivamente visual nos cartões LIVE de Home e Competições.

### Home
- cartão LIVE aumentado de ~255 px para ~290 px, dando mais espaço entre equipas e marcador;
- removidas as grandes siglas/códigos de país usados como fallback visual; o fallback passou a ser apenas uma pequena bola neutra quando não existe imagem válida;
- quando existe golo, o minuto e o jogador passam a aparecer **diretamente por baixo da equipa que marcou**;
- removida a duplicação da lista de golos no rodapé do cartão;
- nomes das equipas e navegação competição/grupo/jornada preservados.

### Competições
- removidas as grandes siglas/códigos de país dos visuais das equipas;
- **Jogo em destaque**: minuto + jogador do golo aparecem por baixo da equipa que marcou, em vez de no centro;
- **Jogos e resultados**: mesma apresentação, com minuto + jogador por baixo da equipa marcadora;
- em jogos LIVE, o minuto passou para dentro da própria etiqueta vermelha **LIVE · N'**;
- a antiga linha separada do minuto LIVE deixou de ser usada;
- imagens válidas continuam a ser preferidas; fallback não usa siglas grandes.

### Proteção / validação
- nenhuma alteração a BSD, D1, cache, cpc-football-cron ou normalização de dados;
- JavaScript funcional inline de index.html e competicoes.html: compilação sintática OK após a alteração;
- Home deployment ad664158-8e17-478a-bf34-e28abb8a4bfa — SUCCESS — alias https://chutapracanto.com;
- Competições deployment 770c7ebc-ed9b-4793-9878-878cb46369c0 — SUCCESS — alias https://chutapracanto.com;
- commits finais: Home a159360403428270064d50d8d49a60b6209ffd57; Competições b54ade21380f58f2fa571fd1218602694a918e70.

### Regra para futuras alterações
Os eventos de golo devem ser apresentados junto à equipa marcadora, e não como uma lista genérica abaixo do marcador, salvo pedido explícito em contrário. O minuto do jogo LIVE deve permanecer dentro da etiqueta LIVE quando apresentado na lista de jogos/resultados.


## 2026-10-02 — CORREÇÃO IMEDIATA: SEM BOLAS ARTIFICIAIS + `goalsLabel` RESIDUAL

Após a revisão dos cartões LIVE:
- removido completamente o fallback visual de bola de futebol por baixo dos clubes na Home;
- o cartão não inventa qualquer imagem/símbolo quando não existe URL válida;
- corrigida uma referência residual a `goalsLabel()` em `competicoes.html` que já não tinha a função definida, causando `goalsLabel is not defined`;
- mantida a apresentação de minuto + jogador junto à equipa marcadora;
- JavaScript funcional de Home e Competições voltou a compilar sem erros;
- Home: commit `b6c356e38c94448149d6a0954e360149d03354a0`; deployment `69921b9f-8310-4027-9e0e-42de7dfd83e0` SUCCESS;
- Competições: commit `303d5d9311eb22add31150cc18d8a7a58a330e90`; deployment `5a1e629a-a3c0-4182-8dfe-56a9fbf86e66` SUCCESS.

## 2026-10-02 — CORREÇÃO DOS GOLOS LIVE + SEM BOLAS ARTIFICIAIS (segunda correção)

A utilizadora voltou a confirmar que os golos continuavam sem aparecer com **minuto + jogador por baixo da equipa marcadora**, tanto na Home como em **Jogo em destaque** e **Jogos e resultados**. Foi feita auditoria ao frontend e ao Pages Worker antes de alterar qualquer infraestrutura.

### Causa identificada
- O frontend já tinha os elementos para mostrar os golos, mas as atualizações LIVE incrementais (patchFixtureRow e patchHighlight) atualizavam marcador/minuto e não atualizavam os blocos de detalhes dos golos.
- O normalizador do Pages Worker aceitava event.goals apenas como array bruto e não normalizava de forma consistente variantes BSD de equipa, jogador e minuto.
- No merge LIVE, uma resposta de incidentes sem golos podia substituir os golos já existentes do evento por [].
- Em Competições ainda existia fallback ⚽ dentro de teamVisual, incluindo no erro de carregamento da imagem. Esse fallback foi removido completamente.

### Correção aplicada
- _worker.js: criada normalização robusta de golos para dados de evento e incidentes BSD, incluindo team_id/team.id/home|away, player_name/player.name/scorer, minute, added_time e period_second.
- _worker.js: quando os incidentes LIVE não devolvem golos, preserva os golos já existentes no evento em vez de os apagar.
- competicoes.html: atualização incremental dos cartões passa agora também os detalhes dos golos por equipa, sem exigir render completo.
- competicoes.html: destaque LIVE atualiza também minuto + jogador por baixo da equipa marcadora.
- competicoes.html: eliminado o fallback visual de bola de futebol; imagem inexistente/partida deixa simplesmente de mostrar símbolo inventado.
- index.html: reforçado o tratamento de qualquer Matchday/Round N residual para Jornada N no cartão LIVE da Home.

### Infraestrutura preservada
- Não foi alterado o Worker separado cpc-football-cron, nem o cron */5 * * * *.
- Não foi alterado D1, cache, BSD API key, adapter estrutural ou filtros.
- A alteração do backend foi no Pages Worker _worker.js, que é o caminho que normaliza/enriquece os dados para /api/competicoes.

### Commits / produção
- Home: 83c25201b54848cf8201067f9fac46caee1305cf — deployment 541c3cdb-9c61-4bde-97bb-60c469f15813 SUCCESS.
- Competições: 839409bd3e504e89b7dab84fbc219fdab40b37f8 — deployment 588e93e4-f2d6-4dde-a06e-4a946859631d SUCCESS.
- Pages Worker/backend: 9803db686f75d57e45dff782b8c70b3d2ea64d6e — deployment 59490b0a-b540-4431-ad8a-ed6963526e0e SUCCESS, alias https://chutapracanto.com.
- O último deployment da produção contém os três commits porque o branch main avançou sequencialmente.

### Validação / pendente
- Os três deployments estão SUCCESS e o último está associado ao domínio de produção.
- A validação visual definitiva deve ser feita no próximo LIVE real com pelo menos um golo, porque não se deve fabricar um jogo para testar a apresentação.
- Regra mantida: **minuto + jogador aparecem por baixo da equipa que marcou**; minuto do jogo permanece dentro de **LIVE · N'**.


## 2026-10-02 — SEGUNDA CORREÇÃO: JORNADA NO LIVE + GOLOS POR EQUIPA EM TODAS AS VISTAS
- A causa do Matchday persistente foi encontrada: a regex no cartão Home tinha escape duplicado dentro do literal JavaScript e não correspondia ao espaço de Matchday 3. Corrigido para regex funcional e acrescentado suporte a Round N.
- Home LIVE: reforçado o fallback de roundLabel/round/roundKey e tradução para Jornada N.
- Home LIVE: os golos agora aceitam também variantes BSD de team_id, team.id, side, player_name, player.name, scorer, minute/min e tempos adicionais.
- Competições: a função de detalhe do golo passa a resolver equipa por ID ou por lado (home/away) e jogador por todas as variantes relevantes.
- Competições: mantida a atualização incremental dos detalhes dos golos em Jogos e resultados e Jogo em destaque.
- Validação sintática: scripts funcionais de Home e Competições OK; sem bolas artificiais em nenhum dos dois ficheiros.
- Produção: Home 7fc26630-7a3e-427a-beca-cf0fc1db2c28 SUCCESS; Competições 250cb04c-3f76-49be-84eb-34db35941f3b SUCCESS; último deploy 250cb04c com alias de produção.
- Próximo teste obrigatório: LIVE real com pelo menos um golo, verificando Home, Jogo em destaque e Jogos e resultados simultaneamente.


# 67. LIVE — CORREÇÃO REAL DA ORIGEM DOS GOLOS — 2026-10-02

## 67.1 Causa raiz confirmada
A documentação pública da BSD mostra que os incidentes de golo usam, entre outros campos, `type: "goal"`, `minute`, `player_name` e `is_home`. A normalização anterior aceitava minuto/jogador, mas não convertia `is_home` para a equipa do golo.

Resultado: o frontend recebia o golo sem `teamId`; como os cartões filtram os golos pela equipa da casa/fora, o minuto e marcador não apareciam debaixo da equipa correta.

## 67.2 Correção aplicada
- `_worker.js`: `cpcNormalizeGoal()` passa a interpretar `is_home/isHome` e a atribuir `homeId/awayId`.
- `_worker.js`: jogador deixa de poder transformar objectos inesperadamente em `[object Object]`; são priorizados `player_name`, `player.name`, `scorer_name` e `scorer.name`.
- Não foi alterado o cron `cpc-football-cron`, D1, cache ou BSD como fonte.
- Commit Worker: `1bb93007f2086254813725312d1c300e4e96c9e5`.

## 67.3 Home — nome da competição restaurado
O cartão LIVE da Home passa a apresentar também o nome da competição, seguido dos metadados de grupo e jornada quando existem:
`Competição · Liga/Grupo · Jornada N`.

A jornada continua traduzida para "Jornada N".

Commit Home: `7ce23dfe0fc04d0de75919b75a5e2b7fc5d85509`.

## 67.4 Produção
- Worker fix: deployment `02ded6ac-b515-4f09-9c09-55a45c982bb4`, SUCCESS, alias de produção `https://chutapracanto.com`.
- Home fix: deployment `2225f120-4e07-4714-a752-916ff2c9b8fd`, em clone/build/deploy no momento do registo; aguardar SUCCESS antes de considerar a alteração visual publicada.

## 67.5 Validação necessária
A causa dos golos está agora sustentada pelo formato BSD documentado, mas a prova final continua a ser um jogo LIVE real com pelo menos um golo. Quando existir:
1. Home LIVE — minuto + jogador sob a equipa que marcou;
2. Competições — Jogo em destaque — mesmo detalhe;
3. Competições — Jogos e resultados — mesmo detalhe;
4. atualização após novo golo sem recarregar a página.

Não inventar um golo de teste nem declarar validação visual final sem jogo real.


# 68. LIVE — RENDERIZAÇÃO EXPLÍCITA DE MINUTO + MARCADOR — 2026-10-02

Foi corrigida a camada final de apresentação que ainda podia impedir o nome do marcador de aparecer: o frontend já não dá prioridade a `goal.player`/`goal.scorer` quando estes são objectos; procura explicitamente os campos string `player_name`, `player.name`, `scorer_name` e `scorer.name`. O Worker aplica a mesma regra ao normalizar o incidente.

Requisito visual fechado: cada golo deve aparecer debaixo da equipa que marcou como **`minuto' Jogador`** (ex.: `67' João Silva`). A informação aplica-se à Home LIVE, ao Jogo em destaque e aos Jogos e resultados de Competições.

Commits: Worker `2c85ed60ad5d4ee3de759d66ba5a70ee587caadd`; Home `19022bf25c8bc7641e4781ac856a6f93309589dd`; Competições `fc42e5916155c62aa9eda19b1abf3d653d88261c`.

Ainda é necessária uma validação com golo LIVE real para confirmar a cadeia BSD → Worker → API → renderização em produção.


# 69. LIVE — GOLOS DESAPARECIAM NO REFRESH DA CACHE FRESCA — 2026-10-02

Diagnóstico confirmado a partir do comportamento observado: o golo chegou a aparecer brevemente em Competições e depois desaparecia. A causa não estava apenas no frontend nem no incidente BSD vazio. O endpoint `/api/competicoes`, quando encontrava a cache da competição ainda fresca, fazia um refresh LIVE de ~15s através de `bsdFetchLiveEvents()`, mas esse caminho não consultava `/events/{id}/incidents/`. Assim, o cron/cache podia conter `goals`, enquanto o refresh LIVE seguinte devolvia score/minuto sem os detalhes dos golos e o merge podia substituí-los.

Correção aplicada em `_worker.js`:
- o caminho de cache fresca passou também a consultar os incidentes BSD para cada jogo LIVE;
- normaliza `minute`, `player_name`/nome do jogador e equipa do golo nesse caminho;
- se os incidentes vierem temporariamente vazios, preserva os golos já existentes na fixture em cache;
- o mesmo comportamento foi aplicado aos jogos LIVE descobertos no refresh e não apenas aos já presentes na cache.

Commit Worker: `9a254a1376e1c2e1f3f75ffe69399bd9f8d79a15` — `fix: enrich fresh live cache with goal incidents`.

Produção: deployment `67caf14c-272a-4dec-9218-f691fc0d1dd3`, SUCCESS, alias de produção ativo.

Este é agora o ponto técnico principal a validar com um jogo LIVE real: Home, Jogo em destaque e Jogos e resultados devem manter `minuto' Jogador` durante os refreshes, inclusive quando a resposta de incidentes BSD estiver temporariamente vazia.


# 71. LIVE + COMPETIÇÕES — FECHO DA SEQUÊNCIA 2026-10-02

## 71.1 Golos LIVE — problema finalmente fechado
A utilizadora confirmou em produção que o minuto + nome do marcador voltou a aparecer corretamente. A causa do desaparecimento intermitente foi identificada e corrigida: durante o polling LIVE, o endpoint de incidentes BSD pode devolver temporariamente uma lista vazia. O adapter não deve interpretar essa resposta transitória como "não existem golos".

Correção final no Pages Worker:
- golos vindos de incidentes BSD continuam a ter prioridade;
- se os incidentes vierem vazios, são usados golos LIVE já normalizados quando existirem;
- se também não houver golos LIVE no payload atual, são preservados os golos já conhecidos no item em cache;
- cron, D1, BSD e arquitetura de cache não foram alterados.

Commit final desta correção: `f6fe6aa6c9e481a01a213cdb46ccedc170613a5b`.
Deployment: `ec150859-78b0-497a-a4d3-2a77d3219483`, SUCCESS, produção `https://chutapracanto.com`.

## 71.2 Apresentação fechada dos golos
Nas três superfícies LIVE:
- Home → JOGOS EM DIRETO;
- Competições → Jogo em destaque;
- Competições → Jogos e resultados;

o formato pretendido é:
`67' Nome do jogador`

diretamente por baixo da equipa que marcou.

Também ficam fechados:
- minuto dentro da etiqueta vermelha `LIVE · N'`;
- Jornada N em vez de Matchday/Round;
- sem siglas grandes de país;
- sem bola/ícone de futebol inventado;
- atualização incremental dos detalhes de golos durante o polling.

## 71.3 Jogo em destaque — comportamento definitivo
Em **Competições → Jogo em destaque**:
- sem LIVE: existe exatamente 1 jogo em destaque, o próximo jogo disponível dentro do âmbito selecionado;
- 1 LIVE: aparece apenas esse LIVE e não há setas;
- mais de 1 LIVE: todos os LIVE desse âmbito podem ser percorridos no destaque;
- as setas são duas, independentes: ← à esquerda e → à direita;
- as setas só existem quando há pelo menos 2 jogos LIVE;
- não usar uma seta única que pareça navegar para outra página.

### Nations League
- com **Todos + todos os grupos**, todos os LIVE da Nations entram no destaque, por ordem temporal;
- com um grupo selecionado, só os LIVE desse grupo entram no destaque;
- sem LIVE no âmbito selecionado, volta a existir apenas 1 jogo não-LIVE em destaque.

### Restantes competições
A mesma regra LIVE aplica-se ao âmbito selecionado, sem misturar jogos de outros grupos/fases.

## 71.4 Filtro Todos — histórico completo
Ao selecionar **Todos**:
- o filtro de jornada deve ser automaticamente colocado em **Todas as jornadas**;
- devem voltar a aparecer jogos passados, LIVE e futuros;
- não deve ficar selecionada implicitamente a jornada atual/futura;
- a ordenação de Jogos e resultados permanece cronológica, permitindo consultar também o histórico.

Correção adicional aplicada em `competicoes.html`:
- commit `005ee55036046c2cb0423ac8fce7efd89c70c899`;
- deployment `e8470ac8-4c8c-4b99-909c-ea7f13248c02`, SUCCESS.

A implementação anterior das setas LIVE já estava no commit `9288d7f54478d549e63d00f630251d85e6acfaf6`, deployment `e9dd1010-5cf3-4ca3-8425-92c415d6b305`, SUCCESS. O commit posterior garantiu o reset do filtro de jornada quando o modo Todos é escolhido.

## 71.5 Métricas — estado atual e o que NÃO reabrir
A frente de métricas deixou de ser backlog inicial. Já estão implementados em produção:
- likes;
- pageviews;
- Like rate;
- filtros 24h/7d/30d;
- analytics first-party;
- sessões técnicas;
- tempo ativo;
- páginas/saídas;
- scroll;
- origens/referrers/UTM;
- impressões e cliques de relacionadas;
- cliques relevantes da Home/Competições/Shorts;
- visualização agregada no Admin.

Não reimplementar analytics nem trocar por GA4/terceiros sem uma razão concreta. A sessão técnica não é utilizador único.

### Métricas ainda em standby/backlog controlado
- comparação origem → primeira notícia → segunda página → saída;
- distinção mais fina das entradas internas;
- aprofundamento de métricas específicas de Competições e Shorts;
- definição/validação de bounce baseada em sessão e interação significativa, apenas se a amostra justificar;
- medianas/buckets de tempo, se forem úteis;
- integração Search Console para queries/impressões, quando houver acesso/dados;
- visitantes únicos persistentes, apenas após revisão de privacidade e necessidade real.

### Outras frentes que permanecem em standby
- pesquisa inteligente de imagens baseada no teor da notícia;
- eventual importação de imagens externas para alojamento próprio, preservando licença/atribuição;
- redução de deployments duplicados, apenas com nova validação/rollback simples;
- automações de publicação/distribuição de vídeo, dependentes de OAuth, permissões, quotas e aprovações externas;
- performance apenas quando existir evidência/runtime suficiente;
- pesquisa global do site.

## 71.6 Regra de continuidade
Até 22/10/2026, continuar sem depender de Codex. Para novas alterações em Competições, primeiro ler esta secção e verificar o estado real de `competicoes.html`, `_worker.js` e produção. Não reabrir BSD/D1/cron para problemas que sejam apenas de filtro ou apresentação.


## 2026-10-02 — AUDITORIA DE MONETIZAÇÃO / PRIVACIDADE — ANALYTICS FIRST-PARTY

Foi encontrada uma discrepância documental concreta: `privacidade.html` ainda afirmava que não existia analytics próprio, mas o sistema `analytics.js` já estava implementado e em produção.

### Correção
- Atualizada `privacidade.html` para descrever o analytics first-party atualmente existente.
- Clarificado que a sessão usa `sessionStorage` e é um identificador técnico de sessão, não um identificador persistente nem uma contagem de pessoas únicas.
- Documentados, em termos gerais, os eventos atualmente recolhidos: pageviews, origem/referrer/UTM quando disponíveis, navegação entre páginas, tempo ativo, profundidade de scroll e algumas interações editoriais.
- Mantida a distinção entre o tracking first-party existente e o código técnico do AdSense, cuja presença não significa que anúncios estejam efetivamente a ser apresentados.
- Não foi introduzido GA4, terceiro adicional, cookie de rastreio ou alteração de D1.

### Evidência / implementação
- `analytics.js` confirma a utilização de `sessionStorage`, `sessionId`, attribution/referrer/UTM, page_view, page_exit, active_time, scroll_depth e eventos editoriais.
- Commit da correção: `e094f650071d7dd6639506d4e73008a343543189`.

### Regra de continuidade
Não alterar o sistema de analytics apenas para alinhar documentação. Se houver futura necessidade de visitantes únicos persistentes ou novos sinais de tracking, fazer revisão específica de privacidade antes da implementação.


## 2026-10-02 — MATRIZ INICIAL DE APIs DE VÍDEO — INVESTIGAÇÃO OFICIAL

Foi feita a verificação atual da documentação oficial disponível para o próximo candidato técnico de automação de distribuição.

### YouTube
- YouTube Data API suporta upload de vídeos através de OAuth 2.0.
- O fluxo oficial suporta upload resumable, adequado para ficheiros maiores e recuperação após interrupções.
- O upload permite definir metadata como título, descrição, tags, categoria e estado de privacidade.
- Fonte verificada: documentação oficial Google Developers.

### TikTok
- Content Posting API suporta **Direct Post** e **Upload para rascunho**.
- Direct Post requer o produto configurado, OAuth e scope `video.publish`; clientes não auditados ficam restringidos a conteúdo privado.
- Upload para rascunho usa `video.upload`; o utilizador continua o fluxo dentro do TikTok.
- `PULL_FROM_URL` é suportado quando o vídeo está num URL elegível/verificado.
- Há limites e quotas por utilizador/app que terão de ser respeitados.
- Fontes verificadas: documentação oficial TikTok for Developers, atualizada em agosto de 2026.

### Meta — Facebook / Instagram
- A matriz não foi considerada fechada neste ciclo porque a documentação oficial relevante não ficou acessível de forma verificável através do ambiente disponível.
- Não inferir permissões, scopes, quotas ou capacidade de publicação a partir de documentação antiga ou memória.
- Não implementar OAuth/Graph API Meta até a matriz atual ser confirmada.

### Decisão
Não criar ainda o MVP de upload único. A próxima etapa técnica da frente de vídeo é fechar a matriz Meta com documentação oficial atual e, depois, definir o fluxo mínimo:
**upload único → armazenamento/preparação → publicação ou rascunho por plataforma → estado/retry independente**.


# 72. REGRESSÃO APÓS ALTERAÇÃO DE COMPETIÇÕES — 2026-10-02

A utilizadora reportou imediatamente após a alteração do comportamento de **Jogo em destaque / Todos**:
- Competições ficava em carregamento indefinido;
- Home continuava a mostrar LIVE, mas o minuto aparecia como `0'`.

## Causa confirmada

A regressão de carregamento estava em `competicoes.html`, no commit `005ee55036046c2cb0423ac8fce7efd89c70c899`.

O patch tinha introduzido literalmente as sequências `\\n` dentro de uma linha de comentário JavaScript, em vez de inserir quebras de linha reais. Isso engolia o bloco `if/else` seguinte e deixava a estrutura JavaScript inválida. Como consequência, o script da página de Competições não inicializava.

## Correção

Commit:
`cae4c34b13089c981bb4de80e4bbe982d12a2220`

- substituídas as sequências literais `\\n` por quebras de linha reais;
- restaurado o bloco completo de `renderRounds()`;
- mantida a regra de **Todos → Todas as jornadas**;
- não foram alterados Worker, BSD, D1 ou cron para resolver esta regressão.

## Minuto LIVE = 0'

Também foi corrigida a apresentação do minuto nas duas superfícies:
- `competicoes.html`;
- `index.html`.

Agora um valor LIVE de minuto ausente, inválido ou `<= 0` não é apresentado como `0'`. O indicador LIVE continua presente e o minuto volta a aparecer assim que existir um valor positivo válido.

Commit adicional:
`0b0d0d132478567803e8f06e692baff4011e181f`

## Validação

Cloudflare Pages:
- deployment `bd12a4c6-c485-41da-966d-40815272bc45`;
- commit `0b0d0d132478567803e8f06e692baff4011e181f`;
- build SUCCESS;
- deploy SUCCESS;
- alias de produção `https://chutapracanto.com` ativo.

O build/deploy confirma que a página voltou a ser publicável; a validação funcional visual através de browser externo não está disponível neste ambiente, pelo que não se deve declarar uma validação visual completa.

## Regra de continuidade

Não reabrir a arquitetura de futebol para esta regressão. A falha foi frontend/JavaScript e está corrigida diretamente no ficheiro afetado.


# 73. COMPETIÇÕES — SETAS LATERAIS, HISTÓRICO NATIONS E FINAL DE JOGO — 2026-10-02

## Pedido e implementação
- Jogo em destaque: as setas deixaram de ser setas de texto soltas e passaram a botões laterais discretos, alinhados verticalmente ao centro das laterais do cartão, com símbolos de chevron esquerdo/direito.
- As setas continuam a aparecer apenas quando existem 2 ou mais jogos LIVE aplicáveis ao destaque.
- Quando não existe LIVE, continua a existir apenas um jogo em destaque.
- Quando um LIVE termina durante a sessão, o jogo que estava em destaque é preservado no cartão e o texto central deixa de mostrar minutos, passando a mostrar **Final de jogo**.
- Corrigido o filtro de jornadas: a seleção de uma jornada já não é ignorada especificamente para a Nations League. Com **Todos** + **Todos os grupos** + **Todas as jornadas**, a Nations League usa o snapshot completo da época e pode mostrar jogos passados, LIVE e futuros, tal como as restantes competições.

## Commit
- `a870d450fe7f28ecaaa7eb79b97f0140e26d9faa`
- Ficheiro: `competicoes.html`

## Limites preservados
- Não houve alteração ao BSD, D1, cron ou arquitetura de cache.
- Não foram introduzidas datas/rounds hardcoded para resolver o problema.
- A lógica de grupos da Nations League continua baseada na normalização existente.

## Validação de código
- Confirmada a construção de pedidos `status=all` quando o filtro é Todos.
- Confirmado que o frontend deixa de forçar a Nations League a ignorar o round selecionado.
- Confirmado que o destaque mantém um jogo acabado quando esse jogo era o LIVE atualmente apresentado e passa a mostrar `Final de jogo`.
- Confirmado que os botões laterais permanecem condicionados a múltiplos LIVE.
- Validação visual/runtime no browser continua dependente de ambiente com acesso funcional ao site; deployment/build devem ser verificados após a publicação.


# 74. COMPETIÇÕES — SETAS, FOCO AO VIVO, FINAL DE JOGO E CACHE NATIONS — 2026-10-02

- Setas do destaque refinadas visualmente para chevrons `‹ ›`, mantendo a posição lateral e centrada.
- O estado `AO VIVO` junto ao cabeçalho da competição passou a ser clicável e leva diretamente ao primeiro jogo que está LIVE nesse momento, filtrando temporariamente a lista para os jogos LIVE.
- O destaque deixa de considerar um jogo acabado como candidato imediatamente após o fim; não fica artificialmente no destaque. O estado de `Resultado final` fica reservado à atualização/visualização do jogo terminado.
- Criada memória de transição de LIVE → terminado para permitir a apresentação temporária de `LIVE` durante até 15 minutos onde o snapshot terminado ainda estiver presente, sem voltar a colocá-lo no destaque.
- Nations League: cache identity passou de `v6-nations` para `v7-nations`, forçando a renovação do snapshot completo da época e evitando reutilizar o snapshot anterior que estava a devolver apenas a janela atual. O pedido `status=all` continua baseado no intervalo completo da época fornecido pelo BSD.

Commits:
- frontend: `87f8956db181391f4b9ca7bd3b3c71e816731518`
- Worker/cache Nations: `46c8ca12e85d5724aa349eb76edac25280f9e983`

# 75. COMPETIÇÕES + HOME — PRIORIDADE DE LIGAS, NATIONS A4, FOCO LIVE E REGRESSÃO HOME LIVE — 2026-10-02

## Pedido e correções
- Competições passa a ordenar as abas pela proximidade do próximo jogo envolvendo clubes/equipa prioritários, com desempate pela prioridade Porto → Sporting → Benfica → Portugal. A liga que fica em primeiro passa a ser a liga aberta por defeito quando a página é aberta sem competição explícita na URL.
- Nations League passa a abrir por defeito em Liga A · Grupo A4, o grupo de Portugal, tanto em Competições como na classificação da Home. Um grupo explicitamente indicado na URL continua a ser respeitado.
- O clique numa aba de competição Nations League também passa a iniciar em A4.
- O botão AO VIVO da competição passou a ser visualmente uma pílula vermelha como o estado LIVE e só fica clicável quando existe pelo menos um LIVE. ONLINE permanece visual e não interativo.
- Ao clicar em AO VIVO, todos os filtros de grupo/jornada são ultrapassados: o âmbito passa temporariamente a todos os jogos LIVE da competição e a página desloca-se para o primeiro jogo LIVE.
- Home: os cartões JOGOS EM DIRETO deixaram de ser bloqueados pelo return da secção de próximos jogos prioritários. A atualização LIVE é agora iniciada mesmo quando não existem próximos jogos prioritários no período de 30 dias.
- Home: as abas de classificações usam a mesma ordenação de competições baseada nos próximos jogos prioritários da área Competições.
- Home: quando a classificação é a Nations League, a primeira visualização mostra A4 em vez de todos os grupos.

## Implementação
- competicoes.html: defaults A4, carregamento da primeira competição ordenada, foco LIVE que ignora filtros, estado ONLINE desativado e estilo restaurado para LIVE.
- index.html: ordenação das classificações alinhada com a prioridade de competições, Nations A4 por defeito e correção do fluxo que impedia refreshHomeLive(true) de arrancar.

## Commits
- Competições: cc94108067aebbbd78c9e098c4cbe2c3d5c7c707
- Home: 0812408e0df43a0c1ed810449807f25af60b4add

## Validação
- Cloudflare Pages criou deployments de produção para ambos os commits; o deployment Home a4577f93-1366-409f-99fb-36506abea8f6 estava em build no momento do registo. O deployment de Competições 321f1664-caf3-4f73-8c0c-4c48dc8db080 concluiu build e deploy com sucesso e mantém o alias de produção.
- Validação visual completa em browser externo continua dependente de acesso funcional ao site; não declarar validação visual final sem essa evidência.

### Correção adicional do ciclo 75
- Verificou-se que a ordenação podia mudar o conteúdo aberto sem atualizar visualmente a aba ativa. Corrigido para sincronizar a aba ativa com a primeira competição ordenada antes do carregamento.
- Commit Competições: bbfa7b4f9e12a8b8ffd8f1c67b819800234c41c5.


# 76. REGRESSÃO LIVE HOME + CARREGAMENTO/ORDENAÇÃO COMPETIÇÕES — 2026-10-02

## Diagnóstico
- A Home estava a descobrir LIVE através de `status=upcoming`, apesar de o backend BSD ter um fluxo próprio `status=live`. A descoberta LIVE foi separada e passou a consultar `status=live`.
- A ordenação das competições dependia de sete pedidos `status=upcoming` em paralelo e podia ficar bloqueada/atrasada quando um pedido não respondia. A ordenação passou a consultar o snapshot `status=all`, com timeout individual de 8s, e considera jogos futuros/LIVE das equipas prioritárias.
- O carregamento normal de uma competição passou a usar o snapshot completo `all` para o filtro visual de Próximos, evitando depender de uma resposta upstream específica de upcoming.
- Nations League: o reconhecimento do grupo deixou de exigir que A4 estivesse no fim exato do texto; agora extrai A1–D4 de qualquer posição válida na designação. A classificação Home continua a abrir filtrada em A4.

## Commits
- Competições: `79740c633d722bc867290f4de1b9a43fd4e32f40`
- Home: `22e3aaad6cd714b72e5093d97b9c24e7d511a8bc`

## Validação técnica
- Estrutura de chavetas dos dois HTML: equilibrada.
- Confirmado no código: ordenação usa `status=all`; carregamento de competição usa snapshot `all`; Home LIVE usa `status=live`; Nations A4 usa extração robusta do grupo.
- Produção ainda depende da conclusão dos deployments Cloudflare destes dois commits; não considerar fechado antes de ambos concluírem com SUCCESS.

# 77. CORREÇÃO DO CARREGAMENTO INICIAL A4 — 2026-10-02

## Diagnóstico
- Ao abrir/selecionar uma competição, a interface mantinha o filtro visual `Próximos`, mas enviava ao backend `status=upcoming` no carregamento inicial.
- Isto contrariava a correção do ciclo 76, que passou a depender do snapshot completo `status=all` para filtrar os jogos no cliente e podia fazer a Nations League A4 aparecer como “Não há jogos para este filtro”.

## Correção
- A entrada normal nas competições passa a carregar sempre `status=all` e mantém `Próximos` apenas como filtro visual.
- A seleção de uma aba, a competição inicial e a entrada por URL passam a usar o mesmo fluxo.
- O filtro explícito `Resultados` continua a poder pedir apenas `finished`.
- O filtro `Próximos` deixa de depender da resposta upstream específica de `upcoming`.

## Commit e produção
- Competições: `672d223aac56ab7305c817f3cd196858fa86ceb3`
- Deployment Pages: `8e6a44ce-4401-44da-a348-fdb53de2d48c`
- Estado: SUCCESS em produção.

## Validação
- Confirmado no código que as entradas normais usam `loadCompetition(...,"all",...)`.
- O deployment correspondente ao commit concluiu com sucesso.
- Não foi declarada validação visual externa, por a resolução/acesso direto ao domínio não estar disponível neste ambiente.


# 78. CARREGAMENTO INICIAL DA COMPETIÇÃO ORDENADA — 2026-10-02

- Sintoma reportado: ao entrar diretamente na aba **Competições**, a seleção inicial da competição (incluindo o caso da Nations League A4) podia apresentar “Não há jogos para este filtro”, enquanto após outra interação os dados apareciam.
- Causa encontrada no frontend: a rotina `prepareCompetitionOrder()` só chamava `loadCompetition()` quando a competição escolhida pela ordenação era diferente da competição inicialmente definida. Se fossem iguais, a página podia ficar sem um carregamento efetivo dos dados.
- Correção: depois de concluir a ordenação, a competição escolhida passou a ser sempre definida e carregada explicitamente com `status=all`; para Nations League mantém-se A4 como grupo inicial.
- Não foram alterados Worker, BSD, D1 ou cron.
- Commit: `7ec5ab718e5b68975b6a6e94a520e016352de451` — `fix: garantir carregamento inicial da competicao ordenada`.
- Cloudflare Pages production deployment: `b42b6e68-a677-4c38-b655-0ba9dc6eea65` — **SUCCESS** em 2026-10-02 16:59:27 UTC.
- Validação final de comportamento visual em browser continua pendente por indisponibilidade de acesso direto ao domínio nesta sessão.


# 79. NATIONS LEAGUE A4 — CLASSIFICAÇÃO DOS JOGOS PELOS STANDINGS — 2026-10-02

- O problema persistiu após as correções de carregamento inicial: ao abrir Competições, A4 podia apresentar “Não há jogos para este filtro”, apesar de os jogos aparecerem após outra interação.
- Nova causa atacada: o filtro frontend dependia da inferência de grupo a partir do próprio fixture. O Worker normaliza o grupo também a partir da classificação (standings), mas o frontend não fazia esse cruzamento.
- Correção: nationsGroupName() passou a aceitar variantes de groupName e, quando necessário, procurar a equipa do fixture em allStandings para obter o grupo A-D1..D4 antes de recorrer à tabela local de equipas.
- Não foram alterados Worker, BSD, D1 ou cron.
- Commit: 8f1197a70ea5458797d250f09a92aa6db89da8b6 — fix: alinhar classificacao dos jogos Nations com standings.
- Cloudflare Pages production deployment: 874e3e16-eea1-46e9-b7b2-d197d1d825e1 — SUCCESS em 2026-10-02 17:01:36 UTC.
- Validação visual/comportamental direta no domínio continua pendente nesta sessão; o deploy foi confirmado pelo Cloudflare.


## 80. Correção do estado inicial Nations League → A4 (2026-10-02)
- Sintoma: ao entrar pela primeira vez em **Competições**, quando a ordenação inicial selecionava a UEFA Nations League e o grupo A4 por defeito, a lista mostrava "Não há jogos para este filtro."; após atualizar a página ou trocar de grupo, os jogos apareciam.
- Causa encontrada no frontend: `renderRounds(true)` escolhia a próxima jornada olhando para **todos os jogos da competição**, antes de aplicar o grupo A4. O filtro final exigia simultaneamente grupo A4 + essa jornada, podendo resultar em zero jogos. Ao trocar de grupo, a jornada era reiniciada para "Todas", mascarando o problema.
- Correção: a seleção automática da próxima jornada passa a limitar primeiro o universo ao grupo selecionado quando a competição é a Nations League agrupada. Assim, A4 determina também a jornada inicial, sem alterar dados BSD, Worker, D1 ou cron.
- Commit: `2b357c1018b26bad558139f3febdaed503b89d14` — `fix: alinhar jornada inicial com grupo Nations selecionado`.
- Deployment Pages production: `ebb5d2f0-c1f3-4b93-b374-6e74859b7e5a` — SUCCESS às 17:07:13 UTC.


## 81. Entrada em Competições + histórico no filtro Todos (2026-10-02)
- Sintoma: entrada em Competições podia esperar cerca de 2s porque a ordenação dos separadores fazia sete pedidos `status=all` antes de carregar a competição; e o filtro **Todos** podia receber um snapshot sem jogos terminados, não mostrando histórico/resultados.
- Correção frontend em `competicoes.html`: carregamento da competição atual inicia em paralelo com a ordenação dos separadores; só é feito novo carregamento se a ordenação escolher outra competição. Para `status=all`, se o snapshot não contiver nenhum jogo terminado, é feita recuperação explícita do endpoint `status=finished` e os jogos são fundidos pelo ID/chave do jogo.
- Não foram alterados Worker, BSD, D1 ou cron nesta correção.
- Commit: `5339e56670a48b9d1f97a082b489edd17ae76e03` — `fix: acelerar entrada e recuperar historico no filtro Todos`.
- Deployment Pages production: `3af0accd-5794-4fb3-aca3-65c9daeba144` — SUCCESS às 17:32:53 UTC.
- Pendente de validação visual pelo utilizador: confirmar que **Todos** mostra jogos anteriores com resultados e que a entrada em Competições ficou mais rápida.
- Nota: os cartões LIVE da Home continuam a ser uma questão separada e devem ser investigados sem mexer no fluxo BSD/D1 sem evidência.


# 82. HOME NATIONS A4 PRIMEIRO + HISTÓRICO COMPLETO DA NATIONS NO TODOS — 2026-10-02

- Feedback confirmado: os cartões **LIVE da Home voltaram a funcionar**; não foram alterados nesta correção.
- Home — classificação Nations League: o código estava a filtrar a classificação exclusivamente para A4. Correção: A4 continua a aparecer primeiro, mas todos os restantes grupos permanecem visíveis, ordenados depois de A4.
- Competições — Nations League: o snapshot `status=all` podia conter apenas a janela recente (a partir de jornadas posteriores), fazendo desaparecer as jornadas 1 e 2 do seletor e impedindo o histórico completo no filtro **Todos**.
- Evidência externa: a UEFA confirma que a fase de liga 2026/27 começou em 24/09 e inclui as jornadas 1 (24–26/09), 2 (27–29/09) e 3 (01–03/10), incluindo Portugal no Grupo A4. Isto confirma que as jornadas 1 e 2 devem existir nos dados apresentados pelo CPC. 
- Correção frontend: quando a competição é Nations League e o pedido é `status=all`, o frontend recupera também `status=finished` e funde os jogos por ID/chave, mesmo que o snapshot `all` já contenha alguns resultados. Isto garante que o histórico terminado das jornadas anteriores seja incorporado antes de construir o seletor de jornadas e a lista.
- Não foram alterados Worker, BSD, D1 ou cron nesta correção.
- Commits:
  - `247161ed98a89f293c54bf7cea0882ebd4429ac6` — `fix: ordenar grupos Nations com A4 primeiro`
  - `bf736b37165deb886026816398580409e38258a9` — `fix: recuperar historico completo Nations no Todos`
- Cloudflare Pages production deployments:
  - `f7951a62-c7b9-44e4-919b-562e44cdf07b` — SUCCESS às 17:37:33 UTC (Home).
  - `7094aaaf-db79-446d-822b-22aae3e2cc5d` — SUCCESS às 17:37:54 UTC (Competições).
- Validação de browser no domínio canónico continua pendente nesta sessão; deployments foram confirmados pelo Cloudflare.


# 83. REGRESSÃO NO CARREGAMENTO INICIAL DA COMPETIÇÃO — 2026-10-02

- Sintoma: ao entrar em **Competições**, o separador podia ficar selecionado em **Nations League** enquanto o conteúdo ainda era da **Liga Portugal**; clicar novamente em Nations corrigia.
- Causa: a otimização anterior iniciou em paralelo `loadCompetition(active)` com `active=liga-portugal`. Quando a ordenação posterior escolhia Nations League, o código alterava `active` para Nations mas, por erro lógico, considerava que a carga inicial já correspondia à competição selecionada. O conteúdo da carga da Liga Portugal acabava, portanto, por ser renderizado sob o separador Nations.
- Correção: guardar a competição efetivamente iniciada (`initialKey`) e, depois da ordenação, comparar `firstKey` com essa chave. Se a ordenação escolher outra competição, essa competição é carregada explicitamente antes de terminar a inicialização.
- Não foram alterados Worker, BSD, D1 ou cron.
- Commit: `c0ab3f5e984d7a3caecf2c9cbb9ce74ccac49c66` — `fix: sincronizar competicao inicial com dados carregados`.
- Cloudflare Pages production deployment: `5078bb88-cfc2-4f29-a09d-f92582b54765` — **SUCCESS** às 17:41:16 UTC.
- Cartões LIVE da Home: mantidos sem alterações; utilizador confirmou que estão a funcionar.


# 84. ELIMINAR FLASH DA LIGA PORTUGAL AO ABRIR COMPETIÇÕES — 2026-10-02

- Sintoma: ao abrir **Competições**, a Liga Portugal aparecia durante uma fração de segundo antes de a ordenação selecionar Nations League.
- Causa: a carga inicial da competição por defeito (`liga-portugal`) foi mantida em paralelo para acelerar a entrada. Essa carga podia começar a preencher a interface antes de a ordenação determinar a competição final.
- Correção: adicionada uma sequência de pedidos (`loadSequence`) para que apenas a resposta da carga atualmente válida possa atualizar a UI. A carga paralela antiga continua a poder ser aproveitada sem permitir que uma competição entretanto ultrapassada substitua a competição final.
- O título/logótipo da competição só são atualizados pela resposta válida, eliminando o flash visual da Liga Portugal durante a seleção inicial.
- Não foram alterados Worker, BSD, D1 ou cron.
- Commit: `2882f91cb458f556d65a404d0ecc5738a5df27d3` — `fix: evitar flash da competicao anterior no carregamento`.
- Cloudflare Pages production deployment: `4a633a6d-f4ea-4af2-b31b-eb1329927875` — **SUCCESS** às 17:43:27 UTC.
