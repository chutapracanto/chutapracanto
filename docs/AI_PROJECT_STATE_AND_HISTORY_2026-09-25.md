# CHUTA PRA CANTO — REGISTO DE ESTADO, HISTÓRICO, TESTES E DECISÕES
## Documento de continuidade operacional para futuras IAs / agentes
**Data de criação:** 2026-09-25
**Última reconciliação operacional:** 2026-09-27
**Repositório:** `chutapracanto/chutapracanto`
**Produção:** `main` → `https://chutapracanto.com`
**HEAD de main verificado no início da auditoria de 2026-09-27:** `a191449d074f993f2de89137d883a8ce6d2ac257`.

Este SHA já incluía o merge da PR #42 e o commit automático posterior de atualização do índice. Alterações documentais desta auditoria avançam o HEAD de `main`; antes de qualquer nova implementação, o HEAD deve ser novamente lido diretamente do GitHub.

> Este documento é um **registo de execução e memória técnica**, não substitui `.github/AI_PROJECT_RULES.md`.
> A ordem obrigatória continua a ser: **Rules → este registo → Bíblia Mestra → GitHub/produção real → histórico específico quando necessário**.
>
> O objetivo é impedir que uma IA futura volte a gastar tempo, créditos ou alterações em problemas já resolvidos, experiências que falharam, PRs fechadas ou hipóteses já descartadas sem nova evidência.

---

# 1. ESTADO EXECUTIVO ATUAL

> **SNAPSHOT OPERACIONAL — 2026-09-28:** FASE 4 ativa. A Fase 3 de dados/API de futebol e competições foi encerrada após PASS de fornecedor BSD, cache D1, atualização automática, UI `/competicoes` e validação em produção. O engagement persistente em D1 está em `main`; a frente Framer/redirects permanece independente. A próxima linha autónoma é SEO técnico + indexação real, com sitemap já submetido ao Search Console e processamento externo pendente.

## 1.1 O projeto está funcional e em produção

O Chuta Pra Canto é um projeto editorial profissional de futebol em português, atualmente suportado por:

- GitHub;
- Cloudflare Pages / Worker;
- domínio oficial `chutapracanto.com`;
- conteúdo Markdown;
- índice próprio `content/noticias-index.json`;
- sitemap;
- páginas editoriais Notícias / Opinião;
- Admin;
- pesquisa;
- SEO técnico;
- OG/Twitter/social preview;
- infraestrutura preparada para AdSense;
- conteúdos de vídeo/podcast e distribuição social fora do núcleo do site.

**Não tratar o projeto como uma prova de conceito.** A infraestrutura principal já foi construída e várias fases foram fechadas em produção.

## 1.2 HEAD / histórico de referência

A referência `f7ef4d9...` pertence ao estado histórico da PR #26 e **não é o HEAD atual**. O HEAD verificado no início da auditoria de 2026-09-27 era `a191449d074f993f2de89137d883a8ce6d2ac257`, mensagem `Atualizar índice de notícias`, descendente do commit `a8f0a2e...` de conteúdo e posterior ao merge da PR #42.

A primeira passagem de LCP continua integrada em produção através da PR #26; esta secção não deve voltar a usar o SHA da #26 como se fosse o HEAD atual.

## 1.3 PRs de LCP

### PR #25
- título: `perf: primeira passagem de LCP mobile`
- **fechada**
- **não mergeada**
- não é produção
- deve ser tratada apenas como histórico da investigação

A #25 foi fechada porque a branch/base ficaram desalinhadas com a evolução da main.

### PR #26
- reaplicação da primeira passagem de LCP sobre a main atual;
- **mergeada**;
- merge commit: `f7ef4d9a4a020dfad3cd59169aee3017774227b6`;
- é esta PR que representa o trabalho de LCP atualmente em produção.

**Regra:** nunca assumir que a #25 é produção. A produção é o estado da main, atualmente `f7ef4d9a...`.

---

# 2. O QUE JÁ FOI IMPLEMENTADO E FECHADO

As seguintes áreas já foram construídas em fases anteriores e não devem ser refeitas sem uma necessidade nova e demonstrável:

## Fundação / arquitetura
- fundação técnica do site;
- separação entre conteúdo e apresentação;
- Cloudflare Worker;
- integração GitHub;
- Admin;
- autenticação por sessão;
- validações de caminhos;
- limites de uploads;
- proteção de uploads de imagem;
- sanitização com DOMPurIFY;
- workflows GitHub.

## SEO / descoberta
- canonical;
- robots.txt;
- sitemap.xml;
- Open Graph;
- Twitter cards;
- dados estruturados;
- NewsArticle para notícias;
- Article para outros tipos;
- BreadcrumbList;
- autores;
- datas;
- tipos editoriais;
- URLs canónicas no domínio `.com`.

## Conteúdo
- índice `content/noticias-index.json`;
- redução do carregamento N+1;
- pesquisa baseada no índice;
- relacionados / “Continua a ler”;
- taxonomia;
- autores;
- separação técnica Notícias vs Opinião;
- página pública de Opinião;
- publicação por Markdown;
- preservação de metadados editoriais.

## UX
- header/footer;
- logo responsivo;
- navegação;
- partilha;
- sticky editorial;
- navegação Notícias / Opinião;
- mobile de Notícias com cartões verticais;
- imagens 16:9 nos cartões;
- preservação do desktop;
- labels/filtros/foco/áudio;
- YouTube carregado por interação;
- feeds adiados quando aplicável.

## Formulários / institucional
- contacto;
- FormSubmit;
- honeypot/CAPTCHA;
- política de privacidade;
- termos;
- política editorial;
- páginas institucionais;
- 404.

## Imagens
- pesquisa Openverse;
- pesquisa Wikimedia;
- deduplicação;
- referência à fonte original;
- uploads próprios com validação.

## Domínio
Migração para:

`https://chutapracanto.com`

Não voltar a usar `pages.dev` como URL editorial/canónica.

---

# 3. IMPORTAÇÃO HISTÓRICA DO FRAMER — LOTE VALIDADO, NÃO MIGRAÇÃO TOTAL

O lote histórico efetivamente validado em 24/09 permanece confirmado, mas esta secção não representa a totalidade do arquivo Framer.

Resultado do lote validado:

- 213 URLs únicas encontradas;
- 179 importadas;
- 34 duplicadas/ignoradas;
- 0 falhas;
- 232 notícias;
- 1 opinião;
- 233 entradas no índice;
- 241 URLs no sitemap;
- workflow temporário de importação removido.

Commit de importação:

`6701b981302dea5955047812e83e92e6a5c17dbe`

Remoção do workflow temporário:

`ced7e4113b9a4fb76102c2a32cd9325fc84ce8bd`

## Escopo corrigido

A importação acima cobre apenas o arquivo/lote que foi efetivamente encontrado e validado em 24/09.

**Não prova que o conteúdo publicado no Framer depois de 22/08/2026 tenha sido migrado.**

A recuperação posterior continua dependente de uma fonte histórica real que contenha essas publicações. A Fase 1 permanece bloqueada até essa fonte existir e permitir inventário e reconciliação.

## Não fazer
- não repetir a importação do lote já validado;
- não reabrir o workflow temporário;
- não duplicar os artigos;
- não apagar os scripts históricos de auditoria/manutenção sem motivo;
- não tratar documentos históricos como estado atual;
- não importar conteúdo posterior a 22/08/2026 por inferência.

## O que aconteceu durante a importação

Houve uma situação em que o importador escreveu os Markdown mas o índice/sitemap ainda não estavam regenerados.

A correção foi operacional:

1. verificar o estado real;
2. regenerar o índice;
3. validar o sitemap;
4. confirmar 233 entradas;
5. confirmar 241 URLs;
6. só depois fechar o lote.

**Lição permanente:** um workflow que termina SUCCESS não significa automaticamente que todos os artefactos derivados estão atualizados.

**Lição adicional:** a conclusão de um lote de importação não deve ser interpretada como prova de migração total sem reconciliação da fonte histórica completa.

---

# 4. EXPERIÊNCIAS QUE FALHARAM / NÃO DEVEM SER REPETIDAS SEM NOVA HIPÓTESE

Esta secção é especialmente importante para futuras IAs.

## 4.1 HTMLRewriter + preload no `<head>` — FALHOU

Durante a otimização de `/noticias`, foi testada a injeção de preload HTML através de `HTMLRewriter`.

Resultado observado:

- deployment tecnicamente SUCCESS;
- resposta de `/noticias` ficou truncada;
- HTML chegou com cerca de dezenas de bytes;
- browser ficou em branco;
- não havia erro JavaScript que explicasse o problema;
- a indexação própria e a primeira imagem estavam corretas;
- o problema foi localizado no caminho de transformação do HTML.

### Correção adotada

Não injetar o preload através de `HTMLRewriter` no `<head>`.

Em vez disso:

- manter o shell/card injection;
- enviar o preload através do header HTTP `Link`;
- reconstruir a `Response` preservando o body;
- remover `Content-Length` manual quando o body é transformado.

Forma utilizada:

`Link: <imagem>; rel=preload; as=image; fetchpriority=high`

### Estado
**Resolvido.**

### Futuro
Só voltar a experimentar HTMLRewriter no `<head>` se existir uma razão concreta e se a transformação puder ser isolada e validada primeiro. Não repetir a mesma abordagem por tentativa e erro.

---

# 5. PERFORMANCE — O QUE FOI TENTADO E O QUE FICOU PROVADO

## 5.1 Baseline anterior

Foram observadas medições Lighthouse/PageSpeed com grande variabilidade.

Exemplos documentados:

### Home
- mobile: LCP observado entre ~3,2 s e ~17,8 s em execuções diferentes;
- desktop: ~3,2 s.

### Notícias
- mobile: ~18,1 s numa execução;
- desktop: ~3,1 s.

### Artigo
- mobile: ~18,2–19,0 s em execuções;
- desktop: ~2,9 s.

### Opinião
- mobile: ~18,2 s;
- desktop: ~3,2 s.

**Importante:** estes números são lab data e foram altamente variáveis. Não devem ser tratados como uma medição de campo ou como uma constante do site.

INP de campo apareceu como “No Data”.

**Nunca tratar “No Data” como zero.**

---

# 6. DIAGNÓSTICO DE PERFORMANCE QUE NÃO EXPLICOU SOZINHO O LCP

Foi analisado o grafo de rede.

Observações:

- grafo de artigo relativamente pequeno;
- critical path máximo observado na ordem de centenas de milissegundos;
- índice próprio na ordem de centenas de KiB;
- Markdown individual pequeno;
- authors/types na ordem de ~0,6 s;
- não foi demonstrado um waterfall suficientemente longo para justificar sozinho LCP de 18–19 s;
- render-blocking opportunities existiam;
- Google Fonts e Font Awesome eram fontes de bloqueio relevantes;
- houve uma captura isolada com Google/DoubleClick pagead HTTP 500, mas isso **não foi provado como causa do LCP**;
- TTFB 0 ms mostrado por uma medição PSI não foi tratado como TTFB real fiável.

### Lição
Não transformar uma auditoria genérica de “opportunity” numa conclusão causal.

Fluxo obrigatório:

**sintoma → evidência → causa → correção mínima → nova validação**

---

# 7. LOGO DE ~2 MiB — PROBLEMA REAL, MAS NÃO CAUSA PROVADA DO LCP

Foi identificado:

`/images/logo.png`

aproximadamente:

- 2,03 MiB;
- 1536×1024;
- apresentado em dimensões muito menores em mobile.

É objetivamente pesado.

Mas:

**não foi provado que seja a causa única ou principal do LCP observado.**

### Decisão
Não substituir/comprimir/reprocessar cegamente o logo durante a investigação de LCP.

### Futuro
Pode ser uma oportunidade de otimização independente:

- criar variante dimensionada;
- converter para formato moderno quando compatível;
- preservar fidelidade visual;
- medir impacto separadamente.

Só fazer isto como variável isolada.

---

# 8. PRIMEIRA PASSAGEM DE LCP — IMPLEMENTADA EM PRODUÇÃO

A primeira passagem incluiu:

- Google Fonts deixou de usar `@import` bloqueante;
- Google Fonts carregam de forma não bloqueante;
- Font Awesome carregado de forma não bloqueante;
- preconnects;
- logo global com prioridade reduzida;
- logo de footer lazy;
- primeira imagem de `/noticias` eager/high;
- restantes imagens lazy/low;
- `decoding="async"` quando aplicável.

## Shell inicial de artigo

O Worker passou a consultar:

`content/noticias-index.json`

para pedidos:

`/noticia?slug=...`

e entregar no HTML inicial:

- categoria;
- tipo;
- H1;
- subtítulo;
- autoria;
- data;
- imagem principal.

`noticia.html` passou a preservar/reutilizar o shell em vez de destruir e recriar a estrutura inicial.

O JavaScript continua responsável por carregar/renderizar o Markdown normalmente.

Breadcrumb também foi integrado ao shell inicial.

## Validação

Foi comprovado:

- HTTP 200;
- HTML inicial contém H1;
- uma única estrutura `.article-heading`;
- hero presente;
- hero eager/high;
- sem duplicação após JavaScript;
- Markdown completo;
- partilha funcional;
- relacionados funcionais;
- navegação funcional.

---
# 9. CLS 0,571 — NÃO RESOLVER POR PALPITEFoi observada uma medição válida de artigo desktop com:

- Performance: 74;
- FCP: ~1,0 s;
- LCP: ~1,2 s;
- CLS: **0,571**;
- TBT: 0 ms.

A auditoria atribuiu aproximadamente:

- ~0,323 ao container principal do artigo;
- ~0,206 ao body.

Também foram apontados:

- logo sem dimensões;
- fontes relacionadas com auditorias de layout.

### O que NÃO ficou provado

Não foi provado que o CLS seja causado por:

- shell inicial;
- JavaScript;
- fontes;
- hero;
- header;
- sticky;
- `--article-progress`;
- uma regra CSS específica.

### Regra
**Não corrigir CLS por palpite.**

Se esta questão voltar a ser investigada, a sequência correta é:

1. trace de Performance;
2. timestamp do Layout Shift;
3. elemento afetado;
4. elemento causador;
5. relação temporal com JS/fontes/header/hero/sticky;
6. correção mínima;
7. nova medição.

Não remover funcionalidades apenas porque aparecem próximas da auditoria.

---

# 10. OPINIÃO — MEDIÇÃO PSI INVÁLIDA

Uma medição de Lighthouse/PageSpeed da página de Opinião apresentou bons valores.

Mas o DOM carregado continha:

**“Não foi possível carregar esta notícia”**

em vez do artigo real.

Logo:

**essa medição NÃO é válida para avaliar a performance real da página de Opinião.**

### Estado
- browser normal da Opinião: funcional;
- medição PSI específica: inválida;
- não usar esse resultado como baseline;
- não corrigir o site com base nesse resultado.

---

# 11. LIGHTHOUSE / PAGESPEED — O QUE NÃO FOI CONCLUÍDO

A execução de Lighthouse/PageSpeed foi tentada no fluxo externo, mas não produziu uma medição nova útil para fechar a fase.

O resultado relevante foi:

**MEDIÇÃO NÃO EXECUTADA**

Não existe, portanto, uma comparação quantitativa rigorosa “antes vs depois” para a primeira passagem de LCP.

### Não dizer
“LCP melhorou X% em produção.”

Isso não foi demonstrado.

### Pode voltar a ser feito?
Sim, **uma única execução futura pode ser útil** se houver uma decisão técnica que dependa dela.

Não deve ser repetida apenas para “confirmar novamente” o que já está suficientemente validado.

---

# 12. REGRA DE OURO PARA PERFORMANCE

Não mexer em:

- hero;
- aspect-ratio;
- dimensões inventadas;
- logo;
- sticky;
- fontes;
- shell;

apenas porque uma ferramenta de auditoria apontou uma associação.

Primeiro provar causalidade.

Uma melhoria que introduza regressão visual ou funcional é pior do que deixar uma oportunidade de performance em aberto.

---

# 13. PR #25 vs PR #26 — LIÇÃO DE PROCESSO

A #25 tornou-se inválida como veículo de merge porque a main avançou.

Em vez de forçar o merge:

1. verificar divergência;
2. fechar a PR antiga;
3. reaplicar o trabalho sobre a main atual;
4. validar;
5. abrir nova PR;
6. fazer merge apenas da versão reconciliada.

Foi criada a #26.

