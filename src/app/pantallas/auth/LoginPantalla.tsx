import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LayoutAuthPantalla from "@/app/componentes/auth/LayoutAuthPantalla";
import AuthCard from "@/app/componentes/auth/AuthCard";
import CampoTexto from "@/app/componentes/comun/CampoTexto";
import Boton from "@/app/componentes/comun/Boton";
import { RUTAS_APP } from "@/app/utilidades/rutas";

export default function RegistroPantalla() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(RUTAS_APP.login);
  };

  return (
    <LayoutAuthPantalla>
      <AuthCard
        titulo="Crear cuenta"
        subtitulo="Empieza a planificar tus viajes"
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <CampoTexto
            label="Nombre"
            placeholder="Tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <CampoTexto
            label="Correo electrónico"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <CampoTexto
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />

          <Boton type="submit">Registrarme</Boton>
        </form>

        <p className="text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <Link to={RUTAS_APP.login} className="font-medium text-blue-600">
            Inicia sesión
          </Link>
        </p>
      </AuthCard>
    </LayoutAuthPantalla>
  );
}