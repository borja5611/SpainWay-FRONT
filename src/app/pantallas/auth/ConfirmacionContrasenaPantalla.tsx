import { useNavigate } from "react-router-dom";
import LayoutAuthPantalla from "@/app/componentes/auth/LayoutAuthPantalla";
import AuthCard from "@/app/componentes/auth/AuthCard";
import Boton from "@/app/componentes/comun/Boton";
import { RUTAS_APP } from "@/app/utilidades/rutas";

export default function ConfirmacionContrasenaPantalla() {
  const navigate = useNavigate();

  return (
    <LayoutAuthPantalla>
      <AuthCard
        titulo="Contraseña actualizada"
        subtitulo="Ya puedes volver a iniciar sesión"
      >
        <Boton onClick={() => navigate(RUTAS_APP.login)}>
          Ir a iniciar sesión
        </Boton>
      </AuthCard>
    </LayoutAuthPantalla>
  );
}