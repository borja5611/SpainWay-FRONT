import type { DestinoId } from "./destinos";

import MapaMadrid from "@/assets/mapa/madrid/MapaFondo.png";
import MapaBarcelona from "@/assets/mapa/barcelona/MapaFondo.png";
import MapaValencia from "@/assets/mapa/valencia/MapaFondo.png";

import PoiCardMadrid1 from "@/assets/mapa/madrid/PoiCard.png";
import PoiCardMadrid2 from "@/assets/mapa/madrid/PoiCard1.png";

import PoiCardValencia1 from "@/assets/mapa/valencia/PoiCard1.png";
import PoiCardValencia2 from "@/assets/mapa/valencia/PoiCard2.png";

export type MapaDestino = {
  titulo: string;
  subtitulo: string;
  mapaImagen: string;
  poiCards: string[];
};

export const mapaPorDestino: Record<DestinoId, MapaDestino> = {
  madrid: {
    titulo: "Mapa de Madrid",
    subtitulo: "Explora los puntos de interés de Madrid",
    mapaImagen: MapaMadrid,
    poiCards: [PoiCardMadrid1, PoiCardMadrid2],
  },
  cataluna: {
    titulo: "Mapa de Barcelona",
    subtitulo: "Explora los puntos de interés de Barcelona",
    mapaImagen: MapaBarcelona,
    poiCards: [],
  },
  cv: {
    titulo: "Mapa de Valencia",
    subtitulo: "Explora los puntos de interés de Valencia",
    mapaImagen: MapaValencia,
    poiCards: [PoiCardValencia1, PoiCardValencia2],
  },
  andalucia: {
    titulo: "Mapa de Andalucía",
    subtitulo: "Explora los puntos de interés de Andalucía",
    mapaImagen: MapaMadrid,
    poiCards: [],
  },
  asturias: {
    titulo: "Mapa de Asturias",
    subtitulo: "Explora los puntos de interés de Asturias",
    mapaImagen: MapaBarcelona,
    poiCards: [],
  },
  baleares: {
    titulo: "Mapa de Baleares",
    subtitulo: "Explora los puntos de interés de Baleares",
    mapaImagen: MapaValencia,
    poiCards: [],
  },
  canarias: {
    titulo: "Mapa de Canarias",
    subtitulo: "Explora los puntos de interés de Canarias",
    mapaImagen: MapaMadrid,
    poiCards: [],
  },
  cantabria: {
    titulo: "Mapa de Cantabria",
    subtitulo: "Explora los puntos de interés de Cantabria",
    mapaImagen: MapaBarcelona,
    poiCards: [],
  },
};