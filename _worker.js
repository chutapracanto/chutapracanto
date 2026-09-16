const SESSION_MAX_AGE = 8 * 60 * 60;
const GITHUB_API = "https://api.github.com";
const GITHUB_OWNER = "chutapracanto";
const GITHUB_REPO = "chutapracanto";
const GITHUB_BRANCH = "main";

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

function getCookie(request, name) {
  const cookieHeader = request.headers.get("Cookie") || "";

  const cookies = cookieHeader.split(";");

  for (const cookie of cookies) {
    const [key, ...valueParts] = cookie.trim().split("=");

    if (key === name) {
      return decodeURIComponent(valueParts.join("="));
    }
  }

  return null;
}

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
  const session = getCookie(request, "cpc_session");

  if (!session) {
    return false;
  }

  const parts = session.split(".");

  if (parts.length !== 2) {
    return false;
  }

  const timestamp = Number(parts[0]);
  const signature = parts[1];

  if (!Number.isFinite(timestamp)) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);

  if (now - timestamp < 0 || now - timestamp > SESSION_MAX_AGE) {
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
    `cpc_session=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Strict",
    `Max-Age=${SESSION_MAX_AGE}`
  ].join("; ");
}

function clearSessionCookie() {
  return [
    "cpc_session=",
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Strict",
    "Max-Age=0"
  ].join("; ");
}

async function githubRequest(env, path, options = {}) {
  const token = env.GITHUB_TOKEN;

  if (!token) {
    throw new Error("GITHUB_TOKEN não está configurado no Cloudflare.");
  }

  const headers = {
    "Authorization": `Bearer ${token}`,
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...options.headers
  };

  return fetch(`${GITHUB_API}${path}`, {
    ...options,
    headers
  });
}

function isAllowedContentPath(path) {
  return (
    path.startsWith("content/noticias/") ||
    path.startsWith("images/uploads/")
  );
}

async function requireAuth(request, env) {
  if (!env.ADMIN_PASSWORD) {
    return json(
      {
        error: "ADMIN_PASSWORD não está configurada no Cloudflare."
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
        error: "Não autenticado."
      },
      401
    );
  }

  return null;
}

async function handleAdminAPI(request, env) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (pathname === "/api/admin/login") {
    if (request.method !== "POST") {
      return json({ error: "Método não permitido." }, 405);
    }

    if (!env.ADMIN_PASSWORD) {
      return json(
        {
          error: "ADMIN_PASSWORD não está configurada."
        },
        500
      );
    }

    let body;

    try {
      body = await request.json();
    } catch {
      return json({ error: "Pedido inválido." }, 400);
    }

    const password = typeof body.password === "string"
      ? body.password
      : "";

    if (!password || password !== env.ADMIN_PASSWORD) {
      return json(
        {
          error: "Password incorreta."
        },
        401
      );
    }

    const session = await createSession(env.ADMIN_PASSWORD);

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

  if (pathname === "/api/admin/logout") {
    if (request.method !== "POST") {
      return json({ error: "Método não permitido." }, 405);
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

  if (pathname === "/api/admin/session") {
    if (request.method !== "GET") {
      return json({ error: "Método não permitido." }, 405);
    }

    const authError = await requireAuth(request, env);

    if (authError) {
      return authError;
    }

    return json({
      authenticated: true
    });
  }

  if (!pathname.startsWith("/api/admin/")) {
    return null;
  }

  const authError = await requireAuth(request, env);

  if (authError) {
    return authError;
  }

  if (pathname === "/api/admin/news/list") {
    if (request.method !== "GET") {
      return json({ error: "Método não permitido." }, 405);
    }

    const page = Math.max(
      1,
      Number(url.searchParams.get("page") || "1")
    );

    const perPage = 100;

    const githubResponse = await githubRequest(
      env,
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/content/noticias?ref=${encodeURIComponent(GITHUB_BRANCH)}&per_page=${perPage}&page=${page}`,
      {
        method: "GET"
      }
    );

    const data = await githubResponse.json();

    return json(data, githubResponse.status);
  }

  if (pathname === "/api/admin/news") {
    const path = url.searchParams.get("path");

    if (!path || !isAllowedContentPath(path)) {
      return json(
        {
          error: "Caminho não permitido."
        },
        400
      );
    }

    if (!["GET", "PUT", "DELETE"].includes(request.method)) {
     
     if (pathname === "/api/admin/image") {
    const path = url.searchParams.get("path");

    if (
      !path ||
      !path.startsWith("images/uploads/") ||
      path.includes("..") ||
      path.includes("\\")
    ) {
      return json(
        {
          error: "Caminho de imagem não permitido."
        },
        400
      );
    }

    if (!["PUT", "DELETE", "GET"].includes(request.method)) {
      return json(
        {
          error: "Método não permitido."
        },
        405
      );
    }

    const githubPath =
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;

    if (request.method === "GET") {
      const githubResponse = await githubRequest(
        env,
        `${githubPath}?ref=${encodeURIComponent(GITHUB_BRANCH)}`,
        {
          method: "GET"
        }
      );

      const data = await githubResponse.json();

      return json(data, githubResponse.status);
    }

    const body = await request.text();

    const githubResponse = await githubRequest(
      env,
      githubPath,
      {
        method: request.method,
        headers: {
          "Content-Type": "application/json"
        },
        body
      }
    );

    const data = await githubResponse.json();

    return json(data, githubResponse.status);
  }   
      return json(
        {
          error: "Método não permitido."
        },
        405
      );
    }

    const githubPath =
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;

    if (request.method === "GET") {
      const githubResponse = await githubRequest(
        env,
        `${githubPath}?ref=${encodeURIComponent(GITHUB_BRANCH)}`,
        {
          method: "GET"
        }
      );

      const data = await githubResponse.json();

      return json(data, githubResponse.status);
    }

    const body = await request.text();

    const githubResponse = await githubRequest(
      env,
      githubPath,
      {
        method: request.method,
        headers: {
          "Content-Type": "application/json"
        },
        body
      }
    );

    const data = await githubResponse.json();

    return json(data, githubResponse.status);
  }

  return json(
    {
      error: "Endpoint não encontrado."
    },
    404
  );
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/admin/")) {
      const response = await handleAdminAPI(request, env);

      if (response) {
        return response;
      }
    }

    return env.ASSETS.fetch(request);
  }
};
