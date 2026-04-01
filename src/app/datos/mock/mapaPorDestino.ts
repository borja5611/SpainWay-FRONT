import type { DestinoId } from "./destinos";



import PoiCardMadrid1 from "@/assets/mapa/madrid/PoiCard.png";
import PoiCardMadrid2 from "@/assets/mapa/madrid/PoiCard1.png";

import PoiCardValencia1 from "@/assets/mapa/valencia/PoiCard1.png";
import PoiCardValencia2 from "@/assets/mapa/valencia/PoiCard2.png";

export type DestacadoMapa = {
  titulo: string;
  categoria: string;
  descripcion: string;
  imagen: string;
};

export type MapaDestino = {
  titulo: string;
  subtitulo: string;
  destacados: DestacadoMapa[];
};

export const mapaPorDestino: Record<DestinoId, MapaDestino> = {
  madrid: {
    titulo: "Mapa de Madrid",
    subtitulo: "Explora los puntos de interés de Madrid",
    destacados: [
      {
        titulo: "Hotel recomendado",
        categoria: "Alojamiento",
        descripcion:
          "Una opción de alojamiento bien situada para organizar tu estancia y tener acceso cómodo a los principales lugares de la ciudad.",
        imagen: PoiCardMadrid1,
      },
      {
        titulo: "Puerta de Alcalá",
        categoria: "Monumento",
        descripcion:
          "Uno de los símbolos más reconocibles de Madrid y una parada ideal para combinar con otras visitas cercanas del centro urbano.",
        imagen: PoiCardMadrid2,
      },
    ],
  },

  cataluna: {
    titulo: "Mapa de Barcelona",
    subtitulo: "Explora los puntos de interés de Barcelona",
    destacados: [],
  },

  cv: {
    titulo: "Mapa de Valencia",
    subtitulo: "Explora los puntos de interés de Valencia",
    destacados: [
      {
        titulo: "Alojamiento recomendado",
        categoria: "Alojamiento",
        descripcion:
          "Una propuesta pensada para quienes quieren moverse bien entre el centro, la costa y las zonas más visitadas de la ciudad.",
        imagen: PoiCardValencia1,
      },
      {
        titulo: "Punto destacado de Valencia",
        categoria: "Lugar sugerido",
        descripcion:
          "Un espacio visualmente atractivo que encaja bien dentro de un itinerario urbano o de una primera visita por la ciudad.",
        imagen: PoiCardValencia2,
      },
    ],
  },

  andalucia: {
    titulo: "Mapa de Andalucía",
    subtitulo: "Explora los puntos de interés de Andalucía",
    destacados: [],
  },

  asturias: {
    titulo: "Mapa de Asturias",
    subtitulo: "Explora los puntos de interés de Asturias",
    destacados: [],
  },

  baleares: {
    titulo: "Mapa de Baleares",
    subtitulo: "Explora los puntos de interés de Baleares",
    destacados: [],
  },

  canarias: {
    titulo: "Mapa de Canarias",
    subtitulo: "Explora los puntos de interés de Canarias",
    destacados: [],
  },

  cantabria: {
    titulo: "Mapa de Cantabria",
    subtitulo: "Explora los puntos de interés de Cantabria",
    destacados: [],
  },
};