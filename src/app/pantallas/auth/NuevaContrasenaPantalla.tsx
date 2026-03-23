import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LayoutAuthPantalla from "@/app/componentes/auth/LayoutAuthPantalla";
import AuthCard from "@/app/componentes/auth/AuthCard";
import CampoTexto from "@/app/componentes/comun/CampoTexto";
import Boton from "@/app/componentes/comun/Boton";
import { RUTAS_APP } from "@/app/utilidades/rutas";

export default function NuevaContrasenaPantalla() {
  const navigate = useNavigate();
  const [contrasena, setContrasena] = useState("");
  const [repetir, setRepetir] = useState("");

  return (
    <LayoutAuthPantalla>
      <AuthCard
        titulo="Nueva contraseña"
        subtitulo="Crea una nueva contraseña segura"
      >
        <CampoTexto
          label="Nueva contraseña"
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />
        <CampoTexto
          label="Repetir contraseña"
          type="password"
          value={repetir}
          onChange={(e) => setRepetir(e.target.value)}
        />
        <Boton onClick={() => navigate(RUTAS_APP.confirmacionContrasena)}>
          Guardar contraseña
        </Boton>
      </AuthCard>
    </LayoutAuthPantalla>
  );
}