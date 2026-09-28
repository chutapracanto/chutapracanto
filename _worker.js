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
// ============================================================
async function handleArticleLikeAPI(request, env) {
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

  if (
    !slug ||
    slug.length > 160 ||
    /[\\/\u0000-\u001f\u007f]/u.test(slug)
  ) {
    return respond({ error: "Artigo inválido.", message: "Artigo inválido." }, 400);
  }
  if (!uuidV4.test(visitorId)) {
    return respond({ error: "Identificador inválido.", message: "Identificador inválido." }, 400);
  }
  if (action !== "status" && action !== "like" && action !== "unlike") {
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
    let removed = false;
    if (action === "like") {
      const insert = await env.ARTICLE_LIKES_DB
        .prepare("INSERT INTO article_likes (article_slug, visitor_hash) VALUES (?, ?) ON CONFLICT(article_slug, visitor_hash) DO NOTHING")
        .bind(slug, visitorHash)
        .run();
      created = Number(insert?.meta?.changes || 0) > 0;
    } else if (action === "unlike") {
      const removal = await env.ARTICLE_LIKES_DB
        .prepare("DELETE FROM article_likes WHERE article_slug = ? AND visitor_hash = ?")
        .bind(slug, visitorHash)
        .run();
      removed = Number(removal?.meta?.changes || 0) > 0;
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
      created,
      removed
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
  // DIAGNÓSTICO TEMPORÁRIO API-FOOTBALL
  // ----------------------------------------------------------

  if (pathname === "/api/admin/football-provider-diagnostic") {
    if (
      env.CF_PAGES_BRANCH !== "main" ||
      !["chutapracanto.com", "chutapracanto.pages.dev"].includes(url.hostname)
    ) {
      return json(
        { error: "Endpoint não encontrado." },
        404
      );
    }

    if (request.method !== "POST") {
      return json(
        { error: "Método não permitido." },
        405,
        { Allow: "POST" }
      );
    }

    const authError = await requireAuth(request, env);
    if (authError) {
      return authError;
    }

    if (request.headers.get("Origin") !== url.origin) {
      return json(
        { error: "Origem não permitida." },
        403
      );
    }

    const apiKey = env.API_FOOTBALL_KEY;
    if (typeof apiKey !== "string" || !apiKey.trim()) {
      return json(
        { error: "Secret API-Football indisponível em Production." },
        503
      );
    }

    let providerResponse;
    let providerData = null;
    try {
      providerResponse = await fetch(
        "https://v3.football.api-sports.io/status",
        {
          method: "GET",
          headers: { "x-apisports-key": apiKey.trim() },
          signal: AbortSignal.timeout(10000)
        }
      );
      providerData = await providerResponse.json();
    } catch {
      return json(
        { error: "Não foi possível obter a resposta do API-Football." },
        502
      );
    }

    const rawErrors = providerData?.errors;
    const errorItems = Array.isArray(rawErrors)
      ? rawErrors
      : rawErrors && typeof rawErrors === "object"
        ? Object.keys(rawErrors)
        : rawErrors
          ? [rawErrors]
          : [];
    const errorCategories = new Set();
    for (const item of errorItems) {
      const label = String(item).toLowerCase();
      if (/token|key|auth/.test(label)) {
        errorCategories.add("authentication");
      } else if (/rate|request|limit|quota/.test(label)) {
        errorCategories.add("quota");
      } else if (/plan|subscription/.test(label)) {
        errorCategories.add("subscription");
      } else {
        errorCategories.add("provider");
      }
    }

    const validPayload =
      providerData !== null &&
      typeof providerData === "object" &&
      Object.prototype.hasOwnProperty.call(providerData, "errors") &&
      Object.prototype.hasOwnProperty.call(providerData, "results");
    if (!validPayload) {
      errorCategories.add("invalid_response");
    }

    const hasErrors = errorItems.length > 0;
    const safeInteger = value => {
      if (value === null || value === undefined || value === "") {
        return null;
      }
      const number = Number(value);
      return Number.isSafeInteger(number) && number >= 0
        ? number
        : null;
    };
    const quotaHeader = name =>
      safeInteger(providerResponse.headers.get(name));
    const paging = providerData?.paging;

    return json({
      provider: "API-Football",
      httpStatus: providerResponse.status,
      authenticated: providerResponse.ok && validPayload && !hasErrors,
      results: safeInteger(providerData?.results),
      errors: {
        present: hasErrors,
        count: errorItems.length,
        categories: [...errorCategories]
      },
      paging: {
        current: safeInteger(paging?.current),
        total: safeInteger(paging?.total)
      },
      quota: {
        dailyLimit: quotaHeader("x-ratelimit-requests-limit"),
        dailyRemaining: quotaHeader("x-ratelimit-requests-remaining"),
        minuteLimit: quotaHeader("x-ratelimit-limit"),
        minuteRemaining: quotaHeader("x-ratelimit-remaining")
      }
    });
  }


  // ----------------------------------------------------------
  // DIAGNÓSTICO TEMPORÁRIO API-FOOTBALL — COBERTURA 2026/27
  // ----------------------------------------------------------

  if (pathname === "/api/admin/football-provider-2026-27-diagnostic") {
    if (
      env.CF_PAGES_BRANCH !== "main" ||
      !["chutapracanto.com", "chutapracanto.pages.dev"].includes(url.hostname)
    ) {
      return json({ error: "Endpoint não encontrado." }, 404);
    }

    if (request.method !== "POST") {
      return json(
        { error: "Método não permitido." },
        405,
        { Allow: "POST" }
      );
    }

    const authError = await requireAuth(request, env);
    if (authError) {
      return authError;
    }

    if (request.headers.get("Origin") !== url.origin) {
      return json({ error: "Origem não permitida." }, 403);
    }

    const apiKey = env.API_FOOTBALL_KEY;
    if (typeof apiKey !== "string" || !apiKey.trim()) {
      return json(
        { error: "Secret API-Football indisponível em Production." },
        503
      );
    }

    const targets = [
      { key: "primeiraLiga", search: "Primeira Liga" },
      { key: "tacaPortugal", search: "Taça de Portugal" },
      { key: "tacaLiga", search: "Taça da Liga" },
      { key: "championsLeague", search: "UEFA Champions League" },
      { key: "europaLeague", search: "UEFA Europa League" },
      { key: "conferenceLeague", search: "UEFA Europa Conference League" },
      { key: "nationsLeague", search: "UEFA Nations League" }
    ];

    const safeInteger = value => {
      if (value === null || value === undefined || value === "") return null;
      const number = Number(value);
      return Number.isSafeInteger(number) && number >= 0 ? number : null;
    };

    const safeString = value =>
      typeof value === "string" && value.length <= 160 ? value : null;

    const results = {};

    for (const target of targets) {
      let providerResponse;
      let providerData = null;

      try {
        const endpoint =
          "https://v3.football.api-sports.io/leagues?season=2026&search=" +
          encodeURIComponent(target.search);

        providerResponse = await fetch(endpoint, {
          method: "GET",
          headers: { "x-apisports-key": apiKey.trim() },
          signal: AbortSignal.timeout(10000)
        });
        providerData = await providerResponse.json();
      } catch {
        results[target.key] = {
          httpStatus: null,
          ok: false,
          results: null,
          matches: [],
          errorCategory: "request_failed"
        };
        continue;
      }

      const rawErrors = providerData?.errors;
      const errorItems = Array.isArray(rawErrors)
        ? rawErrors
        : rawErrors && typeof rawErrors === "object"
          ? Object.keys(rawErrors)
          : rawErrors
            ? [rawErrors]
            : [];

      const categories = new Set();
      for (const item of errorItems) {
        const label = String(item).toLowerCase();
        if (/token|key|auth/.test(label)) categories.add("authentication");
        else if (/rate|request|limit|quota/.test(label)) categories.add("quota");
        else if (/plan|subscription/.test(label)) categories.add("subscription");
        else categories.add("provider");
      }

      const responseItems = Array.isArray(providerData?.response)
        ? providerData.response
        : [];

      results[target.key] = {
        httpStatus: providerResponse.status,
        ok: providerResponse.ok && errorItems.length === 0,
        results: safeInteger(providerData?.results),
        matches: responseItems.slice(0, 5).map(item => ({
          id: safeInteger(item?.league?.id),
          name: safeString(item?.league?.name),
          country: safeString(item?.country?.name),
          seasons: Array.isArray(item?.seasons)
            ? item.seasons
                .filter(season => Number(season?.year) === 2026)
                .map(season => ({
                  year: safeInteger(season?.year),
                  start: safeString(season?.start),
                  end: safeString(season?.end),
                  current: season?.current === true,
                  coverage: {
                    fixtures: season?.coverage?.fixtures === true,
                    events: season?.coverage?.fixtures?.events === true,
                    lineups: season?.coverage?.fixtures?.lineups === true,
                    statistics: season?.coverage?.fixtures?.statistics_fixtures === true,
                    standings: season?.coverage?.standings === true
                  }
                }))
            : []
        })),
        errorCategories: [...categories]
      };
    }

    return json({
      provider: "API-Football",
      seasonTested: 2026,
      seasonLabel: "2026/27",
      competitions: results
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
// ADAPTER INTERNO — BZZOIRO SPORTS DATA (BSD)
// ============================================================

const CPC_FOOTBALL_COMPETITIONS = {
  "liga-portugal": { leagueId: 2, name: "Liga Portugal" },
  "taca-portugal": { leagueId: 92, name: "Taça de Portugal" },
  "taca-liga": { leagueId: 93, name: "Taça da Liga" },
  "champions-league": { leagueId: 7, name: "UEFA Champions League" },
  "europa-league": { leagueId: 8, name: "UEFA Europa League" },
  "conference-league": { leagueId: 83, name: "UEFA Conference League" },
  "nations-league": { leagueId: 64, name: "UEFA Nations League" }
};

function cpcSafeNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function cpcSafeString(value) {
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

function cpcTeam(team, fallbackId = null, fallbackName = "") {
  const id = cpcSafeNumber(typeof team === "string" ? fallbackId : team?.id ?? fallbackId);
  const name = cpcSafeString(typeof team === "string" ? team : team?.name ?? team?.team_name ?? fallbackName);
  const explicitLogo = typeof team === "object" && team
    ? cpcSafeString(team.logo ?? team.logo_url ?? team.image)
    : "";
  return {
    id,
    name,
    logo: explicitLogo || (id != null ? `/api/football-image?type=team&id=${id}` : "")
  };
}

function cpcNormalizeEvent(event) {
  const home = cpcTeam(
    event?.home_team,
    event?.home_team_id ?? event?.home?.id,
    event?.home_team_name ?? event?.home?.name
  );
  const away = cpcTeam(
    event?.away_team,
    event?.away_team_id ?? event?.away?.id,
    event?.away_team_name ?? event?.away?.name
  );

  return {
    id: cpcSafeNumber(event?.id ?? event?.event_id),
    kickoff: event?.event_date ?? event?.date ?? event?.start_date ?? null,
    status: cpcSafeString(event?.status),
    stage: cpcSafeString(event?.stage),
    stageName: cpcSafeString(event?.stage_name),
    round: cpcSafeNumber(event?.round_number ?? event?.round),
    roundLabel: cpcSafeString(event?.round_label),
    homeTeam: home,
    awayTeam: away,
    score: {
      home: cpcSafeNumber(event?.home_score ?? event?.home?.score ?? event?.score?.home),
      away: cpcSafeNumber(event?.away_score ?? event?.away?.score ?? event?.score?.away)
    }
  };
}

function cpcNormalizeStanding(row) {
  return {
    position: cpcSafeNumber(row?.position ?? row?.rank),
    team: cpcTeam(row?.team, row?.team_id),
    played: cpcSafeNumber(row?.played ?? row?.matches_played),
    wins: cpcSafeNumber(row?.wins ?? row?.won),
    draws: cpcSafeNumber(row?.draws),
    losses: cpcSafeNumber(row?.losses ?? row?.lost),
    goalsFor: cpcSafeNumber(row?.goals_for ?? row?.goals_scored),
    goalsAgainst: cpcSafeNumber(row?.goals_against ?? row?.goals_conceded),
    goalDifference: cpcSafeNumber(row?.goal_difference ?? row?.goal_diff),
    points: cpcSafeNumber(row?.points ?? row?.pts)
  };
}

async function bsdFetchJson(env, endpoint) {
  const apiKey = env.BSD_API_KEY;
  if (typeof apiKey !== "string" || !apiKey.trim()) {
    throw new Error("BSD_API_KEY indisponível.");
  }

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Authorization": `Token ${apiKey.trim()}`,
      "Accept": "application/json"
    },
    signal: AbortSignal.timeout(10000)
  });

  if (!response.ok) {
    throw new Error(`BSD HTTP ${response.status}`);
  }

  const body = await response.text();
  try {
    return JSON.parse(body);
  } catch {
    throw new Error("BSD_JSON_PARSE");
  }
}

function bsdExtractEvents(data) {
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.events)) return data.events;
  if (Array.isArray(data?.data)) return data.data;
  return Array.isArray(data) ? data : [];
}

function bsdExtractStandings(data) {
  const rows = Array.isArray(data?.standings) ? [...data.standings] : [];
  if (Array.isArray(data?.groups)) {
    for (const group of data.groups) {
      if (Array.isArray(group?.standings)) rows.push(...group.standings);
      else if (Array.isArray(group?.table)) rows.push(...group.table);
    }
  }
  return rows;
}

async function bsdFootballAdapter(env, competitionKey, options = {}) {
  const competition = CPC_FOOTBALL_COMPETITIONS[competitionKey];
  if (!competition) throw new Error("Competição não suportada.");

  let seasonId = Number(options.seasonId || 0);
  let seasonLabel = "";

  if (!Number.isSafeInteger(seasonId) || seasonId <= 0) {
    const seasonsData = await bsdFetchJson(env,
      `https://sports.bzzoiro.com/api/v2/leagues/${competition.leagueId}/seasons/`,
      21600
    );
    const seasons = Array.isArray(seasonsData)
      ? seasonsData
      : Array.isArray(seasonsData?.seasons)
        ? seasonsData.seasons
        : Array.isArray(seasonsData?.results)
          ? seasonsData.results
          : [];

    const current = seasons.find(item => item?.current === true)
      || seasons.find(item => String(item?.year || "") === "2026")
      || seasons[0];

    seasonId = Number(current?.id);
    seasonLabel = cpcSafeString(current?.name || current?.label || current?.year);
  }

  if (!Number.isSafeInteger(seasonId) || seasonId <= 0) {
    throw new Error("Época não encontrada.");
  }

  const defaultStageByCompetition = {
    "liga-portugal": "regular-season"
  };
  const stage = options.stage
    ? String(options.stage)
    : (defaultStageByCompetition[competitionKey] || "");
  const eventParams = new URLSearchParams({
    league_id: String(competition.leagueId),
    season_id: String(seasonId)
  });
  if (stage) eventParams.set("stage", stage);
  if (options.round != null) eventParams.set("round", String(options.round));
  if (options.status) {
    const providerStatus = options.status === "upcoming" ? "notstarted" : options.status;
    if (["notstarted", "finished", "live"].includes(providerStatus)) {
      eventParams.set("status", providerStatus);
    }
  }

  let eventsData;
  let standingsData;

  try {
    eventsData = await bsdFetchJson(env,
      `https://sports.bzzoiro.com/api/v2/events/?${eventParams.toString()}`
    );
  } catch (error) {
    throw new Error("BSD_EVENTS:" + (error instanceof Error ? error.message : "unknown"));
  }

  try {
    standingsData = await bsdFetchJson(env,
      `https://sports.bzzoiro.com/api/v2/leagues/${competition.leagueId}/standings/?season_id=${seasonId}`
    );
  } catch (error) {
    throw new Error("BSD_STANDINGS:" + (error instanceof Error ? error.message : "unknown"));
  }

  let fixtures;
  let standings;
  const teamNamesById = new Map();

  try {
    const rawStandings = bsdExtractStandings(standingsData);

    for (const row of rawStandings) {
      const team = row?.team;
      const teamId = cpcSafeNumber(team?.id ?? row?.team_id);
      const teamName = cpcSafeString(
        team?.name ??
        team?.team_name ??
        row?.team_name
      );
      if (teamId != null && teamName) {
        teamNamesById.set(teamId, teamName);
      }
    }

    fixtures = bsdExtractEvents(eventsData).map(event => {
      const normalized = cpcNormalizeEvent(event);

      if (!normalized.homeTeam.name && normalized.homeTeam.id != null) {
        normalized.homeTeam.name = teamNamesById.get(normalized.homeTeam.id) || "";
      }
      if (!normalized.awayTeam.name && normalized.awayTeam.id != null) {
        normalized.awayTeam.name = teamNamesById.get(normalized.awayTeam.id) || "";
      }

      if (normalized.homeTeam.id != null && normalized.homeTeam.name) {
        teamNamesById.set(normalized.homeTeam.id, normalized.homeTeam.name);
      }
      if (normalized.awayTeam.id != null && normalized.awayTeam.name) {
        teamNamesById.set(normalized.awayTeam.id, normalized.awayTeam.name);
      }

      return normalized;
    });
  } catch (error) {
    throw new Error("NORMALIZE_EVENTS:" + (error instanceof Error ? error.message : "unknown"));
  }

  try {
    standings = bsdExtractStandings(standingsData).map(row => {
      const normalized = cpcNormalizeStanding(row);
      if (!normalized.team.name && normalized.team.id != null) {
        normalized.team.name = teamNamesById.get(normalized.team.id) || "";
      }
      return normalized;
    });
  } catch (error) {
    throw new Error("NORMALIZE_STANDINGS:" + (error instanceof Error ? error.message : "unknown"));
  }

  return {
    competition: {
      key: competitionKey,
      name: competition.name,
      provider: "bsd",
      providerLeagueId: competition.leagueId
    },
    season: {
      id: seasonId,
      label: seasonLabel || (seasonId === 1310 ? "2026/27" : "")
    },
    fixtures,
    standings,
    updatedAt: new Date().toISOString(),
    source: "Bzzoiro Sports Data",
    updateStatus: "live"
  };
}

const FOOTBALL_CACHE_FRESH_MS = 15 * 60 * 1000;
const FOOTBALL_CACHE_STALE_MS = 24 * 60 * 60 * 1000;
const footballCacheRefreshes = new Map();

function footballCacheKey(competitionKey, seasonId, stage, round, status = "upcoming") {
  return [
    "bsd",
    competitionKey,
    seasonId || "auto",
    stage || "",
    round == null ? "" : String(round),
    status || "upcoming"
  ].join("|");
}

async function getFootballCache(env, cacheKey) {
  if (!env.FOOTBALL_CACHE_DB) return null;

  const row = await env.FOOTBALL_CACHE_DB
    .prepare(
      "SELECT payload_json, fetched_at, expires_at, stale_until FROM football_cache WHERE cache_key = ?1"
    )
    .bind(cacheKey)
    .first();

  if (!row?.payload_json) return null;

  try {
    const payload = JSON.parse(row.payload_json);
    const now = Date.now();
    const expiresAt = Date.parse(row.expires_at);
    const staleUntil = Date.parse(row.stale_until);

    if (!Number.isFinite(expiresAt) || !Number.isFinite(staleUntil)) {
      return null;
    }

    if (now <= expiresAt) {
      return { payload, state: "fresh" };
    }

    if (now <= staleUntil) {
      return { payload, state: "stale" };
    }
  } catch {
    return null;
  }

  return null;
}

async function putFootballCache(env, cacheKey, data) {
  if (!env.FOOTBALL_CACHE_DB) return;

  const fetchedAt = new Date();
  const expiresAt = new Date(fetchedAt.getTime() + FOOTBALL_CACHE_FRESH_MS);
  const staleUntil = new Date(fetchedAt.getTime() + FOOTBALL_CACHE_STALE_MS);

  await env.FOOTBALL_CACHE_DB
    .prepare(
      `INSERT INTO football_cache
        (cache_key, provider, competition_key, season_id, resource, payload_json, fetched_at, expires_at, stale_until)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
       ON CONFLICT(cache_key) DO UPDATE SET
         provider = excluded.provider,
         competition_key = excluded.competition_key,
         season_id = excluded.season_id,
         resource = excluded.resource,
         payload_json = excluded.payload_json,
         fetched_at = excluded.fetched_at,
         expires_at = excluded.expires_at,
         stale_until = excluded.stale_until`
    )
    .bind(
      cacheKey,
      "bsd",
      data.competition.key,
      Number(data.season.id),
      "competition",
      JSON.stringify(data),
      fetchedAt.toISOString(),
      expiresAt.toISOString(),
      staleUntil.toISOString()
    )
    .run();
}

async function refreshFootballCache(env, cacheKey, competitionKey, options) {
  const existing = footballCacheRefreshes.get(cacheKey);
  if (existing) return existing;

  const promise = (async () => {
    const data = await bsdFootballAdapter(env, competitionKey, options);
    await putFootballCache(env, cacheKey, data);
    return data;
  })();

  footballCacheRefreshes.set(cacheKey, promise);

  try {
    return await promise;
  } finally {
    footballCacheRefreshes.delete(cacheKey);
  }
}

async function refreshScheduledFootballCompetition(controller, env) {
  const keys = Object.keys(CPC_FOOTBALL_COMPETITIONS);
  if (!keys.length) return;

  const scheduledAt = Number(controller?.scheduledTime);
  const timestamp = Number.isFinite(scheduledAt) ? scheduledAt : Date.now();
  const slot = Math.floor(timestamp / (5 * 60 * 1000));
  const competitionKey = keys[slot % keys.length];
  const cacheKey = footballCacheKey(competitionKey, "", "", "", "upcoming");

  try {
    const cached = await getFootballCache(env, cacheKey);
    if (cached?.state === "fresh") return;

    await refreshFootballCache(env, cacheKey, competitionKey, {});
  } catch (error) {
    console.error("Scheduled football refresh failed:", competitionKey, error);
    if (typeof controller?.noRetry === "function") {
      controller.noRetry();
    }
  }
}

async function handleFootballImageAPI(request, env) {
  const url = new URL(request.url);
  if (url.pathname !== "/api/football-image") return null;
  if (request.method !== "GET") return json({ error: "Método não permitido." }, 405, { Allow: "GET" });
  const type = url.searchParams.get("type") || "";
  const id = url.searchParams.get("id") || "";
  if (!["team", "league"].includes(type) || !/^\d+$/.test(id)) {
    return json({ error: "Imagem inválida." }, 400);
  }
  const upstream = `https://sports.bzzoiro.com/img/${type}/${id}/`;
  try {
    const response = await fetch(upstream, {
      headers: { Accept: "image/avif,image/webp,image/png,image/*;q=0.8" },
      cf: { cacheTtl: 86400, cacheEverything: true }
    });
    if (!response.ok) return new Response(null, { status: response.status });
    const headers = new Headers(response.headers);
    headers.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
    headers.delete("set-cookie");
    return new Response(response.body, { status: response.status, headers });
  } catch {
    return new Response(null, { status: 502 });
  }
}

async function handleFootballCompetitionAPI(request, env) {
  const url = new URL(request.url);
  if (url.pathname !== "/api/competicoes") return null;

  if (request.method !== "GET") {
    return json({ error: "Método não permitido." }, 405, { Allow: "GET" });
  }

  const competitionKey = url.searchParams.get("competition") || "";
  const competition = CPC_FOOTBALL_COMPETITIONS[competitionKey];

  if (!competition) {
    return json({
      error: "Competição não suportada.",
      available: Object.keys(CPC_FOOTBALL_COMPETITIONS)
    }, 400);
  }

  const seasonId = url.searchParams.get("seasonId") || "";
  const stage = url.searchParams.get("stage") || "";
  const round = url.searchParams.get("round");
  const status = url.searchParams.get("status") || "upcoming";
  if (!["upcoming", "finished", "live", "all"].includes(status)) {
    return json({ error: "Status inválido." }, 400);
  }
  const cacheKey = footballCacheKey(competitionKey, seasonId, stage, round, status);

  try {
    const cached = await getFootballCache(env, cacheKey);

    if (cached?.state === "fresh") {
      return json(
        { ...cached.payload, updateStatus: "cache" },
        200,
        { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" }
      );
    }

    const data = await refreshFootballCache(env, cacheKey, competitionKey, {
      seasonId,
      stage,
      round,
      status
    });

    return json(
      data,
      200,
      { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" }
    );
  } catch (error) {
    console.error("Football cache/provider error:", error);

    const cached = await getFootballCache(env, cacheKey);
    if (cached) {
      return json(
        {
          ...cached.payload,
          updateStatus: "stale",
          cacheStale: true
        },
        200,
        {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
          "Warning": '110 - "Response is stale"'
        }
      );
    }

    const detail = error instanceof Error ? error.message : "Erro desconhecido.";
    return json({
      error: "Dados de futebol temporariamente indisponíveis.",
      message: "Não foi possível obter os dados da competição.",
      debugStage: detail.split(":")[0] || "UNKNOWN"
    }, 503, {
      "Retry-After": "60"
    });
  }
}

// ============================================================
// REDIRECIONAMENTO DE URLs LEGADAS DO FRAMER
// ============================================================

async function redirecionarNoticiaFramer(request, env) {
  const url = new URL(request.url);

  if (!url.pathname.startsWith("/noticias/") || url.pathname === "/noticias/") {
    return null;
  }

  let framerSlug;
  try {
    framerSlug = decodeURIComponent(url.pathname.slice("/noticias/".length));
  } catch {
    return null;
  }

  if (!framerSlug || framerSlug.includes("/") || framerSlug.includes("\\")) {
    return null;
  }

  try {
    const mapResponse = await env.ASSETS.fetch(
      new Request(new URL("/content/framer-news-redirects.json", request.url))
    );

    if (!mapResponse.ok) return null;

    const map = await mapResponse.json();
    const destinationSlug = map?.redirects?.[framerSlug];

    if (!destinationSlug) return null;

    const destination = new URL("/noticia", url.origin);
    destination.searchParams.set("slug", destinationSlug);

    return Response.redirect(destination.toString(), 301);
  } catch {
    return null;
  }
}


// ============================================================
// WORKER PRINCIPAL
// ============================================================

export default {
  async scheduled(controller, env) {
    await refreshScheduledFootballCompetition(controller, env);
  },

  async fetch(request, env) {
    const url =
      new URL(request.url);

    try {
      if (url.pathname === "/api/football-image") {
        const imageResponse = await handleFootballImageAPI(request, env);
        if (imageResponse) return imageResponse;
      }

      if (url.pathname === "/api/competicoes") {
        const footballResponse = await handleFootballCompetitionAPI(request, env);
        if (footballResponse) return footballResponse;
      }

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

      const legacyNewsRedirect =
        await redirecionarNoticiaFramer(
          request,
          env
        );

      if (legacyNewsRedirect) {
        return legacyNewsRedirect;
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
