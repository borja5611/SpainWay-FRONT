import { apiGet } from "./api";

export const getComunidades = () => apiGet("/api/comunidades");
export const getProvinciasByComunidad = (id: number) =>
  apiGet(`/api/provincias/comunidad/${id}`);
export const getMunicipiosByProvincia = (id: number) =>
  apiGet(`/api/municipios/provincia/${id}`);    
export const getCategoriasPoi = () => apiGet("/api/categorias-poi");
export const getFiltrosPoi = () => apiGet("/api/pois/filtros");