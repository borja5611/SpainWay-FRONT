import { apiGet } from "./api";

export interface DiaMeteorologia {
  fecha: string;
  codigo: number | null;
  icono: string;
  estado: string;
  temperatura_max: number | null;
  temperatura_min: number | null;
  probabilidad_lluvia: number | null;
  viento_max: number | null;
  consejo: string;
  dentro_itinerario: boolean;
}

export interface ClimaEstacional {
  titulo: string;
  descripcion: string;
  rango: string;
}

export interface MeteorologiaItinerario {
  destino: string;
  latitud: number;
  longitud: number;
  inicio_itinerario: string | null;
  fin_itinerario: string | null;
  rango_prevision_inicio: string;
  rango_prevision_fin: string;
  prevision_fiable_para_itinerario: boolean;
  motivo: string;
  dias_itinerario: DiaMeteorologia[];
  proximos_14_dias: DiaMeteorologia[];
  clima_estacional: ClimaEstacional;
  fuente: string;
}

export const getMeteorologiaItinerario = (idItinerario: number) =>
  apiGet<MeteorologiaItinerario>(`/api/meteorologia/itinerario/${idItinerario}`);
