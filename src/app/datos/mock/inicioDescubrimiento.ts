import HeroMadrid from "@/assets/inicio/madrid/HeroMadrid.png";
import HeroBarcelona from "@/assets/inicio/barcelona/HeroBarcelona.png";
import HeroValencia from "@/assets/inicio/valencia/HeroValencia.png";

import EventoMuseo from "@/assets/inicio/madrid/EventoMuseo.png";
import EventoRetiro from "@/assets/inicio/madrid/EventoRetiro.png";
import EventoTeatro from "@/assets/inicio/madrid/EventoTeatro.png";

import EventoSagradaFamilia from "@/assets/inicio/barcelona/EventoSagradaFamilia.png";
import EventoCasaBatllo from "@/assets/inicio/barcelona/EventoCasaBatllo.png";
import PlayaBarcelona from "@/assets/inicio/barcelona/PlayaBarcelona.png";

import EventoOceanografic from "@/assets/inicio/valencia/EventoOceanografic.png";
import EventoBioparc from "@/assets/inicio/valencia/EventoBioparc.png";
import EventoPlaya from "@/assets/inicio/valencia/EventoPlaya.png";

export type CiudadInicio = {
  id: "madrid" | "cataluna" | "cv";
  nombre: string;
  subtitulo: string;
  imagen: string;
};

export type PoiPreview = {
  id: string;
  titulo: string;
  imagen: string;
  destinoId: "madrid" | "cataluna" | "cv";
};

export const ciudadesInicio: CiudadInicio[] = [
  {
    id: "madrid",
    nombre: "Madrid",
    subtitulo: "Museos, barrios y vida urbana",
    imagen: HeroMadrid,
  },
  {
    id: "cataluna",
    nombre: "Barcelona",
    subtitulo: "Arquitectura, mar y diseño",
    imagen: HeroBarcelona,
  },
  {
    id: "cv",
    nombre: "Valencia",
    subtitulo: "Mediterráneo, ciencia y cultura",
    imagen: HeroValencia,
  },
];

export const poisInicioPorCiudad: Record<"madrid" | "cataluna" | "cv", PoiPreview[]> = {
  madrid: [
    { id: "museo", titulo: "Museo", imagen: EventoMuseo, destinoId: "madrid" },
    { id: "retiro", titulo: "Retiro", imagen: EventoRetiro, destinoId: "madrid" },
    { id: "teatro", titulo: "Teatro", imagen: EventoTeatro, destinoId: "madrid" },
  ],
  cataluna: [
    {
      id: "sagrada-familia",
      titulo: "Sagrada Familia",
      imagen: EventoSagradaFamilia,
      destinoId: "cataluna",
    },
    {
      id: "casa-batllo",
      titulo: "Casa Batlló",
      imagen: EventoCasaBatllo,
      destinoId: "cataluna",
    },
    {
      id: "playa",
      titulo: "Playa",
      imagen: PlayaBarcelona,
      destinoId: "cataluna",
    },
  ],
  cv: [
    {
      id: "oceanografic",
      titulo: "Oceanogràfic",
      imagen: EventoOceanografic,
      destinoId: "cv",
    },
    {
      id: "bioparc",
      titulo: "Bioparc",
      imagen: EventoBioparc,
      destinoId: "cv",
    },
    {
      id: "playa",
      titulo: "Playa",
      imagen: EventoPlaya,
      destinoId: "cv",
    },
  ],
};