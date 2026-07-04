import { create } from "zustand";

export type ToastType = "success" | "error" | "info";

export type ToastItem = {
  id: number;
  type: ToastType;
  message: string;
};

type ToastState = {
  toasts: ToastItem[];
  push: (message: string, type?: ToastType) => void;
  dismiss: (id: number) => void;
};

let counter = 0;

/**
 * Store de toasts (feedback visual) sin dependencias externas: usa el Zustand
 * ya presente en el proyecto. Se consume con `useToastStore.getState().push(...)`.
 */
export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (message, type = "info") => {
    const id = ++counter;
    set((state) => ({ toasts: [...state.toasts, { id, type, message }] }));
    window.setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3200);
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

/** Atajo para lanzar toasts desde cualquier parte (dentro o fuera de React). */
export const toast = {
  success: (message: string) => useToastStore.getState().push(message, "success"),
  error: (message: string) => useToastStore.getState().push(message, "error"),
  info: (message: string) => useToastStore.getState().push(message, "info"),
};
