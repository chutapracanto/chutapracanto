# CHUTA PRA CANTO — HANDOFF DE CONTINUIDADE — 2026-09-24

## Objetivo deste ficheiro

Este ficheiro é um ponto de continuidade para qualquer nova conversa/IA que assuma o projeto Chuta Pra Canto.

Deve ser lido em conjunto com `.github/AI_PROJECT_RULES.md`, que continua a ser a fonte de verdade operacional e deve ser lido primeiro.

Este documento regista o estado consolidado desta conversa, incluindo:
- o que já foi implementado;
- o que foi validado;
- o que ficou em aberto;
- o que está em andamento;
- o último passo executado;
- o que NÃO deve ser repetido;
- o próximo diagnóstico necessário.

A regra mais importante é: **não confiar apenas neste ficheiro ou em memórias de conversas. Confirmar sempre o estado real do GitHub, PRs, commits e deployments antes de alterar código.**

---

# 1. IDENTIDADE DO PROJETO

Repositório:
`chutapracanto/chutapracanto`

Branch de produção:
`main`

Domínio de produção:
`https://chutapracanto.com`

Cloudflare Pages:
- GitHub -> Cloudflare Pages;
- `main` é produção;
- branches/PRs podem gerar Preview;
- confirmar sempre commit e deployment antes de considerar algo publicado.

Existe também um Cloudflare Worker separado chamado **`chutapracanto`**.

IMPORTANTE:
- não confundir o Worker Cloudflare chamado `chutapracanto` com o ficheiro `_worker.js` do repositório;
- qualquer diagnóstico de Worker deve distinguir estas duas coisas.

---

# 2. REGRAS OPERACIONAIS OBRIGATÓRIAS

Ler primeiro:

`.github/AI_PROJECT_RULES.md`

Antes de qualquer ação:
1. consultar as rules;
2. verificar o estado real do GitHub;
3. preservar o que funciona;
4. evitar refactors desnecessários;
5. não inventar conteúdo editorial, datas, autores, resultados, estatísticas ou imagens;
6. não alterar secrets/passwords/configuração sensível sem necessidade;
7. não considerar PR fechada sem merge como produção;
8. implementar diretamente pelo GitHub quando possível;
9. usar Codex apenas quando for necessária capacidade externa/local/browser/DevTools/Lighthouse/Cloudflare;
10. depois de qualquer ação externa, voltar a verificar e continuar.

O projeto usa exclusivamente recursos gratuitos. Não iniciar custos, upgrades ou créditos pagos.

Quando for preparado um prompt para Codex:
- mandar o Codex ler `.github/AI_PROJECT_RULES.md` primeiro;
- colocar o prompt integral num bloco de código para permitir copiar;
- não mandar o manual inteiro dentro do prompt.

---

# 3. HISTÓRICO DE PRODUÇÃO

PRs efetivamente mergeadas em produção:

#1 — `6cdb4e4`
#2 — `76e4e995`
#3 — `7a3187b8`
#4 — `293214af`
#5 — `31d58880`
#6 — `dfdaf5b7`
#7 — `fd76abea`
#8 — `8635cbaa`
#9 — `28b7eb3b`
#10 — `81dd6523`
#11 — `707ca08c`
#12 — `af36cbac`
#13 — `42155e56`
#14 — `20bcac87`
#15 — `c79b153c`
#16 — `81d65d1d`
#18 — `510bebbc`
#20 — `05ca8862`
#22 — `9855a09b`
#24 — `d1ac249d0cd5fee66e25d7162a97872dc82e28e3`

Não produção:
- #17 fechada sem merge;
- #19 fechada sem merge;
- #21 fechada sem merge;
- #23 fechada sem merge.

#24 foi a última PR mergeada antes da atual frente de performance.

---

# 4. IMPORTAÇÃO HISTÓRICA FRAMER — CONCLUÍDA

