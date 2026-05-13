import type { DestinoId } from "@/app/datos/mock/destinos";

import EventoAlhambra from "@/assets/inicio/andalucia/EventoAlhambra.png";
import AsturiasHero from "@/assets/inicio/asturias/AsturiasHero.png";
import HomeBaleares from "@/assets/inicio/baleares/HomeBaleares.png";
import HeroCanarias from "@/assets/inicio/canarias/HeroCanarias.png";
import HeroCantabria from "@/assets/inicio/cantabria/HeroCantabria.png";
import HeroBarcelona from "@/assets/inicio/barcelona/HeroBarcelona.png";
import HeroValencia from "@/assets/inicio/valencia/HeroValencia.png";
import HeroMadrid from "@/assets/inicio/madrid/HeroMadrid.png";

import BernabeuHero from "@/assets/poi/madrid/BernabeuHero.png";
import SagradaHero from "@/assets/poi/barcelona/SagradaHero.png";
import CiudadArtesHero from "@/assets/poi/valencia/CiudadArtesHero.png";

export const DESTINO_TO_CCAA: Record<DestinoId, string> = {
  andalucia: "Andalucía",
  asturias: "Asturias",
  baleares: "Illes Balears",
  canarias: "Canarias",
  cantabria: "Cantabria",
  cataluna: "Cataluña",
  cv: "Comunidad Valenciana",
  madrid: "Comunidad de Madrid",
};

export function getImagenFallbackPorDestino(destino: DestinoId): string {
  const map: Record<DestinoId, string> = {
    andalucia: EventoAlhambra,
    asturias: AsturiasHero,
    baleares: HomeBaleares,
    canarias: HeroCanarias,
    cantabria: HeroCantabria,
    cataluna: HeroBarcelona,
    cv: HeroValencia,
    madrid: HeroMadrid,
  };

  return map[destino];
}

export function getImagenPoiDestacado(destino: DestinoId, nombrePoi: string): string {
  const n = nombrePoi.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  if (destino === "madrid") {
    if (n.includes("bernab")) return BernabeuHero;
    return HeroMadrid;
  }

  if (destino === "cataluna") {
    if (n.includes("sagrada")) return SagradaHero;
    return HeroBarcelona;
  }

  if (destino === "cv") {
    if (n.includes("artes") || n.includes("ciencias") || n.includes("oceanogr")) {
      return CiudadArtesHero;
    }
    return HeroValencia;
  }

  if (destino === "andalucia") {
    if (n.includes("alhambra")) return EventoAlhambra;
    return EventoAlhambra;
  }

  return getImagenFallbackPorDestino(destino);
}