### Resultado
PR #26 mergeada em:

`f7ef4d9a4a020dfad3cd59169aee3017774227b6`

### Regra futura
Uma PR fechada sem merge é histórico.

Nunca “ressuscitar” mentalmente uma PR antiga como se fosse produção.

---

# 14. STICKY EDITORIAL — IMPLEMENTADO

A fase de sticky foi reaplicada sobre a main atual na PR #24.

Implementado:

- sticky editorial progressivo;
- H1 reduz progressivamente;
- header opaco durante scroll;
- artigo permanece em fluxo normal;
- partilha compacta;
- navegação Notícias / Opinião;
- mobile de Notícias vertical;
- imagens 16:9.

Validação externa:

- 320 px;
- 390 px;
- 768 px;
- 1280 px;

sem regressões visuais relevantes documentadas.

A consola ficou inconclusiva por limitação do browser usado.

### Regra
Não reabrir #24 só para repetir a mesma validação.

---

# 15. MOBILE NEWS — ESTADO FECHADO

A página de Notícias passou a usar cartões verticais mobile com:

- imagem 16:9;
- títulos completos;
- relacionados acessíveis;
- desktop preservado.

Foi validado em vários breakpoints.

Só reabrir se surgir uma regressão concreta.

---

# 16. DOMÍNIO E MIGRAÇÃO .COM

A migração para:

`https://chutapracanto.com`

foi concluída.

Foram adaptados:

- canonical;
- OG;
- robots;
- sitemap;
- Worker;
- workflows;
- ads.txt;
- referências de produção.

### Não fazer
Não reintroduzir `chutapracanto.pages.dev` como URL canónica/editorial.

Preview URLs continuam a existir apenas como ambientes de teste quando fornecidas pelo Cloudflare.

---

# 17. ADSENSE / MONETIZAÇÃO

A infraestrutura técnica para AdSense foi preparada.

Publisher ID documentado no histórico:

`ca-pub-1556367149800029`

A conta existente deve ser reutilizada.

### Estado
- preparação técnica: feita;
- aprovação: não assumir;
- operação efetiva: não assumir;
- Search Console / Google News: ainda são trabalho futuro;
- consentimento/CMP: avaliar conforme implementação e tráfego.

### Regra
Não criar uma segunda conta AdSense.

Não introduzir custos.

Não alterar AdSense durante uma investigação de performance sem necessidade concreta.

---

# 18. CONTEÚDO E MODELO EDITORIAL

O CPC não é simplesmente “uma marca de futebol”.

É um projeto editorial de **notícias de futebol português + opinião + análise**, com:

- notícias;
- rumores;
- mercado;
- opinião;
- crítica;
- análise tática;
- rescaldos;
- antevisões;
- podcasts;
- Shorts/Reels;
- conteúdo para YouTube/Facebook/Instagram/TikTok;
- site como camada editorial mais extensa.

### Funções editoriais

**Rute Costa**
- locução;
- apresentação/moderação;
- edição de vídeo/áudio;
- gestão de redes sociais.

**Treinador Pedro Soares**
- análise;
- opinião crítica;
- componente tática;
- mercado quando aplicável.

### Regra
Não transformar opinião em notícia.

---

# 19. QUALIDADE EDITORIAL — PONTO DE ATENÇÃO FUTURO

O arquivo histórico contém conteúdos importados de Framer e dados de épocas anteriores.

Existem exemplos documentados de artigos com:

- `author: ChutaPraCanto`;
- campos antigos;
- URLs `sourceUrl` do antigo Framer;
- conteúdo histórico;
- possíveis artefactos invisíveis de texto;
- títulos com caracteres especiais;
- algumas inconsistências históricas de autoria/metadados.

Isto não invalida a infraestrutura técnica.

Mas, se houver uma futura fase de **higiene editorial/SEO**, deve ser tratada separadamente da performance.

### Não fazer agora por impulso
Não reescrever centenas de artigos históricos apenas porque existem artefactos.

Primeiro medir o benefício e definir uma regra editorial clara.

---

# 20. SCRIPTS / AUDITORIA HISTÓRICA

O script:

`scripts/import-framer-news.py`

permanece no repositório.

O workflow temporário de importação foi removido.

### Decisão
Manter scripts históricos se tiverem valor de auditoria/manutenção.

Não apagar só porque já foram usados.

Não executar novamente a importação histórica sem uma necessidade explicitamente nova e controlada.

---

# 21. CLOUDflare / WORKER

Estado histórico:

- `_worker.js` no repositório;
- existiu/referiu-se historicamente um Cloudflare Worker separado chamado `chutapracanto`.

**Estado atual:** o Worker separado foi apagado/confirmado como inexistente; não é infraestrutura ativa.

O Worker do projeto trata, entre outras coisas:

- autenticação Admin;
- pedidos GitHub;
- conteúdo;
- uploads;
- shell inicial de artigos;
- respostas dinâmicas.

### Segurança já implementada/documentada

- sessão HMAC;
- cookies HttpOnly;
- Secure;
- SameSite=Strict;
- limites de upload;
- validação de extensão;
- validação de conteúdo de imagem;
- caminhos permitidos;
- proteção contra `..`;
- autenticação Admin.

Qualquer alteração no Worker deve preservar estes limites.

---

# 22. GITHUB — RESPONSABILIDADE

Para este projeto:

**GitHub é responsabilidade do Assistente.**

O Assistente pode:

- consultar;
- editar;
- criar branches;
- criar commits;
- criar PRs;
- atualizar PRs;
- fazer merge quando seguro;
- validar;
- corrigir;
- continuar.

O Codex não deve editar o GitHub por iniciativa própria.

---

# 23. CODEX — REGRA ATUAL E DEFINITIVA

O Codex só deve ser usado quando:

1. existe uma capacidade realmente indisponível ao Assistente;
2. essa capacidade é essencial;
3. a execução pode alterar uma decisão, desbloquear trabalho ou validar algo que não pode ser validado diretamente.

Exemplos válidos:

- Chrome real;
- DevTools;
- Network;
- Performance trace;
- Lighthouse/PageSpeed executado no ambiente necessário;
- E2E/local;
- Cloudflare Dashboard;
- sessão/cookies/credenciais locais.

### Não usar Codex para
- editar GitHub;
- editar Markdown;- editar HTML/CSS/JS;
- criar commits;- criar branches;
- criar/mergear PRs;
- confirmar novamente factos já comprovados;
- repetir testes sem nova hipótese;
- “bater no seguimento”;
- gastar créditos porque “mais uma validação seria interessante”.

### Regra interna antes de chamar Codex

Perguntar:

> Consigo fazer isto diretamente?
>
> Já temos evidência suficiente?
>
> Esta execução pode alterar a decisão?

Se a resposta for sim/sim/não, **não chamar Codex**.

---

# 24. FORMATO DE PROMPTS EXTERNOS

Quando for realmente necessário enviar algo à utilizadora para copiar para Codex/terminal/outra ferramenta:

- usar bloco de código;
- ser curto;
- indicar repo;
- mandar ler `.github/AI_PROJECT_RULES.md`;
- mandar ler `.github/CODEX_RULES.md`;
- definir exatamente o limite;
- pedir evidência objetiva;
- proibir alterações se for diagnóstico.

Não copiar a Bíblia inteira para o prompt.

---

# 25. BÍBLIAS E DOCUMENTAÇÃO — NOVA HIERARQUIA

Existem:

- `bíblia primeira conversa.md`;
- `bíblia segunda conversa.md`;
- `bíblia mestra Chuta Pra Canto.md`;
- `.github/AI_PROJECT_RULES.md`;
- `.github/CODEX_RULES.md`;
- este documento.

### Hierarquia

1. estado real atual do GitHub/produção;
2. `.github/AI_PROJECT_RULES.md`;
3. `.github/CODEX_RULES.md` para questões Codex;
4. **este Registo de Estado e Histórico**;
5. Bíblia Mestra;
6. bíblias históricas;
7. memória/conversas antigas.

### Porquê este documento?

A Bíblia Mestra explica a história e arquitetura.

Este documento funciona como um **ledger operacional**:

- o que já foi tentado;
- o que funcionou;
- o que falhou;
- o que foi validado;
- o que foi invalidado;
- o que não deve ser repetido;
- o que pode ser retomado com outra abordagem.

---

# 26. O QUE PODE SER TENTADO NOVAMENTE NO FUTURO

## Performance
Pode voltar a ser investigado:

### A. Logo pesado
**Pode tentar novamente.**

Abordagem correta:
- criar variante otimizada;
- medir isoladamente;
- verificar fidelidade;
- comparar impacto.

### B. CLS
**Pode tentar novamente.**

Mas só com:
- Performance trace;
- Layout Shifts;
- causa temporal;
- correção mínima.

### C. Lighthouse/PageSpeed
**Pode ser executado novamente uma vez quando houver decisão concreta dependente dele.**

Não repetir por rotina.

### D. Fonts
A primeira passagem já removeu bloqueios importantes.

Só voltar a mexer se uma medição nova mostrar benefício concreto.

### E. HTMLRewriter
Pode ser usado para outros objetivos, mas **não repetir a mesma estratégia de preload no head** sem uma nova abordagem técnica.

---

# 27. O QUE NÃO FAZ SENTIDO REPETIR AGORA

- reimportar Framer;
- reabrir PR #25;
- tentar fazer merge da #25;
- repetir a validação mobile já concluída sem regressão;
- repetir a mesma tentativa de preload via HTMLRewriter;
- tratar PSI inválido da Opinião como bug;
- assumir que o logo é a causa do LCP;
- alterar hero por hipótese;
- remover `aspect-ratio` sem evidência;
- inventar `width/height`;
- mexer no conteúdo editorial durante performance;
- usar Codex para tarefas GitHub;
- fazer uma segunda análise externa sem nova hipótese;
- iniciar refactors gerais porque existem “melhorias possíveis”.

---

# 28. O QUE AINDA ESTÁ ABERTO

## Alta relevância

### 1. SEO / indexação real
Validar, quando apropriado:
- Search Console;
- indexação;
- cobertura;
- sitemap processado;
- páginas excluídas;
- dados estruturados;
- Google News quando fizer sentido.

### 2. Monetização
- acompanhamento do AdSense;
- eventual CMP/consentimento conforme tráfego;
- oportunidades de afiliados/parcerias;
- monetização das plataformas sociais.

### 3. Conteúdo/distribuição
- workflow de Shorts/Reels;
- templates;
- reutilização do podcast;
- títulos/hooks;
- distribuição diária;
- ligação entre notícia → vídeo → podcast → redes.

### 4. Performance residual
Só depois de haver evidência nova:
- CLS;
- logo;
- métricas reais;
- eventuais oportunidades de imagem/fontes.

---

# 29. O QUE É MAIS IMPORTANTE PARA O PROJETO COMO NEGÓCIO

O site já tem uma base técnica muito mais madura do que tinha no início.

O risco atual não é simplesmente “falta de código”.

O valor futuro está cada vez mais em:

1. produção editorial consistente;
2. descoberta orgânica;
3. distribuição social;
4. vídeo curto;
5. crescimento de audiência;
6. conversão de audiência em visitas;
7. monetização;
8. autoridade editorial;
9. dados estruturados e indexação;
10. eficiência do workflow.

Portanto, não transformar o projeto num ciclo infinito de micro-otimizações técnicas.

**Performance deve ser tratada como infraestrutura de suporte ao negócio, não como o produto final.**

---

# 30. CHECKLIST DE CONTINUIDADE PARA QUALQUER IA FUTURA

Antes de alterar alguma coisa:

- [ ] Ler `.github/AI_PROJECT_RULES.md`.
- [ ] Ler `.github/CODEX_RULES.md` se houver Codex.
- [ ] Consultar este documento.
- [ ] Consultar a Bíblia Mestra se precisar de contexto histórico.
- [ ] Verificar HEAD real de `main`.
- [ ] Verificar PRs abertas.
- [ ] Confirmar se o problema ainda existe.
- [ ] Procurar implementação existente antes de criar outra.
- [ ] Procurar experiências falhadas neste documento.
- [ ] Não repetir uma solução marcada como falhada sem nova hipótese.
- [ ] Fazer a menor alteração necessária.
- [ ] Validar.
- [ ] Corrigir se necessário.
- [ ] Validar novamente.
- [ ] Atualizar este documento no mesmo ciclo.
- [ ] Atualizar Rules quando a decisão for uma regra permanente.
- [ ] Não deixar o projeto num estado em que a IA seguinte tenha de reconstruir o raciocínio.

---

# 31. REGRA PERMANENTE DE ATUALIZAÇÃO DESTE DOCUMENTO

Sempre que houver uma alteração relevante, acrescentar uma entrada com:

- data;
- problema;
- hipótese;
- implementação;
- resultado;
- validação;
- falha, se existir;
- decisão;
- se pode voltar a ser tentado;
- como deve ser tentado;
- o que não deve ser repetido.

Não apagar o histórico só porque a solução posterior ficou correta.

O objetivo não é produzir um documento bonito.

O objetivo é **evitar trabalho duplicado e preservar conhecimento operacional entre IAs**.

---

# 32. REGISTO DESTA ATUALIZAÇÃO — 2026-09-25

Foi feita uma auditoria direta do estado atual do GitHub antes de criar este documento.

Confirmado:

- `main` = `f7ef4d9a4a020dfad3cd59169aee3017774227b6`;
- PR #26 = mergeada;
- PR #25 = fechada sem merge;
- não existem PRs abertas no estado consultado;
- `.github/AI_PROJECT_RULES.md` contém a regra de uso do Codex apenas quando essencial;
- `.github/CODEX_RULES.md` contém a mesma limitação;
- o Worker atual contém a infraestrutura de produção e o shell dinâmico;
- `content/noticias-index.json` existe em main;
- a árvore atual contém o site, conteúdo, scripts, imagens, vendor, Worker e workflows/documentação esperados.

### Decisão desta atualização

Este documento passa a ser o **registo operacional de experiências, resultados e decisões**, enquanto:

- Rules = regras obrigatórias;
- Bíblia Mestra = contexto/arquitetura/história consolidada;
- este ficheiro = estado evolutivo, testes, sucessos, falhas e caminhos futuros.

---

# 33. FIM — PRINCÍPIO DE CONTINUIDADE

Uma IA futura não deve perguntar:

> “O que é que vocês fizeram até agora?”

Deve conseguir descobrir isso aqui.

Também não deve perguntar:

> “Já tentaram isto?”

Deve procurar primeiro neste documento.

E, sobretudo, não deve repetir uma experiência falhada apenas porque o histórico não foi lido.

**Estado real do GitHub vence sempre este documento.**

**Nova evidência vence decisões antigas.**

**Sem nova evidência, não reabrir problemas fechados.**

FIM.


# 34. AUDITORIA DE INTEGRIDADE DOS METADADOS — 2026-09-25

Durante a continuação da auditoria foi encontrado um problema real nos dados históricos importados do Framer que não estava suficientemente registado:

- `content/noticias-index.json` tinha 238 entradas;
- 179 entradas tinham o campo `author` contaminado com o início/corpo do artigo, em vez de conter apenas `ChutaPraCanto`;
- isto afetava potencialmente a byline, JSON-LD `author` e qualquer funcionalidade que consumisse o autor diretamente;
- o problema estava também presente nos Markdown de origem desses artigos, portanto não era apenas um erro do índice.

## Correção aplicada

1. O workflow `.github/workflows/gerar-indice-noticias.yml` foi reforçado para:
   - detetar autores históricos corrompidos;
   - reparar o frontmatter para `author: "ChutaPraCanto"`;
   - regravar apenas o metadado, preservando o corpo editorial;
   - falhar explicitamente se continuar a existir um autor anormalmente longo;
   - incluir os Markdown reparados no commit automático.
2. O índice atual foi corrigido diretamente: **179 autores corrigidos**.
3. Um artigo-fonte foi reparado diretamente como teste da correção.
4. Validação atual:
   - índice: 238 entradas;
   - autores anormalmente longos: **0**;
   - artigo de teste: frontmatter corrigido.

## Estado da execução automática

O commit que alterou o workflow não apresentou ainda um workflow run visível através do conector GitHub. Portanto, **não assumir que os restantes 178 Markdown já foram reparados no repositório apenas por causa do workflow**.

O índice público já está corrigido. A reparação dos Markdown deve ser considerada concluída apenas quando o estado real do GitHub confirmar os ficheiros ou quando uma execução do workflow produzir o commit automático correspondente.

