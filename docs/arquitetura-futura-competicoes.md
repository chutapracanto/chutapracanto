# Especificação futura: área de competições

**Estado:** desenho técnico; sem implementação, fornecedor ou custo aprovado.

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
