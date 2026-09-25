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
| 1 | Recuperação/consolidação do conteúdo histórico | **BLOQUEADA** |
| 2 | Sistema editorial e publicação própria | **PARCIAL / CONSOLIDAR** |
| 3 | Dados de futebol e API de competições | **PENDENTE** |
| 4 | SEO técnico + indexação real | **PARCIAL / CONTINUAR APÓS BASE ESTÁVEL** |
| 5 | Performance mensurável | **PRIMEIRA PASSAGEM IMPLEMENTADA / VALIDAR RESIDUAL** |
| 6 | Monetização | **PENDENTE** |
| 7 | Distribuição e crescimento | **PENDENTE / FRENTE CRIATIVA SEPARADA** |
| 8 | Automação e escala | **PENDENTE** |

**Fase operacional atual:** **FASE 1**, porque existe conteúdo histórico do Framer posterior a 22/08/2026 ainda não reconciliado.

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
**BLOQUEADA POR DEPENDÊNCIA EXTERNA REAL.**

Bloqueio atual:
> fonte histórica do Framer posterior a 22/08/2026 não está acessível no ambiente atual.

Quando a fonte existir, retomar esta fase diretamente.

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

**Estado operacional neste momento: FASE 1 BLOQUEADA pela fonte histórica posterior do Framer.**

FIM.
