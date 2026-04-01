import type { DestinoId } from "@/app/datos/mock/destinos";
import type { MapaPoi } from "./types";

import HeroBarcelona from "@/assets/inicio/barcelona/HeroBarcelona.png";
import HeroValencia from "@/assets/inicio/valencia/HeroValencia.png";
import BernabeuHero from "@/assets/poi/madrid/BernabeuHero.png";
import SagradaHero from "@/assets/poi/barcelona/SagradaHero.png";
import CiudadArtesHero from "@/assets/poi/valencia/CiudadArtesHero.png";

export type ConfigMapaInteractivo = {
  longitude: number;
  latitude: number;
  zoom: number;
};

export const mapaInteractivoPorDestino: Record<DestinoId, ConfigMapaInteractivo> = {
  andalucia: {
    longitude: -4.7328,
    latitude: 37.2413,
    zoom: 6.5,
  },
  asturias: {
    longitude: -5.8611,
    latitude: 43.3619,
    zoom: 8.0,
  },
  baleares: {
    longitude: 3.018,
    latitude: 39.613,
    zoom: 7.4,
  },
  canarias: {
    longitude: -16.2518,
    latitude: 28.2916,
    zoom: 6.3,
  },
  cantabria: {
    longitude: -3.8044,
    latitude: 43.1828,
    zoom: 8.0,
  },
  cataluna: {
    longitude: 2.1686,
    latitude: 41.3874,
    zoom: 12.8,
  },
  cv: {
    longitude: -0.3763,
    latitude: 39.4699,
    zoom: 11.8,
  },
  madrid: {
    longitude: -3.7038,
    latitude: 40.4168,
    zoom: 12.6,
  },
};

