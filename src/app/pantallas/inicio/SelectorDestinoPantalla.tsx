import { useNavigate } from "react-router-dom";
import ContenedorPantalla from "@/app/componentes/layout/ContenedorPantalla";
import Cabecera from "@/app/componentes/layout/Cabecera";
import TarjetaDestino from "@/app/pantallas/inicio/TarjetaDestino";
import { destinosMock } from "@/app/datos/mock/destinos";
import { RUTAS_APP } from "@/app/utilidades/rutas";

export default function SelectorDestinoPantalla() {
  const navigate = useNavigate();

  return (
    <ContenedorPantalla>
      <Cabecera
        titulo="Selecciona tu destino"
        subtitulo="Elige la ciudad desde la que quieres empezar"
        mostrarVolver
      />

      <div className="space-y-4">
        {destinosMock.map((destino) => (
          <TarjetaDestino
            key={destino.id}
            destino={destino}
            onClick={() => navigate(RUTAS_APP.inicio)}
          />
        ))}
      </div>
    </ContenedorPantalla>
  );
}