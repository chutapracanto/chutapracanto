# CHUTA PRA CANTO — ROADMAP OPERACIONAL

Versão: 2026-09-30
Repo: `chutapracanto/chutapracanto`
Produção: `https://chutapracanto.com`

## 1. REGRA DE EXECUÇÃO

A ordem operacional é:
**inspecionar → implementar → validar → corrigir → validar → documentar**.

O estado real de GitHub, Cloudflare, D1 e produção prevalece sobre textos antigos. Histórico fechado não deve ser reaberto sem evidência nova.

## 2. ESTADO ATUAL

| Fase | Frente | Estado |
|---|---|---|
| 0 | Continuidade, regras e documentação | **CONSOLIDADA** |
| 1 | Conteúdo histórico | **CONCLUÍDA** |
| 2 | Sistema editorial / UX | **CONCLUÍDA** |
| 3 | Dados de futebol / competições | **CONCLUÍDA OPERACIONALMENTE** |
| 4 | SEO + indexação real | **ATIVA — aguardar/medir Search Console** |
| 5 | Performance | **MANUTENÇÃO — só com evidência nova** |
| 6 | Monetização | **PREPARAÇÃO / AdSense em análise** |
| 7 | Distribuição e crescimento | **FRENTE CRIATIVA ATIVA** |
| 8 | Automação e escala | **PRÓXIMA GRANDE FRENTE TÉCNICA** |

### Estado operacional em 30/09/2026

- BSD é a fonte de futebol em produção.
- Arquitetura: browser → Pages Worker → adapter BSD → D1/cache → BSD.
- Worker separado: `cpc-football-cron`.
- Cron: `*/5 * * * *`.
- D1: `FOOTBALL_CACHE_DB`.
- As 7 competições estão implementadas.
- UI de fases, grupos, jornadas/rondas e LIVE está implementada.
- Nations League deteta a fase a partir dos dados atuais e não deve ficar presa à fase de grupos.
- Home LIVE fica em standby quando não existem jogos LIVE reais.
- Shorts da Home estão a atualizar novamente; confirmado pela utilizadora.
- Sobre Nós e Contacto ficam no footer, não no menu principal.
- Sitemap foi submetido ao Search Console em 28/09; após 24h ainda não há evidência pública de indexação nos resultados pesquisáveis. O Search Console continua a ser a fonte correta para confirmar indexação.

## 3. FASE 3 — DADOS DE FUTEBOL / COMPETIÇÕES

**Estado: CONCLUÍDA OPERACIONALMENTE.**

### Fechado
- BSD validado como fonte operacional atual.
- Adapter server-side.
- D1/cache com refresh correto e fallback stale apenas quando necessário.
- Worker de cron separado.
- UI das 7 competições.
- LIVE backend/frontend.
- Inferência dinâmica de fase.
- Filtros dinâmicos.
- Nations League por grupos na fase de liga.
- Normalização de labels de ronda/fase.
- Não hardcode de fases quando a BSD fornece a estrutura.

### Regra de fases
A UI deve inferir a estrutura atual pelos dados BSD:
1. knockout/qualificação/play-offs/quartos/meias/final;
2. fase de liga;
3. grupos;
4. tabela única.

Quando uma competição muda de fase, os filtros devem adaptar-se automaticamente. Não é necessário alterar manualmente a UI para cada transição de época/fase.

### Nations League
Na fase de liga:
- grupos A1–A4, B1–B4, C1–C4, D1–D2;
- seleção de grupo mostra jogos passados, presentes e futuros desse grupo;
- "Todos" limpa grupo/jornada e mostra a competição completa.

Quando a BSD passar para quartos/play-offs/fase final, a UI deve deixar de apresentar grupos e passar para o filtro de ronda/fase correspondente.

**Não reabrir esta frente sem regressão ou evidência nova.**

## 4. FASE 4 — SEO + INDEXAÇÃO

**Estado: ATIVA.**

### Já implementado
- canonical;
- robots;
- sitemap;
- OG/Twitter;
- JSON-LD;
- NewsArticle/Article/BreadcrumbList;
- domínio `.com`;
- distinção Notícias/Opinião;
- shell inicial de artigos.

### Situação Search Console
- sitemap submetido em 28/09/2026;
- Google aceitou o sitemap para processamento;
- já passaram mais de 24h;
- uma pesquisa pública `site:chutapracanto.com` não devolveu resultados no momento desta atualização;
- isto **não prova desindexação** nem substitui os relatórios do Search Console.

### Próxima ação autónoma
Quando houver dados disponíveis no Search Console:
1. Sitemaps;
2. Page indexing;
3. páginas excluídas;
4. canonical;
5. erros/avisos;
6. páginas efetivamente indexadas.

Não fazer alterações SEO por ausência de resultados públicos isoladamente.

## 5. FASE 5 — PERFORMANCE

**Estado: manutenção.**

