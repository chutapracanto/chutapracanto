# CHUTA PRA CANTO — MANUAL OPERACIONAL / FONTE DE VERDADE
Versão: 2026-09-24
Repo: chutapracanto/chutapracanto
Produção: main
Domínio: https://chutapracanto.com

## 0. REGRAS MÁXIMAS

Este ficheiro é a fonte de verdade operacional para o Assistente e o Codex.

- A utilizadora autorizou expressamente trabalho direto no GitHub: ficheiros, branches, commits, PRs e merges quando seguro.
- Não parar para relatório e pedir "segue".
- Se a próxima ação estiver nas mãos do Assistente: analisar -> implementar -> validar -> corrigir -> validar novamente -> repetir.
- Só parar perante decisão/ação da utilizadora ou limitação técnica real.
- Nunca enviar ZIPs.
- Nunca criar/enviar documentos, imagens ou anexos nesta conversa.
- Nunca pedir imagens, documentos ou prints.
- Não inventar conteúdo editorial, datas, resultados, autores, estatísticas ou imagens.
- Preservar tudo o que já funciona.
- Não fazer refactors desnecessários.
- Não alterar secrets/passwords/configuração sensível sem necessidade.
- Não duplicar soluções.
- PR fechada sem merge NÃO é produção.
- Antes de implementar, verificar main, PRs, commits e deployment.

## 1. REGRA 2026+

Qualquer informação que dependa de plataforma externa deve ser verificada na documentação/estado atual, não em memória antiga.

Aplicar a:
Cloudflare Pages/Workers, GitHub, AdSense, Search Console, Google News/Publisher Center/GNI, FormSubmit, Openverse, Wikimedia e APIs/fontes de futebol.

Em 2026-09-24 foi confirmada a documentação atual do Cloudflare Pages: integração Git com GitHub, deployments automáticos, Preview por branch/PR e branch de produção configurável. A documentação atual também posiciona Workers como plataforma principal para novos projetos, mas ISSO NÃO implica migrar o CPC: preservar a arquitetura existente até existir razão concreta.

Cloudflare atual:
https://developers.cloudflare.com/pages/get-started/git-integration/
https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/
https://developers.cloudflare.com/pages/

AdSense atual:
- o domínio deve estar na lista Sites;
- a verificação pode usar AdSense code snippet, ads.txt ou meta tag;
- o CPC escolheu Fragmento do código do AdSense;
- o crawler precisa de acesso;
- aprovação não deve ser assumida antes da revisão.

Fontes:
https://support.google.com/adsense/answer/12169212
https://support.google.com/adsense/answer/7584263
https://support.google.com/adsense/answer/12176698

Google News/GNI atual:
- Publisher Center é opcional para elegibilidade;
- Google News pode rastrear sites automaticamente;
- Publisher Center ajuda a gerir a apresentação;
- labels de conteúdo devem distinguir corretamente opinião/outros tipos;
- configuração não garante inclusão nem tráfego.

Fonte:
https://newsinitiative.withgoogle.com/resources/trainings/start-building-your-audience/get-started-on-google-news-with-publisher-center/

## 2. CODEX — ECONOMIZAR CRÉDITOS

O Codex é recurso valioso e NÃO é o executor por defeito.

Ordem:
1. Assistente inspeciona GitHub.
2. Assistente implementa diretamente tudo o que conseguir.
3. Assistente valida.
4. Assistente corrige.
5. Só se existir bloqueio real usa Codex.
6. Depois valida novamente.

Codex é reservado sobretudo para:
- browser/local;
- Chrome/DevTools/Lighthouse quando indisponíveis ao Assistente;
- Cloudflare Dashboard/CLI que exija sessão local;
- E2E dependente do computador da utilizadora;
- credenciais/sessões que só existam localmente.

Não gastar Codex com HTML/CSS/JS/JSON/Markdown que o Assistente possa editar, planos, explicações, reanálises ou trabalho duplicado.

### REGRA DE PROMPT CODEX

O Codex deve ler este ficheiro no repo. Não enviar o manual inteiro.

Prompt deve:
- indicar repo/branch;
- indicar a tarefa concreta;
- indicar o que NÃO alterar;
- pedir validação;
- pedir correção dentro do escopo;
- pedir resposta curta.

