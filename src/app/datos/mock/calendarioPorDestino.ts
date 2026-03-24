import type { DestinoId } from "./destinos";

import EventoCalendarioMadrid from "@/assets/calendario/madrid/EventoCalendario.png";
import EventoCalendarioBarcelona from "@/assets/calendario/barcelona/EventoCalendario.png";
import EventoCalendarioValencia from "@/assets/calendario/valencia/EventoCalendario.png";

export type EventoCalendario = {
  id: string;
  titulo: string;
  fecha: string;
  lugar: string;
  imagen: string;
};

export const calendarioPorDestino: Record<DestinoId, EventoCalendario[]> = {
  madrid: [
    {
      id: "m1",
      titulo: "Agenda Madrid",
      fecha: "22 Octubre",
      lugar: "Madrid",
      imagen: EventoCalendarioMadrid,
    },
  ],
  cataluna: [
    {
      id: "c1",
      titulo: "Agenda Barcelona",
      fecha: "22 Octubre",
      lugar: "Barcelona",
      imagen: EventoCalendarioBarcelona,
    },
  ],
  cv: [
    {
      id: "v1",
      titulo: "Agenda Valencia",
      fecha: "22 Octubre",
      lugar: "Valencia",
      imagen: EventoCalendarioValencia,
    },
  ],
  andalucia: [],
  asturias: [],
  baleares: [],
  canarias: [],
  cantabria: [],
};