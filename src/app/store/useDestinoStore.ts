import { create } from "zustand";
import type { DestinoId } from "@/app/datos/mock/destinos";

type DestinoState = {
  destinoSeleccionado: DestinoId | null;
  setDestinoSeleccionado: (destino: DestinoId) => void;
  limpiarDestinoSeleccionado: () => void;
};

export const useDestinoStore = create<DestinoState>((set) => ({
  destinoSeleccionado: null,
  setDestinoSeleccionado: (destino) => set({ destinoSeleccionado: destino }),
  limpiarDestinoSeleccionado: () => set({ destinoSeleccionado: null }),
}));