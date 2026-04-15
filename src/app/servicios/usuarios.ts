const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("VITE_API_URL no está definida en el .env del front");
}

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

export async function getUsuarioById(idUsuario: number): Promise<UsuarioDetalle> {
  const response = await fetch(`${API_URL}/api/usuarios/${idUsuario}`);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error obteniendo usuario: ${response.status} ${text}`);
  }

  return response.json() as Promise<UsuarioDetalle>;
}

export async function actualizarUsuario(
  idUsuario: number,
  payload: UpdateUsuarioPayload
): Promise<UsuarioDetalle> {
  const response = await fetch(`${API_URL}/api/usuarios/${idUsuario}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error actualizando usuario: ${response.status} ${text}`);
  }

  return response.json() as Promise<UsuarioDetalle>;
}