Pode ser grande o suficiente para ser inequívoco, mas não deve virar documento. Preferência: poucas centenas de palavras, contexto estritamente necessário.

Formato:
"Trabalha no repo chutapracanto/chutapracanto usando .github/AI_PROJECT_RULES.md. Faz apenas [tarefa]. Não alteres [limites]. Valida [testes]. Se encontrares erro dentro do escopo, corrige e volta a validar. No fim devolve resumo curto + resultado."

Esta regra vale para Assistente e Codex.

## 3. DEPLOY

Arquitetura:
GitHub -> Cloudflare Pages / Worker -> produção.

Pages:
- main = produção;
- branches/PRs = Preview quando configurado;
- validar Preview antes de merge;
- verificar commit + deployment + URL;
- depois do merge verificar produção.

Worker:
- existe Worker separado chamado "chutapracanto";
- NÃO confundir com _worker.js;
- erro do Worker deve ser investigado separadamente.

Nunca considerar "deploy successful" como prova de que toda a UX está correta. Deployment prova publicação, não substitui testes funcionais/visuais.

## 4. HISTÓRICO COMPLETO DAS PRs

### #1 — Fase 1: corrigir social preview
MERGED — 6cdb4e4
- OG/Twitter metadata dinâmica;
- leitura pública do Markdown para crawler;
- teste com facebookexternalhit e JS desativado.

### #2 — Fase 2: otimizar carregamento das notícias
MERGED — 76e4e995
- content/noticias-index.json;
- Home/Notícias/Admin usam índice;
- Markdown individual só quando necessário;
- GitHub Actions regenera índice;
- elimina carregamento N+1.

### #3 — Fase 3A: notícias relacionadas
MERGED — 7a3187b8
- "Continua a ler";
- três relacionados;
- artigo atual excluído;
- seleção pelo índice.

### #4 — Fase 0A: fundação SEO e segurança
MERGED — 293214af
- páginas institucionais;
- 404;
- robots;
- sitemap;
- canonical;
- NewsArticle/BreadcrumbList;
- DOMPurify;
- proteção de campos/feeds;
- uploads JPEG/PNG/WebP;
- limite 5 MiB;
- assinatura binária/nome/path;
- preservação do Admin e conteúdo.

### #5 — Fase 0B: UX mobile, imagens e media
MERGED — 31d58880
- header mobile;
- prioridade/proporções de imagens;
- feeds externos adiados;
- máximo seis vídeos;
- YouTube sob interação;
- labels/filtros/foco/áudio;
- marked/Turndown fixados;
- correção UMD de marked;
- cache no-store mantido;
- Preview validado.
Limitação histórica: não houve baseline Lighthouse/DevTools completa.

### #6 — Fase 2A: taxonomia e autores
MERGED — dfdaf5b7
- normalizações inequívocas FC Porto/Supertaça Europeia;
- categorias com IDs e tipos competition/club/mixed;
- tipos news/opinion/video/podcast;
- autores com IDs estáveis;
- pessoa vs organização;
- workflow enriquece índice;
- Admin preserva type e usa news por defeito.

### #7 — Fase 2B: separar Notícias e Opinião
MERGED — fd76abea
- Home e /noticias só news;
- compatibilidade com entradas antigas sem type;
- Admin seleciona/preserva type;
- workflow mantém índice.

### #8 — Fase 3A: identidade editorial
MERGED — 8635cbaa
- tipo editorial;
- authorId via authors.json;
- fallback do índice;
- modified só quando diferente de published;
- NewsArticle para news;
- Article para outros tipos.

### #9 — Fase 3B: URL state, contacto e footer
MERGED — 28b7eb3b
- pesquisa/categoria/paginação em URL;
- Back/Forward;
- contacto;
- validação HTML;
- honeypot;
- CAPTCHA FormSubmit;
- privacidade;
- footer uniforme.
Inicialmente deixou marcador FORM_SUBMIT_TOKEN_PENDING até confirmação.

### #10 — Uniformiza header, footer e logo
MERGED — 81dd6523
- header e quatro links uniformes;
- item ativo;
- footer/cópia institucional;
- logo fluido com clamp(), width automático e object-fit contain.

### #11 — Ativa FormSubmit
MERGED — 707ca08c
- identificador confirmado;
- endpoint AJAX preservado;
- destino real não exposto.