## Decisão

Este problema é uma **falha de integridade de dados da importação histórica**, não uma questão de performance.

Não voltar a investigar LCP/CLS com estes metadados contaminados sem primeiro garantir que a autoria está limpa.

A documentação Google Search Central confirma que `author.name` deve conter apenas o nome do autor e recomenda `author.url`/ou `sameAs` para desambiguação quando aplicável. citeturn0search0

## Pode voltar a acontecer?

Sim, se novos Markdown forem gerados com frontmatter inválido.

Por isso o workflow passa agora a funcionar também como **validador de integridade**, não apenas como gerador do índice.

## Nova regra

Sempre que o índice for regenerado, validar pelo menos:

- autor não contaminado;
- slug sem duplicação;
- path permitido;
- título presente;
- data válida;
- imagem presente quando aplicável;
- tipo editorial válido;
- sitemap sem duplicados.


## 35. REPARAÇÃO AUTOMÁTICA DOS METADADOS — VALIDAÇÃO FINAL (2026-09-25)

### Falha identificada
- A primeira versão do reparador automático de `author` continha um erro de regex: a expressão tinha `^\\\\s*` em vez de `^\\s*`.
- Resultado: o passo podia detetar o problema no índice, mas não correspondia corretamente à linha `author` no frontmatter dos Markdown históricos.
- A execução do workflow nos commits anteriores falhou por esta causa. Isto explica por que razão a reparação automática não tinha sido efetivamente aplicada aos ficheiros-fonte, apesar de o índice já ter sido corrigido.

### Correção aplicada
- Commit: `f581f5af6917e17ca1993362fbef49f843436da3`
- Corrigida a regex do workflow `.github/workflows/gerar-indice-noticias.yml`.
- O commit acionou efetivamente o workflow `Gerar índice de notícias` por evento `push`.

### Execução validada
- Workflow run: `36128360256`
- Job `gerar-indice`: concluído com sucesso.
- Passos `Gerar índice` e `Commit índice atualizado`: concluídos com sucesso.
- Commit produzido automaticamente: `69617d9e01f4ce7326259661c774b40983490137` (`Atualizar índice de notícias`).

### Verificações após a execução
- `content/noticias-index.json`: 238 entradas.
- Autores com comprimento anormal no índice: 0.
- Foram verificados diretamente vários Markdown que constavam da pesquisa dos ficheiros afetados; o campo `author` está agora corretamente separado do corpo editorial e normalizado para `"ChutaPraCanto"` no frontmatter.
- O índice deriva agora o nome canónico `Chuta Pra Canto` a partir de `content/authors.json`, mantendo `ChutaPraCanto` como alias. Isto é intencional e consistente com o modelo editorial de autores.
- A correção preserva o corpo editorial: a reparação altera apenas o metadado `author`.

### Estado
- **RESOLVIDO E VALIDADO.**
- Não é necessário editar manualmente os ~177 ficheiros afetados individualmente.
- Não repetir a abordagem de edição ficheiro-a-ficheiro.
- O workflow passa a funcionar como mecanismo de saneamento automático para este padrão histórico.
- Próxima auditoria deste problema só é necessária se surgir novamente um `author` anormal ou se uma nova importação introduzir outro padrão de corrupção.


## 36. AUDITORIA SEO TÉCNICA RÁPIDA APÓS A REPARAÇÃO (2026-09-25)

- `robots.txt`: válido e aponta para `https://chutapracanto.com/sitemap.xml`.
- `sitemap.xml`: 246 URLs no estado atual.
- `noticia.html`: contém canonical e JSON-LD.
- Não foi feita nesta etapa uma medição de indexação real no Google Search Console; não inferir indexação a partir destes sinais técnicos.
- Estado: **sinais técnicos básicos presentes; auditoria de indexação real continua separada de SEO on-page técnico.**

## 37. RECONCILIAÇÃO DO HEAD REAL — 2026-09-25

- O HEAD real de `main` foi verificado diretamente no GitHub antes de continuar.
- HEAD atual: `2192b856aecb679ba2d7e1bedeeab8fdd2ef248c`.- Commit: `docs: registar auditoria seo técnica`.
- O HEAD atual está 1 commit à frente de `31f2bb3dd41c199b729cc2fe54f1eacff06f7e64`, sem divergência atrás.
- A única alteração nesse avanço foi documentação do próprio ledger; não houve alteração de código, conteúdo editorial, workflow ou configuração de produção.- Não existem PRs abertas neste momento.
- O HEAD `f7ef4d9...` anteriormente registado no início deste documento está desatualizado; o estado real do GitHub prevalece.
- Consequência: a primeira passagem de LCP continua integrada em produção, mas este novo commit não altera a conclusão técnica sobre LCP/CLS.- Distinção operacional: LCP first pass = **implementada, sem melhoria quantitativa before/after comprovada**; CLS = **problema ainda aberto, sem causa causalmente comprovada**; SEO técnico básico = **implementado e auditado**; indexação real = **ainda não medida no Search Console**.
- Próxima execução deve avançar a partir deste estado, sem criar uma nova fase de documentação por si só.



## 38. VALIDAÇÃO PÓS-MERGE / PRODUÇÃO — 2026-09-25

Foi feita a validação externa da produção após a reconciliação do HEAD e da auditoria SEO técnica.

### Produção
- Home: HTTP 200 e conteúdo visível.
- `/noticias`: HTTP 200 e conteúdo visível.
- Artigo: HTTP 200 e conteúdo visível.
- `/opiniao`: HTTP 200 e conteúdo visível.
- Não foram observados novos problemas concretos nesta validação.

### Limitações
- Google Search Console não ficou acessível na sessão externa: houve redirecionamento para autenticação/login. Portanto, sitemap processado, cobertura e indexação real continuam **não validados**.
- Consola do browser não foi verificada nesta ronda por limitação do ambiente.

### Estado técnico
- Produção funcional: **VALIDADO** nos percursos acima.
- SEO técnico básico: **IMPLEMENTADO/AUDITADO**.
- Indexação Google real: **ABERTA / NÃO MEDIDA**.
- LCP first pass: **IMPLEMENTADA, sem melhoria quantitativa before/after comprovada**.
- CLS: **ABERTO, sem causa causalmente comprovada**.

### Decisão
Esta validação não justifica reabrir automaticamente PR #25, repetir testes já concluídos ou criar uma nova fase documental. PR #25 continua fechada sem merge.

A partir deste ponto, qualquer nova investigação de performance deve depender de uma hipótese/decisão concreta. Se não houver essa necessidade, o trabalho pode avançar para as áreas de maior relevância do projeto, sem transformar performance residual num ciclo de micro-otimizações.

### Regra de continuidade documental
A partir de agora, quando uma alteração relevante, validação, falha, decisão ou mudança de estado do projeto for concluída, o Assistente atualiza **automaticamente** os ficheiros Markdown operacionais relevantes no mesmo ciclo. A utilizadora não precisa de pedir a atualização separadamente. Não serão criados commits documentais apenas por rotina quando nada relevante mudou.


## 39. RECONCILIACAO DAS QUATRO CONVERSAS E CONTINUIDADE AUTOMATICA — 2026-09-25

Foi feita a reconciliacao documental entre a Biblia da 1a conversa, a Biblia da 2a conversa, a Biblia Mestra da 3a conversa, a documentacao da 4a conversa e o estado real do GitHub.

### Resultado
- A Biblia Mestra anterior ja consolidava as duas Biblias anteriores e o handoff; nao foi necessario pedir as conversas 1 e 2 para recriarem documentos.
- A Biblia Mestra foi atualizada para refletir o estado posterior da 4a conversa.
- PR #25 permanece fechada sem merge.
- A primeira passagem de LCP foi reaplicada na main atual pela PR #26 e esta em producao.
- Producao pos-merge foi validada.
- CLS continua aberto sem causa causal comprovada.
- Indexacao real no Search Console continua nao medida.

### Falha de continuidade identificada
Foi identificado um padrao em que a IA identifica o proximo passo, descreve-o e para, obrigando a utilizadora a pedir continuacao. Quando o passo seguinte esta dentro da autorizacao, e seguro, tecnicamente possivel e nao depende de decisao externa, isso e considerado uma falha de execucao.

### Regra aplicada
As Rules e a Biblia Mestra passaram a ter um Gate Obrigatorio Antes de Cada Resposta:
- executar a proxima acao autonoma antes de responder;
- se houver erro corrigivel dentro do escopo, diagnosticar, corrigir e validar;
- nao perguntar se deve continuar quando a autorizacao geral ja cobre a acao;
- nao abandonar uma tarefa por causa de um erro corrigivel;
- atualizar automaticamente a documentacao relevante no mesmo ciclo de uma implementacao, falha, correcao, abandono ou decisao relevante.

### Estado
IMPLEMENTADO / DOCUMENTADO. Esta alteracao e processual e nao altera o codigo do site.


## 40. CORRECAO DE ESCOPO DA MIGRACAO FRAMER — 2026-09-25

### Problema
Uma validacao posterior distinguiu corretamente entre:
- os 179 ficheiros historicos importados do Framer em 05/08/2026; e
- noticias que foram publicadas no Framer posteriormente, depois do periodo em que o site proprio ja estava a receber noticias pelo Admin.

A existencia de ficheiros Framer no repositorio **nao prova** que todo o arquivo posterior do Framer tenha sido migrado.

### Estado confirmado
- A importacao validada de 24/09 cobriu 213 URLs unicas encontradas no arquivo publico entao usado, com 179 importadas, 34 duplicadas/ignoradas e 0 falhas nessa execucao.
- Isso nao deve ser interpretado como prova de que noticias publicadas no Framer depois de 22/08/2026 foram importadas.
- A utilizadora informou que a ultima noticia efetivamente presente no site antes da fase posterior do Framer era de 22/08, houve uma publicacao manual em 23/08 e depois existiram noticias publicadas no Framer durante o periodo em que o sistema proprio ainda apresentava problemas.
- Foram referidas tentativas de migracao em 16/09 e 17/09, mas o estado atual nao deve assumir que essas noticias foram recuperadas sem evidencia.

### Decisao
A classificacao historica **“importacao Framer concluida” fica limitada ao lote/arquivo efetivamente validado de 24/09**. Nao marcar a migracao de todo o conteudo posterior do Framer como concluida.

Antes de qualquer nova importacao:
1. identificar a fonte historica exata que contem as noticias posteriores a 22/08;
2. construir a lista de URLs/slugs dessa fonte;
3. comparar com o estado atual do GitHub/index;
4. separar ja existentes, ausentes e duplicados;
5. so depois importar o conjunto ausente;
6. validar index, sitemap, Admin e producao.

Nao executar uma importacao cega nem apagar o bloqueio/protecao existente sem uma fonte e lista verificadas.

### Registo de aprendizagem
O erro anterior foi de **interpretacao do alcance da importacao**, nao prova de que os 179 ficheiros tenham desaparecido. O repositorio contem os ficheiros do lote historico; a questao em aberto e o conteudo posterior do Framer.

Estado: **ESCOPO CORRIGIDO / RECUPERACAO POSTERIOR DO FRAMER PENDENTE**.



## 41. RECONCILIAÇÃO DA FONTE HISTÓRICA POSTERIOR DO FRAMER — 2026-09-25

A linha de trabalho foi parada antes de qualquer nova frente e foi feita uma reconciliação específica da lacuna posterior a 22/08/2026.

### Documentação e estado GitHub revistos
Foram relidos diretamente no estado atual do repositório:
- `.github/AI_PROJECT_RULES.md`;
- `bíblia mestra Chuta Pra Canto.md`;
- `docs/AI_PROJECT_STATE_AND_HISTORY_2026-09-25.md`;
- `.github/CODEX_RULES.md`;
- `content/noticias-index.json`;
- `scripts/import-framer-news.py`.

O GitHub atual continua a ser a autoridade factual.

### 1. Fonte histórica correta identificada

O importer histórico existente documenta como fonte pública:
`https://chutapracanto.framer.website/news`
e as páginas individuais:
`https://chutapracanto.framer.website/noticias/<slug>`.

Essa foi a fonte real usada na execução de 24/09 que encontrou as 213 URLs únicas.

Contudo, essa fonte pública **não é suficiente para provar a existência ou a lista das publicações posteriores a 22/08/2026**. A execução histórica só prova o conjunto que estava exposto naquele arquivo público no momento da execução.

Para recuperar de forma exaustiva o conteúdo posterior, a fonte histórica necessária passa a ser o **estado histórico do projeto/arquivo CMS do Framer ou um export/backup desse conteúdo**, caso o arquivo público atual não contenha essas páginas.

### 2. Verificação da lista real posterior

Foram feitas verificações autónomas no GitHub:
- pesquisa de referências Framer associadas a 23/08/2026;
- 16/09/2026;
- 17/09/2026;
- 22/08/2026;
- pesquisa de commits e documentação relacionados com o Framer.

Resultado:
- não existe no GitHub uma lista histórica adicional de URLs posteriores a 22/08;
- não existe um artefacto versionado com o inventário dessas publicações;
- `content/noticias-index.json` contém artigos datados de 23/08, 16/09 e 17/09, mas esses artigos pertencem ao conteúdo já publicado pelo sistema próprio e **não têm `sourceUrl` Framer**; portanto não podem ser usados como prova da lista posterior do Framer.

### 3. Comparação com o conteúdo atual

No estado atual do índice:
- existem 238 entradas;
- as entradas com `sourceUrl` Framer correspondem ao lote histórico importado;
- as publicações posteriores encontradas no índice com datas de 23/08, 16/09 e 17/09 usam imagens locais e não são referências ao arquivo Framer.

Conclusão: o GitHub **não contém atualmente uma representação factual da lista de artigos posteriores do Framer que permita calcular o conjunto ausente artigo a artigo**.

### 4. Verificação direta da disponibilidade externa

Foi tentado autonomamente aceder ao domínio histórico:
- `https://chutapracanto.framer.website/news`;
- `https://chutapracanto.framer.website/noticias`;
- `https://chutapracanto.framer.website/sitemap.xml`;
- `https://chutapracanto.framer.website/robots.txt`.

O acesso externo disponível nesta sessão não conseguiu resolver/aceder ao domínio Framer. O ambiente de execução local também falhou a resolução DNS de `chutapracanto.framer.website`.

Isto significa que **não é possível, nesta sessão, obter de forma verificável a lista posterior diretamente do site histórico**.

### 5. Decisão de segurança

Não foi feita qualquer importação.

Não foram criados artigos com base em títulos presumidos, pesquisas incompletas ou memória.

Não foi alterado `content/noticias`, `content/noticias-index.json` ou o sitemap para tentar preencher a lacuna por inferência.

Isto é intencional: sem uma lista-fonte verificável, uma importação seria cega e violaria a regra de não inventar conteúdo editorial.

### 6. Dependência externa real identificada

A única dependência que impede a continuação autónoma é agora concreta:

**é necessário acesso ao conteúdo histórico posterior do projeto Framer, através de uma fonte que contenha efetivamente essas publicações — idealmente o projeto/CMS histórico do Framer ou um export/backup/arquivo que preserve as páginas publicadas depois de 22/08/2026.**

O GitHub atual não contém essa lista e o domínio público histórico não está acessível neste ambiente.

Quando essa fonte estiver disponível, a operação correta já está definida:
1. extrair a lista real de URLs/slugs;
2. obter cada página/conteúdo;
3. comparar por slug, `sourceUrl` e título+data com o GitHub;
4. produzir lista de existentes vs ausentes;
5. só então fazer uma importação controlada dos ausentes;
6. regenerar e validar índice/sitemap/produção.

### Estado final desta reconciliação

**RECUPERAÇÃO POSTERIOR DO FRAMER: BLOQUEADA POR FONTE HISTÓRICA EXTERNA REAL.**

**IMPORTAÇÃO CEGA: NÃO EXECUTADA.**

**MIGRAÇÃO FRAMER TOTAL: NÃO CONCLUÍDA.**

Nenhuma nova frente de conteúdo, podcast, distribuição, monetização ou performance foi iniciada nesta linha de trabalho.


## REORGANIZAÇÃO DO SISTEMA DE CONTINUIDADE — ROADMAP OFICIAL — 2026-09-25

Foi identificada uma lacuna de processo: Rules, Bíblia e Ledger definiam como trabalhar e o que já tinha acontecido, mas não existia um documento único e obrigatório que definisse a sequência das grandes fases do projeto.

