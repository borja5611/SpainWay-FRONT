import { useNavigate } from "react-router-dom";
import { useDestinoStore } from "@/app/store/useDestinoStore";
import {
  ciudadesInicio,
  poisInicioPorCiudad,
} from "@/app/datos/mock/inicioDescubrimiento";
import TarjetaCiudadDestacada from "@/app/componentes/inicio/TarjetaCiudadDestacada";
import TarjetaPoiPreview from "@/app/componentes/inicio/TarjetaPoiPreview";
import SeccionHorizontalPoi from "@/app/componentes/inicio/SeccionHorizontalPoi";
import BloqueInfoInicio from "@/app/componentes/inicio/BloqueInfoInicio";
import ContenedorPantallaPrincipal from "@/app/componentes/layout/ContenedorPantallaPrincipal";

export default function InicioPantalla() {
  const navigate = useNavigate();
  const setDestinoSeleccionado = useDestinoStore(
    (state) => state.setDestinoSeleccionado
  );

  const seleccionarDestino = (destinoId: (typeof ciudadesInicio)[number]["id"]) => {
    setDestinoSeleccionado(destinoId);
    navigate("/mapa");
  };

  return (
    <div className="min-h-screen bg-[#f6f6f3]">
      <ContenedorPantallaPrincipal className="pt-3">
        <section>
          <div className="rounded-[30px] border border-[#eceae5] bg-white p-6 shadow-sm">
            <p
              className="text-[34px] font-bold leading-[38px] text-black"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Descubre tu próxima escapada
            </p>

            <p className="mt-4 max-w-[700px] text-[15px] leading-[27px] text-[#6d6d6d]">
              SpainWay es una aplicación centrada en ayudarte a explorar destinos,
              descubrir puntos de interés y construir itinerarios visuales de una
              manera clara, inspiradora y cuidada.
            </p>
          </div>
        </section>

        <section className="mt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <BloqueInfoInicio
              titulo="Explora destinos visualmente"
              descripcion="Accede a comunidades destacadas, consulta sus puntos de interés y navega por contenidos visuales más ricos para preparar tu viaje."
            />
            <BloqueInfoInicio
              titulo="Organiza mejor cada experiencia"
              descripcion="Utiliza el mapa, el calendario y el asistente para guardar ideas, construir itinerarios y convertir una inspiración en un plan real."
            />
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-[30px] font-bold text-black">Destinos destacados</h2>
            <p className="mt-1 text-[14px] text-[#7c6b69]">
              Selecciona una comunidad para empezar a explorar su mapa y su contenido.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {ciudadesInicio.map((ciudad) => (
              <TarjetaCiudadDestacada
                key={ciudad.id}
                nombre={ciudad.nombre}
                subtitulo={ciudad.subtitulo}
                imagen={ciudad.imagen}
                onClick={() => seleccionarDestino(ciudad.id)}
              />
            ))}
          </div>
        </section>

        {ciudadesInicio.map((ciudad) => (
          <SeccionHorizontalPoi
            key={ciudad.id}
            titulo={`${ciudad.nombre} ahora`}
            subtitulo={ciudad.subtitulo}
          >
            {poisInicioPorCiudad[ciudad.id].map((poi) => (
                  <TarjetaPoiPreview
        key={poi.id}
        titulo={poi.titulo}
        descripcion={poi.descripcion}
        imagen={poi.imagen}
        onClick={() => {
          setDestinoSeleccionado(ciudad.id);
          navigate("/mapa");
        }}
/>
            ))}
          </SeccionHorizontalPoi>
        ))}
      </ContenedorPantallaPrincipal>
    </div>
  );
}