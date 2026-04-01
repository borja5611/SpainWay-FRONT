import SagradaHero from "@/assets/poi/barcelona/SagradaHero.png";
import type { MapaPoi } from "./types";

export const barcelonaPois: MapaPoi[] = [
  {
    id: "sagrada-familia",
    nombre: "Sagrada Familia",
    lat: 41.4036,
    lng: 2.1744,
    categoria: "Monumento",
    descripcion:
      "El monumento más emblemático de Barcelona y uno de los principales puntos de interés de la ciudad.",
    imagen: SagradaHero,
  },
  {
    id: "casa-batllo",
    nombre: "Casa Batlló",
    lat: 41.3917,
    lng: 2.1649,
    categoria: "Arquitectura",
    descripcion:
      "Una de las obras más conocidas de Gaudí y una parada muy recomendable dentro del centro urbano.",
    imagen: SagradaHero,
  },
  {
    id: "barceloneta",
    nombre: "Barceloneta",
    lat: 41.3789,
    lng: 2.1925,
    categoria: "Costa / Playa",
    descripcion:
      "Zona costera muy visitada, ideal para combinar con el resto del recorrido por Barcelona.",
    imagen: SagradaHero,
  },
];