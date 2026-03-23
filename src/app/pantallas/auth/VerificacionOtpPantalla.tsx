import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LayoutAuthPantalla from "@/app/componentes/auth/LayoutAuthPantalla";
import AuthCard from "@/app/componentes/auth/AuthCard";
import CampoTexto from "@/app/componentes/comun/CampoTexto";
import Boton from "@/app/componentes/comun/Boton";
import { RUTAS_APP } from "@/app/utilidades/rutas";

export default function VerificacionOtpPantalla() {
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState("");

  return (
    <LayoutAuthPantalla>
      <AuthCard
        titulo="Verificación OTP"
        subtitulo="Introduce el código que has recibido"
      >
        <CampoTexto
          label="Código"
          placeholder="123456"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />
        <Boton onClick={() => navigate(RUTAS_APP.nuevaContrasena)}>
          Verificar
        </Boton>
      </AuthCard>
    </LayoutAuthPantalla>
  );
}