Ação executada:
- criado `docs/AI_PROJECT_ROADMAP.md`;
- o Roadmap passou a definir a ordem das grandes frentes e os critérios de mudança de fase;
- `.github/AI_PROJECT_RULES.md` passou a exigir a consulta do Roadmap antes de iniciar ou mudar de frente;
- `bíblia mestra Chuta Pra Canto.md` passou a apontar para o Roadmap como documento de sequência operacional;
- foi explicitada a separação entre lane técnica do site e lane criativa/distribuição;
- foi explicitamente preservada como fase estrutural a futura integração de dados/API de competições.

Estado operacional registado:
- Fase 1 — recuperação/consolidação do conteúdo histórico: BLOQUEADA pela fonte histórica externa posterior a 22/08/2026;
- não avançar para podcasts/cortes/distribuição como substituição da fase bloqueada;
- não voltar a LCP/CLS sem hipótese/evidência nova;
- não esquecer a fase de dados/API de futebol.

Objetivo:
evitar que uma IA reconstrua a rota a partir de memória de conversa, salte para uma frente criativa por iniciativa própria ou apresente repetidamente um "próximo passo" sem o executar.

Commit do Roadmap: `f65ce68fae6c9d07114672dd202efb891b3d2023`
Commit das Rules: `fc7526797734cd7ad87ab2ad9796b33d0549a2fa`
Commit da Bíblia Mestra: `c7432fe44fa5b18fb2ea02fa21a11da4fec1310b`


## SISTEMA DE ARRANQUE DA IA — 2026-09-25

Para reduzir perda de contexto e leitura desnecessária, foi criado:

`.github/AI_START_HERE.md`

Função:
- fornecer o mapa mínimo de arranque;
- indicar a hierarquia documental;
- indicar a fase operacional atual;
- impedir saltos de fase;
- lembrar a existência da fase de API/dados de futebol;
- separar lane técnica de lane criativa;
- reforçar o ciclo executar -> validar -> corrigir -> documentar.

As Rules foram atualizadas para exigir a leitura do Start Here antes de qualquer tarefa do projeto.

Commit Start Here:
`e4fc2f0715a4d2b7d66682db9ec0af4f4a6d5f3b`

Commit Rules:
`b5d0c3999f3dd3d51a2a8b30e8625e15623a06ff`



## 42. RECONFIRMAÇÃO OPERACIONAL DA FASE 1 — 2026-09-25 13:48

Foi retomado o projeto exclusivamente a partir da hierarquia oficial atual:
1. `.github/AI_START_HERE.md`;
2. `.github/AI_PROJECT_RULES.md`;
3. `.github/CODEX_RULES.md`;
4. `docs/AI_PROJECT_ROADMAP.md`;
5. este ledger;
6. `bíblia mestra Chuta Pra Canto.md`.

### Estado real confirmado no GitHub
- `main` não tem PRs abertas.
- O Roadmap mantém **FASE 1 — recuperação/consolidação do conteúdo histórico** como fase operacional atual.
- A Fase 1 permanece **BLOQUEADA POR FONTE HISTÓRICA EXTERNA**.
- O lote Framer de 24/09 continua limitado a 213 URLs únicas / 179 importadas / 34 duplicadas ou ignoradas / 0 falhas.
- A migração total do conteúdo posterior a 22/08/2026 continua explicitamente não concluída.
- A Fase 3 de dados/API de futebol e competições permanece registada no Roadmap e não foi perdida nem substituída por uma frente criativa.
- Fase 5/performance não foi reaberta.

### Nova validação autónoma
Além da reconciliação anterior, foi novamente tentado acesso direto ao arquivo histórico público:
- `https://chutapracanto.framer.website/news`;
- `https://chutapracanto.framer.website/sitemap.xml`;
- `https://chutapracanto.framer.website/robots.txt`.

O acesso web disponível continua a devolver o domínio como inacessível nesta sessão. Pesquisas públicas por páginas `/noticias` do domínio e pelas datas 23/08, 16/09 e 17/09 também não devolveram resultados verificáveis.

### Decisão
Não existe neste momento uma nova ação autónoma que possa produzir a lista factual dos artigos Framer posteriores a 22/08 sem uma fonte histórica adicional.

Não foi:
- importado conteúdo;
- alterado conteúdo editorial;
- alterado índice;
- alterado sitemap;
- alterada a fase do Roadmap;
- iniciado trabalho de podcast/distribuição/monetização;
- reaberta a frente LCP/CLS.

**Estado confirmado: FASE 1 BLOQUEADA; nenhuma inferência editorial autorizada.**

A retomada técnica desta fase exige acesso a uma fonte histórica que contenha efetivamente as publicações posteriores a 22/08/2026 (projeto/CMS histórico do Framer ou export/backup equivalente). A partir dessa fonte, a comparação e a importação controlada podem ser executadas diretamente.


## 43. ETAPA FUTURA DE ENCERRAMENTO DO DOMÍNIO FRAMER — 2026-09-25

Foi registada uma decisão de encerramento da migração histórica que **não deve ser executada agora**.

### Pré-condição obrigatória
A etapa só pode começar depois de a Fase 1 estar completamente concluída e validada, incluindo:
1. recuperação de todas as notícias Framer em falta;
2. comparação e validação de slugs;
3. migração do conteúdo identificado;
4. validação do índice e sitemap;
5. validação do Admin e produção.

### Objetivo
Desativar o site histórico em `https://chutapracanto.framer.website` e encaminhar os acessos para `https://chutapracanto.com`, incluindo homepage e URLs de notícias históricas.

### Decisão técnica
Não assumir previamente os Redirects normais do Framer. Quando a etapa chegar, investigar primeiro a configuração real do domínio histórico e identificar o mecanismo correto no hosting provider/origem que efetivamente controla esse domínio. O mecanismo deve ser tecnicamente seguro e gratuito, sem custo obrigatório, antes de qualquer implementação.

### Inventário obrigatório antes da execução
Inventariar URLs históricos e cruzá-los com os URLs existentes no `.com`, produzindo mapeamentos apenas para destinos reais. Validar ausência de loops, cadeias de redirects e destinos inexistentes, e validar respostas HTTP e destinos finais.

### Estado
**PLANEADO / NÃO EXECUTAR AGORA.**

Esta decisão não altera a ordem do Roadmap nem desbloqueia a Fase 1. Enquanto a fonte histórica continuar indisponível, não alterar DNS, domínio, Framer, Cloudflare, redirects, conteúdo ou sitemap para antecipar esta etapa.


## 44. PROTOCOLO OBRIGATÓRIO DE DESBLOQUEIO OPERACIONAL — 2026-09-25

### Problema identificado
Foi identificado um padrão recorrente em que a IA deteta uma dependência externa, regista o bloqueio e continua com documentação ou descreve o próximo passo sem fornecer à utilizadora uma forma concreta de desbloquear a tarefa.

### Correção aplicada
Foi criado:
- `docs/AI_EXECUTION_PROTOCOL.md`

E reforçados:
- `.github/AI_START_HERE.md`
- `.github/AI_PROJECT_RULES.md`
- `.github/CODEX_RULES.md`
- `bíblia mestra Chuta Pra Canto.md`

### Nova regra operacional
**UM BLOQUEIO NÃO É UM RESULTADO.**

Quando a IA não consegue executar diretamente uma ação, deve primeiro verificar se existe ação autónoma disponível. Se não existir, deve identificar a dependência exata e transformá-la numa instrução acionável para a Rute ou num prompt executável para o Codex, conforme quem tenha a capacidade necessária.

É proibido terminar apenas com formulações vagas como “fonte externa bloqueada”, “acesso necessário”, “investigar posteriormente” ou “o próximo passo é X” quando existe uma forma concreta de desbloquear a tarefa.

Foi também corrigida a regra que dizia para nunca pedir imagens/documentos/prints: agora estes recursos só podem ser pedidos quando forem efetivamente a dependência concreta e a IA deve explicar exatamente o que precisa e como o utilizador o deve obter.

### Estados obrigatórios de saída
- CONCLUÍDO
- CONTINUAÇÃO AUTOMÁTICA
- AGUARDA RUTE
- AGUARDA CODEX
- BLOQUEIO REAL

AGUARDA RUTE e AGUARDA CODEX exigem instruções acionáveis. BLOQUEIO REAL exige explicar qual capacidade/fonte está realmente em falta.

### Objetivo
Eliminar o padrão de “bater no ceguinho” e reduzir ao mínimo a transferência de trabalho técnico para a utilizadora, mantendo a autonomia da IA e o uso do Codex apenas quando necessário.

Estado: **IMPLEMENTADO / DOCUMENTADO.**


## 44. FONTE HISTÓRICA DO FRAMER DISPONIBILIZADA — 2026-09-25

A fonte primária que estava a bloquear a Fase 1 foi finalmente disponibilizada através de export do CMS Framer e colocada no GitHub.

### Fonte recebida
- Export JSON do CMS da coleção **News**.
- Total de registos no export: **213**.
- O ficheiro original foi colocado na raiz como `News.json`; foi reorganizado para `docs/framer/framer-news-export-2026-09-25.json`.
- O ficheiro de raiz `News.json` foi removido depois da cópia validada para a localização documental.
- Commits de organização:
  - `426c784d093e742d15ff19069e3d1d210a99f1dd` — criação da localização documental.
  - `88142d9adbb4bb76bb354b24469d742529b8828c` — remoção do duplicado na raiz.

### Primeira reconciliação objetiva
Considerando como histórico pós-22/08 os registos com `Published > 2026-08-22T23:59:59.999Z`:
- 163 registos Framer são posteriores a 22/08.
- 107 desses 163 têm um **slug já existente** no índice atual.
- 56 desses 163 **não têm slug correspondente** no índice atual e são candidatos objetivos a conteúdo ausente.
- O export não contém slugs duplicados internamente: 213 registos = 213 slugs únicos.

Importante: os 107 slugs coincidentes **não são classificados automaticamente como duplicados descartáveis**. A data do Framer é posterior à data publicada atualmente no site para esses casos, pelo que podem representar republicações/versões posteriores do mesmo conteúdo. Um caso já verificado (`águias-desafiam-ac-milan-no-arranque-da-liga-europa`) apresenta equivalência textual integral entre o conteúdo Framer e o Markdown atual, mas com datas de publicação diferentes. A reconciliação final deve, portanto, validar conteúdo/metadata antes de decidir entre ignorar, atualizar metadata ou importar.

### Estado
- A dependência "fonte histórica do Framer inacessível" está **REMOVIDA**.
- A Fase 1 continua a ser a fase operacional.
- Não foi feita ainda qualquer importação automática dos 56 candidatos nem atualização em massa dos 107 slugs coincidentes.
- Não foi inventado nenhum conteúdo.
- O próximo passo obrigatório é a reconciliação final dos candidatos, com validação suficiente para decidir por artigo.


## 45. CORREÇÃO DA RECONCILIAÇÃO FRAMER — 2026-09-25

A análise anterior que classificava os 107 slugs coincidentes como possíveis duplicados estava incompleta e foi corrigida.
### Evidência atual
- O índice atual tem **238 entradas**.
- **180 entradas** do índice estão datadas de 05/08/2026 (incluindo a grande maioria do lote Framer histórico); este facto explica as 107 coincidências por slug.
- Entre os **163 artigos Framer publicados depois de 22/08**, existem:  - **107** com o mesmo slug de uma entrada antiga do índice, mas essa entrada está em **05/08/2026**;
  - **56** sem qualquer slug correspondente no índice.
- Portanto, a coincidência de slug **não prova que os 107 artigos pós-22/08 estejam publicados no `.com`**.
- A conclusão operacional correta é: **os 163 artigos pós-22/08 permanecem candidatos de recuperação/reconciliação**.
### Correção documental
- O inventário anterior de apenas 56 candidatos foi removido por poder induzir a conclusão errada de que só 56 artigos precisavam de análise.
- Foi criado o inventário canónico provisório:
  - `docs/framer/framer-post-22-08-reconciliation-2026-09-25.json`
  - contém os 163 registos pós-22/08 e indica se existe apenas coincidência de slug com a entrada antiga de 05/08 ou se não existe no índice.
- Não houve importação de conteúdo com base nesta análise.

### Próxima validação obrigatória
Os 163 devem ser comparados com o conteúdo efetivo dos Markdown atuais e com o comportamento de publicação/ordenamento do site. A regra de decisão não será `slug == slug`; será necessário determinar, por artigo, se o conteúdo pós-22/08 já está efetivamente representado no `.com`, se apenas existe uma versão antiga, ou se está ausente. Só depois se prepara a migração.


## 46. FASE 1 DESBLOQUEADA — RECONCILIAÇÃO DOS 163 REGISTOS FRAMER — 2026-09-25

A fonte histórica que bloqueava a Fase 1 está disponível no GitHub através do export CMS docs/framer/framer-news-export-2026-09-25.json.

### Estado factual
- Export Framer: 213 registos.
- Registos publicados depois de 22/08/2026: 163.
- Inventário canónico de reconciliação: docs/framer/framer-post-22-08-reconciliation-2026-09-25.json.
- Os 163 continuam a ser a população operacional da reconciliação.
- A coincidência de slug com entradas antigas datadas de 05/08 não é prova de migração atual.
- Não foi feita importação em massa com base apenas no slug.

### Ação imediata
A Fase 1 passa de BLOQUEADA para UNBLOCKED / EM EXECUÇÃO. A próxima operação é comparar os 163 registos Framer com o conteúdo Markdown efetivamente existente e com os metadados de publicação do .com, classificando cada artigo antes de qualquer importação.

### Regra de decisão
Por artigo, distinguir entre:
1. conteúdo já representado corretamente no .com;
2. conteúdo existente mas com metadata/data histórica incorreta e que precisa de correção;
3. conteúdo atualizado/diferente que precisa de reconciliação;
4. conteúdo ausente que pode ser importado;
5. conteúdo não suficientemente provado para alteração.

Só depois dessa classificação serão alterados content/noticias, content/noticias-index.json, sitemap e/ou produção.

Commit de desbloqueio do Roadmap: d305c0ff0371a325772946dd84a1189466c11011.


## 47. RECONCILIAÇÃO DOS 163 REGISTOS FRAMER — METADATA CONCLUÍDA — 2026-09-25

### Resultado validado no repositório
- População operacional: **163/163** registos Framer publicados entre 23/08/2026 e 22/09/2026.
- Os 163 ficheiros Markdown correspondentes foram reconciliados **apenas no campo de metadata de publicação** (published, date, dataNoticia ou data, conforme o frontmatter existente), usando exclusivamente a data framerPublished do export.
- Não foi alterado o corpo editorial dos artigos.
- O inventário de reconciliação ficou com indexPath resolvido para **163/163** registos.
- content/noticias-index.json: **238 entradas**; os **163/163** registos do inventário têm agora a data Framer correta no índice; **0 mismatches / 0 ausências**.
- sitemap.xml: **246 URLs** após regeneração.
- O workflow canónico de geração do índice/sitemap terminou com **success** no run 67.
- Os workflows temporários usados para executar a reconciliação foram removidos da branch; o workflow canónico foi restaurado ao conteúdo de main.
- main não foi alterada diretamente. A execução permanece isolada em framer-reconciliation-2026-09-25.

### Estado atual
**RECONCILIAÇÃO DE METADATA: CONCLUÍDA E VALIDADA NO GITHUB.**

### Validação externa ainda pendente
- A tentativa de abrir a produção (chutapracanto.com), o sitemap servido e a área Admin no ambiente externo não foi acessível.
- Não é possível, nesta sessão, declarar produção ou Admin validados.
- A validação de índice, sitemap e metadata no repositório está concluída; produção/Admin ficam como dependência externa real.

### Próxima operação automática após desbloqueio externo
1. validar produção;
2. validar sitemap servido em produção;
3. validar Admin;
4. comparar o resultado servido com o estado GitHub já validado;
5. só então fechar a reconciliação operacional.


## 48. FECHO DA RECONCILIAÇÃO FRAMER E NOVO BACKLOG — 2026-09-25

A reconciliação dos 163 registos Framer posteriores a 22/08/2026 foi concluída e integrada em main através da PR #27.

### Resultado
- 163/163 metadata reconciliada;
- 0 mismatches e 0 ausências no índice para a população reconciliada;
- corpo editorial dos artigos não alterado;
- PR #27 mergeada: 73da0ac1d692a05a3138983e938454fc4be1c5c5;
- workflow canónico de geração do índice/sitemap executado com sucesso após o merge;
- sitemap servido em produção foi aberto e verificado pela utilizadora como funcional.

