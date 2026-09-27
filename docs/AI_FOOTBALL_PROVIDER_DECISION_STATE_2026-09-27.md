# Estado de decisão — API de dados de futebol e trabalho prioritário Framer

**Data:** 2026-09-27  
**Projeto:** Chuta Pra Canto  
**Repositório:** `chutapracanto/chutapracanto`  
**Estado:** redirecionamentos Framer → domínio oficial concluídos e validados; retoma da validação do fornecedor de dados de futebol pelo BSD.

## 1. O que ficou concluído na análise de fornecedores

Foi feita uma pesquisa ampla sobre APIs comerciais gratuitas, APIs públicas, wrappers/open source e datasets reutilizáveis para alimentar as sete competições prioritárias do CPC:

1. Liga Portugal / Primeira Liga
2. Taça de Portugal
3. Taça da Liga
4. UEFA Champions League
5. UEFA Europa League
6. UEFA Conference League
7. UEFA Nations League

### Candidato inicialmente testado: API-Football
- Declara cobertura das sete competições.
- Free: 100 requests/dia e 10/minuto.
- Disponibiliza seasons, fixtures, standings, teams, livescore, events e lineups.
- Foi criada infraestrutura diagnóstica temporária server-side e executada autenticação real.
- O `/status` respondeu HTTP 200 e confirmou autenticação; quota observada nesse momento: 100/dia e 10/minuto.
- O diagnóstico 2026/27 foi executado duas vezes por engano (7 chamadas por execução, 14 chamadas no total). **Não repetir.**
- Nas sete competições, as respostas HTTP foram 200 mas sem resultados; os erros sanitizados foram classificados como `subscription` ou `quota`.
- Foi feito um teste representativo adicional da Primeira Liga 2026/27: HTTP 200, mas `ok:false`, resultados 0 e erro sanitizado `quota`. O dashboard mostrava 99 requests/dia restantes nesse período.
- A evidência não permite afirmar a causa exata porque o endpoint sanitizado não expõe a mensagem original do fornecedor nem os headers de quota dessa chamada.
- **Conclusão:** API-Football não está aprovada para produção. A hipótese de Free suficiente para o CPC ficou sem validação e não deve consumir mais chamadas nesta fase.
- Os endpoints diagnósticos temporários já foram removidos do `_worker.js`.

### Outras opções pesquisadas

**Bzzoiro Sports Data (BSD)** — novo candidato prioritário para validação:
- Free anunciado como gratuito sem cartão e sem trial.
- 7.500 requests/dia, reset à meia-noite UTC.
- 60+ competições na oferta Free; páginas públicas mostram as competições portuguesas relevantes e Champions League, Europa League, Conference League e Nations League.
- REST v2 + MCP; scores, fixtures, lineups e stats; inclui dados adicionais como xG/forecasts/odds em determinadas áreas.
- Há evidência pública de dados 2026/27, incluindo Champions League.
- Licença BSD v4.0: permite uso/display dos dados em aplicações/sites próprios, mas proíbe redistribuição do raw data como dataset/feed/API independente e contém limitações e responsabilidades que devem ser revistas para o uso editorial/monetizável do CPC.
- O fornecedor declara que os dados podem ser compilados de fontes públicas, terceiros e cálculos próprios e não oferece garantia de exatidão/completude/timeliness.
- **Estado:** tecnicamente validado e compatível com o caso de uso CPC no gate específico da licença de dados. A validação autenticada e operacional já foi concluída; não repetir chamadas sem nova hipótese.

**football-data.org**
- Free maduro, 12 competições, 10/minuto.
- Bom candidato de fallback para dados básicos.
- Scores/schedules no Free têm atraso e não foi demonstrada cobertura Free simultânea das sete competições prioritárias.
- Exige atribuição visível.
- **Estado:** fallback, não aprovado como fornecedor único.

