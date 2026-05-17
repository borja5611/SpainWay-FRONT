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
const LOGIN_AT_KEY = "spainway_login_at";
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

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
  localStorage.setItem(LOGIN_AT_KEY, Date.now().toString());
}

export function limpiarSesion() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(LOGIN_AT_KEY);
}

function sesionCaducada(): boolean {
  const loginAt = Number(localStorage.getItem(LOGIN_AT_KEY));

  if (!loginAt) return false;

  return Date.now() - loginAt > SESSION_DURATION_MS;
}

export function obtenerTokenGuardado(): string | null {
  if (sesionCaducada()) {
    limpiarSesion();
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
}

export function obtenerUsuarioGuardado(): UsuarioAuth | null {
  if (sesionCaducada()) {
    limpiarSesion();
    return null;
  }

  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as UsuarioAuth;
  } catch {
    limpiarSesion();
    return null;
  }
}

export interface SolicitarResetResponse {
  ok: boolean;
  message: string;
  email?: string;
  devCode?: string;
}

export interface VerificarResetResponse {
  ok: boolean;
  resetToken: string;
}

export async function solicitarRecuperacionContrasena(email: string): Promise<SolicitarResetResponse> {
  const response = await fetch(`${API_URL}/api/auth/password/forgot`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = (await response.json().catch(() => ({}))) as SolicitarResetResponse;

  if (!response.ok) {
    throw new Error(data.message || "No se pudo iniciar la recuperación de contraseña.");
  }

  return data;
}

export async function verificarCodigoRecuperacion(email: string, code: string): Promise<VerificarResetResponse> {
  const response = await fetch(`${API_URL}/api/auth/password/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, code }),
  });

  const data = (await response.json().catch(() => ({}))) as VerificarResetResponse & { message?: string };

  if (!response.ok) {
    throw new Error(data.message || "El código no es válido o ha caducado.");
  }

  return data;
}

export async function cambiarContrasenaConToken(resetToken: string, password: string): Promise<{ ok: boolean; message: string }> {
  const response = await fetch(`${API_URL}/api/auth/password/reset`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ resetToken, password }),
  });

  const data = (await response.json().catch(() => ({}))) as { ok: boolean; message: string };

  if (!response.ok) {
    throw new Error(data.message || "No se pudo actualizar la contraseña.");
  }

  return data;
}

export function getSocialAuthUrl(provider: "google" | "facebook" | "linkedin") {
  return `${API_URL}/api/auth/${provider}`;
}