A primeira passagem de performance já foi aplicada e validada historicamente.

Só reabrir com:
**problema → evidência → hipótese → alteração mínima → validação**.

Não repetir experiências fechadas nem alterar LCP/CLS por palpite.

## 6. FASE 6 — MONETIZAÇÃO

**Estado: preparação / dependência externa.**

### AdSense
- infraestrutura técnica preparada;
- pedido em análise/"em preparação";
- aprovação e receita continuam dependentes da Google.

### Enquanto aguarda
Pode avançar-se autonomamente com:
- revisão de páginas institucionais e privacidade/cookies;
- verificação de ads.txt;
- preparação de espaços publicitários sem os ativar de forma intrusiva;
- pesquisa de afiliados compatíveis;
- preparação de parcerias/patrocínios;
- melhoria de páginas de contacto/parcerias;
- preparação de métricas e informação comercial.

Não criar segunda conta AdSense nem assumir aprovação.

## 7. FASE 7 — DISTRIBUIÇÃO E CRESCIMENTO

**Estado: frente criativa ativa, separada da fase técnica.**

Inclui:
- Facebook;
- Instagram;
- TikTok;
- YouTube;
- Shorts;
- Reels;
- cortes;
- podcast;
- distribuição cruzada.

### Automação de vídeo — ideia em avaliação

É tecnicamente possível construir um fluxo de:
**upload único → processamento → publicação/queue por plataforma**, usando APIs oficiais onde cada plataforma permitir.

Mas as plataformas não oferecem todas o mesmo modelo de publicação. Portanto, antes de construir, devemos mapear:
- upload/resumable upload;
- autenticação OAuth;
- publicação direta vs criação de rascunho;
- limitações de formato/tamanho;
- permissões necessárias;
- quotas;
- necessidade de aprovação de app;
- se a conta CPC pode usar a API para publicação.

Só depois decidir se vale a pena implementar.

## 8. PESQUISA INTERNA DO SITE

**Estado: ideia futura, não prioridade imediata.**

A pesquisa de Notícias já existe no sistema editorial/indexado.

Uma pesquisa global no site pode ser criada posteriormente para:
- notícias;
- opinião;
- eventualmente competições.

Prioridade inferior a:
1. confirmação do estado Search Console;
2. preparação AdSense/monetização;
3. automação de distribuição que reduza trabalho manual recorrente.

## 9. FASE 8 — AUTOMAÇÃO E ESCALA

**Estado: próxima frente técnica.**

Priorizar automações que:
1. acontecem repetidamente;
2. consomem tempo;
3. são previsíveis;
4. podem ser validadas;
5. não introduzem risco editorial.

### Candidatos
- distribuição de vídeos para plataformas;
- reutilização de conteúdo;
- validações automáticas;
- publicação e atualização editorial;
- alertas úteis;
- integrações entre GitHub/Cloudflare/serviços sociais;
- automações de dados de futebol já existentes.

Não criar automações só por serem possíveis.

## 10. IDEIAS / BACKLOG NÃO PRIORITÁRIO

- pesquisa global avançada no site;
- automações criativas adicionais;
- novas integrações sociais;
- melhorias de performance sem evidência;
- novas funcionalidades de engagement sem necessidade comprovada.

Uma ideia só sobe de prioridade quando resolve um problema real, poupa trabalho relevante ou desbloqueia receita/distribuição.

## 11. O QUE NÃO REABRIR

Sem evidência nova, não reabrir:
- arquitetura BSD/D1/cache;
- Worker `cpc-football-cron`;
- Cron;
- filtros Nations já corrigidos;
- LIVE;
- Shorts refresh;
- migração histórica validada;
- URLs canónicas de notícias;
- sticky/header editorial;
- primeira passagem de performance;
- alterações já fechadas em PRs.

## 12. PRÓXIMA ORDEM PRÁTICA

1. **Search Console:** esperar processamento e validar dados quando aparecerem.
2. **Monetização:** enquanto AdSense está "em preparação", concluir apenas preparações autónomas de baixo risco.
3. **Automação de distribuição:** investigar APIs oficiais e verificar se um upload único pode realmente reduzir o trabalho para YouTube + Facebook + Instagram + TikTok.
4. **Pesquisa interna global:** só depois, salvo surgir uma necessidade concreta.
5. **Automação/escala:** transformar os fluxos repetitivos validados em processos automáticos.

## 13. REGRA PARA FUTURAS IAs

Antes de alterar:
1. ler Rules;
2. ler este Roadmap;
3. ler o ledger quando houver histórico relevante;
4. verificar GitHub/Cloudflare/produção;
5. identificar a camada;
6. alterar o mínimo;
7. validar;
8. documentar.

**Objetivo: avançar sem voltar a introduzir soluções ou fornecedores que já deixaram de fazer parte do projeto.**


---

