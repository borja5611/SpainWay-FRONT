import { create } from "zustand";

type ChatState = {
  destino: string | null;
  preferencias: string[];
  presupuesto: string | null;
  intereses: string[];
  setDestino: (destino: string) => void;
  togglePreferencia: (valor: string) => void;
  setPresupuesto: (presupuesto: string) => void;
  toggleInteres: (interes: string) => void;
  resetChat: () => void;
};

export const useChatStore = create<ChatState>((set) => ({
  destino: null,
  preferencias: [],
  presupuesto: null,
  intereses: [],
  setDestino: (destino) => set({ destino }),
  togglePreferencia: (valor) =>
    set((state) => ({
      preferencias: state.preferencias.includes(valor)
        ? state.preferencias.filter((item) => item !== valor)
        : [...state.preferencias, valor],
    })),
  setPresupuesto: (presupuesto) => set({ presupuesto }),
  toggleInteres: (interes) =>
    set((state) => ({
      intereses: state.intereses.includes(interes)
        ? state.intereses.filter((item) => item !== interes)
        : [...state.intereses, interes],
    })),
  resetChat: () =>
    set({
      destino: null,
      preferencias: [],
      presupuesto: null,
      intereses: [],
    }),
}));