// src/app/servicios/api.ts

import { obtenerTokenGuardado, limpiarSesion } from "./auth";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("VITE_API_URL no está definida en el .env del front");
}

function authHeaders(token?: string): HeadersInit {
  const finalToken = token ?? obtenerTokenGuardado();

  return finalToken
    ? {
        Authorization: `Bearer ${finalToken}`,
      }
    : {};
}

async function handleResponse<T>(response: Response, url: string, method: string): Promise<T> {
  if (response.status === 401) {
    // Si el backend dice no autorizado, la sesión local ya no vale.
    // Esto evita quedarnos haciendo llamadas con un token roto.
    limpiarSesion();
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error ${method} ${url}: ${response.status} ${text}`);
  }

  if (response.status === 204) {
    return undefined as T;
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
