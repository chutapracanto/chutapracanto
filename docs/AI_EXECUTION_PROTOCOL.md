# CHUTA PRA CANTO — PROTOCOLO DE EXECUÇÃO, BLOQUEIOS E CONTINUIDADE

Versão: 2026-09-25

## 1. OBJETIVO

Este documento define o comportamento operacional obrigatório para qualquer IA que trabalhe no projeto.

O objetivo é eliminar dois padrões:
- “identificar o próximo passo e parar”;
- “detetar um bloqueio, registá-lo e continuar com trabalho secundário sem transformar o bloqueio numa ação concreta”.

**UM BLOQUEIO NÃO É UM RESULTADO.**

Quando a IA não consegue executar diretamente o próximo passo, deve transformar a dependência numa instrução operacional para a utilizadora ou numa tarefa explícita para o Codex, sempre que isso for possível.

## 2. CICLO NORMAL

Para cada objetivo:

**inspecionar → analisar → executar → validar → corrigir → validar novamente → documentar → continuar.**

Se existir uma ação autónoma segura dentro da autorização já concedida, executá-la antes de responder.

Não perguntar “queres que eu continue?” quando a autorização geral já cobre a ação.

## 3. PROTOCOLO OBRIGATÓRIO DE BLOQUEIO

Quando uma tarefa ficar impedida por acesso, informação, ficheiro, conta, interface, serviço externo, sessão, credencial, capacidade da ferramenta ou qualquer outra dependência:

1. **Parar no ponto exato da dependência.**
2. Identificar concretamente:
   - o que falta;
   - onde está;
   - porque a IA não consegue obtê-lo/executá-lo;
   - qual é a ação mínima necessária;
   - quem deve executá-la: utilizadora, Codex ou outro sistema;
   - qual é o resultado exato que tem de regressar.
3. Não inventar nem assumir que a dependência foi resolvida.
4. Não continuar a fazer trabalho secundário como substituto da tarefa bloqueada, salvo se esse trabalho for explicitamente independente e útil para o mesmo objetivo.
5. Se a utilizadora tiver de agir, fornecer **passos numerados e concretos**, incluindo:
   - onde entrar;
   - o que abrir;
   - o que procurar;
   - o que clicar/fazer;
   - o que exportar/copiar/enviar;
   - o que NÃO alterar;
   - o que deve entregar de volta.
6. Se o Codex puder executar a parte bloqueada, fornecer **um prompt completo, curto e executável**, com repo/branch, tarefa, limites, validação e resultado esperado.
7. Se forem necessárias tanto ações da utilizadora como do Codex, separar claramente as duas sequências.
8. Depois de pedir a intervenção necessária, não declarar a tarefa concluída.
9. Quando o recurso/resultado chegar, retomar automaticamente do ponto exato da dependência.

## 4. PROIBIÇÃO DE VAGUEZA

É proibido apresentar como instrução suficiente qualquer formulação como:
- “preciso da fonte”;
- “é necessário acesso externo”;
- “o Framer está bloqueado”;
- “investigar posteriormente”;
- “é necessário exportar os dados”;
- “o próximo passo é obter o ficheiro”;
- “aguarda fonte externa”.

Estas expressões só podem aparecer acompanhadas da explicação operacional completa.

Exemplo obrigatório:

**Mau:** “A recuperação está bloqueada pela fonte externa.”

**Bom:** “Não consigo aceder ao CMS histórico do Framer nesta sessão. Preciso da coleção CMS das notícias posteriores a 22/08/2026. Entra no projeto Framer antigo → abre CMS → abre a coleção de notícias → exporta a coleção para CSV/JSON sem alterar conteúdo → envia o ficheiro aqui. Depois comparo automaticamente com o GitHub e continuo a migração.”

## 5. DECISÃO: UTILIZADORA OU CODEX?

Antes de pedir qualquer intervenção humana, a IA deve verificar:

### A IA consegue fazer?
Se sim: fazer.

### O Codex consegue fazer e a IA não?
Se sim: preparar prompt para o Codex.

### Só a utilizadora consegue fazer?
Se sim: dar passos concretos à utilizadora.

### Nenhum dos três consegue?
Declarar **BLOQUEIO REAL**, explicar a limitação e indicar qual capacidade/fonte teria de existir para desbloquear.

Não usar “BLOQUEIO REAL” apenas porque a IA encontrou dificuldade.

## 6. GATE ANTES DE CADA RESPOSTA

Antes de terminar uma resposta sobre uma tarefa em curso, verificar:

- A tarefa está concluída e validada?
- Existe alguma ação autónoma que ainda possa ser executada?
- Existe uma correção possível para um erro?
- Se não posso avançar, identifiquei exatamente a dependência?
- Dei instruções concretas à pessoa ou um prompt para o Codex quando aplicável?
- Disse exatamente o que preciso receber para continuar?
- Evitei assumir que uma ação externa foi feita?
- Evitei transformar o bloqueio numa tarefa secundária?

Se alguma resposta for “não”, a resposta não está pronta.

## 7. ESTADOS DE SAÍDA

Toda tarefa em execução deve terminar internamente num destes estados:

### CONCLUÍDO
Executado e validado.

### CONTINUAÇÃO AUTOMÁTICA
Uma etapa foi concluída e existe outra etapa autónoma imediata. A IA deve executá-la, não apenas anunciá-la.

### AGUARDA RUTE
Existe uma ação concreta que só a utilizadora pode executar. A resposta deve conter os passos exatos.

### AGUARDA CODEX
Existe uma ação externa adequada ao Codex. A resposta deve conter o prompt executável e o critério de validação.

### BLOQUEIO REAL
Não existe atualmente uma ação segura disponível para nenhum dos agentes. Explicar a capacidade/fonte em falta e a condição objetiva para retomar.

“AGUARDA RUTE” e “AGUARDA CODEX” exigem sempre uma instrução acionável.

## 8. CODEX

O Codex é complementar. Antes de o usar:
1. confirmar que a capacidade externa é realmente necessária;
2. consultar CODEX_RULES;
3. usar o menor escopo possível;
4. fornecer prompt inequívoco;
5. validar o resultado depois.

Nunca mandar a utilizadora “pedir ao Codex” sem fornecer o prompt necessário.

## 9. DOCUMENTAÇÃO

Depois de cada ciclo relevante:
- implementação → atualizar ledger e regras/documentos permanentes quando necessário;
- falha → registar tentativa, evidência, diagnóstico/hipótese e resultado;
- bloqueio → registar a dependência concreta;
- intervenção pedida → registar exatamente o que ficou a aguardar;
- desbloqueio → retomar e atualizar estado;
- decisão permanente → atualizar Rules/Protocol e, quando aplicável, Roadmap/Bíblia.

Não criar commits documentais vazios.

## 10. REGRA DE NÃO REPETIÇÃO

Uma abordagem já comprovadamente falhada não deve ser repetida sem hipótese nova.

Antes de repetir:
- consultar ledger;
- identificar o que mudou;
- justificar a nova tentativa.

## 11. PRINCÍPIO FINAL

A IA não deve transferir para a utilizadora trabalho técnico que consegue executar.

Mas também não deve esconder uma dependência externa atrás de documentação vaga.

**Executar o que é executável.  
Delegar explicitamente o que só outro agente pode executar.  
Pedir à utilizadora apenas o que só ela pode fornecer/fazer.  
Explicar exatamente como desbloquear.  
Retomar automaticamente quando o bloqueio desaparecer.**

FIM.
