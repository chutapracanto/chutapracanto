# CHUTA PRA CANTO — BÍBLIA MESTRA DO PROJETO
## Documento de continuidade IA → IA
**Data de consolidação:** 2026-09-24  
**Repositório:** `chutapracanto/chutapracanto`  
**Produção:** `main` → `https://chutapracanto.com`

> **OBJETIVO:** este é o documento de continuidade principal para uma nova IA. Ele consolida as duas bíblias anteriores, o handoff técnico mais recente e o estado real verificado no GitHub no momento da consolidação.
>
> **Não substitui** `.github/AI_PROJECT_RULES.md`. As Rules continuam a ser a fonte de verdade operacional e devem ser lidas **primeiro**, antes desta Bíblia.
>
> **Hierarquia obrigatória em caso de conflito:**
> 1. estado real atual do GitHub / produção;
> 2. `.github/AI_PROJECT_RULES.md`;
> 3. esta Bíblia Mestra;
> 4. handoffs e bíblias históricas;
> 5. memória/conversas antigas.
>
> As duas bíblias originais e o handoff continuam no repositório como arquivo histórico. **Não apagar nem tratar como lixo.** Esta Bíblia existe para evitar que uma nova IA tenha de reconstruir o contexto a partir de vários documentos.

---

# 1. LEITURA RÁPIDA: O QUE UMA NOVA IA PRECISA SABER

## 1.1 Projeto
O **Chuta Pra Canto (CPC)** é um projeto editorial de futebol em português, com foco em notícias, opinião/análise, vídeo e futuro enriquecimento com dados estruturados de futebol.

Arquitetura atual:
`GitHub` → `Cloudflare Pages` / `Worker` → produção `chutapracanto.com`.

Existe um Cloudflare Worker separado chamado **`chutapracanto`**. Não confundir com o ficheiro `_worker.js` do repositório.

## 1.2 Estado atual, sem ambiguidades

### JÁ IMPLEMENTADO / FECHADO
Estas áreas não precisam de ser reabertas ou refeitas sem nova necessidade concreta:

- Fundação técnica, SEO e segurança.
- OG/Twitter/social preview.
- Índice de notícias e eliminação do carregamento N+1.
- Relacionados/"Continua a ler".
- Taxonomia e autores.
- Separação técnica Notícias vs Opinião.
- Contacto/FormSubmit.
- Footer/header uniformizados.
- Política Editorial e privacidade técnica para AdSense.
- Pesquisa de imagens Openverse + Wikimedia.
- Migração para `.com`.
- Sticky editorial e partilha pós-migração.
- Mobile de Notícias com cartões verticais 16:9, através da PR #24.
- Arquivo histórico Framer: 213 URLs encontradas, 179 importadas, 34 duplicadas/ignoradas, 0 falhas.
- Resultado final do arquivo: 233 Markdown, sendo 232 notícias + 1 opinião.
- `content/noticias-index.json`: 233 entradas, sem paths/slugs duplicados ou em falta, ordenação mais recente → mais antiga.
- `sitemap.xml`: 241 URLs, 233 artigos + 8 páginas públicas.
- Workflow temporário de importação Framer removido.
- AdSense técnico preparado, mas aprovação/operação ainda não concluídas.
- Search Console/Google News ainda são fases futuras.

### ATIVO AGORA
**Performance mensurável / PR #25.**

PR #25:
- título: `perf: primeira passagem de LCP mobile`;
- branch: `perf-lcp-first-pass`;
- aberta;
- não mergeada;
- head atual conhecido: `5e1ec62ed59c98394956b0cc6010eed4969f273c`;
- base original: `1b78f71fc2b15d8766def78df0b89ea9d05e6f21`;
- a main atual já avançou depois dessa base, portanto **não assumir que a PR está atualizada/mergeável**;
- estado atual: **não fazer merge ainda**.

Problema em aberto:
- o shell inicial do artigo foi comprovado em HTML RAW;
- não existe duplicação do shell após JavaScript;
- LCP melhorou em várias medições;
- permanece um **CLS 0,571** numa medição Lighthouse desktop de artigo;
- a causa temporal desse CLS ainda não foi comprovada;
- a medição PSI/Lighthouse de Opinião que deu bons números é inválida porque carregou uma mensagem de erro em vez do artigo;
- o último diagnóstico externo pediu um Chrome Performance trace para identificar o shift e investigar `--article-progress`;
- não houve alteração de código nesse último diagnóstico.

### ÚLTIMO PONTO DE CONTINUIDADE
A última ação desta linha de trabalho foi enviar ao Codex um prompt para:
- ler as Rules;
- investigar o CLS com Chrome Performance;
- identificar timestamp, elemento afetado e causa;
- repetir a medição para confirmar;
- investigar `--article-progress`;
- testar a anomalia da opinião no Lighthouse;
- não alterar código/commit/merge durante o diagnóstico.

Se a resposta do Codex ainda não estiver registada, **continuar a partir daí**.

---

# 2. REGRAS OPERACIONAIS ESSENCIAIS

## 2.1 Antes de qualquer ação
Ler:
`.github/AI_PROJECT_RULES.md`

Depois:
1. verificar main;
2. verificar PRs relevantes;
3. verificar commits/deployments;
4. confirmar se o problema ainda existe;
5. implementar apenas se necessário;
6. validar;
7. corrigir;
8. validar novamente;
9. avançar quando houver ação autónoma possível.

Nunca reiniciar o projeto por falta de contexto.

## 2.2 A utilizadora autorizou execução direta
É permitido e esperado:
- inspecionar GitHub;
- editar ficheiros;
- criar branches;
- criar commits;
- criar PRs;
- fazer merge quando seguro;
- validar;
- corrigir;
- continuar para a próxima etapa.

Não terminar com "diz-me para seguir" quando o passo seguinte pode ser executado diretamente.

## 2.3 Codex
Codex não é executor por defeito.

Usar diretamente GitHub para:
- HTML;
- CSS;
- JS;
- JSON;
- Markdown;
- documentação;
- alterações que não exigem browser/local/Cloudflare.

Reservar Codex para:
- Chrome/DevTools;
- Lighthouse/PageSpeed quando necessário;
- browser/local;
- terminal;
- E2E;
- Cloudflare Dashboard/CLI;
- sessões/credenciais locais.

Todo prompt para Codex deve:
- mandar ler `.github/AI_PROJECT_RULES.md`;
- indicar repo/branch/tarefa;
- indicar limites;
- pedir validação;
- estar em bloco de código quando enviado à utilizadora.

## 2.4 Limites permanentes
- Não criar/enviar ZIPs.
- Não criar/enviar documentos/imagens/anexos para a utilizadora nesta conversa.
- Não pedir screenshots, documentos ou imagens.
- Não inventar conteúdo editorial, datas, resultados, autores, estatísticas ou imagens.
- Não alterar secrets/passwords/configuração sensível sem necessidade.
- Não introduzir custos, upgrades ou créditos pagos.
- CPC deve usar recursos gratuitos.
- PR fechada sem merge não é produção.
- Deployment successful não prova UX correta.
- Não duplicar soluções.
- Não fazer refactors desnecessários.
- Não repetir importação Framer.
- Não reabrir PRs antigas sem necessidade.

---

# 3. ESTADO REAL DO GITHUB NO MOMENTO DA CONSOLIDAÇÃO

**Main verificada no momento da consolidação:** `c6bee91789b98fba07ad88d8f013b42e5e2f8b5e`.

**HEAD atual após a consolidação desta documentação:** passa a incluir os commits de consolidação da Bíblia Mestra e atualização das Rules; verificar o ref `main` diretamente antes de qualquer nova implementação.

Esse SHA é posterior às duas bíblias originais e ao handoff. Isto é importante: os documentos históricos podem ter um HEAD antigo.

Commits recentes observados incluem:
- criação da Bíblia da segunda conversa;
- criação da Bíblia da primeira conversa;
- novos uploads/conteúdo;
- `Atualizar índice de notícias` em `c6bee917...`.

Portanto, **o GitHub atual vence números/estados antigos dos documentos**.

### PR #25
Confirmada diretamente:
- state: open;
- merged: false;
- draft: false;
- mergeable: false no estado consultado;
- 15 commits;
- 12 ficheiros alterados;
- 248 adições / 59 remoções;
- head `5e1ec62...`;
- base SHA original `1b78f71...`.

Não assumir que o branch contém tudo o que entretanto entrou em main.

---

# 4. HISTÓRICO DE PRODUÇÃO

PRs mergeadas:
- #1 `6cdb4e4`
- #2 `76e4e995`
- #3 `7a3187b8`
- #4 `293214af`
- #5 `31d58880`
- #6 `dfdaf5b7`
- #7 `fd76abea`
- #8 `8635cbaa`
- #9 `28b7eb3b`
- #10 `81dd6523`
- #11 `707ca08c`
- #12 `af36cbac`
- #13 `42155e56`
- #14 `20bcac87`
- #15 `c79b153c`
- #16 `81d65d1d`
- #18 `510bebbc`
- #20 `05ca8862`
- #22 `9855a09b`
- #24 `d1ac249d0cd5fee66e25d7162a97872dc82e28e3`

Fechadas sem merge:
- #17
- #19
- #21
- #23

Não tratar essas quatro como produção.

---

# 5. O QUE CADA FASE JÁ RESOLVEU

## #1 — Social preview
OG/Twitter, leitura pública para crawlers e correções de preview.

## #2 — Performance estrutural de Notícias
Índice `content/noticias-index.json`, redução do N+1 e utilização do índice por Home/Notícias/Admin.

## #3 — Relacionados
"Continua a ler", três relacionados e exclusão do artigo atual.

## #4 — Fundação SEO/segurança
Páginas institucionais, 404, robots, sitemap, canonical, NewsArticle/BreadcrumbList, DOMPurify e proteções do Admin/uploads.

## #5 — UX mobile/media
Header mobile, proporções/prioridades de imagens, feeds adiados, limite de vídeos, YouTube por interação, labels/filtros/foco/áudio, marked/Turndown fixados.

## #6 — Taxonomia/autores
IDs estáveis, categorias, tipos e autores.

## #7 — Notícias vs Opinião
Separação técnica.

## #8 — Identidade editorial
authorId, modified/publication e schema por tipo.

## #9 — URL/contacto/footer
Estado em URL, Back/Forward, contacto, honeypot/CAPTCHA FormSubmit, privacidade e footer.

## #10 — Header/footer/logo
Uniformização e logo fluido.

## #11 — FormSubmit
Endpoint ativo, destino não exposto.

## #12 — Ordem/taxonomia dinâmica
publishedAt, ordenação, filtros, pesquisa normalizada, papéis e logo responsivo.

## #13 — Opinião
Página pública de Opinião.

## #14 — Admin/Crónicas/imagens
Separação Admin, Nova Crónica, Openverse, URLs externas, cache de uploads.

## #15 — Política Editorial/AdSense
Política Editorial, privacidade AdSense e sitemap.

## #16 — Pesquisa de imagens
Openverse + Wikimedia, deduplicação e fonte original.

## #18 — Correção de Opinião/autoria
Opinião funcional e Pedro Soares como autor quando aplicável.

## #20 — Migração .com
Domínio oficial:
`https://chutapracanto.com`

Canonical/OG/robots/sitemap/Worker/Admin/workflows/ads.txt adaptados.

Não reintroduzir pages.dev como URL canónica/editorial.

## #22 — Sticky/partilha pós-migração
Sticky progressivo, navegação Notícias/Opinião, partilha compacta e base futura de competições.

## #24 — Reaplicação atual do sticky/mobile
- sticky editorial progressivo;
- H1 reduz progressivamente;
- header opaco no scroll;
- artigo em fluxo normal;
- mobile Notícias vertical;
- imagens 16:9;
- desktop preservado.

Validação:
- 320/390/768/1280 sem regressões visuais relevantes;
- consola inconclusiva por limitação do browser usado.

---

# 6. IMPORTAÇÃO FRAMER — FECHADA

Não repetir.

Resultado:
- 213 URLs únicas;
- 179 importadas;
- 34 duplicadas/ignoradas;
- 0 falhas;
- 232 notícias + 1 opinião;
- 233 entradas no índice;
- 241 URLs no sitemap;
- workflow temporário removido.