Esta fase está FECHADA. Não repetir o importer sem nova necessidade explícita.

Resultado final:
- 213 URLs únicas encontradas no arquivo Framer;
- 179 artigos importados;
- 34 duplicados/ignorados;
- 0 falhas;
- 233 Markdown finais:
  - 232 notícias;
  - 1 opinião;
- `content/noticias-index.json`: 233 entradas;
- índice sem paths/slugs em falta ou duplicados;
- ordenação mais recente -> mais antiga;
- `sitemap.xml`: 241 URLs;
- 233 artigos + 8 páginas públicas;
- workflow temporário de importação removido.

Commit da importação:
`6701b981302dea5955047812e83e92e6a5c17dbe`

Commit de remoção do workflow temporário:
`ced7e4113b9a4fb76102c2a32cd9325fc84ce8bd`

Não voltar a executar a importação histórica.

---

# 5. PR #24 — STICKY + MOBILE NOTÍCIAS — CONCLUÍDA

PR #24:
- título: Sticky editorial progressivo e mobile de Notícias — base atual;
- branch: `mobile-sticky-editorial-rebased`;
- mergeada;
- merge commit:
  `d1ac249d0cd5fee66e25d7162a97872dc82e28e3`

Alterações:
- sticky editorial progressivo;
- H1 com redução progressiva no scroll;
- header opaco durante scroll;
- artigo em fluxo normal;
- mobile de /noticias com cartões verticais;
- imagens 16:9 no mobile;
- desktop preservado.

Validação externa pós-merge:
- 390 px: sem overflow/sobreposição;
- 320 px: sem overflow/sobreposição;
- 768 px: sem cortes;
- 1280 px: navegação/artigo/partilha/relacionados funcionais;
- consola permaneceu inconclusiva por limitação do browser disponível.

A validação de produção do #24 serviu de ponto de partida para a Fase 6.

---

# 6. FASE ATUAL: PERFORMANCE

Objetivo:
reduzir LCP mobile e melhorar Core Web Vitals sem introduzir regressões.

O problema histórico era:
- LCP mobile aproximadamente 17,5–18,3 s em algumas medições;
- grande variabilidade entre execuções;
- causa única ainda não comprovada.

Métricas devem ser tratadas como lab data quando provenientes de Lighthouse/PageSpeed.

INP de campo:
- não disponível;
- não tratar "No Data" como zero.

TBT:
- é métrica de laboratório;
- não confundir com INP.

---

# 7. BASELINE DE PRODUÇÃO ANTES DA PR #25

Medições com Lighthouse/PageSpeed 13.5.0, Mobile Moto G Power + Slow 4G e desktop emulação/custom throttling.

Home:
- mobile run 1: score 60, FCP 5,7 s, LCP 17,8 s, CLS 0,025, TBT 60 ms;
- mobile run 2: score 88, FCP 3,0 s, LCP 3,2 s, CLS 0,034, TBT 80 ms;
- desktop: score 81, FCP 0,9 s, LCP 3,2 s, CLS 0,003, TBT 0 ms.

/noticias:
- mobile: score 59, FCP 6,2 s, LCP 18,1 s, CLS 0, TBT 30 ms;
- desktop: score 81, FCP 1,0 s, LCP 3,1 s, CLS 0,006, TBT 40 ms.

/noticia:
- mobile run 1: score 68, FCP 2,7 s, LCP 18,2 s, CLS 0,062, TBT 40 ms;
- mobile run 2: score 58, FCP 5,8 s, LCP 19,0 s, CLS 0, TBT 50 ms;
- desktop: score 83, FCP 0,8 s, LCP 2,9 s, CLS 0,042, TBT 20 ms.

Opinião:
- mobile: score 58, FCP 5,9 s, LCP 18,2 s, CLS 0, TBT 60 ms;
- desktop: score 81, FCP 0,9 s, LCP 3,2 s, CLS 0,020, TBT 0 ms.

