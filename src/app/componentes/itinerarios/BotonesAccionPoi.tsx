import { useNavigate } from "react-router-dom";
import {
  buildGoogleMapsDirectionsUrl,
  buildGoogleMapsUrl,
  buildPoiMapUrl,
  type PoiMapPayload,
} from "@/app/utilidades/poiMap";

type Props = {
  poi: PoiMapPayload;
};

export default function BotonesAccionPoi({ poi }: Props) {
  const navigate = useNavigate();

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => navigate(buildPoiMapUrl(poi))}
        className="rounded-full bg-[#0f172a] px-4 py-2 text-xs font-bold text-white"
      >
        Ver en mapa
      </button>

      <a
        href={buildGoogleMapsDirectionsUrl(poi)}
        target="_blank"
        rel="noreferrer"
        className="rounded-full bg-[#fff1eb] px-4 py-2 text-xs font-bold text-[#ff5a36]"
        title="Abre Google Maps con destino al POI; Google usará tu ubicación actual si das permiso en el navegador."
      >
        Ir desde mi ubicación
      </a>

      <a
        href={buildGoogleMapsUrl(poi)}
        target="_blank"
        rel="noreferrer"
        className="rounded-full bg-[#f8fafc] px-4 py-2 text-xs font-bold text-[#475467]"
      >
        Buscar en Google
      </a>
    </div>
  );
}