Importação:
`6701b981302dea5955047812e83e92e6a5c17dbe`

Remoção do workflow:
`ced7e4113b9a4fb76102c2a32cd9325fc84ce8bd`

O importer pode permanecer apenas como valor de auditoria/manutenção.

Não alterar conteúdo histórico sem motivo.

---

# 7. CONTEÚDO E MODELO EDITORIAL

## Tipos
- news
- opinion
- video
- podcast quando aplicável

## Autores
**Rute Costa**
- Moderadora e Locutora.

**Pedro Soares**
- Treinador;
- Opinião Crítica;
- Análise.

Não transformar opinião em notícia.

## Regras editoriais
Preservar:
- publishedAt;
- slug;
- autor;
- categoria;
- imagem;
- conteúdo;
- sourceUrl quando existente;
- canonical;
- tipo editorial.

Não inventar dados.

---

# 8. ÍNDICE, PESQUISA E SITEMAP

## Índice
`content/noticias-index.json`

Usado para:
- Home;
- Notícias;
- Admin;
- pesquisa;
- shell inicial de artigos no trabalho de performance.

Ordenação:
**mais recente → mais antigo**.

## Pesquisa
Deve trabalhar sobre o índice próprio, com normalização de acentos e suporte ao arquivo histórico.

## Sitemap
Atualmente o último estado documentado é 241 URLs, mas a nova IA deve verificar o ficheiro real no GitHub porque a main avançou depois das bíblias.

Regra permanente:
**depois de workflows que escrevem conteúdo, verificar explicitamente índice e sitemap.**

---

# 9. DOMÍNIO, SEO E SOCIAL

Domínio oficial:
`chutapracanto.com`

Já existe:
- canonical;
- OG/Twitter;
- NewsArticle para news;
- Article para outros tipos;
- BreadcrumbList;
- robots;
- sitemap;
- authors;
- datas;
- tipos editoriais;
- relacionados.

Qualquer alteração deve verificar:
1. URL;
2. canonical;
3. title;
4. description;
5. image;
6. absolute URL;
7. breadcrumbs;
8. schema;
9. tipo editorial.

---

# 10. ADSENSE

Conta existente:
`rute-costa_@hotmail.com`

Publisher ID:
`ca-pub-1556367149800029`

Decisão:
**não criar segunda conta.**

Método escolhido:
fragmento do código AdSense.

Também existe:
`ads.txt`

A parte técnica foi preparada, mas:
- aprovação não deve ser assumida;
- crawler/revisão/políticas continuam a ser acompanhados;
- Search Console ainda deve ser validado;
- consentimento/CMP pode ser necessário conforme tráfego e implementação.

Não alterar AdSense durante a correção de performance salvo necessidade concreta.

---

# 11. PERFORMANCE — CONTEXTO COMPLETO

## Baseline de produção antes da #25

Lighthouse/PageSpeed 13.5.0, lab data.

### Home
- mobile run 1: score 60, FCP 5,7 s, LCP 17,8 s, CLS .025, TBT 60 ms;
- mobile run 2: score 88, FCP 3,0 s, LCP 3,2 s, CLS .034, TBT 80 ms;
- desktop: score 81, FCP .9 s, LCP 3,2 s, CLS .003, TBT 0 ms.

### /noticias
- mobile: score 59, FCP 6,2 s, LCP 18,1 s, CLS 0, TBT 30 ms;
- desktop: score 81, FCP 1,0 s, LCP 3,1 s, CLS .006, TBT 40 ms.

### artigo
- mobile run 1: score 68, FCP 2,7 s, LCP 18,2 s, CLS .062, TBT 40 ms;
- mobile run 2: score 58, FCP 5,8 s, LCP 19,0 s, CLS 0, TBT 50 ms;
- desktop: score 83, FCP .8 s, LCP 2,9 s, CLS .042, TBT 20 ms.

### Opinião
- mobile: score 58, FCP 5,9 s, LCP 18,2 s, CLS 0, TBT 60 ms;
- desktop: score 81, FCP .9 s, LCP 3,2 s, CLS .020, TBT 0 ms.

INP de campo: No Data. Não tratar como zero.

## Diagnóstico de rede
- grafo de artigo: ~16 URLs;
- critical path máximo ~679 ms;
- índice ~168 KiB, ~469–545 ms;
- Markdown ~2,15 KiB, ~589–615 ms;
- authors/types ~0,6 s cada;
- isto não demonstrou waterfall suficientemente longo para explicar 18–19 s;
- render-blocking opportunities ~1,94–2,85 s;
- Google Fonts ~750 ms;
- Font Awesome ~1350 ms;
- style.css ~150 ms;
- uma captura isolada mostrou Google/DoubleClick pagead HTTP 500, não provado como causa;
- PSI a mostrar TTFB 0 ms não é TTFB real fiável.

## Logo
`/images/logo.png`
- ~2.03 MiB;
- 1536×1024;
- mostrado ~137×91 px mobile.

É um problema objetivo de eficiência, mas não foi provado como causa única do LCP. Não alterar cegamente antes de separar variáveis.

---

# 12. PR #25 — PRIMEIRA PASSAGEM

Branch:
`perf-lcp-first-pass`

Alterações:
- Google Fonts deixou de usar `@import` bloqueante;
- Google Fonts não bloqueante;
- Font Awesome não bloqueante;
- preconnects;
- logo global async/low;
- footer logo lazy/async/low;
- primeira imagem de /noticias eager/high;
- restantes lazy/low;
- decoding async.

Ficheiros:
- index.html
- noticias.html
- noticia.html
- opiniao.html
- sobre.html
- contacto.html
- privacidade.html
- termos.html
- politica-editorial.html
- style.css

Não alterou conteúdo, índice, sitemap, secrets ou arquitetura de dados.

---

# 13. PR #25 — SEGUNDA PASSAGEM / SHELL

Problema:
o H1 era criado após JavaScript carregar o índice e podia tornar-se LCP tardio.

Implementado:
`_worker.js` lê `content/noticias-index.json` para o slug e injeta no HTML inicial:
- category;
- type;
- H1;
- subtitle;
- byline;
- date;
- hero.

`noticia.html` passou a reutilizar o shell em vez de destruir/recriar os elementos.

Validação estática:
- Worker PASS;
- JS de noticia.html PASS;
- integração PASS;
- pipeline PASS.

---

# 14. PR #25 — SHELL RAW E BROWSER

Preview:
`https://1f72ec57.chutapracanto.pages.dev`

Deployment:
`1f72ec57-7737-43f0-8731-3b241c765e1d`

Commit:
`5e1ec62...`

RAW HTML:
- HTTP 200;
- sem JS;
- H1 presente;
- uma .article-heading;
- hero presente;
- eager/high;
- sem duplicação.

Opinião:
- título correto;
- existe U+200B invisível no início do título raw, removendo-o lê-se "Onde a Paixão Virou Guerra".

Headers observados:
- Content-Type HTML;
- Cache-Control public, must-revalidate, max-age=0;
- Server cloudflare;
- sem Content-Length;
- sem CF-Cache-Status.

Browser:
- um único H1;
- um único hero;
- Markdown completo;
- share funciona;
- relacionados funcionam;
- navegação funciona.

Conclusão:
**shell não está a duplicar conteúdo.**

---

# 15. PR #25 — CLS/LCP ATUAL

Medição válida de artigo desktop:
- Performance 74;
- FCP 1,0 s;
- LCP 1,2 s;
- CLS **0,571**;
- TBT 0 ms.

Lighthouse atribuiu aproximadamente:
- 0,323 ao container principal do artigo;
- 0,206 ao body.

Também assinalou:
- logo sem dimensões;
- fontes em auditoria de layout.

Ainda não provado:
- timestamp;
- causa temporal;
- shell como causa;
- fonte como causa;
- `--article-progress` como causa;
- sticky/scroll como causa.

Opinião:
o resultado Lighthouse/PSI com Performance 92 / LCP 1,7 / CLS .001 é **inválido**, porque o DOM continha "Não foi possível carregar esta notícia".

Browser normal da opinião:
**PASS.**

### Regra de diagnóstico
Não corrigir CLS por palpite.

Fluxo:
`trace → causa comprovada → correção mínima → nova medição`.

---

# 16. CSS/PERFORMANCE QUE MERECE ATENÇÃO

Na branch #25 existem regras progressivas envolvendo `--article-progress`:
- padding do article heading;
- font-size/margins do H1;
- font-size/max-height/margin do resumo;
- opacity de tags/byline;
- background/border/backdrop-filter.

São funcionalidades intencionais do sticky editorial.

Não acusar essas regras de causarem CLS sem evidência temporal.

Hero reserva 16:9 por CSS, mas não tem width/height HTML explícitos.

---

# 17. ÚLTIMO DIAGNÓSTICO EXTERNO

Prompt enviado ao Codex:
- Chrome Performance;
- 1280 px;
- Layout Shifts;
- timestamp;
- elemento afetado;
- elemento causador;
- relação shell/JS/fontes/hero/header;
- repetir;
- investigar `--article-progress`;
- tentar esclarecer PSI da opinião;
- não alterar código.

Resultado mais recente conhecido:
- shell raw PASS;
- H1 PASS;
- hero PASS;
- duplicação PASS;
- CLS .571;
- causa temporal ainda não comprovada;
- opinião browser PASS;
- opinião PSI inválida;
- zero alterações/commits/merge.

**É daqui que se deve continuar se o resultado ainda não tiver sido atualizado.**

---

# 18. NÃO FAZER AGORA

- não fazer merge da #25;
- não alterar código apenas por hipótese;
- não mexer já no logo de 2 MiB;
- não remover aspect-ratio do hero;
- não inventar width/height;
- não alterar conteúdo editorial;
- não alterar índice/sitemap por causa da #25;
- não alterar secrets;
- não reimportar Framer;
- não reabrir #17/#19/#21/#23;
- não duplicar #22/#24;
- não tratar PSI inválido da opinião como erro editorial.

---

# 19. WORKFLOW EDITORIAL E CONTEXTO DE NEGÓCIO

O CPC começou como projeto de podcast, mas a estratégia atual privilegia alcance através de Reels/Shorts e conteúdo editorial, com podcasts como etapa posterior.

Workflow de vídeo:
- um jogo = antevisão + rescaldo;
- utilizadora fornece hook + CTL;
- Pedro fornece análise/opinião;
- utilizadora edita, corta e acelera;
- antevisão inclui clubes, data/hora/canal e estatísticas básicas;
- rescaldo usa highlights/golos e procura ficar abaixo de 1 minuto.

Formatos:
- "Vale o preço" para jogadores da janela de transferências;
- Pódio semanal de estatísticas;
- curiosidades rápidas;
- evitar formatos hipotéticos "E se?" quando podem confundir o público.

Site:
- notícias;
- Shorts/Reels;
- vídeo/podcast;
- Spotify;
- equipas de moderação/análise;
- redes sociais.

A estratégia geral da utilizadora é:
**automatização + facilidade + rentabilidade + atualização tecnológica**, sem perder estabilidade nem entrar em custos obrigatórios.

---

# 20. ADMIN / ARQUITETURA DE CONTEÚDO

Existe Admin com:
- notícias;
- crónicas/opinião;
- autores;
- taxonomia;
- pesquisa de imagens;
- publicação via GitHub/Worker;
- preservação de type.

Não alterar o fluxo de publicação sem necessidade.

O conteúdo real está nos Markdown. Índice e sitemap são artefactos derivados.

Após workflows que escrevem conteúdo:
1. verificar Markdown;
2. verificar índice;
3. verificar sitemap;
4. verificar ordenação;
5. verificar pesquisa;
6. verificar regressões.

---

# 21. CLOUDFLARE

Dois componentes:
1. Cloudflare Pages;
2. Worker separado `chutapracanto`.

Não confundir:
- `_worker.js` é código do repositório;
- Worker Cloudflare "chutapracanto" é serviço separado.

Não migrar arquitetura para Workers só porque documentação atual recomenda Workers para novos projetos. A arquitetura CPC existente deve ser preservada até haver razão concreta.

---

# 22. SUPABASE

