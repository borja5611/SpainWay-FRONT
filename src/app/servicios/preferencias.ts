// src/app/servicios/preferencias.ts
import { apiGet, apiPatch, apiPost } from "./api";

export interface Preferencias {
  id_user_preference: number;
  presupuesto: number | null;
  modo_transporte: string | null;
  accesibilidad: string | null;
  con_ninos: boolean | null;
  estilo_viaje: string | null;
  intereses: string | null;
  id_usuario: number;
}

export interface CrearPreferenciasPayload {
  id_usuario: number;
  presupuesto?: number;
  modo_transporte?: string;
  accesibilidad?: string;
  con_ninos?: boolean;
  estilo_viaje?: string;
  intereses?: string;
}

export interface ActualizarPreferenciasPayload {
  presupuesto?: number;
  modo_transporte?: string;
  accesibilidad?: string;
  con_ninos?: boolean;
  estilo_viaje?: string;
  intereses?: string;
}

export interface UsuarioResumen {
  usuario: {
    id_usuario: number;
    nombre: string;
    email: string;
    rol: string;
    creado: string;
    actualizado: string;
    preferencias: Preferencias | null;
  };
  resumen: {
    totalFavoritos: number;
    totalItinerarios: number;
    totalConversaciones: number;
  };
}

export const getPreferencias = (idUsuario: number) =>
  apiGet<Preferencias>(`/api/preferencias/${idUsuario}`);

export const getUsuarioResumen = (idUsuario: number) =>
  apiGet<UsuarioResumen>(`/api/usuarios/${idUsuario}/resumen`);

export const crearPreferencias = (payload: CrearPreferenciasPayload) =>
  apiPost<Preferencias, CrearPreferenciasPayload>("/api/preferencias", payload);

export const actualizarPreferencias = (
  idUsuario: number,
  payload: ActualizarPreferenciasPayload
) =>
  apiPatch<Preferencias, ActualizarPreferenciasPayload>(
    `/api/preferencias/${idUsuario}`,
    payload
  );