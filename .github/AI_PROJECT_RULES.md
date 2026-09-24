# CHUTA PRA CANTO — MANUAL OPERACIONAL PARA ASSISTENTE / CODEX
Versão de referência: 2026-09-24

## 0. REGRA MÁXIMA
Este ficheiro é a fonte de verdade operacional do projeto Chuta Pra Canto.
Repo: chutapracanto/chutapracanto
Branch principal: main

A utilizadora deu autorização expressa para o assistente trabalhar diretamente no GitHub com o acesso disponível, incluindo criar/alterar ficheiros, branches, commits, PRs e merges quando for seguro e apropriado.

O objetivo é executar o trabalho até ao limite real das capacidades do assistente. NÃO parar apenas para apresentar um relatório e pedir "segue".

Se a próxima ação ainda puder ser feita pelo assistente:
1. analisar;
2. implementar;
3. verificar;
4. corrigir se necessário;
5. verificar novamente;
6. repetir;
7. só comunicar quando houver uma decisão necessária da utilizadora, uma ação que dependa dela, ou uma limitação técnica real.

Não enviar ZIPs.
Não criar nem enviar documentos/ficheiros para a utilizadora como anexos.
Não criar imagens.
Não pedir imagens, documentos ou prints nesta conversa.
Usar GitHub, Cloudflare/Preview acessível e texto para trabalhar e validar.

## 1. FILOSOFIA DE TRABALHO
- Preservar tudo o que já funciona.
- Não fazer refactors desnecessários.
- Não inventar conteúdo editorial.
- Não alterar secrets, passwords ou configurações sensíveis sem necessidade e sem autorização explícita para aquela operação.
- Não assumir que uma hipótese é uma causa técnica. Diagnósticos devem ser verificados.
- Preferir alterações pequenas, isoladas, reversíveis e fáceis de validar.
- Não gastar créditos do Codex em trabalho que o assistente consegue executar diretamente.
- Não duplicar trabalho já feito.
- Antes de criar uma nova solução, verificar o estado real de main, PRs, commits e deployments.
- Quando uma PR anterior foi fechada sem merge e uma solução equivalente foi reaplicada numa PR posterior, considerar apenas o código efetivamente merged como estado de produção.

## 2. REGRA DE USO DO CODEX — ECONOMIZAR CRÉDITOS
O Codex da OpenAI é um recurso valioso e NÃO deve ser usado por defeito.

Ordem obrigatória:
A. Assistente analisa o GitHub e o estado atual.
B. Assistente implementa diretamente no GitHub tudo o que conseguir.
C. Assistente valida o resultado.
D. Assistente corrige diretamente qualquer problema que consiga corrigir.
E. Só quando existir uma ação que o assistente não consiga executar, usar Codex.
F. O pedido ao Codex deve ser mínimo, objetivo e limitado ao bloqueio real.

O Codex é especialmente reservado para:
- operações locais/browser que não estejam disponíveis ao assistente;
- deploy/configuração Cloudflare que exija o ambiente local ou acesso que o assistente não tenha;
- testes E2E/interação visual que exijam execução no computador do utilizador;
- comandos locais específicos que não possam ser executados pelos instrumentos disponíveis;
- qualquer operação que dependa obrigatoriamente da sessão/autorização local do utilizador.

Não usar Codex para:
- explicar código;
- escrever planos que o assistente consegue executar;
- criar ficheiros que o assistente consegue criar no GitHub;
- pequenas correções de HTML/CSS/JS/JSON/Markdown que o assistente consiga aplicar;
- reescrever prompts longos;
- repetir análises que já foram feitas.

### PROMPTS PARA CODEX
Quando for indispensável usar Codex:
- enviar apenas o contexto mínimo;
- dizer exatamente o que fazer;
- dizer o que NÃO deve alterar;
- pedir validação;
- não enviar blocos gigantes de código se o Codex puder inspecionar o repositório;
- não incluir histórico irrelevante;
- não mandar o utilizador copiar ficheiros inteiros;
- não mandar prompts longos apenas para "explicar tudo".

Formato preferido:
"Trabalha no repo X, branch Y. Faz apenas A e B. Não alteres C/D. Usa o estado atual do repo como fonte de verdade. Executa os testes/validações X. Se encontrares erro, corrige-o dentro deste escopo e volta a validar. No fim devolve apenas resumo curto + commit/deploy/resultado."

## 3. CICLO OPERACIONAL ETERNO
Para qualquer tarefa:

1. INSPECIONAR
   - estado de main;
   - PRs abertos/fechados;
   - commits recentes;
   - ficheiros relevantes;
   - deployments/Preview quando disponíveis.

