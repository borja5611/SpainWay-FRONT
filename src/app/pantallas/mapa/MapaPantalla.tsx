import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDestinoStore } from "@/app/store/useDestinoStore";
import { mapaPorDestino } from "@/app/datos/mock/mapaPorDestino";
import ContenedorPantallaPrincipal from "@/app/componentes/layout/ContenedorPantallaPrincipal";
import { mapaInteractivoPorDestino } from "@/app/datos/mapa/mapaInteractivoPorDestino";
import MapaInteractivo from "@/app/componentes/mapa/MapaInteractivo";
import {
  getPoisDestacadosByComunidad,
  type PoiDestacado,
  extraerLat,
  extraerLng,
} from "@/app/servicios/poisDestacados";
import { DESTINO_TO_CCAA } from "@/app/datos/poisDestacadosVisuales";
import { getPoiById, type PoiDetalle } from "@/app/servicios/pois";
type PoiMapaUi = {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  imagen: string;
  lat: number;
  lng: number;
  direccion?: string;
};

type CardDestacadaUi = {
  id: string;
  titulo: string;
  categoria: string;
  descripcion: string;
  imagen: string;
  enlaceGoogle?: string | null;
  lat?: number | null;
  lng?: number | null;
  direccion?: string | null;
  real: boolean;
};

type PoiDetalleMapa = {
  id: number;
  nombre: string;
  categoria: string;
  descripcion: string;
  direccion: string | null;
  lat: number | null;
  lng: number | null;
  googleUrl: string | null;
};

const BLANK_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
    </svg>
  `);

function normalizarTexto(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function traducirCategoriaPoi(valor?: string | null): string {
  if (!valor) return "Lugar de interés";

  const v = normalizarTexto(valor);

  if (v === "naturaleza") return "Naturaleza";
  if (v === "cultura") return "Cultura";
  if (v === "otro") return "Otros lugares";
  if (v === "playa") return "Playa";
  if (v === "ocio") return "Ocio";
  if (v === "ruta") return "Ruta";
  if (v === "arquitectura") return "Arquitectura";
  if (v === "deporte") return "Deporte";
  if (v === "mirador") return "Mirador";
  if (v === "religioso") return "Patrimonio religioso";
  if (v === "gastronomia") return "Gastronomía";
  if (v === "poi") return "Lugar de interés";
  if (v === "patrimonio") return "Patrimonio";

  if (v.includes("museum") || v.includes("museo")) return "Cultura";
  if (v.includes("cultural_center") || v.includes("cultural center")) return "Cultura";
  if (v.includes("beach") || v.includes("playa")) return "Playa";
  if (v.includes("architecture") || v.includes("arquitect")) return "Arquitectura";
  if (v.includes("sport") || v.includes("stadium") || v.includes("deporte")) return "Deporte";
  if (v.includes("mirador") || v.includes("viewpoint")) return "Mirador";

  if (v.includes("church") || v.includes("cathedral") || v.includes("religious")) {
    return "Patrimonio religioso";
  }

  if (v.includes("heritage") || v.includes("monument") || v.includes("castle")) {
    return "Patrimonio";
  }

  if (v.includes("nature") || v.includes("park") || v.includes("natural")) {
    return "Naturaleza";
  }

  return valor.replaceAll("_", " ");
}

function buildGoogleUrl(nombre: string, direccion?: string | null): string {
  const query = [nombre, direccion].filter(Boolean).join(" ").trim();
  return `https://www.google.com/search?q=${encodeURIComponent(query || nombre)}`;
}

