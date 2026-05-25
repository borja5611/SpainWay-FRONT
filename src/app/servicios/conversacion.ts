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
  id_itinerario?: number | null;
  id_itinerario_relacionado?: number | null;
}

export interface CrearConversacionPayload {
  id_usuario: number;
  titulo?: string;
  id_itinerario?: number | null;
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


export interface ProcesarMensajeChatPayload {
  contenido: string;
}


export interface PoiRecomendadoChat {
  id_poi?: number | string | null;
  id?: number | string | null;
  id_global?: string | null;
  global_id?: string | null;
  nombre?: string | null;
  name?: string | null;
  titulo?: string | null;
  tipo?: string | null;
  category?: string | null;
  categoria?: string | null;
  subcategoria?: string | null;
  direccion?: string | null;
  address?: string | null;
  latitud?: number | string | null;
  lat?: number | string | null;
  longitud?: number | string | null;
  lon?: number | string | null;
  lng?: number | string | null;
  descripcion?: string | null;
  description?: string | null;
  reason?: string | null;
  google_search_url?: string | null;
  googleUrl?: string | null;
  google_url?: string | null;
  directionsUrl?: string | null;
  directions_url?: string | null;
  municipio?: {
    nombre?: string | null;
    provincia?: {
      nombre?: string | null;
      comunidad?: { nombre?: string | null } | null;
    } | null;
  } | null;
  municipality?: string | null;
  province?: string | null;
  ccaa?: string | null;
  categoria_poi?: { nombre?: string | null } | null;
}

export interface ProcesarMensajeChatResponse {
  user: Mensaje;
  assistant: Mensaje;
  action: string;
  error?: string;
  itinerario?: unknown;
  poi?: unknown;
  pois?: PoiRecomendadoChat[];
  destino?: string | null;
  query?: string | null;
  source?: string | null;
}

export const procesarMensajeChat = (
  idConversacion: number,
  payload: ProcesarMensajeChatPayload
) =>
  apiPost<ProcesarMensajeChatResponse, ProcesarMensajeChatPayload>(
    `/api/chat-acciones/${idConversacion}/procesar`,
    payload
  );
