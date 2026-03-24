import type { DestinoId } from "./destinos";

import HeroMadrid from "@/assets/inicio/madrid/HeroMadrid.png";
import EventoConcierto from "@/assets/inicio/madrid/EventoConcierto.png";
import EventoDebob from "@/assets/inicio/madrid/EventoDebob.png";
import EventoLibros from "@/assets/inicio/madrid/EventoLibros.png";
import EventoMuseo from "@/assets/inicio/madrid/EventoMuseo.png";
import EventoPlazaEspaña from "@/assets/inicio/madrid/EventoPlazaEspaña.png";
import EventoRetiro from "@/assets/inicio/madrid/EventoRetiro.png";
import EventoSanGines from "@/assets/inicio/madrid/EventoSanGines.png";
import EventoTeatro from "@/assets/inicio/madrid/EventoTeatro.png";

import HeroBarcelona from "@/assets/inicio/barcelona/HeroBarcelona.png";
import EventoCasaBatllo from "@/assets/inicio/barcelona/EventoCasaBatllo.png";
import EventoMontjuic from "@/assets/inicio/barcelona/EventoMontjuic.png";
import EventoRamblas from "@/assets/inicio/barcelona/EventoRamblas.png";
import EventoSagrada from "@/assets/inicio/barcelona/EventoSagrada.png";
import EventoSagradaFamilia from "@/assets/inicio/barcelona/EventoSagradaFamilia.png";
import PlayaBarcelona from "@/assets/inicio/barcelona/PlayaBarcelona.png";

import HeroValencia from "@/assets/inicio/valencia/HeroValencia.png";
import EventoBioparc from "@/assets/inicio/valencia/EventoBioparc.png";
import EventoCatedral from "@/assets/inicio/valencia/EventoCatedral.png";
import EventoFallas from "@/assets/inicio/valencia/EventoFallas.png";
import EventoFeria from "@/assets/inicio/valencia/EventoFeria.png";
import EventoFestival from "@/assets/inicio/valencia/EventoFestival.png";
import EventoOceanografic from "@/assets/inicio/valencia/EventoOceanografic.png";
import EventoPlaya from "@/assets/inicio/valencia/EventoPlaya.png";

export type EventoInicio = {
  id: string;
  titulo: string;
  imagen: string;
};

export type RecomendacionInicio = {
  id: string;
  titulo: string;
  imagen: string;
};

export type InicioDestinoData = {
  heroTitulo: string;
  heroSubtitulo: string;
  heroImagen: string;
  exploraTitulo: string;
  exploraDescripcion: string;
  exploraImagen: string;
  eventosHoy: EventoInicio[];
  recomendaciones: RecomendacionInicio[];
  botonExplorarTexto: string;
  botonEventosTexto: string;
};

