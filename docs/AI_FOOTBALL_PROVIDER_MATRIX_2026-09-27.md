# Matriz de fornecedores de dados de futebol — Fase 3

**Data:** 2026-09-27  
**Estado:** BSD tecnicamente validado como fornecedor principal; integração de produção ainda não está aprovada operacionalmente.

## Competições-alvo
1. Liga Portugal
2. Taça de Portugal
3. Taça da Liga
4. UEFA Champions League
5. UEFA Europa League
6. UEFA Conference League
7. UEFA Nations League

## API-Football

A cobertura oficial analisada inclui as sete competições-alvo e o Free disponibiliza os endpoints necessários, mas a validação autenticada 2026/27 não produziu dados utilizáveis: as chamadas responderam HTTP 200 sem resultados e os erros sanitizados variaram entre `subscription` e `quota`. O diagnóstico foi executado duas vezes por engano, totalizando 14 chamadas, e não deve ser repetido nesta fase.

**Estado:** candidato de fallback/teste, **não aprovado para produção**. A limitação observada não permite concluir com segurança se é quota, cobertura da época ou outra restrição do plano Free.

## football-data.org

O Free inclui Primeira Liga e Champions League; a página de cobertura também lista Europa League, Conference League e Nations League entre as competições disponíveis, mas não há evidência suficiente para afirmar que as sete estão simultaneamente no Free. citeturn0search3turn1search0

O Free custa €0/mês, inclui 12 competições, fixtures, tabelas e scores/schedules com atraso, com 10 calls/minuto. Live scores estão no plano de €12/mês. citeturn0search1turn2search7

A API documenta competições, épocas, equipas, matches, standings e scorers. Exige atribuição visível e não permite guardar credenciais em repositórios open-source. citeturn2search0turn1search1turn1search2

**Conclusão:** fallback parcial, não candidato principal para as sete competições no Free.

## Sportmonks

A plataforma declara mais de 2.200 competições e cobertura de Taça de Portugal, Primeira Liga, Champions, Europa e Conference, com dados live. citeturn4search1turn4search12turn4search13

Existe acesso gratuito para teste, mas os planos de produção publicados começam em €29/mês para 5 ligas e 2.000 chamadas por entidade/hora; os planos pagos têm trial de 14 dias. citeturn4search2

**Conclusão:** fallback técnico forte, mas incompatível com o objetivo atual de não depender de uma assinatura paga para funcionar.

## Sportradar

A documentação pública confirma Soccer API v4, cobertura global e profundidade variável por competição/época. Não foi encontrada uma modalidade Free de produção comparável ao Free do API-Football. citeturn4search9turn4search15

**Conclusão:** fora da primeira linha enquanto custo mínimo/sustentabilidade Free forem requisitos.

## Matriz

| Critério | API-Football | football-data.org | Sportmonks | Sportradar |
|---|---|---|---|---|
| 7 competições cobertas | **Sim** | Free não comprovado | Cobertura ampla | Cobertura global |
| Primeira Liga | Sim | Free | Sim | Sim/tier |
| Taça Portugal | Sim | Free não comprovado | Sim | Não validada |
| Taça Liga | Sim | Free não comprovado | Não validada | Não validada |
| Champions | Sim | Free | Sim | Sim |
| Europa | Sim | Free não comprovado | Sim | Sim |
| Conference | Sim | Free não comprovado | Sim | Sim |
| Nations League | Sim | Free não comprovado | Não validada | Não validada |
| Fixtures/results | Sim | Sim | Sim | Sim |
| Standings | Sim | Sim | Sim | Sim |
| Events | Sim | Limitado para o objetivo | Sim | Sim |
| Live | Sim | Pago | Sim | Sim |
| Free produção | **100/dia** | Sim, delayed | Teste limitado | Não estabelecido |
| Rate limit Free | 10/min | 10/min | plano | tier |
| Token | Sim | Sim | Sim | Sim |
| Atribuição | Não identificada como requisito geral | **Obrigatória** | Não validada | Não validada |
| Fit CPC atual | **Candidato principal** | Fallback parcial | Fallback pago | Fora da 1.ª linha |

## Decisão atual

**Bzzoiro Sports Data (BSD) é o fornecedor principal tecnicamente validado para o CPC.**

A validação autenticada confirmou:
- temporadas 2026/27 nas sete competições prioritárias;
- estrutura multi-stage nas competições UEFA;
- fixtures/events e standings reais da Primeira Liga;
- credencial server-side funcional em Production;
- conectividade Production → BSD funcional.

A licença analisada permite display dos dados dentro do próprio website, mas proíbe redistribuição do raw data como feed/dataset/API independente. Permanecem pontos documentais sobre Terms of Service gerais e a versão da licença aplicável aos dados recolhidos antes de 1-10-2026.

**Importante:** isto não equivale ainda a PASS de produção do endpoint `/api/competicoes`. O adapter existe e está implementado, mas a chamada pública continua a devolver HTTP 503 na investigação atual. O próximo trabalho é corrigir a integração/routing do runtime sem repetir diagnósticos BSD já concluídos.

