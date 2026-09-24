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
