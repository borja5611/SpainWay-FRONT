const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("VITE_API_URL no está definida en el .env del front");
}

export interface PoiApi {
  id_poi: number;
  id_global?: string;
  nombre?: string;
  tipo?: string;
  categoria?: string;
  subcategoria?: string | null;
  direccion?: string | null;
  latitud?: number | string | null;
  longitud?: number | string | null;
  descripcion?: string | null;
  temporada?: string | null;
  puntuacion?: number | string | null;
  popularidad?: number | string | null;
  id_cluster?: string | null;
  origen?: string | null;
  valido?: boolean;
  creado?: string | null;
  actualizado?: string | null;
  id_municipio?: number | null;
  id_categoria_poi?: number | null;
  google_search_url?: string | null;
  descripcion_snippet?: string;
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
  imagen_url?: string | null;
  created_at?: string | null;
  poi: PoiApi;
}

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);

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

export function extraerLat(poi: PoiApi): number | null {
  const value = poi.latitud ?? poi.lat ?? null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function extraerLng(poi: PoiApi): number | null {
  const value = poi.longitud ?? poi.lon ?? null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}