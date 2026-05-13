import { apiGet } from "./api";

// Tipo del POI detalle que devuelve la API
export type PoiDetalle = {
  id_poi: number;
  nombre: string;
  tipo?: string | null;
  subcategoria?: string | null;
  descripcion?: string | null;
  descripcion_snippet?: string | null;
  direccion?: string | null;
  latitud?: number | null;
  longitud?: number | null;
  google_search_url?: string | null;
  image_url?: string | null;
  municipio?: { nombre: string } | null;
  categoria_poi?: { nombre: string } | null;
  destacados_ccaa?: { imagen_url?: string | null }[];
};

export const getPois = (page = 1, limit = 20) =>
  apiGet(`/api/pois?page=${page}&limit=${limit}`);

export const explorarPois = (query: string) =>
  apiGet(`/api/pois/explorar?${query}`);

export const getPoisDestacados = (limit = 10) =>
  apiGet(`/api/pois/destacados?limit=${limit}`);

export const getPoisCercanos = (
  lat: number,
  lon: number,
  radioKm = 10,
  limit = 10
) =>
  apiGet(
    `/api/pois/cercanos?lat=${lat}&lon=${lon}&radioKm=${radioKm}&limit=${limit}`
  );

export const buscarPoisTexto = (q: string) =>
  apiGet(`/api/pois/busqueda/texto?q=${encodeURIComponent(q)}`);

export const getPoiById = (id: number): Promise<PoiDetalle> =>
  apiGet(`/api/pois/${id}`) as Promise<PoiDetalle>;

export const getPoiByGlobalId = (idGlobal: string) =>
  apiGet(`/api/pois/id-global/${idGlobal}`);