**Sportmonks**
- Cobertura ampla/live, mas produção começa em plano pago.
- **Estado:** fallback técnico, não solução Free principal.

**Sportradar**
- Cobertura ampla, mas sem modalidade Free de produção comparável.
- **Estado:** fora do caminho Free atual.

**ESPN public API**
- Ampla cobertura e sem autenticação em vários endpoints observados.
- API pública/não-oficial, sem contrato de limites estáveis comparável a uma API comercial.
- **Estado:** fallback experimental, não fornecedor principal.

**FotMob / SofaScore**
- Existem wrappers/open source e endpoints internos com live, detalhes, lineups e stats.
- São dependências não-oficiais e podem mudar sem compromisso de compatibilidade.
- **Estado:** contingência técnica, não fornecedor principal.

**TheSportsDB**
- Opção gratuita com cobertura ampla e limites do Free, mas com limitações e V2/premium para determinadas necessidades.
- **Estado:** reserva, não aprovado para as sete competições como fonte única.

**OpenFootball / football.db**
- Datasets públicos/open source úteis para histórico, seeds e fallback.
- Não substituem uma fonte live/2026-27 completa para o produto.
- **Estado:** complemento/fallback histórico.

**SoccerData / scrapers agregadores**
- Interessantes para pipeline próprio e investigação.
- Mais frágeis por dependência de sites, anti-bot e alterações de estrutura.
- **Estado:** investigação técnica, não fonte de produção neste momento.

**SportScore**
- Tecnicamente interessante, mas termos restringem uso comercial sem acordo.
- **Estado:** excluído para o objetivo atual do CPC.

**FootyStats**
- Free demasiado limitado para servir como fonte única das sete competições.
- **Estado:** excluído como solução principal.


## 2. Diagnóstico BSD 2026/27 — RESULTADO REAL

**Execução:** 27-09-2026, uma única execução autenticada server-side.  
**Requests consumidos:** 7.  
**Estado:** **PASS — cobertura de temporada confirmada nas 7 competições.**

Todos os sete endpoints de seasons responderam **HTTP 200 / ok:true**, sem erros de autenticação, quota ou endpoint. Foi identificada uma temporada 2026/27 válida em cada competição:

| Competição | League ID | Season ID | Estrutura confirmada |
|---|---:|---:|---|
| Liga Portugal Betclic | 2 | 1310 | regular-season: 306 jogos / 34 jornadas |
| Taça de Portugal | 92 | 1922 | rounds 1–3 publicados |
| Taça da Liga | 93 | 1941 | quarterfinals: 4 jogos |
| Champions League | 7 | 1112 | qualificação + playoff + league-phase: 144 jogos / 8 jornadas |
| Europa League | 8 | 1269 | qualificação + playoff + league-phase: 144 jogos / 8 jornadas |
| Conference League | 83 | 1606 | qualificação + playoff + league-phase: 108 jogos / 6 jornadas |
| Nations League | 64 | 1430 | group-stage: 156 jogos / 6 jornadas |

### Evidência e limites
- A validação usou autenticação real através da secret server-side BSD_API_KEY.
- Os IDs de liga assumidos foram aceites e devolveram temporadas 2026/27 válidas.
- A estrutura multi-stage necessária para competições UEFA foi confirmada.
- quota.limit e quota.remaining vieram null nas sete respostas. Isto significa apenas que a quota não foi observável nos headers capturados; não significa quota inexistente.
- A documentação oficial confirma autenticação por Authorization: Token e a API Football v2.

### Contagem de requests
- BSD antes dos diagnósticos: **0**
- BSD seasons diagnostic: **7**
- BSD operational diagnostic original: **3**
- BSD operational diagnostic corrigido: **2**
- BSD total consumido nesta validação até agora: **12**
- API-Football: **0 novos** nesta fase
- **Não repetir** o diagnóstico de seasons: já não acrescenta informação suficiente para justificar mais 7 requests.
- O próximo gate operacional foi reduzido de 3 para **2 requests**, porque a Champions League já demonstrou a filtragem por stage e não precisa de ser repetida.

