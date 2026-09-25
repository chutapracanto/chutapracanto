const SESSION_MAX_AGE = 8 * 60 * 60;

const GITHUB_API = "https://api.github.com";
const GITHUB_OWNER = "chutapracanto";
const GITHUB_REPO = "chutapracanto";
const GITHUB_BRANCH = "main";

function obterBranchGithub(env) {
  return env.CF_PAGES_BRANCH || GITHUB_BRANCH;
}

function normalizarNomeEditorial(nome) {
  return String(nome || "").replace(/\s+/g, "").toLowerCase();
}

function autorEditorialEhOrganizacao(nome) {
  return normalizarNomeEditorial(nome) === "chutapracanto";
}


const SESSION_COOKIE_NAME = "cpc_session";


// ============================================================
// RESPOSTAS
// ============================================================

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...extraHeaders
    }
  });
}


// ============================================================
// COOKIES
// ============================================================

function getCookie(request, name) {
  const cookieHeader = request.headers.get("Cookie") || "";

  const cookies = cookieHeader.split(";");

  for (const cookie of cookies) {
    const [key, ...valueParts] = cookie.trim().split("=");

    if (key === name) {
      try {
        return decodeURIComponent(valueParts.join("="));
      } catch {
        return valueParts.join("=");
      }
    }
  }

  return null;
}


// ============================================================
// BASE64 URL
// ============================================================

function base64UrlEncode(bytes) {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(value) {
  const padded = value
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=");

  const binary = atob(padded);

  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}


// ============================================================
// AUTENTICAÇÃO
// ============================================================

async function getSigningKey(password) {
  const encoder = new TextEncoder();

  return crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    {
      name: "HMAC",
      hash: "SHA-256"
    },
    false,
    ["sign", "verify"]
  );
}

async function createSession(password) {
  const timestamp = Math.floor(Date.now() / 1000);

  const payload = `${timestamp}`;

  const key = await getSigningKey(password);

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );

  return `${payload}.${base64UrlEncode(new Uint8Array(signature))}`;
}

async function verifySession(request, password) {
  const session = getCookie(
    request,
    SESSION_COOKIE_NAME
  );

  if (!session) {
    return false;
  }

  const parts = session.split(".");

  if (parts.length !== 2) {
    return false;
  }

  const timestamp = Number(parts[0]);
  const signature = parts[1];

  if (!Number.isFinite(timestamp) || !signature) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);

  if (
    now - timestamp < 0 ||
    now - timestamp > SESSION_MAX_AGE
  ) {
    return false;
  }

  try {
    const key = await getSigningKey(password);

    return await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlDecode(signature),
      new TextEncoder().encode(parts[0])
    );
  } catch {
    return false;
  }
}

function sessionCookie(value) {
  return [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Strict",
    `Max-Age=${SESSION_MAX_AGE}`
  ].join("; ");
}

