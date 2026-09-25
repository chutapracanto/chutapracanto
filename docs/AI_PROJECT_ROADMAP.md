# CHUTA PRA CANTO — ROADMAP OPERACIONAL DO PROJETO

Versão: 2026-09-25
Repo: `chutapracanto/chutapracanto`
Produção: `https://chutapracanto.com`

## 0. FUNÇÃO DESTE DOCUMENTO

Este ficheiro define **a ordem das grandes frentes do projeto**.

Não substitui:
- `.github/AI_PROJECT_RULES.md` — regras de execução;
- `.github/CODEX_RULES.md` — limites do Codex;
- `bíblia mestra Chuta Pra Canto.md` — identidade, arquitetura e contexto;
- `docs/AI_PROJECT_STATE_AND_HISTORY_2026-09-25.md` — histórico operacional, tentativas, falhas e decisões.

Este documento responde a uma pergunta diferente:

> **"Em que fase estamos, qual é a sequência global e o que precisa de estar resolvido antes de considerar uma fase avançada?"**

## 1. REGRA PRINCIPAL DO ROADMAP

A IA deve seguir a sequência abaixo **sem saltar de fase por entusiasmo, por uma ideia criativa ou por uma oportunidade secundária**.

Uma tarefa pedida pela utilizadora pode ser executada mesmo que pertença a outra frente, desde que seja claramente delimitada. Porém:

- executar uma tarefa criativa não muda a fase técnica;
- descobrir uma oportunidade de distribuição não muda a fase técnica;
- existir uma métrica interessante não cria automaticamente uma nova fase;
- uma fase só muda de estado quando os critérios de conclusão forem cumpridos;
- bloqueio de uma fase não autoriza abandonar o objetivo e saltar silenciosamente para outra;
- dependências externas devem ficar registadas no ledger.

### Regra de execução

Sempre que a fase atual tiver uma ação autónoma possível:

**inspecionar → executar → validar → corrigir → validar → atualizar documentação → continuar.**

Não responder apenas "o próximo passo é X" quando X estiver ao alcance da IA.

---

# 2. VISÃO GLOBAL

| Fase | Frente | Estado em 2026-09-25 |
|---|---|---|
| 0 | Continuidade, regras e memória operacional | **CONSOLIDADA** |
| 1 | Recuperação/consolidação do conteúdo histórico | **CONCLUÍDA — reconciliação de metadata dos 163 registos pós-22/08 validada** |
| 2 | Sistema editorial e publicação própria | **PARCIAL / CONSOLIDAR** |
| 3 | Dados de futebol e API de competições | **PENDENTE** |
| 4 | SEO técnico + indexação real | **PARCIAL / CONTINUAR APÓS BASE ESTÁVEL** |
| 5 | Performance mensurável | **PRIMEIRA PASSAGEM IMPLEMENTADA / VALIDAR RESIDUAL** |
| 6 | Monetização | **PENDENTE** |
| 7 | Distribuição e crescimento | **PENDENTE / FRENTE CRIATIVA SEPARADA** |
| 8 | Automação e escala | **PENDENTE** |

**Fase operacional atual:** **FASE 2 — consolidação do sistema editorial/publicação própria**, após conclusão da reconciliação de metadata dos 163 registos Framer e merge em produção.

---

# 3. FASE 0 — CONTINUIDADE, REGRAS E MEMÓRIA

## Objetivo
Permitir que qualquer IA continue o projeto sem depender da memória de uma conversa específica.

## Componentes
- `.github/AI_PROJECT_RULES.md`
- `.github/CODEX_RULES.md`
- `bíblia mestra Chuta Pra Canto.md`
- `docs/AI_PROJECT_STATE_AND_HISTORY_2026-09-25.md`
- este Roadmap
- Bíblias 1 e 2 como arquivo histórico

## Critério de conclusão
A hierarquia documental está definida, o estado real do GitHub prevalece e a IA sabe:
1. onde procurar a verdade;
2. como executar;
3. como registar o que aconteceu;
4. qual é a fase atual.

**Estado: CONSOLIDADA.**

---

# 4. FASE 1 — RECUPERAÇÃO E CONSOLIDAÇÃO DO CONTEÚDO HISTÓRICO

## Objetivo
Garantir que o conteúdo histórico que deve pertencer ao Chuta Pra Canto está efetivamente recuperado no sistema atual.

