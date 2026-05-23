import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAuthStore } from "@/app/store/useAuthStore";
import { obtenerUsuarioGuardado } from "@/app/servicios/auth";
import { getFavoritos, type Favorito } from "@/app/servicios/favoritos";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

type FavoritoUi = {
  id: number;
  nombre: string;
  categoria: string;
  descripcion: string;
  direccion: string;
  latitud: number | null;
  longitud: number | null;
};

function truncar(texto: string, max = 180) {
  if (texto.length <= max) return texto;
  return `${texto.slice(0, max).trim()}...`;
}

function getCategoria(favorito: Favorito): string {
  return (
    favorito.poi.categoria_poi?.nombre ||
    favorito.poi.subcategoria ||
    favorito.poi.tipo ||
    "Lugar de interés"
  );
}

function getDescripcion(favorito: Favorito): string {
  return (
    favorito.poi.descripcion ||
    `POI guardado en favoritos dentro de SpainWay para revisarlo más tarde en el mapa.`
  );
}

function getDireccion(favorito: Favorito): string {
  return favorito.poi.direccion || favorito.poi.municipio?.nombre || "Ubicación no disponible";
}

export default function FavoritosPantalla() {
  const navigate = useNavigate();
  const usuarioStore = useAuthStore((state) => state.usuario);
  const usuario = useMemo(() => usuarioStore ?? obtenerUsuarioGuardado(), [usuarioStore]);
  const idUsuario = usuario?.id_usuario ?? null;

  const mapSectionRef = useRef<HTMLElement | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const markerMapRef = useRef<Map<number, mapboxgl.Marker>>(new Map());

  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favoritoActivoId, setFavoritoActivoId] = useState<number | null>(null);

  useEffect(() => {
    async function cargarFavoritos() {
      if (!idUsuario) {
        setLoading(false);
        setFavoritos([]);
        setError("Inicia sesión para consultar tus favoritos.");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getFavoritos(idUsuario);
        setFavoritos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar tus favoritos.");
        setFavoritos([]);
      } finally {
        setLoading(false);
      }
    }

    void cargarFavoritos();
  }, [idUsuario]);

  const favoritosUi = useMemo<FavoritoUi[]>(() => {
    return favoritos.map((favorito) => ({
      id: favorito.id_poi,
      nombre: favorito.poi.nombre,
      categoria: getCategoria(favorito),
      descripcion: getDescripcion(favorito),
      direccion: getDireccion(favorito),
      latitud: favorito.poi.latitud,
      longitud: favorito.poi.longitud,
    }));
  }, [favoritos]);

  const favoritosConCoords = useMemo(
    () =>
      favoritosUi.filter(
        (item) =>
          typeof item.latitud === "number" &&
          Number.isFinite(item.latitud) &&
          typeof item.longitud === "number" &&
          Number.isFinite(item.longitud),
      ),
    [favoritosUi],
  );

  useEffect(() => {
    if (!MAPBOX_TOKEN || !mapContainerRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-3.7038, 40.4168],
        zoom: 4.8,
      });

      mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    }

    const map = mapRef.current;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    markerMapRef.current.clear();

    if (favoritosConCoords.length === 0) {
      map.easeTo({ center: [-3.7038, 40.4168], zoom: 4.8 });
      return;
    }

    const bounds = new mapboxgl.LngLatBounds();

    favoritosConCoords.forEach((item) => {
      const marker = new mapboxgl.Marker({ color: "#ff5a36" })
        .setLngLat([item.longitud as number, item.latitud as number])
        .setPopup(
          new mapboxgl.Popup({ offset: 18 }).setHTML(`
            <div style="min-width:220px">
              <div style="font-weight:700;font-size:14px;margin-bottom:6px;">${escapeHtml(item.nombre)}</div>
              <div style="font-size:12px;color:#ff5a36;font-weight:600;margin-bottom:6px;">${escapeHtml(item.categoria)}</div>
              <div style="font-size:12px;color:#667085;line-height:1.5;">${escapeHtml(item.direccion)}</div>
            </div>
          `),
        )
        .addTo(map);

      markersRef.current.push(marker);
      markerMapRef.current.set(item.id, marker);
      bounds.extend([item.longitud as number, item.latitud as number]);
    });

    if (favoritosConCoords.length === 1) {
      map.easeTo({
        center: [favoritosConCoords[0].longitud as number, favoritosConCoords[0].latitud as number],
        zoom: 13.5,
      });
      markersRef.current[0]?.togglePopup();
    } else if (favoritoActivoId == null) {
      map.fitBounds(bounds, { padding: 60, maxZoom: 13, duration: 900 });
    }

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      markerMapRef.current.clear();
    };
  }, [favoritosConCoords, favoritoActivoId]);

  useEffect(() => {
    if (favoritosConCoords.length === 0) {
      setFavoritoActivoId(null);
      return;
    }

    if (
      favoritoActivoId == null ||
      !favoritosConCoords.some((item) => item.id === favoritoActivoId)
    ) {
      setFavoritoActivoId(favoritosConCoords[0].id);
    }
  }, [favoritosConCoords, favoritoActivoId]);

  useEffect(() => {
    if (favoritoActivoId == null) return;

    const favoritoActivo = favoritosConCoords.find((item) => item.id === favoritoActivoId);
    const marker = markerMapRef.current.get(favoritoActivoId);
    const map = mapRef.current;

    if (!favoritoActivo || !marker || !map) return;

    map.flyTo({
      center: [favoritoActivo.longitud as number, favoritoActivo.latitud as number],
      zoom: 14.5,
      duration: 900,
      essential: true,
    });

    marker.togglePopup();
  }, [favoritoActivoId, favoritosConCoords]);

  useEffect(() => {
    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      markerMapRef.current.clear();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  function handleVerEnMapa(item: FavoritoUi) {
    if (
      typeof item.latitud !== "number" ||
      !Number.isFinite(item.latitud) ||
      typeof item.longitud !== "number" ||
      !Number.isFinite(item.longitud)
    ) {
      return;
    }

    setFavoritoActivoId(item.id);
    mapSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="min-h-full bg-[#f3f5f9] text-[#111827]">
      <div className="mx-auto w-full max-w-[430px] px-5 pb-28 pt-5">
        <section
          ref={mapSectionRef}
          className="rounded-[30px] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.07)]"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#94a3b8]">Favoritos</p>
              <h1 className="mt-2 text-[28px] font-bold tracking-[-0.03em] text-[#111827]">
                Tus POIs guardados
              </h1>
              <p className="mt-3 text-sm leading-6 text-[#667085]">
                Aquí tienes el mapa de tus puntos favoritos y debajo su descripción resumida.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-semibold text-[#111827]"
            >
              Volver
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#f8fafc] p-4">
              <p className="text-xs text-[#94a3b8]">Total favoritos</p>
              <p className="mt-1 text-lg font-bold text-[#111827]">{favoritosUi.length}</p>
            </div>
            <div className="rounded-2xl bg-[#f8fafc] p-4">
              <p className="text-xs text-[#94a3b8]">Con coordenadas</p>
              <p className="mt-1 text-lg font-bold text-[#111827]">{favoritosConCoords.length}</p>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-[24px] border border-[#e5e7eb] bg-[#eef2f7]">
            {MAPBOX_TOKEN ? (
              <div ref={mapContainerRef} className="h-[280px] w-full" />
            ) : (
              <div className="flex h-[280px] items-center justify-center p-6 text-center text-sm text-[#667085]">
                Falta configurar VITE_MAPBOX_TOKEN en el frontend para mostrar el mapa de favoritos.
              </div>
            )}
          </div>
        </section>

        {loading && (
          <section className="pt-5">
            <div className="rounded-[24px] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
              <p className="text-sm font-semibold text-[#667085]">Cargando favoritos...</p>
            </div>
          </section>
        )}

        {error && (
          <section className="pt-5">
            <div className="rounded-[24px] bg-red-50 p-5 text-sm font-semibold text-red-600 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
              {error}
            </div>
          </section>
        )}

        {!loading && !error && favoritosUi.length === 0 && (
          <section className="pt-5">
            <div className="rounded-[24px] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
              <p className="text-base font-semibold text-[#111827]">Todavía no tienes favoritos guardados</p>
              <p className="mt-2 text-sm leading-6 text-[#6b7280]">
                Entra en un itinerario, pulsa la estrella de un POI y volverá a aparecer aquí automáticamente.
              </p>
            </div>
          </section>
        )}

        {!loading && !error && favoritosUi.length > 0 && (
          <section className="pt-5">
            <div className="mb-3">
              <h2 className="text-[20px] font-bold tracking-[-0.02em]">Descripción de tus favoritos</h2>
              <p className="text-sm text-[#6b7280]">Cada tarjeta resume el punto guardado para que lo identifiques rápido.</p>
            </div>

            <div className="space-y-4">
              {favoritosUi.map((item) => {
                const activo = item.id === favoritoActivoId;

                return (
                  <article
                    key={item.id}
                    className={`rounded-[24px] p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition ${
                      activo ? "bg-[#fff7f3] ring-2 ring-[#ffb199]" : "bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#ff5a36]">
                          {item.categoria}
                        </p>
                        <h3 className="mt-2 text-[20px] font-bold text-[#111827]">{item.nombre}</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleVerEnMapa(item)}
                        disabled={
                          typeof item.latitud !== "number" ||
                          !Number.isFinite(item.latitud) ||
                          typeof item.longitud !== "number" ||
                          !Number.isFinite(item.longitud)
                        }
                        className="rounded-2xl bg-[#111827] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Ver en mapa
                      </button>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-[#667085]">{truncar(item.descripcion)}</p>

                    <div className="mt-4 rounded-2xl bg-[#f8fafc] px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.12em] text-[#94a3b8]">Ubicación</p>
                      <p className="mt-1 text-sm text-[#344054]">{item.direccion}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