export const inicioPorDestino: Record<DestinoId, InicioDestinoData> = {
  madrid: {
    heroTitulo: "Descubre Madrid como nunca",
    heroSubtitulo: "La guía visual más completa de la ciudad",
    heroImagen: HeroMadrid,
    exploraTitulo: "Explora Madrid visualmente",
    exploraDescripcion:
      "Descubre monumentos, barrios, restaurantes y rincones únicos a través de un mapa interactivo lleno de imágenes",
    exploraImagen: EventoMuseo,
    botonExplorarTexto: "Explora más",
    botonEventosTexto: "Ver eventos hoy",
    eventosHoy: [
      { id: "m1", titulo: "Museo", imagen: EventoMuseo },
      { id: "m2", titulo: "Teatro", imagen: EventoTeatro },
      { id: "m3", titulo: "San Ginés", imagen: EventoSanGines },
      { id: "m4", titulo: "Retiro", imagen: EventoRetiro },
    ],
    recomendaciones: [
      { id: "mr1", titulo: "Concierto", imagen: EventoConcierto },
      { id: "mr2", titulo: "Plaza España", imagen: EventoPlazaEspaña },
      { id: "mr3", titulo: "Debod", imagen: EventoDebob },
      { id: "mr4", titulo: "Libros", imagen: EventoLibros },
    ],
  },

  cataluna: {
    heroTitulo: "Descubre Barcelona como nunca",
    heroSubtitulo: "La guía visual más completa de la ciudad",
    heroImagen: HeroBarcelona,
    exploraTitulo: "Explora Barcelona visualmente",
    exploraDescripcion:
      "Descubre monumentos, barrios, restaurantes y rincones únicos a través de un mapa interactivo lleno de imágenes",
    exploraImagen: EventoSagradaFamilia,
    botonExplorarTexto: "Explora más",
    botonEventosTexto: "Ver eventos hoy",
    eventosHoy: [
      { id: "c1", titulo: "Sagrada Familia", imagen: EventoSagradaFamilia },
      { id: "c2", titulo: "Sagrada", imagen: EventoSagrada },
      { id: "c3", titulo: "Ramblas", imagen: EventoRamblas },
      { id: "c4", titulo: "Casa Batlló", imagen: EventoCasaBatllo },
    ],
    recomendaciones: [
      { id: "cr1", titulo: "Montjuïc", imagen: EventoMontjuic },
      { id: "cr2", titulo: "Playa", imagen: PlayaBarcelona },
      { id: "cr3", titulo: "Sagrada", imagen: EventoSagrada },
      { id: "cr4", titulo: "Ramblas", imagen: EventoRamblas },
    ],
  },

  cv: {
    heroTitulo: "Descubre Valencia como nunca",
    heroSubtitulo: "La guía visual más completa de la ciudad",
    heroImagen: HeroValencia,
    exploraTitulo: "Explora Valencia visualmente",
    exploraDescripcion:
      "Descubre monumentos, barrios, restaurantes y rincones únicos a través de un mapa interactivo lleno de imágenes",
    exploraImagen: EventoOceanografic,
    botonExplorarTexto: "Explora más",
    botonEventosTexto: "Ver eventos hoy",
    eventosHoy: [
      { id: "v1", titulo: "Oceanogràfic", imagen: EventoOceanografic },
      { id: "v2", titulo: "Bioparc", imagen: EventoBioparc },
      { id: "v3", titulo: "Catedral", imagen: EventoCatedral },
      { id: "v4", titulo: "Playa", imagen: EventoPlaya },
    ],
    recomendaciones: [
      { id: "vr1", titulo: "Fallas", imagen: EventoFallas },
      { id: "vr2", titulo: "Feria", imagen: EventoFeria },
      { id: "vr3", titulo: "Festival", imagen: EventoFestival },
      { id: "vr4", titulo: "Playa", imagen: EventoPlaya },
    ],
  },

  andalucia: {
    heroTitulo: "Descubre Andalucía",
    heroSubtitulo: "Historia, patrimonio y costa",
    heroImagen: HeroMadrid,
    exploraTitulo: "Explora Andalucía visualmente",
    exploraDescripcion:
      "Descubre ciudades monumentales, playas, pueblos blancos y espacios naturales.",
    exploraImagen: EventoMuseo,
    botonExplorarTexto: "Explora más",
    botonEventosTexto: "Ver eventos hoy",
    eventosHoy: [],
    recomendaciones: [],
  },

  asturias: {
    heroTitulo: "Descubre Asturias",
    heroSubtitulo: "Naturaleza, mar y montaña",
    heroImagen: HeroBarcelona,
    exploraTitulo: "Explora Asturias visualmente",
    exploraDescripcion:
      "Descubre rutas, costa, miradores y pueblos con encanto.",
    exploraImagen: EventoMontjuic,
    botonExplorarTexto: "Explora más",
    botonEventosTexto: "Ver eventos hoy",
    eventosHoy: [],
    recomendaciones: [],
  },

  baleares: {
    heroTitulo: "Descubre Baleares",
    heroSubtitulo: "Islas, calas y turismo activo",
    heroImagen: HeroValencia,
    exploraTitulo: "Explora Baleares visualmente",
    exploraDescripcion:
      "Descubre playas, calas, pueblos y experiencias en las islas.",
    exploraImagen: EventoPlaya,
    botonExplorarTexto: "Explora más",
    botonEventosTexto: "Ver eventos hoy",
    eventosHoy: [],
    recomendaciones: [],
  },

  canarias: {
    heroTitulo: "Descubre Canarias",
    heroSubtitulo: "Volcanes, playas y clima único",
    heroImagen: HeroMadrid,
    exploraTitulo: "Explora Canarias visualmente",
    exploraDescripcion:
      "Descubre volcanes, costa, parques naturales y experiencias únicas.",
    exploraImagen: EventoRetiro,
    botonExplorarTexto: "Explora más",
    botonEventosTexto: "Ver eventos hoy",
    eventosHoy: [],
    recomendaciones: [],
  },

  cantabria: {
    heroTitulo: "Descubre Cantabria",
    heroSubtitulo: "Costa, cuevas y naturaleza",
    heroImagen: HeroBarcelona,
    exploraTitulo: "Explora Cantabria visualmente",
    exploraDescripcion:
      "Descubre paisajes, patrimonio, costa y rincones naturales.",
    exploraImagen: EventoCasaBatllo,
    botonExplorarTexto: "Explora más",
    botonEventosTexto: "Ver eventos hoy",
    eventosHoy: [],
    recomendaciones: [],
  },
};