### Itens registados para a próxima frente
1. Notícias — reset de filtros/pesquisa: “Todas”/categorias devem devolver de forma previsível à listagem completa.
2. Sticky header desktop/mobile: após encolher, permanecer compacto/transparente no topo; não desaparecer; texto sem mudança de linha/posição; mobile com navegação secundária mais acima.
3. Like/heart: pesquisar evidência e padrões atuais de 2026+ no nicho de futebol/editorial antes de implementação.
4. Framer → .com: preparar migração de URLs com mapeamento origem→destino real; redirects cross-domain não devem ser assumidos como capacidade nativa do Framer.
5. Slugs: investigar e corrigir duplicações/variantes apenas com estratégia canónica e compatibilidade de URLs.

### Decisões preservadas
- Não repetir medições ou experiências de performance sem hipótese nova.
- Não reabrir a importação histórica já fechada.
- Não apagar scripts históricos que tenham valor de auditoria.
- Não avançar para uma fase posterior esquecendo a fase oficial de dados/API de futebol.
- Manter separadas a lane técnica e a lane criativa/distribuição.

### Estado operacional
**FASE 1: CONCLUÍDA quanto à reconciliação de metadata.**
**FASE 2: PRÓXIMA FRENTE TÉCNICA.**

A etapa de desativação/redirect do domínio histórico Framer permanece planeada, mas não deve ser executada antes do inventário e mapeamento de URLs.

## 49. REPARAÇÃO DA FORMATAÇÃO DOS ARTIGOS FRAMER — 2026-09-25 16:22

### Estado real no GitHub
A PR #32, criada sobre a main em `4c8d5089880eb22799e028b03a10f52fa3c4931d`, foi validada quanto ao escopo e mergeada em `main`.

- PR #32: **MERGED**.
- Merge commit: `7b91a3793620fd5802242a0775c552432afb5fa3`.
- Head validado antes do merge: `57560ca3b16ac3720c5da710e9c36d435dc7d329`.
- Main estava 0 commits atrás da branch da PR e a PR estava `mergeable: true`.
- Não existem PRs abertas após o merge.
- A alteração abrangeu **213 artigos históricos**: o corpo foi reconstruído a partir da estrutura HTML do Framer, preservando parágrafos, headings, negritos, itálicos, listas, blockquotes, links e imagens; títulos/subtítulos foram limpos de caracteres invisíveis/mojibake.
- O importador recebeu uma rota explícita `--repair-existing` para futuras reparações controladas.
- A alteração não modificou o índice nem o sitemap; o diff da PR foi limitado ao workflow do importador, ao script e aos conteúdos Markdown.

### Validação executada
Foram inspecionados no branch da PR exemplos representativos antes do merge e, após o merge, o conteúdo equivalente em `main`. A estrutura Markdown esperada está presente.

A descrição da PR regista execução real de 213/213 URLs, 0 falhas e 213/213 artigos reparados. O connector atual não expõe os runs de push dessa execução como workflow runs associados ao commit, pelo que essa evidência permanece a evidência declarada pela própria execução/PR e não um status externo reproduzível pelo connector.

### Decisão
**REPARAÇÃO DE FORMATAÇÃO: MERGED E VALIDADA NO REPOSITÓRIO.**

A Fase 2 continua como frente operacional. Não reabrir a reconciliação histórica por esta alteração: trata-se de reparação de apresentação/estrutura do conteúdo já existente.

## 50. AÇÃO DE GOSTO/CORAÇÃO NAS NOTÍCIAS — 2026-09-25 16:24

### Pesquisa e decisão
A pesquisa atual de 2026 encontrou uso crescente de formatos de participação/reação em experiências de futebol e cobertura desportiva. A Meta descreve reações e participação como parte das novas experiências de futebol nas suas plataformas; o Digital Content Next identifica polls, reactions e audience participation como formatos de engagement em cobertura desportiva; e o Footy Headlines lançou em fevereiro de 2026 view counts e upvote/downvote nos artigos. Sources consultadas: Meta Newsroom (11/06/2026), Digital Content Next (08/06/2026) e Footy Headlines (21/02/2026).

Decisão aplicada ao CPC: reação simples de coração/gosto, sem comentários, contas ou sistema de votação complexo.

### Implementação
- PR #33 criada e mergeada.
- Merge commit: `eb76d46beda2a2b1bf762fec2a5776480e80dfca`.
- Apenas `noticia.html` foi alterado.
- Botão acessível com `aria-pressed`.
- Estado persistido localmente por slug via `localStorage`.
- Eventos `article_like`/`article_unlike` enviados para gtag/dataLayer quando disponíveis.
- Mobile mantém apenas o ícone para não aumentar a barra de ação.
- Não foi criado backend/contador público porque a arquitetura atual não dispõe de uma camada persistente de reações; a implementação é deliberadamente reversível.

### Validação
- main atual: `eb76d46beda2a2b1bf762fec2a5776480e80dfca`.
- 0 PRs abertas após o merge.
- Markup, inicialização, localStorage e eventos foram confirmados no ficheiro efetivamente presente em main.
- Validação HTTP da produção não foi possível nesta sessão: o acesso externo ao domínio não está disponível no ambiente atual. Portanto, produção/deployment não são declarados validados.

### Estado
**FASE 2 — UX editorial: ação de gosto implementada e mergeada; validação de produção externa pendente por limitação real do ambiente.**

## 51. INVENTÁRIO DE SLUGS COM CARACTERES INVISÍVEIS — 2026-09-25

A inspeção direta de `content/noticias` em `main` encontrou **237 ficheiros** e **3 nomes de ficheiro com caracteres zero-width**:
- `​benfica-na-europa-marco-silva-perspetiva-o-aarhus-e-garante-que-o-mercado-encarnado-não-acabou.md`
- `​carlos-vicens-recusa-euforia-após-triunfo-europeu-do-sc-braga-estamos-apenas-no-intervalo.md`
- `​marco-silva-elogia-reação-encarnada-aborda-mercado-e-foca-na-europa-a-resposta-tinha-de-ser-esta.md`

Os três aparecem também no `content/noticias-index.json` com o mesmo carácter invisível no `slug`, `path` e, em alguns casos, no título/subtítulo.

### Decisão de segurança
Não foram renomeados nesta operação. A alteração de slug/path canónico sem uma estratégia de compatibilidade poderia quebrar URLs históricas. O inventário fica como evidência para a frente de normalização de slugs e para o futuro mapeamento de redirects Framer → .com.

**Estado:** identificado e documentado; nenhuma URL canónica alterada.

## 52. INVENTÁRIO DE REDIRECTS FRAMER → .COM — 2026-09-25

Foi construído e gravado o inventário canónico:
`docs/framer/framer-url-redirect-inventory-2026-09-25.json`

Resultado:
- **213/213** URLs históricas do export têm destino atual identificado.
- **179** foram mapeadas por `sourceUrl` existente no índice.
- **34** foram mapeadas por slug.
- **0** fontes duplicadas.
- **0** destinos duplicados.
- O inventário é apenas de preparação; **nenhum redirect foi implementado**.

### Capacidade atual do Framer
A documentação oficial atual do Framer confirma que Redirects funcionam para subpaths dentro do domínio atual e que redirecionamento de domínio inteiro/cross-domain deve ser feito pelo hosting provider do domínio antigo. A documentação também confirma que os Redirects são aplicados após publicação. Como a origem histórica é `chutapracanto.framer.website`, não existe no GitHub/Cloudflare atual uma configuração que permita assumir controlo desse host histórico.

### Decisão
O inventário está concluído. A execução dos redirects fica dependente de confirmar acesso/controlo do projeto Framer histórico ou de um mecanismo externo que possa emitir redirects para `chutapracanto.framer.website`. Não alterar DNS, conteúdo ou redirects por inferência.



## 53. RECONCILIAÇÃO DO ESTADO CLOUDFLARE E NOVA ORDEM DA FASE 2 — HISTÓRICO SUPERSEDIDO PELA SECÇÃO 56

### Correção factual importante
A documentação histórica referia a existência de um Cloudflare Worker separado chamado `chutapracanto`. Essa referência está agora **desatualizada**.

A Rute confirmou diretamente, com o Dashboard da Cloudflare aberto, que **não existe atualmente um Worker Cloudflare separado chamado `chutapracanto`**. Essa confirmação externa prevalece sobre a documentação histórica.

Não confundir:
- `_worker.js` continua a existir no repositório e contém o Worker/runtime da aplicação Pages;
- o Worker separado `chutapracanto` referido nas bíblias/handoffs históricos foi apagado e não deve voltar a ser tratado como infraestrutura ativa.

### Verificação GitHub atual
O `_worker.js` presente na `main` trata as rotas `/api/admin/*` e é o candidato/runtime efetivo a considerar para a futura API de reações. Não existe, na pesquisa atual do repositório, configuração/binding D1 já identificado.

### Decisão arquitetural provisória para likes
A implementação localStorage da PR #33 **não é a solução final**. Deve ser tratada como implementação transitória/reversível de UX.

Objetivo final:
```
artigo → /api/article-like → runtime Pages/_worker.js → armazenamento persistente → resposta com estado/contador
```

A primeira opção técnica a investigar é **Cloudflare D1**, integrado no runtime já existente, sem criar outro Worker.

A documentação oficial atual do Cloudflare confirma D1 no Workers Free e os limites atuais devem ser respeitados: 5M rows read/dia, 100k rows written/dia, 5 GB de storage incluído; desde 01/09/2026 os limites diários do Free são efetivamente aplicados e queries falham até ao reset se forem excedidos. Isto torna obrigatória a implementação eficiente, com índices/queries seletivas e monitorização de utilização.

### Supabase — regra de decisão
Supabase **não é obrigatório** nesta fase e não deve ser ligado por defeito.

Só deve ser considerado se uma análise concreta demonstrar um ganho materialmente superior e relevante para:
- rentabilidade;
- automatização;
- capacidade futura do CPC;
- manutenção/escala;

**e** se a arquitetura puder permanecer dentro de uma utilização gratuita sustentável, sem assumir Pro, créditos ou billing futuro.

Na ausência dessa vantagem demonstrada, preservar a simplicidade da stack atual e preferir D1.

### Framer redirects
O inventário `docs/framer/framer-url-redirect-inventory-2026-09-25.json` está concluído (213/213). Esta frente **não é o próximo passo técnico**. A execução dos redirects continua dependente de controlo do host/projeto histórico Framer.

### Nova sequência operacional da Fase 2
1. Confirmar no ambiente externo o runtime real que recebe `/api/*` — sem assumir o Worker separado antigo.
2. Confirmar se já existe D1 e se existe binding no runtime correto.
3. Confirmar plano Cloudflare e garantir que nenhuma operação ativa billing/upgrade.
4. Se D1 estiver disponível no Free, desenhar a tabela mínima e proteção anti-abuso.
5. Só depois implementar a API persistente de likes.
6. Substituir a persistência localStorage da PR #33 pela solução persistente, preservando a UX acessível.
7. Validar contagem, idempotência, persistência entre dispositivos/sessões e comportamento de erro/limite.
8. Atualizar índice/documentação apenas se a implementação alterar o fluxo editorial; não alterar conteúdo sem necessidade.

### Próxima ação externa
A única dependência que precisa do Codex neste momento é a inspeção da sessão Cloudflare/Dashboard/CLI para os pontos 1–3 acima. Não criar tabela, endpoint, PR ou merge nesta inspeção.

**Estado:** FASE 2 — infraestrutura de engagement em preparação; PR #33 é provisória, não final. Worker separado antigo: confirmado como inexistente. D1: ainda não verificado. Supabase: não ligado.


## 54. RECONCILIAÇÃO DOS PEDIDOS UX / LIKE / FRAMER — HISTÓRICO SUPERSEDIDO PELA SECÇÃO 56

Pedidos da utilizadora reconciliados com o GitHub real:

- Sticky/header: permanecer pequeno e transparente no topo após recolher, em desktop e mobile; manter texto da navegação na mesma linha; elevar a navegação no mobile.
- Coração: apenas ícone junto à partilha, sem contador visível, persistência real em D1, idempotência por visitante/artigo e acessibilidade.
- Framer: encaminhar URLs históricas para o destino equivalente no .com; inventário 213/213 já concluído, execução ainda dependente de controlo verificável do host/projeto Framer antigo.

Estado técnico:
- PR #38 está aberta e contém a implementação D1 do coração + correção adicional do sticky/header.
- A PR #35 ainda não foi mergeada; portanto estas alterações não são produção.
- PR #33 continua classificada como implementação transitória/localStorage.
- PR #34 está fechada sem merge.
- O inventário Framer continua concluído, mas redirects não foram executados.
- A documentação Framer atual confirma a limitação de redirects normais para o domínio atual; domínio/host antigo → .com requer controlo no hosting do host antigo.

Próximas validações:
1. browser do sticky/header em desktop e mobile;
2. browser/API/D1 do PR #35;
3. merge/deployment apenas depois de validação;
4. resolver separadamente a dependência do host Framer histórico e testar os redirects.


## 55. FECHO OPERACIONAL DOS PEDIDOS 1–5 — HISTÓRICO SUPERSEDIDO PELA SECÇÃO 56

Os cinco pedidos foram reconciliados com o estado GitHub e incorporados no backlog/roadmap:

1. sticky compacto/transparente persistente — implementado na branch final;
2. navegação sem reflow de linha — implementado na branch final;
3. navegação mobile mais acima — implementado na branch final;
4. coração-only junto à partilha com persistência D1 — implementado na PR #38;
5. Framer → `.com` — inventário 213/213 concluído, execução bloqueada por controlo do host histórico.

**Estado factual:** #36 aberta, código ainda fora de `main`/produção. A validação browser final é o único gate antes de merge/deployment desta frente.

**Transição:** após PASS da validação externa, merge #36, validar deployment e só então marcar a frente UX/engagement como concluída. A frente Framer permanece separada.


## 56. FECHO DA FRENTE UX E TRANSIÇÃO PARA FASE 3 — 2026-09-26

A PR #42 foi mergeada em main (`e4dc204966902f0fc506d36ddef758c4a31b0f03`). O sticky editorial/contexto ficou em produção com a direção visual aprovada; o pequeno diferencial residual de blur entre header e contexto foi aceite como melhoria futura não bloqueante.

A PR #40, que continha uma abordagem anterior de transformação/escala do título já rejeitada pela direção visual atual, foi fechada sem merge por estar supersedida.

A implementação de engagement persistente encontra-se em main: `_worker.js` contém a rota de article-like e `migrations/0001_article_likes.sql` define a persistência D1. Não existe, portanto, uma frente técnica pendente de likes antes da próxima fase.

**Transição:** FASE 2 encerrada para esta frente e FASE 3 iniciada.

### Fase 3 — primeira ação
Foi feita pesquisa atual de fornecedores. API-Football apresenta Free a $0 com 100 requests/dia e cobertura de Primeira Liga/Taça da Liga; football-data.org apresenta Free a €0 com 12 competições, incluindo Primeira Liga e Champions League, mas com dados atrasados no plano gratuito e exigência de atribuição. Nenhum foi aprovado ainda.

**Próxima ação autónoma:** construir matriz de fornecedor/cobertura/limites/frescura/licença/custo para as sete competições previstas e escolher o fornecedor/adaptador principal antes de qualquer implementação.


## 57. MATRIZ DE FORNECEDORES FASE 3 — 2026-09-27

A primeira matriz documental de fornecedores foi concluída em `docs/AI_FOOTBALL_PROVIDER_MATRIX_2026-09-27.md`.

Resultado:
- API-Football é o candidato principal: declara as sete competições prioritárias e oferece no Free os endpoints necessários, com 100 requests/dia e 10/minuto.
- football-data.org é fallback parcial: Free cobre Primeira Liga/Champions, mas não há evidência suficiente de que as sete competições estejam simultaneamente no Free e os scores são atrasados.
- Sportmonks é fallback técnico pago.
- Sportradar não apresentou, na pesquisa pública realizada, uma modalidade Free de produção comparável.

Nenhum fornecedor foi ainda aprovado. A próxima dependência real é uma API key gratuita para validar por chamadas autenticadas a época 2026/27 nas sete competições e medir a quota. Não criar secrets/bindings/endpoints antes dessa validação.

Framer redirects continuam independentes e não bloqueiam esta linha.


