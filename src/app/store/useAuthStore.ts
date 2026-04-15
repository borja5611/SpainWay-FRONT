import { create } from "zustand";
import type { UsuarioAuth } from "@/app/servicios/auth";
import {
  guardarSesion,
  limpiarSesion,
  obtenerTokenGuardado,
  obtenerUsuarioGuardado,
} from "@/app/servicios/auth";

type AuthState = {
  token: string | null;
  usuario: UsuarioAuth | null;
  isAuthenticated: boolean;
  setSesion: (token: string, usuario: UsuarioAuth) => void;
  cerrarSesion: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: obtenerTokenGuardado(),
  usuario: obtenerUsuarioGuardado(),
  isAuthenticated: !!obtenerTokenGuardado(),

  setSesion: (token, usuario) => {
    guardarSesion({ token, usuario });
    set({
      token,
      usuario,
      isAuthenticated: true,
    });
  },

  cerrarSesion: () => {
    limpiarSesion();
    set({
      token: null,
      usuario: null,
      isAuthenticated: false,
    });
  },
}));