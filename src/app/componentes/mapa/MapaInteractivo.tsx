import { useEffect, useRef, useState } from "react";
import Map, {
  Marker,
  Popup,
  NavigationControl,
  type MapRef,
} from "react-map-gl/mapbox";
import type { MapaPoi } from "@/app/datos/mapa/types";
import PanelPoisMapa from "./PanelPoisMapa";

type Props = {
  longitude: number;
  latitude: number;
  zoom?: number;
  pois: MapaPoi[];
  onPoiClick?: (poiId: string) => void;
};

export default function MapaInteractivo({
  longitude,
  latitude,
  zoom = 13,
  pois,
  onPoiClick,
}: Props) {
  const mapRef = useRef<MapRef | null>(null);
  const [panelAbierto, setPanelAbierto] = useState(false);
  const [poiActivo, setPoiActivo] = useState<MapaPoi | null>(null);

  const token = import.meta.env.VITE_MAPBOX_TOKEN;

  useEffect(() => {
    if (!mapRef.current) return;

    mapRef.current.flyTo({
      center: [longitude, latitude],
      zoom,
      duration: 1200,
      essential: true,
    });
  }, [longitude, latitude, zoom]);

  useEffect(() => {
    if (!mapRef.current || pois.length === 0) return;

    if (pois.length === 1) {
      mapRef.current.flyTo({
        center: [pois[0].lng, pois[0].lat],
        zoom: 14.5,
        duration: 1000,
        essential: true,
      });
      return;
    }

    const bounds = pois.reduce(
      (acc, poi) => acc.extend([poi.lng, poi.lat]),
      new window.mapboxgl.LngLatBounds(
        [pois[0].lng, pois[0].lat],
        [pois[0].lng, pois[0].lat]
      )
    );

    mapRef.current.fitBounds(bounds, {
      padding: 70,
      maxZoom: 13.8,
      duration: 1200,
    });
  }, [pois]);

  const seleccionarPoi = (poi: MapaPoi) => {
    if (!mapRef.current) return;

    mapRef.current.flyTo({
      center: [poi.lng, poi.lat],
      zoom: 15.5,
      duration: 1000,
      essential: true,
    });

    setPoiActivo(poi);
  };

  if (!token) {
    return (
      <div className="rounded-[24px] bg-white p-6 shadow-sm">
        <h3 className="text-[18px] font-semibold text-black">
          Falta el token de Mapbox
        </h3>
        <p className="mt-2 text-[14px] leading-[24px] text-[#6d6d6d]">
          Crea un archivo <code>.env</code> en la raíz del proyecto con{" "}
          <code>VITE_MAPBOX_TOKEN=...</code> para activar el mapa interactivo.
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[24px] bg-white shadow-sm">
      <Map
        ref={mapRef}
        mapboxAccessToken={token}
        mapStyle="mapbox://styles/mapbox/standard"
        initialViewState={{
          longitude,
          latitude,
          zoom,
        }}
        reuseMaps
        style={{ width: "100%", height: 520 }}
      >
        <NavigationControl position="top-right" />

        {pois.map((poi) => (
          <Marker
            key={poi.id}
            longitude={poi.lng}
            latitude={poi.lat}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setPoiActivo(poi);
            }}
          >
            <div className="h-[18px] w-[18px] rounded-full border-4 border-white bg-[#ff3b30] shadow-[0_4px_18px_rgba(0,0,0,0.25)]" />
          </Marker>
        ))}

        {poiActivo && (
          <Popup
            longitude={poiActivo.lng}
            latitude={poiActivo.lat}
            anchor="top"
            onClose={() => setPoiActivo(null)}
            closeButton
            closeOnClick={false}
            offset={18}
          >
            <div className="w-[220px]">
              <img
                src={poiActivo.imagen}
                alt={poiActivo.nombre}
                className="mb-2 h-[110px] w-full rounded-[12px] object-cover"
              />
              <h3 className="text-[15px] font-semibold text-black">
                {poiActivo.nombre}
              </h3>
              <p className="mt-1 text-[12px] text-[#7c6b69]">
                {poiActivo.categoria}
              </p>
              <p className="mt-2 text-[12px] leading-[18px] text-[#6d6d6d]">
                {poiActivo.descripcion}
              </p>

              {onPoiClick ? (
                <button
                  type="button"
                  onClick={() => onPoiClick(poiActivo.id)}
                  className="mt-3 h-[36px] w-full rounded-[10px] bg-[#f2361d] text-[13px] font-semibold text-white"
                >
                  Ver detalle
                </button>
              ) : null}
            </div>
          </Popup>
        )}
      </Map>

      <button
        type="button"
        onClick={() => setPanelAbierto((v) => !v)}
        className="absolute left-4 top-4 z-20 rounded-full bg-white/95 px-4 py-2 text-[13px] font-semibold text-black shadow-md backdrop-blur"
      >
        {panelAbierto ? "Ocultar POIs" : "Ver POIs"}
      </button>

      <PanelPoisMapa
        abierto={panelAbierto}
        pois={pois}
        onCerrar={() => setPanelAbierto(false)}
        onSeleccionarPoi={seleccionarPoi}
      />
    </div>
  );
}