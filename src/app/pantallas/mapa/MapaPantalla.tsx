import { useNavigate } from "react-router-dom";
import { useDestinoStore } from "@/app/store/useDestinoStore";
import { mapaPorDestino } from "@/app/datos/mock/mapaPorDestino";
import { poiPorDestino } from "@/app/datos/mock/poiPorDestino";
import TarjetaDestacadaMapa from "@/app/componentes/mapa/TarjetaDestacadaMapa";
import ContenedorPantallaPrincipal from "@/app/componentes/layout/ContenedorPantallaPrincipal";
import {
  mapaInteractivoPorDestino,
  poisInteractivosPorDestino,
} from "@/app/datos/mapa/mapaInteractivoPorDestino";
import MapaInteractivo from "@/app/componentes/mapa/MapaInteractivo";

export default function MapaPantalla() {
  const navigate = useNavigate();
  const destinoSeleccionado = useDestinoStore((state) => state.destinoSeleccionado);

  if (!destinoSeleccionado) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-[24px] font-semibold text-black mb-3">
            No has seleccionado destino
          </h1>
          <button
            onClick={() => navigate("/inicio")}
            className="rounded-[10px] bg-[#e12414] px-6 py-3 text-white"
          >
            Ir a inicio
          </button>
        </div>
      </div>
    );
  }

  const config = mapaPorDestino[destinoSeleccionado];
  const pois = poiPorDestino[destinoSeleccionado];
  const configInteractivo = mapaInteractivoPorDestino[destinoSeleccionado];
  const poisInteractivos = poisInteractivosPorDestino[destinoSeleccionado] ?? [];

  return (
    <div className="min-h-screen bg-[#f6f6f3]">
      <ContenedorPantallaPrincipal className="pt-3">
        <div className="rounded-[28px] bg-white p-5 shadow-sm">
          <h2 className="text-[22px] font-semibold text-black">{config.titulo}</h2>
          <p className="mt-2 text-[14px] leading-[24px] text-[#7c6b69]">
            {config.subtitulo}
          </p>

          <div className="mt-5">
            {configInteractivo ? (
              <MapaInteractivo
                longitude={configInteractivo.longitude}
                latitude={configInteractivo.latitude}
                zoom={configInteractivo.zoom}
                pois={poisInteractivos}
                onPoiClick={(poiId) => navigate(`/poi/${poiId}`)}
              />
            ) : (
              <div className="overflow-hidden rounded-[24px] bg-[#f1f1f1]">
                <img
                  src={config.mapaImagen}
                  alt={config.titulo}
                  className="h-[470px] w-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {config.destacados.length > 0 && (
          <section className="mt-8">
            <div className="mb-4">
              <h3 className="text-[28px] font-bold text-black">Lugares destacados</h3>
              <p className="mt-1 text-[14px] leading-[24px] text-[#7c6b69]">
                Lugares relevantes del destino con una pequeña explicación para entender
                mejor su valor dentro del recorrido.
              </p>
            </div>

            <div className="space-y-5">
              {config.destacados.map((item, index) => (
                <TarjetaDestacadaMapa
                  key={`${item.titulo}-${index}`}
                  titulo={item.titulo}
                  categoria={item.categoria}
                  descripcion={item.descripcion}
                  imagen={item.imagen}
                />
              ))}
            </div>
          </section>
        )}

        <section className="mt-8">
          <div className="mb-4">
            <h3 className="text-[28px] font-bold text-black">Puntos de interés</h3>
            <p className="mt-1 text-[14px] leading-[24px] text-[#7c6b69]">
              Consulta lugares concretos del mapa y entra a su ficha para ver más detalle.
            </p>
          </div>

          {pois.length > 0 ? (
            <div className="space-y-4">
              {pois.map((poi) => (
                <button
                  key={poi.id}
                  type="button"
                  onClick={() => navigate(`/poi/${poi.id}`)}
                  className="w-full overflow-hidden rounded-[22px] bg-white text-left shadow-sm transition hover:shadow-md"
                >
                  <img
                    src={poi.imagenHero}
                    alt={poi.nombre}
                    className="h-[210px] w-full object-cover"
                  />

                  <div className="p-4">
                    <h4 className="text-[18px] font-semibold text-black">
                      {poi.nombre}
                    </h4>
                    <p className="mt-1 text-[14px] text-[#7c6b69]">{poi.categoria}</p>
                    <div className="mt-2 flex gap-3 text-[12px] text-[#7c6b69]">
                      <span>⭐ {poi.puntuacion}</span>
                      <span>⏱ {poi.duracion}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-[22px] bg-white p-5 shadow-sm">
              <p className="text-[14px] text-[#7c6b69]">
                Próximamente habrá POIs destacados para este destino.
              </p>
            </div>
          )}
        </section>
      </ContenedorPantallaPrincipal>
    </div>
  );
}