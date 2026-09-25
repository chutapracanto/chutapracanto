# CHUTA PRA CANTO — REGISTO DE ESTADO, HISTÓRICO, TESTES E DECISÕES
## Documento de continuidade operacional para futuras IAs / agentes
**Data:** 2026-09-25
**Repositório:** `chutapracanto/chutapracanto`
**Produção:** `main` → `https://chutapracanto.com`
**HEAD de main verificado nesta atualização:** `f7ef4d9a4a020dfad3cd59169aee3017774227b6`

> Este documento é um **registo de execução e memória técnica**, não substitui `.github/AI_PROJECT_RULES.md`.
> A ordem obrigatória continua a ser: **Rules → este registo → Bíblia Mestra → GitHub/produção real → histórico específico quando necessário**.
>
> O objetivo é impedir que uma IA futura volte a gastar tempo, créditos ou alterações em problemas já resolvidos, experiências que falharam, PRs fechadas ou hipóteses já descartadas sem nova evidência.

---

# 1. ESTADO EXECUTIVO ATUAL

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

## 1.2 HEAD atual

`main` foi verificada diretamente no GitHub e está em:

`f7ef4d9a4a020dfad3cd59169aee3017774227b6`

Mensagem:

`perf: primeira passagem de LCP mobile`

Isto confirma que a primeira passagem de LCP foi efetivamente integrada em produção através da PR #26.

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

# 3. IMPORTAÇÃO HISTÓRICA DO FRAMER — CONCLUÍDA

Esta fase está **fechada**.

Resultado documentado:

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

## Não fazer
- não repetir a importação;
- não reabrir o workflow temporário;
- não duplicar os artigos;
- não apagar os scripts históricos de auditoria/manutenção sem motivo;
- não tratar documentos históricos como estado atual.

## O que aconteceu durante a importação

Houve uma situação em que o importador escreveu os Markdown mas o índice/sitemap ainda não estavam regenerados.

A correção foi operacional:

1. verificar o estado real;
2. regenerar o índice;
3. validar o sitemap;
4. confirmar 233 entradas;
5. confirmar 241 URLs;
6. só depois fechar a fase.

**Lição permanente:** um workflow que termina SUCCESS não significa automaticamente que todos os artefactos derivados estão atualizados.

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

# 9. CLS 0,571 — NÃO RESOLVER POR PALPITE

Foi observada uma medição válida de artigo desktop com:

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

Existe:

- `_worker.js` no repositório;
- um Cloudflare Worker separado chamado `chutapracanto`.

**Não confundir os dois.**

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
- editar Markdown;
- editar HTML/CSS/JS;
- criar commits;
- criar branches;
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
- HEAD atual: `2192b856aecb679ba2d7e1bedeeab8fdd2ef248c`.
- Commit: `docs: registar auditoria seo técnica`.
- O HEAD atual está 1 commit à frente de `31f2bb3dd41c199b729cc2fe54f1eacff06f7e64`, sem divergência atrás.
- A única alteração nesse avanço foi documentação do próprio ledger; não houve alteração de código, conteúdo editorial, workflow ou configuração de produção.
- Não existem PRs abertas neste momento.
- O HEAD `f7ef4d9...` anteriormente registado no início deste documento está desatualizado; o estado real do GitHub prevalece.
- Consequência: a primeira passagem de LCP continua integrada em produção, mas este novo commit não altera a conclusão técnica sobre LCP/CLS.
- Distinção operacional: LCP first pass = **implementada, sem melhoria quantitativa before/after comprovada**; CLS = **problema ainda aberto, sem causa causalmente comprovada**; SEO técnico básico = **implementado e auditado**; indexação real = **ainda não medida no Search Console**.
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
