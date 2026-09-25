# CHUTA PRA CANTO — REGRAS DO CODEX

Versão: 2026-09-25

## Função
O Codex é executor complementar. O Assistente mantém responsabilidade integral pelo GitHub.

## Pode executar
- browser/Chrome real;
- DevTools Console/Network/Performance;
- Lighthouse/PageSpeed no ambiente externo;
- E2E/local dependente da máquina/sessão;
- Cloudflare Dashboard/CLI quando exigir sessão;
- outras capacidades que estejam realmente indisponíveis ao Assistente.

## Proibido sem instrução explícita e excecional da utilizadora
- editar ficheiros no GitHub;
- criar commits ou branches;
- push;
- abrir/alterar/fechar/mergear PRs;
- alterar main;
- corrigir código diretamente no repositório;
- fazer análises que o Assistente consegue fazer pelo GitHub;
- trabalho duplicado, refactors paralelos ou investigação fora do escopo;
- gastar créditos com planos ou relatórios longos quando basta evidência objetiva.

## Quando encontrar um bug de código
Não corrigir o GitHub. Devolver apenas:
1. URL/ambiente;
2. reprodução;
3. erro exato;
4. evidência;
5. área/ficheiro suspeito;
6. correção mínima recomendada.

O Assistente implementa a correção e valida no GitHub.

## Leitura obrigatória
Antes de executar qualquer tarefa:
1. ler .github/AI_PROJECT_RULES.md;
2. ler .github/CODEX_RULES.md;
3. respeitar as regras mais recentes;
4. executar apenas o escopo pedido.

## Economia
Usar a menor operação que responda à pergunta. Não repetir medições sem nova hipótese/evidência. Não fazer no Codex aquilo que o Assistente consegue fazer diretamente.

## Resposta
Curta, factual e com resultados verificáveis. Se a investigação externa revelar um problema de código, parar no limite do diagnóstico e devolver a evidência ao Assistente.

## Regra de continuidade

- Nunca assumir que uma tarefa ficou concluída apenas porque atingiu uma limitação.
- Se a tarefa pedida ao Codex for executável com as capacidades externas disponíveis, executar e validar nessa mesma sessão.
- Se encontrar um bloqueio que pertence ao Assistente (por exemplo, correção no GitHub), devolver imediatamente a evidência e a correção mínima recomendada, sem tentar substituir o trabalho do Assistente.
- Se o bloqueio exigir uma ação manual da utilizadora, identificar exatamente essa ação e o resultado esperado.
- Nunca devolver apenas "não consigo" ou um relatório inconclusivo quando ainda existir uma ação executável.
- A resposta deve sempre terminar com resultado verificável ou com o bloqueio externo exato e a ação concreta necessária.
FIM.


## REGRA PERMANENTE — EXECUÇÃO ENXUTA E CRITÉRIO DE PARAGEM — 2026-09-25

- O objetivo não é maximizar a quantidade de testes; é obter a evidência mínima suficiente para responder à pergunta técnica.
- Assim que a hipótese principal estiver comprovada e os critérios de aceitação estiverem satisfeitos, **parar**. Não continuar com regressões redundantes, relatórios extensos, novas medições sem nova hipótese ou navegação adicional.
- Priorizar nesta ordem: (1) reproduzir/confirmar o problema, (2) validar a correção específica, (3) executar apenas os regressões essenciais diretamente afetados, (4) terminar.
- Se uma verificação adicional for opcional e não puder alterar a decisão, não a executar.
- Se o pedido disser explicitamente para terminar após certos checks, respeitar esse limite.
- Para tarefas de validação, o resultado deve ser curto: check -> PASS/FAIL -> evidência essencial.
- Não permanecer numa tarefa apenas porque ainda existem possíveis testes. Depois de evidência suficiente, concluir imediatamente.


## REGRA PERMANENTE — USO EXCLUSIVAMENTE ESSENCIAL — 2026-09-25

- O Codex só deve executar tarefas que dependam realmente das suas capacidades externas e que sejam **essenciais** para a decisão ou desbloqueio do trabalho.
- Não repetir verificações já feitas, não "bater no seguimento", não fazer confirmações redundantes e não iniciar testes adicionais apenas porque existem testes possíveis.
- Se o resultado já permitir a decisão pedida, terminar imediatamente.
- Se uma tarefa falhar ou não puder ser executada, não insistir nem repetir automaticamente. Só voltar a executá-la se existir uma necessidade nova e concreta que exija a capacidade externa.
- Cada execução deve ter escopo mínimo, critério de conclusão claro e consumo mínimo de créditos.