Supabase está conectado ao ChatGPT, mas não é parte necessária da arquitetura atual.

Só introduzir se resolver problema concreto.

Sempre:
- verificar docs atuais;
- usar plano gratuito;
- validar RLS/segurança;
- testar a integração.

Não usar por disponibilidade apenas.

---

# 23. ROADMAP MESTRE

## FASE 0
Fundação técnica/SEO/segurança — CONCLUÍDA.

## FASE 1
Social preview — CONCLUÍDA.

## FASE 2
Performance estrutural de Notícias — CONCLUÍDA.

## FASE 3
Taxonomia/autores, Notícias vs Opinião, relacionados, contacto, política editorial — CONCLUÍDA.

## FASE 4
Domínio/monetização técnica — .com concluído; operação AdSense/Search Console continua.

## FASE 5
UX editorial/sticky/partilha/mobile — tecnicamente concluída com #22 + #24; validação/performance ainda influencia a passagem seguinte.

## FASE 6
Performance mensurável — **ATIVA**.
- concluir diagnóstico #25;
- corrigir apenas causas comprovadas;
- validar Preview;
- merge;
- validar produção;
- medir novamente.

## FASE 7
Dados estruturados de futebol — futura.
- competições;
- equipas;
- resultados;
- classificações;
- calendários;
- fonte/API;
- licenças/rate limits;
- gratuito;
- nunca inventar dados.

## FASE 8
Google News / Search Console — futura.
- Search Console;
- sitemap;
- robots;
- canonical;
- Publisher Center quando útil;
- labels;
- logo;
- acompanhamento.

## FASE 9
Monetização — progressiva.
- AdSense;
- consentimento/CMP;
- publicidade/parcerias;
- preservar velocidade.

## FASE 10
Crescimento/distribuição.
- SEO;
- recirculação;
- Shorts/Reels;
- podcasts;
- newsletter/parcerias;
- audiência recorrente.

---

# 24. DECISÕES DE LONGO PRAZO

## Newsletter
Existe como possibilidade futura, não prioridade imediata.

## Competições
Arquitetura futura documentada em:
`docs/arquitetura-futura-competicoes.md`

Não implementar apenas porque existe documentação.

## Dados/API
Antes de qualquer API:
- verificar preço;
- termos;
- licença;
- rate limit;
- cobertura;
- fiabilidade;
- opção gratuita.

## Monetização
Nunca sacrificar performance/UX para anúncios.

---

# 25. REGRAS DE NÃO REPETIÇÃO

Nunca:
- reimportar Framer sem nova necessidade;
- reabrir PRs antigas sem motivo;
- repetir #19/#21;
- repetir #23 sobre a main sem necessidade;
- criar segunda conta AdSense;
- introduzir Supabase sem benefício;
- migrar arquitetura sem evidência;
- gastar Codex em tarefas que podem ser feitas diretamente;
- assumir que uma branch antiga contém o estado atual de main;
- assumir que números históricos ainda são atuais;
- assumir que um deployment successful valida UX;
- assumir que "No Data" é zero;
- assumir que uma hipótese de performance é uma causa.

---

# 26. HIERARQUIA DE DOCUMENTAÇÃO E CONTINUIDADE

### Nível 1 — GitHub/produção atual
É o que está realmente implementado.

### Nível 2 — `.github/AI_PROJECT_RULES.md`
Regras operacionais obrigatórias.

### Nível 3 — Esta Bíblia Mestra
Contexto consolidado e orientação de continuidade.

### Nível 4 — Handoff atual
`.github/AI_HANDOFF_2026-09-24.md`
Contém detalhes técnicos da frente de performance e o último ponto de continuidade.

### Nível 5 — Bíblias anteriores
- `bíblia primeira conversa.md`
- `bíblia segunda conversa.md`

São fontes históricas e de recuperação, não devem vencer o estado atual.

### Nível 6 — Memória/conversas antigas
Usar apenas para recuperar decisões que não estejam documentadas, sempre confirmando no GitHub quando forem técnicas.

---

# 27. COMO UMA NOVA IA DEVE COMEÇAR

1. Ler `.github/AI_PROJECT_RULES.md`.
2. Ler esta Bíblia Mestra.
3. Verificar main real.
4. Verificar PR #25 e outras PRs abertas.
5. Verificar deployments.
6. Se #25 continuar aberta e o trace continuar pendente, continuar o diagnóstico.
7. Se houver causa comprovada, implementar correção mínima.
8. Validar sintaxe.
9. Validar Preview.
10. Repetir Lighthouse.
11. Comparar LCP/CLS.
12. Só depois fazer merge.
13. Validar produção.
14. Atualizar Rules e esta Bíblia com o novo estado.
15. Avançar para a próxima fase.

Não perguntar "o que queres fazer agora?" se este fluxo já estiver desbloqueado.

---

# 28. CHECKLIST DE FECHO DE QUALQUER ALTERAÇÃO

[ ] Rules lidas  
[ ] main/PRs/commits/deployment verificados  
[ ] problema confirmado  
[ ] alteração mínima  
[ ] sem duplicação  
[ ] sintaxe  
[ ] links/referências  
[ ] conteúdo/datas/slugs/autores/imagens  
[ ] canonical/OG/schema  
[ ] índice  
[ ] sitemap  
[ ] Preview  
[ ] função principal  
[ ] regressões  
[ ] PR state  
[ ] main após merge  
[ ] produção  
[ ] serviço externo atualizado quando aplicável  
[ ] documentação atualizada

---

# 29. NOTA SOBRE AS DUAS BÍBLIAS ANTERIORES

As duas bíblias foram criadas por conversas diferentes com o mesmo objetivo: evitar perda de contexto entre IAs.

A primeira é mais extensa e contém:
- workflow editorial;
- história do projeto;
- decisões de longo prazo;
- PRs;
- roadmap;
- continuidade;
- lessons learned.

A segunda é mais condensada e atualiza:
- .com;
- AdSense;
- Framer;
- índice/sitemap;
- sticky;
- Supabase;
- custos;
- regras de execução.

Ambas têm informação útil, mas sobrepõem várias secções.

**Não devem ser usadas simultaneamente como duas fontes de verdade concorrentes.**
Esta Bíblia Mestra organiza a informação comum e aponta para elas como arquivo.

---

# 30. REGRA FINAL

O CPC é um projeto contínuo.

A IA deve agir como agente de continuidade:

**LER → VERIFICAR → IMPLEMENTAR → TESTAR → CORRIGIR → TESTAR → VALIDAR PRODUÇÃO → DOCUMENTAR → AVANÇAR**

Não perder trabalho já feito.
Não repetir trabalho fechado.
Não inventar dados.
Não introduzir custos.
Não trocar arquitetura sem razão.
Não sacrificar funcionalidade por métricas.
Não parar quando a próxima ação autónoma estiver disponível.

---

# 31. ARQUIVO INTEGRAL — BÍBLIA DA PRIMEIRA CONVERSA

A versão original permanece abaixo para garantir recuperação sem perda de informação. Em caso de conflito, aplicar a hierarquia definida nesta Bíblia Mestra.

# CHUTA PRA CANTO — BÍBLIA DA PRIMEIRA CONVERSA

**Ficheiro de continuidade entre IAs / conversas / executores**  
**Projeto:** Chuta Pra Canto  
**Repositório:** `chutapracanto/chutapracanto`  
**Idioma operacional:** PT-PT  
**Data desta consolidação:** 2026-09-24  
**Natureza:** documento histórico + operacional de continuidade da primeira grande conversa técnica deste projeto.

---

## 0. OBJETIVO DESTE FICHEIRO

Este ficheiro existe porque o projeto Chuta Pra Canto passou por várias conversas de ChatGPT/Codex e cada conversa pode terminar por limite de contexto, limite de uso ou mudança de sessão.

A função desta Bíblia é permitir que **qualquer IA, agente, ChatGPT, Codex ou executor técnico que pegue no projeto consiga reconstruir o contexto essencial sem depender da memória de uma conversa específica**.

Este documento deve ser lido como:

1. contexto histórico da primeira conversa;
2. registo das decisões tomadas nela;
3. registo do que foi efetivamente implementado ou encaminhado;
4. mapa dos problemas que foram encontrados;
5. mapa dos planos e fases;
6. conjunto de regras para não repetir trabalho nem destruir funcionalidades;
7. ponte para as regras operacionais atuais em `.github/AI_PROJECT_RULES.md`.

**IMPORTANTE:** este documento não substitui a verificação do estado real do GitHub.

A regra absoluta é:

> **GitHub, commits, branches, PRs e deployments verificáveis prevalecem sobre memória, conversas antigas, este documento e qualquer relato textual.**

GitHub organiza trabalho em branches, commits e pull requests precisamente para manter histórico verificável e permitir revisão antes de integrar alterações. Ver documentação oficial: https://docs.github.com/en/pull-requests/concepts/writing-code-for-a-project

---

# 1. IDENTIDADE DO PROJETO

## 1.1 Marca

**Chuta Pra Canto**

Projeto editorial/desportivo focado principalmente em futebol português e conteúdo relacionado.

O projeto nasceu com forte componente de vídeo/podcast, mas a estratégia evoluiu para uma presença editorial própria com site, Notícias, Opinião/Crónicas, vídeos curtos, podcasts e distribuição social.

## 1.2 Site

Durante o desenvolvimento foram utilizados:

- Cloudflare Pages;
- Cloudflare Worker / Advanced Mode;
- GitHub;
- conteúdo Markdown;
- índices JSON;
- workflows GitHub Actions;
- integração AdSense;
- SEO técnico;
- Open Graph/Twitter Cards;
- JSON-LD;
- pesquisa de imagens abertas;
- importação histórica de conteúdo do antigo Framer.

O domínio público passou por uma fase técnica em `.com`. A decisão operacional mais recente da utilizadora é que, quando a frente de domínio for retomada, **`.pt` deverá ser tratado como domínio principal e `.com` deverá redirecionar diretamente para `.pt`**. Essa decisão futura não deve ser confundida com o estado técnico histórico do #20.

## 1.3 Repositório

`chutapracanto/chutapracanto`

Estrutura relevante conhecida:

- `index.html`
- `noticias.html`
- `noticia.html`
- `opiniao.html`
- `politica-editorial.html`
- `404.html`
- `style.css`
- `_worker.js`
- `content/noticias/`
- `content/opiniao/`
- `content/noticias-index.json`
- `content/taxonomia.json`
- `authors.json`
- `sitemap.xml`
- `robots.txt`
- `ads.txt`
- `admin/`
- `.github/workflows/`
- `.github/AI_PROJECT_RULES.md`

Não assumir que esta lista continua exaustiva. Verificar o repositório.

---

# 2. COMO ESTA BÍBLIA DEVE SER USADA

## 2.1 Primeiro passo obrigatório

Antes de implementar qualquer coisa:

1. ler `.github/AI_PROJECT_RULES.md`;
2. verificar `main`;
3. verificar PRs abertas;
4. verificar branches relevantes;
5. verificar commits recentes;
6. verificar se existe deployment Preview associado ao trabalho;
7. identificar se outra IA/Codex já está a trabalhar na mesma tarefa.

## 2.2 Não confiar cegamente neste documento

Este documento é uma ponte histórica.

Se disser:

- “PR X está aberta”;
- “branch Y é atual”;
- “main está em SHA Z”;

isso deve ser confirmado diretamente no GitHub.

Uma branch pode ser alterada, uma PR pode ser fechada, uma alteração pode ser reaplicada noutra branch e um deployment pode deixar de representar o código atual.

## 2.3 Não duplicar trabalho

Se uma tarefa já foi implementada numa PR:

- não recriar a mesma implementação noutra branch;
- primeiro verificar se a PR foi mergeada;
- se foi fechada sem merge, verificar se o conteúdo foi reaplicado posteriormente;
- comparar os ficheiros e commits;
- só então decidir se existe trabalho real pendente.

---

# 3. PERFIL OPERACIONAL DA UTILIZADORA

A utilizadora prefere:

- PT-PT;
- instruções concretas;
- execução direta;
- pouca burocracia;
- não receber “ideias” quando existe uma ação concreta possível;
- não ter de copiar ficheiros enormes manualmente;
- não repetir trabalho já feito;
- preservar funcionalidades que já funcionam;
- automatização;
- soluções gratuitas sempre que razoável;
- atualidade técnica;
- decisões registadas para evitar perda de contexto.

