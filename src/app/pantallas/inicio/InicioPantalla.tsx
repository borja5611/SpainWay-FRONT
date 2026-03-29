import { useNavigate } from "react-router-dom";
import { useDestinoStore } from "@/app/store/useDestinoStore";
import {
  ciudadesInicio,
  poisInicioPorCiudad,
} from "@/app/datos/mock/inicioDescubrimiento";
import TarjetaCiudadDestacada from "@/app/componentes/inicio/TarjetaCiudadDestacada";
import TarjetaPoiPreview from "@/app/componentes/inicio/TarjetaPoiPreview";
import SeccionHorizontalPoi from "@/app/componentes/inicio/SeccionHorizontalPoi";

export default function InicioPantalla() {
  const navigate = useNavigate();
  const setDestinoSeleccionado = useDestinoStore(
    (state) => state.setDestinoSeleccionado
  );

  const seleccionarDestino = (destinoId: "madrid" | "cataluna" | "cv") => {
    setDestinoSeleccionado(destinoId);
    navigate("/mapa");
  };

  return (
    <div className="min-h-screen bg-[#f6f6f3]">
      <div className="mx-auto w-full max-w-[980px] pt-2">
        <section className="px-4">
          <div className="rounded-[28px] bg-white p-5 shadow-sm">
            <p
              className="text-[30px] font-bold leading-[34px] text-black"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Descubre tu próxima escapada
            </p>

            <p className="mt-3 max-w-[620px] text-[15px] leading-[26px] text-[#6d6d6d]">
              SpainWay reúne ciudades, planes y puntos de interés en una sola
              experiencia visual para que encuentres destinos, guardes ideas y
              prepares itinerarios con mucho más estilo.
            </p>
          </div>
        </section>

        <section className="mt-8 px-4">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
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

        <SeccionHorizontalPoi
          titulo="Madrid ahora"
          subtitulo="Una selección de lugares para empezar"
        >
          {poisInicioPorCiudad.madrid.map((poi) => (
            <TarjetaPoiPreview
              key={poi.id}
              titulo={poi.titulo}
              imagen={poi.imagen}
              onClick={() => {
                setDestinoSeleccionado("madrid");
                navigate("/mapa");
              }}
            />
          ))}
        </SeccionHorizontalPoi>

        <SeccionHorizontalPoi
          titulo="Barcelona ahora"
          subtitulo="Arquitectura, mar y rincones emblemáticos"
        >
          {poisInicioPorCiudad.cataluna.map((poi) => (
            <TarjetaPoiPreview
              key={poi.id}
              titulo={poi.titulo}
              imagen={poi.imagen}
              onClick={() => {
                setDestinoSeleccionado("cataluna");
                navigate("/mapa");
              }}
            />
          ))}
        </SeccionHorizontalPoi>

        <SeccionHorizontalPoi
          titulo="Valencia ahora"
          subtitulo="Mediterráneo, cultura y experiencias"
        >
          {poisInicioPorCiudad.cv.map((poi) => (
            <TarjetaPoiPreview
              key={poi.id}
              titulo={poi.titulo}
              imagen={poi.imagen}
              onClick={() => {
                setDestinoSeleccionado("cv");
                navigate("/mapa");
              }}
            />
          ))}
        </SeccionHorizontalPoi>
      </div>
    </div>
  );
}