Observações importantes:
- Home mobile foi extremamente variável;
- artigo mobile foi repetidamente lento;
- TBT baixo, portanto main-thread blocking sozinho não explica LCP de ~18–19 s;
- render-blocking CSS/fonts era uma oportunidade real;
- /images/logo.png tinha ~2.03 MiB, 1536x1024 px, mas era mostrado em cerca de 137x91 px mobile. É um problema objetivo de eficiência, mas NÃO foi assumido como causa única do LCP;
- não alterar o logo apenas por hipótese sem necessidade de separar variáveis.

---

# 8. DIAGNÓSTICO ANTERIOR DA REDE

O grafo de dependências de artigo mostrou:
- cerca de 16 URLs;
- critical path máximo ~679 ms;
- `noticias-index.json` ~168 KiB, cerca de 469–545 ms;
- Markdown ~2,15 KiB, cerca de 589–615 ms;
- authors/types na ordem de ~0,6 s cada.

Isto não demonstrou waterfall serial suficientemente longo para explicar 18–19 s.

Também foi observado:
- render-blocking opportunities estimadas de ~1,94–2,85 s;
- Google Fonts CSS ~750 ms em artigo;
- Font Awesome CSS ~1350 ms;
- `style.css` ~150 ms.

Uma captura desktop mostrou uma chamada Google/DoubleClick `pagead/ads` HTTP 500, mas foi uma ocorrência isolada e não foi provada como causa do LCP.

O breakdown PSI que mostrava TTFB 0 ms NÃO deve ser interpretado como TTFB real do documento. Não havia timing DOCUMENT fiável disponível.

---

# 9. PR #25 — PERFORMANCE FIRST PASS

PR:
#25

Branch:
`perf-lcp-first-pass`

Estado:
**OPEN / NÃO MERGEADA**

Não fazer merge até a validação atual estar concluída.

A PR recebeu inicialmente uma primeira passagem de performance e depois uma segunda passagem específica para o shell inicial do artigo.

---

# 10. PR #25 — PRIMEIRA PASSAGEM IMPLEMENTADA

Ficheiros principais alterados:
- `index.html`
- `noticias.html`
- `noticia.html`
- `opiniao.html`
- `sobre.html`
- `contacto.html`
- `privacidade.html`
- `termos.html`
- `politica-editorial.html`
- `style.css`

Alterações:
- removido Google Fonts `@import` bloqueante;
- Google Fonts passou para carregamento não bloqueante;
- Font Awesome passou para carregamento não bloqueante;
- preconnect para fontes/CDN quando aplicável;
- logo global com `decoding="async"` e `fetchpriority="low"`;
- logo do footer lazy/async/low;
- primeira imagem de /noticias recebe eager/high;
- restantes imagens lazy/low;
- `decoding="async"` nas imagens.

Não foram alterados:
- conteúdo editorial;
- índice;
- sitemap;
- secrets;
- arquitetura de dados.

---

# 11. PR #25 — SEGUNDA PASSAGEM: SHELL INICIAL DE ARTIGO

Problema que motivou esta alteração:
o H1 do artigo aparecia como LCP e era criado apenas depois de JavaScript carregar o índice.

Foi implementado no `_worker.js` um shell inicial baseado no `content/noticias-index.json`.

O Worker:
1. identifica o slug;
2. lê localmente `/content/noticias-index.json`;
3. encontra a entrada correspondente;
4. constrói no HTML inicial:
   - `.article-heading`;
   - tag de categoria;
   - tag de tipo;
   - H1;
   - subtítulo, quando existe;
   - byline;
   - hero image;
5. injeta esse shell em `#article-content`;
6. depois mantém o pipeline existente de preparação para partilha.

O JavaScript de `noticia.html` foi alterado para:
- reutilizar o shell existente;
- atualizar os elementos em vez de destruir e recriar tudo;
- reutilizar H1/header/hero quando já existem;
- continuar a carregar o Markdown.

