export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Se for a página de notícias com slug, tentamos injetar os meta tags no HTML
    if ((url.pathname.endsWith('/noticia.html') || url.pathname.endsWith('/noticia')) && url.searchParams.get('slug')) {
      const slug = url.searchParams.get('slug');

      try {
        // Pede o ficheiro Markdown usando o sistema de assets do Cloudflare
        const mdRequest = new Request(`${url.origin}/content/noticias/${slug}.md`, request);
        const mdRes = await env.ASSETS.fetch(mdRequest);

        if (mdRes.ok) {
          const mdText = await mdRes.text();
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

            // Busca a página HTML original
            const htmlRes = await env.ASSETS.fetch(request);
            let html = await htmlRes.text();

            // Injeta os meta tags corretos para as redes sociais
            html = html.replace(/<meta property="og:title"[^>]*>/i, `<meta property="og:title" content="${title} | ChutaPraCanto" />`);
            html = html.replace(/<meta property="og:description"[^>]*>/i, `<meta property="og:description" content="${desc}" />`);
            html = html.replace(/<meta property="og:image"[^>]*>/i, `<meta property="og:image" content="${image}" />`);
            html = html.replace(/<title[^>]*>.*?<\/title>/i, `<title>${title} | ChutaPraCanto</title>`);

            return new Response(html, {
              headers: { 'Content-Type': 'text/html;charset=UTF-8' }
            });
          }
        }
      } catch (e) {
        // Se houver qualquer falha, prossegue e entrega a página normal
      }
    }

    // Comportamento normal para o resto do site
    return env.ASSETS.fetch(request);
  }
};
