import { useNavigate } from "react-router-dom";
import { useDestinoStore } from "@/app/store/useDestinoStore";
import { mapaPorDestino } from "@/app/datos/mock/mapaPorDestino";
import { poiPorDestino } from "@/app/datos/mock/poiPorDestino";

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

  return (
    <div className="min-h-screen bg-[#f5f7fb] pb-24">
      <div className="mx-auto w-full max-w-[393px] pt-4 px-3">
        <h1 className="text-[22px] font-semibold text-black">{config.titulo}</h1>
        <p className="mt-1 text-[13px] text-[#7c6b69]">{config.subtitulo}</p>

        <div className="mt-4 overflow-hidden rounded-[24px] bg-white shadow-sm">
          <img
            src={config.mapaImagen}
            alt={config.titulo}
            className="h-[540px] w-full object-cover"
          />
        </div>

        {config.poiCards.length > 0 && (
          <div className="mt-4 space-y-3">
            {config.poiCards.map((card, index) => (
              <div
                key={`${config.titulo}-poi-card-${index}`}
                className="overflow-hidden rounded-[20px] bg-white shadow-sm"
              >
                <img
                  src={card}
                  alt={`POI card ${index + 1}`}
                  className="w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {pois.length > 0 && (
          <div className="mt-5 space-y-3">
            {pois.map((poi) => (
              <button
                key={poi.id}
                type="button"
                onClick={() => navigate(`/poi/${poi.id}`)}
                className="w-full overflow-hidden rounded-[20px] bg-white text-left shadow-sm transition hover:shadow-md"
              >
                <img
                  src={poi.imagenHero}
                  alt={poi.nombre}
                  className="h-[160px] w-full object-cover"
                />
                <div className="p-4">
                  <h2 className="text-[16px] font-semibold text-black">{poi.nombre}</h2>
                  <p className="mt-1 text-[13px] text-[#7c6b69]">{poi.categoria}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}