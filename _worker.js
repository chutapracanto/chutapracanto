const SESSION_MAX_AGE = 8 * 60 * 60;

const GITHUB_API = "https://api.github.com";
const GITHUB_OWNER = "chutapracanto";
const GITHUB_REPO = "chutapracanto";
const GITHUB_BRANCH = "main";

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

  return /^content\/noticias\/[^/]+\.md$/i.test(path);
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
  if (!imagem) {
    return `${origin}/images/logo.png`;
  }

  if (/^https?:\/\//i.test(imagem)) {
    return imagem;
  }

  if (imagem.startsWith("//")) {
    return `${new URL(origin).protocol}${imagem}`;
  }

  if (imagem.startsWith("/")) {
    return `${origin}${imagem}`;
  }

  return `${origin}/${imagem}`;
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

  const path =
    `content/noticias/${slug}.md`;

  if (!isAllowedNewsPath(path)) {
    return null;
  }

  try {
    const githubResponse =
      await githubRequest(
        env,
        `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(GITHUB_BRANCH)}`,
        {
          method: "GET"
        }
      );

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

    return {
      title,
      descricao,
      imagemUrl,
      noticiaUrl
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
        "title",
        {
          text(text) {
            text.replace(
              `${dados.title} | ChutaPraCanto`,
              true
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

    const pageValue =
      Number(
        url.searchParams.get("page") || "1"
      );

    const page =
      Number.isFinite(pageValue) && pageValue >= 1
        ? Math.floor(pageValue)
        : 1;

    const perPage = 100;

    const githubResponse =
      await githubRequest(
        env,
        `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/content/noticias?ref=${encodeURIComponent(GITHUB_BRANCH)}&per_page=${perPage}&page=${page}`,
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
        error: responseText || "Resposta inválida do GitHub."
      };
    }

    if (!githubResponse.ok) {
      return json(
        data,
        githubResponse.status
      );
    }

    if (!Array.isArray(data)) {
      return json(
        data,
        githubResponse.status
      );
    }

    // Apenas ficheiros Markdown de notícias
    const noticias = data.filter(
      (item) =>
        item &&
        typeof item.path === "string" &&
        isAllowedNewsPath(item.path)
    );

    // Acrescenta dataNoticia ao objeto devolvido
    const noticiasEnriquecidas =
      await enriquecerNoticias(
        env,
        noticias
      );

    return json(
      noticiasEnriquecidas,
      githubResponse.status
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
          error: "Caminho de notícia não permitido.",
          message: "Caminho de notícia não permitido."
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
          `${githubPath}?ref=${encodeURIComponent(GITHUB_BRANCH)}`,
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
    const body =
      await request.text();

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
          `${githubPath}?ref=${encodeURIComponent(GITHUB_BRANCH)}`,
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
    const body =
      await request.text();

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
        url.pathname.startsWith(
          "/api/admin/"
        )
      ) {
        const response =
          await handleAdminAPI(
            request,
            env
          );

        if (response) {
          return response;
        }
      }

      const assetResponse =
        await env.ASSETS.fetch(request);

      const responseComPartilha =
        await prepararPaginaParaPartilha(
          request,
          env,
          assetResponse
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