Ela quer que a IA funcione como parceira técnica, não apenas como consultora.

## Regra de execução

Sempre que possível:

**inspecionar → implementar → validar → corrigir → validar novamente → só depois escalar para Codex/utilizadora.**

Não terminar uma resposta simplesmente porque existe uma ação autónoma possível.

---

# 4. REGRA DE ESCALADA ENTRE CHATGPT E CODEX

## 4.1 O que o ChatGPT deve fazer diretamente

Sempre que a ferramenta disponível permitir:

- ler GitHub;
- editar ficheiros;
- criar ficheiros;
- comparar commits;
- analisar PRs;
- rever arquitetura;
- corrigir documentação;
- implementar alterações seguras;
- validar estrutura;
- verificar histórico;
- evitar duplicações.

## 4.2 O que deve ser reservado ao Codex quando necessário

Codex é preferível quando a tarefa exige:

- browser real;
- Chrome/DevTools;
- Lighthouse em ambiente real;
- consola/network trace;
- execução local;
- terminal local;
- Cloudflare Dashboard;
- Cloudflare CLI numa sessão local;
- E2E dependente do computador/sessão da utilizadora;
- credenciais/sessões que não estejam disponíveis no ChatGPT;
- validação visual/interativa que o ambiente atual não consegue reproduzir.

## 4.3 Prompt para Codex

O prompt deve ser curto e acionável.

Deve:

1. mandar ler `.github/AI_PROJECT_RULES.md`;
2. indicar repo;
3. indicar branch/PR;
4. indicar objetivo;
5. indicar não-objetivos;
6. indicar testes;
7. pedir resultado curto;
8. nunca reproduzir este manual inteiro.

---

# 5. HISTÓRICO DA PRIMEIRA GRANDE FASE DO PROJETO

A primeira conversa acompanhou a transformação do site de uma estrutura inicial para uma aplicação editorial muito mais completa.

As áreas trabalhadas foram:

- fundação;
- UX mobile;
- previews sociais;
- notícias;
- taxonomia;
- autores;
- Notícias vs Opinião;
- conteúdos relacionados;
- identidade editorial;
- contacto;
- footer;
- Opinião/Crónicas;
- Política Editorial;
- privacidade/AdSense;
- pesquisa de imagens;
- domínio;
- partilha;
- sticky editorial;
- performance;
- importação Framer;
- arquitetura futura de competições;
- SEO;
- monetização;
- crescimento.

---

# 6. WORKFLOW EDITORIAL

## 6.1 Conteúdo

A área editorial utiliza Markdown e índices gerados.

O princípio é:

**conteúdo editorial deve permanecer separado da lógica de apresentação.**

Não inventar:

- resultados;
- datas;
- autores;
- imagens;
- estatísticas;
- nomes;
- slugs;
- dados de futebol.

Quando um dado não existe, não preencher por imaginação.

## 6.2 Notícias

A Home apresenta destaques de Notícias.

A página Notícias suporta:

- listagem;
- paginação;
- filtros;
- pesquisa;
- categorias;
- ordenação cronológica.

A ordem desejada é:

**mais recente → mais antigo.**

A indexação temporal passou a utilizar `publishedAt` ISO.

## 6.3 Opinião / Crónicas

Existe separação entre:

- Notícias;
- Opinião.

Pedro Soares é o autor técnico/editorial das crónicas de opinião quando indicado pelo conteúdo.

A navegação deve refletir corretamente a secção atual.

---

# 7. FASES JÁ DESENVOLVIDAS

## FASE 0 — Fundação

Objetivos:

- estrutura inicial;
- base técnica;
- integração GitHub/Cloudflare;
- organização do conteúdo;
- arquitetura inicial.

Estado histórico: concluída.

## FASE 1 — Open Graph / Social Preview

Objetivos:

- `og:title`;
- `og:description`;
- `og:image`;
- Twitter metadata;
- crawler access;
- melhoria dos previews sociais.

Foi encontrado um problema em que `og:image` não estava suficientemente explícito para crawlers.

Foram criadas correções relacionadas com:

- branch `fase-1-og-preview`;
- commits históricos `70f3b9d`, `5de4a25`, `c9b85b5`.

Foi validado que o crawler conseguia obter os campos esperados a partir do Markdown.

Estado histórico: concluída.

## FASE 2 — Performance / Notícias

Trabalhos:

- paginação;
- filtros;
- pesquisa;
- carregamento da Home;
- carregamento da página Notícias;
- integração do índice.

Commits históricos relevantes incluem:

- `da7eacce`;
- `9605290`.

Foram validados cenários como:

- Home com 4 notícias;
- Notícias com paginação;
- filtro SL Benfica;
- pesquisa por termos como Palhinha/Torreense.

Estado histórico: concluída tecnicamente, com performance continuando a ser uma frente contínua.

## FASE 2A — Taxonomia e autores

Foram introduzidos:

- `content/taxonomia.json`;
- papéis de `authors.json`;
- categorias;
- normalização de pesquisa;
- `publishedAt`;
- ordenação cronológica.

Estado: concluída.

## FASE 2B — Notícias vs Opinião

Separação estrutural de tipos editoriais.

Estado: concluída.

## FASE 3A — Relacionados + identidade editorial

Foi criada a lógica/estrutura para conteúdo relacionado e identidade editorial.

Estado: concluída.

## FASE 3B — URL / contacto / footer

Foram desenvolvidos:

- contacto;
- URLs;
- footer;
- elementos de navegação.

Estado: concluída.

## FASE 3C — Opinião / Crónicas

Incluiu:

- página pública de Opinião;
- Admin separado;
- + Nova Crónica;
- autoria de Pedro;
- correções do carregamento de artigos de opinião;
- sitemap.

PRs históricas:

- #13;
- #14;
- #18.

#18 foi mergeada.

Estado: concluída.

## FASE 3D — Política Editorial / Privacidade / AdSense técnico

Incluiu:

- Política Editorial;
- ligação no footer;
- privacidade atualizada para integração AdSense;
- sitemap.

PR #15.

Estado: concluída.

## FASE 3E — Pesquisa de imagens

O Admin passou a procurar imagens abertas através de fontes como Openverse e Wikimedia Commons.

Foram adicionadas:

- múltiplas consultas;
- variações com ano;
- até 30 resultados por consulta;
- deduplicação;
- acesso à fonte original.

As imagens não são copiadas automaticamente para o repositório.

PR #16.

Estado: concluída.

---

# 8. DOMÍNIO E ADSENSE

## 8.1 Migração técnica histórica

PR #20:

**Migração do site para `chutapracanto.com`.**

Incluiu referências técnicas relacionadas com:

- canonical;
- OG;
- robots;
- sitemap;
- Worker;
- Admin;
- workflow;
- `ads.txt`.

O snippet do AdSense já existia com publisher ID correto.

A parte operacional de redirects no Cloudflare ficou separada.

## 8.2 Decisão mais recente da utilizadora

Quando esta frente for retomada:

- comprar `.pt`;
- comprar também `.com`, se necessário para proteção da marca;
- tratar `.pt` como domínio principal;
- `.com` deve apontar diretamente para `.pt` através de redirect 301/308 apropriado;
- evitar cadeias de redirects;
- depois atualizar canonical, sitemap, Search Console e configurações relacionadas;
- não iniciar esta frente enquanto a utilizadora não decidir retomá-la.

A decisão atual é **adiar a frente de domínio para o próximo mês**.

Não confundir isto com o facto de a migração técnica para `.com` já ter sido implementada historicamente.

---

# 9. STICKY EDITORIAL E PARTILHA

Esta foi uma das áreas que exigiu várias iterações.

## 9.1 Partilha

A intenção final:

- um único ícone pequeno e reconhecível;
- discreto;
- colocado no final do artigo;
- alinhado à direita;
- imediatamente antes de “Continua a ler”;
- sem duplicar a partilha no topo.

Ao ativar:

- Facebook;
- WhatsApp;
- X;
- Telegram;
- copiar link.

Também foram preparados:

- Escape para fechar;
- click-outside;
- fallback de copiar;
- tracking via gtag/dataLayer quando disponível.

A decisão estética é:

> **partilha compacta e pouco intrusiva.**

## 9.2 Sticky

Foi testada uma redução progressiva do cabeçalho/título durante o scroll.

O primeiro modelo utilizava cálculos contínuos e provocou problemas de sobreposição/CLS.

A solução foi evoluindo para uma arquitetura mais segura:

- conteúdo editorial normal em fluxo;
- sticky separado;
- altura controlada;
- sem depender de cálculos contínuos de posição;
- título visível;
- subtítulo com redução de presença;
- fundo suficiente para evitar sobreposição;
- sem alterar a leitura original.

A PR #24 é a reaplicação sobre a main atual da melhoria histórica do #23.

PR #23 original:

- `mobile-sticky-editorial`;
- fechada sem merge.

PR #24:

- `mobile-sticky-editorial-rebased`;
- reaplicação sobre a main atual;
- mergeada.

Não recriar #23.

---

# 10. IMPORTAÇÃO HISTÓRICA DO FRAMER

Esta foi uma frente crítica da primeira conversa.

O site antigo utilizava:

`https://chutapracanto.framer.website`

Enquanto o novo site estava a ser construído, conteúdos continuaram a ser publicados no Framer.

Foi criada uma estratégia de importação automatizada para evitar cópia manual.

## 10.1 Regras de segurança

A importação automática teve de ser protegida porque workflows acionados por `push` poderiam escrever conteúdo sem intenção.

Foram criadas proteções:

- dry-run por defeito;
- importação real apenas com marcador explícito;
- workflow manual com confirmação `IMPORTAR`;
- nenhuma correção normal deveria disparar importação real.

## 10.2 Importação real

Foi executada uma importação autorizada.

Resultados registados:

- 213 URLs únicas encontradas;
- 179 prontas/importadas;
- 34 duplicadas/ignoradas;
- 0 falhas;
- 179 novos Markdown escritos;
- total posterior: 233 Markdown;
- 232 notícias;
- 1 opinião.

O workflow de regeneração posterior confirmou:

- `content/noticias-index.json`: 233 entradas;
- sem paths/slugs em falta ou duplicados;
- ordenação mais recente → mais antiga;
- sitemap: 241 URLs;
- 233 artigos + 8 páginas públicas.

Depois da validação:

- workflow temporário de importação removido;
- commit histórico: `ced7e4113b9a4fb76102c2a32cd9325fc84ce8bd`.

## 10.3 Regra permanente

Não repetir importação histórica sem necessidade.

Não apagar mecanismos de auditoria/importer sem verificar primeiro se ainda têm valor de manutenção.

A importação histórica Framer está operacionalmente concluída.

---

# 11. PERFORMANCE E LCP

Performance passou a ser uma frente prioritária.

Problemas observados durante a primeira conversa:

- LCP mobile muito elevado;
- CLS elevado em versões anteriores;
- H1 como elemento LCP;
- conteúdo editorial dependente de JavaScript;
- imagens;
- fontes;
- scripts;
- feeds;
- embeds.

## 11.1 Problema identificado

Em medições anteriores:

- o H1 era criado depois do carregamento do JavaScript;
- isso fazia o elemento principal da página aparecer tarde;
- Lighthouse apontava grande render delay.

## 11.2 Linha de investigação

Uma solução foi criada numa branch de performance:

`perf-lcp-first-pass`

PR #25:

**“perf: primeira passagem de LCP mobile”**

Base:

`1b78f71fc2b15d8766def78df0b89ea9d05e6f21`

HEAD:

`5e1ec62ed59c98394956b0cc6010eed4969f273c`

A abordagem incluiu:

- remover `@import` bloqueante de Google Fonts;
- carregamento não bloqueante de fontes;
- Font Awesome não bloqueante;
- logo global com prioridade reduzida;
- footer lazy;
- primeira imagem de Notícias em eager/high;
- Worker a ler `/content/noticias-index.json`;
- shell inicial da página de artigo com:
  - categoria;
  - tipo;
  - título;
  - subtítulo;
  - autoria/data;
  - imagem principal;