Houve um erro temporário de sintaxe na alteração da imagem. Foi detetado e corrigido antes da validação final.

Validação estática final:
- sintaxe do Worker: PASS;
- blocos JS de `noticia.html`: PASS;
- integração do shell: PASS;
- pipeline do Worker: PASS.

---

# 12. PR #25 — RESULTADO DO SHELL NO PREVIEW

Preview validado:
`https://1f72ec57.chutapracanto.pages.dev`

Deployment:
`1f72ec57-7737-43f0-8731-3b241c765e1d`

Commit indicado:
`5e1ec62`

A validação mais recente confirmou:

## HTML RAW sem JavaScript
**PASS para os dois artigos.**

GETs:
- HTTP 200;
- sem executar JavaScript;
- sem guardar ficheiros.

Notícia:
- `#article-content` presente;
- uma `.article-heading`;
- exatamente um H1;
- título correto;
- hero presente.

Opinião:
- mesmos elementos;
- título correto;
- existe um U+200B invisível antes do texto do título no HTML raw;
- removendo esse carácter, lê-se corretamente:
  "Onde a Paixão Virou Guerra".

## Hero RAW
**PASS nos dois artigos.**

Cada artigo contém:
- uma figura hero;
- uma imagem;
- `loading="eager"`;
- `fetchpriority="high"`.

A contagem foi confirmada com parser DOM local sem executar scripts nem carregar imagens.

O hero não possui `width/height` HTML explícitos.

O CSS atual reserva:
`aspect-ratio: 16 / 9`

Logo, a reserva de geometria existe, mas a ausência de dimensões intrínsecas continua a ser um detalhe técnico a observar.

## Headers RAW
Ambos responderam com:
- `Content-Type: text/html; charset=utf-8`
- `Cache-Control: public, must-revalidate, max-age=0`
- `Server: cloudflare`

Não apareceram:
- `Content-Length`;
- `CF-Cache-Status`.

---

# 13. PR #25 — DUPLICAÇÃO APÓS JAVASCRIPT

Validação normal no browser:
**PASS.**

Nos dois artigos:
- um único H1;
- uma única imagem hero;
- Markdown completo;
- sem duplicação do shell;
- relacionados carregados.

Partilha:
- notícia: "Copiar link" funcionou e mostrou "Link copiado";
- opinião: menu abriu e Escape fechou.

Navegação:
- botão de retorno da notícia -> /noticias;
- botão de retorno da opinião -> /opiniao.

Portanto:
**não existe evidência de que o shell inicial esteja a duplicar o conteúdo.**

---

# 14. PR #25 — LIGHTHOUSE ATUAL

## Notícia desktop
Medição válida:
- Performance: 74;
- FCP: 1,0 s;
- LCP: 1,2 s;
- CLS: **0,571**;
- TBT: 0 ms.

O CLS é agora o problema objetivo principal a esclarecer.

O Lighthouse atribuiu aproximadamente:
- 0,323 ao container principal do artigo;
- 0,206 ao body.

Também assinalou:
- logo como imagem sem dimensões explícitas;
- fontes na auditoria de layout.

Mas o relatório não forneceu a sequência temporal suficiente para provar a causa.

O hero tem proporção reservada por CSS.

## Opinião desktop
Resultado do PSI/Lighthouse anterior:
- Performance 92;
- FCP 0,9 s;
- LCP 1,7 s;
- CLS 0,001;
- TBT 10 ms.

**NÃO É UMA MEDIÇÃO VÁLIDA DA PÁGINA DE OPINIÃO.**

O DOM final observado pelo PSI continha:
"Não foi possível carregar esta notícia"

Portanto:
- não usar estes números para comparar a opinião;
- não concluir que a opinião está melhor;
- a opinião carrega corretamente no browser normal;
- o HTML RAW contém shell correto.

---