### Gate operacional — correção de schema antes da execução final
O diagnóstico original devolveu:
- eventos Primeira Liga: HTTP 200 e 50 itens, mas date:null;
- standings Primeira Liga: HTTP 200, mas rowCount:0;
- Champions League: HTTP 200 e 50 itens, com stage:league-phase.

A documentação oficial BSD esclarece que:
- a lista de eventos usa resposta paginada results[] e o campo de data/horário do jogo é **event_date**; os filtros aceites incluem league_id, season_id e stage;
- standings usam **standings[]** numa tabela plana e **groups[]** para competições agrupadas;
- cada row de standings contém position, team_id, team_name, jogos e pontos. citeturn2view0turn4view0

Logo, os dois sinais problemáticos do diagnóstico original (date:null e rowCount:0) foram classificados como **falha do parser diagnóstico**, não como falha comprovada do fornecedor.

Foi corrigido o endpoint temporário /api/admin/football-provider-bsd-operational-diagnostic para:
1. extrair event_date e manter status/stage;
2. interpretar standings[] diretamente;
3. suportar groups[] quando aplicável;
4. executar apenas **2 chamadas**: Primeira Liga fixtures/results + Primeira Liga standings.

**Commit da correção:** 2913e3cc434ad13b29e31bed50118b096994b778.

**Execução final do diagnóstico corrigido:** concluída uma vez, com 2 requests. Primeira Liga fixtures/results: HTTP 200, 50 itens, com eventDate/status/stage/round/homeTeamId/awayTeamId preenchidos. Primeira Liga standings: HTTP 200, 18 linhas, com position/teamId/teamName/played/points preenchidos. error:null em ambos.

**Gate operacional: PASS.** Não repetir este diagnóstico nem fazer novas chamadas BSD sem uma nova hipótese que altere a decisão.

### Licença — gate em revisão final
A página oficial publica a licença BSD v4.0 com eficácia indicada para 1 de outubro de 2026. O texto diz que o acesso aos dados constitui aceitação da licença e dos Terms of Service gerais; não identifica qualquer assinatura ou clique separado. Como hoje é 27-09-2026, a v4.0 ainda não deve ser tratada como a versão já eficaz para os dados recolhidos hoje sem consultar a versão anterior. Proíbe revender, sublicenciar, espelhar ou redistribuir raw data, no todo ou em parte substancial, como dataset/feed/database/API independente. Derived Outputs podem ser publicados, vendidos e distribuídos desde que não permitam reconstruir parte substancial do raw data. Os media assets têm regime separado.

Para o CPC, isto é compatível com exibir dados de futebol dentro do próprio website, desde que não seja criado um produto/feed independente de redistribuição do raw data. A licença também atribui ao utilizador a responsabilidade por conformidade legal e direitos de terceiros.

**Conclusão atual:** o gate operacional passa e a revisão da licença publicada não encontrou uma proibição ao uso/display dos dados no próprio website. Não é necessária uma assinatura separada identificada no texto. Permanecem dois pontos documentais antes do fecho contratual absoluto: (1) rever os Terms of Service gerais, que a licença incorpora por referência; (2) confirmar a versão de licença aplicável aos dados recolhidos antes de 1-10-2026, porque a página atual apresenta a v4.0 como eficaz a partir dessa data.
## 3. Arquitetura que continua válida independentemente do fornecedor

A arquitetura-alvo mantém-se:

**UI → Pages runtime `_worker.js` → adapter interno CPC → provider → D1/cache → UI**

Regras:
- frontend nunca chama diretamente o fornecedor;
- token exclusivamente server-side;
- IDs internos CPC;
- cache e deduplicação;
- stale-if-error quando aplicável;
- respostas com `updatedAt`, `source` e `updateStatus`;
- fornecedor substituível sem reescrever a UI.