## 15. CONSOLIDAÇÃO 2026-09-30.1 — FILA ATUAL

### Admin / criação de conteúdo
- Regressão de previews de uploads antigos identificada e corrigida: os ficheiros em `images/uploads/` nunca foram apagados; o problema estava na normalização de caminhos locais no Admin.
- Pesquisa de imagens melhorada: Openverse + Wikimedia Commons, maior cobertura, pesquisa direta de categoria quando disponível, filtro de relevância e preferência por capas horizontais.
- Importação de imagens externas para `images/uploads/` está implementada; preservação explícita de origem/licença/atribuição permanece melhoria futura.
- Manter o cancelar/remover da imagem selecionada claro e seguro.
- Implementar **Guardar como rascunho** antes de publicar; rascunhos não podem entrar no índice público nem sitemap.
- Não alterar o fluxo de publicação atual até o modelo de rascunho estar desenhado.

### SEO / Search Console — checklist quando houver dados
Sitemaps → Page indexing → URL Inspection → canonical declarado vs escolhido → páginas excluídas e motivos → robots/HTTP/redirects → dados estruturados. Corrigir apenas problemas comprovados. Uma pesquisa pública `site:` sem resultados não é, sozinha, evidência suficiente para alterar a arquitetura.

### Automação de vídeo — estado da investigação
Objetivo: **upload único → preparação/publicação ou rascunho por plataforma → estado/retry independente**, reduzindo trabalho manual.
- YouTube: API oficial suporta upload e resumable upload. (Google Developers: YouTube Data API upload/resumable upload)
- TikTok: Content Posting API suporta Direct Post e Upload para rascunho; requer app/OAuth/scopes e há requisitos de aprovação/auditoria para publicação pública. Suporta `PULL_FROM_URL`. (TikTok for Developers: Content Posting API)
- Meta/Instagram/Facebook: falta fechar a matriz atual de APIs, permissões, quotas e aprovação antes de construir.
- Não guardar tokens sociais no frontend; OAuth/secrets ficam server-side.
- Antes do MVP: confirmar contas, permissões, formatos, quotas, aprovação e modelo direto/rascunho de cada plataforma.

### Melhorias em standby
- monitorizar o novo Build Watch Paths já aplicado; commits em `docs/*`, `images/uploads/*` e `content/noticias/*` não devem gerar deployment isolado, enquanto código e índices continuam a poder gerar deployment;
- pesquisa global do site;
- automações adicionais de distribuição/reutilização;
- performance apenas com evidência nova.

### Ordem prática atual
1. Search Console quando os relatórios estiverem disponíveis.
2. Admin/imagens/rascunhos.
3. Preparação AdSense de baixo risco.
4. Fechar matriz YouTube + TikTok + Meta e desenhar MVP de vídeo.
5. Pesquisa global do site.
6. Monitorizar a configuração de deployments já corrigida e só alterar novamente se aparecer uma regressão.


### Atualização 2026-09-30.2 — Admin
**Implementado:** rascunho local no Admin usando IndexedDB. Guarda campos da notícia, conteúdo Quill e imagem local quando existente; permite recuperar o rascunho antes da publicação. O rascunho não cria commit, não entra no índice/sitemap e não dispara deployment. O rascunho local é uma ferramenta do navegador, não um armazenamento editorial partilhado.


## 16. ATUALIZAÇÃO 2026-09-30.3 — DEPLOYMENTS E IMAGENS

### Deployments — implementado
A configuração do Cloudflare Pages foi ajustada:
- includes: `*`;
- excludes: `docs/*`, `images/uploads/*`, `content/noticias/*`.

Objetivo: evitar builds isolados para documentação, uploads e Markdown individual, mantendo código e artefactos editoriais/índices dentro do trigger quando necessário.

Validação realizada:
- commit de código `b0b75366...` → deployment de produção `56b7ce0d...` → SUCCESS;
- commit documental `d49b27a73b98bf8256088b3de307c6529aec0f21` → deployment marcado `skipped` com `skip_reason=path_config`.

Portanto a nova regra já está efetivamente a ser aplicada em produção.

### Admin / imagens — implementado
A pesquisa de imagens foi reforçada com:
- pesquisas adicionais pelo ano atual e anterior;
- ranking por relevância textual + resolução + proporção + sinais de data disponíveis;
- prioridade reforçada a capas horizontais de boa resolução;
- penalização de retratos e formatos extremos;
- suporte para colar URLs embrulhados pelo Google Images, extraindo parâmetros que apontem para o URL direto da imagem;
- normalização do URL antes da pré-visualização.

Limitação conhecida: metadados de data do Openverse não equivalem necessariamente à data de criação/publicação da fotografia. Para garantir robustez máxima, a futura cópia de imagens externas para alojamento próprio deve preservar fonte/licença/atribuição.


## 17. ATUALIZAÇÃO 2026-09-30.4 — MONETIZAÇÃO E DISTRIBUIÇÃO

