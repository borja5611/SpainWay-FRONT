import { useState } from "react";
import ContenedorPantalla from "@/app/componentes/layout/ContenedorPantalla";
import Cabecera from "@/app/componentes/layout/Cabecera";
import CampoTexto from "@/app/componentes/comun/CampoTexto";
import Boton from "@/app/componentes/comun/Boton";

export default function EditarPerfilPantalla() {
  const [nombre, setNombre] = useState("Borja Usuario");
  const [email, setEmail] = useState("borja@email.com");

  return (
    <ContenedorPantalla conNavegacionInferior>
      <Cabecera
        titulo="Editar perfil"
        subtitulo="Actualiza tus datos personales"
        mostrarVolver
      />

      <div className="space-y-4 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
        <CampoTexto
          label="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <CampoTexto
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Boton>Guardar cambios</Boton>
      </div>
    </ContenedorPantalla>
  );
}