### #12 — Corrige ordem e taxonomia dinâmica
MERGED — af36cbac
- publishedAt ISO;
- preservação do dia editorial antigo;
- timestamps Admin;
- ordenação Home/Notícias;
- filtros via taxonomia;
- categorias novas no workflow;
- pesquisa normaliza acentos;
- papéis via authors.json;
- logo responsivo.
Preview validou pesquisas, filtro Seleção Nacional, quatro destaques, papéis, artigo, 320/390/768px sem overflow, footer e consola.

### #13 — Fase 3C: Opinião
MERGED — 42155e56
- página pública de Opinião;
- navegação;
- separação por type.

### #14 — Admin: Notícias/Crónicas + imagens abertas
MERGED — 20bcac87
- separação no Admin;
- + Nova Crónica;
- Openverse;
- URLs externas sem copiar imagens;
- cache longo de uploads;
- revalidação curta de índices.

### #15 — Fase 3D: Política Editorial / privacidade AdSense
MERGED — c79b153c
- Política Editorial;
- footer;
- privacidade para AdSense;
- sitemap.

### #16 — Pesquisa de imagens ampliada
MERGED — 81d65d1d
- Openverse + Wikimedia Commons;
- consultas com ano atual;
- até 30 resultados/consulta;
- deduplicação;
- fonte original;
- sem copiar imagens.

### #17 — Corrigir opinião/sitemap
FECHADA SEM MERGE.
Não é produção.
Foi substituída pelo #18.

### #18 — Corrigir opinião e autoria de Pedro
MERGED — 510bebbc
- carregamento/navegação de opinião;
- Pedro Soares identificado como autor da crónica;
- sitemap;
- breadcrumbs/JSON-LD preservados.
Autoria:
Rute Costa — Moderadora e Locutora.
Pedro Soares — Treinador, Opinião Crítica e Análise.

### #19 — Navegação/leitura/partilha/performance
FECHADA SEM MERGE.
Não é produção.
Incluía:
- navegação Notícias/Opinião;
- sticky progressivo;
- evitar sobreposição no fim;
- partilha compacta/menu/cópia;
- cartões pequenos;
- espaço do logo footer para CLS;
- preload imagem principal;
- feeds Home adiados;
- NewsArticle/BreadcrumbList;
- estrutura de partilha baseada em orientação então verificada da GNI.
Foi reaplicada no #22.

### #20 — Migração .com
MERGED — 05ca8862
- domínio chutapracanto.com;
- canonical/OG/robots/sitemap;
- Worker/Admin/workflow;
- ads.txt;
- snippet AdSense já existente preservado;
- redirect pages.dev -> .com dependente de Cloudflare quando necessário.

### #21 — Melhorias pós-migração
FECHADA SEM MERGE.
Não é produção.
Reaplicava #19 sobre .com.
Foi substituída pelo #22.

### #22 — Sticky, navegação e partilha pós-migração
MERGED — 9855a09b
- sticky progressivo dos artigos;
- navegação Notícias/Opinião;
- partilha compacta;
- layout/CLS;
- arquitetura futura de competições;
- sem secrets/Cloudflare config.
Deployment histórico successful, commit fff0fca.

### #23 — Sticky editorial progressivo + mobile Notícias
ABERTA / MERGEABLE / NÃO MERGED em 2026-09-24.
Branch: mobile-sticky-editorial
Head: 9e62d3e5
Preview: https://507d6a7d.chutapracanto.pages.dev
Deployment: SUCCESS
- header/cabeçalho encolhem/transparecem progressivamente no scroll;
- mobile Notícias passa a cartões verticais;
- imagem 16:9;
- texto legível;
- desktop mantém layout;
- não altera intencionalmente cores/tipografia.

Prioridade imediata:
1. validar #23;
2. corrigir diretamente;
3. validar novamente;
4. só então merge;
5. confirmar main pós-merge.
PR #24 não existe no último estado verificado.

## 4A. IMPORTAÇÃO DO ARQUIVO FRAMER

Subtarefa ativa em 2026-09-24: recuperar o arquivo histórico público do antigo Framer.

