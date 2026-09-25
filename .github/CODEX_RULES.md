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


## REGRA PERMANENTE — CODEX APENAS QUANDO EXPRESSAMENTE ESSENCIAL — 2026-09-25

- O Codex deve ser usado **apenas quando a capacidade necessária estiver realmente indisponível ao Assistente** e a tarefa for essencial para desbloquear ou validar o trabalho.
- Não usar Codex para "bater no seguimento", repetir verificações já concluídas, confirmar novamente factos já comprovados, obter uma segunda confirmação sem nova hipótese, ou satisfazer uma preferência por validação adicional.
- Antes de preparar qualquer prompt, o Assistente deve perguntar internamente: **"Consigo fazer isto diretamente? Já temos evidência suficiente? Esta execução pode alterar a decisão?"** Se a resposta for "sim, consigo", "sim, já temos evidência suficiente" ou "não altera a decisão", não usar Codex.
- Uma tarefa externa que falhe, seja bloqueada ou termine sem resultado não justifica novas tentativas automáticas. Só repetir se surgir uma necessidade concreta nova que exija realmente a capacidade externa.
- O objetivo é **uso mínimo e essencial de créditos**, não validação redundante.
