import { apiGet, apiPatch } from "./api";

export interface UsuarioDetalle {
  id_usuario: number;
  nombre: string;
  nombre_usuario: string | null;
  email: string;
  telefono: string | null;
  rol: string;
  creado?: string | null;
  actualizado?: string | null;
}

export interface UpdateUsuarioPayload {
  nombre?: string;
  nombre_usuario?: string;
  telefono?: string | null;
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

// Estas llamadas van a rutas protegidas (`/api/usuarios/:id`): apiGet/apiPatch
// adjuntan automáticamente el token JWT del usuario autenticado.
export async function getUsuarioById(idUsuario: number): Promise<UsuarioDetalle> {
  return apiGet<UsuarioDetalle>(`/api/usuarios/${idUsuario}`);
}

export async function actualizarUsuario(
  idUsuario: number,
  payload: UpdateUsuarioPayload
): Promise<UsuarioDetalle> {
  return apiPatch<UsuarioDetalle, UpdateUsuarioPayload>(
    `/api/usuarios/${idUsuario}`,
    payload
  );
}