Não criar ainda o adapter definitivo nem bindings/cache de produção específicos de um fornecedor antes da aprovação.

## 3. Segurança / API-Football key

A secret de produção `API_FOOTBALL_KEY` foi configurada no Cloudflare Pages e nunca deve ser exposta em GitHub, frontend, chat ou ficheiros.

Como a key foi potencialmente exposta visualmente durante a utilização do API Tester, o plano é **continuar apenas o mínimo indispensável e depois gerar uma nova key e substituir a secret de produção**. Não voltar a usar o API Tester para novas chamadas.

## 4. Ponto exato onde a análise de APIs fica pausada

A próxima investigação de fornecedor deve começar pelo **Bzzoiro Sports Data (BSD)**.

Antes de qualquer aprovação:
1. criar/usar conta Free e obter token sem o enviar para o chat;
2. **CONCLUÍDO:** secret server-side `BSD_API_KEY` configurada em Production no Cloudflare Pages;
3. **CONCLUÍDO:** diagnóstico temporário server-side criado no `_worker.js`, com 7 chamadas (uma por competição), sem expor o token;
4. validar 2026/27 nas sete competições;
5. medir quota/headers/rate limit com o mínimo de requests;
6. validar pelo menos fixtures/resultados/standings e, se necessário, live/events de forma controlada;
7. verificar se os termos/licença permitem o uso editorial e potencialmente monetizado do CPC;
8. só depois decidir fornecedor e construir integração definitiva.

**Não consumir créditos do Codex com testes repetidos que não alterem a decisão.**

## 5. Trabalho concluído — Framer / redirecionamentos

Foi identificado um trabalho anterior que deve ser tratado antes de retomar as APIs:

### Objetivo
Sempre que existir um URL em:
- `chutapracanto.framer.website`

deve existir redirecionamento para:
- `chutapracanto.com`

E as páginas de notícias devem preservar o slug, isto é, uma URL do tipo:
- `https://chutapracanto.framer.website/<slug-da-notícia>`

deve redirecionar para:
- `https://chutapracanto.com/<slug-da-notícia>`

### Requisito operacional
O redirecionamento deve ser permanente (301) quando a configuração disponível no Framer o permitir e deve preservar o path/slug. O comportamento deve ser validado com pelo menos o domínio raiz e uma notícia real.

### Estado
- **CONCLUÍDO e VALIDADO.**
- O Framer foi configurado com redirect em todas as páginas para preservar path, query e hash até `chutapracanto.com`.
- O domínio raiz foi testado e redirecionou corretamente.
- Para as notícias antigas, o Cloudflare Worker passou a reconhecer o formato legado `/noticias/<slug>` e a redirecionar por 301 para `/noticia?slug=<slug-atual>`.
- Foi criado `content/framer-news-redirects.json` com 213 correspondências provenientes do inventário existente.
- Uma URL real antiga partilhada via Facebook foi testada ponta a ponta e abriu corretamente a notícia atual.
- Estado técnico registado no inventário `docs/framer/framer-url-redirect-inventory-2026-09-25.json`.
- Commits relevantes: mapa `4ec827a057fc906d695543f82e3d99825df54069`; Worker `382504c4b00431acd47d547c5be52d7298bee2e1`; estado `732ece9f10a4c23b57481ab1b8ee6d2def8580b4`.

### Fecho
Este trabalho está **ENCERRADO**. A configuração Framer + Cloudflare foi publicada e uma URL real antiga partilhada via Facebook foi validada ponta a ponta como PASS. Não reabrir sem nova evidência.

## 6. Ordem de execução atual

**CONCLUÍDO:** diagnóstico BSD 2026/27, 7 chamadas, cobertura 7/7 confirmada.

**CONCLUÍDO:** diagnóstico operacional corrigido, 2 chamadas, com fixtures/results e standings reais da Primeira Liga 2026/27 confirmados. A Champions League já tinha sido validada no diagnóstico anterior.