Regras obrigatórias:
- Fonte: arquivo público Framer /news e páginas individuais /noticias/<slug>.
- Inventário já confirmado: 213 links únicos no arquivo público.
- Ordem: Framer -> verificar -> eliminar duplicados -> preservar data original -> importar -> índice cronológico mais recente -> mais antigo.
- Notícias CPC que já existem permanecem intactas.
- Nunca sobrescrever Markdown existente.
- Deduplicação mínima: slug, sourceUrl e título normalizado + data.
- Preservar título, subtítulo, categoria, autor, imagem, conteúdo, slug e data original sempre que existirem na fonte.
- Não inventar datas, autores, categorias, conteúdo ou imagens quando a página não os fornecer.
- Antes da importação real, o dry-run de todo o arquivo deve concluir sem falhas e produzir relatório com URLs encontradas, prontos, ignorados e falhas.
- O dry-run não pode escrever artigos.
- Importação real só depois de validar também a integridade das imagens e a forma como URLs de imagem externas serão tratadas.
- Depois da importação, regenerar/validar o índice e confirmar ordem mais recente -> mais antiga, pesquisa, sitemap e ausência de regressões.
- O mecanismo temporário que força 213 URLs em cada push serve apenas para validação e deve ser removido antes de ficar como comportamento permanente.

Estado atual:
- script: scripts/import-framer-news.py;
- workflow: .github/workflows/testar-importacao-framer.yml;
- correção de import os aplicada no commit 04c78526a9953bb250130800b3bc5a818124b9e1;
- o check framer-dry-run desse commit está SUCCESS;
- validação de imagem foi acrescentada ao importer nos commits 43f291630fb69825172324118b60ec0edcc5aafc e ec1731934d4377343e6585ef4e36a17ee779dbfc;
- documentação da validação foi clarificada no commit ff152d19f99de675380228d6151998a93a956290;
- imagem ausente/inacessível agora conta como falha e bloqueia a entrada no lote de importação;
- o novo dry-run do último commit ainda está a ser criado/executado pelo GitHub Actions;
- foi criado temporariamente .github/workflows/importar-framer-uma-vez.yml para a importação real, com proteção contra sobrescrita; depois da execução deve ser removido;
- o workflow principal testar-importacao-framer.yml foi reforçado para escrita apenas com o marcador explícito [IMPORT-FRAMER-REAL];
- o gatilho foi tornado robusto no commit ef5a16812b9da42df66934e57aa2aff03ec5f4e8, lendo a mensagem do commit no runner;
- foi corrigida a permissão do workflow para contents: write no commit 556624cba28fe42089453d9df695b54e3465fdc8, necessária para o commit automático dos artigos;
- o push automático foi corrigido para `git push origin HEAD:main` no commit b229d43e114c49e9499af9277afbe64d5835bffd;
- o estado do importador passa a apontar para o run do GitHub Actions para permitir inspeção do relatório quando necessário, alteração no commit dc83e7c5bc37b14f6f74115c3e6ae1caa1eea43a;
- dry-run atual revelou 213 URLs encontradas, 0 prontas, 213 ignoradas e 0 falhas; todas foram classificadas como missing-title-date-or-body;
- prioridade mudou de importar para diagnosticar como o Framer entrega o HTML/conteúdo das páginas e adaptar o extrator sem inventar conteúdo;
- diagnóstico confirmou HTML HTTP 200 completo (~166–171 KB), título presente, 19 parágrafos no primeiro artigo e metadados Framer/search-index; não há JSON-LD. O problema está na seleção do contentor pelo parser atual, não na ausência de HTML;
- extrator adaptado ao template Framer: contentor irmão do cabeçalho, data em `Publicado em`, autor após `Por`, categoria entre o link de retorno e o título, e meses portugueses;
- commit de adaptação: 996897a0def026b6f625d1980b5f1544c74aee03; a próxima execução deve validar prontos/falhas antes de considerar a importação concluída;
- diagnóstico dos campos confirmou título/data/categoria/autor/imagem corretos, mas o corpo estava em elementos `div`, não `p`; commit ce9a50994154ff32523798b12694ddab82641c92 passou a extrair o bloco de corpo diretamente;
- o commit a02106e651e0a7346510c9d824559f175ddc1734a é o novo gatilho controlado de escrita;
- a primeira importação válida preparou 179 artigos, mas o push foi rejeitado porque main avançou durante a execução; o workflow agora faz fetch/rebase de main antes de publicar;
- o run 36022816703 confirmou: 213 URLs, 179 prontos, 34 duplicados/ignorados, 0 falhas;
- o run seguinte conseguiu preparar os 179 no runner mas não os viu no stage normal; o workflow passou a usar `git add -f content/noticias` para garantir que os novos Markdown entram no commit;
- o commit 4f9f3e91c93b91b2d0f5565a6dd6a83de8dbbce5 é o gatilho controlado da importação real;
- isso não autoriza importação real: ainda é necessário validar o relatório completo e a estratégia de imagens;
- não gastar Codex para esta fase enquanto o Assistente conseguir continuar pelo GitHub.

