import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDestinoStore } from "@/app/store/useDestinoStore";
import { poiPorDestino } from "@/app/datos/mock/poiPorDestino";

export default function DetallePoiPantalla() {
  const navigate = useNavigate();
  const { poiId } = useParams<{ poiId: string }>();
  const destinoSeleccionado = useDestinoStore((state) => state.destinoSeleccionado);

  const poi = useMemo(() => {
    if (!destinoSeleccionado || !poiId) return null;
    return poiPorDestino[destinoSeleccionado].find((item) => item.id === poiId) ?? null;
  }, [destinoSeleccionado, poiId]);

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

  if (!poi) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-[24px] font-semibold text-black mb-3">
            POI no encontrado
          </h1>
          <button
            onClick={() => navigate("/mapa")}
            className="rounded-[10px] bg-[#e12414] px-6 py-3 text-white"
          >
            Volver al mapa
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] pb-24">
      <div className="mx-auto w-full max-w-[393px]">
        <div className="relative">
          <img
            src={poi.imagenHero}
            alt={poi.nombre}
            className="h-[270px] w-full object-cover"
          />

          <button
            type="button"
            onClick={() => navigate("/mapa")}
            className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-2 text-sm text-black shadow-sm"
          >
            ←
          </button>
        </div>

        <div className="px-4 pt-4">
          <div className="rounded-[24px] bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h1 className="text-[22px] font-semibold text-black">{poi.nombre}</h1>
                <p className="mt-1 text-[13px] text-[#7c6b69]">{poi.categoria}</p>
              </div>

              <button
                type="button"
                className="rounded-full border border-[#ececec] px-3 py-2 text-[12px]"
              >
                ♥
              </button>
            </div>

            <div className="mb-4 flex gap-3 text-[12px] text-[#7c6b69]">
              <span>⭐ {poi.puntuacion}</span>
              <span>⏱ {poi.duracion}</span>
            </div>

            {poi.imagenPreview && (
              <div className="mb-4 overflow-hidden rounded-[18px] bg-neutral-100">
                <img
                  src={poi.imagenPreview}
                  alt={`${poi.nombre} preview`}
                  className="w-full object-cover"
                />
              </div>
            )}

            <div>
              <h2 className="mb-2 text-[16px] font-semibold text-black">Descripción</h2>
              <p className="text-[13px] leading-[22px] text-[#7c6b69]">
                {poi.descripcion}
              </p>
            </div>

            <button
              type="button"
              className="mt-6 h-[42px] w-full rounded-[10px] bg-[#f2361d] text-white transition hover:bg-[#d12f17]"
            >
              Añadir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}