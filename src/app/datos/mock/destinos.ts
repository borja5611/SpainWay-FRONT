import EventoAlhambra from "@/assets/inicio/andalucia/EventoAlhambra.png";
import AsturiasHero from "@/assets/inicio/asturias/AsturiasHero.png";
import HomeBaleares from "@/assets/inicio/baleares/HomeBaleares.png";
import HeroCanarias from "@/assets/inicio/canarias/HeroCanarias.png";
import HeroCantabria from "@/assets/inicio/cantabria/HeroCantabria.png";

import HeroBarcelona from "@/assets/inicio/barcelona/HeroBarcelona.png";
import HeroValencia from "@/assets/inicio/valencia/HeroValencia.png";
import HeroMadrid from "@/assets/inicio/madrid/HeroMadrid.png";

export type DestinoId =
  | "andalucia"
  | "asturias"
  | "baleares"
  | "canarias"
  | "cantabria"
  | "cataluna"
  | "cv"
  | "madrid";

export type Destino = {
  id: DestinoId;
  nombre: string;
  subtitulo: string;
  imagen: string;
};

export const destinosMock: Destino[] = [
  {
    id: "andalucia",
    nombre: "Andalucía",
    subtitulo: "Patrimonio, ciudades históricas y grandes iconos culturales",
    imagen: EventoAlhambra,
  },
  {
    id: "asturias",
    nombre: "Asturias",
    subtitulo: "Costa, naturaleza y rincones con identidad propia",
    imagen: AsturiasHero,
  },
  {
    id: "baleares",
    nombre: "Baleares",
    subtitulo: "Islas, patrimonio y experiencias junto al mar",
    imagen: HomeBaleares,
  },
  {
    id: "canarias",
    nombre: "Canarias",
    subtitulo: "Volcanes, paisajes únicos y ciudades con carácter",
    imagen: HeroCanarias,
  },
  {
    id: "cantabria",
    nombre: "Cantabria",
    subtitulo: "Costa, cuevas y patrimonio natural y cultural",
    imagen: HeroCantabria,
  },
  {
    id: "cataluna",
    nombre: "Cataluña",
    subtitulo: "Arquitectura, mar y diseño urbano",
    imagen: HeroBarcelona,
  },
  {
    id: "cv",
    nombre: "Comunidad Valenciana",
    subtitulo: "Mediterráneo, ciencia y cultura",
    imagen: HeroValencia,
  },
  {
    id: "madrid",
    nombre: "Madrid",
    subtitulo: "Capital, cultura y vida urbana",
    imagen: HeroMadrid,
  },
];