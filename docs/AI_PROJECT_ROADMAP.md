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
