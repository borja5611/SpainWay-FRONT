import type { MapaPoi } from "@/app/datos/mapa/types";

type Props = {
  abierto: boolean;
  pois: MapaPoi[];
  onCerrar: () => void;
  onSeleccionarPoi: (poi: MapaPoi) => void;
};

export default function PanelPoisMapa({
  abierto,
  pois,
  onCerrar,
  onSeleccionarPoi,
}: Props) {
  return (
    <div
      className={`absolute inset-x-0 bottom-0 z-20 transition-transform duration-300 ${
        abierto ? "translate-y-0" : "translate-y-[82%]"
      }`}
    >
      <div className="mx-3 rounded-t-[24px] border border-black/5 bg-white shadow-[0_-8px_28px_rgba(0,0,0,0.16)]">
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <button
            type="button"
            onClick={onCerrar}
            className="mx-auto h-[6px] w-[58px] rounded-full bg-[#d6d6d6]"
            aria-label="Cerrar panel"
          />
        </div>

        <div className="px-4 pb-3">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[18px] font-semibold text-black">
              Puntos de interés
            </h3>
            <span className="text-[12px] text-[#7c6b69]">{pois.length} lugares</span>
          </div>

          <div className="max-h-[260px] space-y-3 overflow-y-auto pb-2">
            {pois.map((poi) => (
              <button
                key={poi.id}
                type="button"
                onClick={() => onSeleccionarPoi(poi)}
                className="flex w-full items-center gap-3 rounded-[16px] border border-[#ececec] bg-[#fafafa] p-3 text-left transition hover:bg-[#f3f3f3]"
              >
                <img
                  src={poi.imagen}
                  alt={poi.nombre}
                  className="h-[62px] w-[62px] rounded-[12px] object-cover"
                />

                <div className="min-w-0">
                  <p className="truncate text-[15px] font-semibold text-black">
                    {poi.nombre}
                  </p>
                  <p className="mt-1 text-[12px] text-[#7c6b69]">
                    {poi.categoria}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[12px] leading-[18px] text-[#6d6d6d]">
                    {poi.descripcion}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}