# 15. PR #25 — CLS: O QUE SABEMOS E O QUE NÃO SABEMOS

Sabemos:
- CLS 0,571 no artigo de notícia desktop é real na medição Lighthouse reportada;
- 0,323 foi associado ao container principal do artigo;
- 0,206 ao body;
- logo sem dimensões explícitas também foi apontado;
- fontes aparecem na auditoria;
- hero tem `aspect-ratio:16/9`.

Não sabemos ainda:
- timestamp exato dos shifts;
- qual alteração temporal provoca o primeiro/maior shift;
- se é o shell que muda de altura;
- se é a fonte que muda geometria;
- se o `--article-progress` muda o layout durante o carregamento;
- se algum script de scroll/sticky corre antes da página estabilizar;
- se a troca entre shell e conteúdo causa deslocamento residual.

Não assumir nenhuma destas hipóteses como causa até existir trace.

---

# 16. DETALHE IMPORTANTE DO CSS ATUAL

Na branch da PR #25 existem regras de artigo progressivo que alteram propriedades geométricas:

`.article-heading`:
- padding-top e padding-bottom variam com `--article-progress`;
- background/border variam;
- backdrop-filter varia.

H1:
- font-size varia com `--article-progress`;
- margins variam;
- opacity varia.

Resumo:
- font-size varia;
- max-height varia;
- margin varia;
- opacity varia.

Tags/byline:
- opacity varia.

Estas regras podem ser perfeitamente intencionais para o sticky/editorial progressivo, mas **não devem ser acusadas de causar o CLS sem trace temporal**.

A questão específica é saber se `--article-progress` é alterado durante o carregamento inicial de forma a mover o conteúdo.

---

# 17. ÚLTIMO PASSO EXECUTADO NESTA CONVERSA

A utilizadora executou o prompt de Codex preparado para investigação do CLS e da falha do Lighthouse/PSI da opinião.

O resultado recebido foi:
- HTML RAW do shell: PASS;
- H1 RAW: PASS;
- hero RAW: PASS;
- duplicação no browser: PASS;
- CLS da notícia: 0,571;
- causa temporal do CLS: **não comprovada** porque o browser disponível não expôs um trace Chrome Performance utilizável;
- opinião no browser normal: PASS;
- opinião no PSI/Lighthouse: resultado inválido porque carregou "Não foi possível carregar esta notícia";
- nenhuma alteração de código;
- nenhum commit criado;
- nenhum merge feito.

**Neste momento, a conversa está à espera de uma investigação melhor do trace temporal, não de um merge.**

O último prompt enviado ao Codex pedia especificamente:
- Chrome Performance recording;
- viewport desktop 1280 px;
- identificação de Layout Shifts;
- timestamp;
- elemento que mudou;
- elemento causador;
- relação com shell/JS/fontes/hero/header;
- repetição para confirmar;
- investigação de `--article-progress`;
- nova tentativa do artigo de opinião no Lighthouse;
- sem alterar código/commits/merge.

---

# 18. PR #25 — DECISÃO ATUAL

Estado:
**PR pronta para correção específica, NÃO pronta para merge.**

Razões:
1. shell inicial está comprovado;
2. duplicação não existe;
3. primeira passagem melhorou alguns LCP;
4. artigo desktop tem CLS 0,571;
5. opinião não tem benchmark Lighthouse válido;
6. causa temporal do CLS ainda não foi comprovada.

Não fazer merge enquanto:
- não houver explicação suficientemente sólida do CLS; e
- não estiver esclarecido o comportamento da opinião no Lighthouse/PSI, ou pelo menos demonstrado que a falha é específica do ambiente Lighthouse.

---

# 19. O QUE NÃO FAZER AGORA

