// src/app/servicios/favoritos.ts
import { apiDelete, apiGet, apiPost } from "./api";

export interface FavoritoPoi {
  id_poi: number;
  id_global: string;
  nombre: string;
  tipo: string;
  subcategoria: string | null;
  direccion: string | null;
  latitud: number | null;
  longitud: number | null;
  descripcion: string | null;
  temporada: string | null;
  puntuacion: number | null;
  popularidad: number | null;
  id_cluster: string | null;
  origen: string | null;
  valido: boolean | null;
  creado: string | null;
  actualizado: string | null;
  id_municipio: number | null;
  id_categoria_poi: number;
  municipio?: {
    id_municipio: number;
    nombre: string;
  } | null;
  categoria_poi?: {
    id_categoria_poi: number;
    nombre: string;
    slug: string;
  } | null;
}

export interface Favorito {
  id_favoritos: number;
  creado: string | null;
  id_usuario: number;
  id_poi: number;
  poi: FavoritoPoi;
}

export interface FavoritoCheckResponse {
  exists: boolean;
  favorito: Favorito | null;
}

export interface CrearFavoritoPayload {
  id_usuario: number;
  id_poi: number;
}

export interface DeleteFavoritoResponse {
  ok: boolean;
  message: string;
}

export const getFavoritos = (idUsuario: number) =>
  apiGet<Favorito[]>(`/api/favoritos/${idUsuario}`);

export const checkFavorito = (idUsuario: number, idPoi: number) =>
  apiGet<FavoritoCheckResponse>(`/api/favoritos/check/${idUsuario}/${idPoi}`);

export const crearFavorito = (payload: CrearFavoritoPayload) =>
  apiPost<Favorito, CrearFavoritoPayload>("/api/favoritos", payload);

export const eliminarFavorito = (idUsuario: number, idPoi: number) =>
  apiDelete<DeleteFavoritoResponse>(`/api/favoritos/${idUsuario}/${idPoi}`);