### Monetização — auditoria autónoma concluída
- `ads.txt` existe e contém o Publisher ID atual: `google.com, pub-1556367149800029, DIRECT, f08c47fec0942fa0`.
- A Política de Privacidade já identifica a integração técnica do AdSense, explica que anúncios ainda não significam monetização ativa e prevê consentimento aplicável.
- Termos e Política Editorial estão presentes e distinguem publicidade de conteúdo editorial.
- A página Contacto já aceita propostas de parceria.
- Não foi introduzido CMP por código neste ciclo: a publicação de anúncios personalizados no EEE/Reino Unido/Suíça exige uma CMP certificada pela Google integrada com IAB TCF; a configuração pode ser feita através do Privacy & messaging da Google.

**Estado:** tecnicamente preparado; a ativação de consentimento/Privacy & messaging é dependência da conta AdSense e não deve ser inventada nem simulada no código.

### Distribuição de vídeo — matriz oficial fechada
- **YouTube:** `videos.insert` suporta upload autenticado e uploads resumable; projetos não verificados criados após 28/07/2020 ficam com vídeos privados até auditoria. Requer OAuth e scope `youtube.upload`.
- **TikTok:** Content Posting API suporta Direct Post; requer app, configuração Direct Post, autorização do utilizador e aprovação do scope `video.publish`. Clientes não auditados ficam limitados a conteúdo privado. Também existe `PULL_FROM_URL`.
- **Facebook Pages:** a Graph API atual permite publicar vídeos/Reels em Pages através de Page Access Token e permissões de conteúdo; a publicação de vídeo de Page usa `/{page-id}/videos`, e Reels têm fluxo de upload/publicação separado.
- **Instagram:** Content Publishing/Reels exige conta profissional e integração adequada com uma Page/app; o fluxo de Reels pode usar URL pública ou upload resumable e termina com `media_publish`.

### Condicionante para implementação do MVP
O desenho técnico está suficientemente fechado, mas a implementação real depende de credenciais/autorização externas que o repositório não possui:
1. YouTube: projeto OAuth + consentimento da conta do canal + credenciais/token.
2. TikTok: app com Content Posting API + `video.publish` aprovado/autorizado.
3. Meta: app + permissões + Page Access Token e identificação da conta Instagram profissional ligada à Page.

Não criar tokens fictícios, não colocar credenciais no frontend e não construir uma falsa automação de publicação sem estas autorizações.


## 18. CORREÇÃO 2026-09-30.5 — PUBLICAÇÃO ADMINISTRATIVA

- Foi detetada uma regressão no fluxo de publicação: o Admin guardava o Markdown da notícia e a imagem no GitHub, mas não atualizava `content/noticias-index.json`.
- Como `content/noticias/*` está excluído dos Build Watch Paths, o conteúdo novo não gerava deployment por si só; e, sem a entrada no índice, a produção não conseguia descobrir a notícia nova.
- A notícia de 30/09/2026, “Passaporte carimbado nos Açores: Seleção Sub-21 goleia Gibraltar (4-0) com 'golaço' de Rodrigo Mora e garante Euro 2027”, foi recuperada no índice manualmente.
- O Worker foi corrigido para sincronizar automaticamente o índice após PUT/DELETE editorial, preservando campos existentes como `sourceUrl` quando a entrada já existe.
- O commit do Worker `70b1b1af...` iniciou deployment de produção `6cb198fe...`; o commit do índice `b4181c9c...` iniciou deployment `d55ea2ad...`.
- Regra: uploads/imagens e Markdown isolados continuam sem deployment; a atualização do índice continua a ser o artefacto que publica o novo estado editorial.


## 19. ATUALIZAÇÃO 2026-10-01 — VERIFICAÇÃO AUTÓNOMA

### Search Console
- Não existe conector Search Console disponível nesta sessão, portanto não é possível ler diretamente Sitemaps, Page indexing ou URL Inspection privados.
- A documentação atual da Google confirma que o relatório de Sitemaps é a fonte para saber se o sitemap foi processado e que a indexação pode demorar dias; uma pesquisa pública site: não substitui esses relatórios. citeturn0search0turn0search1
- Não foi feita qualquer alteração SEO por falta de dados do Search Console.

### Admin / rascunhos
- O código atual do Admin contém o fluxo de rascunho local em IndexedDB, com guardar e recuperar conteúdo, campos editoriais e imagem local.
- O rascunho não chama a API editorial, não cria commit, não entra no índice público/sitemap e não gera deployment.
- A validação estrutural confirmou que a implementação existe no main; teste funcional final no navegador continua pendente de execução real no Admin.

### Monetização
- Reconfirmados ads.txt, Política de Privacidade, Termos, Política Editorial e Contacto no main.
- Não foi encontrada uma alteração autónoma de baixo risco que justifique mexer nestas páginas antes da configuração final do AdSense/Privacy & Messaging.