Não:
- fazer merge da #25;
- alterar código só por hipótese;
- mexer no logo de 2 MiB antes de separar as variáveis atuais;
- remover `aspect-ratio` do hero;
- inventar `width/height` para imagens;
- alterar conteúdo editorial;
- alterar índice;
- alterar sitemap;
- alterar secrets;
- repetir a importação Framer;
- reabrir PRs antigas #17/#19/#21/#23;
- aplicar novamente alterações de #19/#21/#23;
- tratar o PSI inválido da opinião como prova de erro editorial.

---

# 20. PR #25 — FICHEIROS/ÁREAS A CONSIDERAR

Alterações de performance:
- `index.html`
- `noticias.html`
- `noticia.html`
- `opiniao.html`
- `sobre.html`
- `contacto.html`
- `privacidade.html`
- `termos.html`
- `politica-editorial.html`
- `style.css`

Segunda passagem:
- `_worker.js`
- `noticia.html`

Não há alteração pretendida em:
- Markdown editorial;
- `content/noticias-index.json`;
- `sitemap.xml`;
- secrets.

---

# 21. PR #25 — HIPÓTESES QUE MERECEM INVESTIGAÇÃO

Estas são hipóteses, não conclusões:

### A. Mudança geométrica do shell/header
O shell chega no HTML RAW e depois o JS reutiliza-o. É necessário verificar se alguma atualização posterior muda a altura.

### B. `--article-progress`
As regras progressivas alteram:
- padding;
- font-size;
- margins;
- max-height.

Se o valor mudar durante a fase inicial, pode gerar layout shift.

### C. Fontes
Google Fonts deixou de bloquear o carregamento, mas a troca entre fallback e fonte final pode alterar métricas de texto.

### D. Logo/header
O logo não tem dimensões intrínsecas explícitas e aparece em auditorias de layout.

### E. Hero
O hero reserva 16:9 via CSS, portanto não deve ser automaticamente culpado. Ainda assim, não possui width/height HTML.

### F. DOM inicial -> estado final
Embora não exista duplicação, pode existir diferença geométrica entre o shell inicial e o estado final.

A ordem correta é:
**trace -> causa comprovada -> correção mínima -> nova medição.**

---

# 22. QUANDO O CODEX DEVOLVER O TRACE

A nova conversa/IA deve:

1. ler `.github/AI_PROJECT_RULES.md`;
2. ler este handoff;
3. confirmar o estado atual da PR #25 e do branch;
4. analisar o trace;
5. identificar o elemento/causa temporal;
6. implementar diretamente a correção mínima se a causa estiver comprovada;
7. validar sintaxe;
8. criar/atualizar branch/commit/PR apenas dentro do escopo;
9. voltar a testar no Preview;
10. repetir Lighthouse;
11. comparar CLS/LCP;
12. verificar artigo normal, opinião, /noticias e home;
13. só então decidir merge.

Se o trace não conseguir provar a causa:
- não inventar;
- não alterar aleatoriamente;
- tentar uma segunda técnica de diagnóstico;
- usar Codex novamente se essa for a capacidade externa necessária.

---

# 23. POSSÍVEL CAMINHO DEPOIS DO #25

Depois de resolver e validar #25:

1. merge da PR;
2. verificar deployment Cloudflare;
3. confirmar produção `https://chutapracanto.com`;
4. repetir baseline de:
   - Home;
   - /noticias;
   - artigo;
   - opinião;
5. comparar LCP/CLS;
6. só depois investigar otimizações adicionais, incluindo o logo de ~2 MiB;
7. confirmar canonical/OG/sitemap/robots;
8. retomar AdSense/Search Console na ordem definida nas rules.

Não saltar diretamente para monetização enquanto uma alteração de performance ainda estiver instável.

---

# 24. ARQUITETURA EDITORIAL QUE DEVE SER PRESERVADA

Tipos:
- news;
- opinion;
- video;
- podcast quando aplicável.

Notícias e Opinião permanecem tecnicamente separados.

Autores:
- Rute Costa — Moderadora e Locutora;
- Pedro Soares — Treinador, Opinião Crítica e Análise.

