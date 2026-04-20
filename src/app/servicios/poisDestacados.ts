const API_URL = import.meta.env.VITE_API_URL;

export interface PoiApi {
  id_poi: number;
  id_global?: string;
  nombre?: string;
  tipo?: string;
  categoria?: string;
  descripcion_snippet?: string;
  latitud?: number | string | null;
  longitud?: number | string | null;
  lat?: number | string | null;
  lon?: number | string | null;
  image_url?: string | null;
  municipio?: {
    nombre?: string;
    provincia?: {
      nombre?: string;
      comunidad?: {
        nombre?: string;
      };
    };
  } | null;
  categoria_poi?: {
    nombre?: string;
  } | null;
}

export interface PoiDestacado {
  id_poi_destacado_ccaa: number;
  id_poi: number;
  comunidad: string;
  ciudad_fuente?: string | null;
  provincia_fuente?: string | null;
  poi_canonico: string;
  fuente: string;
  fuente_tipo: string;
  url_fuente?: string | null;
  prioridad_fuente: number;
  match_confianza?: number | null;
  motivo?: string | null;
  created_at?: string | null;
  poi: PoiApi;
}

function buildUrl(path: string): string {
  if (!API_URL) {
    throw new Error("VITE_API_URL no está definida en el .env del front");
  }

  const base = API_URL.endsWith("/") ? API_URL.slice(0, -1) : API_URL;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

async function request<T>(path: string): Promise<T> {
  const response = await fetch(buildUrl(path));

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error ${response.status} en ${path}: ${text}`);
  }

  return response.json() as Promise<T>;
}

export function getPoisDestacadosByComunidad(comunidad: string) {
  return request<PoiDestacado[]>(
    `/api/pois-destacados/comunidad/${encodeURIComponent(comunidad)}`
  );
}

export function getPoisMustSeeByComunidad(comunidad: string) {
  return request<PoiDestacado[]>(
    `/api/pois-destacados/comunidad/${encodeURIComponent(comunidad)}/must-see`
  );
}

export function getPoisDestacadosByMunicipio(municipio: string) {
  return request<PoiDestacado[]>(
    `/api/pois-destacados/municipio/${encodeURIComponent(municipio)}`
  );
}

export function getPoisDestacadosByProvincia(provincia: string) {
  return request<PoiDestacado[]>(
    `/api/pois-destacados/provincia/${encodeURIComponent(provincia)}`
  );
}

export function searchPoisDestacados(q: string) {
  return request<PoiDestacado[]>(
    `/api/pois-destacados/search?q=${encodeURIComponent(q)}`
  );
}

export function getPoiById(idPoi: number) {
  return request<PoiApi>(`/api/pois/${idPoi}`);
}

function normalizeCoordinate(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined || value === "") return null;

  const normalized =
    typeof value === "string" ? value.trim().replace(",", ".") : value;

  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

export function extraerLat(poi: PoiApi): number | null {
  return normalizeCoordinate(poi.latitud ?? poi.lat ?? null);
}

export function extraerLng(poi: PoiApi): number | null {
  return normalizeCoordinate(poi.longitud ?? poi.lon ?? null);
}