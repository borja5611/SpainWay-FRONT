import { apiDelete, apiGet, apiPost } from "./api";

export type EventoLiveProvider = "ticketmaster" | "predicthq" | "serpapi" | "database";

export type EventoLive = {
  id: string;
  provider: EventoLiveProvider;
  nombre: string;
  descripcion: string | null;
  categoria: string;
  fechaInicio: string;
  fechaFin: string | null;
  ciudad: string;
  recinto: string | null;
  direccion: string | null;
  latitud: number | null;
  longitud: number | null;
  imagen: string | null;
  url: string | null;
  score: number;
};

export type BuscarEventosLiveParams = {
  city: string;
  from: string;
  to: string;
  lat?: number | null;
  lng?: number | null;
  radiusKm?: number;
};

export type BuscarEventosLiveResponse = {
  city: string;
  from: string;
  to: string;
  total: number;
  events: EventoLive[];
  message?: string;
  warnings?: string[];
  providers_configured?: {
    ticketmaster?: boolean;
    predicthq?: boolean;
    serpapi?: boolean;
    database?: boolean;
  };
  providers?: {
    ticketmaster?: number;
    predicthq?: number;
    serpapi?: number;
    database?: number;
  };
  search_strategy?: {
    success_attempt: string | null;
    success_label: string | null;
    requested_radius_km: number | null;
    used_from: string | null;
    used_to: string | null;
    used_radius_km: number | null;
    attempted: Array<{
      code: string;
      label: string;
      from: string;
      to: string;
      radiusKm: number;
      ticketmaster?: number;
      predicthq?: number;
      serpapi?: number;
      database?: number;
      total: number;
    }>;
  };
};

export type SeleccionEventoLive = {
  id_itinerario_evento: number;
  id_itinerario: number;
  id_dia_itinerario: number | null;
  orden: number | null;
  inicio_sugerido: string | null;
  fin_sugerido: string | null;
  score_recomendacion: number | null;
  motivo: string | null;
  evento_turistico: {
    id_evento_turistico: number;
    external_id: string;
    source: string | null;
    nombre: string;
    descripcion: string | null;
    categoria: string | null;
    venue_nombre: string | null;
    direccion: string | null;
    ciudad: string | null;
    latitud: number | null;
    longitud: number | null;
    inicio: string | null;
    fin: string | null;
    imagen_url: string | null;
    url: string | null;
  };
};

export type SeleccionarEventoLivePayload = {
  id_itinerario: number;
  id_dia_itinerario: number;
  event: EventoLive;
  motivo?: string | null;
};

function buildQuery(params: BuscarEventosLiveParams) {
  const search = new URLSearchParams({
    city: params.city,
    from: params.from,
    to: params.to,
  });

  if (typeof params.lat === "number") search.set("lat", String(params.lat));
  if (typeof params.lng === "number") search.set("lng", String(params.lng));
  if (typeof params.radiusKm === "number") search.set("radiusKm", String(params.radiusKm));
  return search.toString();
}

export async function buscarEventosLive(params: BuscarEventosLiveParams) {
  return apiGet<BuscarEventosLiveResponse>(`/api/eventos-live/search?${buildQuery(params)}`);
}

export async function getSeleccionesEventosLive(idItinerario: number) {
  return apiGet<SeleccionEventoLive[]>(`/api/eventos-live/selecciones/${idItinerario}`);
}

export async function seleccionarEventoLive(payload: SeleccionarEventoLivePayload) {
  return apiPost<{ ok: boolean }, SeleccionarEventoLivePayload>(
    "/api/eventos-live/seleccionar",
    payload,
  );
}

export async function eliminarSeleccionEventoLive(idItinerarioEvento: number) {
  return apiDelete<{ ok: boolean }>(`/api/eventos-live/seleccion/${idItinerarioEvento}`);
}
