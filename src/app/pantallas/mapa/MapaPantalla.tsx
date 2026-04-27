import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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

type PoiMapaUi = {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  imagen: string;
  lat: number;
  lng: number;
};

type CardDestacadaUi = {
  id: string;
  titulo: string;
  categoria: string;
  descripcion: string;
  imagen: string;
  enlaceGoogle?: string | null;
  real: boolean;
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

  return `${nombreLugar} es uno de los lugares más interesantes para completar una visita bien equilibrada por ${comunidad}.`;
}

export default function MapaPantalla() {
  const navigate = useNavigate();
  const destinoSeleccionado = useDestinoStore((state) => state.destinoSeleccionado);

  const [poisReales, setPoisReales] = useState<PoiDestacado[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function cargar() {
      if (!destinoSeleccionado) {
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
  }, [destinoSeleccionado]);

  const config = useMemo(() => {
    if (!destinoSeleccionado) return null;
    return mapaPorDestino[destinoSeleccionado] ?? null;
  }, [destinoSeleccionado]);

  const configInteractivo = useMemo(() => {
    if (!destinoSeleccionado) return null;
    return mapaInteractivoPorDestino[destinoSeleccionado] ?? null;
  }, [destinoSeleccionado]);

  const poisMapa: PoiMapaUi[] = useMemo(() => {
    if (!destinoSeleccionado) return [];

    const comunidad = DESTINO_TO_CCAA[destinoSeleccionado] ?? "este destino";

    return poisReales
      .map((item) => {
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
        };
      })
      .filter((item): item is PoiMapaUi => item !== null);
  }, [destinoSeleccionado, poisReales]);

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
          enlaceGoogle: item.poi?.google_search_url ?? null,
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
      real: false,
    }));
  }, [config, destinoSeleccionado, poisReales]);

  if (!destinoSeleccionado) {
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

  if (!config) {
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
        </div>

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
              {cardsDestacadas.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-[24px] bg-white text-left shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (item.real) {
                        navigate(`/poi/${item.id}`);
                      }
                    }}
                    className="block w-full text-left"
                  >
                    <div className="flex h-[440px] flex-col">
                      <div className="h-[220px] w-full overflow-hidden bg-[#f3f4f6]">
                        <img
                          src={item.imagen}
                          alt={item.titulo}
                          loading="lazy"
                          className="block h-full w-full object-cover object-center"
                        />
                      </div>

                      <div className="flex min-h-0 flex-1 flex-col border-t border-[#eef0f3] p-5">
                        <div className="w-fit rounded-full bg-[#fff4ef] px-3 py-1 text-[11px] font-semibold text-[#ff5a36]">
                          {item.categoria}
                        </div>

                        <h4 className="mt-3 line-clamp-2 min-h-[56px] text-[18px] font-semibold leading-[28px] text-black">
                          {item.titulo}
                        </h4>

                        <p className="mt-3 line-clamp-4 text-[14px] leading-[26px] text-[#667085]">
                          {item.descripcion}
                        </p>
                      </div>
                    </div>
                  </button>

                  {item.enlaceGoogle && (
                    <div className="px-5 pb-5">
                      <a
                        href={item.enlaceGoogle}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        className="inline-flex rounded-full bg-[#fff4ef] px-4 py-2 text-[13px] font-semibold text-[#ff5a36] transition hover:bg-[#ffe6dc]"
                      >
                        Ver en Google
                      </a>
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[22px] bg-white p-5 shadow-sm">
              <p className="text-[14px] text-[#7c6b69]">
                No hay lugares destacados disponibles todavía para este destino.
              </p>
            </div>
          )}
        </section>
      </ContenedorPantallaPrincipal>
    </div>
  );
}