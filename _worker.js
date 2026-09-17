```js
async function enriquecerNoticias(env, noticias) {
  if (!Array.isArray(noticias)) {
    return noticias;
  }

  const resultados = await Promise.all(
    noticias.map(async (noticia) => {
      if (
        !noticia ||
        typeof noticia.path !== "string" ||
        !isAllowedNewsPath(noticia.path)
      ) {
        return {
          ...noticia,
          dataNoticia: ""
        };
      }

      try {
        const githubResponse = await githubRequest(
          env,
          `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${noticia.path}?ref=${encodeURIComponent(GITHUB_BRANCH)}`,
          {
            method: "GET"
          }
        );

        if (!githubResponse.ok) {
          return {
            ...noticia,
            dataNoticia: ""
          };
        }

        const data = await githubResponse.json();

        const markdown = decodeGithubBase64(
          data.content || ""
        );

        const dataNoticia =
          extrairDataNoticia(markdown);

        const imagem =
          extrairCampoFrontmatter(
            markdown,
            "image"
          ) ||
          extrairCampoFrontmatter(
            markdown,
            "imagem"
          ) ||
          extrairCampoFrontmatter(
            markdown,
            "featured_image"
          ) ||
          extrairCampoFrontmatter(
            markdown,
            "featuredImage"
          );

        return {
          ...noticia,
          dataNoticia,
          image: imagem
        };
      } catch {
        return {
          ...noticia,
          dataNoticia: ""
        };
      }
    })
  );

  return resultados;
}
```
