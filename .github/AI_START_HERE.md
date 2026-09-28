# CHUTA PRA CANTO — AI START HERE

**LER ANTES DE QUALQUER TAREFA DO PROJETO.**

## Autoridade

1. **GitHub / produção** = verdade factual atual.
2. **`.github/AI_PROJECT_RULES.md`** = regras obrigatórias de execução.
3. **`.github/CODEX_RULES.md`** = limites e uso do Codex.
4. **`docs/AI_PROJECT_ROADMAP.md`** = ordem das fases e fase atual.
5. **`docs/AI_PROJECT_STATE_AND_HISTORY_2026-09-25.md`** = histórico, tentativas, falhas e decisões.
6. **`bíblia mestra Chuta Pra Canto.md`** = identidade, arquitetura e contexto consolidado.
7. Bíblias 1/2 e handoffs = arquivo histórico.

## Fase operacional atual

**FASE 4 — SEO técnico + indexação real.** A Fase 3 de dados de futebol/competições foi concluída e validada em produção para as 7 competições; não reabrir sem nova evidência.

A Fase 1 de reconciliação do conteúdo Framer posterior a 22/08/2026 foi concluída quanto à metadata: 163/163 reconciliados, 0 mismatches/0 ausências no índice e PR #27 mergeada em main.

O lote Framer validado em 24/09 foi:
- 213 URLs únicas;
- 179 importadas;
- 34 duplicadas/ignoradas;
- 0 falhas.

Isto NÃO prova que conteúdo Framer posterior a 22/08/2026 tenha sido migrado.

Não fazer importação por inferência.

## Próxima operação

Concluir a matriz de fornecedores para as sete competições prioritárias e escolher a fonte principal/adaptador antes de criar endpoints, secrets ou bindings.

## Não saltar de fase

Não transformar automaticamente uma oportunidade de:
- podcast;
- cortes;
- Shorts;
- Reels;
- Canva;
- distribuição;
- monetização;
- LCP/CLS

na "próxima fase" do projeto.

Estas tarefas podem ser executadas quando pedidas, mas não alteram automaticamente a fase técnica.

## Fase estrutural que não pode ser esquecida

Existe uma fase oficial para **dados/API de futebol e competições**.

A especificação está em:
`docs/arquitetura-futura-competicoes.md`

Inclui competições, épocas, equipas, classificações, fixtures, resultados, eventos, camada server-side, cache, rate limits e atualização automática.

## Regra de execução

Se houver ação autónoma:

**inspecionar → executar → validar → corrigir → validar → documentar → continuar.**

Nunca responder apenas "o próximo passo é X" quando X pode ser executado.

Se houver bloqueio real:
- identificar exatamente a dependência;
- registar no ledger;
- não inventar;
- não abandonar silenciosamente a linha;
- retomar assim que a dependência existir.

## Lanes

**Técnica:** GitHub, Cloudflare, Admin, conteúdo/site, dados/API, SEO, performance, monetização técnica, automação.

**Criativa:** Canva, vídeos, Shorts, Reels, thumbnails, podcast, cortes e redes.

Podem coexistir na mesma conta, mas a lane criativa não altera o estado do Roadmap.

## Objetivo

Tornar o Chuta Pra Canto um sistema editorial de futebol sólido, recuperado, automatizado, indexável, monetizável e escalável, minimizando trabalho manual da utilizadora.

FIM.


## PROTOCOLO OBRIGATÓRIO DE EXECUÇÃO

Para autonomia, bloqueios, pedidos à utilizadora e utilização do Codex, ler também:
`docs/AI_EXECUTION_PROTOCOL.md`

Regra crítica: **UM BLOQUEIO NÃO É UM RESULTADO.** Se a IA não conseguir executar uma ação, deve identificar exatamente a dependência e transformar essa dependência em passos concretos para Rute ou num prompt executável para o Codex, quando aplicável. É proibido parar com formulações vagas como “fonte externa bloqueada”, “preciso de acesso” ou “próximo passo é X” sem explicar como desbloquear e o que deve regressar.


## Estado operacional 2026-09-28
- Fase 1: reconciliação de metadata dos 163 registos pós-22/08 concluída; o inventário/arquivo Framer de 213 URLs permanece separado e os redirects continuam dependentes do host histórico.
- Fase 2: frente UX/editorial encerrada operacionalmente com PR #42 mergeada; engagement persistente em D1 já está em `main`.
- Fase 3: concluída e validada em produção para as 7 competições; fornecedor BSD selecionado para produção.
- Fase 4: ativa — SEO técnico + indexação real; sitemap submetido ao Search Console e processamento externo pendente.
- Próxima ação autónoma: acompanhar/validar Search Console e corrigir apenas problemas de indexação/SEO comprovados.
- Fase 5 performance, Fase 6 monetização, Fase 7 distribuição e Fase 8 automação permanecem futuras.
