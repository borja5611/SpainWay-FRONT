import { apiGet } from "./api";

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

export const getPoiById = (id: number) =>
  apiGet(`/api/pois/${id}`);

export const getPoiByGlobalId = (idGlobal: string) =>
  apiGet(`/api/pois/id-global/${idGlobal}`);