# Especificação futura: área de competições

**Estado:** arquitetura definida; BSD tecnicamente validado como fornecedor principal em 2026-09-27; adapter server-side inicial implementado. A integração pública `/api/competicoes` ainda está em correção/validação de runtime. Cache/D1, atualização agendada e UI de competições só avançam após PASS operacional.

## Modelo editorial e de dados

A entidade `competition` identifica uma competição estável, com nome, tipo (`league`, `cup` ou `international`), país/organização e formato de disputa. O formato é separado do tipo porque uma taça pode ter fases de grupos e eliminatórias.

Cada época é uma entidade `season` ligada por `competitionId`, com `providerSeasonId`, rótulo, datas de início/fim e estado. A época atual vem dos dados do fornecedor, nunca de um ano hardcoded.

A época tem coleções relacionadas:

- `participants`: equipas inscritas nessa época, com `providerTeamId`; participantes são descobertos por época, sem presumir presença permanente de Benfica, FC Porto, Sporting CP ou Portugal.
- `standings`: só para formatos com classificação; posição, jogos, vitórias, empates, derrotas, golos marcados/sofridos, diferença, pontos e forma.
- `fixtures`: próximos jogos e jogos em curso, com início, estado, equipas, jornada/fase e resultado parcial.
- `results`: jogos terminados, resultado final e fase.
- `events`: acontecimentos do jogo, incluindo golos, autor, minuto e equipa.

Um identificador interno estável deve ser separado do nome apresentado e dos identificadores do fornecedor. Datas e horas guardam-se em UTC e apresentam-se no fuso local.

## Interface futura

A rota pública será `/competicoes`, com páginas ou estado navegável por competição e época. A interface consulta o formato e os dados disponíveis para decidir entre tabela/classificação, calendário de eliminatórias ou ambos. Taças com grupos e eliminatórias podem mostrar as duas vistas.

Lista inicial prevista: Liga Portugal, Taça de Portugal, Taça da Liga, UEFA Champions League, UEFA Europa League, UEFA Conference League e UEFA Nations League. Clubes e seleções acompanhados editorialmente são escolhidos entre os participantes que a época efetivamente devolver.

## Integração e atualização

O frontend nunca chama diretamente o fornecedor com credenciais. Uma camada server-side no runtime Cloudflare Pages/Worker normaliza dados através de um adaptador de fornecedor; um Cron Trigger atualiza as competições e épocas ativas, com cache por competição/época/recurso, limite de chamadas, deduplicação e política de stale-if-error.

As respostas devem incluir `updatedAt`, origem dos dados e estado de atualização. A camada guarda o token apenas como secret server-side quando um fornecedor for escolhido e aprovado. Fornecedor, preço e limites ficam em aberto; esta especificação não cria bindings, secrets, endpoints nem chamadas API.


## Estado de seleção de fornecedor — 2026-09-27

A primeira matriz documental está em `docs/AI_FOOTBALL_PROVIDER_MATRIX_2026-09-27.md`.

O fornecedor principal **tecnicamente validado** é o Bzzoiro Sports Data (BSD). A validação autenticada confirmou as sete competições prioritárias em 2026/27 e fixtures/results + standings da Primeira Liga. A secret `BSD_API_KEY` permanece exclusivamente server-side.

O adapter é a única camada dependente do fornecedor. A implementação inicial descobre a época ativa com cache, normaliza fixtures/results e standings e expõe apenas o endpoint de aplicação `/api/competicoes`, sem encaminhar a API BSD diretamente para o frontend.

A arquitetura continua provider-agnostic e o adapter deve ser a única camada dependente do fornecedor.


## Auditoria de estado — 2026-09-28

A arquitetura base está coerente com a implementação atual: frontend → Pages runtime → adapter BSD → fornecedor. A investigação de runtime, contudo, encontrou uma falha no caminho público `/api/competicoes`: o fornecedor e a credencial funcionam diretamente em Production, mas o adapter falha em `BSD_EVENTS`.

Correções já testadas sem resolver o problema:
- remoção da Cache API raw do `bsdFetchJson()`;
- leitura explícita por `response.text()` + `JSON.parse()`;
- eliminação da hipótese de season discovery através de `seasonId=1310`;
- probes diretos Production → BSD com HTTP 200.

O helper criado para testar o próprio `bsdFetchJson()` está no commit `452a5f7`, deployment Production `95dae374`; a chamada feita anteriormente nessa deployment respondeu 404. Este 404 deve ser tratado como problema de routing/condição do endpoint temporário, não como falha do BSD.

**Não considerar ainda a integração de produção como PASS.** Cache/D1, Cron e UI de competições permanecem bloqueados por dependência interna: primeiro obter uma resposta válida do endpoint público e remover os diagnósticos temporários.

