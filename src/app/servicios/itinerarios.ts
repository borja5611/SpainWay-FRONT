// src/app/servicios/itinerarios.ts
import { apiDelete, apiGet, apiPatch, apiPost } from "./api";

export interface ElementoItinerario {
  id_elemento_itinerario: number;
  inicio: string | null;
  fin: string | null;
  orden: number | null;
  transporte: string | null;
  tiempo_transporte: number | null;
  id_dia_itinerario: number;
  id_poi: number;
  poi?: {
    id_poi: number;
    nombre: string;
    id_global: string;
  };
}

export interface DiaItinerario {
  id_dia_itinerario: number;
  fecha: string | null;
  minutos: number | null;
  notas: string | null;
  id_itinerario: number;
  elementos?: ElementoItinerario[];
}

export interface Itinerario {
  id_itinerario: number;
  titulo: string | null;
  destino: string | null;
  inicio: string | null;
  fin: string | null;
  presupuesto: number | null;
  transporte: string | null;
  accesibilidad: string | null;
  estado: string | null;
  creado: string | null;
  actualizado: string | null;
  id_usuario: number;
  dias?: DiaItinerario[];
}

export interface CrearItinerarioPayload {
  id_usuario: number;
  titulo: string;
  destino: string;
  inicio: string;
  fin: string;
  presupuesto?: number;
  transporte?: string;
  accesibilidad?: string;
  estado?: string;
}

export interface ActualizarItinerarioPayload {
  titulo?: string;
  destino?: string;
  inicio?: string;
  fin?: string;
  presupuesto?: number;
  transporte?: string;
  accesibilidad?: string;
  estado?: string;
}

export interface CrearDiaItinerarioPayload {
  id_itinerario: number;
  fecha: string;
  minutos?: number;
  notas?: string;
}

export interface ActualizarDiaItinerarioPayload {
  fecha?: string;
  minutos?: number;
  notas?: string;
}

export interface CrearElementoItinerarioPayload {
  id_dia_itinerario: number;
  id_poi: number;
  inicio?: string;
  fin?: string;
  orden?: number;
  transporte?: string;
  tiempo_transporte?: number;
}

export interface DeleteResponse {
  ok: boolean;
  message: string;
}

export const getItinerarios = (idUsuario: number) =>
  apiGet<Itinerario[]>(`/api/itinerarios/${idUsuario}`);

export const getItinerariosResumen = (idUsuario: number) =>
  apiGet<Itinerario[]>(`/api/itinerarios/resumen/${idUsuario}`);

export const getItinerarioDetalle = (idItinerario: number) =>
  apiGet<Itinerario>(`/api/itinerarios/detalle/${idItinerario}`);

export const crearItinerario = (payload: CrearItinerarioPayload) =>
  apiPost<Itinerario, CrearItinerarioPayload>("/api/itinerarios", payload);

export const actualizarItinerario = (
  idItinerario: number,
  payload: ActualizarItinerarioPayload
) =>
  apiPatch<Itinerario, ActualizarItinerarioPayload>(
    `/api/itinerarios/${idItinerario}`,
    payload
  );

export const eliminarItinerario = (idItinerario: number) =>
  apiDelete<DeleteResponse>(`/api/itinerarios/${idItinerario}`);

export const getDiasItinerario = (idItinerario: number) =>
  apiGet<DiaItinerario[]>(`/api/dias-itinerario/${idItinerario}`);

export const crearDiaItinerario = (payload: CrearDiaItinerarioPayload) =>
  apiPost<DiaItinerario, CrearDiaItinerarioPayload>(
    "/api/dias-itinerario",
    payload
  );

export const actualizarDiaItinerario = (
  idDiaItinerario: number,
  payload: ActualizarDiaItinerarioPayload
) =>
  apiPatch<DiaItinerario, ActualizarDiaItinerarioPayload>(
    `/api/dias-itinerario/${idDiaItinerario}`,
    payload
  );

export const eliminarDiaItinerario = (idDiaItinerario: number) =>
  apiDelete<DeleteResponse>(`/api/dias-itinerario/${idDiaItinerario}`);

export const getElementosDia = (idDiaItinerario: number) =>
  apiGet<ElementoItinerario[]>(`/api/elementos-itinerario/${idDiaItinerario}`);

export const crearElementoDia = (payload: CrearElementoItinerarioPayload) =>
  apiPost<ElementoItinerario, CrearElementoItinerarioPayload>(
    "/api/elementos-itinerario",
    payload
  );