import { apiDelete, apiGet, apiPost } from "./api";

export type RolMensaje = "user" | "assistant" | "system";

export interface Mensaje {
  id_mensaje: number;
  rol: RolMensaje | string | null;
  contenido: string | null;
  creado: string | null;
  id_conversacion: number;
}

export interface Conversacion {
  id_conversacion: number;
  titulo: string | null;
  creado: string | null;
  id_usuario: number;
  mensajes?: Mensaje[];
  ultimo_mensaje?: string | null;
  total_mensajes?: number;
}

export interface CrearConversacionPayload {
  id_usuario: number;
  titulo?: string;
}

export interface CrearMensajePayload {
  id_conversacion: number;
  rol: RolMensaje | string;
  contenido: string;
}

export interface DeleteResponse {
  ok: boolean;
  message: string;
}

export const getConversaciones = (idUsuario: number) =>
  apiGet<Conversacion[]>(`/api/conversaciones/${idUsuario}`);

export const getConversacionDetalle = (idConversacion: number) =>
  apiGet<Conversacion>(`/api/conversaciones/detalle/${idConversacion}`);

export const crearConversacion = (payload: CrearConversacionPayload) =>
  apiPost<Conversacion, CrearConversacionPayload>("/api/conversaciones", payload);

export const eliminarConversacion = (idConversacion: number) =>
  apiDelete<DeleteResponse>(`/api/conversaciones/${idConversacion}`);

export const getMensajes = (idConversacion: number) =>
  apiGet<Mensaje[]>(`/api/mensajes/${idConversacion}`);

export const crearMensaje = (payload: CrearMensajePayload) =>
  apiPost<Mensaje, CrearMensajePayload>("/api/mensajes", payload);
