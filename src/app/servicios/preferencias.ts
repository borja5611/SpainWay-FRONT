import { apiGet, apiPatch, apiPost } from "./api";

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

// Rutas protegidas (`/api/preferencias/:id_usuario`, `/api/usuarios/:id`):
// el cliente api.ts adjunta el token JWT del usuario autenticado en cada llamada.
export async function getPreferencias(idUsuario: number): Promise<PreferenciasUsuario> {
  return apiGet<PreferenciasUsuario>(`/api/preferencias/${idUsuario}`);
}

export async function crearPreferencias(
  payload: Omit<PreferenciasUsuario, "id_user_preference">
): Promise<PreferenciasUsuario> {
  return apiPost<PreferenciasUsuario, Omit<PreferenciasUsuario, "id_user_preference">>(
    "/api/preferencias",
    payload
  );
}

export async function actualizarPreferencias(
  idUsuario: number,
  payload: Partial<Omit<PreferenciasUsuario, "id_user_preference" | "id_usuario">>
): Promise<PreferenciasUsuario> {
  return apiPatch<
    PreferenciasUsuario,
    Partial<Omit<PreferenciasUsuario, "id_user_preference" | "id_usuario">>
  >(`/api/preferencias/${idUsuario}`, payload);
}

export async function getUsuarioResumen(idUsuario: number): Promise<unknown> {
  return apiGet<unknown>(`/api/usuarios/${idUsuario}`);
}