# 58. MECANISMO CONCRETO DE SECRET INJECTION — 2026-09-27

A auditoria da dependência da Fase 3 confirmou o mecanismo seguro que estava anteriormente descrito de forma vaga.

## Evidência do projeto
- `wrangler.toml` usa o runtime Pages existente e o binding D1 `ARTICLE_LIKES_DB`.
- Não existe Worker Cloudflare separado para o CPC que deva receber a credencial.
- A arquitetura de competições exige token server-side no runtime Pages/_worker.js.

## Mecanismo Cloudflare validado
A documentação oficial atual do Cloudflare Pages confirma que secrets são bindings encriptados, acessíveis programaticamente através de `context.env`, e que podem ser configurados:

1. no Dashboard: **Workers & Pages → projeto Pages → Settings → Variables and Secrets → Add → Encrypt → Save**;
2. via Wrangler: `npx wrangler pages secret put <KEY> --project-name <PROJECT>`.

Fontes oficiais verificadas em 2026-09-27:
- https://developers.cloudflare.com/pages/functions/bindings/
- https://developers.cloudflare.com/workers/wrangler/commands/pages/

## Estado operacional
- API-Football: candidato principal, **não aprovado**;
- API key: ainda não criada/configurada no ambiente do CPC;
- secret: ainda não criado;
- adapter/endpoints: não implementados;
- validação 2026/27: ainda não executada.

## Regra de segurança
A API key **não deve ser enviada para o chat, GitHub, `wrangler.toml`, frontend ou qualquer ficheiro versionado**. A Rute pode criar a conta e obter a chave; a chave deve ser introduzida diretamente no Cloudflare Pages pelo Dashboard ou Wrangler autenticado.

## Próxima dependência exata
Depois de obter a API key, Rute configura-a diretamente no projeto Pages como Secret. Não é necessário entregar a chave ao Assistente. Quando o secret estiver configurado, a validação autenticada da API-Football pode começar.


## 59. MODELO QUANTITATIVO DE QUOTA API-FOOTBALL — 2026-09-27

A validação da Fase 3 foi aprofundada para medir o fornecedor contra o uso real do CPC, e não apenas contra a existência de cobertura.

A documentação oficial do API-Football confirma que uma chamada de fixtures pode devolver uma época/competição inteira e que filtros por data/período/round permitem reduzir o volume; detalhes de fixtures podem ser agrupados por até 20 IDs. citeturn0search1turn0search3turn0search6

Modelos preliminares de arquitetura para as 7 competições:
- 1 fixtures + 1 standings por competição/dia + metadata: ~15 requests/dia;
- 4 atualizações de fixtures/dia + 1 standings/dia por competição + metadata: ~36/dia;
- 12 atualizações de fixtures/dia + 1 standings/dia por competição + metadata: ~92/dia.

Estes valores não são medição real da conta e não aprovam o fornecedor. O cenário de ~92/dia é considerado sem margem confortável. O gate final exige margem operacional suficiente, respeito do limite de 10/minuto, cache/deduplicação/stale-if-error, retries controlados e modelação de dias de maior atividade.

A documentação também indica atualização de fixtures/events live a cada 15 segundos no fornecedor. O CPC não deve reproduzir essa frequência indiscriminadamente no Free; live contínuo nas 7 competições deve ser tratado como cenário separado e validado antes de ser prometido no produto. citeturn0search6

**Estado:** API-Football continua candidato principal, não aprovado. Próxima dependência: API key configurada diretamente no Cloudflare Pages Secret para testes autenticados 2026/27 e medição real.


## 60. DIAGNÓSTICO TEMPORÁRIO API-FOOTBALL — 2026-09-27

A utilizadora confirmou que `API_FOOTBALL_KEY` foi configurada como Cloudflare Pages Secret apenas em Production. A presença e o tipo `secret_text` foram verificados por API sem ler, imprimir ou transportar o valor; Preview não contém este secret. Nenhuma alteração Cloudflare foi feita.

Foi preparado no runtime Pages (`_worker.js`) um endpoint temporário de diagnóstico, condicionado ao branch `main`, host oficial de Production, POST, sessão Admin válida e Origin same-origin. Cada execução faz uma única chamada server-side a `/status`, sem retries, frontend, logging ou devolução do corpo bruto do fornecedor. A resposta prevista contém apenas HTTP status, autenticação inferida de resposta válida sem erros, contagem/categorias sanitizadas de erros, resultados, paging e quatro headers numéricos de quota. Dados pessoais de conta e qualquer conteúdo do secret não são devolvidos.

**Estado:** validação local com fetch simulado; chamada autenticada real ainda não executada, pois requer a publicação em Production. API-Football continua candidato não aprovado; nenhum adapter, D1/cache, polling ou chamadas às competições foi implementado.

---

# 31. LEDGER OPERACIONAL — REGRA DE CONTINUIDADE E FASE 3 — 2026-09-27

Esta secção regista acontecimentos posteriores à última reconciliação do estado, incluindo operações concluídas, pendentes, bloqueadas, falhadas, abandonadas e mudanças de plano. O objetivo é impedir repetição de trabalho e preservar a razão de cada transição.

## 31.1 Regras operacionais reforçadas

A partir desta data, qualquer operação relevante deve atualizar este ledger quando o resultado for conhecido.

Registar sempre:
- concluído: ação, resultado e evidência;
- pendente: ação restante, razão e dependência;
- falhou/negativo: tentativa, resultado, causa conhecida ou ainda não determinada;
- bloqueado: bloqueador e condição de desbloqueio;
- mudança de plano: plano anterior, novo plano e razão;
- abandonado: ação descartada e motivo;
- correção/retrabalho: o que foi corrigido e porquê.

Nada deve ser considerado “desaparecido” por ter ficado pelo caminho. O ledger deve permitir reconstruir o percurso operacional.

## 31.2 Fase 3 — estado reconciliado

### Já feito

---

# 32. LEDGER — ATUALIZAÇÃO APÓS RECONCILIAÇÃO DA PR #43 — 2026-09-27

---

# 33. LEDGER — DEPLOYMENT PRODUCTION E DIAGNÓSTICO API-FOOTBALL — 2026-09-27

### Operações concluídas

- PR #43: **merged**, merge commit `94b7eaec13b5397a239f0cc105f534f7e8b9e292`.
- `main` atual: `2636cd0e2087f42ec1d2c7054efce4d68e3fad99`.
- Production: deployment `aa0d3a54-580c-40f7-b133-b7eb74f0d0a5`, estado **success**, publicado em `chutapracanto.com`.
- Home de Production carregou corretamente.
- Secret Production `API_FOOTBALL_KEY` confirmado como secret; o valor permaneceu oculto e não foi lido nem alterado.

### Operação pendente / interrompida

O diagnóstico API-Football **não foi executado**.

A abertura de `/admin/` em Production apresentou o ecrã de login, sem sessão Production autenticada. Como o endpoint diagnóstico exige sessão Admin válida, a operação foi interrompida **antes do POST**.

### Resultado negativo relevante

- não houve POST ao endpoint diagnóstico;
- não houve pedido à API-Football;
- não houve consumo de quota API-Football;
- não existe ainda evidência autenticada de `/status`;
- não existem ainda medições reais de quota/headers.

A interrupção foi deliberada e correta: não contornar a autenticação nem executar uma chamada não autorizada.

### Estado de aprovação

API-Football continua **candidato principal, não validado/aprovado**.

Continuam pendentes os gates:
1. executar o diagnóstico uma única vez após existir sessão Production autenticada;
2. registar evidência sanitizada de autenticação/quota;
3. validar 2026/27 nas sete competições;
4. medir fixtures/results/standings/events;
5. testar 429 e limites;
6. fechar política de atualização/cache e margem operacional;
7. só então decidir a aprovação.

### Não repetir

Não voltar a tentar o POST enquanto não existir uma sessão Admin Production válida. Não fazer chamadas diretas à API-Football, retries ou bypass da proteção. Não alterar o secret.

### Próximo desbloqueio

**Dependência:** sessão Admin válida em Production.

Quando essa dependência existir, executar **uma única** chamada ao diagnóstico protegido, validar a resposta sanitizada e atualizar imediatamente este ledger com o resultado.


## 34. LEDGER — DIAGNÓSTICO AUTENTICADO API-FOOTBALL EXECUTADO — 2026-09-27

### Operação concluída

A sessão Admin Production foi utilizada para executar uma única chamada POST ao endpoint temporário protegido:
`/api/admin/football-provider-diagnostic`.

O endpoint executou a chamada server-side prevista a `GET /status` da API-Football, sem retries.

### Evidência sanitizada devolvida pelo Production

- provider: `API-Football`
- HTTP status: **200**
- authenticated: **true**
- results: **0**
- errors.present: **false**
- errors.count: **0**
- paging: current 1 / total 1
- dailyLimit: **100**
- dailyRemaining: **100**
- minuteLimit: **10**
- minuteRemaining: **9**

Nenhuma API key, cookie, credencial, corpo bruto da API ou dado pessoal foi exposto no resultado.

### Interpretação operacional

O primeiro gate de autenticação está **PASS**: a credencial configurada no secret Production é aceite pela API-Football e o endpoint `/status` respondeu sem erros.

A chamada consumiu uma request no limite por minuto (10 → 9), enquanto o diagnóstico reportou 100/100 no limite diário. A quota diária não deve, contudo, ser tratada como garantia de margem para produção; a validação real das sete competições e dos recursos necessários ainda é obrigatória.

### Gates ainda pendentes

1. autenticar e testar a época **2026/27** nas sete competições prioritárias;
2. medir fixtures/resultados/standings/events conforme o uso previsto;
3. verificar comportamento e headers perante limites/429 de forma controlada, sem desperdiçar quota;
4. fechar política de cache, deduplicação, stale-if-error e frequência de atualização com margem operacional suficiente;
5. só depois decidir aprovação do API-Football como fornecedor de produção.

### Estado atual

**API-Football continua candidato principal, mas ainda NÃO aprovado para produção.**

O diagnóstico `/status` foi concluído com sucesso. O próximo passo técnico é a validação autenticada de cobertura e comportamento real para 2026/27 nas sete competições, não repetir o diagnóstico `/status`.

### Nota sobre consola do Admin

A consola também mostrou avisos de Tracking Prevention relativos aos CDNs do Quill/Turndown, 404 de `favicon.ico` e uma chamada `/api/admin/session` com 401. Estes sinais não invalidaram a chamada diagnóstica, que respondeu 200 com `authenticated: true`. Não abrir investigação separada destes avisos nesta fase sem evidência de impacto funcional.


## 35. LEDGER — DIAGNÓSTICO 2026/27 REPETIDO INVOLUNTARIAMENTE — 2026-09-27

### Operação concluída

A utilizadora executou novamente, de forma involuntária, o endpoint temporário:
`/api/admin/football-provider-2026-27-diagnostic`.

Esta segunda execução fez novamente **7 chamadas server-side** ao endpoint `/leagues`, uma por competição-alvo. Não deve ser repetida.

### Resultado factual da segunda execução

- provider: `API-Football`
- seasonTested: `2026`
- seasonLabel: `2026/27`
- HTTP status de todas as 7 chamadas: **200**
- `primeiraLiga`: `subscription`, results 0, matches 0
- `tacaPortugal`: `subscription`, results 0, matches 0
- `tacaLiga`: `quota`, results 0, matches 0
- `championsLeague`: `subscription`, results 0, matches 0
- `europaLeague`: `subscription`, results 0, matches 0
- `conferenceLeague`: `subscription`, results 0, matches 0
- `nationsLeague`: `quota`, results 0, matches 0

O endpoint classifica estes erros a partir do campo `errors` devolvido pela API; `subscription` significa que a resposta indicou plan/subscription, enquanto `quota` significa que indicou rate/request/limit/quota. Isto não deve ser reinterpretado como prova isolada de que a competição não existe ou de que o Free nunca a suporta.

### Recurso/quota

A primeira execução do diagnóstico 2026/27 também já tinha realizado 7 chamadas. Assim, existem **14 chamadas ao endpoint 2026/27** realizadas no total, distribuídas por duas execuções.

Não inferir o saldo diário exato a partir deste número: os headers de quota não foram devolvidos por este endpoint. O diagnóstico `/status` anterior reportou 100/100 diários e 9/10 por minuto imediatamente após a sua chamada, mas não serve para calcular retroativamente o saldo após estes testes.

### Relevância externa verificada

A documentação oficial atual do API-Football afirma que o Free tem 100 requests/dia e 10/minuto e que todas as competições/endpoints estão incluídos, mas o Free é limitado em épocas/dados disponíveis. A documentação também diz que a disponibilidade pode variar por competição/época e recomenda validar a cobertura através de `/leagues`. Portanto, os erros agora observados são evidência relevante de restrição de acesso/dados nesta chamada, mas **não fecham ainda a causa final sem distinguir restrição de época, quota e comportamento do endpoint**. citeturn0search0turn0search4turn0search9

### Decisão operacional

- **Não repetir** o diagnóstico de 7 chamadas.
- **Não executar novas chamadas de `/leagues` para estas sete competições.**
- Preservar a quota restante para testes que alterem materialmente a decisão.
- API-Football continua **não aprovado**.
- A próxima investigação deve ser desenhada para obter informação nova com o mínimo de requests possível, começando por distinguir se os erros `subscription` são restrição de dados/época do Free ou efeito de quota/estado da conta.
- Não criar ainda adapter, polling, cache definitivo ou integração de produto.

### Correção de processo

O gasto adicional de quota foi acidental e não representa uma decisão de produto. A partir deste ponto, qualquer teste que possa consumir quota deve ser tratado como **operação única** e o resultado existente deve ser usado como evidência, sem repetição para mera visualização.



# 36. LEDGER — CONFIRMAÇÃO DO DASHBOARD API-FOOTBALL E CONTINUAÇÃO DO TESTE REPRESENTATIVO — 2026-09-27

### Evidência nova, sem consumo de quota

A sessão autenticada do dashboard API-Football foi concluída. Durante a autenticação, o site apresentou o comportamento já observado de sessão/login expirada; a utilizadora conseguiu prosseguir e concluir a autenticação.

No dashboard foi confirmado:
- plano FREE PLAN;
- limite de 100 requests/dia;
- 100 requests restantes / 0% usado no momento da consulta;
- catálogo oficial com Primeira Liga, season 2026, de 07/08/2026 a 16/05/2027;
- página de subscrição indicando limite de 10 requests/minuto.

A área Generated Code foi inspecionada. Trata-se de um gerador de ficheiros/exemplo genérico e não fornece, por si só, prova de que a season 2026 esteja acessível através do plano Free.

Nenhuma chamada API foi executada nesta sessão do dashboard. Portanto, esta operação consumiu 0 requests.

### Limitação identificada

A existência da season 2026 no catálogo está confirmada, mas isto não prova que o plano Free permita obter os seus dados. Também não foi encontrada, na página de subscrição consultada, uma restrição explícita que permita concluir diretamente que a season 2026 é bloqueada no Free.

Assim, a causa dos resultados anteriores subscription para algumas competições permanece tecnicamente não fechada.

### Decisão operacional

Não repetir o diagnóstico das sete competições.

Foi definido um único teste representativo, caso necessário, para Primeira Liga season 2026, utilizando o mecanismo server-side já existente no Chuta Pra Canto e sem expor a API key no browser. O API Tester do dashboard não deve ser usado para este teste, porque a navegação expôs visualmente o campo da API key.

### Segurança da credencial

Durante uma tentativa do CODEX de navegar para o API Tester, o campo da API key apareceu visualmente numa captura da sessão. O CODEX declarou que não copiou, alterou, regenerou nem utilizou a chave e que não executou chamadas API nessa sessão. Como precaução, a chave atual é tratada como credencial temporária de teste/potencialmente exposta.

Plano operacional:
1. continuar apenas com testes estritamente necessários, sem revelar/copiar a chave;
2. não usar o API Tester do dashboard;
3. concluir a validação técnica;
4. no final, gerar nova API key e substituir o secret API_FOOTBALL_KEY no Cloudflare Pages;
5. deixar a chave atual inutilizada.

### Estado atual

- API-Football: candidato principal, não aprovado.
- Quota dashboard observada: 100/100 disponíveis no momento da consulta.
- Primeira Liga season 2026 no catálogo: confirmada.
- Acesso efetivo aos dados da season 2026 no Free: ainda não confirmado.
- Diagnóstico de 7 competições: não repetir.
- Próxima operação de quota, se necessária: uma única chamada representativa, com resultado sanitizado e através do runtime server-side.


