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
