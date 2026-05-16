const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("VITE_API_URL no está definida en el .env del front");
}

export interface PreferenciasUsuario {
  id_user_preference?: number;
  id_usuario: number;
  presupuesto: number | null;
  modo_transporte: string | null;
  accesibilidad: string | null;
  con_ninos: boolean | null;
  estilo_viaje: string | null;
  intereses: string | null;
}

export async function getPreferencias(idUsuario: number): Promise<PreferenciasUsuario> {
  const response = await fetch(`${API_URL}/api/preferencias/${idUsuario}`);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error obteniendo preferencias: ${response.status} ${text}`);
  }

  return response.json() as Promise<PreferenciasUsuario>;
}

export async function crearPreferencias(
  payload: Omit<PreferenciasUsuario, "id_user_preference">
): Promise<PreferenciasUsuario> {
  const response = await fetch(`${API_URL}/api/preferencias`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error creando preferencias: ${response.status} ${text}`);
  }

  return response.json() as Promise<PreferenciasUsuario>;
}

export async function actualizarPreferencias(
  idUsuario: number,
  payload: Partial<Omit<PreferenciasUsuario, "id_user_preference" | "id_usuario">>
): Promise<PreferenciasUsuario> {
  const response = await fetch(`${API_URL}/api/preferencias/${idUsuario}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error actualizando preferencias: ${response.status} ${text}`);
  }

  return response.json() as Promise<PreferenciasUsuario>;
}

export async function getUsuarioResumen(idUsuario: number): Promise<unknown> {
  const response = await fetch(`${API_URL}/api/usuarios/${idUsuario}`);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error obteniendo resumen de usuario: ${response.status} ${text}`);
  }

  return response.json() as Promise<unknown>;
}
