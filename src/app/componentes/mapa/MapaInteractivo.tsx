import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl, { LngLatBounds, Popup } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

type PoiMapa = {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  imagen?: string;
  lat: number;
  lng: number;
};

type Props = {
  latitude: number;
  longitude: number;
  zoom: number;
  pois?: PoiMapa[];
  onPoiClick?: (poiId: string) => void;
};

type PopupPoi = PoiMapa | null;

function isValidCoordinate(value: number): boolean {
  return Number.isFinite(value);
}

function normalizarTexto(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function traducirCategoria(valor: string): string {
  const v = normalizarTexto(valor);

  if (
    v.includes("museum") ||
    v.includes("museo")
  ) {
    return "Museo";
  }

  if (
    v.includes("monument") ||
    v.includes("monumento") ||
    v.includes("heritage") ||
    v.includes("patrimonio") ||
    v.includes("castle") ||
    v.includes("castillo") ||
    v.includes("fort") ||
    v.includes("fortaleza")
  ) {
    return "Patrimonio y monumentos";
  }

  if (
    v.includes("church") ||
    v.includes("cathedral") ||
    v.includes("iglesia") ||
    v.includes("catedral") ||
    v.includes("religious")
  ) {
    return "Patrimonio religioso";
  }

  if (
    v.includes("beach") ||
    v.includes("playa") ||
    v.includes("coast") ||
    v.includes("costa")
  ) {
    return "Playa y costa";
  }

  if (
    v.includes("park") ||
    v.includes("parque") ||
    v.includes("nature") ||
    v.includes("natural") ||
    v.includes("mirador") ||
    v.includes("mountain") ||
    v.includes("sendero")
  ) {
    return "Naturaleza y paisajes";
  }

  if (
    v.includes("cultural_center") ||
    v.includes("cultural center") ||
    v.includes("cultura") ||
    v.includes("arte") ||
    v.includes("gallery") ||
    v.includes("teatro") ||
    v.includes("auditorium")
  ) {
    return "Cultura y ocio";
  }

  if (
    v.includes("historic") ||
    v.includes("historia") ||
    v.includes("arqueolog")
  ) {
    return "Historia y arqueología";
  }

  if (
    v.includes("architecture") ||
    v.includes("arquitect")
  ) {
    return "Arquitectura";
  }

  if (
    v.includes("stadium") ||
    v.includes("estadio") ||
    v.includes("sport") ||
    v.includes("deporte")
  ) {
    return "Deporte y espectáculos";
  }

  if (
    v.includes("square") ||
    v.includes("plaza") ||
    v.includes("street") ||
    v.includes("calle") ||
    v.includes("historic center") ||
    v.includes("casco")
  ) {
    return "Entorno urbano histórico";
  }

  return "Lugar de interés";
}

function getIconoPoi(categoria: string): string {
  const v = normalizarTexto(categoria);

  if (v.includes("museum") || v.includes("museo")) return "🏛️";
  if (
    v.includes("monument") ||
    v.includes("monumento") ||
    v.includes("heritage") ||
    v.includes("patrimonio") ||
    v.includes("castle") ||
    v.includes("castillo") ||
    v.includes("fort")
  ) {
    return "🏰";
  }
  if (
    v.includes("church") ||
    v.includes("cathedral") ||
    v.includes("iglesia") ||
    v.includes("catedral") ||
    v.includes("religious")
  ) {
    return "⛪";
  }
  if (
    v.includes("beach") ||
    v.includes("playa") ||
    v.includes("coast") ||
    v.includes("costa")
  ) {
    return "🏖️";
  }
  if (
    v.includes("park") ||
    v.includes("parque") ||
    v.includes("nature") ||
    v.includes("natural") ||
    v.includes("mountain") ||
    v.includes("mirador") ||
    v.includes("sendero")
  ) {
    return "🌿";
  }
  if (
    v.includes("cultural_center") ||
    v.includes("cultural center") ||
    v.includes("cultura") ||
    v.includes("gallery") ||
    v.includes("arte") ||
    v.includes("teatro")
  ) {
    return "🎭";
  }
  if (
    v.includes("stadium") ||
    v.includes("estadio") ||
    v.includes("sport") ||
    v.includes("deporte")
  ) {
    return "🏟️";
  }
  if (
    v.includes("architecture") ||
    v.includes("arquitect")
  ) {
    return "🧱";
  }

  return "📍";
}

function getColoresPoi(categoria: string) {
  const v = normalizarTexto(categoria);

  if (v.includes("museum") || v.includes("museo")) {
    return {
      fondo: "#fff4e8",
      borde: "#ffd19a",
      texto: "#9a5b00",
    };
  }

  if (
    v.includes("monument") ||
    v.includes("monumento") ||
    v.includes("heritage") ||
    v.includes("patrimonio") ||
    v.includes("castle") ||
    v.includes("castillo") ||
    v.includes("fort")
  ) {
    return {
      fondo: "#f4ecff",
      borde: "#cfb3ff",
      texto: "#6941c6",
    };
  }

  if (
    v.includes("church") ||
    v.includes("cathedral") ||
    v.includes("iglesia") ||
    v.includes("catedral") ||
    v.includes("religious")
  ) {
    return {
      fondo: "#eef4ff",
      borde: "#b7cdfa",
      texto: "#1d4ed8",
    };
  }

  if (
    v.includes("beach") ||
    v.includes("playa") ||
    v.includes("coast") ||
    v.includes("costa")
  ) {
    return {
      fondo: "#e8fbff",
      borde: "#9fe4f3",
      texto: "#0f766e",
    };
  }

  if (
    v.includes("park") ||
    v.includes("parque") ||
    v.includes("nature") ||
    v.includes("natural") ||
    v.includes("mountain") ||
    v.includes("mirador") ||
    v.includes("sendero")
  ) {
    return {
      fondo: "#ecfdf3",
      borde: "#9de2b6",
      texto: "#027a48",
    };
  }

  if (
    v.includes("cultural_center") ||
    v.includes("cultural center") ||
    v.includes("cultura") ||
    v.includes("gallery") ||
    v.includes("arte") ||
    v.includes("teatro")
  ) {
    return {
      fondo: "#fff0f3",
      borde: "#ffb8c6",
      texto: "#c11574",
    };
  }

  if (
    v.includes("stadium") ||
    v.includes("estadio") ||
    v.includes("sport") ||
    v.includes("deporte")
  ) {
    return {
      fondo: "#fff4ef",
      borde: "#ffb79f",
      texto: "#d9481f",
    };
  }

  return {
    fondo: "#f4f4f5",
    borde: "#d4d4d8",
    texto: "#3f3f46",
  };
}

export default function MapaInteractivo({
  latitude,
  longitude,
  zoom,
  pois = [],
  onPoiClick,
}: Props) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupRef = useRef<Popup | null>(null);

  const [selectedPoi, setSelectedPoi] = useState<PopupPoi>(null);

  const token = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;
  const mapError = !token
    ? "Falta configurar VITE_MAPBOX_TOKEN en el frontend."
    : null;

  const poisValidos = useMemo(
    () =>
      pois.filter(
        (poi) => isValidCoordinate(poi.lat) && isValidCoordinate(poi.lng)
      ),
    [pois]
  );

  useEffect(() => {
    if (mapError) return;
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;
    if (!token) return;

    try {
      mapboxgl.accessToken = token;

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [longitude, latitude],
        zoom,
      });

      map.addControl(new mapboxgl.NavigationControl(), "top-right");

      map.on("error", (event) => {
        console.error("Error de Mapbox:", event?.error);
      });

      mapRef.current = map;
    } catch (error) {
      console.error("No se ha podido inicializar el mapa interactivo:", error);
    }

    return () => {
      popupRef.current?.remove();
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [latitude, longitude, zoom, token, mapError]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!isValidCoordinate(latitude) || !isValidCoordinate(longitude)) return;

    map.easeTo({
      center: [longitude, latitude],
      zoom,
      duration: 600,
    });
  }, [latitude, longitude, zoom]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    popupRef.current?.remove();
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    poisValidos.forEach((poi) => {
      const categoriaTraducida = traducirCategoria(poi.categoria);
      const icono = getIconoPoi(poi.categoria);
      const colores = getColoresPoi(poi.categoria);

      const el = document.createElement("button");
      el.type = "button";
      el.className = "poi-marker-boton";
      el.setAttribute("aria-label", poi.nombre);
      el.style.width = "52px";
      el.style.height = "52px";
      el.style.borderRadius = "9999px";
      el.style.border = `2px solid ${colores.borde}`;
      el.style.background = colores.fondo;
      el.style.boxShadow = "0 10px 26px rgba(15, 23, 42, 0.16)";
      el.style.display = "flex";
      el.style.alignItems = "center";
      el.style.justifyContent = "center";
      el.style.cursor = "pointer";
      el.style.fontSize = "24px";
      el.style.lineHeight = "1";
      const span = document.createElement("span");
      span.textContent = icono;
      el.appendChild(span);

      el.addEventListener("click", () => {
        setSelectedPoi(poi);

        popupRef.current?.remove();
        popupRef.current = new mapboxgl.Popup({
          offset: 20,
          closeButton: false,
          maxWidth: "300px",
        })
          .setLngLat([poi.lng, poi.lat])
          .setHTML(`
            <div style="padding:6px 4px 4px 4px;font-family:inherit;">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                <div style="
                  width:36px;
                  height:36px;
                  border-radius:9999px;
                  display:flex;
                  align-items:center;
                  justify-content:center;
                  background:${colores.fondo};
                  border:1px solid ${colores.borde};
                  font-size:18px;
                ">
                  ${icono}
                </div>
                <div style="
                  font-size:12px;
                  font-weight:700;
                  color:${colores.texto};
                ">
                  ${categoriaTraducida}
                </div>
              </div>

              <div style="
                font-size:17px;
                font-weight:700;
                color:#111827;
                margin-bottom:8px;
                line-height:1.25;
              ">
                ${poi.nombre}
              </div>

              <div style="
                font-size:13px;
                line-height:1.5;
                color:#667085;
              ">
                ${poi.descripcion}
              </div>
            </div>
          `)
          .addTo(map);
      });

      const marker = new mapboxgl.Marker(el).setLngLat([poi.lng, poi.lat]).addTo(map);
      markersRef.current.push(marker);
    });

    if (poisValidos.length === 0) {
      map.easeTo({
        center: [longitude, latitude],
        zoom,
        duration: 500,
      });
      return;
    }

    if (poisValidos.length === 1) {
      map.easeTo({
        center: [poisValidos[0].lng, poisValidos[0].lat],
        zoom: Math.max(zoom, 13),
        duration: 600,
      });
      return;
    }

    const bounds = new LngLatBounds();

    poisValidos.forEach((poi) => {
      bounds.extend([poi.lng, poi.lat]);
    });

    map.fitBounds(bounds, {
      padding: 70,
      maxZoom: 13.5,
      duration: 700,
    });
  }, [latitude, longitude, poisValidos, zoom]);

  if (mapError) {
    return (
      <div className="rounded-[24px] border border-[#f1d4cc] bg-[#fff7f4] p-5">
        <p className="text-sm font-semibold text-[#b42318]">No se pudo cargar el mapa</p>
        <p className="mt-2 text-sm leading-6 text-[#7a271a]">{mapError}</p>

        {poisValidos.length > 0 && (
          <div className="mt-4 space-y-3">
            {poisValidos.slice(0, 6).map((poi) => (
              <div
                key={poi.id}
                className="rounded-2xl border border-[#f0e4df] bg-white p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#ff5a36]">
                  {traducirCategoria(poi.categoria)}
                </p>
                <h4 className="mt-2 text-base font-bold text-[#111827]">{poi.nombre}</h4>
                <p className="mt-2 text-sm leading-6 text-[#667085]">{poi.descripcion}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-[24px] border border-[#eceae5]">
        <div ref={mapContainerRef} className="h-[420px] w-full bg-[#eef2f7]" />

        <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/92 px-3 py-2 text-xs font-semibold text-[#111827] shadow-sm backdrop-blur">
          {poisValidos.length > 0
            ? `${poisValidos.length} lugares ubicados en el mapa`
            : "Mapa general del destino"}
        </div>
      </div>

      {selectedPoi && (
        <div className="mt-4 rounded-[24px] bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#fff4ef] px-3 py-1 text-xs font-semibold text-[#ff5a36]">
                <span>{getIconoPoi(selectedPoi.categoria)}</span>
                <span>{traducirCategoria(selectedPoi.categoria)}</span>
              </div>

              <h3 className="mt-3 text-[22px] font-semibold text-black">
                {selectedPoi.nombre}
              </h3>

              <p className="mt-3 text-[14px] leading-[24px] text-[#7c6b69]">
                {selectedPoi.descripcion}
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                {onPoiClick && (
                  <button
                    type="button"
                    onClick={() => onPoiClick(selectedPoi.id)}
                    className="rounded-[14px] bg-[#ff5a36] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(255,90,54,0.28)]"
                  >
                    Ver detalle del POI
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedPoi(null)}
                  className="rounded-[14px] border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-semibold text-[#111827]"
                >
                  Cerrar
                </button>
              </div>
            </div>

            {selectedPoi.imagen ? (
              <div className="w-full overflow-hidden rounded-[20px] md:w-[260px]">
                <img
                  src={selectedPoi.imagen}
                  alt={selectedPoi.nombre}
                  className="h-[200px] w-full object-cover"
                />
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}