### PRIORIDADE ATUAL DA IMPORTAÇÃO

O dry-run completo terminou SUCCESS no commit anterior. A prioridade operacional passou para a importação real única do arquivo, seguida de geração automática do índice/sitemap e validação. Depois de concluída, remover o workflow temporário de importação para não voltar a fazer 213 pedidos em futuros pushes.

### REGRA DE CONTINUIDADE DE EXECUÇÃO

Uma mensagem do Assistente NÃO deve ser tratada como ponto de paragem quando existe uma próxima ação autónoma possível.

É proibido terminar uma resposta com fórmulas como "o próximo passo continua comigo", "agora fico a aguardar", "diz-me para seguir" ou equivalente quando a ação seguinte pode ser executada imediatamente.

Fluxo obrigatório: executar -> verificar -> corrigir -> verificar -> executar próxima etapa -> repetir.

Só enviar resposta à utilizadora quando:
1. o trabalho atingiu um ponto de conclusão real; ou
2. existe uma dependência externa que exige uma ação dela e não pode ser contornada pelo Assistente.

Se a ferramenta devolver estado pending, o Assistente deve continuar a verificar/atuar quando houver uma ferramenta adequada, em vez de encerrar a interação apenas para relatar pending.

AI_PROJECT_RULES.md deve ser atualizado sempre que uma nova regra, prioridade, arquitetura, decisão operacional ou alteração relevante do projeto seja introduzida.

## 5. ESTADO CONSOLIDADO

Produção inclui:
#1 #2 #3 #4 #5 #6 #7 #8 #9 #10 #11 #12 #13 #14 #15 #16 #18 #20 #22.

Não produção:
#17 #19 #21.

Aberta:
#23.

## 6. REGRAS EDITORIAIS

- Preservar datas de publicação.
- Não alterar slugs sem necessidade.
- Não duplicar artigos.
- Preservar autor, categoria e imagem.
- Não inventar conteúdo.
- Pedro Soares é autor das peças de opinião/crónica quando indicado.
- Rute Costa = Moderadora e Locutora.
- Não transformar opinião em notícia.
- Manter news/opinion tecnicamente separados.
- publishedAt deve manter coerência com published.
- Não alterar conteúdo só porque um workflow foi executado.

## 7. SEO / SOCIAL / DADOS ESTRUTURADOS

Já existe:
- canonical;
- OG/Twitter;
- NewsArticle;
- Article para outros tipos;
- BreadcrumbList;
- sitemap;
- robots;
- autores;
- datas;
- tipos editoriais;
- relacionados.

Qualquer alteração editorial deve verificar:
- canonical;
- título;
- descrição;
- imagem;
- URL absoluta;
- breadcrumbs;
- schema;
- coerência news/opinion.

## 8. CONTACTO

FormSubmit está ativado.
Preservar:
- endpoint/identificador atual;
- não expor destino real;
- privacidade coerente com o processamento;
- não trocar de serviço sem necessidade.

## 9. ADSENSE

Domínio atual: chutapracanto.com
Conta existente: rute-costa_@hotmail.com
Publisher ID: ca-pub-1556367149800029
Método escolhido: Fragmento do código do AdSense.

Já preparado:
- snippet;
- ads.txt;
- privacidade/política técnica;
- .com.

Próximos pontos:
- confirmar domínio no AdSense;
- confirmar verificação;
- acompanhar revisão;
- crawler;
- políticas;
- CMP/consentimento quando aplicável ao tráfego europeu.

Não criar segunda conta sem decisão explícita. Não assumir aprovação.

## 10. GOOGLE NEWS / GNI

Objetivo: preparar elegibilidade e clareza editorial, não prometer inclusão.