2. IMPLEMENTAR
   - fazer diretamente no GitHub se possível;
   - não esperar autorização adicional se a autorização já estiver dada e a alteração estiver dentro do escopo.

3. VALIDAR
   - comparar diff;
   - verificar consistência;
   - testar lógica;
   - verificar URLs/ficheiros;
   - verificar deployment/Preview quando possível.

4. CORRIGIR
   - se falhar, corrigir diretamente;
   - voltar ao passo 3.

5. REPETIR
   - continuar até:
     a) ficar validado; ou
     b) existir uma dependência externa real.

6. ESCALAR PARA CODEX
   - apenas se a próxima ação depender realmente do ambiente local/Cloudflare/browser/credenciais que o assistente não controla.

7. COMUNICAR
   - mensagem curta;
   - dizer o que ficou efetivamente feito;
   - dizer apenas a ação do utilizador que seja realmente indispensável.
   - nunca pedir "segue" quando o assistente ainda puder avançar.

## 4. DEPLOY
Arquitetura conhecida:
GitHub repo -> Cloudflare Pages / Workers -> produção.

Quando um commit em main desencadear deploy automático:
- verificar o commit;
- verificar o deployment;
- verificar Preview/produção quando acessível;
- só considerar concluído quando o deploy correspondente estiver confirmado.

Cloudflare Pages:
- Preview de PR/branch pode ser usado para validação antes de merge.
- Produção não deve receber alterações experimentais só para "ver se funciona".
- Alterações de produção devem entrar em main apenas depois de validação suficiente.

Cloudflare Worker:
- existe um Worker chamado "chutapracanto".
- Não confundir o Worker com um ficheiro "_worker.js" nem assumir que o nome do projeto é o nome do ficheiro.
- Se a operação exigir Cloudflare Dashboard/local CLI e o assistente não tiver essa capacidade, escalar para Codex.

## 5. PR / MERGE
Regra:
- PR experimental: validar Preview antes de merge.
- PR com falha: corrigir antes de merge.
- Não considerar PR fechado sem merge como implementação de produção.
- Antes de abrir uma nova PR, verificar se já existe PR equivalente.
- Se uma PR anterior foi substituída, identificar claramente qual versão entrou em main.
- Não fazer merge às cegas.

Estado confirmado em 2026-09-24:
PR #18 — "Corrigir artigo de opinião e autoria de Pedro"
- merged
- merge commit: 510bebbc7f5ae1530dd72edbbad3dc5d2e02e5a3

PR #19 — "Melhorar navegação, leitura, partilha e desempenho das páginas editoriais"
- fechado sem merge
- NÃO é estado de produção.

PR #20 — migração para chutapracanto.com / AdSense / ads.txt / referências de domínio
- merged
- foi a migração relevante para o domínio .com.

PR #21 — reaplicação das melhorias pós-migração
- fechado sem merge.

PR #22 — "Sticky, navegação e partilha pós-migração .com"
- merged
- merge commit: 9855a09b4e27ddeea2ea5973392a399f60bb0921
- deployment confirmado em commit fff0fca
- Preview/deploy reportado como successful.

PR #23 — "Sticky editorial progressivo e mobile de Notícias"
- aberto em 2026-09-24
- branch: mobile-sticky-editorial
- head: 9e62d3e53f2a0a85a5dcc7a5b3a6987becec8550
- mergeable: true
- ainda NÃO merged na última verificação
- Preview deployment: 507d6a7d.chutapracanto.pages.dev
- deployment: successful.

PR #24:
- não existe na última verificação de GitHub em 2026-09-24.

## 6. O QUE JÁ FOI IMPLEMENTADO / ESTADO DO PROJETO
### Fases anteriores consolidadas
- OG/social preview e tags de partilha corrigidos.
- crawler passou a encontrar os campos necessários.
- área Notícias com paginação/filtros/pesquisa.
- Admin funcional com autenticação/env quando configurado.
- Fase 3B: navegação/estado de Notícias, Contacto, privacidade/footer.
- Fase 3D: Política Editorial, footer, sitemap e privacidade relacionada com AdSense.
- Opinião integrada com autoria de Pedro Soares.
- Breadcrumb/JSON-LD mantidos para artigos.
- Navegação Notícias/Opinião corrigida.
- Partilha editorial foi compactada e organizada.
- Sticky editorial foi trabalhado em mais de uma PR e a versão pós-migração foi incorporada no #22.
- Migração para chutapracanto.com incorporada no #20.
- AdSense está preparado com publisher ID conhecido:
  ca-pub-1556367149800029
- ads.txt preparado.
- PR #23 acrescenta sticky progressivo e layout mobile vertical para Notícias.

### Autoria editorial
Rute Costa:
"Moderadora e Locutora"

Pedro Soares:
"Treinador, Opinião Crítica e Análise"