**CONCLUÍDO:** revisão documental da licença BSD publicada. O uso/display no próprio website é permitido; a redistribuição do raw data como feed/dataset/API independente é proibida; media assets têm regime separado. A v4.0 está indicada como eficaz em 1-10-2026 e declara que o acesso aos dados constitui aceitação, sem assinatura separada identificada. Falta apenas rever os Terms of Service gerais e fechar a questão da versão aplicável aos dados recolhidos antes de 1-10-2026.

**AGORA:** fechar os dois pontos documentais restantes (Terms of Service gerais + versão aplicável antes de 1-10-2026). Não é necessário consumir requests BSD para isso.

**CONCLUÍDO:** BSD fechado como fornecedor principal para o caso de uso CPC e adapter server-side inicial implementado no Worker. **PRÓXIMO:** validar deploy/sintaxe e, sem repetir diagnósticos de provider, integrar cache/D1, atualização agendada e UI de `/competicoes`.

## 7. Regra de continuidade

Nada do trabalho de APIs fica perdido: decisões, evidências, exclusões, requests consumidos e próximos gates ficam registados neste documento. Ao retomar, não repetir testes já executados sem nova hipótese ou evidência.


## 8. Implementação BSD — adapter inicial

**Commit:** `c300ca0e362516e15845a9af34bfb371b2a55bf0`

Foi implementado no `_worker.js` um adapter server-side provider-specific para BSD, com:
- mapa interno das sete competições prioritárias;
- descoberta da época ativa via endpoint de seasons, com cache de 6 horas;
- normalização de fixtures/results e standings para o modelo CPC;
- `updatedAt`, `source` e `updateStatus` nas respostas;
- cache de 60 s para eventos e 300 s para standings;
- token `BSD_API_KEY` exclusivamente server-side;
- endpoint de aplicação `/api/competicoes`, sem exposição da API key nem proxy genérico para a BSD.

A implementação não criou ainda D1, Cron Trigger ou UI. Essas são as próximas fases e devem ser validadas após o deploy.

## 9. Validação do deployment de produção — 27-09-2026

A implementação do adapter BSD e o routing de `/api/competicoes` estão presentes no `_worker.js` do deployment Production atualmente ativo, cujo commit é `deb5b5cb7819d9068ece9c06cbd27964a2ad757b`. O deployment `1bdb2431-ad10-49ff-be12-cf22a0de77df`, baseado no commit `23752a3926e6ab4fb39c54798b11c0f3ce667836`, foi entretanto substituído por deployments posteriores de `main`.

Cloudflare confirmou: `main` é a branch de produção; o deployment ativo `4f7e675f-1e39-470b-b4df-f03bf8dcd437` está em Production, com estado success e alias `chutapracanto.com`; o custom domain está Active e SSL enabled; o runtime é Pages Functions com catch-all `/*`.

A validação HTTP funcional de `/api/competicoes?competition=liga-portugal` permanece **BLOQUEADA POR LIMITAÇÃO DA SESSÃO DE REDE**, não por erro demonstrado da aplicação: browser devolveu `net::ERR_BLOCKED_BY_CLIENT` e terminal devolveu erro de ligação ao proxy local `127.0.0.1:9`. Não houve resposta HTTP e não houve consumo BSD nessas tentativas. Portanto, o endpoint ainda não deve ser marcado como PASS operacional em produção até existir uma sessão com saída HTTPS funcional.

**Regra de continuidade:** não repetir chamadas no ambiente bloqueado, não alterar o adapter e não consumir BSD adicionalmente. A próxima validação deve usar o deployment Production ativo ou `chutapracanto.com`, numa sessão com acesso HTTPS direto.


## 10. Runtime BSD em produção — diagnóstico bloqueado por falta de logs — 27-09-2026