## Situação factual
A importação de 24/09 validou um lote específico de:
- 213 URLs únicas encontradas;
- 179 importadas;
- 34 duplicadas/ignoradas;
- 0 falhas.

Esse resultado **não significa** que todo o conteúdo publicado no Framer posteriormente tenha sido migrado.

Está registada uma lacuna posterior a 22/08/2026.

## Trabalho obrigatório
1. Identificar a fonte histórica real do conteúdo posterior do Framer.
2. Obter inventário real.
3. Comparar inventário com `content/noticias`.
4. Comparar com `content/noticias-index.json`.
5. Separar:
   - existente;
   - ausente;
   - duplicado;
   - impossível de recuperar;
   - conteúdo cuja origem/data não pode ser provada.
6. Importar apenas conteúdo efetivamente identificado e validado.
7. Regenerar e validar índice/sitemap.
8. Validar Admin e produção.
9. Atualizar ledger.

## Proibições nesta fase
- importação por inferência;
- inventar artigos;
- inventar datas/autores/imagens;
- declarar migração total concluída sem reconciliação;
- saltar para uma nova fase apenas porque a fonte histórica está bloqueada.

## Estado
**CONCLUÍDA quanto à reconciliação de metadata do lote pós-22/08.**

Resultado: 163/163 reconciliados; 0 mismatches/0 ausências no índice; conteúdo editorial não alterado; PR #27 mergeada em main (73da0ac1d692a05a3138983e938454fc4be1c5c5); workflow canónico de índice/sitemap validado após o merge.

A migração/encerramento do domínio histórico Framer continua como etapa futura separada e só deve ser executada depois de inventário de URLs, mapeamento e validação de redirects.

Bloqueio atual:
A fonte histórica foi disponibilizada via export CMS em `docs/framer/framer-news-export-2026-09-25.json`.

A reconciliação dos 163 registos pós-22/08 está agora em execução; só depois será feita qualquer importação.

---

# 5. FASE 2 — SISTEMA EDITORIAL E PUBLICAÇÃO PRÓPRIA

## Objetivo
Garantir que, depois da recuperação histórica, o CPC consegue publicar e manter conteúdo sem depender do Framer.

## Abrange
- Admin;
- criar notícia;
- criar crónica/opinião;
- editar;
- imagens;
- autores;
- tipos;
- categorias;
- ordenação;
- pesquisa;
- filtros;
- índice;
- sitemap;
- publicação no GitHub;
- deploy;
- partilha social;
- prevenção de páginas vazias;
- confirmação de que a operação do Admin realmente persiste no GitHub.

## Critério de conclusão
Uma publicação nova deve poder percorrer o fluxo completo:

**Admin → GitHub → índice → sitemap quando aplicável → Cloudflare → produção**

sem intervenção manual desnecessária e com validação.

---

# 6. FASE 3 — DADOS DE FUTEBOL E API DE COMPETIÇÕES

## Objetivo
Transformar dados de competições, jogos e classificações numa camada estruturada do site.

Esta fase **é parte oficial do projeto** e não deve ser esquecida ou substituída por conteúdo criativo.

## Base arquitetural já definida
Ver:
`docs/arquitetura-futura-competicoes.md`

A arquitetura prevê:
- competição;
- época;
- participantes;
- classificações;
- fixtures;
- resultados;
- eventos;
- identificadores internos estáveis;
- datas armazenadas em UTC;
- apresentação no fuso local;
- camada server-side no Worker/Pages;
- adaptador de fornecedor;
- cache;
- deduplicação;
- rate limits;
- stale-if-error;
- atualização automática por Cron Trigger.

## Competições inicialmente previstas
- Liga Portugal;
- Taça de Portugal;
- Taça da Liga;
- Champions League;
- Europa League;
- Conference League;
- Nations League.

## Regra de fornecedor
Antes de implementar:
1. pesquisar fontes/API atuais;
2. verificar cobertura;
3. verificar limites;
4. verificar licença/termos;
5. verificar estabilidade;
6. verificar custo;
7. priorizar opção gratuita sem custo obrigatório;
8. só depois escolher arquitetura concreta.

Não assumir fornecedor ou preço a partir de memória antiga.

## Critério de conclusão
Existir uma fonte escolhida e validada e uma implementação server-side que alimente a área de competições sem expor credenciais no frontend.

---

