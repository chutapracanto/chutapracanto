export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Apenas intercepta pedidos para a página de notícias
    if (url.pathname.endsWith('/noticia.html') || url.pathname.endsWith('/noticia')) {
      const slug = url.searchParams.get('slug');

      if (slug) {
        try {
          // Busca o ficheiro Markdown correspondente diretamente no site
          const mdUrl = `${url.origin}/content/noticias/${slug}.md`;
          const mdRes = await fetch(mdUrl);

          if (mdRes.ok) {
            const mdText = await mdRes.text();
            
            // Extrai o frontmatter básico (título, descrição, imagem) do Markdown
            const parts = mdText.split("---");
            if (parts.length >= 3) {
              const frontmatterLines = parts[1].split('\n');
              let title = "ChutaPraCanto";
              let desc = "Notícias e opinião sobre futebol.";
              let image = `${url.origin}/images/logo.png`;

              frontmatterLines.forEach(line => {
                const [key, ...valParts] = line.split(':');
                if (!key || valParts.length === 0) return;
                const val = valParts.join(':').trim().replace(/^['"](.*)['"]$/, '$1');

                if (key.trim() === 'title') title = val;
                if (['subtitle', 'subtitulo', 'descricao', 'resumo'].includes(key.trim())) desc = val;
                if (['image', 'imagem', 'featured_image', 'featuredImage'].includes(key.trim())) {
                  image = val.startsWith('http') ? val : `${url.origin}${val.startsWith('/') ? '' : '/'}${val}`;
                }
              });

              // Busca a página noticia.html original
              const htmlRes = await env.ASSETS.fetch(request);
              let html = await htmlRes.text();

              // Substitui os meta tags padrão pelos dados reais da notícia
              html = html.replace('<meta property="og:title" id="meta-title" content="ChutaPraCanto" />', `<meta property="og:title" content="${title} | ChutaPraCanto" />`);
              html = html.replace('<meta property="og:description" id="meta-desc" content="Notícias e opinião sobre futebol." />', `<meta property="og:description" content="${desc}" />`);
              html = html.replace('<meta property="og:image" id="meta-image" content="https://chutapracanto.pages.dev/images/logo.png" />', `<meta property="og:image" content="${image}" />`);
              html = html.replace('<title id="page-title">ChutaPraCanto | Notícia</title>', `<title>${title} | ChutaPraCanto</title>`);

              return new Response(html, {
                headers: { 'Content-Type': 'text/html;charset=UTF-8' }
              });
            }
          }
        } catch (e) {
          // Se falhar algo, continua e serve a página normal
        }
      }
    }

    // Para qualquer outra página, serve normalmente sem alterações
    return env.ASSETS.fetch(request);
  }
};
