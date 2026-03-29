import type { DestinoId } from "./destinos";

import BernabeuHero from "@/assets/poi/madrid/BernabeuHero.png";

import SagradaHero from "@/assets/poi/barcelona/SagradaHero.png";

import CiudadArtesHero from "@/assets/poi/valencia/CiudadArtesHero.png";
import CiudadArtesPreview from "@/assets/poi/valencia/CiudadArtesPreview.png";

export type PoiDetalle = {
  id: string;
  destino: DestinoId;
  nombre: string;
  categoria: string;
  puntuacion: number;
  duracion: string;
  descripcion: string;
  imagenHero: string;
  imagenPreview?: string;
};

export const poiPorDestino: Record<DestinoId, PoiDetalle[]> = {
  madrid: [
    {
      id: "bernabeu",
      destino: "madrid",
      nombre: "Santiago Bernabéu",
      categoria: "Monumento / Experiencia",
      puntuacion: 4.8,
      duracion: "2 h",
      descripcion:
        "Uno de los estadios más emblemáticos del mundo y uno de los puntos más visitados de Madrid. Ideal para combinar con otros lugares del centro.",
      imagenHero: BernabeuHero,
    },
  ],

  cataluna: [
    {
      id: "sagrada-familia",
      destino: "cataluna",
      nombre: "Sagrada Familia",
      categoria: "Monumento",
      puntuacion: 4.9,
      duracion: "1.5 h",
      descripcion:
        "La Sagrada Familia es uno de los lugares más icónicos de Barcelona y un imprescindible en cualquier visita a la ciudad.",
      imagenHero: SagradaHero,
    },
  ],

  cv: [
    {
      id: "ciudad-artes",
      destino: "cv",
      nombre: "Ciudad de las Artes",
      categoria: "Arquitectura / Cultura",
      puntuacion: 4.8,
      duracion: "2 h",
      descripcion:
        "La Ciudad de las Artes y las Ciencias es uno de los complejos arquitectónicos más representativos de Valencia.",
      imagenHero: CiudadArtesHero,
      imagenPreview: CiudadArtesPreview,
    },
  ],

  andalucia: [],
  asturias: [],
  baleares: [],
  canarias: [],
  cantabria: [],
};