function descripcionBasePorCategoria(
  categoria: string,
  nombreLugar: string,
  comunidad: string
): string {
  const c = normalizarTexto(categoria);

  if (c.includes("naturaleza")) {
    return `${nombreLugar} es una propuesta ideal para disfrutar del paisaje, del entorno natural y de una visita con aire más abierto dentro de ${comunidad}.`;
  }

  if (c.includes("cultura")) {
    return `${nombreLugar} destaca como visita cultural recomendada para entender mejor la identidad, el arte y la historia local de ${comunidad}.`;
  }

  if (c.includes("playa")) {
    return `${nombreLugar} es una parada muy interesante si buscas costa, vistas abiertas y una experiencia ligada al mar dentro de ${comunidad}.`;
  }

  if (c.includes("arquitectura")) {
    return `${nombreLugar} sobresale por su valor arquitectónico y resulta muy recomendable si quieres descubrir construcciones singulares en ${comunidad}.`;
  }

  if (c.includes("patrimonio")) {
    return `${nombreLugar} forma parte del patrimonio más representativo de ${comunidad} y merece la pena si buscas visitas con peso histórico y cultural.`;
  }

  return `${nombreLugar} es uno de los lugares más interesantes para completar una visita bien equilibrada.`;
}

export default function MapaPantalla() {
  const navigate = useNavigate();
  const location = useLocation();
  const destinoSeleccionado = useDestinoStore((state) => state.destinoSeleccionado);

  const [poisReales, setPoisReales] = useState<PoiDestacado[]>([]);
  const [loading, setLoading] = useState(false);
  const mapaSectionRef = useRef<HTMLDivElement | null>(null);

  const [poiSeleccionado, setPoiSeleccionado] = useState<PoiDetalleMapa | null>(null);
  const [cargandoPoiSeleccionado, setCargandoPoiSeleccionado] = useState(false);
  const [poiEnfocado, setPoiEnfocado] = useState<PoiMapaUi | null>(null);

  const poiIdParam = useMemo(() => {
    const value = new URLSearchParams(location.search).get("poi");
    const num = Number(value);
    return Number.isInteger(num) && num > 0 ? num : null;
  }, [location.search]);

  useEffect(() => {
    async function cargarPoiSeleccionado() {
      if (!poiIdParam) {
        setPoiSeleccionado(null);
        return;
      }

      try {
        setCargandoPoiSeleccionado(true);
const poi: PoiDetalle = await getPoiById(poiIdParam);
        setPoiSeleccionado({
          id: poi.id_poi,
          nombre: poi.nombre,
          categoria: traducirCategoriaPoi(
            poi.categoria_poi?.nombre ?? poi.tipo ?? poi.subcategoria ?? "Lugar de interés"
          ),
          descripcion:
            poi.descripcion ??
            descripcionBasePorCategoria(
              traducirCategoriaPoi(poi.categoria_poi?.nombre ?? poi.tipo ?? poi.subcategoria),
              poi.nombre,
              poi.municipio?.nombre ?? "el destino"
            ),
          direccion: poi.direccion ?? null,
          lat: typeof poi.latitud === "number" ? poi.latitud : null,
          lng: typeof poi.longitud === "number" ? poi.longitud : null,
          googleUrl: null,
        });
      } catch (error) {
        console.error(error);
        setPoiSeleccionado(null);
      } finally {
        setCargandoPoiSeleccionado(false);
      }
    }

    void cargarPoiSeleccionado();
  }, [poiIdParam]);

  useEffect(() => {
    async function cargar() {
      if (!destinoSeleccionado || poiIdParam) {
        setPoisReales([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const comunidad = DESTINO_TO_CCAA[destinoSeleccionado];

        if (!comunidad) {
          setPoisReales([]);
          return;
        }

        const items = await getPoisDestacadosByComunidad(comunidad);
        setPoisReales(Array.isArray(items) ? items : []);
      } catch (error) {
        console.error(error);
        setPoisReales([]);
      } finally {
        setLoading(false);
      }
    }

    void cargar();
  }, [destinoSeleccionado, poiIdParam]);

  const config = useMemo(() => {
    if (!destinoSeleccionado || poiIdParam) return null;
    return mapaPorDestino[destinoSeleccionado] ?? null;
  }, [destinoSeleccionado, poiIdParam]);

  useEffect(() => {
    setPoiEnfocado(null);
  }, [destinoSeleccionado]);

  const configInteractivo = useMemo(() => {
    if (!destinoSeleccionado || poiIdParam) return null;
    return mapaInteractivoPorDestino[destinoSeleccionado] ?? null;
  }, [destinoSeleccionado, poiIdParam]);

  const poisMapa: PoiMapaUi[] = useMemo(() => {
    if (poiEnfocado) {
      return [poiEnfocado];
    }

    if (poiSeleccionado && poiSeleccionado.lat !== null && poiSeleccionado.lng !== null) {
      return [
        {
          id: String(poiSeleccionado.id),
          nombre: poiSeleccionado.nombre,
          categoria: poiSeleccionado.categoria,
          descripcion: poiSeleccionado.descripcion,
          imagen: BLANK_IMAGE,
          lat: poiSeleccionado.lat,
          lng: poiSeleccionado.lng,
          direccion: poiSeleccionado.direccion ?? undefined,
        },
      ];
    }

    if (!destinoSeleccionado) return [];

    const comunidad = DESTINO_TO_CCAA[destinoSeleccionado] ?? "este destino";

    return poisReales
      .map((item): PoiMapaUi | null => {
        const lat = extraerLat(item.poi);
        const lng = extraerLng(item.poi);

        if (lat === null || lng === null) return null;

        const nombre = item.poi_canonico || item.poi?.nombre || "POI destacado";

        const categoria = traducirCategoriaPoi(
          item.poi?.categoria ||
            item.poi?.categoria_poi?.nombre ||
            item.poi?.tipo ||
            "Lugar de interés"
        );

        return {
          id: String(item.id_poi),
          nombre,
          categoria,
          descripcion:
            item.poi?.descripcion ||
            item.poi?.descripcion_snippet ||
            descripcionBasePorCategoria(categoria, nombre, comunidad),
          imagen: item.imagen_url || item.poi?.image_url || BLANK_IMAGE,
          lat,
          lng,
          direccion: item.poi?.direccion ?? undefined,
        };
      })
      .filter((item): item is PoiMapaUi => item !== null);
  }, [destinoSeleccionado, poiEnfocado, poiSeleccionado, poisReales]);

  const cardsDestacadas: CardDestacadaUi[] = useMemo(() => {
    if (!destinoSeleccionado || !config) return [];

    const comunidad = DESTINO_TO_CCAA[destinoSeleccionado] ?? "este destino";

    if (poisReales.length > 0) {
      return poisReales.map((item) => {
        const nombre = item.poi_canonico || item.poi?.nombre || "POI destacado";

        const categoria = traducirCategoriaPoi(
          item.poi?.categoria ||
            item.poi?.categoria_poi?.nombre ||
            item.poi?.tipo ||
            "Lugar de interés"
        );

        return {
          id: String(item.id_poi),
          titulo: nombre,
          categoria,
          descripcion:
            item.poi?.descripcion ||
            item.poi?.descripcion_snippet ||
            descripcionBasePorCategoria(categoria, nombre, comunidad),
          imagen: item.imagen_url || item.poi?.image_url || BLANK_IMAGE,
          enlaceGoogle: null,
          lat: extraerLat(item.poi),
          lng: extraerLng(item.poi),
          direccion: item.poi?.direccion ?? null,
          real: true,
        };
      });
    }

    return config.destacados.map((item, index) => ({
      id: `mock-destacado-${index}`,
      titulo: item.titulo,
      categoria: item.categoria,
      descripcion: item.descripcion,
      imagen: item.imagen,
      enlaceGoogle: null,
      lat: null,
      lng: null,
      direccion: null,
      real: false,
    }));
  }, [config, destinoSeleccionado, poisReales]);

  const centroMapa = useMemo(() => {
    if (poiEnfocado) {
      return {
        latitude: poiEnfocado.lat,
        longitude: poiEnfocado.lng,
        zoom: 15,
      };
    }

    if (poiSeleccionado && poiSeleccionado.lat !== null && poiSeleccionado.lng !== null) {
      return {
        latitude: poiSeleccionado.lat,
        longitude: poiSeleccionado.lng,
        zoom: 15,
      };
    }

    if (configInteractivo) {
      return {
        latitude: configInteractivo.latitude,
        longitude: configInteractivo.longitude,
        zoom: configInteractivo.zoom,
      };
    }

    return null;
  }, [configInteractivo, poiEnfocado, poiSeleccionado]);

  if (poiIdParam && cargandoPoiSeleccionado) {
    return (
      <div className="min-h-screen bg-[#f6f6f3] px-5 py-6">
        <div className="mx-auto max-w-[430px] rounded-[24px] bg-white p-6 shadow-sm">
          Cargando POI en el mapa...
        </div>
      </div>
    );
  }

  if (poiIdParam && (!poiSeleccionado || !centroMapa)) {
    return (
      <div className="min-h-screen bg-[#f6f6f3] px-5 py-6">
        <div className="mx-auto max-w-[430px] rounded-[24px] bg-white p-6 shadow-sm">
          <h1 className="text-[22px] font-semibold text-black">No se ha podido cargar el POI</h1>
          <p className="mt-2 text-sm leading-6 text-[#667085]">
            Este lugar no tiene coordenadas válidas o no existe en la base de datos.
          </p>
          <button
            type="button"
            onClick={() => navigate("/itinerarios")}
            className="mt-4 rounded-[14px] bg-[#111827] px-4 py-3 text-sm font-semibold text-white"
          >
            Volver a itinerarios
          </button>
        </div>
      </div>
    );
  }

  if (!poiIdParam && !destinoSeleccionado) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="text-center">
          <h1 className="mb-3 text-[24px] font-semibold text-black">
            No has seleccionado destino
          </h1>

          <button
            type="button"
            onClick={() => navigate("/inicio")}
            className="rounded-[10px] bg-[#e12414] px-6 py-3 text-white"
          >
            Ir a inicio
          </button>
        </div>
      </div>
    );
  }

  if (!poiIdParam && !config) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f6f3] px-6">
        <div className="rounded-[24px] bg-white p-6 text-center shadow-sm">
          <h1 className="mb-3 text-[22px] font-semibold text-black">
            Este destino todavía no tiene configuración de mapa
          </h1>

          <button
            type="button"
            onClick={() => navigate("/inicio")}
            className="rounded-[10px] bg-[#e12414] px-6 py-3 text-white"
          >
            Volver a inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f6f3]">
      <ContenedorPantallaPrincipal className="pt-3">
        <div className="rounded-[28px] bg-white p-5 shadow-sm">
          <h2 className="text-[22px] font-semibold text-black">
            {poiSeleccionado ? poiSeleccionado.nombre : config?.titulo}
          </h2>

          <p className="mt-2 text-[14px] leading-[24px] text-[#7c6b69]">
            {poiSeleccionado
              ? "Ubicación exacta del POI seleccionado."
              : poiEnfocado
              ? "Mapa centrado en el lugar que acabas de seleccionar."
              : config?.subtitulo}
          </p>

          <div ref={mapaSectionRef} className="mt-5">
            {centroMapa ? (
              <MapaInteractivo
                longitude={centroMapa.longitude}
                latitude={centroMapa.latitude}
                zoom={centroMapa.zoom}
                pois={poisMapa}
                onPoiClick={(poiId) => navigate(`/poi/${poiId}`)}
              />
            ) : (
              <div className="rounded-[24px] bg-white p-6 shadow-sm">
                <p className="text-[14px] text-[#7c6b69]">
                  No hay configuración de mapa interactivo para este destino.
                </p>
              </div>
            )}
          </div>

          {poiSeleccionado && (
            <div className="mt-5 rounded-[24px] border border-[#eef2f7] bg-[#fcfcfd] p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#ff5a36]">
                    {poiSeleccionado.categoria}
                  </p>
                  <h3 className="mt-2 text-[24px] font-bold text-[#111827]">
                    {poiSeleccionado.nombre}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="rounded-[14px] border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-semibold text-[#111827]"
                >
                  Volver
                </button>
              </div>

              <p className="mt-4 text-[14px] leading-[26px] text-[#667085]">
                {poiSeleccionado.descripcion}
              </p>

              {poiSeleccionado.direccion && (
                <div className="mt-4 rounded-[18px] bg-white px-4 py-3 text-sm text-[#475467]">
                  <span className="font-semibold text-[#111827]">Dirección:</span> {poiSeleccionado.direccion}
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/poi/${poiSeleccionado.id}`)}
                  className="rounded-[14px] bg-[#111827] px-4 py-3 text-sm font-semibold text-white"
                >
                  Ver detalle del POI
                </button>

                <a
                  href={buildGoogleUrl(poiSeleccionado.nombre, poiSeleccionado.direccion)}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-[14px] bg-[#fff4ef] px-4 py-3 text-sm font-semibold text-[#ff5a36]"
                >
                  Buscar en Google
                </a>
              </div>
            </div>
          )}
        </div>

        {!poiSeleccionado && (
          <section className="mt-8 pb-24">
            <div className="mb-4">
              <h3 className="text-[30px] font-bold text-black">Lugares destacados</h3>

              <p className="mt-1 text-[14px] leading-[24px] text-[#7c6b69]">
                {poisReales.length > 0
                  ? `${poisReales.length} lugares destacados disponibles en este destino.`
                  : loading
                  ? "Cargando destacados..."
                  : "Aún no hay destacados reales para este destino."}
              </p>
            </div>

            {cardsDestacadas.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {cardsDestacadas.map((item) => {
                  const puedeEnfocar =
                    typeof item.lat === "number" &&
                    Number.isFinite(item.lat) &&
                    typeof item.lng === "number" &&
                    Number.isFinite(item.lng);
                  const googleUrl = buildGoogleUrl(item.titulo, item.direccion);

                  return (
                    <article
                      key={item.id}
                      className="overflow-hidden rounded-[24px] bg-white text-left shadow-sm"
                    >
                      <div className="flex h-[440px] flex-col">
                        <button
                          type="button"
                          onClick={() => {
                            if (item.real) {
                              navigate(`/poi/${item.id}`);
                            }
                          }}
                          className="block w-full text-left"
                        >
                          <div className="h-[220px] w-full overflow-hidden bg-[#f3f4f6]">
                            <img
                              src={item.imagen}
                              alt={item.titulo}
                              loading="lazy"
                              className="block h-full w-full object-cover object-center"
                            />
                          </div>
                        </button>

                        <div className="flex min-h-0 flex-1 flex-col border-t border-[#eef0f3] p-5">
                          <div className="w-fit rounded-full bg-[#fff4ef] px-3 py-1 text-[11px] font-semibold text-[#ff5a36]">
                            {item.categoria}
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              if (item.real) {
                                navigate(`/poi/${item.id}`);
                              }
                            }}
                            className="mt-3 text-left"
                          >
                            <h4 className="line-clamp-2 min-h-[56px] text-[18px] font-semibold leading-[28px] text-black">
                              {item.titulo}
                            </h4>
                          </button>

                          <p className="mt-3 line-clamp-3 text-[14px] leading-[26px] text-[#667085]">
                            {item.descripcion}
                          </p>

                          <div className="mt-auto flex flex-wrap gap-2 pt-4">
                            <button
                              type="button"
                              disabled={!puedeEnfocar}
                              onClick={() => {
                                if (!puedeEnfocar || item.lat == null || item.lng == null) return;
                                setPoiEnfocado({
                                  id: item.id,
                                  nombre: item.titulo,
                                  categoria: item.categoria,
                                  descripcion: item.descripcion,
                                  imagen: item.imagen,
                                  lat: item.lat,
                                  lng: item.lng,
                                  direccion: item.direccion ?? undefined,
                                });
                                mapaSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                              }}
                              className="rounded-full bg-[#111827] px-4 py-2 text-[13px] font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              Ver solo en mapa
                            </button>

                            <a
                              href={googleUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-full bg-[#fff4ef] px-4 py-2 text-[13px] font-semibold text-[#ff5a36] transition hover:bg-[#ffe6dc]"
                            >
                              Buscar en Google
                            </a>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-[22px] bg-white p-5 shadow-sm">
                <p className="text-[14px] text-[#7c6b69]">
                  No hay lugares destacados disponibles todavía para este destino.
                </p>
              </div>
            )}
          </section>
        )}
      </ContenedorPantallaPrincipal>
    </div>
  );
}