### Cloudflare / produção
- Pages continua com path_includes ["*"] e exclusões docs/*, images/uploads/*, content/noticias/*.
- O deployment mais recente é o commit documental 0fede328..., corretamente marcado como skipped / path_config; o deployment canónico continua a ser 6cb198fe..., SUCCESS, com alias de produção https://chutapracanto.com.

**Fila após esta verificação:** Search Console aguarda acesso/dados; Admin aguarda teste funcional real; monetização permanece em preparação; distribuição de vídeo continua bloqueada apenas pelas autorizações externas já identificadas.

## 20. IDEIA FUTURA — PESQUISA INTELIGENTE DE IMAGENS NO ADMIN

**Estado: BACKLOG / NÃO IMPLEMENTAR AGORA.**

No fluxo de criação de notícia do Admin, ao clicar em **Pesquisar imagens**, o sistema deverá no futuro:

- analisar automaticamente o **título, teor/conteúdo e restantes metadados editoriais disponíveis** da notícia;
- inferir os termos/conceitos mais relevantes para a pesquisa;
- gerar automaticamente uma pesquisa de imagens contextualizada com a notícia;
- apresentar imediatamente resultados relevantes, sem obrigar a utilizadora a escrever primeiro uma pesquisa manual;
- manter sempre disponível a possibilidade de a utilizadora **alterar a pesquisa e pesquisar novamente** caso nenhum resultado seja adequado;
- preservar os critérios já existentes de relevância, qualidade/resolução, proporção e adequação da imagem.

**Importante:** esta entrada é apenas uma ideia para o roadmap. Não alterar o Admin, APIs de imagens, pesquisa Openverse/Wikimedia ou fluxo editorial por causa desta ideia nesta fase.


## 18. ATUALIZAÇÃO 2026-10-01 — CRON / API COMPETIÇÕES 503

### Estado
A frente de dados de futebol continua ativa até o refresh automático voltar a escrever no D1.

### Diagnóstico fechado
O Cron `cpc-football-cron` tem uma única agenda `*/5 * * * *` e estava a executar chamadas para `https://chutapracanto.com/api/competicoes`. O último erro observável confirmado foi HTTP 503 no ciclo de Champions League. O D1 não recebe novo refresh desde 15:35 UTC.

A investigação encontrou uma condicionante de arquitetura Cloudflare: o Cron Worker faz fetch para um Pages Worker no mesmo domínio/zona, mas o Worker Cron estava sem a compatibilidade `global_fetch_strictly_public`. A Cloudflare documenta que Worker→Worker via fetch requer Service Binding ou essa compatibilidade para este tipo de chamada. citeturn4search0turn4search2

### Correção aplicada
Aplicado diretamente no Worker existente:
- `global_fetch_strictly_public` ativo;
- Cron mantido em `*/5 * * * *`;
- D1 mantido;
- nenhum Worker adicional criado;
- nenhum novo remendo de cache introduzido.

Deployment/version ativa: `ccc410e9-05e0-4720-a30b-91187fb81550`, 100%.

### Validação pendente automática
O próximo ciclo deve confirmar duas coisas:
1. nova invocação do Cron sem 503;
2. nova escrita/atualização em `FOOTBALL_CACHE_DB`.

Workers/Pages logs são a fonte adequada para confirmar invocações e erros. citeturn3search10turn0search2

### Persistência
O runtime Cloudflare já está corrigido. A mesma configuração deve ser persistida em `workers/football-cron/wrangler.toml` antes de qualquer futuro deploy Wrangler/Codex, para impedir regressão.

**Estado:** CORREÇÃO DE RUNTIME APLICADA — aguardar primeiro ciclo de validação. Imagens continuam em standby.


## 21. ATUALIZAÇÃO 2026-10-01 — PASS DO PIPELINE BSD / CACHE E PADRÃO DE SECRETS

### Resultado
O pipeline de competições voltou a escrever no FOOTBALL_CACHE_DB após a recriação do BSD_API_KEY no Cloudflare Pages e um novo deployment de produção.

### Evidência objetiva
- Pages deployment de validação: 59b4f492-2f14-4e61-9eb8-a4c908d5b69d — SUCCESS.
- Nova escrita D1: conference-league, fetched_at = 2026-10-01T22:35:48.835Z, season_id = 1606.
- Cron foi temporariamente acelerado para * * * * * exclusivamente para observar uma execução real e foi imediatamente restaurado para */5 * * * *.

### Conclusão operacional
O D1 não estava a precisar de ser apagado/recriado. O problema comprovado estava no estado/runtime do secret BSD_API_KEY.

Foi identificado um padrão semelhante ao incidente anterior de ADMIN_PASSWORD: um secret pode aparecer configurado no painel e ainda assim o runtime que serve o deployment não o refletir corretamente. A documentação Cloudflare indica que secrets/bindings devem estar presentes antes do deployment que os utiliza.

