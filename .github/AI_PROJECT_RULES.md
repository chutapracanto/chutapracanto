# CHUTA PRA CANTO — MANUAL OPERACIONAL / FONTE DE VERDADE
Versão: 2026-09-25
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
- workflow enriquece índice;- Admin preserva type e usa news por defeito.

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
Estado real confirmado em 2026-09-24: PR fechada, não merged; HEAD no fecho: `acfcc1c7974bf42e81f2a2a3fe633bffc06d6733`. As alterações reaplicadas/validadas em produção devem ser consideradas apenas através do #22 e alterações posteriores efetivamente mergeadas.
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
FECHADA SEM MERGE.
Não é produção.
A melhoria foi reaplicada na PR #24 sobre a main atual e validada antes do merge.

### #24 — Sticky editorial progressivo e mobile de Notícias — base atual
MERGED — d1ac249d0cd5fee66e25d7162a97872dc82e28e3
- reaplicação do sticky editorial progressivo;
- mobile Notícias em cartões verticais com imagem 16:9;
- desktop preservado;
- 2 ficheiros alterados: noticia.html e style.css;
- validação visual/funcional em 390, 320, 768 e 1280 px;
- performance medida com Lighthouse;
- consola permaneceu inconclusiva por limitação do browser incorporado, sem alteração de código nessa ronda;
- PR mergeada em 2026-09-24;
- produção passa agora para validação pós-merge.

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
- commit de adaptação: 996897a0def026b6f625d1980b5f1544c74aee03; a próxima execução deve validar prontos/falhas antes de considerar a importação concluída;- diagnóstico dos campos confirmou título/data/categoria/autor/imagem corretos, mas o corpo estava em elementos `div`, não `p`; commit ce9a50994154ff32523798b12694ddab82641c92 passou a extrair o bloco de corpo diretamente;
- o commit a02106e651e0a7346510c9d824559f175ddc1734a é o novo gatilho controlado de escrita;
- a primeira importação válida preparou 179 artigos, mas o push foi rejeitado porque main avançou durante a execução; o workflow agora faz fetch/rebase de main antes de publicar;
- o run 36022816703 confirmou: 213 URLs, 179 prontos, 34 duplicados/ignorados, 0 falhas;
- o run seguinte conseguiu preparar os 179 no runner mas não os viu no stage normal; o workflow passou a usar `git add -f content/noticias` para garantir que os novos Markdown entram no commit;
- o commit 4f9f3e91c93b91b2d0f5565a6dd6a83de8dbbce5 é o gatilho controlado da importação real;
- isso não autoriza importação real: ainda é necessário validar o relatório completo e a estratégia de imagens;
- não gastar Codex para esta fase enquanto o Assistente conseguir continuar pelo GitHub.

### FECHO DA IMPORTAÇÃO FRAMER

A importação real, regeneração do índice/sitemap e validação final estão concluídas. Não executar novamente o importer nem reabrir esta fase sem nova necessidade explícita. O workflow temporário de importação foi removido. O importer e artefactos de auditoria só devem ser removidos após avaliar o seu valor de manutenção/auditoria.

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
#1 #2 #3 #4 #5 #6 #7 #8 #9 #10 #11 #12 #13 #14 #15 #16 #18 #20 #22 #24.

Não produção:
#17 #19 #21 #23.

