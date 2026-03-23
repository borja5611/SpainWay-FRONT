import { useNavigate } from "react-router-dom";
import ContenedorPantalla from "@/app/componentes/layout/ContenedorPantalla";
import Cabecera from "@/app/componentes/layout/Cabecera";
import Boton from "@/app/componentes/comun/Boton";
import { RUTAS_APP } from "@/app/utilidades/rutas";

export default function PerfilPantalla() {
  const navigate = useNavigate();

  return (
    <ContenedorPantalla conNavegacionInferior>
      <Cabecera titulo="Perfil" subtitulo="Gestiona tu cuenta y tus preferencias" />
      <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-lg font-semibold text-gray-900">Borja Usuario</p>
        <p className="mt-1 text-sm text-gray-500">borja@email.com</p>

        <div className="mt-6">
          <Boton onClick={() => navigate(RUTAS_APP.editarPerfil)}>
            Editar perfil
          </Boton>
        </div>
      </div>
    </ContenedorPantalla>
  );
}