# 37. LEDGER — DIAGNÓSTICO TEMPORÁRIO DE UMA ÚNICA CHAMADA PARA PRIMEIRA LIGA 2026 PREPARADO — 2026-09-27

- Bloqueio reportado pelo Codex: o workspace não disponibilizou o repositório, pelo que não executou qualquer chamada; consumo nesta tentativa: 0 pedidos.
- Verificação direta pelo assistente confirmou que o repositório correto é `chutapracanto/chutapracanto`, branch `main`, e que o endpoint 2026/27 existente executa obrigatoriamente as sete competições em sequência; não é seguro reutilizá-lo para o teste representativo porque repetiria as sete chamadas.
- Foi criado o branch `feat/diagnostico-api-football-primeira-liga-2026` e um endpoint temporário dedicado `/api/admin/football-provider-primeira-liga-2026-diagnostic`.
- O endpoint executa exatamente uma chamada server-side: `GET /leagues?season=2026&search=Primeira%20Liga`; não aceita parâmetros de consulta controlados pelo utilizador, exige Production/main, host oficial, sessão Admin válida e Origin same-origin, usa `API_FOOTBALL_KEY` apenas no servidor e devolve resposta sanitizada sem chave nem mensagem bruta do fornecedor.
- A alteração foi validada por diff e integrada via PR #45, squash merge `aab39f32c2de70e659a4bc69d777218e2e6e0ada`.
- O endpoint está agora em `main` e pode ser executado uma única vez em Production. Não executar novamente o diagnóstico das sete competições.
- Próximo passo: executar apenas esta chamada representativa no site autenticado. Depois da evidência, remover o endpoint temporário e registar o resultado; a chave atual continua a ser tratada como temporária/potencialmente exposta e será rodada no fim da validação.


## 38. LEDGER — TESTE REPRESENTATIVO PRIMEIRA LIGA 2026 CONCLUÍDO E DIAGNÓSTICO TEMPORÁRIO REMOVIDO — 2026-09-27

### Operação concluída

Foi executada **uma única** chamada ao endpoint temporário de teste representativo para a Primeira Liga 2026/27, através da sessão Admin Production autenticada e do runtime server-side do Chuta Pra Canto.

Resultado sanitizado:
- HTTP status: **200**
- provider: **API-Football**
- competition: **Primeira Liga**
- season tested: **2026/27**
- results: **0**
- matches: **0**
- ok: **false**
- error category: **quota**
- quota headers devolvidos pelo provider nesta chamada: todos **null**

### Interpretação

O teste confirma que:
1. a chamada chegou ao API-Football e a API respondeu HTTP 200;
2. a credencial continuou aceite ao nível do endpoint;
3. a resposta **não disponibilizou dados da Primeira Liga 2026/27**;
4. a causa devolvida pelo provider foi classificada como **quota**.

Este resultado **não prova isoladamente** que a season 2026/27 esteja indisponível por regra estrutural do plano Free, porque o endpoint sanitizado não devolveu a mensagem bruta nem headers de quota nesta resposta. Também não é legítimo reinterpretar quota como subscription.

A documentação oficial confirma que o Free tem 100 requests/dia e 10/minuto e que, quando a quota é atingida, a API deixa de processar pedidos; a documentação também confirma que o Free tem limitações quanto às seasons disponíveis. citeturn0search0turn0search3turn0search6

### Decisão operacional

- O API-Football **não fica aprovado para produção**.
- Não serão feitas novas chamadas à API-Football apenas para repetir este teste ou tentar obter a mensagem bruta.
- Não repetir o diagnóstico das sete competições.
- Não criar adapter definitivo, polling, cache de produção ou integração de produto com base neste estado.
- O endpoint temporário `/api/admin/football-provider-primeira-liga-2026-diagnostic` foi removido de `_worker.js` em `main`.
- Commit de remoção: `e2f51c8c24ed5ba5815269bc0d795c3982bf5d03`.

### Estado da investigação

A evidência disponível fica registada como **inconclusiva quanto à causa exata do bloqueio 2026/27**, mas suficiente para impedir a aprovação do fornecedor neste momento:
- catálogo/dashboard mostrou Primeira Liga season 2026;
- os testes 2026/27 anteriores produziram `subscription` ou `quota` conforme a competição;
- o teste representativo único produziu `quota` e zero dados;
- não existe, neste momento, evidência autenticada de que o plano Free consiga fornecer os dados necessários para o Chuta Pra Canto em 2026/27.

### Próxima operação

Antes de qualquer nova chamada, verificar **sem consumir quota** o estado atual de consumo/quota no dashboard API-Football. Esta verificação serve apenas para fechar a distinção entre quota efetivamente esgotada e restrição específica da resposta; não deve abrir o API Tester nem expor/copiar a API key.

Depois dessa verificação, encerrar a avaliação do API-Football como fornecedor Free se não surgir evidência nova que altere materialmente a decisão.

### Segurança da credencial

A API key atual continua tratada como temporária/potencialmente exposta. Após encerrada a validação, deve ser regenerada no dashboard e o secret Production `API_FOOTBALL_KEY` substituído, sem colocar a nova chave no GitHub, frontend, chat ou ficheiros.


# 42. PASS OPERACIONAL — ADAPTER BSD E ENDPOINT `/api/competicoes` — 2026-09-28

A integração pública de futebol atingiu **PASS operacional** após correção do adapter BSD.

## Validação final
- produção respondeu HTTP 200 para `/api/competicoes?competition=liga-portugal&seasonId=1310`;
- fixture validado com `Vitória SC` vs `Famalicão`;
- standing validado com `FC Porto`;
- a causa final da falha de nomes nos standings foi o âmbito incorreto de `teamNamesById`; corrigido no commit `98e7e2c5f4e571a977b641dfd420ba61842c3574`;
- não foram feitas chamadas BSD adicionais para esta correção final.

## Limpeza concluída
Os quatro endpoints de diagnóstico temporário BSD foram removidos no commit `09c13664ae14b40993b7a95572905e9c5a28b6d4`:
- `football-provider-bsd-2026-27-diagnostic`;
- `football-provider-bsd-helper-diagnostic`;
- `football-provider-bsd-runtime-diagnostic`;
- `football-provider-bsd-operational-diagnostic`.

## Decisão de continuidade
O adapter server-side e o endpoint público deixam de estar bloqueados. Cache/D1, atualização por Cron Trigger e UI de competições podem avançar.

**Próxima ação:** desenhar e implementar a persistência/cache D1 por competição/época/recurso, preservando a arquitetura provider-agnostic e a política de stale-if-error.


# 43. INÍCIO DO CACHE D1 DE COMPETIÇÕES — 2026-09-28

Após o PASS operacional do adapter BSD, foi criada a primeira peça da subfase de persistência/cache:
- migration `migrations/0002_football_cache.sql`;
- tabela `football_cache` provider-agnostic;
- chave de cache por provider/competição/época/recurso/variante;
- timestamps `fetched_at`, `expires_at` e `stale_until` para suportar TTL e stale-if-error;
- índices de lookup e expiração.

Commit: `b201f745622eb0e2d1f975b1821f0424182ebfc4`.

A migration está no GitHub, mas a execução do D1 ainda depende da criação/configuração da base Cloudflare e do binding server-side correspondente. Não foi feita qualquer chamada BSD adicional.

# 44. D1 FOOTBALL CACHE — MIGRATION EXECUTADA EM REMOTO — 2026-09-28

### Operação concluída

A base Cloudflare D1 `cpc-football-cache` foi criada e o binding `FOOTBALL_CACHE_DB` foi adicionado ao `wrangler.toml` com o database ID `92e3ef93-4c44-46c8-a1a4-ff5c09f4b49f`.

A migration `migrations/0002_football_cache.sql` foi então executada diretamente na **Cloudflare D1 Console**, sem depender de checkout local, CMD ou Wrangler no PC.

### Resultado

- query executada com sucesso;
- tabela `football_cache` criada;
- índice `idx_football_cache_lookup` criado;
- índice `idx_football_cache_expiry` criado;
- resposta da Cloudflare: **This query successfully executed**;
- não houve chamada BSD associada a esta operação.

### Estado

**D1 schema PASS.** A persistência remota está pronta para a implementação do cache no Worker.

### Próxima ação autorizada

Implementar no `_worker.js` a camada de cache provider-agnostic sobre `FOOTBALL_CACHE_DB`, com:
1. leitura de entrada fresca;
2. refresh através do adapter BSD em cache miss/expiração;
3. persistência de `payload_json` e timestamps;
4. stale-if-error até `stale_until`;
5. resposta pública preservando o contrato atual de `/api/competicoes`;
6. sem chamadas BSD desnecessárias quando existir cache fresco.

A validação do cache deve ocorrer depois da implementação, sem repetir os diagnósticos BSD já encerrados.

# 45. CACHE D1 NO WORKER — IMPLEMENTAÇÃO — 2026-09-28

### Operação concluída

O endpoint público `/api/competicoes` passou a usar a D1 `FOOTBALL_CACHE_DB` antes de recorrer ao adapter BSD.

Implementado em `_worker.js`:
- chave provider-agnostic por provider/competição/época/stage/round;
- leitura de cache fresco;
- TTL fresco de 15 minutos;
- janela stale de 24 horas;
- persistência do payload normalizado em `football_cache`;
- atualização por UPSERT;
- stale-if-error quando o fornecedor falhar;
- deduplicação de refresh concorrente por isolate através de Promise em memória;
- contrato público de `/api/competicoes` preservado;
- `updateStatus: cache` para resposta servida de cache fresco;
- `updateStatus: stale` e `cacheStale: true` quando é necessário servir uma entrada expirada dentro da janela stale.

Commit: `9c50eae23712f76b1f812236e392a74ac38392c0`.

### Política operacional

O primeiro pedido de uma combinação ainda sem cache continua a obter dados do BSD e grava a resposta na D1. Pedidos seguintes dentro do TTL não devem chamar o BSD. Após expiração, o Worker tenta atualizar; se o fornecedor falhar e existir uma entrada dentro da janela stale, essa entrada é devolvida em vez de produzir erro 503.

### Validação pendente

A implementação foi revista diretamente no código, mas a validação runtime do fluxo cacheado ainda falta após o deployment. Deve ser feita uma sequência mínima: primeiro pedido para uma chave sem cache, confirmação da linha D1, segundo pedido para a mesma chave e confirmação de que é servido de cache sem nova chamada BSD. Não repetir diagnósticos do fornecedor.


# 46. VALIDAÇÃO DO CACHE D1 — PASS — 2026-09-28

### Validação runtime concluída
- Primeiro pedido a `/api/competicoes?competition=liga-portugal&seasonId=1310`: HTTP 200, dados BSD válidos, `updateStatus: live`.
- Consulta D1 confirmou a entrada `bsd|liga-portugal|1310||` em `football_cache`.
- Entrada D1: provider `bsd`, competição `liga-portugal`, época `1310`, recurso `competition`.
- `fetched_at`: 2026-09-28T16:28:08.561Z; `expires_at`: 2026-09-28T16:43:08.561Z; `stale_until`: 2026-09-29T16:28:08.561Z.
- Segundo pedido ao mesmo URL, dentro do TTL, devolveu HTTP 200 e `updateStatus: cache`, com o mesmo payload normalizado.

### Decisão
**PASS — cache fresco D1 operacional.** A camada de cache está a persistir e a servir a resposta sem novo refresh durante o TTL.

### Próxima ação
Avançar para a camada de atualização automática por Cron Trigger, mantendo stale-if-error e deduplicação. Não repetir diagnósticos BSD nem a validação já concluída.


# 47. TRANSIÇÃO DE FASE — CACHE D1 VALIDADO / CRON TRIGGER — 2026-09-28

### Fecho da subfase de cache
**PASS.** A persistência D1 e a leitura de cache fresco foram validadas em runtime no endpoint público `/api/competicoes`.

### Fase atual
**FASE 3 — ATUALIZAÇÃO AUTOMÁTICA DE COMPETIÇÕES: ATIVA.**

A validação do cache permite encerrar a subfase de persistência/cache. A próxima intervenção técnica é implementar o Cron Trigger, com atualização controlada das competições/épocas ativas, sem chamadas redundantes e respeitando o limite operacional do fornecedor.

### Não reabrir
Não repetir diagnósticos BSD, testes de credencial/conectividade, season discovery, parser, Cache API raw, helper temporário ou a validação já concluída do adapter/cache, salvo nova evidência objetiva.

### Próximo passo automático
Inspecionar o estado atual do Worker/Wrangler e implementar o mecanismo de Cron Trigger provider-agnostic sobre o cache existente; depois validar a execução e atualizar novamente este ledger e o roadmap.


# 48. CRON TRIGGER — IMPLEMENTAÇÃO — 2026-09-28

### Operação concluída
- _worker.js passou a exportar scheduled(controller, env) para atualização automática.
- Foi implementada rotação de uma competição por execução, em intervalos de 5 minutos, usando controller.scheduledTime para distribuir as 7 competições.
- Cada execução consulta primeiro a D1; se a entrada estiver fresca, não chama o BSD.
- Quando expirada/inexistente, reutiliza o season_id guardado e atualiza o cache através do adapter BSD; para competições sem cache, o adapter pode descobrir a época ativa.
- Falhas do fornecedor são registadas e não provocam retry automático da mesma execução (controller.noRetry()), deixando a próxima janela tentar novamente.
- wrangler.toml passou a configurar */5 * * * *.
- A chave usada pelo Cron foi alinhada com a chave pública do cache para evitar duplicação de entradas.

### Consumo previsto
Com 7 competições e uma execução a cada 5 minutos, cada competição é selecionada aproximadamente uma vez a cada 35 minutos. Cada refresh normal usa 2 chamadas BSD (events + standings) quando a época já está conhecida; a descoberta inicial da época pode acrescentar 1 chamada. O desenho mantém cada execução muito abaixo do limite de 10 requests/minuto e o volume teórico máximo continua muito abaixo dos 7.500 requests/dia documentados pelo BSD.

### Estado
IMPLEMENTAÇÃO CONCLUÍDA — validação runtime do Cron ainda pendente. O trigger pode demorar alguns minutos a propagar após a alteração de configuração.

### Próximo passo automático
Validar a execução do Cron e confirmar que uma linha D1 é atualizada automaticamente sem intervenção manual. Depois atualizar o ledger para PASS ou corrigir apenas se houver evidência de falha.


# 49. DECISÃO CORRIGIDA — FORNECEDOR AINDA NÃO APROVADO / CRON NÃO DEPLOYAR AINDA — 2026-09-28

### Correção de estado

A revisão da arquitetura após a implementação do Cron identificou uma distinção obrigatória:

- **BSD está tecnicamente validado, mas não está aprovado como fornecedor definitivo.**
- **API-Football continua não aprovado.**
- O adapter e a API pública devem permanecer provider-agnostic.
- O código do Worker Cron separado existe, mas **não deve ser criado/deployado ainda**.
- A frequência `*/5` é uma implementação de referência, não uma decisão final.

### Razão técnica para separar o Cron do Pages

O projeto é Cloudflare Pages e a tentativa de colocar `[triggers]` no `wrangler.toml` do Pages falhou no deployment com a mensagem:

`Configuration file for Pages projects does not support "triggers"`.

A configuração de Cron deve, portanto, viver num Worker separado. Isto não substitui o Pages: o Pages continua responsável pelo site e por `/api/competicoes`; o Worker será apenas o scheduler quando o gate estiver fechado.

### Problema de frequência identificado

Com:
- Cron de 5 em 5 minutos;
- 7 competições;
- uma competição por execução;

cada competição é processada aproximadamente a cada 35 minutos.

Como o cache fresco atual é de 15 minutos, a rotação normal encontra a entrada fora do TTL e pode provocar novo refresh do fornecedor.

As 288 execuções/dia do Cron **não equivalem automaticamente a 288 chamadas ao fornecedor**, mas também não podem ser tratadas como chamadas zero. O consumo real depende do TTL, recursos atualizados, falhas e estratégia de rotação.

### Decisão

Não criar/deployar o Worker ainda.

Antes do deployment:
1. calcular o consumo efetivo de requests para as estratégias possíveis;
2. comparar esse consumo com os limites dos fornecedores ainda candidatos;
3. definir a frequência final por competição;
4. concluir a decisão de fornecedor;
5. só então configurar/deployar o Worker;
6. validar runtime e registar o resultado.

