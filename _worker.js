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

function base64FromBytes(bytes) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, Math.min(i + chunkSize, bytes.length)));
  }
  return btoa(binary);
}

function extensaoImagemPorContentType(contentType, sourceUrl) {
  const type = String(contentType || "").split(";")[0].trim().toLowerCase();
  if (type === "image/jpeg") return "jpg";
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";

  try {
    const pathname = new URL(sourceUrl).pathname.toLowerCase();
    if (/\.jpe?g$/.test(pathname)) return "jpg";
    if (/\.png$/.test(pathname)) return "png";
    if (/\.webp$/.test(pathname)) return "webp";
  } catch {}

  return "";
}

function hostnameEhPrivado(hostname) {
  const host = String(hostname || "").toLowerCase().replace(/[\[\]]/g, "");
  if (
    host === "localhost" ||
    host === "localhost.localdomain" ||
    host.endsWith(".localhost") ||
    host === "0.0.0.0" ||
    host === "::1"
  ) return true;

  const ipv4 = host.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (!ipv4) return false;

  const [a,b,c,d] = ipv4.slice(1).map(Number);
  return (
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a === 0
  );
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

function markdownParaShellSeo(markdown) {
  const novaLinha = String.fromCharCode(10);
  const retorno = String.fromCharCode(13);
  const linhas = String(markdown || "").replace(/^\uFEFF/, "").split(novaLinha).map(linha =>
    linha.endsWith(retorno) ? linha.slice(0, -1) : linha
  );

  if (linhas[0]?.trim() === "---") {
    const fimFrontmatter = linhas.findIndex((linha, indice) => indice > 0 && linha.trim() === "---");
    if (fimFrontmatter > 0) linhas.splice(0, fimFrontmatter + 1);
  }

  const blocos = [];
  let blocoAtual = [];
  for (const linha of linhas) {
    const limpa = linha.trim();
    if (!limpa) {
      if (blocoAtual.length) {
        blocos.push(blocoAtual.join(" "));
        blocoAtual = [];
      }
    } else {
      blocoAtual.push(limpa);
    }
  }
  if (blocoAtual.length) blocos.push(blocoAtual.join(" "));

  return blocos.map(bloco => {
    const textoPlano = bloco
      .replace(/^#{1,6}\s+/, "")
      .replace(/^>\s?/, "")
      .replace(/^(?:[-+*]|\d+[.)])\s+/, "")
      .replace(/^\[[^\]]+\]:\s*\S+.*$/, "")
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/<[^>]*>/g, " ")
      .replace(/[\*_~\x60]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    return textoPlano ? "<p>" + escaparHtml(textoPlano) + "</p>" : "";
  }).join("");
}

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
    if (!isAllowedNewsPath(entry.path)) return response;

    let markdownBodyHtml = "";
    try {
      const markdownResponse = await env.ASSETS.fetch(
        new Request(new URL("/" + entry.path, request.url))
      );
      if (markdownResponse.ok) {
        markdownBodyHtml = markdownParaShellSeo(await markdownResponse.text());
      }
    } catch {
      // Mantém a shell de metadados se o Markdown não estiver disponível.
    }

    const seoBodyHtml = markdownBodyHtml
      ? '<div class="article-seo-shell art-body">' + markdownBodyHtml + "</div>"
      : "";

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
          element.setInnerContent(headerHtml + imageHtml + seoBodyHtml, { html: true });
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
async function ensureAnalyticsSchema(db) {
  await db.prepare("CREATE TABLE IF NOT EXISTS analytics_events (id INTEGER PRIMARY KEY AUTOINCREMENT, session_id TEXT NOT NULL CHECK (length(session_id) BETWEEN 20 AND 80), occurred_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')), event_type TEXT NOT NULL CHECK (length(event_type) BETWEEN 2 AND 48), page_path TEXT NOT NULL CHECK (length(page_path) BETWEEN 1 AND 240), article_slug TEXT, source TEXT NOT NULL DEFAULT 'direct', medium TEXT NOT NULL DEFAULT 'unknown', referrer_host TEXT, previous_page TEXT, target TEXT, metadata_json TEXT);").run();
  await db.prepare("CREATE INDEX IF NOT EXISTS idx_analytics_events_occurred_at ON analytics_events(occurred_at)").run();
  await db.prepare("CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON analytics_events(session_id)").run();
  await db.prepare("CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type)").run();
  await db.prepare("CREATE INDEX IF NOT EXISTS idx_analytics_events_source ON analytics_events(source)").run();
  await db.prepare("CREATE INDEX IF NOT EXISTS idx_analytics_events_page ON analytics_events(page_path)").run();
}

