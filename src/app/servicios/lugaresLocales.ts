import { apiGet } from "./api";

export type TipoLugarLocal = "comer_bien" | "cenar" | "tapas" | "cafe_brunch" | "tipico_local" | "rapido" | "restaurante" | "todos";
export type FuenteLugarLocal = "all" | "google_local" | "google_maps" | "tripadvisor" | "cache";

export type LugarLocal = {
  id: string;
  externalId?: string;
  provider: "google_local" | "google_maps" | "tripadvisor" | "cache" | string;
  fuente?: string;
  nombre: string;
  categoria?: string | null;
  direccion?: string | null;
  ciudad?: string | null;
  latitud?: number | null;
  longitud?: number | null;
  rating?: number | null;
  reviews?: number | null;
  precio?: string | null;
  telefono?: string | null;
  descripcion?: string | null;
  imagen?: string | null;
  url?: string | null;
  googleUrl: string;
  directionsUrl: string;
  score?: number;
};

export type BuscarLugaresLocalesParams = {
  ciudad: string;
  fecha?: string;
  tipo?: TipoLugarLocal;
  fuente?: FuenteLugarLocal;
  lat?: number | null;
  lon?: number | null;
  radiusKm?: number;
  limit?: number;
};

export type BuscarLugaresLocalesResponse = {
  ok: boolean;
  ciudad: string;
  fecha?: string | null;
  tipo: TipoLugarLocal;
  fuente: FuenteLugarLocal;
  total: number;
  providers?: Record<string, number>;
  fuentes_usadas?: string[];
  warnings?: string[];
  items: LugarLocal[];
};

const STORAGE_KEY = "spainway_restaurantes_guardados";

function buildQuery(params: BuscarLugaresLocalesParams) {
  const search = new URLSearchParams();
  search.set("ciudad", params.ciudad);
  if (params.fecha) search.set("fecha", params.fecha);
  if (params.tipo) search.set("tipo", params.tipo);
  if (params.fuente) search.set("fuente", params.fuente);
  if (typeof params.lat === "number") search.set("lat", String(params.lat));
  if (typeof params.lon === "number") search.set("lon", String(params.lon));
  if (typeof params.radiusKm === "number") search.set("radiusKm", String(params.radiusKm));
  if (typeof params.limit === "number") search.set("limit", String(params.limit));
  return search.toString();
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function buscarLugaresLocales(params: BuscarLugaresLocalesParams) {
  return apiGet<BuscarLugaresLocalesResponse>(`/api/lugares-locales/buscar?${buildQuery(params)}`);
}

export function getRestaurantesGuardados(): LugarLocal[] {
  return safeParse<LugarLocal[]>(localStorage.getItem(STORAGE_KEY), []);
}

export function isRestauranteGuardado(id: string): boolean {
  return getRestaurantesGuardados().some((item) => item.id === id);
}

export function guardarRestauranteLocal(lugar: LugarLocal): LugarLocal[] {
  const current = getRestaurantesGuardados();
  const exists = current.some((item) => item.id === lugar.id);
  const next = exists ? current : [lugar, ...current].slice(0, 60);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function quitarRestauranteLocal(id: string): LugarLocal[] {
  const next = getRestaurantesGuardados().filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
