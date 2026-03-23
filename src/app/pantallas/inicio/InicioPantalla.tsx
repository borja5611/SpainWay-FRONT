import { useNavigate } from "react-router-dom";
import ContenedorPantalla from "@/app/componentes/layout/ContenedorPantalla";
import Cabecera from "@/app/componentes/layout/Cabecera";
import Boton from "@/app/componentes/comun/Boton";
import TarjetaDestino from "@/app/pantallas/inicio/TarjetaDestino";
import { destinosMock } from "@/app/datos/mock/destinos";
import { RUTAS_APP } from "@/app/utilidades/rutas";

export default function InicioPantalla() {
  const navigate = useNavigate();

  return (
    <ContenedorPantalla conNavegacionInferior>
      <Cabecera
        titulo="SpainWay"
        subtitulo="Descubre destinos, organiza rutas y habla con el asistente"
      />

      <section className="mb-6">
        <Boton onClick={() => navigate(RUTAS_APP.chat)}>
          Planificar viaje con el asistente
        </Boton>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Destinos destacados
          </h2>
          <button
            type="button"
            onClick={() => navigate(RUTAS_APP.selectorDestino)}
            className="text-sm font-medium text-blue-600"
          >
            Ver todos
          </button>
        </div>

        <div className="space-y-4">
          {destinosMock.slice(0, 2).map((destino) => (
            <TarjetaDestino
              key={destino.id}
              destino={destino}
              onClick={() => navigate(RUTAS_APP.selectorDestino)}
            />
          ))}
        </div>
      </section>
    </ContenedorPantalla>
  );
}