async function handleAnalyticsEventAPI(request, env) {
  const url = new URL(request.url);
  const respond = (data, status = 200) => json(data, status, { "X-Robots-Tag": "noindex, nofollow, noarchive" });
  if (request.method !== "POST") return respond({ error: "Método não permitido." }, 405);
  if (request.headers.get("Origin") !== url.origin) return respond({ error: "Origem não permitida." }, 403);
  if (!env.ARTICLE_LIKES_DB) return respond({ error: "Analytics temporariamente indisponível." }, 503);
  if (!(request.headers.get("Content-Type") || "").toLowerCase().includes("application/json")) return respond({ error: "Content-Type inválido." }, 415);
  let payload;
  try { payload = JSON.parse(await lerCorpoLimitado(request, 4096)); } catch { return respond({ error: "Pedido inválido." }, 400); }
  const sessionId = typeof payload?.sessionId === "string" ? payload.sessionId.trim() : "";
  const eventType = typeof payload?.eventType === "string" ? payload.eventType.trim() : "";
  const pagePath = typeof payload?.pagePath === "string" ? payload.pagePath.trim() : "";
  const articleSlug = payload?.articleSlug == null ? null : String(payload.articleSlug).trim();
  const source = typeof payload?.source === "string" ? payload.source.trim().slice(0, 80) : "direct";
  const medium = typeof payload?.medium === "string" ? payload.medium.trim().slice(0, 40) : "unknown";
  const referrerHost = payload?.referrerHost == null ? null : String(payload.referrerHost).trim().slice(0, 160);
  const previousPage = payload?.previousPage == null ? null : String(payload.previousPage).trim().slice(0, 240);
  const target = payload?.target == null ? null : String(payload.target).trim().slice(0, 240);
  const metadata = payload?.metadata && typeof payload.metadata === "object" ? JSON.stringify(payload.metadata).slice(0, 1200) : null;
  if (!/^[0-9a-f-]{20,80}$/i.test(sessionId) || !/^[a-z][a-z0-9_]{1,47}$/i.test(eventType) || !pagePath.startsWith("/") || pagePath.length > 240 || articleSlug?.length > 160) return respond({ error: "Evento inválido." }, 400);
  if (/[\u0000-\u001f\u007f]/u.test(pagePath) || (articleSlug && /[\\/\u0000-\u001f\u007f]/u.test(articleSlug))) return respond({ error: "Evento inválido." }, 400);
  try {
    await ensureAnalyticsSchema(env.ARTICLE_LIKES_DB);
    await env.ARTICLE_LIKES_DB.prepare("INSERT INTO analytics_events (session_id, event_type, page_path, article_slug, source, medium, referrer_host, previous_page, target, metadata_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(sessionId, eventType, pagePath, articleSlug, source || "direct", medium || "unknown", referrerHost, previousPage, target, metadata).run();
    return respond({ ok: true });
  } catch (error) {
    console.error("Analytics event error:", error);
    return respond({ error: "Analytics temporariamente indisponível." }, 503);
  }
}

async function handleArticleViewAPI(request, env) {
  const url = new URL(request.url);
  const respond = (data, status = 200) =>
    json(data, status, { "X-Robots-Tag": "noindex, nofollow, noarchive" });

  if (request.method !== "POST") {
    return respond({ error: "Método não permitido.", message: "Método não permitido." }, 405);
  }
  if (request.headers.get("Origin") !== url.origin) {
    return respond({ error: "Origem não permitida.", message: "Origem não permitida." }, 403);
  }
  if (!env.ARTICLE_LIKES_DB || !env.ASSETS) {
    return respond({ error: "Métrica temporariamente indisponível.", message: "Métrica temporariamente indisponível." }, 503);
  }

  let payload;
  try {
    payload = JSON.parse(await lerCorpoLimitado(request, 1024));
  } catch {
    return respond({ error: "Pedido inválido.", message: "Pedido inválido." }, 400);
  }

  const slug = typeof payload?.slug === "string" ? payload.slug.trim() : "";
  if (!slug || slug.length > 160 || /[\\/\u0000-\u001f\u007f]/u.test(slug)) {
    return respond({ error: "Artigo inválido.", message: "Artigo inválido." }, 400);
  }

  try {
    const indexResponse = await env.ASSETS.fetch(
      new Request(new URL("/content/noticias-index.json", url.origin))
    );
    if (!indexResponse.ok) return respond({ error: "Métrica temporariamente indisponível." }, 503);
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
    if (!articleExists) return respond({ error: "Artigo não encontrado.", message: "Artigo não encontrado." }, 404);

    await env.ARTICLE_LIKES_DB
      .prepare("INSERT INTO article_views (article_slug) VALUES (?)")
      .bind(slug)
      .run();

    return respond({ ok: true });
  } catch (error) {
    console.error("Article view metric error:", error);
    return respond({ error: "Métrica temporariamente indisponível.", message: "Métrica temporariamente indisponível." }, 503);
  }
}

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


async function sincronizarIndiceEditorial(env, path, action, markdown = "") {
  const indexPath = "content/noticias-index.json";
  const githubIndexPath = `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${indexPath}?ref=${encodeURIComponent(obterBranchGithub(env))}`;

  const indexResponse = await githubRequest(env, githubIndexPath, { method: "GET" });
  if (!indexResponse.ok) {
    throw new Error("Não foi possível ler o índice editorial.");
  }

  const indexData = await indexResponse.json();
  const indexContent = decodeGithubBase64(indexData.content || "");
  let entries;

  try {
    entries = JSON.parse(indexContent);
  } catch {
    throw new Error("O índice editorial existente é inválido.");
  }

  if (!Array.isArray(entries)) {
    throw new Error("O índice editorial existente não é uma lista.");
  }

  const existing = entries.find(item => item && item.path === path);

  if (action === "delete") {
    entries = entries.filter(item => !item || item.path !== path);
  } else {
    const slug = path.split("/").pop().replace(/\.md$/i, "");
    const entry = {
      slug,
      path,
      type: extrairCampoFrontmatter(markdown, "type") || (path.includes("/opiniao/") ? "opinion" : "news"),
      title: extrairCampoFrontmatter(markdown, "title") || existing?.title || "Sem título",
      subtitle:
        extrairCampoFrontmatter(markdown, "subtitle") ||
        extrairCampoFrontmatter(markdown, "subtitulo") ||
        existing?.subtitle ||
        "",
      category:
        extrairCampoFrontmatter(markdown, "category") ||
        extrairCampoFrontmatter(markdown, "categoria") ||
        existing?.category ||
        "Geral",
      categoryId: existing?.categoryId || "",
      categoryKind: existing?.categoryKind || "mixed",
      author:
        extrairCampoFrontmatter(markdown, "author") ||
        extrairCampoFrontmatter(markdown, "autor") ||
        existing?.author ||
        "ChutaPraCanto",
      authorId: existing?.authorId || "chuta-pra-canto",
      authorType: existing?.authorType || "Organization",
      published: extrairDataNoticia(markdown) || existing?.published || "",
      publishedAt: extrairDataNoticia(markdown) || existing?.publishedAt || "",
      image:
        extrairCampoFrontmatter(markdown, "image") ||
        extrairCampoFrontmatter(markdown, "imagem") ||
        extrairCampoFrontmatter(markdown, "featured_image") ||
        extrairCampoFrontmatter(markdown, "featuredImage") ||
        existing?.image ||
        ""
    };

    const position = entries.findIndex(item => item && item.path === path);
    if (position >= 0) {
      entries[position] = { ...entries[position], ...entry };
    } else {
      entries.push(entry);
    }
  }

  entries.sort((a, b) => {
    const ta = Date.parse(a?.published || a?.publishedAt || "") || 0;
    const tb = Date.parse(b?.published || b?.publishedAt || "") || 0;
    return tb - ta;
  });

  const nextContent = JSON.stringify(entries, null, 2) + "\n";
  const updateResponse = await githubRequest(
    env,
    `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${indexPath}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message:
          action === "delete"
            ? "Atualizar índice após apagar conteúdo"
            : "Atualizar índice após publicar conteúdo",
        content: base64FromBytes(new TextEncoder().encode(nextContent)),
        sha: indexData.sha,
        branch: obterBranchGithub(env)
      })
    }
  );

  if (!updateResponse.ok) {
    const detail = await updateResponse.text();
    throw new Error(
      "O conteúdo foi guardado, mas não foi possível atualizar o índice editorial." +
      (detail ? " " + detail.slice(0, 300) : "")
    );
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
  // MÉTRICAS — VISUALIZAÇÕES
  // ----------------------------------------------------------

  if (pathname === "/api/admin/metrics/views") {
    if (request.method !== "GET") {
      return json({ error: "Método não permitido.", message: "Método não permitido." }, 405);
    }
    if (!env.ARTICLE_LIKES_DB) {
      return json({ error: "ARTICLE_LIKES_DB não está configurada." }, 503);
    }

    const period = url.searchParams.get("period") || "30d";
    const periodModifiers = {
      "1d": "-1 day",
      "7d": "-7 days",
      "30d": "-30 days"
    };
    const modifier = periodModifiers[period];
    if (!modifier) {
      return json({ error: "Período inválido." }, 400);
    }

    try {
      const result = await env.ARTICLE_LIKES_DB
        .prepare("SELECT article_slug AS slug, COUNT(*) AS count FROM article_views WHERE datetime(viewed_at) >= datetime('now', ?1) GROUP BY article_slug ORDER BY count DESC, article_slug ASC")
        .bind(modifier)
        .all();
      const items = (result?.results || []).map(row => ({ slug: String(row.slug || ""), count: Number(row.count || 0) }));
      const totalViews = items.reduce((sum, item) => sum + item.count, 0);
      return json({ ok: true, period, totalViews, articlesWithViews: items.filter(item => item.count > 0).length, items });
    } catch (error) {
      console.error("Admin metrics views error:", error);
      return json({ error: "Não foi possível carregar as métricas de visualizações." }, 503);
    }
  }

  // ----------------------------------------------------------
  // MÉTRICAS — LIKES
  // ----------------------------------------------------------

  if (pathname === "/api/admin/metrics/likes") {
    if (request.method !== "GET") {
      return json({ error: "Método não permitido.", message: "Método não permitido." }, 405);
    }
    if (!env.ARTICLE_LIKES_DB) {
      return json({ error: "ARTICLE_LIKES_DB não está configurada." }, 503);
    }

    const period = url.searchParams.get("period") || "30d";
    const periodModifiers = {
      "1d": "-1 day",
      "7d": "-7 days",
      "30d": "-30 days"
    };
    const modifier = periodModifiers[period];
    if (!modifier) {
      return json({ error: "Período inválido." }, 400);
    }

    try {
      const result = await env.ARTICLE_LIKES_DB
        .prepare("SELECT article_slug AS slug, COUNT(*) AS count FROM article_likes WHERE datetime(created_at) >= datetime('now', ?1) GROUP BY article_slug ORDER BY count DESC, article_slug ASC")
        .bind(modifier)
        .all();
      const items = (result?.results || []).map(row => ({
        slug: String(row.slug || ""),
        count: Number(row.count || 0)
      }));
      const totalLikes = items.reduce((sum, item) => sum + item.count, 0);
      return json({
        ok: true,
        period,
        totalLikes,
        articlesWithLikes: items.filter(item => item.count > 0).length,
        items
      });
    } catch (error) {
      console.error("Admin metrics likes error:", error);
      return json({ error: "Não foi possível carregar as métricas de likes." }, 503);
    }
  }

  // ----------------------------------------------------------
  // MÉTRICAS — JORNADAS / ORIGENS
  // ----------------------------------------------------------

  if (pathname === "/api/admin/metrics/analytics") {
    if (request.method !== "GET") return json({ error: "Método não permitido." }, 405);
    if (!env.ARTICLE_LIKES_DB) return json({ error: "ARTICLE_LIKES_DB não está configurada." }, 503);
    const period = url.searchParams.get("period") || "30d";
    const modifiers = { "1d": "-1 day", "7d": "-7 days", "30d": "-30 days" };
    const modifier = modifiers[period];
    if (!modifier) return json({ error: "Período inválido." }, 400);
    try {
      await ensureAnalyticsSchema(env.ARTICLE_LIKES_DB);
      const sourceRows = await env.ARTICLE_LIKES_DB.prepare("SELECT source, medium, COUNT(*) AS events, COUNT(DISTINCT session_id) AS sessions FROM analytics_events WHERE datetime(occurred_at) >= datetime('now', ?1) GROUP BY source, medium ORDER BY sessions DESC, events DESC, source ASC").bind(modifier).all();
      const journeyRows = await env.ARTICLE_LIKES_DB.prepare("SELECT event_type, COUNT(*) AS events, COUNT(DISTINCT session_id) AS sessions FROM analytics_events WHERE datetime(occurred_at) >= datetime('now', ?1) GROUP BY event_type ORDER BY events DESC, event_type ASC").bind(modifier).all();
      const shareRows = await env.ARTICLE_LIKES_DB.prepare("SELECT COALESCE(json_extract(metadata_json,'$.platform'),'unknown') AS platform, event_type, COUNT(*) AS events, COUNT(DISTINCT session_id) AS sessions FROM analytics_events WHERE event_type IN ('share_option_click','share_copy_completed','share_native_completed') AND datetime(occurred_at) >= datetime('now', ?1) GROUP BY platform, event_type ORDER BY events DESC, platform ASC").bind(modifier).all();
      const pageRows = await env.ARTICLE_LIKES_DB.prepare("SELECT page_path, COUNT(*) AS views, COUNT(DISTINCT session_id) AS sessions FROM analytics_events WHERE event_type = 'page_view' AND datetime(occurred_at) >= datetime('now', ?1) GROUP BY page_path ORDER BY views DESC, page_path ASC").bind(modifier).all();
      const summary = await env.ARTICLE_LIKES_DB.prepare("SELECT COUNT(DISTINCT session_id) AS sessions, SUM(CASE WHEN event_type='page_view' THEN 1 ELSE 0 END) AS page_views, COUNT(DISTINCT CASE WHEN event_type='page_exit' THEN session_id END) AS sessions_with_exit, AVG(CASE WHEN event_type='page_exit' THEN CAST(json_extract(metadata_json,'$.activeSeconds') AS REAL) END) AS avg_active_seconds FROM analytics_events WHERE datetime(occurred_at) >= datetime('now', ?1)").bind(modifier).first();
      const onePageRows = await env.ARTICLE_LIKES_DB.prepare("SELECT COUNT(*) AS sessions FROM (SELECT session_id FROM analytics_events WHERE event_type='page_view' AND datetime(occurred_at) >= datetime('now', ?1) GROUP BY session_id HAVING COUNT(*) = 1)").bind(modifier).first();
      return json({ ok:true, period,
        summary:{sessions:Number(summary?.sessions||0),pageViews:Number(summary?.page_views||0),sessionsWithExit:Number(summary?.sessions_with_exit||0),singlePageSessions:Number(onePageRows?.sessions||0),avgActiveSeconds:Number(summary?.avg_active_seconds||0)},
        sources:(sourceRows?.results||[]).map(r=>({source:String(r.source||""),medium:String(r.medium||""),events:Number(r.events||0),sessions:Number(r.sessions||0)})),
        journeys:(journeyRows?.results||[]).map(r=>({eventType:String(r.event_type||""),events:Number(r.events||0),sessions:Number(r.sessions||0)})),
        pages:(pageRows?.results||[]).map(r=>({pagePath:String(r.page_path||""),views:Number(r.views||0),sessions:Number(r.sessions||0)})),
        shares:(shareRows?.results||[]).map(r=>({platform:String(r.platform||"unknown"),eventType:String(r.event_type||""),events:Number(r.events||0),sessions:Number(r.sessions||0)}))
      });
    } catch (error) {
      console.error("Admin analytics metrics error:", error);
      return json({ error: "Não foi possível carregar as métricas de analytics." }, 503);
    }
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

    if (githubResponse.ok) {
      try {
        const markdown =
          request.method === "PUT" && typeof body === "string"
            ? decodeGithubBase64(JSON.parse(body).content || "")
            : "";

        await sincronizarIndiceEditorial(
          env,
          path,
          request.method === "DELETE" ? "delete" : "upsert",
          markdown
        );
      } catch (error) {
        console.error("Falha ao sincronizar índice editorial:", error);
        return json(
          {
            error:
              error?.message ||
              "Conteúdo guardado, mas o índice editorial não foi atualizado.",
            message:
              error?.message ||
              "Conteúdo guardado, mas o índice editorial não foi atualizado.",
            contentSaved: true,
            indexSynced: false
          },
          500
        );
      }
    }

    return json(
      data,
      githubResponse.status
    );
  }


  // ----------------------------------------------------------
  // IMAGENS: LER / ENVIAR / APAGAR
  // ----------------------------------------------------------

  if (pathname === "/api/admin/image/import") {
    if (request.method !== "POST") {
      return json({ error: "Método não permitido.", message: "Método não permitido." }, 405);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: "Corpo inválido.", message: "Corpo inválido." }, 400);
    }

    const sourceUrl = typeof payload?.url === "string" ? payload.url.trim() : "";
    if (!/^https?:\/\//i.test(sourceUrl)) {
      return json({ error: "URL inválido.", message: "Indica um URL HTTP ou HTTPS." }, 400);
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(sourceUrl);
    } catch {
      return json({ error: "URL inválido.", message: "Não foi possível interpretar o URL." }, 400);
    }

    if (parsedUrl.username || parsedUrl.password || hostnameEhPrivado(parsedUrl.hostname)) {
      return json({ error: "URL não permitido.", message: "O URL indicado não é permitido." }, 400);
    }

    let upstream;
    try {
      upstream = await fetch(parsedUrl.toString(), {
        method: "GET",
        redirect: "follow",
        headers: {
          "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
          "User-Agent": "ChutaPraCanto Image Importer"
        }
      });
    } catch {
      return json({ error: "Não foi possível aceder à imagem.", message: "O servidor de origem recusou ou não respondeu ao pedido." }, 502);
    }

    if (!upstream.ok) {
      return json({ error: "Imagem inacessível.", message: "O servidor de origem respondeu com HTTP " + upstream.status + "." }, 502);
    }

    const contentType = String(upstream.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
    const extension = extensaoImagemPorContentType(contentType, parsedUrl.toString());
    if (!extension) {
      return json({ error: "Não é uma imagem suportada.", message: "O URL não devolveu JPEG, PNG ou WebP." }, 415);
    }

    const lengthHeader = Number(upstream.headers.get("content-length") || 0);
    if (lengthHeader > MAX_IMAGE_UPLOAD_BYTES) {
      return json({ error: "Imagem demasiado grande.", message: "A imagem excede o limite de 5 MiB." }, 413);
    }

    let bytes;
    try {
      const buffer = await upstream.arrayBuffer();
      if (buffer.byteLength > MAX_IMAGE_UPLOAD_BYTES) {
        return json({ error: "Imagem demasiado grande.", message: "A imagem excede o limite de 5 MiB." }, 413);
      }
      bytes = new Uint8Array(buffer);
    } catch {
      return json({ error: "Falha ao ler a imagem.", message: "Não foi possível ler os dados da imagem." }, 502);
    }

    const nomeBase = "external-import-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
    const path = "images/uploads/" + nomeBase + "." + extension;
    const content = base64FromBytes(bytes);

    if (!validarImagemUpload(content, path)) {
      return json({ error: "Conteúdo de imagem inválido.", message: "O conteúdo recebido não corresponde a um JPEG, PNG ou WebP válido." }, 415);
    }

    const githubPath = "/repos/" + GITHUB_OWNER + "/" + GITHUB_REPO + "/contents/" + path;
    const githubResponse = await githubRequest(env, githubPath, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Importar imagem externa",
        content,
        branch: obterBranchGithub(env)
      })
    });

    const responseText = await githubResponse.text();
    let data;
    try { data = JSON.parse(responseText); }
    catch { data = { error: responseText || "Resposta inválida do GitHub." }; }

    if (!githubResponse.ok) {
      return json({
        error: data?.message || data?.error || "Não foi possível guardar a imagem.",
        message: data?.message || data?.error || "Não foi possível guardar a imagem."
      }, githubResponse.status);
    }

    return json({
      ok: true,
      path: "/" + path,
      sourceUrl: typeof payload?.sourceUrl === "string" ? payload.sourceUrl : sourceUrl
    });
  }

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
  if (value == null || (typeof value === "string" && !value.trim()) || typeof value === "boolean") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

const CPC_NATIONS_GROUPS = {
  A1:["france","italy","belgium","turkiye","turkey"], A2:["germany","netherlands","serbia","greece"], A3:["spain","croatia","england","czechia","czech republic"], A4:["portugal","denmark","norway","wales"],
  B1:["slovenia","scotland","north macedonia","switzerland"], B2:["georgia","northern ireland","hungary","ukraine"], B3:["israel","austria","republic of ireland","ireland","kosovo"], B4:["poland","bosnia and herzegovina","romania","sweden"],
  C1:["san marino","finland","albania","belarus"], C2:["armenia","latvia","montenegro","cyprus"], C3:["faroe islands","kazakhstan","slovakia","moldova"], C4:["bulgaria","luxembourg","iceland","estonia"],
  D1:["andorra","malta","gibraltar"], D2:["liechtenstein","lithuania","azerbaijan"]
};
function cpcNormalizeNationName(value) {
  return cpcSafeString(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\b(?:men|women)(?:'s)?\b/g, " ")
    .replace(/\b(?:national\s+(?:football\s+)?team|football\s+team)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function cpcNationsGroupForNames(...values) {
  const rawValues = values.map(value => cpcSafeString(value).trim()).filter(Boolean);
  for (const value of rawValues) {
    const match = value.match(/(?:league|liga)\s+([A-D])\s*[,·-]\s*(?:group|grupo)\s*([1-4])/i);
    if (match) {
      const group = match[1].toUpperCase() + match[2];
      if (Object.prototype.hasOwnProperty.call(CPC_NATIONS_GROUPS, group)) return "Liga " + group.charAt(0) + " · Grupo " + group;
    }
  }
  const names = new Set(rawValues.map(cpcNormalizeNationName).filter(Boolean));
  for (const [group, teams] of Object.entries(CPC_NATIONS_GROUPS)) {
    if (teams.some(team => names.has(cpcNormalizeNationName(team)))) return "Liga " + group.charAt(0) + " · Grupo " + group;
  }
  return "";
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

function cpcNormalizeEvent(event, defaultStage = "") {
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
  const rawStage = event?.stage ?? event?.stage_name ?? defaultStage;
  const stageKey = cpcSafeString(
    event?.stage_key ??
    event?.stage_slug ??
    (typeof rawStage === "object" && rawStage
      ? rawStage.slug ?? rawStage.key ?? rawStage.id ?? rawStage.code ?? rawStage.name
      : rawStage)
  ) || defaultStage;
  const stageName = cpcSafeString(
    event?.stage_name ??
    (typeof rawStage === "object" && rawStage
      ? rawStage.name ?? rawStage.label ?? rawStage.title
      : rawStage)
  );
  const rawRound = event?.round_number ?? event?.round ?? event?.round_label ?? event?.round_name;
  const roundKey = cpcSafeString(
    event?.round_key ??
    event?.round_id ??
    (typeof rawRound === "object" && rawRound
      ? rawRound.key ?? rawRound.id ?? rawRound.number ?? rawRound.name ?? rawRound.label
      : rawRound)
  );
  const roundNumeric = cpcSafeNumber(
    event?.round_number ??
    (typeof rawRound === "object" && rawRound ? rawRound.number ?? rawRound.id : rawRound)
  );

  return {
    id: cpcSafeNumber(event?.id ?? event?.event_id),
    kickoff: event?.event_date ?? event?.date ?? event?.start_date ?? null,
    status: cpcSafeString(event?.status ?? event?.event_status),
    stage: stageKey,
    stageKey,
    stageName: stageName || stageKey,
    groupName: cpcSafeString(event?.group_name || event?.group?.name || event?.group?.label || (typeof event?.group === "string" ? event.group : "")),
    round: roundNumeric ?? roundKey,
    roundKey,
    roundLabel: cpcSafeString(
      event?.round_label ??
      event?.round_name ??
      (typeof rawRound === "object" && rawRound ? rawRound.label ?? rawRound.name : "")
    ),
    homeTeam: home,
    awayTeam: away,
    score: {
      home: cpcSafeNumber(event?.home_score ?? event?.home?.score ?? event?.score?.home),
      away: cpcSafeNumber(event?.away_score ?? event?.away?.score ?? event?.score?.away)
    },
    liveMinute: cpcSafeNumber(event?.current_minute ?? event?.minute ?? event?.live_minute ?? event?.time?.minute),
    livePeriod: cpcSafeString(event?.period ?? event?.current_period ?? event?.live_period ?? event?.time?.status),
    liveAddedTime: cpcSafeNumber(event?.added_time ?? event?.stoppage_time ?? event?.live_added_time ?? event?.time?.injury_time),
    halfTimeScore: event?.half_time_score ?? event?.ht_score ?? null,
    extraTimeScore: event?.extra_time_score ?? null,
    penaltyShootout: event?.penalty_shootout ?? null,
    goals: Array.isArray(event?.goals) ? event.goals : []
  };
}

function cpcCorrectTacaLigaSchedule(fixtures, seasonId) {
  if (!Array.isArray(fixtures) || Number(seasonId) !== 1941) return fixtures;

  const normalizeTeam = value => String(value || "")
    .normalize("NFD")
    .replace(/[\\u0300-\\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");

  const corrections = new Map([
    ["31|27", "2026-10-29T18:45:00+00:00"],
    ["37|24", "2026-10-29T20:45:00+00:00"]
  ]);

  return fixtures.map(fixture => {
    const home = normalizeTeam(fixture?.homeTeam?.name);
    const away = normalizeTeam(fixture?.awayTeam?.name);
    const ids = String(fixture?.homeTeam?.id ?? "") + "|" + String(fixture?.awayTeam?.id ?? "");
    const kickoff = corrections.get(ids) || corrections.get(home + "|" + away);
    return kickoff ? { ...fixture, kickoff } : fixture;
  });
}

function cpcInferCompetitionPhase(competitionKey, fixtures, standings) {
  const groupNames = new Set((standings || [])
    .map(row => cpcSafeString(row?.groupName || row?.group_name || (typeof row?.group === "string" ? row.group : row?.group?.name)))
    .filter(Boolean).map(value => value.toLowerCase()));
  const stageTexts = (fixtures || [])
    .map(item => cpcSafeString(item?.stageName || item?.stage || item?.stageKey))
    .filter(Boolean).join(" ").toLowerCase();

  // A fase deve ser inferida do estado atual fornecido pela BSD. Não há
  // calendário hardcoded: quando a competição muda de fase, a resposta muda
  // automaticamente com ela.
  const knockout = /knockout|qualifying|qualification|playoff|play-off|quarterfinal|quarter-final|semifinal|semi-final|final|quartos|oitavos|meias-finais|ronda de qualificação/.test(stageTexts);
  if (knockout) {
    return { type: "knockout", grouped: false, label: "Fase a eliminar" };
  }

  const leaguePhase = /league[- _]?phase|league phase|fase de liga/.test(stageTexts);
  const groupStage = /group[- _]?stage|group stage|fase de grupos|grupo/.test(stageTexts);
  const grouped = groupNames.size > 1 || groupStage;

  if (grouped) {
    return {
      type: leaguePhase ? "league-phase-groups" : "group-stage",
      grouped: true,
      label: leaguePhase ? "Fase de liga" : "Fase de grupos"
    };
  }
  if (leaguePhase) {
    return { type: "league-phase", grouped: false, label: "Fase de liga" };
  }
  return { type: "single-table", grouped: false, label: "Classificação" };
}

function cpcNormalizeStanding(row) {
  const stats = row?.stats || row?.record || row?.statistics || {};
  const first = (...values) => values.find(value => value != null && !(typeof value === "string" && !value.trim()));
  const teamSource = row?.team && typeof row.team === "object"
    ? row.team
    : { id: row?.team_id ?? row?.id, name: row?.team_name ?? row?.name ?? row?.short_name };

  const played = cpcSafeNumber(first(row?.played,row?.matches_played,row?.matchesPlayed,row?.games_played,row?.games,row?.p,stats?.played,stats?.matches_played,stats?.matchesPlayed,stats?.games_played,stats?.games,stats?.p));
  const wins = cpcSafeNumber(first(row?.wins,row?.won,row?.victories,row?.w,stats?.wins,stats?.won,stats?.victories,stats?.w));
  const losses = cpcSafeNumber(first(row?.losses,row?.lost,row?.lost_matches,row?.defeats,row?.l,stats?.losses,stats?.lost,stats?.lost_matches,stats?.defeats,stats?.l));
  const draws = cpcSafeNumber(first(row?.draws,row?.drawn,row?.draw,row?.ties,row?.tied,row?.d,stats?.draws,stats?.drawn,stats?.draw,stats?.ties,stats?.tied,stats?.d));
  const goalsFor = cpcSafeNumber(first(row?.goals_for,row?.goals_scored,row?.gf,row?.goalsFor,stats?.goals_for,stats?.goals_scored,stats?.gf,stats?.goalsFor));
  const goalsAgainst = cpcSafeNumber(first(row?.goals_against,row?.goals_conceded,row?.ga,row?.goalsAgainst,stats?.goals_against,stats?.goals_conceded,stats?.ga,stats?.goalsAgainst));
  const goalDifference = cpcSafeNumber(first(row?.goal_difference,row?.goal_diff,row?.gd,row?.goalDifference,stats?.goal_difference,stats?.goal_diff,stats?.gd,stats?.goalDifference));
  const team = cpcTeam(teamSource,row?.team_id ?? row?.id,row?.team_name ?? row?.name);
  const rawGroup = cpcSafeString(first(row?.groupName,row?.group_name,typeof row?.group === "string" ? row.group : row?.group?.name,row?.group?.label));
  return {
    position:cpcSafeNumber(first(row?.position,row?.rank,stats?.position,stats?.rank)),
    groupName:cpcNationsGroupForNames(rawGroup,team?.name)||rawGroup,
    team,
    played,wins,
    draws:draws ?? (played!=null&&wins!=null&&losses!=null ? played-wins-losses : null),
    losses,goalsFor,goalsAgainst,
    goalDifference:goalDifference ?? (goalsFor!=null&&goalsAgainst!=null ? goalsFor-goalsAgainst : null),
    points:cpcSafeNumber(first(row?.points,row?.pts,row?.pontos,stats?.points,stats?.pts,stats?.pontos))
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
  // A BSD pode devolver standings como array direto, em data, standings,
  // table, results ou grupos. Normalizamos todas essas formas aqui.
  let payload = data;
  if (Array.isArray(data)) {
    payload = data;
  } else if (Array.isArray(data?.data)) {
    payload = data.data;
  } else if (data?.data && typeof data.data === "object") {
    payload = data.data;
  }

  const addGroupRows = (rows, groupName) => {
    if (!Array.isArray(rows)) return [];
    return rows.map(row => ({
      ...row,
      groupName:
        row?.groupName ||
        row?.group_name ||
        row?.group?.name ||
        row?.group?.label ||
        groupName
    }));
  };

  // O endpoint de standings do BSD para Nations League devolve:
  // groups: { "League A, Group 4": [...], ... }
  // Cada chave identifica directamente o grupo e cada array contém as equipas.
  // Não tratar este objecto como uma lista de grupos, porque Object.entries()
  // é a estrutura real desta resposta.
  if (
    payload &&
    typeof payload === "object" &&
    payload.groups &&
    typeof payload.groups === "object" &&
    !Array.isArray(payload.groups)
  ) {
    return Object.entries(payload.groups).flatMap(([groupName, rows]) =>
      addGroupRows(rows, groupName)
    );
  }

  const groups = Array.isArray(payload?.groups)
    ? payload.groups
    : Array.isArray(payload?.standings?.groups)
      ? payload.standings.groups
      : [];

  if (groups.length) {
    return groups.flatMap((group, index) => {
      const groupName =
        cpcSafeString(
          group?.name ??
          group?.group_name ??
          group?.label ??
          group?.group
        ) ||
        "Grupo " + String.fromCharCode(65 + index);

      const source = Array.isArray(group)
        ? group
        : Array.isArray(group?.standings)
          ? group.standings
          : Array.isArray(group?.table)
            ? group.table
            : Array.isArray(group?.teams)
              ? group.teams
              : Array.isArray(group?.rows)
                ? group.rows
                : [];

      return addGroupRows(source, groupName);
    });
  }

  const standings = Array.isArray(payload?.standings)
    ? payload.standings
    : Array.isArray(payload?.table)
      ? payload.table
      : Array.isArray(payload?.results)
        ? payload.results
        : Array.isArray(payload?.rows)
          ? payload.rows
          : Array.isArray(payload)
            ? payload
            : [];

  if (standings.some(Array.isArray)) {
    return standings.flatMap((group, index) => {
      const groupName =
        cpcSafeString(
          group?.name ??
          group?.group_name ??
          group?.label ??
          group?.group
        ) ||
        "Grupo " + String.fromCharCode(65 + index);

      const rows = Array.isArray(group)
        ? group
        : Array.isArray(group?.standings)
          ? group.standings
          : Array.isArray(group?.table)
            ? group.table
            : Array.isArray(group?.rows)
              ? group.rows
              : [];

      return addGroupRows(rows, groupName);
    });
  }

  return standings;
}
function bsdUnwrapSeason(data) {
  return data?.season || data?.data || data?.result || data || null;
}

function bsdGetSeasonList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.seasons)) return data.seasons;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

function bsdSeasonLabel(season) {
  const explicit = cpcSafeString(season?.name || season?.label);
  if (explicit && !/^\d{4}$/.test(explicit)) return explicit;
  const year = cpcSafeString(season?.year || explicit);
  if (year.includes("/")) return year;
  const startYear = String(season?.start_date || "").slice(0, 4);
  const endYear = String(season?.end_date || "").slice(0, 4);
  if (startYear && endYear) return startYear + "/" + endYear.slice(-2);
  return year || startYear || endYear;
}

function bsdSeasonCoversToday(season, today) {
  const start = cpcSafeString(season?.start_date).slice(0, 10);
  const end = cpcSafeString(season?.end_date).slice(0, 10);
  return (!start || today >= start) && (!end || today <= end);
}

async function bsdResolveCurrentSeason(env, leagueId) {
  const today = new Date().toISOString().slice(0, 10);
  let endpointSeason = null;
  try {
    endpointSeason = bsdUnwrapSeason(
      await bsdFetchJson(env, "https://sports.bzzoiro.com/api/v2/leagues/" + leagueId + "/season/")
    );
  } catch {}

  const endpointId = Number(endpointSeason?.id ?? endpointSeason?.season_id);
  if (Number.isSafeInteger(endpointId) && endpointId > 0) {
    const end = cpcSafeString(endpointSeason?.end_date).slice(0, 10);
    const hasDates = Boolean(endpointSeason?.start_date || endpointSeason?.end_date);
    if (bsdSeasonCoversToday(endpointSeason, today) || (!hasDates && endpointSeason?.is_current !== false && endpointSeason?.current !== false)) {
      return endpointSeason;
    }
  }

  const seasonsData = await bsdFetchJson(
    env,
    "https://sports.bzzoiro.com/api/v2/leagues/" + leagueId + "/seasons/"
  );
  const seasons = bsdGetSeasonList(seasonsData);
  const coveringToday = seasons
    .filter(item => item?.start_date && item?.end_date && bsdSeasonCoversToday(item, today))
    .sort((a, b) => String(b?.start_date || "").localeCompare(String(a?.start_date || "")))[0];
  const currentFlagged = seasons.find(item =>
    (item?.is_current === true || item?.current === true) &&
    (!item?.start_date || String(item.start_date).slice(0, 10) <= today) &&
    (!item?.end_date || String(item.end_date).slice(0, 10) >= today)
  );
  const selected = coveringToday || currentFlagged;
  const selectedId = Number(selected?.id ?? selected?.season_id);
  if (!Number.isSafeInteger(selectedId) || selectedId <= 0) {
    throw new Error("Época atual não encontrada na BSD.");
  }
  return selected;
}

async function bsdFetchEventsForSeason(env, leagueId, seasonId, status, seasonStart, seasonEnd, stage = "", round = null) {
  const todayIso = new Date().toISOString().slice(0, 10);
  const start = seasonStart || todayIso;
  const end = seasonEnd || todayIso;
  const dateFrom = status === "finished" ? start : status === "upcoming" ? (todayIso > start ? todayIso : start) : start;
  const dateTo = status === "finished" ? (todayIso < end ? todayIso : end) : end;
  const results = [];
  let offset = 0;
  const limit = 200;
  for (;;) {
    const params = new URLSearchParams({
      league_id: String(leagueId), season_id: String(seasonId),
      date_from: dateFrom, date_to: dateTo, limit: String(limit), offset: String(offset)
    });
    if (status === "upcoming") params.set("status", "upcoming");
    if (status === "finished") params.set("status", "finished");
    if (stage) params.set("stage", String(stage));
    if (round != null && String(round).trim()) params.set("round", String(round));
    const data = await bsdFetchJson(env, `https://sports.bzzoiro.com/api/v2/events/?${params.toString()}`);
    const page = bsdExtractEvents(data);
    results.push(...page);
    const total = cpcSafeNumber(data?.count);
    if (!page.length || page.length < limit || (total != null && results.length >= total)) break;
    offset += limit;
    if (offset > 5000) break;
  }
  return results;
}

async function bsdFetchLiveEvents(env, leagueId, seasonId, stage = "", round = null) {
  const params = new URLSearchParams({ league_id: String(leagueId), season_id: String(seasonId) });
  if (stage) params.set("stage", String(stage));
  if (round != null && String(round).trim()) params.set("round", String(round));
  const live = bsdExtractEvents(await bsdFetchJson(env, `https://sports.bzzoiro.com/api/v2/events/live/?${params.toString()}`));
  return Promise.all(live.map(event => bsdEnrichLiveEventMetadata(env, event)));
}

function cpcLiveFixtureMatch(candidate, live) {
  const candidateHomeId = cpcSafeNumber(candidate?.homeTeam?.id);
  const candidateAwayId = cpcSafeNumber(candidate?.awayTeam?.id);
  const liveHomeId = cpcSafeNumber(live?.home_team_id ?? live?.homeTeam?.id ?? live?.home_team?.id);
  const liveAwayId = cpcSafeNumber(live?.away_team_id ?? live?.awayTeam?.id ?? live?.away_team?.id);
  if (
    candidateHomeId != null &&
    candidateAwayId != null &&
    liveHomeId != null &&
    liveAwayId != null &&
    candidateHomeId === liveHomeId &&
    candidateAwayId === liveAwayId
  ) {
    return true;
  }

  const normalize = value => String(value || "")
    .toLocaleLowerCase("pt-PT")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const candidateHome = normalize(candidate?.homeTeam?.name);
  const candidateAway = normalize(candidate?.awayTeam?.name);
  const liveHome = normalize(live?.home_team_name ?? live?.homeTeam?.name ?? live?.home_team?.name);
  const liveAway = normalize(live?.away_team_name ?? live?.awayTeam?.name ?? live?.away_team?.name);
  return Boolean(candidateHome && candidateAway && liveHome && liveAway &&
    candidateHome === liveHome && candidateAway === liveAway);
}

async function bsdEnrichLiveEventMetadata(env, event) {
  const eventId = cpcSafeNumber(event?.id ?? event?.event_id);
  if (eventId == null) return event;
  const hasRound = event?.round_number != null || event?.round != null || event?.round_key || event?.round_label || event?.round_name;
  const hasStage = event?.stage != null || event?.stage_key || event?.stage_slug || event?.stage_name;
  if (hasRound && hasStage) return event;
  try {
    const detail = await bsdFetchJson(env, `https://sports.bzzoiro.com/api/v2/events/${eventId}/`);
    return { ...detail, ...event, id: eventId };
  } catch {
    return event;
  }
}

async function bsdFetchLiveIncidents(env, eventId) {
  try {
    const data = await bsdFetchJson(env, `https://sports.bzzoiro.com/api/v2/events/${eventId}/incidents/`);
    return Array.isArray(data?.incidents) ? data.incidents : Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function bsdFootballAdapter(env, competitionKey, options = {}) {
  const competition = CPC_FOOTBALL_COMPETITIONS[competitionKey];
  if (!competition) throw new Error("Competição não suportada.");

  const status = options.status || "upcoming";
  const requestedSeasonId = Number(options.seasonId || 0);
  const currentSeason = await bsdResolveCurrentSeason(env, competition.leagueId);
  const seasonId = Number(currentSeason?.id ?? currentSeason?.season_id);
  const seasonLabel = bsdSeasonLabel(currentSeason);
  const seasonStart = cpcSafeString(currentSeason?.start_date);
  const seasonEnd = cpcSafeString(currentSeason?.end_date);
  if (!Number.isSafeInteger(seasonId) || seasonId <= 0) {
    throw new Error("Época atual não encontrada.");
  }
  if (Number.isSafeInteger(requestedSeasonId) && requestedSeasonId > 0 && requestedSeasonId !== seasonId) {
    throw new Error("Apenas a época atual está disponível.");
  }

  const defaultStageByCompetition = {
    "liga-portugal": "regular-season"
  };
  const stage = options.stage
    ? String(options.stage)
    : (defaultStageByCompetition[competitionKey] || "");
  let eventsData;
  let standingsData;

  try {
    if (status === "live") {
      eventsData = await bsdFetchLiveEvents(env, competition.leagueId, seasonId, stage, options.round);
    } else {
      eventsData = await bsdFetchEventsForSeason(
        env,
        competition.leagueId,
        seasonId,
        status,
        seasonStart,
        seasonEnd,
        stage,
        options.round
      );
    }
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
      const normalized = cpcNormalizeEvent(event, stage);

      if (!normalized.homeTeam.name && normalized.homeTeam.id != null) {
        normalized.homeTeam.name = teamNamesById.get(normalized.homeTeam.id) || "";
      }
      if (!normalized.awayTeam.name && normalized.awayTeam.id != null) {
        normalized.awayTeam.name = teamNamesById.get(normalized.awayTeam.id) || "";
      }

      if (competitionKey === "nations-league") {
        const inferredGroup = cpcNationsGroupForNames(normalized.homeTeam?.name, normalized.awayTeam?.name);
        if (inferredGroup) normalized.groupName = inferredGroup;
      }

      if (normalized.homeTeam.id != null && normalized.homeTeam.name) {
        teamNamesById.set(normalized.homeTeam.id, normalized.homeTeam.name);
      }
      if (normalized.awayTeam.id != null && normalized.awayTeam.name) {
        teamNamesById.set(normalized.awayTeam.id, normalized.awayTeam.name);
      }

      return normalized;
    });

    fixtures = cpcCorrectTacaLigaSchedule(fixtures, seasonId);

    const liveRaw = status === "all" || status === "upcoming"
      ? await bsdFetchLiveEvents(env, competition.leagueId, seasonId, stage, options.round).catch(() => [])
      : [];
    if (liveRaw.length) {
      const liveById = new Map(liveRaw.map(item => [
        cpcSafeNumber(item?.id ?? item?.event_id),
        item
      ]).filter(([id]) => id != null));
      const liveIds = [...liveById.keys()].filter(id => id != null);
      const incidentsById = new Map();
      await Promise.all(liveIds.map(async id => {
        incidentsById.set(id, await bsdFetchLiveIncidents(env, id));
      }));

      const fixturesById = new Map(fixtures.map(item => [item.id, item]));
      liveById.forEach((live, id) => {
        let item = fixturesById.get(id);
        if (!item) {
          item = fixtures.find(candidate => cpcLiveFixtureMatch(candidate, live)) || null;
        }
        if (!item) {
          item = cpcNormalizeEvent(live, stage);
          if (!item.homeTeam.name && item.homeTeam.id != null) {
            item.homeTeam.name = teamNamesById.get(item.homeTeam.id) || "";
          }
          if (!item.awayTeam.name && item.awayTeam.id != null) {
            item.awayTeam.name = teamNamesById.get(item.awayTeam.id) || "";
          }
        }
        if (competitionKey === "nations-league") {
          const inferredGroup = cpcNationsGroupForNames(item.homeTeam?.name, item.awayTeam?.name);
          if (inferredGroup) item.groupName = inferredGroup;
        }

        const liveScoreHome = cpcSafeNumber(live?.home_score ?? live?.score?.home);
        const liveScoreAway = cpcSafeNumber(live?.away_score ?? live?.score?.away);
        const incidents = incidentsById.get(id) || [];
        const goals = incidents
          .filter(incident => {
            const type = String(
              incident?.type ??
              incident?.event_type ??
              incident?.incident_type ??
              incident?.kind ??
              incident?.action_type ??
              ""
            ).toLowerCase();
            return type.includes("goal") && !incident?.rescinded;
          })
          .map(incident => ({
            teamId: cpcSafeNumber(incident?.team_id ??
              incident?.team?.id ??
              (String(incident?.team ?? incident?.side ?? "").toLowerCase()==="home" ? item.homeTeam?.id : String(incident?.team ?? incident?.side ?? "").toLowerCase()==="away" ? item.awayTeam?.id : null)),
            player: cpcSafeString(incident?.player_name ?? incident?.player?.name ?? incident?.player),
            minute: cpcSafeNumber(incident?.minute ?? incident?.min ?? incident?.time?.minute),
            addedTime: cpcSafeNumber(incident?.added_time ?? incident?.added ?? incident?.time?.injury_time),
            periodSecond: cpcSafeNumber(incident?.period_second)
          }));

        fixturesById.set(id, {
          ...item,
          status: "live",
          score: {
            home: liveScoreHome ?? item.score.home,
            away: liveScoreAway ?? item.score.away
          },
          liveMinute: cpcSafeNumber(live?.current_minute ?? live?.minute ?? live?.time?.minute),
          livePeriod: cpcSafeString(live?.period ?? live?.current_period ?? live?.time?.status),
          liveAddedTime: cpcSafeNumber(live?.added_time ?? live?.stoppage_time ?? live?.time?.injury_time),
          halfTimeScore: live?.half_time_score ?? live?.ht_score ?? item.halfTimeScore ?? null,
          extraTimeScore: live?.extra_time_score ?? item.extraTimeScore ?? null,
          penaltyShootout: live?.penalty_shootout ?? item.penaltyShootout ?? null,
          goals
        });
      });
      fixtures = [...fixturesById.values()];
    }
  } catch (error) {
    throw new Error("NORMALIZE_EVENTS:" + (error instanceof Error ? error.message : "unknown"));
  }

  try {
    standings = bsdExtractStandings(standingsData).map(row => {
      const normalized = cpcNormalizeStanding(row);
      if (!normalized.team.name && normalized.team.id != null) {
        normalized.team.name = teamNamesById.get(normalized.team.id) || "";
      }
      if (competitionKey === "nations-league") {
        const inferredGroup = cpcNationsGroupForNames(normalized.team?.name);
        if (inferredGroup) normalized.groupName = inferredGroup;
      }
      return normalized;
    });
  } catch (error) {
    throw new Error("NORMALIZE_STANDINGS:" + (error instanceof Error ? error.message : "unknown"));
  }

  const phase = cpcInferCompetitionPhase(competitionKey, fixtures, standings);

  return {
    competition: {
      key: competitionKey,
      name: competition.name,
      provider: "bsd",
      providerLeagueId: competition.leagueId
    },
    phase,
    season: {
      id: seasonId,
      label: seasonLabel || bsdSeasonLabel({ start_date: seasonStart, end_date: seasonEnd }) || "Época atual",
      startDate: seasonStart || null,
      endDate: seasonEnd || null
    },
    fixtures,
    standings,
    updatedAt: new Date().toISOString(),
    source: "Bzzoiro Sports Data",
    updateStatus: "live"
  };
}

const FOOTBALL_CACHE_FRESH_MS = 15 * 60 * 1000;
const FOOTBALL_CACHE_LIVE_FRESH_MS = 10 * 1000;
const FOOTBALL_CACHE_STALE_MS = 24 * 60 * 60 * 1000;
const footballCacheRefreshes = new Map();

function footballCacheIdentity(competitionKey) {
  if (competitionKey === "nations-league") return "v6-nations|nations-league";
  if (competitionKey === "taca-liga") return "v5-taca-liga";
  return "v3-" + competitionKey;
}

function footballCacheKey(competitionKey, seasonId, stage, round, status = "upcoming") {
  return [
    "bsd",
    footballCacheIdentity(competitionKey),
    seasonId || "auto",
    stage || "",
    round == null ? "" : String(round),
    status || "upcoming"
  ].join("|");
}

async function getLatestFootballCache(env, competitionKey, status) {
  if (!env.FOOTBALL_CACHE_DB) return null;
  const prefix = "bsd|" + footballCacheIdentity(competitionKey) + "|";
  const suffix = "|" + status;
  const row = await env.FOOTBALL_CACHE_DB
    .prepare(
      "SELECT payload_json, fetched_at, expires_at, stale_until FROM football_cache WHERE competition_key = ?1 AND cache_key LIKE ?2 ORDER BY fetched_at DESC LIMIT 1"
    )
    .bind(competitionKey, prefix + "%" + suffix)
    .first();
  if (!row?.payload_json) return null;
  try {
    const payload = JSON.parse(row.payload_json);
    const now = Date.now();
    const expiresAt = Date.parse(row.expires_at);
    const staleUntil = Date.parse(row.stale_until);
    const fetchedAt = Date.parse(row.fetched_at);
    const effectiveExpiresAt = Number.isFinite(fetchedAt)
      ? fetchedAt + FOOTBALL_CACHE_FRESH_MS
      : expiresAt;
    if (!Number.isFinite(staleUntil) || !Number.isFinite(effectiveExpiresAt)) return null;
    if (now <= effectiveExpiresAt) return { payload, state: "fresh" };
    if (now <= staleUntil) return { payload, state: "stale" };
  } catch {}
  return null;
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
    const fetchedAt = Date.parse(row.fetched_at);
    const liveLike = /\|live$/.test(cacheKey);
    const effectiveExpiresAt = Number.isFinite(fetchedAt)
      ? fetchedAt + (liveLike ? FOOTBALL_CACHE_LIVE_FRESH_MS : FOOTBALL_CACHE_FRESH_MS)
      : expiresAt;

    if (!Number.isFinite(expiresAt) || !Number.isFinite(staleUntil) || !Number.isFinite(effectiveExpiresAt)) {
      return null;
    }

    if (now <= effectiveExpiresAt) {
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

function footballCacheSeasonIsCurrent(payload) {
  const today = new Date().toISOString().slice(0, 10);
  const start = String(payload?.season?.startDate || "").slice(0, 10);
  const end = String(payload?.season?.endDate || "").slice(0, 10);
  return Boolean(start && end && today >= start && today <= end);
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
  const cronRefresh = url.searchParams.has("_cron");

  try {
    const cached = cronRefresh ? null : await getFootballCache(env, cacheKey);

    if (cached?.state === "fresh" && footballCacheSeasonIsCurrent(cached.payload)) {
      if ((status === "upcoming" || status === "all") && !round) {
        const liveRaw = await bsdFetchLiveEvents(
          env,
          competition.leagueId,
          Number(cached.payload?.season?.id || seasonId || 0),
          stage,
          null
        ).catch(() => []);

        const liveById = new Map(
          liveRaw
            .map(item => [cpcSafeNumber(item?.id ?? item?.event_id), item])
            .filter(([id]) => id != null)
        );
        const cachedFixtures = Array.isArray(cached.payload.fixtures) ? cached.payload.fixtures : [];
        const merged = [];
        const matchedLiveIds = new Set();

        for (const cachedFixture of cachedFixtures) {
          const id = cpcSafeNumber(cachedFixture?.id);
          const live = id != null ? liveById.get(id) : null;
          const matched = live || liveRaw.find(item => cpcLiveFixtureMatch(cachedFixture, item));
          if (matched) {
            const normalized = cpcNormalizeEvent(matched, stage);
            merged.push({
              ...cachedFixture,
              ...normalized,
              stageKey: cachedFixture?.stageKey || normalized?.stageKey || "",
              stageName: cachedFixture?.stageName || normalized?.stageName || "",
              roundKey: cachedFixture?.roundKey || normalized?.roundKey || "",
              roundLabel: cachedFixture?.roundLabel || normalized?.roundLabel || "",
              status: "live",
              groupName: cachedFixture?.groupName || normalized?.groupName || "",
              score: normalized.score?.home != null || normalized.score?.away != null ? normalized.score : cachedFixture.score
            });
            const matchedId = cpcSafeNumber(matched?.id ?? matched?.event_id);
            if (matchedId != null) matchedLiveIds.add(matchedId);
          } else if (String(cachedFixture?.status || "").toLowerCase() !== "live") {
            const kickoff = Date.parse(cachedFixture?.kickoff || "");
            if (!Number.isFinite(kickoff) || kickoff >= Date.now()) merged.push(cachedFixture);
          }
        }

        for (const live of liveRaw) {
          const liveId = cpcSafeNumber(live?.id ?? live?.event_id);
          if (liveId == null || matchedLiveIds.has(liveId)) continue;
          const scheduled = cachedFixtures.find(candidate => cpcLiveFixtureMatch(candidate, live));
          const normalized = scheduled
            ? { ...scheduled, ...cpcNormalizeEvent(live, stage) }
            : cpcNormalizeEvent(live, stage);
          merged.push({ ...normalized, status: "live" });
        }

        const payload = { ...cached.payload, fixtures: merged, updatedAt: new Date().toISOString(), updateStatus: "live" };
        return json(
          payload,
          200,
          { "Cache-Control": "no-store" }
        );
      }

      return json(
        { ...cached.payload, updateStatus: "cache" },
        200,
        { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" }
      );
    }

    // O cron aquece a competição sem saber previamente o seasonId. Reutilizamos
    // o snapshot mais recente desse status antes de consultar novamente o BSD.
    const latestCached = !cronRefresh && !round ? await getLatestFootballCache(env, competitionKey, status) : null;
    if (
      latestCached?.payload &&
      latestCached.state === "fresh" &&
      footballCacheSeasonIsCurrent(latestCached.payload)
    ) {
      return json(
        { ...latestCached.payload, updateStatus: "cache" },
        200,
        { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" }
      );
    }

    // Uma entrada stale é apenas fallback de segurança. Não a devolvemos
    // antes do refresh, porque isso impediria o Cron de 5 em 5 minutos
    // de renovar a cache quando o TTL de 15 minutos expirasse.

    if (!round && status !== "all") {
      const allKey = footballCacheKey(competitionKey, seasonId, stage, null, "all");
      const allCached = cronRefresh ? null : await getFootballCache(env, allKey);
      if (allCached?.payload && allCached.state === "fresh" && footballCacheSeasonIsCurrent(allCached.payload)) {
        const payload = allCached.payload;
        const now = Date.now();
        const fixtures = Array.isArray(payload.fixtures) ? payload.fixtures.filter(item => {
          const state = String(item?.status || "").toLowerCase().replace(/[ -]+/g, "_");
          const kickoff = Date.parse(item?.kickoff || "");
          if (status === "finished") return ["finished","ended","ft","full_time","completed","aet","penalties"].includes(state);
          if (status === "live") return ["live","in_progress","in_play","inplay","ongoing"].includes(state);
          return ["live","in_progress","in_play","inplay","ongoing"].includes(state) ||
            (Number.isFinite(kickoff) && kickoff >= now);
        }) : [];
        return json(
          { ...payload, fixtures, updateStatus: allCached.state === "fresh" ? "cache" : "stale" },
          200,
          { "Cache-Control": "public, max-age=30, stale-while-revalidate=300" }
        );
      }
    }

    // Cache stale: tentar sempre um refresh BSD. Se o fornecedor falhar,
    // o catch abaixo devolve o snapshot stale como fallback de segurança.
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
    if (cached && footballCacheSeasonIsCurrent(cached.payload)) {
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

    // Se o snapshot do filtro pedido falhar, aproveita o snapshot completo
    // da mesma competição/época e filtra localmente. Isto evita que uma
    // falha transitória do BSD transforme uma troca de competição num erro.
    if (status !== "all" && !round) {
      const allKey = footballCacheKey(competitionKey, seasonId, stage, null, "all");
      const allCached = await getFootballCache(env, allKey);
      if (allCached?.payload && footballCacheSeasonIsCurrent(allCached.payload)) {
        const now = Date.now();
        const fixtures = Array.isArray(allCached.payload.fixtures)
          ? allCached.payload.fixtures.filter(item => {
              const state = String(item?.status || "").toLowerCase().replace(/[ -]+/g, "_");
              const kickoff = Date.parse(item?.kickoff || "");
              if (status === "finished") {
                return ["finished","ended","ft","full_time","completed","aet","penalties"].includes(state);
              }
              if (status === "live") {
                return ["live","in_progress","in_play","inplay","ongoing"].includes(state);
              }
              return ["live","in_progress","in_play","inplay","ongoing"].includes(state) ||
                (Number.isFinite(kickoff) && kickoff >= now);
            })
          : [];
        return json(
          {
            ...allCached.payload,
            fixtures,
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

      if (url.pathname === "/api/analytics/event") {
        return handleAnalyticsEventAPI(request, env);
      }

      if (url.pathname === "/api/article-view") {
        return handleArticleViewAPI(request, env);
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