Pedro é o autor das peças de opinião/crónica/análise quando indicado como tal.

## 7. DOMÍNIO E ADSENSE
Domínio principal pretendido:
https://chutapracanto.com

Conta AdSense existente:
rute-costa_@hotmail.com

Não assumir que deve ser criada uma segunda conta.
Publisher ID:
ca-pub-1556367149800029

Método de validação escolhido:
Fragmento do código do AdSense.

Não expor nem alterar secrets.
Não inventar credenciais.

## 8. PERFORMANCE
Lighthouse/PageSpeed já revelou LCP mobile muito elevado em determinada medição, aproximadamente 17,5–18,3 s.
A investigação anterior não estabeleceu uma causa suficientemente conclusiva.
Regra:
- não declarar uma causa sem evidência;
- não fazer alterações aleatórias só para baixar uma métrica;
- medir antes/depois;
- separar regressão real de medição variável.

## 9. CONTEÚDO E EDITORIAL
Não inventar notícias, resultados, datas, declarações, estatísticas ou opiniões de Pedro.
Não publicar conteúdo editorial automaticamente só porque uma estrutura técnica está pronta.
Preservar datas de publicação existentes quando conteúdo é migrado/reprocessado.
Ao importar/reprocessar notícias:
- não alterar datas sem instrução;
- não duplicar artigos;
- não destruir slugs;
- não perder autor/categoria/imagem;
- verificar índice JSON.

## 10. REGRA ESPECIAL PARA ALTERAÇÕES DE CÓDIGO
Antes de alterar:
- localizar a implementação real;
- verificar se já existe uma solução equivalente;
- verificar PRs recentes;
- verificar dependências.

Depois:
- diff;
- sintaxe;
- referências;
- regressões;
- deployment.

Não substituir ficheiros inteiros se uma alteração localizada for suficiente.

## 11. REGRA DE COMUNICAÇÃO COM A UTILIZADORA
A utilizadora não quer relatórios intermediários do tipo:
"Fiz X. A seguir posso fazer Y. Diz segue."

Em vez disso:
- executar X;
- executar Y;
- validar X+Y;
- continuar;
- só parar quando necessário.

Quando houver uma limitação real:
"Não consigo executar X porque Y. Para desbloquear, precisas de fazer Z."
Nesse caso, fornecer instrução curta e exata.

Não pedir prints/imagens/documentos.
Não criar ZIPs.
Não criar ficheiros para download.
Não usar anexos como método de trabalho.

## 12. PRIORIDADE ATUAL — 2026-09-24
1. Validar integralmente o PR #23 no Preview.
2. Corrigir diretamente no PR #23 qualquer problema encontrado que esteja ao alcance do assistente.
3. Revalidar.
4. Só depois considerar merge do #23.
5. Confirmar que o main resultante mantém as funcionalidades do #22 e do .com.
6. Continuar o roadmap técnico/editorial sem duplicar trabalho.
7. Usar Codex apenas quando existir uma operação que o assistente não possa fazer diretamente.

## 13. ROADMAP — CAMINHO
FASE A — Fundação / conteúdo / SEO
- concluída em grande parte.

FASE B — Notícias / Admin / pesquisa / filtros
- implementada e validada em várias iterações.

FASE C — Editorial / Opinião / autores / políticas / contacto
- implementada.
- continuar apenas com melhorias necessárias.

FASE D — Domínio / monetização
- .com incorporado.
- AdSense/ads.txt preparados.
- continuar validação real do domínio e monetização.

FASE E — UX editorial
- navegação, partilha e sticky pós-migração incorporados no #22.
- #23 em validação: sticky progressivo + mobile Notícias.

FASE F — Performance
- medir continuamente.
- atacar apenas causas comprovadas.

FASE G — Conteúdo estruturado / futebol
- evoluir taxonomias, resultados/classificações e integrações apenas quando houver fonte/API definida e sem quebrar conteúdo existente.

FASE H — Monetização e crescimento
- AdSense.
- publicidade/parcerias.
- manter site como casa própria do Chuta Pra Canto.
- não sacrificar velocidade/UX por monetização.

## 14. CHECKLIST DE FECHO
Uma tarefa só é considerada concluída quando:
[ ] alteração implementada
[ ] diff revisto
[ ] referências/sintaxe verificadas
[ ] deployment/Preview verificado quando aplicável
[ ] funcionalidade principal testada
[ ] regressões relevantes verificadas
[ ] PR/merge state confirmado
[ ] nenhum trabalho equivalente ficou duplicado
[ ] se necessário, Codex usado apenas para o bloqueio real
[ ] utilizadora só é chamada a intervir se houver uma ação que o assistente não possa executar

FIM DO MANUAL.
