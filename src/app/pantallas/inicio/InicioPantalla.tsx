import { useNavigate } from "react-router-dom";
import TarjetaDestino from "@/app/componentes/inicio/TarjetaDestino";
import HeroDestino from "@/app/componentes/inicio/HeroDestino";
import ExploraVisualmenteCard from "@/app/componentes/inicio/ExploraVisualmenteCard";
import EventoDiaCard from "@/app/componentes/inicio/EventoDiaCard";
import RecomendacionCard from "@/app/componentes/inicio/RecomendacionCard";
import SeccionInicio from "@/app/componentes/inicio/SeccionInicio";
import CambiarDestinoButton from "@/app/componentes/inicio/CambiarDestinoButton";
import { destinosMock } from "@/app/datos/mock/destinos";
import { inicioPorDestino } from "@/app/datos/mock/inicioPorDestino";
import { useDestinoStore } from "@/app/store/useDestinoStore";

export default function InicioPantalla() {
  const navigate = useNavigate();
  const destinoSeleccionado = useDestinoStore((state) => state.destinoSeleccionado);
  const setDestinoSeleccionado = useDestinoStore(
    (state) => state.setDestinoSeleccionado
  );
  const limpiarDestinoSeleccionado = useDestinoStore(
    (state) => state.limpiarDestinoSeleccionado
  );

  if (!destinoSeleccionado) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] pb-24">
        <div className="mx-auto w-full max-w-[393px] px-4 pt-6">
          <div className="mb-6">
            <h1 className="text-[28px] font-bold text-black">Descubre tu destino</h1>
            <p className="mt-2 text-[14px] text-[#7c6b69]">
              Selecciona una ciudad o región para empezar a explorar
            </p>
          </div>

          <div className="space-y-4">
            {destinosMock.map((destino) => (
              <TarjetaDestino
                key={destino.id}
                destino={destino}
                onClick={() => setDestinoSeleccionado(destino.id)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const data = inicioPorDestino[destinoSeleccionado];

  return (
    <div className="bg-white min-h-screen w-full max-w-[393px] mx-auto relative overflow-y-auto pb-24">
      <HeroDestino
        titulo={data.heroTitulo}
        subtitulo={data.heroSubtitulo}
        imagen={data.heroImagen}
        onExplorar={() => navigate("/mapa")}
        onEventos={() => navigate("/calendario")}
        botonExplorarTexto={data.botonExplorarTexto}
        botonEventosTexto={data.botonEventosTexto}
      />

      <ExploraVisualmenteCard
        titulo={data.exploraTitulo}
        descripcion={data.exploraDescripcion}
        imagen={data.exploraImagen}
        onAbrirMapa={() => navigate("/mapa")}
      />

      <div className="px-6">
        <SeccionInicio titulo="Eventos de hoy">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {data.eventosHoy.length > 0 ? (
              data.eventosHoy.map((evento) => (
                <EventoDiaCard
                  key={evento.id}
                  titulo={evento.titulo}
                  imagen={evento.imagen}
                />
              ))
            ) : (
              <p className="text-[12px] text-[#7c6b69]">
                Próximamente habrá eventos destacados para este destino.
              </p>
            )}
          </div>
        </SeccionInicio>

        <SeccionInicio titulo="Recomendaciones del día">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {data.recomendaciones.length > 0 ? (
              data.recomendaciones.map((recomendacion) => (
                <RecomendacionCard
                  key={recomendacion.id}
                  titulo={recomendacion.titulo}
                  imagen={recomendacion.imagen}
                />
              ))
            ) : (
              <p className="text-[12px] text-[#7c6b69]">
                Próximamente habrá recomendaciones destacadas para este destino.
              </p>
            )}
          </div>
        </SeccionInicio>
      </div>

      <CambiarDestinoButton onClick={limpiarDestinoSeleccionado} />
    </div>
  );
}