Não transformar opinião em notícia.

Preservar:
- publishedAt;
- slug;
- autor;
- categoria;
- imagem;
- canonical;
- NewsArticle para news;
- Article para outros tipos;
- BreadcrumbList;
- relacionados;
- partilha.

---

# 25. SEO E DADOS

Já existem:
- canonical;
- OG/Twitter;
- NewsArticle;
- Article;
- BreadcrumbList;
- sitemap;
- robots;
- autores;
- datas;
- tipos editoriais;
- relacionados.

Qualquer alteração futura deve verificar:
- título;
- descrição;
- imagem;
- URL absoluta;
- canonical;
- breadcrumbs;
- schema;
- coerência news/opinion.

---

# 26. ADSENSE / SEARCH CONSOLE

Tecnicamente preparado:
- domínio `chutapracanto.com`;
- Publisher ID `ca-pub-1556367149800029`;
- ads.txt;
- snippet;
- política/privacidade.

Ainda operacional:
- confirmar domínio no AdSense;
- verificação;
- acompanhar revisão;
- Search Console;
- sitemap/indexabilidade.

Não assumir aprovação.

---

# 27. ROADMAP DEPOIS DA PERFORMANCE

Fase 6:
- performance mensurável;
- LCP;
- CLS;
- INP/TBT;
- imagens;
- scripts;
- feeds;
- YouTube;
- cache;
- rede.

Fase 7:
- dados estruturados de futebol;
- competições;
- equipas;
- resultados;
- classificações;
- calendários;
- API/fonte;
- licença/rate limits.

Fase 8:
- Google News / Publisher Center;
- Search Console;
- labels de opinião;
- secções;
- logo;
- sitemap/indexabilidade.

Fase 9:
- monetização;
- AdSense;
- consentimento/CMP;
- publicidade/parcerias.

Fase 10:
- SEO editorial;
- distribuição;
- Shorts/Reels;
- podcasts;
- crescimento.

---

# 28. RESUMO EM 30 SEGUNDOS PARA UMA NOVA IA

O Chuta Pra Canto é um site de futebol em GitHub + Cloudflare Pages/Worker, produção em `chutapracanto.com`.

O arquivo Framer já foi importado e a fase está fechada:
233 Markdown finais, 233 entradas no índice, sitemap com 241 URLs.

A PR #24 foi mergeada e estabilizou o sticky editorial e mobile de Notícias.

A PR #25 está aberta em `perf-lcp-first-pass` e tenta melhorar performance/LCP.

A #25 já:
- removeu fontes bloqueantes;
- tornou Font Awesome não bloqueante;
- priorizou a primeira imagem de /noticias;
- otimizou logos;
- criou shell inicial de artigos no Worker;
- comprovadamente entrega H1/hero no HTML RAW;
- não duplica conteúdo após JS.

Mas **ainda não está pronta para merge** porque:
- notícia desktop apresenta CLS ~0,571;
- causa temporal ainda não foi comprovada;
- opinião tem browser normal funcional, mas Lighthouse/PSI produziu uma página de erro e portanto a medição não é válida.

Última ação:
**foi enviado um prompt ao Codex para obter Chrome Performance trace e investigar o CLS e a falha do Lighthouse. Ainda se aguarda essa resposta.**

A próxima IA NÃO deve começar a alterar código. Deve primeiro ler:
1. `.github/AI_PROJECT_RULES.md`
2. este ficheiro
3. estado real da PR #25/GitHub

Depois deve continuar do ponto do trace.

---

# 29. REGRA DE CONTINUIDADE

Este ficheiro é um handoff, não uma autorização para parar.

Quando uma nova IA assumir:
- verificar;
- continuar;
- corrigir;
- validar;
- avançar.

Se houver dependência externa real:
- identificar se é Codex ou utilizadora;
- fornecer imediatamente instrução acionável;
- depois retomar a validação.

FIM DO HANDOFF