# 7. FASE 4 — SEO TÉCNICO E INDEXAÇÃO REAL

## Objetivo
Garantir que o site é tecnicamente rastreável e medir a indexação real.

## Já existe como base
- canonical;
- OG/Twitter;
- JSON-LD;
- NewsArticle;
- Article;
- BreadcrumbList;
- robots;
- sitemap;
- domínio `.com`;
- distinção News/Opinion.

## Trabalho
- Search Console;
- sitemap enviado/verificado;
- cobertura;
- indexação;
- páginas excluídas;
- erros;
- problemas de canonical;
- Google News/Publisher Center quando fizer sentido;
- labels e classificação editorial corretas.

## Regra
**SEO implementado não é sinónimo de indexação comprovada.**

Nunca afirmar indexação real sem evidência do Search Console ou outra fonte apropriada.

---

# 8. FASE 5 — PERFORMANCE MENSURÁVEL

## Objetivo
Melhorar velocidade apenas quando houver evidência suficiente para justificar uma alteração.

## Princípio
**problema → evidência → hipótese → alteração mínima → validação → decisão**

## Estado conhecido
A primeira passagem de performance foi reaplicada na PR #26 e esta foi mergeada em 25/09.

A PR #25 original foi fechada sem merge.

A primeira passagem inclui, entre outros:
- fontes não bloqueantes;
- Font Awesome não bloqueante;
- prioridade de imagens;
- otimização de logos;
- shell inicial de artigo no Worker.

## Não fazer
- reabrir #25;
- repetir experiências invalidadas;
- alterar LCP/CLS sem hipótese nova;
- usar uma medição Lighthouse inválida como prova;
- fazer refactor de performance sem objetivo mensurável.

## Critério de conclusão
A baseline relevante está medida, alterações têm causalidade suficiente e não existem regressões significativas.

---

# 9. FASE 6 — MONETIZAÇÃO

## Objetivo
Transformar audiência e tráfego em receita sem prejudicar o produto editorial.

## Frentes
- AdSense;
- afiliados quando houver encaixe real;
- publicidade;
- parcerias;
- oportunidades de monetização das plataformas sociais;
- paid partnerships/patrocínios.

## Regra
Não confundir:
- preparação técnica;
- candidatura;
- aprovação;
- receita efetiva.

Cada estado deve ser tratado separadamente.

---

# 10. FASE 7 — DISTRIBUIÇÃO E CRESCIMENTO

## Objetivo
Aumentar alcance e reutilização do conteúdo.

## Inclui
- Facebook;
- Instagram;
- TikTok;
- YouTube;
- Shorts;
- Reels;
- podcast;
- cortes;
- distribuição cruzada;
- reaproveitamento editorial.

## Regra fundamental
Esta é uma **frente criativa/distribuição**, não uma alteração automática da fase técnica do site.

Se a utilizadora pedir:
- um vídeo;
- um Reel;
- um Short;
- uma thumbnail;
- um design Canva;
- um corte de podcast;

a IA pode executar essa tarefa.

Mas isso **não altera a fase atual do Roadmap**.

---

# 11. FASE 8 — AUTOMAÇÃO E ESCALA

## Objetivo
Reduzir progressivamente o trabalho manual da Rute e transformar o CPC numa operação editorial eficiente.

## Exemplos
- atualização automática de dados de futebol;
- geração/atualização de páginas;
- validações automáticas;
- distribuição;
- reutilização de conteúdos;
- workflows editoriais;
- integrações Canva quando úteis;
- automações entre sistemas quando tecnicamente possíveis;
- alertas apenas quando houver intervenção humana necessária.

## Princípio
Automatizar primeiro o que:
1. acontece repetidamente;
2. consome tempo;
3. é previsível;
4. pode ser validado automaticamente;
5. não introduz risco editorial desnecessário.

---

# 12. CANVA E TRABALHO CRIATIVO — LANE SEPARADA

O Canva pode ser usado nesta conta quando a utilizadora pedir ou quando a tarefa fizer parte explicitamente da produção criativa do CPC.

Isto não cria uma nova fase técnica.

A IA deve separar mentalmente:

### Lane A — Projeto técnico
Site, GitHub, Cloudflare, Admin, dados, API, SEO, performance, monetização técnica, automação.

### Lane B — Produção criativa
Canva, vídeos, Shorts, Reels, thumbnails, podcast, clips e materiais sociais.

