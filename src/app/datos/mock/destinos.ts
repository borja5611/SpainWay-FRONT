import HeroMadrid from "@/assets/inicio/madrid/HeroMadrid.png";
import HeroBarcelona from "@/assets/inicio/barcelona/HeroBarcelona.png";
import HeroValencia from "@/assets/inicio/valencia/HeroValencia.png";

export type DestinoId =
  | "madrid"
  | "cataluna"
  | "cv"
  | "andalucia"
  | "asturias"
  | "baleares"
  | "canarias"
  | "cantabria";

export type Destino = {
  id: DestinoId;
  nombre: string;
  subtitulo: string;
  imagen: string;
};

export const destinosMock: Destino[] = [
  {
    id: "madrid",
    nombre: "Madrid",
    subtitulo: "Capital, cultura y vida urbana",
    imagen: HeroMadrid,
  },
  {
    id: "cataluna",
    nombre: "Cataluña",
    subtitulo: "Barcelona, costa y arquitectura",
    imagen: HeroBarcelona,
  },
  {
    id: "cv",
    nombre: "Comunidad Valenciana",
    subtitulo: "Valencia, ciencia y Mediterráneo",
    imagen: HeroValencia,
  },
  {
    id: "andalucia",
    nombre: "Andalucía",
    subtitulo: "Historia, patrimonio y costa",
    imagen: HeroMadrid,
  },
  {
    id: "asturias",
    nombre: "Asturias",
    subtitulo: "Naturaleza, mar y montaña",
    imagen: HeroBarcelona,
  },
  {
    id: "baleares",
    nombre: "Baleares",
    subtitulo: "Islas, calas y turismo activo",
    imagen: HeroValencia,
  },
  {
    id: "canarias",
    nombre: "Canarias",
    subtitulo: "Volcanes, playas y clima único",
    imagen: HeroMadrid,
  },
  {
    id: "cantabria",
    nombre: "Cantabria",
    subtitulo: "Costa, cuevas y naturaleza",
    imagen: HeroBarcelona,
  },
];