- preservação desse shell pelo JavaScript;
- Markdown continua a ser carregado/renderizado normalmente.

## 11.3 Estado

A PR #25 está aberta e a validação browser/Lighthouse ainda é necessária.

**Não assumir que está mergeada.**

Qualquer IA que pegue neste projeto deve consultar o GitHub antes de afirmar o estado da PR #25.

---

# 12. SEO

O projeto já trabalhou extensivamente SEO técnico.

Elementos existentes/planeados:

- title;
- meta description;
- canonical;
- Open Graph;
- Twitter Cards;
- JSON-LD;
- NewsArticle;
- Article para Opinião;
- BreadcrumbList;
- author;
- dates;
- image;
- sitemap;
- robots;
- Política Editorial no sitemap;
- artigos no sitemap.

## 12.1 Objetivo

Maximizar a capacidade de descoberta orgânica sem sacrificar:

- velocidade;
- UX;
- conteúdo;
- acessibilidade;
- estabilidade;
- manutenção.

## 12.2 Regra

SEO não deve ser tratado como conjunto de hacks.

Priorizar:

- conteúdo real;
- títulos e descrições coerentes;
- estrutura semântica;
- dados estruturados corretos;
- imagens adequadas;
- mobile;
- Core Web Vitals;
- sitemap;
- canonical;
- indexabilidade;
- links internos;
- recirculação editorial.

---

# 13. “CONTINUA A LER”

A secção de artigos relacionados deve ser automática.

Objetivo:

1. excluir o artigo atual;
2. priorizar mesmo clube/equipa;
3. depois mesmo tema/categoria/competição;
4. depois artigos recentes relevantes;
5. manter recirculação editorial;
6. fallback para artigos recentes da categoria quando não houver correspondência suficiente.

Mostrar:

- 3 artigos.

Não fazer recomendações aleatórias.

Não depender de intervenção manual para cada artigo.

---

# 14. HOME, SHORTS, YOUTUBE E SPOTIFY

A Home inclui/planeia incluir:

- destaques;
- Shorts/Reels;
- YouTube;
- podcasts;
- Spotify.

A utilizadora distribui Shorts também por:

- YouTube;
- TikTok;
- Instagram;
- Facebook.

## Regra de performance

Não carregar todos os embeds pesados de uma vez.

Preferir:

- lazy loading;
- carregamento por proximidade;
- IntersectionObserver;
- placeholders;
- carregamento apenas quando a secção é necessária.

Durante validações anteriores:

- destaques da Home apareceram;
- podcasts YouTube/Spotify apareceram ao chegar às secções;
- Shorts carregaram quando a secção foi alcançada;
- controlos de áudio apareceram;
- playback completo nem sempre pôde ser validado devido a limitações do browser.

Não assumir erro do site apenas porque um browser incorporado falhou ou fechou.

---

# 15. FUTURA ÁREA “COMPETIÇÕES”

Existe arquitetura futura para uma área:

`/competicoes`

Objetivo:

o visitante escolhe uma competição e vê dados atualizados.

Competições relevantes:

- Liga Portugal;
- Champions League;
- Europa League;
- Conference League;
- Nations League;
- Taça de Portugal;
- Taça da Liga.

A utilizadora quer foco em:

- Benfica;
- Porto;
- Sporting;
- Seleção de Portugal.

## Dados pretendidos

- época;
- classificação;
- posição;
- jogos;
- pontos;
- golos marcados;
- golos sofridos;
- resultados;
- calendário;
- eventos;
- golos;
- atualização automática.

## Épocas

Deve suportar automaticamente:

- 2026/27;
- futuras 2027/28;
- etc.

Não codificar uma época de forma que obrigue a reconstruir a área na época seguinte.

## API

Foi estudada a utilização de providers externos.

Foram analisados:

- Sportmonks;
- API-Football;
- football-data.org;
- outras fontes.

Regra atual:

**não escolher nem pagar provider sem aprovação da utilizadora.**

O projeto deve priorizar recursos gratuitos.

Quando um provider for aprovado:

- token nunca deve ficar no frontend;
- usar Worker/backend;
- cache;
- rate limiting;
- fallback;
- respeitar termos/licença;
- separar dados automáticos de texto editorial.

---

# 16. NEWSLETTER

Newsletter foi identificada como possibilidade futura.

Objetivo:

- capturar leitores recorrentes;
- enviar resumo semanal;
- criar audiência própria;
- reduzir dependência exclusiva de redes sociais.

Não confundir:

- newsletter;
- Facebook subscriptions;
- Stars;
- AdSense.

Newsletter deve ser considerada depois de a base editorial/performance/domínio estar suficientemente estável.

Preferir plataforma externa com plano gratuito quando possível.

Não implementar agora sem decisão explícita.

---

# 17. MONETIZAÇÃO

Objetivos:

- AdSense;
- publicidade;
- parcerias;
- potencial publicidade futebolística;
- crescimento de tráfego próprio.

## AdSense

A integração técnica foi preparada.

Não assumir:

- aprovação;
- receita;
- tráfego mínimo garantido;
- ranking garantido.

Quando houver mudança de domínio:

- atualizar propriedade;
- verificar Search Console;
- sitemap;
- canonical;
- AdSense conforme necessário.

## Publicidade/parcerias

A utilizadora tem interesse em:

- anunciantes relacionados com futebol;
- oportunidades de paid partnership;
- mensagens através do Facebook da página quando possível;
- soluções de baixo esforço.

Não construir um sistema comercial complexo antes de haver necessidade.

---

# 18. GOOGLE NEWS / PUBLISHER

Futuro trabalho:

- Search Console;
- Publisher Center;
- Google News;
- sitemap;
- secções;
- labels;
- logo;
- indexabilidade;
- acompanhamento.

Não prometer inclusão ou tráfego.

---

# 19. ARQUITETURA DE CONTEÚDO E ADMIN

O Admin deve facilitar:

- criação;
- edição;
- notícias;
- crónicas;
- categorias;
- autores;
- imagens;
- publicação.

Regras:

- preservar conteúdo;
- não sobrescrever dados silenciosamente;
- preservar datas quando não alteradas;
- timestamps ISO para novos conteúdos;
- pesquisa de imagens com fontes abertas;
- não copiar imagens automaticamente para o repositório sem decisão.

---

# 20. CLOUDFLARE

Existem dois conceitos que não podem ser confundidos:

1. Cloudflare Pages com Advanced Mode / `_worker.js`;
2. Worker separado chamado `chutapracanto`.

O Worker separado teve histórico de builds/configuração problemática e foi tratado como sistema independente.

Não assumir que:

`_worker.js` = Worker separado.

Antes de qualquer alteração:

- verificar Pages;
- verificar Worker;
- verificar qual deployment está a servir;
- não ressuscitar configurações antigas sem necessidade.

Secrets conhecidos pelo nome:

- `ADMIN_PASSWORD`;
- `GITHUB_TOKEN`.

Nunca pedir nem expor valores.

Nunca alterar secrets como parte de uma tarefa normal de frontend.

---

# 21. REGRA DE SEGURANÇA DE PRODUÇÃO

Antes de alterar produção:

1. identificar main;
2. identificar branch;
3. criar/usar branch de tarefa;
4. implementar alteração pequena;
5. testar;
6. gerar Preview;
7. validar;
8. só depois mergear;
9. verificar main;
10. verificar deployment de produção.

Uma PR fechada sem merge **não é produção**.

Uma branch não é produção.

Um Preview não é produção.

Um commit não significa que Cloudflare já publicou esse código.

---

# 22. HISTÓRICO DE PRs RELEVANTES

## PR #18
**Corrigir artigo de opinião e autoria de Pedro**

Estado: mergeada.

Corrigiu:

- carregamento de Opinião;
- navegação;
- autoria;
- sitemap relacionado.

## PR #19
**Melhorar navegação, leitura, partilha e desempenho das páginas editoriais**

Estado atual verificado no GitHub: fechada, não mergeada.

Não tratar como produção.

Parte do trabalho foi posteriormente reaplicada em outras PRs.

## PR #20
**Migrar site para chutapracanto.com**

Estado: mergeada.

Migração técnica para `.com`.

## PR #21
**Melhorias de navegação, sticky e partilha pós-migração .com**

Estado: fechada, não mergeada.

Não recriar automaticamente.

## PR #22
**Sticky, navegação e partilha pós-migração .com**

Estado: mergeada.

É uma das bases de produção das melhorias de UX pós-migração.

## PR #23
**Sticky editorial progressivo e mobile de Notícias**

Estado: fechada sem merge.

Branch original ficou desatualizada após a importação Framer.

## PR #24
**Sticky editorial progressivo e mobile de Notícias — base atual**

Estado: mergeada.

Reaplicou a melhoria do #23 sobre a main atual.

## PR #25
**perf: primeira passagem de LCP mobile**

Estado: aberta no momento desta consolidação, segundo verificação direta do GitHub.

Objetivo:

- reduzir LCP mobile;
- shell inicial do artigo;
- fontes não bloqueantes;
- imagens;
- carregamento inicial.

Validar antes de merge.

---

# 23. ESTADO REAL VERIFICADO NO MOMENTO DESTA BÍBLIA

Na verificação direta do GitHub realizada para esta consolidação:

- repositório: `chutapracanto/chutapracanto`;
- existe `.github/AI_PROJECT_RULES.md`;
- PR #24 está mergeada;
- PR #23 está fechada sem merge;
- PR #19 está fechada sem merge;
- PR #25 está aberta;
- existe branch `perf-lcp-first-pass`;
- existe branch `mobile-sticky-editorial-rebased`;
- existe branch `auditoria-nav-opiniao-seo`;
- existe branch `mobile-sticky-editorial`.

**HEAD atual de main verificado no manual corrente:** `0f5be13d75a94aba956e4ed1af1d09d6b2aa1060`.

Este SHA deve ser novamente confirmado antes de qualquer implementação futura.

---

# 24. FASES GLOBAIS DO ROADMAP

## FASE 1
Fundação / arquitetura.

**Estado:** concluída.

## FASE 2
Performance inicial / Notícias.

**Estado:** concluída tecnicamente.

## FASE 3
Arquitetura editorial.

Inclui:

- Notícias;
- Opinião;
- Crónicas;
- Admin;
- taxonomia;
- autores;
- política;
- privacidade;
- imagens.

**Estado:** concluída.

## FASE 4
Domínio / monetização técnica.

**Estado:** tecnicamente implementada para `.com`.

Operação de domínio final `.pt`:

**adiada.**

## FASE 5
UX editorial.

Inclui:

- navegação;
- partilha;
- sticky;
- mobile;
- relacionados.

**Estado:** implementação técnica avançada; PR #24 mergeada.

Falta sempre validação pós-merge quando uma alteração relevante entra em produção.

## FASE 6
Performance mensurável.

Prioridades:

- LCP;
- CLS;
- INP/TBT;
- imagens;
- scripts;
- fontes;
- feeds;
- YouTube;
- Spotify;
- cache;
- Worker;
- rede.

**Estado:** atual.

## FASE 7
Dados estruturados de futebol.

**Estado:** futura.

## FASE 8
Google News / Publisher Center.

**Estado:** futura.

## FASE 9
Monetização avançada.

**Estado:** futura/progressiva.

## FASE 10
Crescimento/distribuição.

Inclui:

- SEO editorial;
- recirculação;
- Shorts;
- Reels;
- podcasts;
- newsletter;
- parcerias;
- audiência própria.

**Estado:** futura/progressiva.

---

# 25. ORDEM DE PRIORIDADE RECOMENDADA

## P0 — AGORA

1. Verificar estado real de main.
2. Verificar PR #25.
3. Validar o trabalho de LCP mobile.
4. Corrigir se necessário.
5. Medir antes/depois.
6. Só mergear se houver evidência de melhoria e ausência de regressões.
7. Confirmar produção.

## P1

Depois da performance:

1. SEO técnico final;
2. JSON-LD;
3. sitemap;
4. robots;
5. Search Console;
6. imagens;
7. Discover/Google News readiness;
8. YouTube/Spotify/Shorts performance;
9. “Continua a ler” automático.

## P2

Depois:

1. domínio `.pt`;
2. redirect `.com` → `.pt`;
3. Search Console;
4. canonical;
5. sitemap;
6. AdSense;
7. Google News.

A frente de domínio está deliberadamente adiada para o próximo mês.

## P3

Depois:

1. competições;
2. API;
3. cache;
4. resultados;
5. classificações;
6. eventos.

## P4

Depois:

1. newsletter;
2. monetização avançada;
3. parcerias;
4. crescimento.

---

# 26. COISAS QUE NÃO DEVEM SER FEITAS SEM DECISÃO

Não:

- comprar serviços pagos;
- ativar custos;
- contratar API paga;
- alterar secrets;
- alterar DNS sem necessidade;
- alterar Cloudflare em produção sem validação;
- importar novamente Framer;
- apagar conteúdo;
- substituir conteúdo editorial;
- alterar autores;
- inventar dados;
- recriar PRs antigas;
- fazer grandes refactors só por estética;
- trocar stack sem necessidade;
- colocar tokens de API no frontend;
- adicionar embeds pesados sem lazy loading;
- assumir que um Preview está em produção.

---

# 27. PRINCÍPIO “FREE FIRST”

A utilizadora definiu uma preferência forte:

> **O projeto deve funcionar com recursos gratuitos sempre que houver alternativa razoável.**

Qualquer solução paga deve:

1. ser identificada como paga;
2. não ser ativada automaticamente;
3. não criar cobrança;
4. só ser considerada se não houver alternativa gratuita adequada;
5. depender de decisão explícita da utilizadora.

Isto aplica-se a:

- APIs de futebol;
- email;
- analytics;
- infraestrutura;
- Cloudflare;
- Supabase;
- plugins;
- serviços externos.

---

# 28. SUPABASE

Supabase está conectado ao ChatGPT.

Estado conhecido:

- Supabase existe;
- não está atualmente ligado diretamente ao GitHub + Cloudflare;
- pode ser usado quando houver benefício concreto;
- deve ser avaliado antes de introduzir complexidade.

Se utilizado:

- verificar documentação atual;
- validar alterações reais;
- aplicar RLS;
- preservar segurança;
- não introduzir custos.

---

# 29. CONTINUIDADE ENTRE CONVERSAS

Quando uma nova conversa começar, a IA deve assumir que:

- existe histórico fora da conversa;
- a memória pode conter apenas parte do contexto;
- este ficheiro contém contexto histórico adicional;
- `.github/AI_PROJECT_RULES.md` contém regras operacionais mais atuais;
- GitHub contém a verdade verificável.

Ordem de confiança:

### NÍVEL 1 — Estado real
GitHub / commits / PRs / deployments / testes reais.

### NÍVEL 2 — Rules
`.github/AI_PROJECT_RULES.md`.

### NÍVEL 3 — Bíblias históricas
Este ficheiro e futuras bíblias.

### NÍVEL 4 — Memória de IA
Útil para recuperar decisões, mas não suficiente para provar estado técnico.

### NÍVEL 5 — Conversas antigas
Úteis para contexto humano, mas não substituem verificação.

---

# 30. COMO LIDAR COM CONFLITOS

Se esta Bíblia disser uma coisa e GitHub mostrar outra:

**seguir GitHub.**

Se esta Bíblia e `.github/AI_PROJECT_RULES.md` divergirem:

1. verificar GitHub;
2. seguir estado real;
3. atualizar documentação relevante;
4. não apagar silenciosamente o histórico;
5. registar a reconciliação.

Se duas PRs parecem implementar a mesma coisa:

1. comparar;
2. identificar qual foi mergeada;
3. identificar se a segunda foi reaplicação sobre base atual;
4. preservar apenas a implementação necessária;
5. evitar duplicação.

---

# 31. REGRA PARA TODA NOVA IMPLEMENTAÇÃO

Antes:

**O que existe?**

Durante:

**Estou a alterar apenas o necessário?**

Depois:

**Funciona?**

E finalmente:

**Está em main/produção ou apenas numa branch/Preview?**

Nunca confundir esses quatro estados.

---

# 32. CHECKLIST TÉCNICO DE FECHO

Antes de declarar uma tarefa concluída:

- [ ] li `.github/AI_PROJECT_RULES.md`;
- [ ] verifiquei main;
- [ ] verifiquei branches;
- [ ] verifiquei PRs;
- [ ] confirmei que não estou a duplicar trabalho;
- [ ] implementei apenas o necessário;
- [ ] preservei conteúdo;
- [ ] preservei autores;
- [ ] preservei datas;
- [ ] preservei slugs;
- [ ] preservei imagens;
- [ ] verifiquei sintaxe;
- [ ] verifiquei referências;
- [ ] verifiquei SEO;
- [ ] verifiquei structured data quando aplicável;
- [ ] verifiquei Preview;
- [ ] verifiquei deployment;
- [ ] verifiquei função principal;
- [ ] verifiquei regressões;
- [ ] confirmei estado da PR;
- [ ] confirmei main depois do merge;
- [ ] confirmei produção quando aplicável;
- [ ] atualizei documentação quando houve decisão nova.

---

# 33. CHECKLIST ESPECÍFICO PARA PERFORMANCE

Quando trabalhar em performance:

- [ ] obter baseline;
- [ ] identificar elemento LCP;
- [ ] identificar causa real;
- [ ] distinguir network delay de render delay;
- [ ] verificar fonts;
- [ ] verificar CSS;
- [ ] verificar JS;
- [ ] verificar imagens;
- [ ] verificar Worker;
- [ ] verificar hydration/render;
- [ ] verificar embeds;
- [ ] não esconder conteúdo só para obter uma métrica melhor;
- [ ] medir novamente;
- [ ] comparar números;
- [ ] testar mobile;
- [ ] testar desktop;
- [ ] testar Notícias;
- [ ] testar artigo;
- [ ] testar Opinião;
- [ ] verificar Home;
- [ ] só depois decidir merge.

---

# 34. CHECKLIST ESPECÍFICO PARA CONTEÚDO IMPORTADO

Depois de qualquer importação:

- [ ] número de Markdown;
- [ ] duplicados;
- [ ] slugs;
- [ ] títulos;
- [ ] datas;
- [ ] autores;
- [ ] imagens;
- [ ] índice;
- [ ] sitemap;
- [ ] ordenação;
- [ ] pesquisa;
- [ ] filtros;
- [ ] página individual;
- [ ] links internos;
- [ ] related;
- [ ] SEO;
- [ ] nenhuma sobrescrita indevida.

---

# 35. PRINCÍPIO EDITORIAL

O site deve ser simultaneamente:

- rápido;
- claro;
- editorial;
- moderno;
- credível;
- simples;
- fácil de navegar;
- preparado para Google;
- preparado para redes sociais;
- preparado para monetização.

Evitar:

- excesso de elementos;
- popups desnecessários;
- animações pesadas;
- partilha exagerada;
- embeds carregados todos de uma vez;
- publicidade que destrua UX.

A estética desejada mantém a identidade:

- preto;
- verde/neon;
- Chakra Petch;
- Inter;
- futebol;
- tecnologia;
- visual moderno sem parecer um template genérico.

---

# 36. VISÃO DE LONGO PRAZO

O Chuta Pra Canto não deve depender exclusivamente do Facebook.

Objetivo de longo prazo:

**redes sociais → site → audiência própria → pesquisa Google → conteúdo recorrente → newsletter → monetização → comunidade.**

O Facebook/Instagram/TikTok/YouTube continuam importantes como distribuição.

Mas o site deve tornar-se um ativo próprio.

---

# 37. PRINCÍPIO DE AUTOMATIZAÇÃO

Sempre que uma tarefa repetitiva possa ser automatizada sem aumentar perigosamente a complexidade:

**automatizar.**

Exemplos:

- índice;
- sitemap;
- relacionados;
- filtros;
- pesquisa;
- importação;
- atualização de competições;
- cache;
- newsletter;
- distribuição futura.

Mas automatização nunca deve significar:

- escrita irreversível sem proteção;
- publicação de dados inventados;
- sobrescrita silenciosa;
- alteração de produção sem validação.

---

# 38. O QUE A PRIMEIRA CONVERSA ENSINOU

As principais lições acumuladas:

1. Nunca assumir que uma PR fechada está em produção.
2. Nunca confiar apenas na memória.
3. Nunca repetir uma implementação sem comparar branches.
4. Nunca fazer uma importação automática destrutiva num `push` normal.
5. Nunca esconder conteúdo apenas para melhorar Lighthouse.
6. Nunca tratar Preview como produção.
7. Nunca confundir Worker com Pages.
8. Nunca colocar secrets no frontend.
9. Nunca inventar dados editoriais.
10. Sempre validar índice e sitemap depois de workflows que escrevem conteúdo.
11. Sempre manter uma fonte de verdade documental.
12. Sempre registar decisões novas.
13. Sempre preferir automação segura.
14. Sempre usar o executor certo para a capacidade necessária.
15. Sempre fechar o ciclo: executar → verificar → corrigir → verificar.

---

# 39. INSTRUÇÃO PARA A PRÓXIMA IA

Se uma IA estiver a iniciar uma nova conversa com este projeto, deverá fazer mentalmente o seguinte:

> “Estou a entrar num projeto já desenvolvido por várias sessões. Não vou presumir que o estado descrito nos documentos históricos é atual. Primeiro vou ler `.github/AI_PROJECT_RULES.md`, depois consultar diretamente o GitHub para saber qual é a main atual, quais PRs estão abertas, quais branches existem e quais alterações estão realmente integradas. Vou preservar o que funciona, evitar duplicação e executar diretamente tudo o que o meu ambiente permitir. Só vou escalar para Codex ou para a utilizadora quando existir uma dependência externa real.”

Depois:

1. identificar a tarefa atual;
2. identificar o estado real;
3. verificar se já foi implementada;
4. implementar;
5. testar;
6. corrigir;
7. documentar;
8. só então passar à próxima frente.

---

# 40. INSTRUÇÃO ESPECIAL PARA CODEX

Sempre que esta Bíblia ou as Rules indicarem Codex:

**Codex deve ler primeiro:**

`.github/AI_PROJECT_RULES.md`

Depois:

- verificar estado real;
- executar apenas a tarefa indicada;
- não assumir que PRs antigas continuam abertas;
- não alterar secrets;
- não iniciar trabalhos fora do escopo;
- testar;
- devolver:
  - o que fez;
  - ficheiros;
  - commit;
  - Preview/deployment;
  - testes;
  - problemas restantes.

---

# 41. NÃO PERDER DECISÕES HUMANAS

Algumas decisões não são puramente técnicas.

A IA não deve alterar sem confirmação:

- identidade da marca;
- domínio principal;
- modelo de monetização;
- provider pago;
- custos;
- tom editorial;
- estratégia de conteúdo;
- estratégia de redes;
- prioridades de negócio.

Quando a utilizadora tiver tomado uma decisão explícita, essa decisão deve ser preservada na documentação operacional.

---

# 42. ESTADO DESTA BÍBLIA

Esta é a **Bíblia da Primeira Conversa**.

Ela não pretende substituir:

- GitHub;
- `.github/AI_PROJECT_RULES.md`;
- histórico de commits;
- PRs;
- deployments.

Pretende impedir que conhecimento importante da primeira grande fase seja perdido quando uma conversa termina.

Se houver uma nova decisão relevante, atualizar:

1. `.github/AI_PROJECT_RULES.md`, quando for regra operacional atual;
2. esta Bíblia, quando for contexto histórico/decisão da primeira conversa;
3. eventual nova Bíblia de outra conversa, se existir.

---

# 43. REGRA FINAL

**NÃO PERDER CONTEXTO.  
NÃO DUPLICAR TRABALHO.  
NÃO INVENTAR DADOS.  
NÃO ALTERAR PRODUÇÃO SEM VALIDAÇÃO.  
NÃO PARAR QUANDO AINDA EXISTE UMA AÇÃO AUTÓNOMA POSSÍVEL.  
VERIFICAR O GITHUB.  
EXECUTAR.  
TESTAR.  
CORRIGIR.  
DOCUMENTAR.  
CONTINUAR.**

**FIM DA BÍBLIA DA PRIMEIRA CONVERSA.**