Regra: para secrets que o runtime diz estarem ausentes, confirmar secret + ambiente + novo deployment antes de mexer em D1 ou no código.

### Estado
PASS — backend BSD → Pages → D1 validado em runtime.

### Próxima frente
Testar o consumo no frontend Home/Competições e confirmar uma segunda renovação automática. Não reabrir alterações de D1, adapter BSD ou arquitetura sem nova evidência.


## 22. MÉTRICAS EDITORIAIS E AUDIÊNCIA — BACKLOG PRIORITÁRIO

### Objetivo
Criar uma forma simples de acompanhar, por notícia e no total:
- número de likes;
- visualizações/entradas na notícia;
- utilizadores/sessões, quando a ferramenta de analytics permitir;
- origem/tráfego (Google, Facebook, direto, etc.), quando disponível;
- taxa de engagement/relação entre visualizações e likes;
- evolução temporal.

### Estado atual
- Existe ARTICLE_LIKES_DB em produção, pelo que a infraestrutura de likes já existe.
- Não foi encontrada uma área administrativa/relatório que apresente os likes por notícia de forma utilizável pela equipa.
- Não foi encontrada uma integração de analytics ativa no código atual para medir visitas e comportamento das notícias.

### Decisão
Não alterar o sistema de likes nem introduzir analytics por impulso nesta tarefa. Esta frente fica registada para implementação própria, com preferência por uma solução simples, de baixo custo e com métricas úteis para decisões editoriais.

### Próximo desenho quando esta frente subir
1. confirmar exatamente o modelo atual de likes e respetivas contagens;
2. escolher a solução de analytics compatível com custo, privacidade e AdSense;
3. medir pageviews/visitas por URL de notícia;
4. disponibilizar os dados no Admin ou num painel simples;
5. acrescentar métricas agregadas e por notícia;
6. validar que a medição não prejudica performance nem SEO.

**Importante:** não confundir "pageview", "sessão", "utilizador" e "engagement rate". Cada métrica deve ser apresentada com a definição correta.


## 23. PAINEL DE MÉTRICAS NO ADMIN — IMPLEMENTAÇÃO FASEADA

### Objetivo
Ter um único local no Admin para consultar:
- likes por notícia;
- visualizações/pageviews;
- utilizadores/sessões, quando disponíveis;
- origem do tráfego;
- rates de engagement;
- evolução temporal.

### Fase 1 — likes
Pode ser implementada autonomamente agora porque o D1 ARTICLE_LIKES_DB já existe e o endpoint de likes já contabiliza por artigo.

### Fase 2 — visitas e rates
Ainda não existe medição de pageviews no site. A implementação deverá primeiro definir uma medição simples e respeitadora de privacidade; depois o mesmo painel passa a apresentar visitas e rates sem criar um segundo sistema de consulta.

### Regra
O painel deve ficar protegido pela autenticação existente do Admin e nunca expor dados de métricas através de uma rota pública.


## 24. PAINEL DE MÉTRICAS — FASE 1 + PAGEVIEWS — 2026-10-02

### Estado
**IMPLEMENTADO EM PRODUÇÃO.**

O Admin passou a ter uma área **📊 Métricas** com:
- likes totais;
- notícias com likes;
- visualizações/pageviews totais;
- tabela por notícia com visualizações, likes e **Like rate** (likes ÷ pageviews), claramente identificado como tal;
- visualizações são registadas no carregamento concluído de uma notícia.

### Medição
- Pageviews são registados numa tabela article_views do ARTICLE_LIKES_DB.
- O evento não guarda IP, nome, email ou o identificador anónimo usado pelo sistema de likes.
- A medição é client-side e só é enviada depois de a notícia ser carregada.
- A métrica atual é **pageview**, não "pessoas únicas". Não apresentar pageviews como utilizadores únicos.

### Infraestrutura
- migration migrations/0002_article_views.sql criada;
- tabela e índices aplicados diretamente à D1 de produção;
- endpoint público mínimo /api/article-view apenas regista a visualização validada;
- endpoints /api/admin/metrics/likes e /api/admin/metrics/views ficam protegidos pela sessão Admin.

### Validação
- D1 confirmou article_views criada e views_total = 0 no momento da validação, sem dados artificiais inseridos.
- deployment final Admin: e608bc59, SUCCESS, alias de produção https://chutapracanto.com.

### Próxima melhoria
Se forem necessários utilizadores únicos, sessões, origem de tráfego ou outras métricas de analytics, tratar como uma fase separada. Não confundir essas métricas com pageviews nem introduzir tracking adicional sem revisão de privacidade.


