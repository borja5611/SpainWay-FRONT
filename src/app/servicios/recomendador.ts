import { apiPost } from "./api";
import type { Itinerario } from "./itinerarios";

export type PayloadRecomendador = {
  id_usuario?: number;
  destination: string;
  days: number;
  budget: string;
  dates: string[];
  pace: string;
  trip_type: string;
  companions: string;
  transport: string;
  must_see: string;
  extras: string;
  notes: string;
  base_location_name: string;
  base_address: string;
  base_lat: number;
  base_lon: number;
  allow_excursions: boolean;
  visited_global_ids: string[];
  visited_poi_names?: string[];
  negative_preferences?: string[];
  include_live_events?: boolean;
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
    payload
  );
}