export const poisInteractivosPorDestino: Record<DestinoId, MapaPoi[]> = {
  andalucia: [
    {
      id: "alhambra",
      nombre: "Alhambra de Granada",
      lat: 37.1761,
      lng: -3.5881,
      categoria: "Patrimonio monumental",
      descripcion:
        "Uno de los conjuntos patrimoniales más emblemáticos de Andalucía y una referencia imprescindible para cualquier ruta cultural.",
      imagen: HeroValencia,
    },
    {
      id: "mezquita-cordoba",
      nombre: "Mezquita-Catedral de Córdoba",
      lat: 37.8789,
      lng: -4.7794,
      categoria: "Patrimonio histórico",
      descripcion:
        "Espacio monumental de gran valor arquitectónico y uno de los principales iconos históricos del sur peninsular.",
      imagen: HeroValencia,
    },
    {
      id: "alcazar-sevilla",
      nombre: "Real Alcázar de Sevilla",
      lat: 37.383,
      lng: -5.9902,
      categoria: "Conjunto histórico",
      descripcion:
        "Lugar clave para comprender el valor patrimonial y urbano de Sevilla dentro de Andalucía.",
      imagen: HeroValencia,
    },
  ],

  asturias: [
    {
      id: "covadonga",
      nombre: "Covadonga",
      lat: 43.3082,
      lng: -5.0503,
      categoria: "Entorno natural y cultural",
      descripcion:
        "Uno de los espacios más reconocibles de Asturias por su simbolismo paisajístico e histórico.",
      imagen: HeroBarcelona,
    },
    {
      id: "oviedo",
      nombre: "Oviedo histórico",
      lat: 43.3614,
      lng: -5.8494,
      categoria: "Ciudad histórica",
      descripcion:
        "Núcleo urbano clave para una visita cultural dentro de Asturias.",
      imagen: HeroBarcelona,
    },
    {
      id: "llanes",
      nombre: "Costa de Llanes",
      lat: 43.4214,
      lng: -4.7542,
      categoria: "Costa y paisaje",
      descripcion:
        "Zona ideal para experiencias ligadas al mar, paisaje y patrimonio costero asturiano.",
      imagen: HeroBarcelona,
    },
  ],

  baleares: [
    {
      id: "palma-catedral",
      nombre: "Catedral de Palma",
      lat: 39.5672,
      lng: 2.6482,
      categoria: "Patrimonio urbano",
      descripcion:
        "Uno de los grandes referentes monumentales de Baleares y un punto central para descubrir Palma.",
      imagen: HeroValencia,
    },
    {
      id: "ibiza-dalt-vila",
      nombre: "Dalt Vila",
      lat: 38.9072,
      lng: 1.432,
      categoria: "Conjunto histórico",
      descripcion:
        "Espacio patrimonial muy reconocible dentro de la oferta cultural de Baleares.",
      imagen: HeroValencia,
    },
    {
      id: "menorca-talayotica",
      nombre: "Menorca Talayótica",
      lat: 39.9496,
      lng: 4.11,
      categoria: "Patrimonio arqueológico",
      descripcion:
        "Conjunto histórico singular para enriquecer una experiencia de visita en Menorca.",
      imagen: HeroValencia,
    },
  ],

  canarias: [
    {
      id: "teide",
      nombre: "Teide",
      lat: 28.2724,
      lng: -16.6425,
      categoria: "Espacio natural",
      descripcion:
        "Uno de los mayores iconos visuales y naturales de Canarias.",
      imagen: HeroValencia,
    },
    {
      id: "la-laguna",
      nombre: "La Laguna",
      lat: 28.4874,
      lng: -16.3159,
      categoria: "Ciudad histórica",
      descripcion:
        "Conjunto urbano de gran interés cultural dentro de Tenerife.",
      imagen: HeroValencia,
    },
    {
      id: "garajonay",
      nombre: "Garajonay",
      lat: 28.1222,
      lng: -17.2406,
      categoria: "Parque natural",
      descripcion:
        "Espacio natural destacado y muy recomendable para una visión más paisajística del archipiélago.",
      imagen: HeroValencia,
    },
  ],

  cantabria: [
    {
      id: "altamira",
      nombre: "Altamira",
      lat: 43.3771,
      lng: -4.1226,
      categoria: "Patrimonio cultural",
      descripcion:
        "Uno de los lugares culturales más representativos de Cantabria y de enorme valor histórico.",
      imagen: HeroBarcelona,
    },
    {
      id: "santander",
      nombre: "Santander",
      lat: 43.4623,
      lng: -3.8099,
      categoria: "Ciudad costera",
      descripcion:
        "Capital costera con gran interés urbano y paisajístico dentro de Cantabria.",
      imagen: HeroBarcelona,
    },
    {
      id: "cabarceno",
      nombre: "Cabárceno",
      lat: 43.353,
      lng: -3.82,
      categoria: "Naturaleza y ocio",
      descripcion:
        "Espacio singular para combinar naturaleza, ocio y recorrido territorial.",
      imagen: HeroBarcelona,
    },
  ],

  cataluna: [
    {
      id: "sagrada-familia",
      nombre: "Sagrada Familia",
      lat: 41.4036,
      lng: 2.1744,
      categoria: "Patrimonio arquitectónico",
      descripcion:
        "Uno de los símbolos más reconocibles de Cataluña y punto clave en Barcelona.",
      imagen: SagradaHero,
    },
    {
      id: "casa-batllo",
      nombre: "Casa Batlló",
      lat: 41.3917,
      lng: 2.1649,
      categoria: "Arquitectura modernista",
      descripcion:
        "Obra de referencia para una ruta visual y cultural dentro de la ciudad.",
      imagen: SagradaHero,
    },
    {
      id: "barceloneta",
      nombre: "Barceloneta",
      lat: 41.3789,
      lng: 2.1925,
      categoria: "Costa urbana",
      descripcion:
        "Zona costera representativa y muy útil para combinar ciudad y mar en un mismo itinerario.",
      imagen: SagradaHero,
    },
  ],

  cv: [
    {
      id: "ciudad-artes",
      nombre: "Ciudad de las Artes y las Ciencias",
      lat: 39.4549,
      lng: -0.3506,
      categoria: "Arquitectura contemporánea",
      descripcion:
        "Uno de los grandes iconos actuales de la Comunidad Valenciana y una visita imprescindible en Valencia.",
      imagen: CiudadArtesHero,
    },
    {
      id: "lonja-seda",
      nombre: "Lonja de la Seda",
      lat: 39.474,
      lng: -0.3763,
      categoria: "Patrimonio histórico",
      descripcion:
        "Edificio histórico de enorme valor patrimonial dentro del centro de Valencia.",
      imagen: CiudadArtesHero,
    },
    {
      id: "palmeral-elche",
      nombre: "Palmeral de Elche",
      lat: 38.2699,
      lng: -0.7126,
      categoria: "Paisaje cultural",
      descripcion:
        "Lugar singular para una visita diferente dentro de la Comunidad Valenciana.",
      imagen: CiudadArtesHero,
    },
  ],

  madrid: [
    {
      id: "bernabeu",
      nombre: "Santiago Bernabéu",
      lat: 40.4531,
      lng: -3.6883,
      categoria: "Monumento / Experiencia",
      descripcion:
        "Uno de los lugares más icónicos de Madrid y una parada imprescindible dentro de la ciudad.",
      imagen: BernabeuHero,
    },
    {
      id: "retiro",
      nombre: "Parque del Retiro",
      lat: 40.4153,
      lng: -3.6844,
      categoria: "Parque urbano",
      descripcion:
        "Espacio verde clave para cualquier itinerario equilibrado por Madrid.",
      imagen: BernabeuHero,
    },
    {
      id: "prado",
      nombre: "Museo del Prado",
      lat: 40.4138,
      lng: -3.6921,
      categoria: "Museo",
      descripcion:
        "Uno de los grandes referentes culturales y turísticos de la capital.",
      imagen: BernabeuHero,
    },
  ],
};