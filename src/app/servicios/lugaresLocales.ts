import { apiGet } from "./api";

export type FuenteLugarLocal = "all" | "google_local" | "google_maps" | "tripadvisor" | "cache";
export type TipoLugarLocal =
  | "comer_bien"
  | "cenar"
  | "tapas"
  | "cafe_brunch"
  | "tipico_local"
  | "rapido"
  | "restaurante"
  | "todos";

export interface LugarLocal {
  id: string;
  externalId: string;
  provider: "google_local" | "google_maps" | "tripadvisor" | "cache" | string;
  fuente: string;
  nombre: string;
  categoria: string | null;
  direccion: string | null;
  ciudad: string | null;
  latitud: number | null;
  longitud: number | null;
  rating: number | null;
  reviews: number | null;
  precio: string | null;
  telefono: string | null;
  descripcion: string | null;
  imagen: string | null;
  url: string | null;
  googleUrl: string;
  directionsUrl: string;
  score: number;
}

export interface BuscarLugaresLocalesParams {
  ciudad: string;
  fecha?: string;
  tipo?: TipoLugarLocal;
  fuente?: FuenteLugarLocal;
  lat?: number | null;
  lon?: number | null;
  radiusKm?: number;
  limit?: number;
}

export interface BuscarLugaresLocalesResponse {
  ok: boolean;
  ciudad: string;
  fecha: string | null;
  tipo: TipoLugarLocal;
  fuente: FuenteLugarLocal;
  total: number;
  providers: Record<string, number>;
  fuentes_usadas: string[];
  warnings: string[];
  items: LugarLocal[];
}

const STORAGE_KEY = "spainway_restaurantes_guardados";

function buildQuery(params: BuscarLugaresLocalesParams): string {
  const query = new URLSearchParams();
  query.set("ciudad", params.ciudad);
  if (params.fecha) query.set("fecha", params.fecha);
  if (params.tipo) query.set("tipo", params.tipo);
  if (params.fuente) query.set("fuente", params.fuente);
  if (params.lat !== null && params.lat !== undefined) query.set("lat", String(params.lat));
  if (params.lon !== null && params.lon !== undefined) query.set("lon", String(params.lon));
  if (params.radiusKm) query.set("radiusKm", String(params.radiusKm));
  if (params.limit) query.set("limit", String(params.limit));
  return query.toString();
}

export function buscarLugaresLocales(params: BuscarLugaresLocalesParams) {
  return apiGet<BuscarLugaresLocalesResponse>(`/api/lugares-locales/buscar?${buildQuery(params)}`);
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getRestaurantesGuardados(): LugarLocal[] {
  return safeParse<LugarLocal[]>(localStorage.getItem(STORAGE_KEY), []);
}

export function isRestauranteGuardado(id: string): boolean {
  return getRestaurantesGuardados().some((item) => item.id === id);
}

export function guardarRestauranteLocal(lugar: LugarLocal): LugarLocal[] {
  const actuales = getRestaurantesGuardados();
  const next = [lugar, ...actuales.filter((item) => item.id !== lugar.id)].slice(0, 50);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function quitarRestauranteLocal(id: string): LugarLocal[] {
  const next = getRestaurantesGuardados().filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
