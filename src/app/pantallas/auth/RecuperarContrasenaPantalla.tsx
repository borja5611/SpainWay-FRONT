import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LayoutAuthPantalla from "@/app/componentes/auth/LayoutAuthPantalla";
import AuthCard from "@/app/componentes/auth/AuthCard";
import CampoTexto from "@/app/componentes/comun/CampoTexto";
import Boton from "@/app/componentes/comun/Boton";
import { RUTAS_APP } from "@/app/utilidades/rutas";

export default function RecuperarContrasenaPantalla() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  return (
    <LayoutAuthPantalla>
      <AuthCard
        titulo="Recuperar contraseña"
        subtitulo="Te enviaremos un código de verificación"
      >
        <CampoTexto
          label="Correo electrónico"
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Boton onClick={() => navigate(RUTAS_APP.verificacionOtp)}>
          Enviar código
        </Boton>
      </AuthCard>
    </LayoutAuthPantalla>
  );
}