### Correção de validação 2026-10-02
Na revisão pós-implementação foi detetado que a função de pageview estava criada e o frontend a chamava, mas a rota pública /api/article-view ainda não estava ligada no dispatcher principal do Worker. A ligação foi corrigida antes de considerar a funcionalidade concluída.
- commit: 33e49aa8f0174051755f72ae0a318ae28cbb4d10;
- deployment: cc35198e, SUCCESS, alias de produção;
- não foram inseridos pageviews artificiais.


## 2026-10-02 — Métricas por período

- [x] Admin → Métricas: filtro de **últimas 24h / 7 dias / 30 dias**.
- [x] Likes e pageviews filtrados pelo mesmo período.
- [x] Totais e Like rate recalculados para a janela selecionada.
- [x] Backend restringe os valores de período a uma whitelist (`1d`, `7d`, `30d`).
- [x] Sem dados históricos inventados; apenas os eventos efetivamente registados entram nas métricas.
- [ ] Fase futura separada: visitantes únicos/sessões/origens de tráfego, caso seja necessário e após revisão de privacidade.


## 25. ANALYTICS CPC — ORIGEM, JORNADA E RELACIONADAS — 2026-10-02

**Estado: IMPLEMENTADO EM PRODUÇÃO — primeira fase.**

### Objetivo
Perceber não apenas quantas visualizações uma notícia tem, mas:
- de onde veio a sessão;
- que páginas visitou;
- quanto tempo ativo passou;
- até onde fez scroll;
- se viu/clicou numa notícia relacionada;
- se foi para Competições;
- se clicou em VER TODAS Competições na Home;
- se interagiu com Shorts na Home;
- quais origens trazem sessões (Facebook, Google, Linktree, Threads, X, etc.).

### Implementado
- analytics.js first-party em Home, Notícias, Opinião, Competições e notícia;
- sessão técnica via sessionStorage;
- classificação UTM/referrer;
- suporte a Facebook, Instagram, Google, YouTube, TikTok, Reddit, Linktree, Threads, X/Twitter, Bing, direto, interno e referral;
- page views e exits;
- tempo ativo;
- scroll 25/50/75/90%;
- impressões/cliques de notícias relacionadas;
- clique VER TODAS da Home → Competições;
- impressões/cliques dos Shorts;
- endpoint /api/analytics/event;
- tabela D1 analytics_events;
- Admin → Métricas com sessões, tempo ativo médio, sessões de uma página, origens e ações.

### Relacionadas
A antiga lógica era essencialmente mesma categoria primeiro + data. Agora usa relevância temática + categoria + recência. Mantêm-se 3 cartões e o layout existente.

### Privacidade / interpretação
Não guardar IP, nome ou email. A sessão técnica não deve ser apresentada como pessoa única. A pesquisa Google é classificada como Google quando o referrer/UTM permite; o termo de pesquisa individual não é recolhido nesta fase. Search Console deve continuar a ser usado para queries e impressões de pesquisa.

### Próxima evolução
- [ ] comparar origem → primeira notícia → segunda página → saída;
- [ ] distinguir entrada interna da Home/Notícias/Competições;
- [ ] aprofundar métricas de Competições e Shorts;
- [ ] calcular uma definição de bounce baseada em sessão + ausência de interação significativa, se a amostra for suficiente;
- [ ] eventualmente acrescentar medianas/buckets de tempo;
- [ ] integrar dados do Search Console se for desejado saber as pesquisas concretas que levam ao site;
- [ ] só considerar visitantes únicos persistentes após revisão de privacidade e necessidade real.

### Regra
Não instalar GA4/terceiros apenas para obter estas métricas sem antes avaliar o sistema first-party já implementado. Não duplicar tracking. Não alterar o football backend, D1 de competições ou sistema de likes para esta frente.

### Regra de execução
Até 22/10/2026, continuar sem depender de Codex.


## 2026-10-02 — Correção Admin: regressão da lista + métricas anteriores
- Corrigida regressão `mostrarLista is not defined` que impedia carregar Notícias e Crónicas.
- Restauradas funções de listagem, paginação e pesquisa no `admin/index.html`, mantendo `📊 Ver métricas` por conteúdo.
- Dashboard de métricas continua único para Notícias + Crónicas e voltou a incluir também as métricas anteriores: visualizações de conteúdos, likes totais, conteúdos com likes e `Like rate`, além de partilhas e analytics globais.
- Commit: `3980cd083fb4ed71caa46db41f8169735ff8754a`; produção SUCCESS no deployment `ecd0a194`.
- Regra: alterações futuras às métricas não podem remover funções editoriais nem substituir métricas existentes; apenas acrescentar/reorganizar dentro da área de Métricas.
## 2026-10-02 — VERIFICAÇÃO PÓS-TESTE: MÉTRICAS, GOOGLE E CONTINUA A LER

### Métricas — evidência real
A utilizadora executou três percursos reais em produção (Facebook → notícia → like; URL → Notícias → notícia → like; Google → Home → notícia → permanência → like). A D1 confirmou que os likes e eventos de analytics estão a ser recolhidos.