Ordem:
1. Search Console;
2. sitemap;
3. robots/canonical/indexabilidade;
4. Publisher Center quando útil;
5. nome/país/idioma/logo;
6. secções;
7. labels para Opinião;
8. validar páginas reais;
9. acompanhar;
10. atualizar regras se Google mudar.

Publisher Center é atualmente opcional para elegibilidade.

## 11. PERFORMANCE

Histórico: LCP mobile aproximadamente 17,5–18,3 s em medições anteriores. Causa única não foi comprovada.

Regra:
- medir antes;
- não inventar causa;
- Lighthouse/PageSpeed/DevTools;
- comparar desktop/mobile;
- LCP/CLS/INP/TBT conforme ferramenta;
- imagens/scripts/feeds/YouTube/cache;
- corrigir gargalos comprovados.

Se a medição exigir ambiente local, usar Codex com prompt curto.

## 12. ROADMAP MASTER

FASE 0A — Fundação técnica/SEO/segurança — CONCLUÍDA (#4)
FASE 0B — UX mobile/media/performance inicial — CONCLUÍDA (#5)
FASE 1 — Social preview — CONCLUÍDA (#1)
FASE 2 — Performance estrutural Notícias — CONCLUÍDA (#2)
FASE 2A — Taxonomia/autores — CONCLUÍDA (#6)
FASE 2B — Notícias vs Opinião — CONCLUÍDA (#7)
FASE 3A — Relacionados + identidade editorial — CONCLUÍDA (#3/#8)
FASE 3B — URL/contacto/footer — CONCLUÍDA (#9/#11)
FASE 3C — Opinião/Crónicas — CONCLUÍDA (#13/#14/#18)
FASE 3D — Política/privacidade/AdSense técnico — CONCLUÍDA (#15)
FASE 3E — Pesquisa imagens — CONCLUÍDA (#16)
FASE 4 — Domínio/monetização técnica — EM CURSO (#20)
FASE 5 — UX editorial/navegação/partilha/sticky — PARCIALMENTE CONCLUÍDA (#22; #23 em validação)
FASE 6 — Performance mensurável — PRÓXIMA
FASE 7 — Dados estruturados de futebol — FUTURA
FASE 8 — Google News/Publisher Center — FUTURA
FASE 9 — Monetização — FUTURA/PROGRESSIVA
FASE 10 — Crescimento/distribuição — FUTURA

### FASE 4 — Domínio/monetização
- .com;
- redirects Cloudflare;
- AdSense;
- ads.txt;
- Search Console;
- validação real.

### FASE 5 — UX editorial
- terminar #23;
- confirmar sticky;
- confirmar mobile;
- confirmar partilha/navegação de #22;
- verificar regressões.

### FASE 6 — Performance
- baseline atual;
- Core Web Vitals;
- LCP;
- CLS;
- INP/TBT;
- imagens;
- scripts;
- feeds;
- YouTube;
- cache;
- rede;
- correções baseadas em evidência.

### FASE 7 — Futebol estruturado
- competições;
- equipas;
- resultados;
- classificações;
- calendários;
- fonte/API atual;
- licença/termos;
- rate limits;
- separação entre dados automáticos e texto editorial.
Nunca inventar dados.

### FASE 8 — Google News
- Search Console;
- Publisher Center;
- labels;
- secções;
- logo;
- sitemap;
- indexabilidade;
- acompanhamento.

### FASE 9 — Monetização
- AdSense;
- consentimento/CMP;
- anúncios com baixo impacto;
- publicidade/parcerias;
- preservar velocidade/UX.

### FASE 10 — Crescimento
- SEO editorial;
- recirculação;
- Shorts/Reels;
- podcasts;
- distribuição;
- audiência;
- leitores recorrentes;
- newsletter/parcerias quando fizer sentido.

## 13. PRIORIDADES

P0 AGORA:
1. #23.
2. validar/corrigir.
3. merge só após validação.
4. confirmar main + .com + #22.

P1:
5. .com em todas as superfícies.
6. AdSense/ads.txt.
7. Search Console/indexabilidade.
8. sitemap/robots/canonical/OG.
9. baseline performance.

P2:
10. Google News/Publisher Center.
11. performance comprovada.
12. pequenas melhorias editoriais.

P3:
13. dados de futebol.
14. monetização avançada.
15. crescimento/distribuição.

## 14. CHECKLIST DE FECHO

[ ] implementação
[ ] diff
[ ] sintaxe
[ ] referências
[ ] sem duplicação
[ ] conteúdo/datas/slugs/autores/imagens preservados
[ ] SEO/structured data
[ ] Preview
[ ] deployment
[ ] função principal
[ ] regressões
[ ] PR state
[ ] main após merge
[ ] serviço externo atualizado 2026+
[ ] Codex só se necessário
[ ] Codex validado depois
[ ] utilizadora só intervém se indispensável

## 15. REGRA FINAL

Se o próximo passo estiver nas mãos do Assistente: FAZ.
Se falhar: CORRIGE.
Se puder testar: TESTA.
Se encontrar problema dentro do escopo: CORRIGE.
Se precisar verificar: VERIFICA.
Só parar perante conclusão ou dependência externa real.

Se precisar de Codex: prompt curto, focado, sem reproduzir este manual.
Se precisar da utilizadora: pedir apenas a ação indispensável.

FIM.


## 16. ATUALIZAÇÃO OPERACIONAL — 2026-09-24 16:49 WEST

- Regra permanente reforçada: esta documentação é atualizada no mesmo ciclo sempre que surgir uma nova regra, prioridade, decisão ou alteração relevante.
- Regra de continuidade reforçada pela utilizadora: nunca terminar uma mensagem apenas porque existe um estado pending ou porque existe trabalho autónomo ainda executável. Continuar a executar, verificar, corrigir e repetir até conclusão ou dependência externa real.
- Corrigido o workflow `.github/workflows/testar-importacao-framer.yml` no commit `fb0316790f9a19f6de863bc0aadbd720de1aebad`.
- O workflow deixa de escrever artigos automaticamente em qualquer push. Em push normal executa dry-run completo; escrita só ocorre quando a mensagem do commit contém explicitamente `[IMPORT-FRAMER-REAL]`.
- Esta proteção é obrigatória para impedir que correções do importer ou do próprio workflow provoquem uma importação real acidental.
- O importer atual contém a extração adaptada ao template Framer e validação de imagem, mas a importação real continua bloqueada até existir uma validação completa do lote.
- Antes da importação real: confirmar relatório de 213 URLs, falhas = 0 para entradas consideradas importáveis, duplicados corretamente classificados e imagens acessíveis. Não considerar apenas o estado do commit como validação do lote.
- Depois da importação real: validar número efetivamente escrito, ausência de sobrescrita, índice cronológico, pesquisa, sitemap e regressões; remover o mecanismo temporário de importação única.


## 17. REGRA DE ESCALADA — QUANDO A EXECUÇÃO EXTERNA É INEVITÁVEL

- Se a continuação do trabalho depender de uma capacidade que o ambiente atual não disponibiliza, **não terminar simplesmente a resposta**.
- Primeiro esgotar tudo o que puder ser executado diretamente no GitHub/repositório e verificar o estado.
- Quando restar uma operação externa inevitável, identificar imediatamente **quem precisa de a executar**:
  1. **Utilizadora**, quando exige uma ação manual na interface/conta/Cloudflare ou uma decisão que só ela pode tomar.
  2. **Codex**, quando exige execução local, browser/Cloudflare, terminal, rede, GitHub Actions ou outra capacidade disponível ao Codex mas não ao ambiente atual.
- Nesse momento, preparar **imediatamente a instrução acionável**, sem pedir à utilizadora para descobrir os passos.
- Para a utilizadora: fornecer passos numerados, curtos e exatos, indicando onde clicar/fazer e o resultado esperado.
- Para o Codex: fornecer um **prompt pronto a colar**, curto e específico, mandando primeiro ler `.github/AI_PROJECT_RULES.md`, inspecionar o estado atual e executar/verificar a tarefa; não colar o manual inteiro no prompt.
- Se forem necessárias ações em ambos, separar claramente a parte da utilizadora e a parte do Codex e indicar a ordem.
- Depois de a ação externa ser executada, retomar automaticamente o ciclo: **verificar → corrigir → verificar → continuar**, sem considerar a tarefa concluída apenas porque a execução externa terminou.
- Nunca dizer apenas “isto tem de ser feito externamente” ou “o próximo passo é teu”. A resposta deve deixar a pessoa com **o procedimento ou prompt pronto para executar imediatamente**.