function clearSessionCookie() {
  return [
    `${SESSION_COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Strict",
    "Max-Age=0",
    "Expires=Thu, 01 Jan 1970 00:00:00 GMT"
  ].join("; ");
}

async function requireAuth(request, env) {
  if (!env.ADMIN_PASSWORD) {
    return json(
      {
        error: "ADMIN_PASSWORD não está configurada no Cloudflare.",
        message: "ADMIN_PASSWORD não está configurada no Cloudflare."
      },
      500
    );
  }

  const authenticated = await verifySession(
    request,
    env.ADMIN_PASSWORD
  );

  if (!authenticated) {
    return json(
      {
        error: "Não autenticado.",
        message: "Não autenticado."
      },
      401
    );
  }

  return null;
}


// ============================================================
// GITHUB
// ============================================================

async function githubRequest(env, path, options = {}) {
  const token = env.GITHUB_TOKEN;

  if (!token) {
    throw new Error(
      "GITHUB_TOKEN não está configurado no Cloudflare."
    );
  }

  const headers = {
    "Authorization": `Bearer ${token}`,
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "ChutaPraCanto",
    ...options.headers
  };

  return fetch(`${GITHUB_API}${path}`, {
    ...options,
    headers
  });
}


// ============================================================
// SEGURANÇA DOS CAMINHOS
// ============================================================

function isAllowedNewsPath(path) {
  if (
    typeof path !== "string" ||
    !path ||
    path.includes("..") ||
    path.includes("\\") ||
    path.startsWith("/")
  ) {
    return false;
  }

  return /^content\/(?:noticias|opiniao)\/[^/]+\.md$/i.test(path);
}

function isAllowedImageUploadPath(path) {
  return typeof path === "string" &&
    /^images\/uploads\/[A-Za-z0-9][A-Za-z0-9._-]{0,119}\.(?:jpe?g|png|webp)$/i.test(path) &&
    !path.includes("..");
}

const MAX_IMAGE_UPLOAD_BYTES = 5 * 1024 * 1024;
const MAX_IMAGE_REQUEST_BYTES = 7 * 1024 * 1024;

async function lerCorpoLimitado(request, maxBytes) {
  const declaredLength = Number(request.headers.get("Content-Length") || 0);
  if (declaredLength > maxBytes) throw new Error("Ficheiro demasiado grande. O limite é 5 MiB.");
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw new Error("Ficheiro demasiado grande. O limite é 5 MiB.");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

function validarImagemUpload(content, path) {
  if (typeof content !== "string" || !content || content.length > Math.ceil(MAX_IMAGE_UPLOAD_BYTES / 3) * 4 + 4 || !/^[A-Za-z0-9+/]+={0,2}$/.test(content) || content.length % 4 === 1) {
    return false;
  }
  let binary;
  try { binary = atob(content); } catch { return false; }
  if (!binary.length || binary.length > MAX_IMAGE_UPLOAD_BYTES) return false;
  const isJpeg = binary.length >= 4 &&
    binary.charCodeAt(0) === 0xff &&
    binary.charCodeAt(1) === 0xd8 &&
    binary.charCodeAt(2) === 0xff &&
    binary.charCodeAt(binary.length - 2) === 0xff &&
    binary.charCodeAt(binary.length - 1) === 0xd9;
  const isPng = binary.length >= 24 &&
    binary.slice(0, 8) === "\x89PNG\r\n\x1a\n" &&
    binary.slice(12, 16) === "IHDR" &&
    binary.slice(-8) === "\x00\x00\x00\x00IEND\xae\x42\x60\x82";
  const isWebp = binary.length >= 20 &&
    binary.slice(0, 4) === "RIFF" &&
    binary.slice(8, 12) === "WEBP" &&
    new DataView(Uint8Array.from(binary, character => character.charCodeAt(0)).buffer).getUint32(4, true) === binary.length - 8;
  const ext = path.split(".").pop().toLowerCase();
  return (ext === "jpg" || ext === "jpeg") ? isJpeg : ext === "png" ? isPng : ext === "webp" ? isWebp : false;
}

function isAllowedImagePath(path) {
  if (
    typeof path !== "string" ||
    !path ||
    path.includes("..") ||
    path.includes("\\") ||
    path.startsWith("/")
  ) {
    return false;
  }

  return /^images\/uploads\/[^/]+$/i.test(path);
}


// ============================================================
// LEITURA DE BASE64 DO GITHUB
// ============================================================

function decodeGithubBase64(content) {
  if (typeof content !== "string") {
    return "";
  }

  try {
    const cleanBase64 = content.replace(/\s/g, "");

    const binary = atob(cleanBase64);

    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return new TextDecoder("utf-8").decode(bytes);
  } catch {
    return "";
  }
}


// ============================================================
// EXTRAIR CAMPOS DO FRONTMATTER
// ============================================================

function extrairCampoFrontmatter(markdown, campo) {
  if (
    typeof markdown !== "string" ||
    !markdown.trim()
  ) {
    return "";
  }

  const texto = markdown.replace(/^\uFEFF/, "");

  if (!texto.startsWith("---")) {
    return "";
  }

  const matchFrontmatter = texto.match(
    /^---\s*\r?\n([\s\S]*?)\r?\n---(?:\s*\r?\n|$)/
  );

  if (!matchFrontmatter) {
    return "";
  }

  const frontmatter = matchFrontmatter[1];

  const regex = new RegExp(
    "^\\s*" +
      campo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
      "\\s*:\\s*(.*?)\\s*$",
    "mi"
  );

  const match = frontmatter.match(regex);

  if (!match) {
    return "";
  }

  let valor = match[1].trim();

  if (
    (valor.startsWith('"') && valor.endsWith('"')) ||
    (valor.startsWith("'") && valor.endsWith("'"))
  ) {
    valor = valor.slice(1, -1);
  }

  return valor.trim();
}


// ============================================================
// OBTER DATA DA NOTÍCIA
// ============================================================

function extrairDataNoticia(markdown) {
  const campos = [
    "dataNoticia",
    "date",
    "published",
    "data"
  ];

  for (const campo of campos) {
    const valor = extrairCampoFrontmatter(
      markdown,
      campo
    );

    if (valor) {
      return valor;
    }
  }

  return "";
}


// ============================================================
// ENRIQUECER LISTA DE NOTÍCIAS
// ============================================================

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
          dataNoticia: "",
          image: ""
        };
      }

      try {
        const githubResponse = await githubRequest(
          env,
          `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${noticia.path}?ref=${encodeURIComponent(obterBranchGithub(env))}`,
          {
            method: "GET"
          }
        );

        if (!githubResponse.ok) {
          return {
            ...noticia,
            dataNoticia: "",
            image: ""
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
          dataNoticia: "",
          image: ""
        };
      }
    })
  );

  return resultados;
}


// ============================================================
// DADOS PARA PARTILHA SOCIAL
// ============================================================

function escaparHtml(valor) {
  return String(valor || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function construirUrlImagem(imagem, origin) {
  if (!imagem || typeof imagem !== "string") return "https://chutapracanto.com/images/logo.png";
  try {
    const url = new URL(imagem, origin);
    if ((url.protocol !== "https:" && url.origin !== origin) || url.username || url.password) {
      return "https://chutapracanto.com/images/logo.png";
    }
    return url.href;
  } catch {
    return "https://chutapracanto.com/images/logo.png";
  }
}

function obterSlugDaNoticia(url) {
  if (
    url.pathname !== "/noticia" &&
    url.pathname !== "/noticia.html"
  ) {
    return "";
  }

  const slug = url.searchParams.get("slug");

  if (
    !slug ||
    slug.includes("/") ||
    slug.includes("\\") ||
    slug.includes("..")
  ) {
    return "";
  }

  return slug.replace(/\.md$/i, "");
}

function construirUrlPublicaNoticia(origin, slug) {
  return (
    `${origin}/noticia?slug=` +
    encodeURIComponent(slug)
  );
}

async function prepararShellNoticiasInicial(request, env, response) {
  if (
    !response ||
    !response.ok ||
    !response.headers.get("Content-Type")?.includes("text/html")
  ) {
    return response;
  }

  const url = new URL(request.url);
  if (url.pathname !== "/noticias" && url.pathname !== "/noticias.html") {
    return response;
  }

  try {
    const indexResponse = await env.ASSETS.fetch(
      new Request(new URL("/content/noticias-index.json", request.url))
    );
    if (!indexResponse.ok) return response;

    const index = await indexResponse.json();
    if (!Array.isArray(index)) return response;

    const entry = index.find(item => (item?.type || "news") === "news" && item?.slug && item?.image);
    if (!entry) return response;

    const title = String(entry.title || "Sem título");
    const category = String(entry.category || "Geral");
    const subtitle = String(entry.subtitle || "");
    const image = construirUrlImagem(entry.image, url.origin);
    const href = "/noticia?slug=" + encodeURIComponent(String(entry.slug));

    const cardHtml = [
      '<a class="news-list-card" href="' + escaparHtml(href) + '">',
      '<div class="news-list-img">',
      '<img src="' + escaparHtml(image) + '" alt="' + escaparHtml(title) + '" loading="eager" fetchpriority="high" decoding="async">',
      '</div>',
      '<div class="news-list-content">',
      '<div class="news-list-meta"><span class="tag">' + escaparHtml(category.toUpperCase()) + '</span></div>',
      '<h3>' + escaparHtml(title) + '</h3>',
      subtitle ? '<p>' + escaparHtml(subtitle) + '</p>' : '',
      '</div>',
      '</a>'
    ].join("");

    const headers = new Headers(response.headers);
    headers.delete("Content-Length");
    headers.append(
      "Link",
      `<${image}>; rel="preload"; as="image"; fetchpriority="high"`
    );
    const htmlResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });

    return new HTMLRewriter()
      .on("#noticias-list", {
        element(element) {
          element.setInnerContent(cardHtml, { html: true });
        }
      })
      .transform(htmlResponse);
  } catch {
    return response;
  }
}

async function prepararShellArtigoInicial(request, env, response) {
  if (
    !response ||
    !response.ok ||
    !response.headers.get("Content-Type")?.includes("text/html")
  ) {
    return response;
  }

  const url = new URL(request.url);
  const slug = obterSlugDaNoticia(url);

  if (!slug) return response;

  try {
    const indexResponse = await env.ASSETS.fetch(
      new Request(new URL("/content/noticias-index.json", request.url))
    );
    if (!indexResponse.ok) return response;

    const index = await indexResponse.json();
    if (!Array.isArray(index)) return response;

    const entry =
      index.find(item => item?.slug === slug) ||
      index.find(item => String(item?.slug || "").toLowerCase() === slug.toLowerCase());
    if (!entry) return response;

    const title = String(entry.title || "Sem título");
    const category = String(entry.category || "Geral");
    const editorialLabel = entry.type === "opinion" ? "Opinião" : "Notícia";
    const subtitle = String(entry.subtitle || "");
    const image = entry.image
      ? construirUrlImagem(entry.image, url.origin)
      : "";

    const sectionLabel = entry.type === "opinion" ? "Opinião" : "Notícias";
    const sectionPath = entry.type === "opinion" ? "/opiniao" : "/noticias";
    const breadcrumbHtml = [
      '<nav class="article-breadcrumbs" aria-label="Breadcrumb">',
      '<ol>',
      '<li><a href="/">Home</a></li>',
      '<li><a href="' + sectionPath + '">' + escaparHtml(sectionLabel) + '</a></li>',
      '<li aria-current="page">' + escaparHtml(title) + '</li>',
      '</ol>',
      '</nav>'
    ].join("");

    const headerHtml = [
      breadcrumbHtml,
      '<header class="article-heading">',
      '<span class="tag">' + escaparHtml(category.toUpperCase()) + '</span>',
      '<span class="tag">' + escaparHtml(editorialLabel) + '</span>',
      '<h1>' + escaparHtml(title) + '</h1>',
      subtitle
        ? '<p class="article-summary">' + escaparHtml(subtitle) + '</p>'
        : "",
      entry.published || entry.author
        ? '<p class="article-byline">' + escaparHtml([
            entry.published
              ? "Publicado em " + new Date(entry.published).toLocaleDateString("pt-PT")
              : "",
            entry.author ? "Por " + entry.author : ""
          ].filter(Boolean).join(" · ")) + '</p>'
        : "",
      '</header>'
    ].join("");

    const imageHtml = image
      ? '<figure class="article-hero-image"><img src="' + escaparHtml(image) + '" alt="' + escaparHtml(title) + '" loading="eager" fetchpriority="high" decoding="async"></figure>'
      : "";

    const headers = new Headers(response.headers);
    headers.delete("Content-Length");
    const htmlResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });

    return new HTMLRewriter()
      .on("#article-content", {
        element(element) {
          element.setInnerContent(headerHtml + imageHtml, { html: true });
        }
      })
      .transform(htmlResponse);
  } catch {
    return response;
  }
}

function isSocialCrawler(request) {
  const userAgent =
    request.headers.get("User-Agent") || "";

  const ua = userAgent.toLowerCase();

  const crawlers = [
    "facebookexternalhit",
    "facebot",
    "whatsapp",
    "twitterbot",
    "linkedinbot",
    "slackbot",
    "discordbot",
    "telegrambot",
    "googlebot",
    "bingbot",
    "pinterest",
    "skypeuripreview",
    "google-inspectiontool"
  ];

  return crawlers.some(
    (crawler) => ua.includes(crawler)
  );
}

async function obterDadosPartilha(env, slug, origin) {
  if (!slug) {
    return null;
  }

  let path =
    `content/noticias/${slug}.md`;

  if (!isAllowedNewsPath(path)) {
    return null;
  }

  try {
    const headers = {
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "ChutaPraCanto"
    };

    if (env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
    }

    let githubResponse = await fetch(
      `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${encodeURIComponent(obterBranchGithub(env))}`,
      {
        method: "GET",
        headers
      }
    );

    if (!githubResponse.ok) {
      path = `content/opiniao/${slug}.md`;
      githubResponse = await fetch(
        `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${encodeURIComponent(obterBranchGithub(env))}`,
        {
          method: "GET",
          headers
        }
      );
    }

    if (!githubResponse.ok) {
      return null;
    }

    const data =
      await githubResponse.json();

    const markdown =
      decodeGithubBase64(
        data.content || ""
      );

    if (!markdown) {
      return null;
    }

    const editorialType = extrairCampoFrontmatter(markdown, "type") || "news";

    const title =
      extrairCampoFrontmatter(
        markdown,
        "title"
      ) || "ChutaPraCanto";

    const descricao =
      extrairCampoFrontmatter(
        markdown,
        "subtitle"
      ) ||
      extrairCampoFrontmatter(
        markdown,
        "subtitulo"
      ) ||
      extrairCampoFrontmatter(
        markdown,
        "descricao"
      ) ||
      extrairCampoFrontmatter(
        markdown,
        "resumo"
      ) ||
      "Notícias e opinião sobre futebol.";

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

    const imagemUrl =
      construirUrlImagem(
        imagem,
        origin
      );

    const noticiaUrl =
      construirUrlPublicaNoticia(
        origin,
        slug
      );

    const canonicalUrl =
      construirUrlPublicaNoticia(
        "https://chutapracanto.com",
        slug
      );

    return {
      title,
      editorialType,
      descricao,
      imagemUrl,
      noticiaUrl,
      canonicalUrl,
      datePublished:
        extrairCampoFrontmatter(markdown, "published") ||
        extrairCampoFrontmatter(markdown, "date") ||
        extrairCampoFrontmatter(markdown, "dataNoticia") ||
        extrairCampoFrontmatter(markdown, "data"),
      dateModified:
        extrairCampoFrontmatter(markdown, "dateModified") ||
        extrairCampoFrontmatter(markdown, "date_modified") ||
        extrairCampoFrontmatter(markdown, "modified"),
      author:
        extrairCampoFrontmatter(markdown, "author"),
      authorUrl:
        extrairCampoFrontmatter(markdown, "authorUrl") ||
        extrairCampoFrontmatter(markdown, "author_url")
    };

  } catch {
    return null;
  }
}


// ============================================================
// HTML PARA CRAWLERS SOCIAIS
// ============================================================

async function prepararPaginaParaPartilha(
  request,
  env,
  response
) {
  if (!isSocialCrawler(request)) {
    return response;
  }

  if (
    !response ||
    !response.ok ||
    !response.headers.get("Content-Type")?.includes("text/html")
  ) {
    return response;
  }

  const url =
    new URL(request.url);

  const slug =
    obterSlugDaNoticia(url);

  if (!slug) {
    return response;
  }

  const dados =
    await obterDadosPartilha(
      env,
      slug,
      url.origin
    );

  if (!dados) {
    return response;
  }

  const headers =
    new Headers(response.headers);

  headers.set(
    "Cache-Control",
    "no-cache, no-store, must-revalidate"
  );

  headers.delete("Content-Length");

  const htmlResponse =
    new Response(
      response.body,
      {
        status: response.status,
        statusText: response.statusText,
        headers
      }
    );

  const rewriter =
    new HTMLRewriter()

      // --------------------------------------------------------
      // TITLE
      // --------------------------------------------------------

      .on(
        "script#article-jsonld",
        {
          element(element) {
            const author = String(dados.author || "").trim();
            const authorData = author
              ? {
                  "@type": autorEditorialEhOrganizacao(author) ? "Organization" : "Person",
                  name: author
                }
              : null;
            if (authorData && dados.authorUrl) {
              try {
                const authorUrl = new URL(dados.authorUrl, "https://chutapracanto.com");
                if (authorUrl.protocol === "https:" && !authorUrl.username && !authorUrl.password) authorData.url = authorUrl.href;
              } catch {}
            }
            const schema = {
              "@context": "https://schema.org",
              "@type": dados.editorialType === "opinion" ? "Article" : "NewsArticle",
              headline: dados.title,
              description: dados.descricao || undefined,
              image: dados.imagemUrl,
              mainEntityOfPage: { "@type": "WebPage", "@id": dados.canonicalUrl },
              publisher: {
                "@type": "Organization",
                name: "Chuta Pra Canto",
                logo: { "@type": "ImageObject", url: "https://chutapracanto.com/images/logo.png" }
              }
            };
            if (authorData) schema.author = authorData;
            if (dados.datePublished && !Number.isNaN(Date.parse(dados.datePublished))) schema.datePublished = dados.datePublished;
            if (dados.dateModified && !Number.isNaN(Date.parse(dados.dateModified))) schema.dateModified = dados.dateModified;
            const breadcrumbs = {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://chutapracanto.com/" },
                { "@type": "ListItem", position: 2, name: dados.editorialType === "opinion" ? "Opinião" : "Notícias", item: dados.editorialType === "opinion" ? "https://chutapracanto.com/opiniao" : "https://chutapracanto.com/noticias" },
                { "@type": "ListItem", position: 3, name: dados.title, item: dados.canonicalUrl }
              ]
            };
            const jsonLd = JSON.stringify([schema, breadcrumbs])
              .replace(/</g, "\\u003c")
              .replace(/>/g, "\\u003e")
              .replace(/&/g, "\\u0026");
            element.setInnerContent(jsonLd);
          }
        }
      )

      .on(
        "link#canonical-url",
        {
          element(element) {
            element.setAttribute("href", dados.canonicalUrl);
          }
        }
      )

      .on(
        'meta#meta-published',
        {
          element(element) {
            if (dados.datePublished && !Number.isNaN(Date.parse(dados.datePublished))) element.setAttribute("content", dados.datePublished);
          }
        }
      )

      .on(
        'meta#meta-modified',
        {
          element(element) {
            if (dados.dateModified && !Number.isNaN(Date.parse(dados.dateModified))) element.setAttribute("content", dados.dateModified);
          }
        }
      )

      .on(
        "meta#meta-description",
        {
          element(element) {
            element.setAttribute("content", dados.descricao);
          }
        }
      )

      .on(
        "title",
        {
          text(text) {
            text.replace(
              `${dados.title} | ChutaPraCanto`
            );
          }
        }
      )

      // --------------------------------------------------------
      // OG TITLE
      // --------------------------------------------------------

      .on(
        'meta#meta-title',
        {
          element(element) {
            element.setAttribute(
              "content",
              dados.title
            );
          }
        }
      )

      // --------------------------------------------------------
      // OG DESCRIPTION
      // --------------------------------------------------------

      .on(
        'meta#meta-desc',
        {
          element(element) {
            element.setAttribute(
              "content",
              dados.descricao
            );
          }
        }
      )

      // --------------------------------------------------------
      // OG IMAGE
      // --------------------------------------------------------

      .on(
        'meta#meta-image',
        {
          element(element) {
            element.setAttribute(
              "content",
              dados.imagemUrl
            );
          }
        }
      )

      // --------------------------------------------------------
      // OG URL
      // --------------------------------------------------------

      .on(
        'meta#meta-url',
        {
          element(element) {
            element.setAttribute(
              "content",
              dados.noticiaUrl
            );
          }
        }
      )

      // --------------------------------------------------------
      // TWITTER TITLE
      // --------------------------------------------------------

      .on(
        'meta[name="twitter:title"]',
        {
          element(element) {
            element.setAttribute(
              "content",
              dados.title
            );
          }
        }
      )

      // --------------------------------------------------------
      // TWITTER DESCRIPTION
      // --------------------------------------------------------

      .on(
        'meta[name="twitter:description"]',
        {
          element(element) {
            element.setAttribute(
              "content",
              dados.descricao
            );
          }
        }
      )

      // --------------------------------------------------------
      // TWITTER IMAGE
      // --------------------------------------------------------

      .on(
        'meta[name="twitter:image"]',
        {
          element(element) {
            element.setAttribute(
              "content",
              dados.imagemUrl
            );
          }
        }
      )

      // --------------------------------------------------------
      // TWITTER URL
      // --------------------------------------------------------

      .on(
        'meta[name="twitter:url"]',
        {
          element(element) {
            element.setAttribute(
              "content",
              dados.noticiaUrl
            );
          }
        }
      );

  return rewriter.transform(
    htmlResponse
  );
}


// ============================================================
// API ADMIN
// ============================================================async function handleArticleLikeAPI(request, env) {
  const url = new URL(request.url);
  const noindexHeaders = { "X-Robots-Tag": "noindex, nofollow, noarchive" };
  const respond = (data, status = 200, headers = {}) =>
    json(data, status, { ...noindexHeaders, ...headers });

  if (request.method !== "POST") {
    return respond(
      { error: "Método não permitido.", message: "Método não permitido." },
      405,
      { Allow: "POST" }
    );
  }

  if (request.headers.get("Origin") !== url.origin) {
    return respond({ error: "Origem não permitida.", message: "Origem não permitida." }, 403);
  }

  if (!(request.headers.get("Content-Type") || "").toLowerCase().includes("application/json")) {
    return respond({ error: "Content-Type inválido.", message: "Content-Type inválido." }, 415);
  }

  let payload;
  try {
    payload = JSON.parse(await lerCorpoLimitado(request, 1024));
  } catch {
    return respond({ error: "Pedido inválido.", message: "Pedido inválido." }, 400);
  }

  const slug = typeof payload?.slug === "string" ? payload.slug.trim() : "";
  const visitorId = typeof payload?.visitorId === "string" ? payload.visitorId : "";
  const action = payload?.action;
  const uuidV4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug) || slug.length > 160) {
    return respond({ error: "Artigo inválido.", message: "Artigo inválido." }, 400);
  }
  if (!uuidV4.test(visitorId)) {
    return respond({ error: "Identificador inválido.", message: "Identificador inválido." }, 400);
  }
  if (action !== "status" && action !== "like") {
    return respond({ error: "Ação inválida.", message: "Ação inválida." }, 400);
  }
  if (!env.ARTICLE_LIKES_DB || !env.ASSETS) {
    return respond({ error: "Gosto temporariamente indisponível.", message: "Gosto temporariamente indisponível." }, 503);
  }

  try {
    const indexResponse = await env.ASSETS.fetch(
      new Request(new URL("/content/noticias-index.json", url.origin))
    );
    if (!indexResponse.ok) {
      return respond({ error: "Gosto temporariamente indisponível.", message: "Gosto temporariamente indisponível." }, 503);
    }

    const index = await indexResponse.json();
    const articleExists = Array.isArray(index) && index.some((entry) =>
      entry && entry.slug === slug &&
      (() => {
        const pathParts = String(entry.path || "").split("/");
        return pathParts.length === 3 && pathParts[0] === "content" &&
          (pathParts[1] === "noticias" || pathParts[1] === "opiniao") &&
          pathParts[2].endsWith(".md");
      })()
    );
    if (!articleExists) {
      return respond({ error: "Artigo não encontrado.", message: "Artigo não encontrado." }, 404);
    }

    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(visitorId)
    );
    const visitorHash = Array.from(new Uint8Array(digest), (byte) =>
      byte.toString(16).padStart(2, "0")
    ).join("");

    let created = false;
    if (action === "like") {
      const insert = await env.ARTICLE_LIKES_DB
        .prepare("INSERT INTO article_likes (article_slug, visitor_hash) VALUES (?, ?) ON CONFLICT(article_slug, visitor_hash) DO NOTHING")
        .bind(slug, visitorHash)
        .run();
      created = Number(insert?.meta?.changes || 0) > 0;
    }

    const current = await env.ARTICLE_LIKES_DB
      .prepare("SELECT COUNT(*) AS count, COALESCE(MAX(CASE WHEN visitor_hash = ? THEN 1 ELSE 0 END), 0) AS liked FROM article_likes WHERE article_slug = ?")
      .bind(visitorHash, slug)
      .first();

    return respond({
      ok: true,
      slug,
      liked: Number(current?.liked || 0) === 1,
      count: Number(current?.count || 0),
      created
    });
  } catch (error) {
    console.error("Article likes API error:", error);
    return respond({ error: "Gosto temporariamente indisponível.", message: "Gosto temporariamente indisponível." }, 503);
  }
}


async function handleAdminAPI(request, env) {
  const url = new URL(request.url);
  const pathname = url.pathname;


  // ----------------------------------------------------------
  // LOGIN
  // ----------------------------------------------------------

  if (pathname === "/api/admin/login") {
    if (request.method !== "POST") {
      return json(
        {
          error: "Método não permitido.",
          message: "Método não permitido."
        },
        405
      );
    }

    if (!env.ADMIN_PASSWORD) {
      return json(
        {
          error: "ADMIN_PASSWORD não está configurada.",
          message: "ADMIN_PASSWORD não está configurada."
        },
        500
      );
    }

    let body;

    try {
      body = await request.json();
    } catch {
      return json(
        {
          error: "Pedido inválido.",
          message: "Pedido inválido."
        },
        400
      );
    }

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    if (
      !password ||
      password !== env.ADMIN_PASSWORD
    ) {
      return json(
        {
          error: "Palavra-passe incorreta.",
          message: "Palavra-passe incorreta."
        },
        401
      );
    }

    const session =
      await createSession(env.ADMIN_PASSWORD);

    return json(
      {
        ok: true
      },
      200,
      {
        "Set-Cookie": sessionCookie(session)
      }
    );
  }


  // ----------------------------------------------------------
  // LOGOUT
  // ----------------------------------------------------------

  if (pathname === "/api/admin/logout") {
    if (request.method !== "POST") {
      return json(
        {
          error: "Método não permitido.",
          message: "Método não permitido."
        },
        405
      );
    }

    return json(
      {
        ok: true
      },
      200,
      {
        "Set-Cookie": clearSessionCookie()
      }
    );
  }


  // ----------------------------------------------------------
  // VERIFICAR SESSÃO
  // ----------------------------------------------------------

  if (pathname === "/api/admin/session") {
    if (request.method !== "GET") {
      return json(
        {
          error: "Método não permitido.",
          message: "Método não permitido."
        },
        405
      );
    }

    const authError =
      await requireAuth(request, env);

    if (authError) {
      return authError;
    }

    return json({
      authenticated: true
    });
  }


  // ----------------------------------------------------------
  // RESTANTES ROTAS ADMIN
  // ----------------------------------------------------------

  if (!pathname.startsWith("/api/admin/")) {
    return null;
  }

  const authError =
    await requireAuth(request, env);

  if (authError) {
    return authError;
  }


  // ----------------------------------------------------------
  // LISTAR NOTÍCIAS
  // ----------------------------------------------------------

  if (pathname === "/api/admin/news/list") {
    if (request.method !== "GET") {
      return json(
        {
          error: "Método não permitido.",
          message: "Método não permitido."
        },
        405
      );
    }

    const indexResponse =
      await env.ASSETS.fetch(
        new Request(
          new URL(
            "/content/noticias-index.json",
            request.url
          ),
          request
        )
      );

    if (!indexResponse.ok) {
      return json(
        {
          error: "Índice de notícias indisponível.",
          message: "O índice de notícias ainda não foi gerado."
        },
        503
      );
    }

    let data;

    try {
      data = await indexResponse.json();
    } catch {
      return json(
        {
          error: "Índice de notícias inválido.",
          message: "Não foi possível ler o índice de notícias."
        },
        500
      );
    }

    if (!Array.isArray(data)) {
      return json(
        {
          error: "Índice de notícias inválido.",
          message: "O índice de notícias não contém uma lista válida."
        },
        500
      );
    }

    const noticias = data.map(item => ({
      name:
        item.path
          ? item.path.split("/").pop()
          : "",
      path:
        item.path || "",
      slug:
        item.slug || "",
      type:
        item.type || "news",
      title:
        item.title || "Sem título",
      subtitle:
        item.subtitle || "",
      category:
        item.category || "Geral",
      published:
        item.published || "",
      image:
        item.image || "",
      dataNoticia:
        item.published || "",
      sha:
        null
    }));

    return json(
      noticias,
      200,
      {
        "Cache-Control": "no-store"
      }
    );
  }

  // ----------------------------------------------------------
  // NOTÍCIAS: LER / EDITAR / APAGAR
  // ----------------------------------------------------------

  if (pathname === "/api/admin/news") {
    const path =
      url.searchParams.get("path");

    if (!isAllowedNewsPath(path)) {
      return json(
        {
          error: "Caminho de conteúdo não permitido.",
          message: "Caminho de conteúdo não permitido."
        },
        400
      );
    }

    if (
      !["GET", "PUT", "DELETE"].includes(
        request.method
      )
    ) {
      return json(
        {
          error: "Método não permitido.",
          message: "Método não permitido."
        },
        405
      );
    }

    const githubPath =
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;


    // GET
    if (request.method === "GET") {
      const githubResponse =
        await githubRequest(
          env,
          `${githubPath}?ref=${encodeURIComponent(obterBranchGithub(env))}`,
          {
            method: "GET"
          }
        );

      const responseText =
        await githubResponse.text();

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        data = {
          error:
            responseText ||
            "Resposta inválida do GitHub."
        };
      }

      return json(
        data,
        githubResponse.status
      );
    }


    // PUT / DELETE
    let body;

    try {
      const payload =
        JSON.parse(await request.text());

      if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
        return json(
          {
            error: "Corpo inválido.",
            message: "Corpo inválido."
          },
          400
        );
      }

      payload.branch =
        obterBranchGithub(env);

      body =
        JSON.stringify(payload);

    } catch {
      return json(
        {
          error: "Corpo JSON inválido.",
          message: "Corpo JSON inválido."
        },
        400
      );
    }

    const githubResponse =
      await githubRequest(
        env,
        githubPath,
        {
          method: request.method,
          headers: {
            "Content-Type":
              "application/json"
          },
          body
        }
      );

    const responseText =
      await githubResponse.text();

    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      data = {
        error:
          responseText ||
          "Resposta inválida do GitHub."
      };
    }

    return json(
      data,
      githubResponse.status
    );
  }


  // ----------------------------------------------------------
  // IMAGENS: LER / ENVIAR / APAGAR
  // ----------------------------------------------------------

  if (pathname === "/api/admin/image") {
    const path =
      url.searchParams.get("path");

    if (!isAllowedImagePath(path)) {
      return json(
        {
          error: "Caminho de imagem não permitido.",
          message: "Caminho de imagem não permitido."
        },
        400
      );
    }

    if (request.method === "PUT" && !isAllowedImageUploadPath(path)) {
      return json(
        { error: "Tipo de imagem ou nome de ficheiro não permitido.", message: "Use JPEG, PNG ou WebP com um nome de ficheiro simples." },
        415
      );
    }

    if (
      !["GET", "PUT", "DELETE"].includes(
        request.method
      )
    ) {
      return json(
        {
          error: "Método não permitido.",
          message: "Método não permitido."
        },
        405
      );
    }

    const githubPath =
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;


    // GET
    if (request.method === "GET") {
      const githubResponse =
        await githubRequest(
          env,
          `${githubPath}?ref=${encodeURIComponent(obterBranchGithub(env))}`,
          {
            method: "GET"
          }
        );

      const responseText =
        await githubResponse.text();

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        data = {
          error:
            responseText ||
            "Resposta inválida do GitHub."
        };
      }

      return json(
        data,
        githubResponse.status
      );
    }


    // PUT / DELETE
    let body;

    let requestText;
    try {
      requestText = request.method === "PUT"
        ? await lerCorpoLimitado(request, MAX_IMAGE_REQUEST_BYTES)
        : await request.text();
    } catch (error) {
      return json(
        { error: "Ficheiro demasiado grande.", message: "O limite de upload é 5 MiB." },
        413
      );
    }

    try {
      const payload = JSON.parse(requestText);

      if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
        return json(
          {
            error: "Corpo inválido.",
            message: "Corpo inválido."
          },
          400
        );
      }

      if (request.method === "PUT" && !validarImagemUpload(payload.content, path)) {
        return json(
          { error: "Conteúdo de imagem inválido.", message: "O conteúdo não corresponde a um JPEG, PNG ou WebP válido, ou excede 5 MiB." },
          415
        );
      }

      payload.branch =
        obterBranchGithub(env);

      body =
        JSON.stringify(payload);

    } catch {
      return json(
        {
          error: "Corpo JSON inválido.",
          message: "Corpo JSON inválido."
        },
        400
      );
    }

    const githubResponse =
      await githubRequest(
        env,
        githubPath,
        {
          method: request.method,
          headers: {
            "Content-Type":
              "application/json"
          },
          body
        }
      );

    const responseText =
      await githubResponse.text();

    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      data = {
        error:
          responseText ||
          "Resposta inválida do GitHub."
      };
    }

    return json(
      data,
      githubResponse.status
    );
  }


  // ----------------------------------------------------------
  // ENDPOINT DESCONHECIDO
  // ----------------------------------------------------------

  return json(
    {
      error: "Endpoint não encontrado.",
      message: "Endpoint não encontrado."
    },
    404
  );
}


// ============================================================
// WORKER PRINCIPAL
// ============================================================

export default {
  async fetch(request, env) {
    const url =
      new URL(request.url);

    try {
      if (
        url.pathname === "/api/article-like") {
        return handleArticleLikeAPI(request, env);
      }

      if (url.pathname.startsWith(
          "/api/admin/"
        )
      ) {
        const response =
          await handleAdminAPI(
            request,
            env
          );

        if (response) {
          const headers = new Headers(response.headers);
          headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
          return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
        }
      }

      const assetResponse =
        await env.ASSETS.fetch(request);

      const responseNoticiasInicial =
        await prepararShellNoticiasInicial(
          request,
          env,
          assetResponse
        );

      const responseInicial =
        await prepararShellArtigoInicial(
          request,
          env,
          responseNoticiasInicial
        );

      const responseComPartilha =
        await prepararPaginaParaPartilha(
          request,
          env,
          responseInicial
        );

      return responseComPartilha;

    } catch (error) {
      console.error(
        "Worker error:",
        error
      );

      return json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Erro interno do Worker.",
          message:
            error instanceof Error
              ? error.message
              : "Erro interno do Worker."
        },
        500
      );
    }
  }
};
