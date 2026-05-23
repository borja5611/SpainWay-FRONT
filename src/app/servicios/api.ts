// src/app/servicios/api.ts

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("VITE_API_URL no está definida en el .env del front");
}

function getStoredToken(): string | null {
  try {
    const authStorage = localStorage.getItem("spainway-auth");
    if (authStorage) {
      const parsed = JSON.parse(authStorage) as {
        state?: { token?: string | null };
        token?: string | null;
      };

      const token = parsed.state?.token ?? parsed.token ?? null;
      if (token) return token;
    }

    return localStorage.getItem("token") ?? localStorage.getItem("access_token");
  } catch {
    return localStorage.getItem("token") ?? localStorage.getItem("access_token");
  }
}

function authHeaders(token?: string): HeadersInit {
  const finalToken = token ?? getStoredToken();

  return finalToken
    ? {
        Authorization: `Bearer ${finalToken}`,
      }
    : {};
}

async function handleResponse<T>(response: Response, url: string, method: string): Promise<T> {
  if (response.status === 401) {
    try {
      localStorage.removeItem("spainway-auth");
      localStorage.removeItem("token");
      localStorage.removeItem("access_token");
    } catch {
      // No hacemos nada: limpiar localStorage no debe romper la app.
    }
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error ${method} ${url}: ${response.status} ${text}`);
  }

  return response.json() as Promise<T>;
}

export async function apiGet<T>(url: string, token?: string): Promise<T> {
  const response = await fetch(`${API_URL}${url}`, {
    method: "GET",
    headers: {
      ...authHeaders(token),
    },
  });

  return handleResponse<T>(response, url, "GET");
}

export async function apiPost<TResponse, TBody>(
  url: string,
  body: TBody,
  token?: string
): Promise<TResponse> {
  const response = await fetch(`${API_URL}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(body),
  });

  return handleResponse<TResponse>(response, url, "POST");
}

export async function apiPatch<TResponse, TBody>(
  url: string,
  body: TBody,
  token?: string
): Promise<TResponse> {
  const response = await fetch(`${API_URL}${url}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(body),
  });

  return handleResponse<TResponse>(response, url, "PATCH");
}

export async function apiDelete<TResponse>(
  url: string,
  token?: string
): Promise<TResponse> {
  const response = await fetch(`${API_URL}${url}`, {
    method: "DELETE",
    headers: {
      ...authHeaders(token),
    },
  });

  return handleResponse<TResponse>(response, url, "DELETE");
}
