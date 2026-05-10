import { apiPost } from "./api";
import type { Itinerario } from "./itinerarios";

export type PresupuestoViaje = "bajo" | "medio" | "alto";
export type RitmoViaje = "relajado" | "equilibrado" | "intenso";
export type TipoViaje =
  | "mixto"
  | "cultural"
  | "naturaleza"
  | "playa"
  | "gastronomia"
  | "familiar"
  | "pareja"
  | "ocio";
export type TransporteViaje =
  | "andando"
  | "transporte publico"
  | "coche"
  | "mixto";
export type ClimaPreferido =
  | "indiferente"
  | "calor"
  | "templado"
  | "frio"
  | "lluvia";

export type PayloadRecomendador = {
  id_usuario?: number;

  destination: string;
  days: number;
  budget: PresupuestoViaje | string;
  dates: string[];
  pace: RitmoViaje | string;
  trip_type: TipoViaje | string;
  companions: string;
  transport: TransporteViaje | string;

  must_see: string;
  extras: string;
  notes: string;

  base_location_name: string;
  base_address: string;
  base_place_id?: string | null;
  base_lat: number;
  base_lon: number;

  allow_excursions: boolean;
  max_distance_km?: number | null;

  visited_global_ids: string[];
  visited_poi_names?: string[];
  negative_preferences?: string[];

  include_live_events?: boolean;
  include_restaurants?: boolean;

  /**
   * Nuevas señales guiadas desde el formulario premium.
   * El backend puede guardarlas o reenviarlas a la IA.
   * Si alguna parte todavía no las usa, no rompen compatibilidad.
   */
  climate_preference?: ClimaPreferido | string;
  travel_context?: string[];
  interest_tags?: string[];
  wants_beach?: boolean;
  wants_nature?: boolean;
  wants_culture?: boolean;
  wants_gastronomy?: boolean;
  wants_family_friendly?: boolean;
  wants_nightlife?: boolean;
};

export type RespuestaRecomendador = {
  ok: boolean;
  id_conversacion: number;
  id_itinerario: number;
  respuesta: string;
  payload: PayloadRecomendador;
  itinerario: Itinerario;
  ia?: unknown;
};

export function generarItinerario(payload: PayloadRecomendador) {
  return apiPost<RespuestaRecomendador, PayloadRecomendador>(
    "/api/recomendador/generar",
    payload,
  );
}