As duas lanes podem ser executadas na mesma conta, mas **não devem contaminar o estado do Roadmap**.

---

# 13. REGRAS DE PRIORIDADE ENTRE FASES

Quando houver várias coisas possíveis, usar esta ordem:

1. dependência/bloqueio que impede uma fase atual;
2. correção de regressão ou risco real;
3. conclusão da fase atual;
4. preparação da próxima fase;
5. manutenção/automação;
6. tarefas criativas/distribuição pedidas pela utilizadora;
7. melhorias futuras sem impacto imediato.

Não usar esta ordem para impedir uma tarefa criativa explicitamente pedida pela utilizadora. Usá-la apenas para decidir **qual é a próxima frente autónoma do projeto**.

---

# 14. GATE DE MUDANÇA DE FASE

Só mudar o estado de uma fase quando:
- o objetivo estiver definido;
- as tarefas críticas estiverem executadas;
- a validação relevante existir;
- regressões óbvias forem verificadas;
- documentação/ledger estiverem atualizados;
- não existir uma dependência interna esquecida.

Se uma fase estiver bloqueada por dependência externa:
- marcar BLOQUEADA;
- documentar exatamente a dependência;
- executar trabalho autónomo que não dependa dela apenas se isso estiver claramente separado e não mascarar a prioridade;
- não declarar a fase concluída.

---

# 15. ATUALIZAÇÃO AUTOMÁTICA DO ROADMAP

Sempre que houver:
- conclusão de tarefa relevante;
- bloqueio;
- desbloqueio;
- nova decisão arquitetural;
- alteração de prioridade;
- mudança de fase;
- conclusão de uma validação que altere o estado;

a IA deve atualizar este ficheiro no mesmo ciclo em que atualiza o ledger.

A utilizadora não deve ter de pedir:
> "atualiza o roadmap".

---

# 16. RESUMO OPERACIONAL PARA QUALQUER IA

Antes de fazer trabalho no CPC:

1. Ler `.github/AI_PROJECT_RULES.md`.
2. Ler `.github/CODEX_RULES.md`.
3. Ler este Roadmap.
4. Ler o ledger quando a tarefa tocar em histórico, falhas, performance, migração ou decisões anteriores.
5. Ler a Bíblia Mestra quando for necessário contexto/arquitetura.
6. Confirmar o estado real do GitHub.
7. Identificar a fase atual.
8. Executar a ação autónoma disponível.
9. Validar.
10. Corrigir se necessário.
11. Atualizar documentação.
12. Só depois responder.

**Estado operacional neste momento: FASE 2 — SISTEMA EDITORIAL/PUBLICAÇÃO PRÓPRIA / UX DE NOTÍCIAS.**

FIM.


## PROTOCOLO DE CONTINUIDADE E DESBLOQUEIO — 2026-09-25

A Fase 0 inclui agora o protocolo obrigatório em `docs/AI_EXECUTION_PROTOCOL.md`.

A IA não deve confundir “fase bloqueada” com “trabalho terminado”. Um bloqueio externo deve ser convertido numa dependência operacional concreta: ação autónoma, intervenção da Rute ou tarefa do Codex. A ordem global do Roadmap mantém-se; o protocolo apenas garante que a continuação é explicitamente acionável quando uma fase fica bloqueada.


## 17. ATUALIZAÇÃO OPERACIONAL — 2026-09-25 — PÓS-RECONCILIAÇÃO FRAMER

A Fase 1 deixou de ser a frente operacional principal após a conclusão da reconciliação de metadata dos 163 registos Framer posteriores a 22/08/2026.

### Fechado
- 163/163 registos reconciliados;
- 0 mismatches e 0 ausências no índice para a população reconciliada;
- conteúdo editorial não reescrito;
- PR #27 mergeada em main (73da0ac1d692a05a3138983e938454fc4be1c5c5);
- workflow canónico de geração do índice/sitemap executado com sucesso após o merge;
- sitemap servido em produção verificado pela utilizadora como acessível/funcional.

### Próxima frente técnica
**FASE 2 — Sistema editorial e publicação própria / UX de Notícias.**

