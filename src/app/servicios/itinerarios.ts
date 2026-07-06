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

// --- Explicabilidad del motor SpainWay (opcional: itinerarios generados antes
// de esta versión simplemente no traen estos campos) ------------------------

export interface ScoreBreakdown {
  touristic_quality?: number;
  editorial_curation?: number;
  semantic_affinity?: number;
  distance_coherence?: number;
  territorial_diversity?: number;
  user_profile_affinity?: number;
  weather_context?: number;
  negative_preference_penalty?: number;
  noise_penalty?: number;
  final_score?: number;
}

export interface EngineMetadata {
  engine_name?: string;
  engine_version?: string;
  generation_mode?: string;
  llm_role?: string;
  llm_used_for_generation?: boolean;
}

export interface CandidatePipeline {
  total_pois_loaded?: number;
  after_destination_filter?: number;
  after_quality_filter?: number;
  after_noise_filter?: number;
  after_negative_preferences?: number;
  final_selected?: number;
}

export interface SelectedSummary {
  zones_used?: string[];
  categories_used?: Record<string, number>;
  average_score?: number;
  average_distance_to_base_km?: number;
  curated_highlights?: number;
  pois_with_explanation?: number;
}

export interface RejectedExample {
  name?: string;
  global_id?: string;
  reason?: string;
}

// Trazabilidad técnica del motor: pensada para auditoría interna, no para
// mostrarse como texto al usuario. La UI solo debe leer estos campos para
// construir chips/porcentajes con lenguaje de producto (ver
// `normalizarMotivoUsuario` en DetalleItinerarioPantalla.tsx).
export interface DecisionTrace {
  input_summary?: {
    destination?: string;
    days?: number;
    pace?: string;
    transport?: string;
    has_user_context?: boolean;
    has_weather_context?: boolean;
  };
  candidate_pipeline?: CandidatePipeline;
  scoring_weights?: Record<string, number>;
  selected_summary?: SelectedSummary;
  rejected_examples?: RejectedExample[];
}

export interface ScheduleSlot {
  slot_type: string;
  start_time: string;
  end_time: string;
  poi_global_id?: string | null;
  poi_name?: string | null;
  estimated_visit_minutes?: number | null;
  travel_from_previous_minutes?: number | null;
  travel_minutes?: number | null;
  estimated_distance_km?: number | null;
  reason?: string | null;
}

export interface RouteMetrics {
  total_visit_minutes?: number;
  total_travel_minutes?: number;
  estimated_distance_km?: number;
  pace_feasibility?: string;
  weather_feasibility?: string;
  empty_day?: boolean;
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
  score_breakdown?: ScoreBreakdown;
  selection_reasons?: string[];
  confidence?: number;
  semantic_affinity?: number;
  weather_adjustment?: number;
  user_context_adjustment?: number;
  is_curated_highlight?: boolean;
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
  schedule?: ScheduleSlot[];
  route_metrics?: RouteMetrics;
  quality_metrics?: Record<string, unknown>;
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
  engine_metadata?: EngineMetadata;
  decision_trace?: DecisionTrace;
  quality_metrics?: Record<string, unknown>;
  audit_history?: unknown[];
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


export interface RegenerarItinerarioPayload {
  id_usuario: number;
  destination: string;
  days: number;
  budget?: string;
  dates?: string[];
  pace?: string;
  trip_type?: string;
  companions?: string;
  transport?: string;
  must_see?: string;
  extras?: string;
  notes?: string;
  base_location_name?: string;
  base_address?: string;
  base_place_id?: string;
  base_lat?: number | null;
  base_lon?: number | null;
  allow_excursions?: boolean;
  max_distance_km?: number | null;
  visited_global_ids?: string[];
  visited_poi_names?: string[];
  negative_preferences?: string[];
  include_live_events?: boolean;
  user_message?: string;
}

export interface RespuestaGenerarItinerario {
  ok: boolean;
  id_conversacion: number;
  id_itinerario: number;
  respuesta: string;
  itinerario: Itinerario;
  ia?: unknown;
}

export const regenerarItinerarioCompleto = (payload: RegenerarItinerarioPayload) =>
  apiPost<RespuestaGenerarItinerario, RegenerarItinerarioPayload>(
    "/api/recomendador/generar",
    payload
  );

export interface PoiMapaItinerario {
  id_poi: number;
  nombre: string;
  categoria: string;
  descripcion: string | null;
  direccion: string | null;
  latitud: number;
  longitud: number;
  orden: number | null;
  inicio: string | null;
  fin: string | null;
  google_search_url: string | null;
  imagen_url: string | null;
  municipio: {
    id_municipio: number;
    nombre: string;
  } | null;
}

export interface DiaMapaItinerario {
  id_dia_itinerario: number;
  numero_dia: number;
  fecha: string | null;
  pois: PoiMapaItinerario[];
}

export interface ItinerarioMapa {
  id_itinerario: number;
  titulo: string | null;
  destino: string | null;
  inicio: string | null;
  fin: string | null;
  dias: DiaMapaItinerario[];
}

export const getItinerariosMapa = (idUsuario: number) =>
  apiGet<ItinerarioMapa[]>(`/api/itinerarios/mapa/${idUsuario}`);

// --- Auditoría explicable del motor (Fase 14 backend) -----------------------

export interface ItinerarioAuditoriaDisponible {
  available: true;
  engine: {
    name: string;
    version: string;
    generation_mode: string;
    llm_role: string;
    llm_used_for_generation: boolean;
  };
  candidate_pipeline: CandidatePipeline;
  selected_summary: SelectedSummary;
  scoring_weights: Record<string, number>;
  quality_metrics: Record<string, unknown>;
  rejected_examples: RejectedExample[];
  audit_history_count: number;
  // Texto fijo definido por el backend (no es copy de usuario): ver la
  // documentación de trazabilidad del backend, sección "Separación entre
  // trazabilidad técnica y comunicación al usuario".
  summary_message: string;
}

export interface ItinerarioAuditoriaNoDisponible {
  available: false;
  summary_message: string;
}

export type ItinerarioAuditoria = ItinerarioAuditoriaDisponible | ItinerarioAuditoriaNoDisponible;

export interface RespuestaAuditoriaItinerario {
  ok: boolean;
  data: ItinerarioAuditoria;
}

export const getAuditoriaItinerario = (idItinerario: number) =>
  apiGet<RespuestaAuditoriaItinerario>(`/api/itinerarios/${idItinerario}/auditoria`);