Aberta:
nenhuma PR relacionada ao sticky editorial.

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
FASE 4 — Domínio/monetização técnica — CONCLUÍDA TECNICAMENTE (#20); operação AdSense/Search Console continua separada
FASE 5 — UX editorial/navegação/partilha/sticky — CONCLUÍDA TECNICAMENTE (#22 + #24); validação pós-merge continua
FASE 6 — Performance mensurável — PRÓXIMA APÓS VALIDAÇÃO DO #23
FASE 7 — Dados estruturados de futebol — FUTURA
FASE 8 — Google News/Publisher Center — FUTURA
FASE 9 — Monetização — FUTURA/PROGRESSIVA
FASE 10 — Crescimento/distribuição — FUTURA

### FASE 4 — Domínio/monetização
- migração técnica para .com: concluída em #20;
- redirects/configuração Cloudflare: validar quando houver necessidade operacional;
- AdSense: acompanhamento/verificação/revisão, sem assumir aprovação;
- ads.txt: preservado/preparado;
- Search Console: validar propriedade, sitemap e indexabilidade quando esta frente for retomada;
- não iniciar agora compra/configuração de .pt; a decisão atual é tratar .pt como próxima fase quando a operação de domínio for retomada.

### FASE 5 — UX editorial
- #24 concluído e mergeado;
- sticky confirmado;
- mobile confirmado;
- partilha/navegação de #22 preservadas;
- falta apenas confirmação pós-merge em produção.

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
1. Confirmar deployment pós-merge do #24.
2. Confirmar produção .com e regressões principais.
3. Se não houver regressões, estabelecer baseline atual de performance em produção.

P1:
5. Baseline mensurável de performance/LCP/CLS/INP/TBT.
6. Corrigir gargalos comprovados, sem repetir alterações de PRs fechadas.
7. Confirmar superfícies .com e artefactos SEO já existentes.
8. Retomar AdSense/Search Console na ordem definida.

P2:
9. Google News/Publisher Center.
10. pequenas melhorias editoriais.
11. dados estruturados de futebol.

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

## 30. REGRAS PERMANENTES — CODEX: LIMITES DE EXECUÇÃO E ECONOMIA DE CRÉDITOS — 2026-09-25

- O Codex NÃO é executor por defeito do projeto. É uma ferramenta de capacidade complementar.
- O Assistente é o responsável por 100% do trabalho que consegue executar diretamente, incluindo GitHub: inspeção, análise, edição de ficheiros, branches, commits, PRs, merges quando seguros e validação por código.
- O Codex deve ser chamado apenas quando existir uma capacidade real que o ambiente do Assistente não disponibiliza, especialmente browser real/Chrome, DevTools Console/Network/Performance, Lighthouse/PageSpeed executados nesse ambiente, E2E/local, Cloudflare Dashboard/sessão local ou outra operação externa efetivamente indisponível ao Assistente.
- É PROIBIDO usar Codex para tarefas que o Assistente consegue executar diretamente no GitHub/repositório, incluindo editar HTML, CSS, JS, JSON, Markdown, workflows ou documentação; criar commits; criar/alterar branches; abrir/alterar/fechar/mergear PRs; rever diffs que o Assistente consegue consultar; atualizar índices/ficheiros; ou fazer trabalho duplicado.
- O Codex NÃO deve alterar o GitHub por iniciativa própria. Mesmo quando encontra um bug no código, deve reportar a causa, localização, evidência e correção recomendada ao Assistente. A implementação no GitHub pertence ao Assistente, salvo instrução explícita e excecional da utilizadora em contrário.
- Quando o Codex for necessário, a tarefa deve ser mínima e fechada: executar somente a capacidade externa indisponível, recolher evidência objetiva e devolver um resumo curto. Não deve expandir o escopo, refatorar, criar melhorias paralelas ou repetir análises já feitas.
- Para problemas de browser/performance, o Codex deve executar a medição/diagnóstico real quando essa for a capacidade em falta; não deve apenas explicar como fazer.
- Se a tarefa externa revelar um problema de código, parar no limite da investigação e devolver: URL/ambiente, erro exato, reprodução, evidência relevante, ficheiro/área suspeita e correção recomendada. O Assistente fará a alteração no GitHub.
- Antes de qualquer tarefa, o Codex deve ler `.github/AI_PROJECT_RULES.md` e `.github/CODEX_RULES.md`. Estas regras são obrigatórias e prevalecem sobre instruções genéricas ou pedidos que ampliem o escopo.
- O prompt enviado ao Codex deve lembrar explicitamente a leitura destes dois ficheiros e indicar o limite exato da tarefa.
- O Codex deve evitar executar comandos ou testes caros quando uma verificação barata responde à pergunta. Deve preferir uma execução objetiva, uma recolha de evidência e uma resposta curta.
- Depois de cada intervenção do Codex, o Assistente deve verificar novamente o GitHub e continuar o ciclo de implementação/correção/validação.

### REGRA PRÁTICA DE ESCALADA

1. Assistente verifica se consegue resolver diretamente.
2. Se consegue: NÃO usa Codex.
3. Se não consegue por limitação técnica real: usa Codex apenas para essa capacidade.
4. Codex diagnostica/executa o mínimo necessário.
5. Assistente retoma o trabalho e faz a correção no GitHub.
6. Assistente valida novamente.

Esta regra existe para reduzir consumo de créditos do Codex sem limitar a sua utilização quando ele é realmente necessário.

## 31. REGISTO OPERACIONAL — 2026-09-25

- Nova divisão de responsabilidades confirmada pela utilizadora: GitHub é integralmente responsabilidade do Assistente; Codex fica reservado para capacidades externas que o Assistente realmente não possui.
- Foi criada a regra permanente de proibições do Codex em `.github/CODEX_RULES.md`.
- O `AI_PROJECT_RULES.md` deve continuar a ser atualizado no mesmo ciclo sempre que forem introduzidas novas regras, decisões, fases, limitações, correções de processo ou alterações relevantes de arquitetura.
- O `CODEX_RULES.md` deve receber novas restrições, permissões ou procedimentos específicos do Codex sempre que a experiência do projeto revelar uma situação nova.
- Quando surgir uma nova regra operacional relevante para continuidade, atualizar os documentos de regras antes de encerrar a alteração.

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


## 18. ATUALIZAÇÃO OPERACIONAL — 2026-09-24 17:XX WEST

- O workflow separado `.github/workflows/importar-framer-uma-vez.yml` foi identificado como perigoso porque o gatilho anterior em `push` executava `--write` automaticamente.
- Esse comportamento foi removido no commit `48e701ee4ee750dfdac0669d4ee9f09645c19697`.
- A importação única passou a ser exclusivamente manual via `workflow_dispatch`, com confirmação explícita `IMPORTAR`; sem essa confirmação, a execução é bloqueada.
- Nenhum push normal, correção do importer ou alteração do workflow pode agora disparar por si só a importação real através deste workflow.
- Esta proteção complementa o `testar-importacao-framer.yml`, que continua em dry-run por defeito e só escreve com o marcador explícito `[IMPORT-FRAMER-REAL]`.
- A importação real continua a exigir validação do lote e autorização explícita para escrever os 179 artigos preparados.

## 19. ATUALIZAÇÃO OPERACIONAL — 2026-09-24 17:XX WEST

- A utilizadora executou manualmente o workflow `Importar arquivo histórico Framer (execução manual)` com confirmação explícita `IMPORTAR`.
- Run GitHub Actions `36026062466`: SUCCESS, duração 1m11s.
- Job `importar`: SUCCESS em todos os passos; `rejeitado`: SKIPPED, confirmando que a execução autorizada foi a escolhida.
- Commit resultante da importação: `6701b981302dea5955047812e83e92e6a5c17dbe`, mensagem `content: importar arquivo histórico do Framer`.
- O repositório passou de 53 ficheiros Markdown em `content/noticias` para 232, portanto foram escritos 179 novos artigos, coerente com o dry-run anterior (213 URLs encontradas, 179 prontas, 34 duplicadas/ignoradas, 0 falhas).
- O índice `content/noticias-index.json` ainda estava com 54 entradas no momento da verificação, e o `sitemap.xml` com 62 URLs. Isto é estado transitório de pós-importação e NÃO deve ser considerado validado até o workflow de geração do índice concluir.
- O workflow `.github/workflows/gerar-indice-noticias.yml` é responsável por regenerar o índice e o sitemap a partir dos Markdown. Depois da importação real, verificar explicitamente que esse processamento ocorreu, que o índice contém os 232 artigos/opiniões esperados, que a ordenação é mais recente -> mais antiga e que o sitemap foi atualizado.
- Só depois dessa validação final devem ser removidos o workflow temporário `.github/workflows/importar-framer-uma-vez.yml` e quaisquer mecanismos temporários de importação.
- Regra de continuidade aplicada: depois de uma ação externa executada pela utilizadora, o Assistente deve consultar diretamente o estado do GitHub e continuar a validação/correção, sem pedir à utilizadora para interpretar os resultados.

## 20. ATUALIZAÇÃO OPERACIONAL — 2026-09-24 17:XX WEST

- Verificação pós-importação confirmou que o commit automático `6701b981302dea5955047812e83e92e6a5c17dbe` colocou os 179 artigos novos no repositório, totalizando 232 Markdown em `content/noticias`.
- O índice e sitemap não devem ser assumidos como atualizados só porque o import terminou SUCCESS. O commit automático feito pelo workflow usa o token do GitHub Actions; workflows dependentes de `push` não devem ser considerados disparados automaticamente por esse commit.
- Regra operacional: sempre verificar o estado efetivo de `content/noticias-index.json` e `sitemap.xml` depois de workflows que escrevem conteúdo. Se estiverem desatualizados, executar explicitamente o mecanismo de regeneração disponível ou adaptar o workflow para que a mesma execução produza todos os artefactos necessários.
- O estado observado após a importação foi índice com 54 entradas e sitemap com 62 URLs, apesar de existirem 232 Markdown. Portanto, a etapa de regeneração/validação continua obrigatória antes de remover o workflow temporário de importação.
## 21. REGRA PERMANENTE — CODEX DEVE CONSULTAR AS RULES

- Sempre que o Assistente preparar um prompt para o Codex para este projeto, o prompt deve lembrar explicitamente o Codex de ler `.github/AI_PROJECT_RULES.md` antes de executar a tarefa.
- A formulação mínima recomendada é: **"Trabalha no repo chutapracanto/chutapracanto usando .github/AI_PROJECT_RULES.md. Lê as rules primeiro antes de alterar ou executar qualquer coisa."**
- Esta lembrança é obrigatória mesmo quando a tarefa parece pequena, porque o ficheiro contém decisões de arquitetura, limites, prioridades, histórico e regras de segurança que podem ser relevantes para a execução.
- Não é necessário copiar o conteúdo do manual para o prompt; basta indicar o ficheiro e mandar lê-lo primeiro.
- Depois da execução do Codex, o Assistente deve voltar a verificar o estado do GitHub e continuar o ciclo de validação/correção definido neste manual.
## 22. FECHO DA IMPORTAÇÃO HISTÓRICA FRAMER — 2026-09-24

- Regeneração pós-importação concluída com sucesso no workflow `Gerar índice de notícias`, run `36026495095`.
- Validação confirmou 233 Markdown: 232 notícias em `content/noticias` e 1 opinião em `content/opiniao`.
- `content/noticias-index.json` contém os 233 artigos/opiniões, sem caminhos ou slugs em falta ou duplicados, ordenado do mais recente para o mais antigo, preservando os 54 artigos anteriores.
- `sitemap.xml` contém 241 URLs: 233 artigos correspondentes ao índice + 8 páginas públicas, sem URLs de artigos em falta ou extra.
- Não houve alteração de conteúdo editorial nem nova execução do importador Framer durante a regeneração.
- A importação histórica Framer está operacionalmente concluída. O workflow temporário `.github/workflows/importar-framer-uma-vez.yml` foi removido após a validação final, no commit `ced7e4113b9a4fb76102c2a32cd9325fc84ce8bd`.
- O importer/scripts e restantes mecanismos só devem ser removidos ou alterados depois de verificar se ainda existe valor de auditoria/manutenção; não apagar artefactos de auditoria sem necessidade.

## 23. RECONCILIAÇÃO DO ESTADO REAL — 2026-09-24

- Revisão feita diretamente contra o GitHub, não apenas contra a memória das conversas.
- main confirmado em `0f5be13d75a94aba956e4ed1af1d09d6b2aa1060`, commit `docs: fechar importação histórica do Framer`.
- O SHA `571e5e5293daefe63c6bdb5d2a2568eb2da4b9fd` visto em `fetch_file(index.html)` é SHA do blob de `index.html`, não HEAD de main.
- PR #19 está fechada e não mergeada; não é produção.
- PR #23 foi fechada sem merge por estar 75 commits atrás da main após a importação histórica; não é produção. O seu conteúdo foi reaplicado sem alteração de ficheiros de base na PR #24.
- #22 é a implementação de produção da linha sticky/navegação/partilha pós-migração; não duplicar #19/#21. A PR #24 é a reaplicação da melhoria adicional do #23 sobre a main atual.
- Framer está fechado: 213 URLs únicas, 179 importadas, 34 duplicadas/ignoradas, 0 falhas; 233 Markdown finais (232 notícias + 1 opinião); sitemap 241 URLs; workflow temporário removido.
- Não existe atualmente branch/PR de LCP no GitHub. Qualquer trabalho LCP referido pelas conversas anteriores não deve ser assumido como alteração aplicada a main sem commit/branch verificável.
- O estado real do GitHub prevalece sobre estados antigos descritos no manual, conversas ou memória.
- Depois de workflows que escrevem conteúdo, verificar efetivamente índice e sitemap.

## 24. REBASE E FECHO OPERACIONAL DO STICKY — 2026-09-24

- PR #23 foi fechada sem merge porque a sua branch estava 75 commits atrás de main, depois dos avanços do arquivo Framer.
- Foi criada `mobile-sticky-editorial-rebased` diretamente a partir da main atual.
- Foram reaplicadas apenas as versões de `noticia.html` e `style.css` do #23.
- Validação estática: 7 blocos `<script>` de `noticia.html` passaram compilação sintática; chaves de `style.css` balanceadas.
- PR #24 foi criada sobre main atual e recebeu 8 commits, 2 ficheiros alterados.
- Validação externa final: 390 e 320 px sem overflow/sobreposição, cartões verticais com imagem 16:9, títulos completos e relacionados acessíveis; 768 e 1280 px sem regressões visíveis.
- Consola permaneceu inconclusiva por limitação do browser incorporado; não houve alteração de código nessa ronda.
- PR #24 foi mergeada em `d1ac249d0cd5fee66e25d7162a97872dc82e28e3`.
- main recebeu posteriormente o commit `9b8ed5e0a05aebeebab110aabc5ea919e8d5a8f1` para atualizar este manual.
- A validação pós-merge de produção permanece obrigatória antes de iniciar a Fase 6.

## 25. FORMATO DE PROMPTS E TEXTO PARA COPIAR — 2026-09-24

Quando o assistente enviar à utilizadora qualquer conteúdo cuja finalidade seja copiar integralmente para outra ferramenta, conversa, terminal, Codex, GitHub, Cloudflare ou outro executor, deve usar obrigatoriamente um bloco de código com linguagem apropriada (por exemplo, `text`, `bash` ou `powershell`) para disponibilizar o botão de copiar.

- Prompts para Codex: sempre em bloco de código.
- Comandos de terminal: sempre em bloco de código.
- Textos longos/instruções que a utilizadora precise copiar integralmente: sempre em bloco de código.
- Não colocar instruções copiáveis importantes apenas em texto corrido.
- Esta regra é de formato de entrega e não substitui as regras de conteúdo/execução do restante manual.

## 26. REGRAS PERMANENTES — SUPABASE, FREE E LEITURA OBRIGATÓRIA — 2026-09-24

- Supabase foi criado pela utilizadora e está conectado a este ChatGPT.
- Supabase NÃO está atualmente conectado ao GitHub + Cloudflare.
- O Assistente pode utilizar a ligação Supabase quando houver benefício concreto para o CPC, mas deve verificar documentação e estado atual antes de implementar.
- O projeto CPC usa exclusivamente recursos gratuitos.
- Qualquer solução que exija pagamento, upgrade, créditos pagos ou custo obrigatório deve ser descartada, mesmo que tecnicamente seja uma boa solução. Procurar alternativa gratuita quando razoável.
- Não fazer qualquer ação que possa iniciar cobrança sem decisão explícita da utilizadora e, como regra de projeto, evitar soluções pagas por completo.
- Quando Supabase for utilizado, validar alterações com teste real e aplicar as regras de segurança/RLS do Supabase.
- Antes de TODA e QUALQUER resposta ou ação neste projeto, sem exceção, o Assistente deve ler/consultar .github/AI_PROJECT_RULES.md e cumprir integralmente as regras vigentes.
- A leitura das rules é obrigatória mesmo quando o Assistente já conhece o contexto ou considera a resposta trivial.
- Esta regra existe para impedir regressões de processo, incluindo parar quando ainda existe uma ação autónoma possível, esquecer o limite Free, esquecer o formato de prompts copiáveis ou ignorar decisões de arquitetura já registadas.
- O Assistente deve tratar o conteúdo mais recente deste ficheiro como fonte de verdade e, se detectar conflito com memória/conversas antigas, seguir o estado real do GitHub e atualizar as rules quando necessário.


## 27. BÍBLIA MESTRA DE CONTINUIDADE — 2026-09-24

- Foi criada a Bíblia Mestra consolidada:
  `bíblia mestra Chuta Pra Canto.md`
- Este ficheiro reúne e organiza as duas bíblias anteriores e o handoff técnico de performance, preservando os textos originais no próprio documento como arquivo integral.
- Para continuidade entre IAs, a ordem recomendada é:
  1. ler este `AI_PROJECT_RULES.md`;
  2. ler `bíblia mestra Chuta Pra Canto.md`;
  3. verificar o estado real do GitHub/produção;
  4. consultar `bíblia primeira conversa.md`, `bíblia segunda conversa.md` e `.github/AI_HANDOFF_2026-09-24.md` apenas quando for necessário recuperar detalhe histórico ou técnico.
- As bíblias anteriores são arquivo histórico, não fontes concorrentes de estado atual.
- Em caso de conflito, o GitHub atual e estas Rules prevalecem sobre qualquer Bíblia/handoff.
- A Bíblia Mestra deve ser atualizada quando houver alteração relevante de estado, prioridade, arquitetura, decisão ou continuidade.
- Não apagar as duas bíblias originais nem o handoff apenas por terem sido consolidados.

## 28. ESTADO ATUAL CORRIGIDO APÓS CONSOLIDAÇÃO — 2026-09-24

- O estado real de `main` foi consultado diretamente e está atualmente em:
  `c6bee91789b98fba07ad88d8f013b42e5e2f8b5e`
- A main avançou depois das bíblias/handoff, incluindo commits de conteúdo e atualização do índice. Portanto, documentos históricos não devem ser tratados como fotografia atual do HEAD.
- A PR #25 `perf-lcp-first-pass` está **ABERTA e NÃO MERGEADA**.
- PR #25:
  - head: `5e1ec62ed59c98394956b0cc6010eed4969f273c`;
  - base original: `1b78f71fc2b15d8766def78df0b89ea9d05e6f21`;
  - state: open;
  - merged: false;
  - mergeable: false no estado consultado;
  - 15 commits;
  - 12 ficheiros alterados.
- Como a main avançou depois da criação da PR #25, não assumir que a branch está atualizada nem fazer merge sem primeiro verificar/reconciliar a divergência.
- O shell inicial de artigo foi comprovado em HTML RAW e não existe duplicação após JavaScript.
- O problema técnico ainda aberto é o diagnóstico do CLS `0,571` observado num artigo desktop e a anomalia da medição Lighthouse/PSI da Opinião.
- Não fazer merge da #25 até existir diagnóstico suficientemente sólido e validação correspondente.
- O último diagnóstico externo pediu Chrome Performance trace para identificar timestamp/elemento/causa do layout shift e investigar `--article-progress`; nenhuma alteração de código foi feita nessa ronda.
- A importação histórica Framer permanece fechada: 213 URLs, 179 importadas, 34 duplicadas/ignoradas, 0 falhas, 233 Markdown finais, índice 233 e sitemap 241 no último estado validado.
- Depois de qualquer workflow que escreva conteúdo, verificar efetivamente o índice e o sitemap.

## 29. REGRA DE LEITURA OBRIGATÓRIA — 2026-09-24

- Antes de toda e qualquer resposta ou ação neste projeto, consultar as Rules e cumprir o estado mais recente registado.
- Quando esta secção e uma secção histórica entrarem em conflito, esta secção mais recente prevalece, juntamente com o estado real do GitHub.


FIM.

## REGRA PERMANENTE — CODEX APENAS QUANDO EXPRESSAMENTE ESSENCIAL — 2026-09-25

- O Codex deve ser usado **apenas quando a capacidade necessária estiver realmente indisponível ao Assistente** e a tarefa for essencial para desbloquear ou validar o trabalho.
- Não usar Codex para "bater no seguimento", repetir verificações já concluídas, confirmar novamente factos já comprovados, obter uma segunda confirmação sem nova hipótese, ou satisfazer uma preferência por validação adicional.
- Antes de preparar qualquer prompt, o Assistente deve perguntar internamente: **"Consigo fazer isto diretamente? Já temos evidência suficiente? Esta execução pode alterar a decisão?"** Se a resposta for "sim, consigo", "sim, já temos evidência suficiente" ou "não altera a decisão", não usar Codex.
- Uma tarefa externa que falhe, seja bloqueada ou termine sem resultado não justifica novas tentativas automáticas. Só repetir se surgir uma necessidade concreta nova que exija realmente a capacidade externa.
- O objetivo é **uso mínimo e essencial de créditos**, não validação redundante.