Backlog prioritário:
1. reset de pesquisa/filtros: “Todas” deve devolver claramente à listagem completa;
2. sticky header: desktop e mobile devem permanecer compactos/translúcidos no topo após encolher, sem desaparecer; tipografia sem quebra de linha durante a transição; no mobile, a navegação secundária deve subir;
3. ação de gosto/coração junto à partilha — pesquisar primeiro práticas atuais de sites/editoriais de futebol e evidência sobre engagement antes de implementar;
4. migração/redirects do antigo Framer para o .com: inventariar URLs reais e mapear cada origem para o destino equivalente; não assumir que os Redirects nativos do Framer resolvem cross-domain;
5. normalização de slugs/variantes no índice/sitemap, sem alterar URLs canónicas sem plano de compatibilidade.

### Ideias preservadas para fases futuras
- dados/API de futebol e competições (Fase 3);
- Search Console/indexação real (Fase 4);
- performance apenas com hipótese/evidência nova (Fase 5);
- monetização (Fase 6);
- distribuição/Shorts/Reels/YouTube/podcast (Fase 7);
- automação e escala (Fase 8).

### Explicitamente não reabrir sem nova evidência
- LCP/CLS e experiências de performance já validadas;
- importação histórica Framer já concluída;
- PRs fechadas sem merge;
- testes/abordagens que já falharam sem hipótese nova.

## 19. ATUALIZAÇÃO OPERACIONAL — 2026-09-25 — AÇÃO DE GOSTO/CORAÇÃO

A frente de UX editorial avançou após pesquisa de padrões de engagement em futebol/editorial.

- PR #33 mergeada em `main`: `eb76d46beda2a2b1bf762fec2a5776480e80dfca`.
- Reação de coração/gosto junto à partilha.
- Persistência local por artigo e eventos de analytics quando disponíveis.
- Sem backend/contador público nesta primeira versão.
- 0 PRs abertas após o merge.
- Produção ainda não foi validada por HTTP nesta sessão porque o domínio externo não está acessível ao ambiente atual.

**Estado:** FASE 2 — UX editorial em execução; validação externa de produção permanece pendente.

## 20. ATUALIZAÇÃO OPERACIONAL — 2026-09-25 — INVENTÁRIO DE SLUGS

Foi identificado um conjunto residual de **3 slugs/paths com caracteres zero-width** no conteúdo histórico. Não foram alterados nesta fase porque a correção exige compatibilidade de URLs e deve ser integrada no plano de normalização/redirects.

**Estado:** inventariado; não alterar URLs canónicas até existir estratégia de compatibilidade.

## 21. ATUALIZAÇÃO OPERACIONAL — 2026-09-25 — INVENTÁRIO FRAMER → .COM

O inventário de redirects históricos foi concluído em `docs/framer/framer-url-redirect-inventory-2026-09-25.json`.

- 213/213 origens com destino atual identificado.
- 179 por `sourceUrl`.
- 34 por slug.
- 0 duplicações de origem/destino.
- Nenhum redirect executado.

A documentação oficial do Framer confirma que redirects cross-domain/domain-level não são resolvidos pelo mecanismo normal de Redirects do projeto; essa parte depende do hosting provider do domínio antigo. Para `chutapracanto.framer.website`, a capacidade de controlar esse host histórico ainda não está disponível no ambiente atual.

**Estado:** inventário concluído; execução dos redirects aguarda confirmação de controlo do host/projeto histórico.



## 22. ATUALIZAÇÃO OPERACIONAL — 2026-09-25 — CLOUDFLARE / ENGAGEMENT / REORDENAÇÃO DA FASE 2

### Correção do estado Cloudflare
A referência histórica a um Worker separado chamado `chutapracanto` está desatualizada.

A Rute confirmou diretamente no Dashboard da Cloudflare que **esse Worker separado não existe atualmente**.

O que permanece ativo no repositório é o `_worker.js`, que deve ser tratado como parte da arquitetura Pages/runtime existente. Não criar nem ressuscitar um Worker separado para resolver a funcionalidade de likes.

### Fase 2 — nova frente prioritária
A ação de gosto/coração da PR #33 foi uma implementação transitória em `localStorage`. Não é considerada a arquitetura final porque não produz reação persistente nem contador público partilhado.

A próxima frente técnica é:

**ENGAGEMENT PERSISTENTE — coração/gosto real**

Arquitetura candidata:
```
artigo
  ↓
/api/article-like
  ↓
_pages runtime / _worker.js_
  ↓
Cloudflare D1
  ↓
estado persistente + contador
```