## Arquitetura obrigatória

UI → Pages runtime/_worker.js → adapter interno → provider → cache D1/Cloudflare → UI

- frontend nunca chama o fornecedor diretamente;
- IDs internos CPC separados dos IDs externos;
- token server-side;
- cache por competição/época/recurso;
- deduplicação;
- stale-if-error;
- respostas com updatedAt/source/updateStatus;
- troca de fornecedor sem reescrever a UI.

## Próxima operação

Obter uma API key gratuita do candidato principal e validar a disponibilidade real de 2026/27 e o consumo de quota nas sete competições. Só depois aprovar o adapter.


## Secret injection — estado atual

A credencial BSD está configurada como **Cloudflare Pages Secret `BSD_API_KEY` em Production**, exclusivamente server-side. O valor nunca foi colocado no GitHub, frontend ou chat.

A credencial API-Football permanece separada como `API_FOOTBALL_KEY`; não deve ser usada novamente sem hipótese explícita. Como houve risco de exposição durante testes anteriores, a rotação dessa chave continua recomendada depois de concluída a investigação indispensável.

## 2026-09-27 — modelo preliminar de consumo para o CPC

A documentação oficial do API-Football confirma que uma chamada de `/fixtures?league=...&season=...` pode devolver o calendário completo de uma competição/época; a própria API recomenda filtros por data/período/round quando só é necessária uma janela menor. Também confirma que uma chamada por `ids` pode agrupar até 20 fixtures e devolver detalhes embutidos como events, lineups, statistics e players. Isto significa que o custo não deve ser modelado como “1 request por jogo”. citeturn0search1turn0search3turn0search6

### Unidade mínima de atualização

Para o primeiro modelo CPC, considerar por competição/época:
- 1 request para fixtures/calendário de uma janela;
- 1 request para standings quando a competição tiver classificação;
- detalhes/events apenas para jogos que o produto realmente precise de acompanhar;
- metadata/coverage em frequência baixa e cacheada;
- resultados tratados como parte dos fixtures, evitando um endpoint separado quando a resposta já contém o necessário.

A documentação oficial mostra que fixtures, events e dados live têm uma cadência de atualização de 15 segundos no fornecedor. Isso **não significa** que o CPC deva fazer polling a cada 15 segundos; com 100 requests/dia, essa estratégia seria incompatível com o Free. citeturn0search6

### Cenários de quota — cálculo de arquitetura, não medição autenticada

Com 7 competições, se cada uma exigir 1 atualização de fixtures + 1 atualização de standings por dia, a base é aproximadamente:

`7 × 2 = 14 requests/dia`

Acrescentando 1 request diário de metadata/coordenação, cerca de **15/dia**.

Se fixtures forem atualizados 4 vezes/dia por competição e standings 1 vez/dia:

`7 × 4 + 7 + 1 = 36 requests/dia`

Se fixtures forem atualizados 12 vezes/dia por competição e standings 1 vez/dia:

`7 × 12 + 7 + 1 = 92 requests/dia`

O último cenário já deixa apenas **8 requests/dia de margem**, portanto não deve ser considerado uma aprovação confortável.

Estes números são **modelos de arquitetura**, não consumo medido. O consumo real ainda depende da cobertura 2026/27, do formato das respostas, das competições ativas em cada dia, da necessidade de events/live e da política final de cache.

### Consequência importante

O teste não deve perguntar apenas:

> “Consigo obter os dados das 7 competições?”

Deve responder:

> “Qual é o número mínimo e máximo plausível de requests/dia para manter as 7 competições atualizadas segundo a experiência que queremos oferecer ao utilizador?”

E deve separar três produtos possíveis:
1. **dados editoriais/cacheados** — atualização periódica, baixo consumo;
2. **resultados próximos do tempo real** — consumo maior, mas potencialmente controlável com janelas e cache;
3. **live/eventos em tempo real contínuo** — potencialmente incompatível com o Free se aplicado às 7 competições em simultâneo.

Não assumir que o terceiro cenário cabe nos 100/dia sem medição.

### Critério quantitativo de aprovação

A API-Football só passa o gate se a política escolhida:
- ficar abaixo de 100 requests/dia;
- mantiver margem operacional suficiente para retries/falhas/picos;
- respeitar 10 requests/minuto;
- não depender de polling contínuo agressivo;
- continuar funcional com cache/stale-if-error;
- atravessar os diferentes tipos de dia da época sem intervenção manual.

A margem exata será definida depois da medição autenticada; **não será considerado suficiente ficar simplesmente em 99/100**.

### Evidência externa ainda necessária

A única lacuna que não pode ser fechada sem credencial é a validação autenticada da época **2026/27** e a medição dos headers/quota reais para as sete competições. A API-Football exige API key válida para os testes de endpoints descritos na documentação. citeturn0search1turn0search4

**Estado após esta análise:** modelo preliminar de consumo definido; API-Football continua **não aprovada**. Próximo gate: chave configurada diretamente no Cloudflare Pages Secret → testes autenticados → medição → decisão.