---

# 32. ARQUIVO INTEGRAL — BÍBLIA DA SEGUNDA CONVERSA

A versão original permanece abaixo para garantir recuperação sem perda de informação. Em caso de conflito, aplicar a hierarquia definida nesta Bíblia Mestra.

# BÍBLIA — SEGUNDA CONVERSA
## Chuta Pra Canto — Handoff IA → IA
Versão: 2026-09-24
Repositório: `chutapracanto/chutapracanto`
Produção: `main`
Domínio oficial: `https://chutapracanto.com`

---

## 0. FINALIDADE DESTE DOCUMENTO

Este documento é um **handoff operacional entre IAs**.

Foi criado para preservar o contexto da **segunda conversa de trabalho** do projeto Chuta Pra Canto e impedir que uma nova IA, ChatGPT, Codex ou outro agente perca decisões, implementações, fases, problemas conhecidos, regras de execução ou trabalho já realizado.

Este documento NÃO substitui:

`.github/AI_PROJECT_RULES.md`

As rules são a **fonte de verdade operacional atual**. Esta Bíblia é a **memória estruturada da segunda conversa**, incluindo o raciocínio, a evolução do projeto, decisões e linhas de trabalho que uma IA que pegue nesta conversa deve compreender.

### Regra de precedência

Em caso de conflito:

1. estado real do GitHub;
2. `.github/AI_PROJECT_RULES.md` mais recente;
3. estado real do Cloudflare/GitHub Actions/produção;
4. esta Bíblia;
5. memória de conversas;
6. suposições.

Nunca assumir que uma implementação existe apenas porque foi mencionada numa conversa.

---

# 1. IDENTIDADE DO PROJETO

**Chuta Pra Canto (CPC)** é um projeto editorial de futebol em português, com foco em conteúdo noticioso, opinião/análise e distribuição multiplataforma.

Arquitetura atual:

```
GitHub
  ↓
Cloudflare Pages / Worker
  ↓
https://chutapracanto.com
```

Repositório:

```
chutapracanto/chutapracanto
```

Branch de produção:

```
main
```

O projeto deve continuar a privilegiar:

- custo zero sempre que possível;
- arquitetura simples;
- estabilidade;
- automatização;
- SEO;
- velocidade;
- manutenção fácil;
- preservação das funções existentes;
- mínima intervenção manual da utilizadora.

A utilizadora quer **automatização, facilidade, rentabilidade e atualização tecnológica contínua**, mas sem introduzir serviços pagos desnecessários.

---

# 2. PERFIL DE EXECUÇÃO DA UTILIZADORA

A utilizadora autorizou expressamente a IA a:

- inspecionar o GitHub;
- editar ficheiros;
- criar branches;
- criar commits;
- criar PRs;
- fazer merges quando a alteração for segura;
- validar;
- corrigir;
- continuar para a etapa seguinte.

Não é desejado o fluxo:

```
analisar → relatório → esperar "segue"
```

O fluxo desejado é:

```
detetar
→ decidir
→ implementar
→ testar
→ corrigir
→ testar novamente
→ avançar
```

Só parar quando:

- existir uma decisão que pertence realmente à utilizadora;
- for necessária uma ação manual que só a utilizadora consegue fazer;
- houver credencial/sessão externa indispensável;
- existir risco relevante de custo, publicação ou alteração irreversível que exija decisão;
- existir uma limitação técnica real.

Se a ação puder ser feita diretamente pela IA, **fazê-la**.

---

# 3. REGRA ABSOLUTA SOBRE ANEXOS NESTA CONVERSA

A utilizadora determinou explicitamente:

> Nunca criar documentos ou imagens para ela nesta conversa.

Não:

- gerar ZIPs para ela;
- criar PDFs;
- criar imagens;
- criar documentos para download;
- enviar artefactos desnecessários;
- pedir screenshots;
- pedir que envie documentos;
- pedir que envie imagens.

Se for necessário criar/alterar um ficheiro do projeto, fazê-lo **diretamente no GitHub**.

Se for necessário analisar um artefacto técnico criado automaticamente pelo GitHub Actions, a IA pode processá-lo internamente, mas **não deve entregá-lo à utilizadora como ficheiro**.

O episódio do ZIP foi um erro de fluxo e não deve ser repetido.

---

# 4. CODEX

Codex é recurso valioso porque os créditos são limitados.

Não utilizar Codex para:

- escrever HTML simples;
- editar CSS simples;
- alterar JSON;
- alterar Markdown;
- tarefas que a IA consiga executar diretamente no GitHub;
- explicações;
- planos;
- tarefas duplicadas.

Usar Codex principalmente quando forem necessários:

- browser;
- Chrome DevTools;
- Lighthouse;
- execução local;
- terminal;
- testes E2E;
- Cloudflare Dashboard/CLI;
- sessão/credencial local;
- inspeção de rede;
- tarefas que dependam do computador da utilizadora.

Quando for necessário Codex:

1. mandar ler `.github/AI_PROJECT_RULES.md`;
2. indicar exatamente a tarefa;
3. indicar limites;
4. pedir execução e validação;
5. pedir correção de erros dentro do escopo;
6. pedir resposta curta.

Prompt copiável deve estar sempre em bloco de código.

---

# 5. MIGRAÇÃO PARA .COM — CONCLUÍDA

A migração do projeto de:

```
https://chutapracanto.pages.dev
```

para:

```
https://chutapracanto.com
```

foi uma prioridade desta conversa.

A utilizadora comprou:

```
chutapracanto.com
```

via Cloudflare Registrar.

Estado confirmado:

- domínio .com ativo;
- produção acessível;
- páginas internas preservam caminhos;
- pages.dev redireciona para .com;
- referências hardcoded antigas foram migradas;
- canonical/OG/Twitter foram atualizados;
- robots/sitemap foram atualizados;
- Admin/workflows foram atualizados;
- `ads.txt` foi criado;
- domínio correto passou a ser a referência oficial.

Commit principal da migração:

```
05ca8862b359de61accd78cddff37362ac5d5bed
```

### Regra

Não reintroduzir:

```
chutapracanto.pages.dev
```

como URL canónica, OG, sitemap, robots ou URL editorial.

Pode existir apenas como origem técnica do redirect.

---

# 6. ADSENSE — ESTADO E DECISÕES

A utilizadora já possui uma conta AdSense antiga e validada.

Conta Google:

```
rute-costa_@hotmail.com
```

Publisher ID:

```
ca-pub-1556367149800029
```

Foi tomada a decisão de **não criar uma segunda conta AdSense**.

A estratégia é utilizar a conta existente e adicionar o CPC como site.

Foi escolhido o método de verificação por código AdSense.

Código base:

```
https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1556367149800029
```

Também existe:

```
ads.txt
```

com:

```
google.com, pub-1556367149800029, DIRECT, f08c47fec0942fa0
```

A utilizadora já submeteu o site para revisão.

### Não fazer

- não criar nova conta AdSense;
- não trocar a conta sem motivo;
- não assumir aprovação;
- não ficar a repetir a verificação sem um problema concreto.

### Próxima operação

Acompanhar:

- revisão;
- crawler;
- políticas;
- Search Console;
- indexação;
- consentimento/CMP quando aplicável.

---

# 7. AUDITORIA PÓS-MIGRAÇÃO

Foi realizada uma auditoria abrangente com Codex.

Resultados principais:

### Confirmado

- GitHub ligado ao Cloudflare Pages;
- main como produção;
- .com ativo;
- páginas principais acessíveis;
- referências pages.dev eliminadas do código público;
- canonical correto;
- OG/Twitter correto;
- NewsArticle;
- Article para conteúdo não-news;
- BreadcrumbList;
- robots;
- sitemap;
- ads.txt;
- AdSense script.

### Sitemap no momento da auditoria

Havia 62 URLs correspondentes ao estado anterior à importação histórica.

Posteriormente o arquivo Framer aumentou o conteúdo e o sitemap foi regenerado.

### Problemas de performance encontrados

Lighthouse mostrou problemas especialmente em mobile:

- Home mobile com LCP muito alto;
- artigo normal mobile com LCP muito alto;
- Opinião com CLS elevado;
- Notícias com CLS acima do desejável;
- payload de imagem elevado;
- imagens sem dimensões explícitas em alguns casos.

Os valores históricos medidos incluíam aproximadamente:

- Home mobile LCP: 16,7 s;
- artigo mobile LCP: 17,5 s;
- Opinião mobile LCP: 17,1 s;
- Opinião mobile CLS: 1,000.

Esses valores são **baseline histórico**, não devem ser tratados como métricas atuais sem nova medição.

### Regra

Não inventar a causa de LCP/CLS.

Medir → localizar causa → corrigir → medir novamente.

---

# 8. NAVEGAÇÃO E STICKY EDITORIAL

Durante esta conversa foram identificados e corrigidos problemas de navegação.

Alterações diretas:

- Home deixou de usar `noticia.html?slug=` nos links de artigos;
- Notícias deixou de usar `noticia.html?slug=`;
- links passaram a utilizar `/noticia?slug=`;
- artigo passou a incluir Opinião na navegação;
- 404 passou a incluir Opinião;
- footer do 404 passou a incluir Política Editorial.

Foi criada/reaplicada a lógica de sticky editorial.

Objetivo:

- título continuar visível;
- subtítulo continuar visível;
- reduzir progressivamente o espaço ocupado;
- reduzir progressivamente fonte;
- reduzir progressivamente opacidade;
- reduzir progressivamente fundo/borda;
- header global ter comportamento progressivo equivalente;
- evitar que o sticky destrua a leitura.

Também foi melhorado o mobile de Notícias:

- cartões verticais;
- imagem 16:9;
- conteúdo abaixo;
- títulos legíveis;
- resumo controlado;
- desktop preservado.

A PR de produção dessa reaplicação foi:

```
#24
```

Merge:

```
d1ac249d0cd5fee66e25d7162a97872dc82e28e3
```

PR #23 ficou fechada sem merge porque ficou desatualizada após grandes alterações no repositório.

### Regra

Não reabrir #23.

Não duplicar o trabalho de #22/#24.

---

# 9. IMPORTAÇÃO HISTÓRICA DO FRAMER

Esta foi uma das tarefas centrais da segunda conversa.

Antigo site:

```
https://chutapracanto.framer.website
```

Objetivo:

```
Framer
→ arquivo histórico
→ content/noticias/
→ noticias-index.json
→ pesquisa
→ sitemap
```

Não usar Framer como dependência de pesquisa em produção.

O conteúdo histórico deve ficar no CPC.

---

# 10. DESCOBERTA DO ARQUIVO FRAMER

A auditoria encontrou:

```
213
```

URLs únicas no arquivo público do Framer.

Formato aproximado:

```
/noticias/<slug>
```

As páginas tinham potencialmente:

- título;
- subtítulo;
- categoria;
- data;
- autor;
- imagem;
- corpo;
- canonical;
- OG/Twitter;
- metadados Framer.

A primeira tentativa do importer falhou porque o parser assumia uma estrutura HTML que não correspondia ao template real.

O HTML existia.

O problema era:

**seleção errada do contentor de conteúdo.**

Depois foi feita adaptação ao template real:

- cabeçalho;
- `Publicado em`;
- `Por`;
- categoria;
- título;
- bloco de corpo;
- imagens.

Também foi descoberto que o corpo estava em `div`, não necessariamente em `p`.

O extrator foi adaptado.

---

# 11. REGRAS DE DEDUPLICAÇÃO FRAMER

A importação nunca deve substituir conteúdo existente.

Critérios de deduplicação:

1. slug;
2. URL original (`sourceUrl`);
3. título normalizado + data.

A normalização do título remove diferenças de:

- maiúsculas/minúsculas;
- acentos;
- pontuação;
- separadores.

A data original deve ser preservada.

Não alterar a data de publicação para a data da importação.

Não inventar:

- data;
- autor;
- categoria;
- corpo;
- imagem.

---

# 12. RESULTADO DA IMPORTAÇÃO FRAMER

O arquivo Framer tinha:

```
213 URLs únicas
```

Resultado final:

```
179 artigos importados
34 duplicados/ignorados
0 falhas
```

O repositório passou de 53 Markdown em `content/noticias` para:

```
232 notícias
+ 1 opinião
= 233 Markdown
```

O índice final passou a conter:

```
233 entradas
```

O sitemap final passou a conter:

```
241 URLs
```

sendo:

- 233 artigos correspondentes ao índice;
- 8 páginas públicas.

A regeneração pós-importação foi concluída com sucesso.

Workflow:

```
Gerar índice de notícias
```

Run histórico:

```
36026495095
```

Workflow temporário de importação real foi removido após a validação.

---

# 13. IMPORTER FRAMER

Foi criado:

```
scripts/import-framer-news.py
```

Funções principais:

- ler arquivo Framer;
- extrair URLs;
- extrair páginas;
- interpretar metadados;
- extrair corpo;
- criar frontmatter;
- preservar `sourceUrl`;
- verificar duplicados;
- recusar sobrescrita.

Também houve:

```
.github/workflows/testar-importacao-framer.yml
```

para dry-run.

Durante a evolução existiram workflows temporários para importação real, protegidos por confirmação explícita.

Esses mecanismos temporários foram posteriormente removidos.

### Regra atual

A importação histórica Framer está **FECHADA**.

Não executar novamente sem necessidade explícita.

Não reabrir esta fase apenas por rotina.

O importer pode ser mantido enquanto houver valor de auditoria/manutenção.

---

# 14. ÍNDICE DE NOTÍCIAS

O site utiliza:

```
content/noticias-index.json
```

para evitar carregamento N+1 de Markdown.

O índice deve conter:

- título;
- subtítulo;
- categoria;
- autor;
- datas;
- imagem;
- slug;
- path;
- sourceUrl quando disponível;
- tipo editorial quando aplicável.

Ordenação:

**mais recente → mais antigo**

A geração deve partir dos Markdown reais.

Nunca editar manualmente o índice se o workflow oficial conseguir regenerá-lo.

---

# 15. SITEMAP

O sitemap deve corresponder ao conteúdo real.

Após a importação histórica:

```
241 URLs
```

Regra:

- não deixar artigos fora do sitemap;
- não adicionar artigos inexistentes;
- manter domínio .com;
- verificar URLs duplicadas;
- manter páginas públicas.

---

# 16. PESQUISA

A pesquisa do CPC deve funcionar sobre o índice próprio.

Objetivo:

- notícias atuais;
- arquivo histórico;
- categorias;
- títulos;
- autores;
- pesquisa normalizada;
- acentos.

A pesquisa não deve depender do Framer.

O arquivo histórico deve ser tratável exatamente como conteúdo próprio.

---

# 17. SEO EDITORIAL

O CPC já possui infraestrutura para:

- canonical;
- OG;
- Twitter;
- NewsArticle;
- Article;
- BreadcrumbList;
- sitemap;
- robots;
- autores;
- tipos editoriais;
- notícias relacionadas.

Cada alteração editorial deve preservar:

1. URL;
2. canonical;
3. título;
4. descrição;
5. imagem;
6. structured data;
7. breadcrumbs;
8. tipo editorial.

---

# 18. NOTÍCIAS VS OPINIÃO

São entidades editoriais diferentes.

Não misturar.

```
news
```

é notícia.

```
opinion
```

é opinião/crónica/análise.

Pedro Soares é autor de peças de opinião/crónica quando assim indicado.

Rute Costa:

- Moderadora;
- Locutora.

Pedro Soares:

- Treinador;
- Opinião Crítica;
- Análise.

Não transformar opinião em notícia apenas para SEO.

---

# 19. PERFORMANCE — PRÓXIMA GRANDE FRENTE

Depois de validar produção pós-merge do sticky/mobile, a próxima grande fase é performance mensurável.

Objetivo:

- LCP;
- CLS;
- INP;
- TBT quando relevante;
- FCP;
- peso de imagens;
- scripts;
- fontes;
- YouTube;
- feeds;
- cache;
- rede.

### Método

Nunca:

> "Acho que é esta imagem."

Fazer:

```
medir
→ identificar elemento/gargalo
→ confirmar causa
→ corrigir
→ medir
→ comparar
```

Não alterar imagens cegamente.

Não remover funcionalidades só para ganhar Lighthouse.

Não trocar arquitetura sem evidência.

---

# 20. GOOGLE NEWS / SEARCH CONSOLE

Fase futura.

Ordem:

1. Search Console;
2. sitemap;
3. robots;
4. canonical;
5. indexabilidade;
6. Publisher Center quando útil;
7. secções;
8. labels;
9. logo;
10. acompanhamento.

Google News não deve ser tratado como garantia de tráfego.

Publisher Center não deve ser confundido com requisito absoluto de elegibilidade.

Verificar documentação Google atual sempre que esta fase for executada.

---

# 21. DADOS DE FUTEBOL

Fase futura.

Objetivo:

- competições;
- equipas;
- calendários;
- resultados;
- classificações;
- eventualmente APIs.

Antes de escolher uma API:

- verificar custo;
- licença;
- rate limits;
- disponibilidade;
- qualidade;
- termos de uso;
- cobertura Portugal;
- cobertura competições pretendidas.

Nunca inventar resultados ou classificações.

Separar:

```
dados automáticos

eq
texto editorial
```

---

# 22. MONETIZAÇÃO

A monetização é uma fase progressiva.

Prioridades:

- AdSense;
- consentimento/CMP quando necessário;
- publicidade contextual;
- parcerias;
- patrocinadores;
- paid partnerships;
- preservar velocidade.

Não transformar o site num painel de anúncios pesado.

A rentabilidade deve coexistir com:

- UX;
- Core Web Vitals;
- confiança;
- SEO;
- leitura.

---

# 23. ESTRATÉGIA GERAL DO PROJETO

O CPC não deve tentar fazer tudo ao mesmo tempo.

Ordem geral:

```
estabilidade
→ SEO
→ performance
→ indexação
→ arquivo
→ Google News
→ monetização
→ dados futebolísticos
→ crescimento
```

A prioridade é construir uma base sólida antes de adicionar complexidade.

---

# 24. ARQUITETURA FUTURA

Existe documentação de arquitetura futura para competições:

```
docs/arquitetura-futura-competicoes.md
```

Não implementar automaticamente só porque o documento existe.

É roadmap.

Implementar quando:

- houver necessidade editorial;
- houver fonte de dados adequada;
- houver solução gratuita;
- os requisitos estiverem claros.

---

# 25. CLOUDflare

Existem dois elementos que não podem ser confundidos:

1. Cloudflare Pages / projeto CPC;
2. Worker separado chamado `chutapracanto`.

O Worker não é simplesmente `_worker.js`.

Antes de alterar Cloudflare:

- confirmar qual componente está a ser alterado;
- verificar produção;
- evitar alterações que quebrem Admin;
- não mexer em secrets sem necessidade;
- não iniciar recursos pagos.

---

# 26. SUPABASE

Supabase existe/conectado ao ChatGPT.

Não é necessário para o estado atual do site.

Não introduzir Supabase apenas porque está disponível.

Só utilizar se resolver um problema concreto que justifique:

- complexidade adicional;
- autenticação;
- dados dinâmicos;
- queries;
- storage;
- etc.

Sempre respeitar:

- plano gratuito;
- RLS;
- segurança;
- documentação atual.

---

# 27. CUSTOS

O projeto deve manter-se gratuito sempre que possível.

Não introduzir:

- plano pago;
- créditos pagos;
- serviço com cobrança obrigatória;
- upgrade;
- infraestrutura desnecessariamente paga.

Se existir uma solução gratuita razoável, preferi-la.

Se uma solução paga for inevitável, isso é decisão da utilizadora.

---

# 28. CHECKLIST ANTES DE QUALQUER IMPLEMENTAÇÃO

A IA deve:

- ler `.github/AI_PROJECT_RULES.md`;
- verificar main;
- verificar PRs relevantes;
- verificar commits recentes;
- verificar deployment;
- verificar se a funcionalidade já existe;
- evitar duplicação;
- verificar se o problema é real;
- implementar a menor alteração segura;
- testar;
- corrigir;
- testar novamente.

---

# 29. CHECKLIST DEPOIS DE IMPLEMENTAR

Confirmar:

- ficheiros;
- diff;
- sintaxe;
- referências;
- links;
- canonical;
- structured data;
- conteúdo;
- datas;
- slugs;
- autores;
- imagens;
- pesquisa;
- sitemap;
- robots;
- Preview;
- deployment;
- produção;
- regressões.

Não considerar:

```
commit criado
```

como sinónimo de:

```
funcionalidade validada
```

---

# 30. O QUE NÃO DEVE SER REPETIDO

Não:

- criar ZIP para a utilizadora;
- criar documentos/anexos para a utilizadora;
- pedir screenshots;
- pedir documentos;
- pedir imagens;
- reimportar Framer;
- reabrir PRs fechadas sem necessidade;
- duplicar #22/#24;
- duplicar #19/#21;
- criar segunda conta AdSense;
- migrar para outra arquitetura sem razão;
- introduzir Supabase sem benefício;
- usar serviços pagos sem decisão;
- inventar dados;
- inventar conteúdo;
- assumir que uma PR fechada está em produção;
- assumir que um deployment successful significa UX validada;
- gastar Codex em tarefas que podem ser feitas diretamente.

---

# 31. ESTADO DE PRODUÇÃO QUE DEVE SER CONSIDERADO

Segundo a reconciliação do estado real registada nas rules:

- Framer: concluído;
- 179 artigos históricos importados;
- 34 duplicados/ignorados;
- 0 falhas;
- 233 Markdown finais;
- índice: 233 entradas;
- sitemap: 241 URLs;
- workflow temporário Framer removido;
- #22 em produção;
- #24 em produção;
- #23 fechada sem merge;
- #19 fechada sem merge;
- #21 fechada sem merge;
- .com é domínio oficial;
- AdSense está em acompanhamento;
- próxima grande fase técnica: performance mensurável.

Se uma nova consulta ao GitHub contradisser estes números, **o GitHub atual vence esta Bíblia**.

---

# 32. ORDEM DE CONTINUIDADE PARA A PRÓXIMA IA

Ao assumir esta conversa:

### Passo 1
Ler:

```
.github/AI_PROJECT_RULES.md
```

### Passo 2
Ler:

```
bíblia segunda conversa.md
```

### Passo 3
Consultar main real.

### Passo 4
Confirmar deployment atual.

### Passo 5
Verificar se existe alguma PR aberta.

### Passo 6
Não reexecutar trabalho fechado.

### Passo 7
Validar a produção pós-#24.

### Passo 8
Estabelecer baseline de performance atual.

### Passo 9
Corrigir apenas gargalos comprovados.

### Passo 10
Avançar para Google News/Search Console quando a base estiver estável.

---

# 33. PRINCÍPIO FINAL IA → IA

Esta conversa não deve ser tratada como uma sequência de perguntas isoladas.

É um projeto contínuo.

A próxima IA deve comportar-se como **agente de continuidade**, não como consultor que reinicia o projeto.

Não perguntar:

> "O que queres fazer agora?"

se as rules já definem a próxima fase.

Não dizer:

> "Posso fazer isso."

Fazer, quando possível.

Não dizer:

> "Está pendente."

Verificar e continuar, quando possível.

Não repetir trabalho já concluído.

Não apagar contexto.

Não alterar arquitetura por entusiasmo.

Não otimizar uma métrica destruindo uma funcionalidade.

A regra operacional é:

```
LER
→ VERIFICAR
→ IMPLEMENTAR
→ TESTAR
→ CORRIGIR
→ TESTAR
→ VALIDAR PRODUÇÃO
→ DOCUMENTAR
→ AVANÇAR
```

O objetivo não é apenas fazer o site funcionar.

É manter o projeto **organizado, sustentável, gratuito, automatizado, rápido, pesquisável, monetizável e preparado para crescer**, sem perder o trabalho já realizado.

---

## FIM DA BÍBLIA DA SEGUNDA CONVERSA


---

# 33. ARQUIVO INTEGRAL — HANDOFF TÉCNICO DE 2026-09-24

O handoff técnico permanece abaixo para preservar todos os detalhes da frente de performance.

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


---
## FIM DA BÍBLIA MESTRA
