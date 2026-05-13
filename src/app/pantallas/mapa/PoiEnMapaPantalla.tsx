import { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  buildGoogleMapsUrl,
  readPoiFromSearch,
} from "@/app/utilidades/poiMap";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

export default function PoiEnMapaPantalla() {
  const navigate = useNavigate();
  const location = useLocation();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  const poi = useMemo(() => readPoiFromSearch(location.search), [location.search]);

  useEffect(() => {
    if (!MAPBOX_TOKEN || !mapContainerRef.current || mapRef.current || !poi) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const lng =
      typeof poi.lon === "number" && Number.isFinite(poi.lon) ? poi.lon : -3.7038;
    const lat =
      typeof poi.lat === "number" && Number.isFinite(poi.lat) ? poi.lat : 40.4168;
    const zoom =
      typeof poi.lat === "number" &&
      Number.isFinite(poi.lat) &&
      typeof poi.lon === "number" &&
      Number.isFinite(poi.lon)
        ? 16
        : 11;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", () => {
      if (
        typeof poi.lat === "number" &&
        Number.isFinite(poi.lat) &&
        typeof poi.lon === "number" &&
        Number.isFinite(poi.lon)
      ) {
        markerRef.current = new mapboxgl.Marker({ color: "#ff5a36" })
          .setLngLat([poi.lon, poi.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 22 }).setHTML(`
              <div style="min-width:220px">
                <div style="font-weight:700;font-size:14px;margin-bottom:6px;">
                  ${escapeHtml(poi.nombre)}
                </div>
                ${
                  poi.categoria
                    ? `<div style="font-size:12px;color:#ff5a36;font-weight:600;margin-bottom:6px;">
                        ${escapeHtml(poi.categoria)}
                      </div>`
                    : ""
                }
                ${
                  poi.direccion
                    ? `<div style="font-size:12px;color:#667085;line-height:1.5;">
                        ${escapeHtml(poi.direccion)}
                      </div>`
                    : ""
                }
              </div>
            `),
          )
          .addTo(map);

        markerRef.current.togglePopup();
      }
    });

    mapRef.current = map;

    return () => {
      markerRef.current?.remove();
      markerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, [poi]);

  if (!poi) {
    return (
      <div className="min-h-screen bg-[#f3f5f9] px-5 py-6 text-[#111827]">
        <div className="mx-auto max-w-[860px] rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.07)]">
          <h1 className="text-[24px] font-bold">POI no disponible</h1>
          <p className="mt-3 text-sm leading-6 text-[#667085]">
            No se ha recibido información válida para mostrar este punto en el mapa.
          </p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-5 rounded-2xl bg-[#111827] px-5 py-3 text-sm font-semibold text-white"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  const googleMapsUrl = buildGoogleMapsUrl(poi);

  return (
    <div className="min-h-screen bg-[#f3f5f9] text-[#111827]">
      <div className="mx-auto w-full max-w-[1100px] px-5 pb-10 pt-5">
        <section className="rounded-[30px] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.07)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#94a3b8]">
                Punto de interés
              </p>
              <h1 className="mt-2 text-[28px] font-bold tracking-[-0.03em]">
                {poi.nombre}
              </h1>
              {poi.categoria && (
                <p className="mt-2 inline-flex rounded-full bg-[#fff1eb] px-3 py-1 text-xs font-semibold text-[#ff5a36]">
                  {poi.categoria}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-semibold text-[#111827]"
              >
                Volver
              </button>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl bg-[#111827] px-4 py-3 text-sm font-semibold text-white"
              >
                Ver en Google
              </a>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="overflow-hidden rounded-[24px] border border-[#e5e7eb] bg-[#eef2f7]">
              {MAPBOX_TOKEN ? (
                <div ref={mapContainerRef} className="h-[520px] w-full" />
              ) : (
                <div className="flex h-[520px] items-center justify-center p-6 text-center text-sm text-[#667085]">
                  Falta configurar VITE_MAPBOX_TOKEN en el frontend.
                </div>
              )}
            </div>

            <aside className="rounded-[24px] border border-[#e5e7eb] bg-[#fcfcfd] p-5">
              <h2 className="text-[18px] font-bold">Información del POI</h2>

              {poi.descripcion ? (
                <p className="mt-4 text-sm leading-7 text-[#475467]">
                  {poi.descripcion}
                </p>
              ) : (
                <p className="mt-4 text-sm leading-7 text-[#98a2b3]">
                  Este POI no tiene descripción ampliada disponible.
                </p>
              )}

              <div className="mt-5 space-y-3">
                {poi.direccion && (
                  <div className="rounded-[18px] bg-white px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#98a2b3]">
                      Dirección
                    </p>
                    <p className="mt-1 text-sm text-[#344054]">{poi.direccion}</p>
                  </div>
                )}

                {typeof poi.lat === "number" &&
                  Number.isFinite(poi.lat) &&
                  typeof poi.lon === "number" &&
                  Number.isFinite(poi.lon) && (
                    <div className="rounded-[18px] bg-white px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#98a2b3]">
                        Coordenadas
                      </p>
                      <p className="mt-1 text-sm text-[#344054]">
                        {poi.lat.toFixed(6)}, {poi.lon.toFixed(6)}
                      </p>
                    </div>
                  )}
              </div>

              <div className="mt-5">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-[#ff5a36] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(255,90,54,0.28)]"
                >
                  Abrir en Google Maps
                </a>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}