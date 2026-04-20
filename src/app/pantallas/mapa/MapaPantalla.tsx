import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDestinoStore } from "@/app/store/useDestinoStore";
import { mapaPorDestino } from "@/app/datos/mock/mapaPorDestino";
import { poiPorDestino } from "@/app/datos/mock/poiPorDestino";
import ContenedorPantallaPrincipal from "@/app/componentes/layout/ContenedorPantallaPrincipal";
import { mapaInteractivoPorDestino } from "@/app/datos/mapa/mapaInteractivoPorDestino";
import MapaInteractivo from "@/app/componentes/mapa/MapaInteractivo";
import {
  getPoisDestacadosByComunidad,
  type PoiDestacado,
  extraerLat,
  extraerLng,
} from "@/app/servicios/poisDestacados";
import {
  DESTINO_TO_CCAA,
  getImagenPoiDestacado,
  getImagenFallbackPorDestino,
} from "@/app/datos/poisDestacadosVisuales";
import type { DestinoId } from "@/app/datos/mock/destinos";

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
  real: boolean;
};

type PoiListaUi = {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  imagenHero: string;
  real: boolean;
};

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
  if (v.includes("route") || v.includes("ruta")) return "Ruta";
  if (v.includes("ocio") || v.includes("leisure")) return "Ocio";
  if (v.includes("food") || v.includes("gastr")) return "Gastronomía";

  return valor
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
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

  if (c.includes("otros lugares")) {
    return `${nombreLugar} es un punto de interés útil para completar una ruta variada por ${comunidad} con una parada diferente al resto.`;
  }

  if (c.includes("playa")) {
    return `${nombreLugar} es una parada muy interesante si buscas costa, vistas abiertas y una experiencia ligada al mar dentro de ${comunidad}.`;
  }

  if (c.includes("ocio")) {
    return `${nombreLugar} encaja bien en una jornada más relajada, combinando visita, paseo y tiempo de disfrute dentro de ${comunidad}.`;
  }

  if (c.includes("ruta")) {
    return `${nombreLugar} funciona muy bien como parte de un recorrido más amplio, conectando distintos puntos clave de ${comunidad} en una misma jornada.`;
  }

  if (c.includes("arquitectura")) {
    return `${nombreLugar} sobresale por su valor arquitectónico y resulta muy recomendable si quieres descubrir construcciones singulares en ${comunidad}.`;
  }

  if (c.includes("deporte")) {
    return `${nombreLugar} aporta una visita interesante ligada al deporte, al espectáculo o a espacios emblemáticos de gran actividad en ${comunidad}.`;
  }

  if (c.includes("mirador")) {
    return `${nombreLugar} es una muy buena parada para contemplar el entorno y añadir una vista panorámica destacada a tu recorrido por ${comunidad}.`;
  }

  if (c.includes("patrimonio religioso")) {
    return `${nombreLugar} es una visita destacada si te interesa el patrimonio religioso, la historia local y los espacios con valor simbólico en ${comunidad}.`;
  }

  if (c.includes("gastronomía")) {
    return `${nombreLugar} suma interés gastronómico a la ruta y puede ayudarte a descubrir mejor los sabores y la identidad culinaria de ${comunidad}.`;
  }

  if (c.includes("lugar de interés")) {
    return `${nombreLugar} es una parada recomendable para enriquecer una visita por ${comunidad} con un punto representativo del destino.`;
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

  const poisMock = useMemo(() => {
    if (!destinoSeleccionado) return [];
    return poiPorDestino[destinoSeleccionado] ?? [];
  }, [destinoSeleccionado]);

  const poisMapa: PoiMapaUi[] = useMemo(() => {
    if (!destinoSeleccionado) return [];

    const comunidad = DESTINO_TO_CCAA[destinoSeleccionado] ?? "este destino";

    const reales = poisReales
      .map((item) => {
        const lat = extraerLat(item.poi);
        const lng = extraerLng(item.poi);

        if (lat === null || lng === null) return null;

        const categoriaTraducida = traducirCategoriaPoi(
          item.poi?.categoria ||
            item.poi?.categoria_poi?.nombre ||
            item.poi?.tipo ||
            "Lugar de interés"
        );

        const nombre = item.poi_canonico || item.poi?.nombre || "POI destacado";

        return {
          id: String(item.id_poi),
          nombre,
          categoria: categoriaTraducida,
          descripcion:
            item.poi?.descripcion_snippet ||
            descripcionBasePorCategoria(categoriaTraducida, nombre, comunidad),
          imagen: getImagenPoiDestacado(destinoSeleccionado, nombre),
          lat,
          lng,
        };
      })
      .filter((item): item is PoiMapaUi => item !== null);

    if (reales.length > 0) {
      return reales;
    }

    return [];
  }, [destinoSeleccionado, poisReales]);

  const cardsDestacadas: CardDestacadaUi[] = useMemo(() => {
    if (!destinoSeleccionado || !config) return [];

    const comunidad = DESTINO_TO_CCAA[destinoSeleccionado] ?? "este destino";

    if (poisReales.length > 0) {
      return poisReales.map((item) => {
        const nombre = item.poi_canonico || item.poi?.nombre || "POI destacado";
        const categoriaTraducida = traducirCategoriaPoi(
          item.poi?.categoria ||
            item.poi?.categoria_poi?.nombre ||
            item.poi?.tipo ||
            "Lugar de interés"
        );

        return {
          id: String(item.id_poi),
          titulo: nombre,
          categoria: categoriaTraducida,
          descripcion:
            item.poi?.descripcion_snippet ||
            descripcionBasePorCategoria(categoriaTraducida, nombre, comunidad),
          imagen: getImagenPoiDestacado(destinoSeleccionado, nombre),
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
      real: false,
    }));
  }, [config, destinoSeleccionado, poisReales]);

  const listaPois: PoiListaUi[] = useMemo(() => {
    if (!destinoSeleccionado) return [];

    const comunidad = DESTINO_TO_CCAA[destinoSeleccionado] ?? "este destino";

    if (poisReales.length > 0) {
      return poisReales.map((item) => {
        const nombre = item.poi_canonico || item.poi?.nombre || "POI destacado";
        const categoriaTraducida = traducirCategoriaPoi(
          item.poi?.categoria ||
            item.poi?.categoria_poi?.nombre ||
            item.poi?.tipo ||
            "Lugar de interés"
        );

        return {
          id: String(item.id_poi),
          nombre,
          categoria: categoriaTraducida,
          descripcion:
            item.poi?.descripcion_snippet ||
            descripcionBasePorCategoria(categoriaTraducida, nombre, comunidad),
          imagenHero: getImagenPoiDestacado(destinoSeleccionado, nombre),
          real: true,
        };
      });
    }

    return poisMock.map((poi) => ({
      id: poi.id,
      nombre: poi.nombre,
      categoria: poi.categoria,
      descripcion: poi.descripcion,
      imagenHero: poi.imagenHero,
      real: false,
    }));
  }, [destinoSeleccionado, poisMock, poisReales]);

  if (!destinoSeleccionado) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="text-center">
          <h1 className="mb-3 text-[24px] font-semibold text-black">
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

  if (!config) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f6f3] px-6">
        <div className="rounded-[24px] bg-white p-6 text-center shadow-sm">
          <h1 className="mb-3 text-[22px] font-semibold text-black">
            Este destino todavía no tiene configuración de mapa
          </h1>
          <button
            onClick={() => navigate("/inicio")}
            className="rounded-[10px] bg-[#e12414] px-6 py-3 text-white"
          >
            Volver a inicio
          </button>
        </div>
      </div>
    );
  }

  const fallbackImagen = getImagenFallbackPorDestino(destinoSeleccionado as DestinoId);

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

        <section className="mt-8">
          <div className="mb-4">
            <h3 className="text-[28px] font-bold text-black">Lugares destacados</h3>
            <p className="mt-1 text-[14px] leading-[24px] text-[#7c6b69]">
              {poisReales.length > 0
                ? `${poisReales.length} lugares destacados disponibles en este destino.`
                : loading
                ? "Cargando destacados..."
                : "Aún no hay destacados reales para este destino, así que se mantiene el contenido visual actual."}
            </p>
          </div>

          <div className="space-y-5">
            {cardsDestacadas.length > 0 ? (
              cardsDestacadas.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (item.real) {
                      navigate(`/poi/${item.id}`);
                    }
                  }}
                  className="w-full overflow-hidden rounded-[24px] bg-white text-left shadow-sm transition hover:shadow-md"
                >
                  <img
                    src={item.imagen || fallbackImagen}
                    alt={item.titulo}
                    className="h-[230px] w-full object-cover"
                  />
                  <div className="p-5">
                    <div className="inline-flex rounded-full bg-[#fff4ef] px-3 py-1 text-xs font-semibold text-[#ff5a36]">
                      {item.categoria}
                    </div>
                    <h4 className="mt-3 text-[20px] font-semibold text-black">
                      {item.titulo}
                    </h4>
                    <p className="mt-2 text-[14px] leading-[24px] text-[#7c6b69]">
                      {item.descripcion}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <div className="rounded-[22px] bg-white p-5 shadow-sm">
                <p className="text-[14px] text-[#7c6b69]">
                  No hay lugares destacados disponibles todavía para este destino.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4">
            <h3 className="text-[28px] font-bold text-black">Puntos de interés</h3>
            <p className="mt-1 text-[14px] leading-[24px] text-[#7c6b69]">
              Consulta lugares concretos del mapa y entra a su ficha para ver más detalle.
            </p>
          </div>

          {listaPois.length > 0 ? (
            <div className="space-y-4">
              {listaPois.map((poi) => (
                <button
                  key={poi.id}
                  type="button"
                  onClick={() => navigate(`/poi/${poi.id}`)}
                  className="w-full overflow-hidden rounded-[22px] bg-white text-left shadow-sm transition hover:shadow-md"
                >
                  <img
                    src={poi.imagenHero || fallbackImagen}
                    alt={poi.nombre}
                    className="h-[210px] w-full object-cover"
                  />

                  <div className="p-4">
                    <div className="inline-flex rounded-full bg-[#fff4ef] px-3 py-1 text-xs font-semibold text-[#ff5a36]">
                      {poi.categoria}
                    </div>
                    <h4 className="mt-3 text-[18px] font-semibold text-black">{poi.nombre}</h4>
                    <p className="mt-2 text-[13px] leading-[22px] text-[#7c6b69]">
                      {poi.descripcion}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-[22px] bg-white p-5 shadow-sm">
              <p className="text-[14px] text-[#7c6b69]">
                Próximamente habrá POIs destacados para este destino.
              </p>
            </div>
          )}
        </section>
      </ContenedorPantallaPrincipal>
    </div>
  );
}