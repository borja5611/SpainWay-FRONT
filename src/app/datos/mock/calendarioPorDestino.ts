import type { DestinoId } from "./destinos";

import EventoCalendarioMadrid from "@/assets/calendario/madrid/EventoCalendario.png";

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
  ],
  cv: [
  ],
  andalucia: [],
  asturias: [],
  baleares: [],
  canarias: [],
  cantabria: [],
};