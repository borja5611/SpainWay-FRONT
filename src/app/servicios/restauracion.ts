import { apiDelete, apiGet, apiPost } from "@/app/servicios/api";

export type MomentoRestauracion = "desayuno" | "comida" | "cena" | "cafe";
export type TipoRestauracion =
  | "todos"
  | "restaurante"
  | "tapas"
  | "cafeteria"
  | "bar"
  | "fast_food"
  | "pasteleria";

export type LugarRestauracion = {
  id_lugar_restauracion: number;
  proveedor: string;
  externalId: string;
  nombre: string;
  categoria: string | null;
  direccion: string | null;
  latitud: number;
  longitud: number;
  distancia: number | null;
  rating: number | null;
  precio: string | null;
  url: string | null;
  telefono: string | null;
  score?: number;
};

export type SeleccionRestauracion = {
  id_itinerario_restauracion: number;
  id_itinerario: number;
  id_dia_itinerario: number;
  momento: MomentoRestauracion;
  id_lugar_restauracion: number;
  id_poi_referencia: number | null;
  creadoEn: string;
  lugar: LugarRestauracion;
};

export async function buscarRestauracionCercana(params: {
  lat: number;
  lng: number;
  radio: number;
  momento: MomentoRestauracion;
  tipo: TipoRestauracion;
}) {
  const query = new URLSearchParams({
    lat: String(params.lat),
    lng: String(params.lng),
    radio: String(params.radio),
    momento: params.momento,
    tipo: params.tipo,
    limit: "16",
  });

  return apiGet<LugarRestauracion[]>(`/api/restauracion/buscar?${query.toString()}`);
}

export async function seleccionarRestauracion(body: {
  id_itinerario: number;
  id_dia_itinerario: number;
  momento: MomentoRestauracion;
  id_lugar_restauracion: number;
  id_poi_referencia?: number | null;
}) {
  return apiPost<SeleccionRestauracion, typeof body>("/api/restauracion/seleccionar", body);
}

export async function getSeleccionesRestauracion(idItinerario: number) {
  return apiGet<SeleccionRestauracion[]>(`/api/restauracion/selecciones/${idItinerario}`);
}

export async function eliminarSeleccionRestauracion(idSeleccion: number) {
  return apiDelete<{ ok: true }>(`/api/restauracion/selecciones/${idSeleccion}`);
}