# CHUTA PRA CANTO — REGRAS DO CODEX

Versão: 2026-09-25
Repo: chutapracanto/chutapracanto

## 1. FUNÇÃO DO CODEX

O Codex é executor complementar, não executor por defeito.

O Assistente mantém a responsabilidade integral pelo GitHub e por tudo o que conseguir executar diretamente. O Codex só deve consumir créditos quando existir uma capacidade real indisponível ao Assistente.

## 2. O QUE O CODEX PODE FAZER

Usar Codex principalmente para:
- browser real / Chrome;
- DevTools Console, Network e Performance;
- Lighthouse/PageSpeed executados no ambiente disponível ao Codex;
- testes E2E ou execução local dependente do computador/sessão da utilizadora;
- Cloudflare Dashboard/CLI quando exigir sessão local;
- credenciais, cookies, sessões ou ambientes locais indisponíveis ao Assistente;
- outras operações externas concretamente impossíveis no ambiente do Assistente.

## 3. PROIBIÇÕES

NÃO fazer, salvo instrução explícita e excecional da utilizadora:
- editar ficheiros no GitHub;
- criar commits ou branches;
- fazer push;
- abrir, alterar, fechar ou mergear PRs;
- alterar a main;
- corrigir código diretamente no repositório;
- alterar HTML/CSS/JS/JSON/Markdown/workflows/documentação que o Assistente consiga editar;
- duplicar uma análise que já possa ser feita pelo Assistente;
- transformar um diagnóstico externo numa refatoração não solicitada;
- fazer melhorias paralelas fora do escopo;
- gastar créditos a explicar ao utilizador como executar algo que o próprio Codex consegue executar;
- gastar créditos em planos, relatórios longos ou reanálises sem nova evidência;
- assumir que um deploy bem-sucedido significa que a UX está correta.

## 4. QUANDO ENCONTRAR UM BUG DE CÓDIGO

Se a investigação externa encontrar um problema no código:
1. não corrigir o GitHub;
2. identificar o erro exato;
3. indicar URL/ambiente e forma de reprodução;
4. fornecer evidência objetiva;
5. indicar ficheiro/área provável;
6. recomendar a correção mínima;
7. devolver resposta curta.

Depois disso, o Assistente implementa e valida a correção no GitHub.

## 5. ECONOMIA DE CRÉDITOS

Antes de executar:
- confirmar que a tarefa não pode ser feita pelo Assistente;
- escolher a menor operação que responda à pergunta;
- não repetir testes já suficientes;
- não investigar áreas não relacionadas;
- não fazer trabalho que o GitHub connector do Assistente consegue fazer.

## 6. LEITURA OBRIGATÓRIA

Antes de qualquer tarefa neste projeto:
1. ler `.github/AI_PROJECT_RULES.md`;
2. ler `.github/CODEX_RULES.md`;
3. confirmar o limite da tarefa;
4. executar apenas esse limite.

## 7. FORMATO DA RESPOSTA

Resposta curta e factual:
- o que foi executado;
- ambiente/URL/commit se relevante;
- resultado;
- erro/evidência se houver;
- correção recomendada se houver.

Não devolver relatórios longos quando um resultado objetivo basta.

## 8. REGRA DE CONTINUIDADE

Se a tarefa pedida for possível no ambiente do Codex, executar sem pedir à utilizadora para descobrir como fazer.

Se a tarefa exigir GitHub, não assumir essa responsabilidade: devolver a evidência ao Assistente.

Se a capacidade necessária não estiver disponível, indicar exatamente a limitação em vez de inventar um resultado.

## 9. ATUALIZAÇÃO

Este ficheiro é parte das regras operacionais do projeto. Sempre que surgir uma nova limitação, risco, desperdício de créditos, capacidade útil ou decisão específica sobre o Codex, o Assistente deve atualizar este ficheiro e o `.github/AI_PROJECT_RULES.md` no mesmo ciclo.

FIM.


## REGRA PERMANENTE — USO EXCLUSIVAMENTE ESSENCIAL — 2026-09-25

- O Codex só deve executar tarefas que dependam realmente das suas capacidades externas e que sejam **essenciais** para a decisão ou desbloqueio do trabalho.
- Não repetir verificações já feitas, não "bater no seguimento", não fazer confirmações redundantes e não iniciar testes adicionais apenas porque existem testes possíveis.
- Se o resultado já permitir a decisão pedida, terminar imediatamente.
- Se uma tarefa falhar ou não puder ser executada, não insistir nem repetir automaticamente. Só voltar a executá-la se existir uma necessidade nova e concreta que exija a capacidade externa.
- Cada execução deve ter escopo mínimo, critério de conclusão claro e consumo mínimo de créditos.


## REGISTO OPERACIONAL — 2026-09-25

- O histórico de experiências, validações, falhas e decisões do projeto está em `docs/AI_PROJECT_STATE_AND_HISTORY_2026-09-25.md`.
- Antes de executar uma tarefa externa, consultar esse registo quando a tarefa tocar em performance, testes anteriores, bugs conhecidos ou abordagens já tentadas.
- Não repetir experiências marcadas como falhadas sem uma hipótese técnica nova e concreta.


## REGRA PERMANENTE — SINCRONIZAÇÃO DOCUMENTAL APÓS USO DO CODEX — 2026-09-25

Quando o Codex for usado de forma legítima para uma validação ou tarefa externa e o resultado alterar o estado, evidência, decisão ou limitações conhecidas do projeto, o Assistente deve atualizar automaticamente o ledger e, quando aplicável, estas regras no mesmo ciclo.

A utilizadora não precisa de pedir essa atualização separadamente.

Não criar documentação apenas porque o Codex foi executado: só registar o que muda a continuidade ou uma decisão futura.


## 10. PROTOCOLO DE DELEGAÇÃO DO CODEX

Quando a IA não conseguir executar uma operação porque depende de browser/local/Cloudflare/sessão/credencial ou outra capacidade externa que o Codex possui, não deve simplesmente informar que “é preciso usar o Codex”. Deve fornecer um prompt executável com:
- repo/branch, quando aplicável;
- tarefa concreta;
- limites do que NÃO alterar;
- passos de investigação/execução necessários;
- validação obrigatória;
- resultado esperado;
- instrução para devolver evidência curta.

Se a tarefa não for do Codex, não o usar apenas para evitar trabalho que a IA consegue fazer.

Quando a operação exigir ação da Rute, o Assistente deve explicar à Rute exatamente os passos necessários e o recurso que deve devolver. O Codex não deve ser usado como substituto de uma ação que só a Rute pode executar.

## REGRA PERMANENTE — LIMITE DE TAMANHO DOS PROMPTS CODEX — 2026-09-25

- Todo prompt enviado à Rute para copiar para o Codex deve ser **curto e controlado por caracteres**.
- Limite operacional padrão: **máximo de 2.000 caracteres**, incluindo espaços.
- O objetivo é impedir que o prompt seja interpretado como conteúdo para criar um documento dentro do Codex.
- Não repetir contexto que já esteja nas Rules, ledger, roadmap ou GitHub: mandar o Codex ler a fonte de verdade.
- Incluir apenas: tarefa, limites essenciais, validação e resultado esperado.
- Se uma tarefa exigir mais contexto, **dividir em etapas/prompt(s) curtos**, em vez de enviar um prompt longo.
- Exceção só quando uma operação técnica exigir inevitavelmente conteúdo superior a este limite; nesse caso, o Assistente deve reduzir ao mínimo possível e explicar a necessidade.
- Esta regra prevalece sobre a preferência anterior por “poucas centenas de palavras”: o controlo principal passa a ser o número de caracteres.
