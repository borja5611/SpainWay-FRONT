// src/app/servicios/api.ts

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("VITE_API_URL no está definida en el .env del front");
}

export async function apiGet<T>(url: string, token?: string): Promise<T> {
  const response = await fetch(`${API_URL}${url}`, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error GET ${url}: ${response.status} ${text}`);
  }

  return response.json() as Promise<T>;
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
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error POST ${url}: ${response.status} ${text}`);
  }

  return response.json() as Promise<TResponse>;
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
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error PATCH ${url}: ${response.status} ${text}`);
  }

  return response.json() as Promise<TResponse>;
}

export async function apiDelete<TResponse>(
  url: string,
  token?: string
): Promise<TResponse> {
  const response = await fetch(`${API_URL}${url}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error DELETE ${url}: ${response.status} ${text}`);
  }

  return response.json() as Promise<TResponse>;
}