O endpoint público `/api/competicoes?competition=liga-portugal` já foi executado numa sessão real e devolveu **HTTP 503** com a mensagem genérica de indisponibilidade. Isto confirma que o routing chega ao handler do adapter, mas não identifica a exceção interna.

A investigação no Cloudflare não encontrou histórico útil: Real-time Logs não têm histórico disponível antes de iniciar o stream; Observability não mostrou eventos no intervalo consultado; Log Explorer requer aquisição do produto de retenção/consulta de logs. Não houve consumo BSD nessa investigação.

**Nova ação executada:** foi criado no `main` o endpoint temporário protegido `/api/admin/football-provider-bsd-runtime-diagnostic`, commit `05ee82a36f7d03a492c828a8faac2aae0ed13ec1`. O endpoint faz exatamente **2 requests BSD**, ambos para Primeira Liga 2026/27 já validada anteriormente:
1. eventos: `league_id=2&season_id=1310&stage=regular-season`;
2. standings: `league_id=2&season_id=1310`.

O diagnóstico devolve apenas estado técnico sanitizado (HTTP status, validade JSON, chaves de topo e contagens), nunca a API key nem payload bruto. Está protegido por branch `main`, hostname CPC, POST, sessão de admin e Origin same-origin.

**Consumo BSD:** continua em **12 requests antes da execução deste novo endpoint**; o novo diagnóstico está criado mas **ainda não foi executado**. Não repetir os diagnósticos anteriores: este teste existe por uma hipótese nova — distinguir configuração/credencial/rede/resposta BSD em Production do restante adapter.

**Próximo passo imediato:** fazer **uma única execução** do endpoint temporário acima na sessão Admin autenticada e devolver apenas o JSON sanitizado. Depois interpretar e, conforme o resultado, corrigir o adapter/configuração ou passar temporariamente ao API-Football autorizado pela utilizadora para teste. O endpoint temporário deve ser removido após a investigação.



### Resultado do diagnóstico BSD runtime — 27-09-2026

Execução única do endpoint temporário `/api/admin/football-provider-bsd-runtime-diagnostic`: **PASS**.
- Production tem `BSD_API_KEY` configurada.
- Events BSD: HTTP 200, JSON válido, 50 resultados, 362 ms.
- Standings BSD: HTTP 200, JSON válido, 18 standings, 147 ms.
- Total deste diagnóstico: 2 requests.
- Consumo BSD acumulado passa de 12 para **14 requests**.

Conclusão: **não há evidência de problema de credencial, conectividade ou disponibilidade do BSD em Production**. O 503 do endpoint público está dentro da implementação `bsdFetchJson/bsdFootballAdapter` e deve ser isolado sem trocar de fornecedor.

Hipóteses técnicas prioritárias:
1. descoberta automática da season quando `seasonId` não é fornecido;
2. comportamento da Cache API `caches.default` / `cache.put` no runtime de Pages Functions;
3. outra diferença entre o fluxo do adapter e o probe direto.

Próximo teste mínimo: executar o endpoint público com `seasonId=1310`, evitando a descoberta automática da época. Se continuar 503, a próxima correção deve isolar/remover temporariamente a Cache API do adapter, porque os requests BSD diretos já estão comprovadamente funcionais.


### Correção do runtime BSD — 27-09-2026

O teste com `seasonId=1310` continuou a devolver HTTP 503, eliminando a hipótese de descoberta automática da época.

Inspeção do adapter identificou a diferença relevante entre o probe que passou e o fluxo público: `bsdFetchJson()` usava `caches.default.match()` e `cache.put()`. O probe direto não passa por essa camada. A implementação foi corrigida no commit `161f7ce17ae804f16135796bd579f8f30d8cd3a3`: `bsdFetchJson()` agora faz apenas fetch autenticado, valida HTTP e lê JSON; o cache de resposta raw BSD foi removido para eliminar a falha de runtime e evitar retenção/exposição desnecessária do raw data.

