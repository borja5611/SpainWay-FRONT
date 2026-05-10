import { apiDelete, apiGet, apiPatch, apiPost } from "./api";

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export interface PoiItinerario {
  id_poi: number;
  nombre: string;
  id_global: string;
  tipo?: string | null;
  subcategoria?: string | null;
  direccion?: string | null;
  latitud?: number | null;
  longitud?: number | null;
  descripcion?: string | null;
  google_search_url?: string | null;
  categoria_poi?: {
    id_categoria_poi: number;
    nombre: string;
    slug?: string;
  } | null;
  municipio?: {
    id_municipio: number;
    nombre: string;
  } | null;
  destacados_ccaa?: Array<{
    id_poi_destacado_ccaa: number;
    imagen_url?: string | null;
    motivo?: string | null;
    comunidad?: string | null;
  }>;
}

export interface ElementoItinerario {
  id_elemento_itinerario: number;
  inicio: string | null;
  fin: string | null;
  orden: number | null;
  transporte: string | null;
  tiempo_transporte: number | null;
  id_dia_itinerario: number;
  id_poi: number;
  poi?: PoiItinerario;
}

export interface EventoTuristicoItinerario {
  id_evento_turistico: number;
  external_id: string;
  source?: string | null;
  nombre: string;
  descripcion?: string | null;
  categoria?: string | null;
  venue_nombre?: string | null;
  direccion?: string | null;
  ciudad?: string | null;
  latitud?: number | null;
  longitud?: number | null;
  inicio?: string | null;
  fin?: string | null;
  imagen_url?: string | null;
  url?: string | null;
}

export interface ItinerarioEvento {
  id_itinerario_evento: number;
  id_itinerario: number;
  id_dia_itinerario: number;
  orden: number | null;
  inicio_sugerido: string | null;
  fin_sugerido: string | null;
  score_recomendacion: number | null;
  motivo: string | null;
  evento_turistico?: EventoTuristicoItinerario;
}

export interface DiaItinerario {
  id_dia_itinerario: number;
  fecha: string | null;
  minutos: number | null;
  notas: string | null;
  id_itinerario: number;
  elementos?: ElementoItinerario[];
  eventos?: ItinerarioEvento[];
}

export interface IaPoiPlan {
  global_id?: string;
  id_global?: string;
  name?: string;
  nombre?: string;
  reason?: string;
  motivo?: string;
  image_url?: string;
  imagen_url?: string;
  google_search_url?: string;
}

export interface IaDayPlan {
  day_number?: number;
  dia?: number;
  theme?: string;
  titulo?: string;
  total_minutes?: number | null;
  minutos?: number | null;
  pois?: IaPoiPlan[];
  items?: IaPoiPlan[];
  local_tips?: string[];
  consejos?: string[];
}

export interface IaJsonItinerario {
  destination?: string;
  days?: number;
  summary?: string;
  resumen?: string;
  anchors_used?: string[];
  day_plans?: IaDayPlan[];
  dias?: IaDayPlan[];
  generated_at?: string;
  live_events?: unknown[];
  live_events_by_day?: unknown[];
  [key: string]: unknown;
}

export interface Itinerario {
  id_itinerario: number;
  titulo: string | null;
  destino: string | null;
  inicio: string | null;
  fin: string | null;
  presupuesto: number | null;
  transporte: string | null;
  accesibilidad: string | null;
  estado: string | null;
  creado: string | null;
  actualizado: string | null;
  id_usuario: number;
  base_nombre?: string | null;
  base_direccion?: string | null;
  base_latitud?: number | null;
  base_longitud?: number | null;
  permite_excursiones?: boolean;
  radio_max_km?: number | null;
  ia_json?: IaJsonItinerario | null;
  ia_resumen?: string | null;
  preferencias_json?: JsonValue | null;
  dias?: DiaItinerario[];
}

export interface CrearItinerarioPayload {
  id_usuario: number;
  titulo: string;
  destino: string;
  inicio: string;
  fin: string;
  presupuesto?: number;
  transporte?: string;
  accesibilidad?: string;
  estado?: string;
}

export interface ActualizarItinerarioPayload {
  titulo?: string;
  destino?: string;
  inicio?: string;
  fin?: string;
  presupuesto?: number;
  transporte?: string;
  accesibilidad?: string;
  estado?: string;
}

export interface DeleteResponse {
  ok: boolean;
  message: string;
}

export const getItinerarios = (idUsuario: number) =>
  apiGet<Itinerario[]>(`/api/itinerarios/${idUsuario}`);

export const getItinerariosResumen = (idUsuario: number) =>
  apiGet<Itinerario[]>(`/api/itinerarios/resumen/${idUsuario}`);

export const getItinerarioDetalle = (idItinerario: number) =>
  apiGet<Itinerario>(`/api/itinerarios/detalle/${idItinerario}`);

export const crearItinerario = (payload: CrearItinerarioPayload) =>
  apiPost<Itinerario, CrearItinerarioPayload>("/api/itinerarios", payload);

export const actualizarItinerario = (
  idItinerario: number,
  payload: ActualizarItinerarioPayload
) =>
  apiPatch<Itinerario, ActualizarItinerarioPayload>(
    `/api/itinerarios/${idItinerario}`,
    payload
  );

export const eliminarItinerario = (idItinerario: number) =>
  apiDelete<DeleteResponse>(`/api/itinerarios/${idItinerario}`);


export type AccionManualItinerario =
  | { action: "remove"; dayNumber: number; poiId?: number; poiName?: string }
  | { action: "insert"; dayNumber: number; index?: number; poiId?: number; poiGlobalId?: string; poiName?: string; query?: string }
  | { action: "swap"; dayNumber: number; fromIndex: number; toIndex: number }
  | { action: "move"; fromDayNumber: number; toDayNumber: number; poiId?: number; poiName?: string; index?: number }
  | { action: "replace"; dayNumber: number; oldPoiId?: number; oldPoiName?: string; newPoiId?: number; newPoiGlobalId?: string; newPoiName?: string; query?: string };

export interface RespuestaAccionManualItinerario {
  ok: boolean;
  resultado: unknown;
}

export interface RespuestaRegenerarDia {
  ok: boolean;
  itinerario: Itinerario;
  resumen: string;
}

export const aplicarAccionManualItinerario = (
  idItinerario: number,
  payload: AccionManualItinerario
) =>
  apiPost<RespuestaAccionManualItinerario, AccionManualItinerario>(
    `/api/itinerarios/${idItinerario}/acciones/manual`,
    payload
  );

export const regenerarDiaItinerario = (
  idItinerario: number,
  payload: { dayNumber: number; mensaje?: string; message?: string }
) =>
  apiPost<RespuestaRegenerarDia, { dayNumber: number; mensaje?: string; message?: string }>(
    `/api/itinerarios/${idItinerario}/regenerar-dia`,
    payload
  );