Conclusão: a recolha não deve ser reescrita por causa do painel vazio. A próxima investigação é exclusivamente da camada de leitura/apresentação do Admin: D1 → API de métricas → frontend do Admin.

### "Continua a ler"
Problema confirmado pela utilização: os cartões relacionados não estão a aparecer, apesar de o índice atual conter notícias relacionadas suficientes.
Próximo passo: investigar a execução/renderização da secção no artigo e corrigir apenas a camada responsável, preservando o algoritmo de relevância e o tracking já existente.

### Pesquisa Google por "Chuta Pra Canto"
O facto de Sobre Nós/Contacto/Termos ou redes sociais aparecerem antes da Home não deve ser interpretado como "Google escolheu as páginas menos vistas". Pageviews internos não determinam diretamente a ordem dos resultados. O Google usa sinais de relevância, correspondência e outros sinais de pesquisa; as próprias orientações recomendam propósito claro, conteúdo útil e títulos/heading descritivos.
Objetivo futuro: reforçar semanticamente o domínio como publicação de futebol e melhorar a descoberta de Home/Competições, mas sem criar sinais artificiais nem alterar páginas institucionais só para tentar mudar a ordem.

## 2026-10-02 — FRENTE LIVE: AUDITORIA ANTES DE MELHORIA

### Estado comprovado do que já existe
Home:
- secção JOGOS EM DIRETO já existe e fica escondida quando não há jogos LIVE;
- cartão já mostra LED vermelho pulsante, LIVE, competição, grupo/jornada, equipas, resultado, minuto e golos quando fornecidos pela BSD;
- descoberta de LIVE: ~60 s;
- quando existem competições LIVE conhecidas: ~15 s;
- não há polling de todas as 7 competições a cada 15 s.

Competições:
- estado LIVE da competição já existe;
- fixtures LIVE aparecem como LIVE, com minuto, marcador e golos;
- snapshot LIVE é atualizado ~15 s quando existe LIVE;
- sem LIVE conhecido, nova descoberta ~60 s;
- fases/grupos/rondas continuam a ser determinados pelos dados BSD.

Backend:
- endpoint /api/competicoes já faz refresh/enriquecimento LIVE e funde o estado LIVE no snapshot normalizado;
- cache LIVE tem TTL próprio (10 s), enquanto a cache normal tem TTL de 15 min;
- stale é fallback e não deve bloquear refresh;
- cpc-football-cron permanece separado e não deve ser recriado.

### Próxima melhoria — sem desfigurar
Antes de alterar os cartões, validar em produção/runtime a cadeia:
BSD LIVE → /api/competicoes → normalização → Home/Competições → atualização visual.

Só depois escolher melhorias visuais/funcionais. A validação mínima deve cobrir:
1. entrada de jogo em LIVE;
2. aparecimento do cartão;
3. atualização do minuto;
4. atualização do marcador;
5. aparecimento de novo golo/marcador;
6. término e saída de LIVE;
7. entrada de outro jogo sem refresh manual;
8. preservação de jornada/ronda/grupo.

Não alterar D1, cache, adapter BSD, cron ou regras de filtros para resolver um problema exclusivamente visual.


### LIVE — melhoria frontend 2026-10-02
- [x] Home: nomes das seleções em português.
- [x] Home: fallback visual de bandeira quando a imagem falha.
- [x] Home: cartão LIVE clicável para competição + grupo + jornada.
- [x] Home: duplicação inglesa removida; usar **Jornada N**.
- [x] Competições: **Jogo em destaque** prioriza LIVE.
- [x] Competições: em **Todos**, com vários jogos, existe navegação discreta por seta.
- [x] Competições: nomes das seleções/golos em português.
- [x] Competições: grupo e jornada preservados ao abrir LIVE a partir da Home.
- [ ] Validação visual final em produção com o jogo LIVE real.
- [ ] Futuramente, se necessário, avaliar fonte de imagens de seleções mais robusta sem mexer no backend BSD.

**Regra:** não alterar D1, cron, adapter BSD ou cache para resolver problemas de apresentação.


### Correção regressão visual LIVE/Competições — 2026-10-02
- [x] Corrigido `safeUrl("")` que estava a gerar a Home como URL de imagem.
- [x] Corrigido markup do fallback visual que estava a aparecer partido no ecrã.
- [x] Logo BSD é usado como primeira fonte visual; bandeira/bola é fallback.
- [x] Nomes de seleções e clubes relevantes tratados em português.
- [x] Home volta a mostrar explicitamente **Jornada N** no cartão LIVE.
- [x] Competições aplica o mesmo sistema de imagens/nomenclatura.
- [x] Infraestrutura BSD/D1/cache/cron preservada.
- [ ] Confirmar visualmente no navegador com Cazaquistão–Moldávia LIVE e com a lista de jogos de Liga Portugal.