O cache da resposta normalizada do endpoint público permanece separado no handler.

**Próximo gate:** validar o deployment Production com `/api/competicoes?competition=liga-portugal&seasonId=1310`. Se PASS, remover o endpoint temporário de diagnóstico BSD e fechar a investigação runtime.


### Instrumentação cirúrgica do adapter — 27-09-2026

A validação externa confirmou HTTP 503 também no deployment `pages.dev`. Pesquisa oficial BSD/Cloudflare não encontrou incompatibilidade conhecida: a BSD documenta os endpoints e autenticação usados, e Cloudflare documenta `fetch()`/Promise e runtime como suportados.

Sem consumir chamadas BSD adicionais, o adapter foi instrumentado para classificar a etapa exata da exceção: `BSD_EVENTS`, `BSD_STANDINGS`, `NORMALIZE_EVENTS` ou `NORMALIZE_STANDINGS`. O endpoint 503 expõe temporariamente apenas o prefixo sanitizado `debugStage`, sem mensagem, URL ou credencial.

Commits:
- `ba8829a18ea856e66e5c6a13011f198ae05882f1`
- `99b0cdb57d04594d4ddfc0371dccfe0a66487ddd`

**Próximo gate:** uma única validação do endpoint público após o deployment. Usar `seasonId=1310`. Depois da identificação, remover imediatamente o `debugStage` e corrigir a causa.


### Isolamento BSD_EVENTS — 27-09-2026

O endpoint público respondeu `debugStage: BSD_EVENTS`. Os probes anteriores provaram que o mesmo endpoint BSD responde HTTP 200 e que o corpo pode ser lido com `response.text()` e `JSON.parse()`. A diferença restante no fluxo era o uso de `response.json()` dentro de `bsdFetchJson()`.

Sem novo diagnóstico BSD, o adapter foi alterado no commit `da9478109643d1b870b3a34124d195754863029c` para ler explicitamente `response.text()` e fazer `JSON.parse()`, mantendo a mesma autenticação, URL e timeout. O erro de parsing é agora classificado como `BSD_JSON_PARSE`.

**Próximo gate:** após deployment, uma única validação do endpoint público. Se PASS, remover instrumentação `debugStage`; se continuar `BSD_EVENTS`, investigar a próxima diferença sem repetir probes BSD.


### Diagnóstico do helper BSD — 28-09-2026

Foi criado o endpoint temporário protegido `/api/admin/football-provider-bsd-helper-diagnostic` no commit `452a5f778ca3b7c23ad90b17302ec6540995f79f`. Objetivo: testar **o próprio helper `bsdFetchJson()` usado pelo adapter**, sem duplicar a lógica de fetch do diagnóstico runtime. O endpoint usa a mesma chamada BSD de eventos Primeira Liga 2026/27 com `stage=regular-season`.

A deployment Cloudflare `95dae374-53ff-49b9-85f6-58b656090cc1` foi posteriormente confirmada pela própria página de Deployment Details como Production, status success, alias `chutapracanto.com`, e exatamente o commit `452a5f7`.

O teste já executado anteriormente nessa URL `95dae374.chutapracanto.pages.dev` devolveu HTTP 404 com `Endpoint não encontrado.`. **Não houve consumo BSD nessa execução.**

A confirmação posterior do Cloudflare cria uma discrepância que deve ser investigada: o deployment declara conter o commit que adiciona o endpoint, mas o runtime respondeu 404. Não repetir o teste neste momento nem enviar nova investigação ao Codex para localizar a deployment: a deployment já está documentalmente identificada. O próximo passo é inspecionar diretamente o routing do `_worker.js`/ordem dos handlers no commit `452a5f7` e determinar por que o endpoint não é alcançável em runtime.

**Consumo BSD permanece em 14 requests.** Nenhuma chamada BSD foi feita no teste 404.