### Ordem obrigatória
1. Inspecionar Cloudflare real.
2. Confirmar runtime de `/api/*`.
3. Confirmar D1 existente/não existente.
4. Confirmar binding existente/não existente.
5. Confirmar plano e ausência de billing/upgrade obrigatório.
6. Só então definir schema mínimo e proteção anti-abuso.
7. Implementar endpoint persistente.
8. Substituir o localStorage da PR #33.
9. Validar persistência, idempotência, contagem e falhas.

### Supabase — gate arquitetural
Supabase não faz parte da implementação por defeito.

Só passa a ser considerado se uma análise concreta provar **ganho materialmente superior** em rentabilidade/automatização/escala e se a solução puder continuar sustentável sem depender de Pro, créditos pagos ou billing obrigatório.

Sem essa prova, **D1 é a opção de referência** por integração nativa com a stack Cloudflare existente.

### Limites gratuitos que entram no desenho
A documentação oficial Cloudflare atual indica D1 no Workers Free com 5M rows read/dia, 100k rows written/dia e 5 GB de storage; os limites diários são aplicados e, quando excedidos, as queries falham até ao reset. Portanto, a solução deve usar queries/indexes eficientes e evitar operações desnecessárias.

### O que NÃO é o próximo passo
- não investigar novamente o Framer;
- não implementar redirects agora;
- não criar Supabase;
- não criar outro Worker;
- não criar ainda tabelas/endpoint de likes;
- não abrir PR/merge nesta inspeção externa.

### Fases e ideias que permanecem depois da Fase 2
**Fase 3 — Dados/API de futebol:** competições, épocas, equipas, classificações, fixtures, resultados, eventos, fornecedor gratuito/estável, cache, rate limits, stale-if-error e atualização automática.

**Fase 4 — SEO/indexação real:** Search Console, sitemap enviado, cobertura, canonical, páginas excluídas, Google News/Publisher Center quando fizer sentido.

**Fase 5 — Performance:** apenas hipóteses comprovadas, baseline, LCP/CLS/INP, imagens, scripts, cache e rede; não reabrir experiências antigas sem nova evidência.

**Fase 6 — Monetização:** AdSense, afiliados, publicidade e parcerias; separar preparação técnica, aprovação e receita efetiva.

**Fase 7 — Distribuição/crescimento:** Facebook, Instagram, TikTok, YouTube, Shorts, Reels, podcast, cortes e distribuição cruzada; lane criativa separada da fase técnica.

**Fase 8 — Automação/escala:** publicação, validações, dados, distribuição, workflows, integrações e alertas; automatizar primeiro tarefas repetitivas, previsíveis e validáveis.

**Estado operacional:** FASE 2 continua ativa, mas a próxima operação técnica é a inspeção Cloudflare necessária para substituir o like local por engagement persistente.

## 23. ATUALIZAÇÃO OPERACIONAL — 2026-09-25 — AUDITORIA PR #34 / ENGAGEMENT PERSISTENTE

A PR #34 foi auditada antes de merge. A implementação foi funcionalmente validada no Preview pela execução externa anterior, mas a revisão do código encontrou duas correções necessárias: alinhamento visual exato do coração com a base do botão Partilhar e aceitação de slugs Unicode existentes no conteúdo histórico.

A solução foi reimplementada pelo Assistente a partir de `main` na branch `feat/article-likes-assistant-review`, mantendo o D1 já criado e sem criar Worker separado.

### Estado da frente
- D1 `cpc-article-likes`: preservado.
- Binding `ARTICLE_LIKES_DB`: configurado em `wrangler.toml`.
- Migration `0001_article_likes.sql`: presente.
- `/api/article-like`: persistente, idempotente e sem contador visível.
- UI: coração sem texto, com estados acessível/ativo/loading e mesma base visual do Partilhar.
- `main`: intacta; nenhum merge executado.

### Validação local do código
- Sintaxe do `_worker.js` validada.
- Sintaxe dos 3 scripts de `noticia.html` validada.
- Unicidade do schema e validação de slug verificadas por inspeção.

### Próxima etapa real
Validar o Preview da nova branch e confirmar o binding D1 efetivo no deployment. Essa validação externa é a única parte que pode justificar Codex; não usar Codex para editar GitHub.

**Estado:** FASE 2 — engagement persistente em implementação corrigida; aguardando validação externa da nova branch antes de fechar a frente.

