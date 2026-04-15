const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("VITE_API_URL no está definida en el .env del front");
}

export interface UsuarioAuth {
  id_usuario: number;
  nombre: string;
  nombre_usuario: string | null;
  email: string;
  telefono: string | null;
  rol: string;
}

export interface AuthResponse {
  token: string;
  usuario: UsuarioAuth;
}

export interface RegisterPayload {
  nombre: string;
  nombre_usuario: string;
  email: string;
  telefono?: string;
  password: string;
}

export interface LoginPayload {
  emailOrUsername: string;
  password: string;
}

const TOKEN_KEY = "spainway_token";
const USER_KEY = "spainway_user";

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error en registro: ${response.status} ${text}`);
  }

  return response.json() as Promise<AuthResponse>;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error en login: ${response.status} ${text}`);
  }

  return response.json() as Promise<AuthResponse>;
}

export async function me(token: string): Promise<UsuarioAuth> {
  const response = await fetch(`${API_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error en /me: ${response.status} ${text}`);
  }

  return response.json() as Promise<UsuarioAuth>;
}

export async function logout(): Promise<{ ok: boolean; message: string }> {
  const response = await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error en logout: ${response.status} ${text}`);
  }

  return response.json() as Promise<{ ok: boolean; message: string }>;
}

export function guardarSesion(auth: AuthResponse) {
  localStorage.setItem(TOKEN_KEY, auth.token);
  localStorage.setItem(USER_KEY, JSON.stringify(auth.usuario));
}

export function limpiarSesion() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function obtenerTokenGuardado(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function obtenerUsuarioGuardado(): UsuarioAuth | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as UsuarioAuth;
  } catch {
    return null;
  }
}


export function getSocialAuthUrl(provider: "google" | "facebook" | "linkedin") {
  return `${API_URL}/api/auth/${provider}`;
}