### Não reabrir
Não repetir diagnósticos BSD/API-Football já concluídos apenas para confirmar informação existente. Qualquer novo teste de fornecedor deve produzir evidência nova e alterar materialmente a decisão.

### Estado atual

**FASE 3 — validação de fornecedor + estratégia de atualização.**

- Adapter BSD: PASS técnico.
- Endpoint `/api/competicoes`: PASS.
- D1/cache: PASS.
- Worker Cron: código preparado; deployment pendente por decisão deliberada.
- BSD: candidato técnico, não aprovado.
- API-Football: não aprovado.


# 50. DECISÃO DE FORNECEDOR E FECHO DO GATE — 2026-09-28

### Validação concluída

A decisão de fornecedor foi revista com evidência técnica, operacional e documental atualizada.

**BSD — selecionado para produção**, não apenas porque “funciona”, mas porque:
- as 7 competições CPC 2026/27 foram validadas;
- o adapter e endpoint server-side estão PASS;
- D1/cache está PASS;
- o plano Football Free indica 7.500 requests/dia;
- o refresh normal do CPC usa 2 requests por competição;
- a rotação de 35 minutos implica aproximadamente 576 requests/dia de refresh;
- mesmo uma atualização a cada 15 minutos das 7 competições ficaria em aproximadamente 1.344 requests/dia;
- a licença BSD v4.0, efetiva em 1/10/2026, permite display nos próprios websites e proíbe redistribuição do raw data como API/feed/dataset;
- a API key permanece apenas no backend/secret do Pages.

API-Football permanece **não aprovado** após a evidência 2026/27 já registada. Não repetir testes sem nova hipótese.

### Decisão de frequência

Mantém-se a implementação de referência:
- Worker Cron: `*/5 * * * *`;
- 1 competição por execução;
- cada competição aproximadamente a cada 35 minutos;
- cache fresco: 15 minutos;
- stale-if-error: 24 horas.

A diferença de 35m > 15m é deliberada: o Cron pode encontrar a entrada expirada e provocar refresh. O consumo resultante continua amplamente dentro da quota BSD. Não há necessidade de complicar o desenho com um novo mecanismo de sincronização antes do deployment.

### Estado

**Gate fechado. Próxima operação: deployment do Worker separado e validação runtime do Cron.**


# 51. DEPLOYMENT DO WORKER CRON — VALIDAÇÃO OPERACIONAL — 2026-09-28

### Operação concluída
- Worker separado `cpc-football-cron` publicado no Cloudflare com sucesso.
- Cron Trigger configurado para `*/5 * * * *` e visível no Dashboard como execução a cada 5 minutos.
- Binding `FOOTBALL_CACHE_DB` confirmado no Worker, apontando para `cpc-football-cache`.
- Métricas do Worker mostraram 1 invocation, 100% de sucesso, 0% de erro e CPU mediano de 1,27 ms.
- O Worker mantém a rotação de uma competição por execução entre as 7 competições.

### Limite da evidência
Os Logs do Worker estão desativados. Por isso, a invocation e as métricas não permitem provar de forma independente o HTTP status da chamada a `/api/competicoes` nem atribuir uma escrita específica no D1 àquela invocation.

Uma tentativa de validação adicional através do Codex devolveu PARTIAL porque o ambiente atual do Codex não tem `wrangler`, credenciais/variáveis Cloudflare nem sessão Cloudflare disponível. Isto é uma limitação de acesso do ambiente do Codex, não evidência de falha do Worker.

Não será feito novo deploy, ativação de Logs ou teste artificial apenas para obter esta confirmação enquanto não houver necessidade operacional.

### Estado
**PASS — deployment e configuração operacional do Worker confirmados.** Runtime detalhado do ciclo Cron → API → D1 permanece como evidência parcial por ausência de Logs/acesso Cloudflare no Codex.

### Próximo passo
Avançar com a Fase 3 sem reabrir diagnósticos BSD, API-Football, cache ou deployment. Quando houver acesso Cloudflare disponível no ambiente do Codex, essa ferramenta poderá ser usada para observabilidade/runtime se tal validação passar a ser necessária.


# 52. ÁREA PÚBLICA DE COMPETIÇÕES — PRIMEIRA IMPLEMENTAÇÃO — 2026-09-28

### Operação concluída
- Criada a página pública `/competicoes` em `competicoes.html`.
- A página usa exclusivamente o endpoint server-side `/api/competicoes`; não expõe nem chama diretamente o fornecedor BSD.
- Implementado seletor das 7 competições prioritárias.
- Implementadas vistas de jogos/resultados e classificação quando os dados existirem.
- Incluído estado de atualização/cache e tratamento de indisponibilidade.
- Adicionado `/competicoes` ao sitemap.
- Adicionado o acesso a Competições ao menu principal da homepage.
- Corrigida a leitura do campo normalizado `kickoff` na listagem de jogos.

### Limite da validação
A implementação foi validada estruturalmente no GitHub contra o contrato atual de `/api/competicoes`. A validação visual/runtime da página em produção fica para o deployment automático do Pages e para a verificação de produção quando houver evidência disponível; não foi feita uma chamada extra ao fornecedor apenas para testar a UI.

### Estado
**IMPLEMENTAÇÃO CONCLUÍDA — UI /competicoes criada.**

### Próximo passo
Validar o deployment/produção da nova página quando a evidência estiver disponível e, se necessário, corrigir apenas problemas reais de UI/contrato. Depois integrar o acesso a Competições nas restantes páginas com navegação principal, se ainda necessário.


# 53. VALIDAÇÃO DE PRODUÇÃO DA UI /COMPETICOES — 2026-09-28

### Operação executada
- Confirmado no GitHub que `main` contém a implementação da UI de `/competicoes` e a documentação correspondente.
- Inspecionados `competicoes.html` e o contrato server-side de `/api/competicoes`; os nomes normalizados usados pela UI (`competition`, `season`, `fixtures`, `standings`, `updatedAt`, `updateStatus`) correspondem ao adapter atual.
- Tentada validação direta dos URLs públicos `/competicoes` e `/api/competicoes?competition=liga-portugal`; o ambiente disponível não conseguiu aceder ao domínio público.
- Confirmado também que o conector GitHub não apresenta workflow/deployment CI associado ao commit da UI que permita substituir essa verificação de produção.

### Resultado
**VALIDAÇÃO DE PRODUÇÃO — PENDENTE POR ACESSO**, não por evidência de falha da implementação.

Não foram feitos novos calls BSD, novos testes D1, novo deployment artificial ou alterações de código sem evidência de problema.

### Dependência exata
A confirmação final exige acesso ao deployment/runtime Cloudflare Pages atualmente indisponível neste ambiente, ou uma verificação pública do domínio quando acessível.

### Próximo passo automático após desbloqueio
Verificar `/competicoes` em produção e pelo menos o carregamento de `/api/competicoes?competition=liga-portugal`; corrigir apenas problemas reais encontrados e registar a validação.


# 54. VALIDAÇÃO MANUAL DE PRODUÇÃO — /COMPETICOES — 2026-09-28

### Evidência fornecida pelo acesso real ao site
A página pública `https://chutapracanto.com/competicoes` foi aberta e devolveu conteúdo real da aplicação:
- menu principal inclui `Competições`;
- página `Competições` carrega corretamente;
- seletor apresenta as 7 competições previstas;
- `Liga Portugal 26/27` é carregada com estado `dados atuais`;
- jogos/resultados são apresentados;
- classificação é apresentada com 18 equipas;
- atualização apresentada: `28/09, 19:06`;
- nomes de equipas e estrutura do contrato normalizado aparecem corretamente.

### Resultado
**PASS — validação manual de produção da UI /competicoes para Liga Portugal.**

### Limite
Ainda não há evidência manual equivalente nesta sessão para as outras 6 competições. Não serão feitos novos calls ao fornecedor apenas para produzir essa evidência.

### Próximo passo
Validar as 6 restantes diretamente através do seletor da própria página; se alguma falhar, corrigir apenas o caso concreto.


# 55. VALIDAÇÃO MANUAL COMPLETA DA UI DE COMPETIÇÕES — 2026-09-28

### Evidência
Validação manual realizada na página pública `/competicoes` para as 7 competições previstas. A utilizadora confirmou que todas aparecem e carregam conteúdo:
- Liga Portugal
- Taça de Portugal
- Taça da Liga
- UEFA Champions League
- UEFA Europa League
- UEFA Conference League
- UEFA Nations League

### Resultado
**PASS — UI de Competições validada em produção para as 7 competições.**

### Estado
A implementação pública da Fase 3 para Competições está funcional e validada. Não são necessários novos testes repetitivos de BSD, D1, cache ou API neste ponto.

### Próximo passo
Avançar para a próxima tarefa da roadmap da Fase 3, sem reabrir validações já concluídas.


# 56. SEARCH CONSOLE — SITEMAP SUBMETIDO — 2026-09-28

### Operação executada
- Na propriedade `chutapracanto.com`, foi submetido o sitemap `https://chutapracanto.com/sitemap.xml`.
- A Google Search Console aceitou a submissão e informou que irá processá-la periodicamente e notificar problemas futuros.
- No momento da submissão, a área de Indexação de páginas apresentava **“A processar os dados… Verifique novamente dentro de cerca de um dia”**.

### Resultado
**PASS — sitemap submetido.**

### Estado da indexação
Ainda **SEM DADOS DISPONÍVEIS** na Search Console. Não é possível concluir ainda quantas páginas estão indexadas nem quais exclusões existem.

### Decisão operacional
Não repetir submissão, não forçar inspeções em massa e não alterar código sem evidência de problema. Aguardamos o processamento da Google.

### Próximo passo automático após disponibilidade dos dados
Consultar Sitemaps e Indexação de páginas; se surgirem erros/exclusões concretos, investigar e corrigir apenas esses casos. Caso contrário, fechar esta verificação como PASS e avançar para a próxima frente SEO da Fase 4.


# 57. SEO TÉCNICO — DADOS ESTRUTURADOS BASE — 2026-09-28

### Operação executada
- Auditoria de metadata SEO das páginas principais: title, description, canonical, robots e Open Graph presentes.
- `noticia.html` já contém JSON-LD dinâmico para artigos.
- Adicionado JSON-LD à homepage com `Organization` + `WebSite`, incluindo URL, logo, perfis sociais e idioma `pt-PT`.
- Commit: `fc0cd2bb64a621de1dd79b90c1266c682a5e2b7c`.

### Resultado
**IMPLEMENTADO — base de dados estruturados SEO.**

### Não reabrir
Não duplicar schema de artigos nem introduzir markup sem finalidade concreta.

### Próximo passo
Aguardar deployment automático e continuar a Fase 4 com validações externas apenas quando produzirem evidência nova. A Search Console continua a processar o sitemap.


# 49. CRON DE COMPETIÇÕES — IMPLEMENTAÇÃO REAL — 2026-09-28

### Correção de estado
A auditoria após a recuperação da main confirmou que a documentação anterior dizia que o Cron Trigger estava implementado, mas o código de produção em main não exportava scheduled() e wrangler.toml não continha o trigger.

### Implementação
- _worker.js passou a exportar scheduled(controller, env).
- Uma competição é selecionada por execução de 5 minutos, usando scheduledTime e rotação pelas 7 chaves.
- A execução consulta primeiro a D1 e não chama o BSD quando a entrada está fresca.
- Quando necessário, reutiliza o adapter BSD e grava na mesma chave de cache do endpoint /api/competicoes.
- Falhas são registadas e usam controller.noRetry() quando disponível.
- wrangler.toml passou a configurar */5 * * * *.

### Estado
IMPLEMENTADO — validação runtime pendente. Não declarar PASS do Cron até existir evidência de uma execução automática e atualização efetiva da D1.


# 34. REFINAMENTO UX — HOME + COMPETIÇÕES — 2026-09-28

- A área de competições continua em `main`, sem alteração da arquitetura de URLs de notícias.
- Refinada a área compacta de competições da Home: cartões com hierarquia mais clara, melhor leitura em mobile, sem perder acesso à página completa.
- Refinada `competicoes.html`: resultados ordenados do mais recente para o mais antigo; próximos jogos mantêm ordem cronológica; jornada selecionada é preservada durante atualizações; mudança de competição atualiza o query state e suporta navegação pelo histórico.
- Melhorada a semântica de acessibilidade dos atalhos de competições da Home.
- Validação GitHub: HEAD contém as alterações; não foram alterados dados editoriais nem a arquitetura de URLs de notícias.
- Bloqueio externo mantido: Cloudflare Pages deixou de criar deployments automáticos depois de `1e12fb3`; os commits posteriores aparecem como `No deployment available`. Não há check/status Cloudflare associado aos commits afetados. O código permanece em `main` aguardando resolução da integração GitHub → Cloudflare.


# 58. CORREÇÃO — CLOUDFLARE PAGES BUILD + CRON INVALIDADO — 2026-09-28

### Evidência real
Acesso direto ao Cloudflare Pages confirmou que os deployments posteriores a `1e12fb3` não estavam ausentes: estavam a ser criados e a **falhar na fase Build**.

O log do deployment de `5d920b2` identificou a causa exata:
`Configuration file for Pages projects does not support "triggers"`.

### Causa
`wrangler.toml` continha:
`[triggers]`
`crons = ["*/5 * * * *"]`

Essa configuração é incompatível com o projeto Cloudflare Pages atual e impede o build.

### Correção executada
- Removido o bloco `[triggers]` de `wrangler.toml`.
- Removido o handler `scheduled()` e a função de refresh agendado de `_worker.js`, porque o runtime atual é Cloudflare Pages e não existe um Worker separado ativo autorizado para receber esse Cron.
- Mantida a arquitetura Pages existente; não foi criado nem ressuscitado Worker separado.
- Commits:
  - `84a6b095` — remove configuração Cron incompatível do Pages.
  - `4d447aa7` — remove handler scheduled incompatível com a arquitetura Pages.

### Validação
- Deployment `84a6b095`: **PASS**, build e deploy concluídos.
- Deployment `4d447aa7`: **PASS**, build e deploy concluídos.
- Preview/produção de deployment mais recente: `https://f7b8e38a.chutapracanto.pages.dev`
- O gatilho GitHub → Cloudflare está funcional; a falha anterior não era de autorização, mas de configuração Wrangler incompatível com Pages.

### Decisão
A abordagem de Cron Trigger diretamente em `wrangler.toml` do Pages fica **invalidada** e não deve ser reintroduzida.

A atualização automática das competições deverá ser tratada posteriormente por uma solução compatível com a arquitetura atual, se houver necessidade concreta. Não criar um Worker separado apenas para repetir a abordagem invalidada.

### Correção do estado anterior
A anotação anterior que classificava os deployments posteriores a `1e12fb3` como "No deployment available" fica corrigida: o Cloudflare estava a receber os pushes, criar deployments e falhar no build devido ao bloco `triggers`.


# 59. CORREÇÃO DE ARQUITETURA — WORKER DE CRON REAL CONFIRMADO — 2026-09-28

### Evidência adicional obtida diretamente no Cloudflare
A auditoria do account confirmou que existe um Worker separado ativo:
- nome: `cpc-football-cron`;
- handler: `scheduled`;
- Cron Trigger real: `*/5 * * * *`;
- binding D1: `FOOTBALL_CACHE_DB` -> `cpc-football-cache`;
- deployment ativo com 100% de tráfego numa versão do Worker.

O Worker executa a rotação pelas 7 competições e chama o endpoint público `/api/competicoes`, usando a época disponível na D1 quando existente.

### Correção do diagnóstico anterior
O diagnóstico anterior que dizia que "não existe Worker separado" estava incorreto e fica invalidado.

A razão pela qual `[triggers]` não deve voltar ao `wrangler.toml` do Pages permanece válida: o Cron pertence ao Worker separado `cpc-football-cron`, não ao projeto Pages.

### Estado correto da arquitetura
`GitHub -> Cloudflare Pages` publica a aplicação CPC.
`cpc-football-cron -> /api/competicoes -> Pages Worker -> D1/BSD` trata a atualização agendada das competições.

### Decisão
- Manter o `wrangler.toml` do Pages sem `[triggers]`.
- Manter o Worker separado `cpc-football-cron` com o Cron Trigger real.
- Não duplicar o scheduled handler no `_worker.js` do Pages.
- Não criar outro Worker.
