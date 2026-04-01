import BernabeuHero from "@/assets/poi/madrid/BernabeuHero.png";
import type { MapaPoi } from "./types";

export const madridPois: MapaPoi[] = [
  {
    id: "bernabeu",
    nombre: "Santiago Bernabéu",
    lat: 40.4531,
    lng: -3.6883,
    categoria: "Monumento / Experiencia",
    descripcion:
      "Uno de los lugares más icónicos de Madrid y una parada imprescindible para muchos visitantes.",
    imagen: BernabeuHero,
  },
  {
    id: "retiro",
    nombre: "Parque del Retiro",
    lat: 40.4153,
    lng: -3.6844,
    categoria: "Parque / Espacio urbano",
    descripcion:
      "Uno de los espacios verdes más emblemáticos de la ciudad y perfecto para un paseo dentro del itinerario.",
    imagen: BernabeuHero,
  },
  {
    id: "prado",
    nombre: "Museo del Prado",
    lat: 40.4138,
    lng: -3.6921,
    categoria: "Museo",
    descripcion:
      "Un museo clave en cualquier visita cultural a Madrid, ideal para integrar en una ruta del centro.",
    imagen: BernabeuHero,
  },
];