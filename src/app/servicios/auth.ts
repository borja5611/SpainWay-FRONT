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

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
    const decoded = atob(padded);

    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function usuarioDesdeToken(token: string | null): UsuarioAuth | null {
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  const id = Number(payload?.id_usuario ?? payload?.sub ?? payload?.userId);

  if (!Number.isInteger(id) || id <= 0) return null;

  return {
    id_usuario: id,
    nombre: String(payload?.nombre ?? payload?.nombre_usuario ?? "Usuario"),
    nombre_usuario: payload?.nombre_usuario ? String(payload.nombre_usuario) : null,
    email: payload?.email ? String(payload.email) : "",
    telefono: null,
    rol: payload?.rol ? String(payload.rol) : "user",
  };
}


export interface RegistroAvailabilityResponse {
  email: { value: string; available: boolean };
  nombre_usuario: { value: string; available: boolean };
  telefono: { value: string | null; available: boolean };
}

export async function comprobarDisponibilidadRegistro(params: {
  email?: string;
  nombre_usuario?: string;
  telefono?: string;
}): Promise<RegistroAvailabilityResponse> {
  const query = new URLSearchParams();
  if (params.email) query.set("email", params.email);
  if (params.nombre_usuario) query.set("nombre_usuario", params.nombre_usuario);
  if (params.telefono) query.set("telefono", params.telefono);

  const response = await fetch(`${API_URL}/api/auth/availability?${query.toString()}`);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error comprobando disponibilidad: ${response.status} ${text}`);
  }
  return response.json() as Promise<RegistroAvailabilityResponse>;
}

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
  const token = obtenerTokenGuardado();
  const response = await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
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

  // Compatibilidad con código anterior o stores persistidos.
  localStorage.setItem("token", auth.token);
  localStorage.setItem("access_token", auth.token);
}

export function limpiarSesion() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("token");
  localStorage.removeItem("access_token");
  localStorage.removeItem("usuario");
  localStorage.removeItem("user");
  localStorage.removeItem("spainway-auth");
}

export function obtenerTokenGuardado(): string | null {
  const tokenDirecto =
    localStorage.getItem(TOKEN_KEY) ??
    localStorage.getItem("token") ??
    localStorage.getItem("access_token");

  if (tokenDirecto) return tokenDirecto;

  const authStorage = safeJsonParse<{
    state?: { token?: string | null };
    token?: string | null;
  }>(localStorage.getItem("spainway-auth"));

  return authStorage?.state?.token ?? authStorage?.token ?? null;
}

export function obtenerUsuarioGuardado(): UsuarioAuth | null {
  const usuarioDirecto =
    safeJsonParse<UsuarioAuth>(localStorage.getItem(USER_KEY)) ??
    safeJsonParse<UsuarioAuth>(localStorage.getItem("usuario")) ??
    safeJsonParse<UsuarioAuth>(localStorage.getItem("user"));

  if (usuarioDirecto?.id_usuario) return usuarioDirecto;

  const authStorage = safeJsonParse<{
    state?: { usuario?: UsuarioAuth | null; user?: UsuarioAuth | null };
    usuario?: UsuarioAuth | null;
    user?: UsuarioAuth | null;
  }>(localStorage.getItem("spainway-auth"));

  const usuarioAuth =
    authStorage?.state?.usuario ??
    authStorage?.state?.user ??
    authStorage?.usuario ??
    authStorage?.user ??
    null;

  if (usuarioAuth?.id_usuario) return usuarioAuth;

  return usuarioDesdeToken(obtenerTokenGuardado());
}


const IA_WAKE_KEY = "spainway_ia_last_wake_at";
const IA_WAKE_MIN_INTERVAL_MS = 45_000;

export async function despertarServicioIA(options?: { force?: boolean }): Promise<void> {
  const force = options?.force === true;
  const now = Date.now();
  const lastWake = Number(localStorage.getItem(IA_WAKE_KEY) ?? "0");

  if (!force && Number.isFinite(lastWake) && now - lastWake < IA_WAKE_MIN_INTERVAL_MS) {
    return;
  }

  localStorage.setItem(IA_WAKE_KEY, String(now));

  try {
    await fetch(`${API_URL}/api/health/wake-ia`, {
      method: "GET",
      keepalive: true,
      cache: "no-store",
    });
  } catch (error) {
    // El login/registro no debe fallar si Render todavía está despertando la IA.
    console.info("Wake-up IA lanzado en segundo plano:", error);
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
