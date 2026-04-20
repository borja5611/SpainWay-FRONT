import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDestinoStore } from "@/app/store/useDestinoStore";
import {
  ciudadesInicio,
  poisInicioPorCiudad,
} from "@/app/datos/mock/inicioDescubrimiento";
import TarjetaCiudadDestacada from "@/app/componentes/inicio/TarjetaCiudadDestacada";
import TarjetaPoiPreview from "@/app/componentes/inicio/TarjetaPoiPreview";
import SeccionHorizontalPoi from "@/app/componentes/inicio/SeccionHorizontalPoi";
import BloqueInfoInicio from "@/app/componentes/inicio/BloqueInfoInicio";
import ContenedorPantallaPrincipal from "@/app/componentes/layout/ContenedorPantallaPrincipal";
import {
  getPoisDestacadosByComunidad,
  type PoiDestacado,
} from "@/app/servicios/poisDestacados";
import {
  DESTINO_TO_CCAA,
  getImagenPoiDestacado,
} from "@/app/datos/poisDestacadosVisuales";
import type { DestinoId } from "@/app/datos/mock/destinos";

type PoisPorDestinoState = Partial<Record<DestinoId, PoiDestacado[]>>;

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
    return `${nombreLugar} es una propuesta ideal para disfrutar del paisaje y del entorno natural más representativo de ${comunidad}.`;
  }

  if (c.includes("cultura")) {
    return `${nombreLugar} destaca como visita cultural recomendada para descubrir mejor la identidad histórica y artística de ${comunidad}.`;
  }

  if (c.includes("otros lugares")) {
    return `${nombreLugar} es una parada interesante para enriquecer una ruta variada por ${comunidad} con un punto diferente al resto.`;
  }

  if (c.includes("playa")) {
    return `${nombreLugar} es una opción muy atractiva si buscas costa, vistas abiertas y una experiencia ligada al mar dentro de ${comunidad}.`;
  }

  if (c.includes("ocio")) {
    return `${nombreLugar} encaja bien en una jornada más relajada, combinando visita, paseo y disfrute del ambiente local en ${comunidad}.`;
  }

  if (c.includes("ruta")) {
    return `${nombreLugar} funciona muy bien como parte de un recorrido más amplio por ${comunidad}, conectando varios puntos clave del viaje.`;
  }

  if (c.includes("arquitectura")) {
    return `${nombreLugar} sobresale por su valor arquitectónico y es una visita recomendable si quieres descubrir construcciones singulares en ${comunidad}.`;
  }

  if (c.includes("deporte")) {
    return `${nombreLugar} aporta una visita interesante ligada al deporte o al espectáculo dentro de una ruta completa por ${comunidad}.`;
  }

  if (c.includes("mirador")) {
    return `${nombreLugar} es una muy buena parada para contemplar el entorno y añadir una vista panorámica potente a tu viaje por ${comunidad}.`;
  }

  if (c.includes("patrimonio religioso")) {
    return `${nombreLugar} es una visita destacada si te interesa el patrimonio religioso y los espacios con valor simbólico e histórico en ${comunidad}.`;
  }

  if (c.includes("gastronomía")) {
    return `${nombreLugar} suma interés gastronómico al recorrido y puede ayudarte a descubrir mejor los sabores y la identidad culinaria de ${comunidad}.`;
  }

  if (c.includes("lugar de interés")) {
    return `${nombreLugar} es un punto representativo que merece la pena tener en cuenta dentro de una visita bien organizada por ${comunidad}.`;
  }

  if (c.includes("patrimonio")) {
    return `${nombreLugar} forma parte del patrimonio más representativo de ${comunidad} y merece la pena si buscas visitas con peso histórico y cultural.`;
  }

  return `${nombreLugar} es uno de los lugares más interesantes para completar una visita bien equilibrada por ${comunidad}.`;
}

type PoiVisualUi = {
  id: string;
  titulo: string;
  descripcion: string;
  imagen: string;
  real: boolean;
};

export default function InicioPantalla() {
  const navigate = useNavigate();
  const setDestinoSeleccionado = useDestinoStore(
    (state) => state.setDestinoSeleccionado
  );

  const [poisDestacados, setPoisDestacados] = useState<PoisPorDestinoState>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarPois() {
      try {
        setLoading(true);

        const resultados = await Promise.all(
          ciudadesInicio.map(async (ciudad) => {
            const comunidad = DESTINO_TO_CCAA[ciudad.id];
            const items = comunidad
            ? await getPoisDestacadosByComunidad(comunidad).catch(() => [])              : [];
            return [ciudad.id, items] as const;
          })
        );

        const data: PoisPorDestinoState = {};
        for (const [destino, items] of resultados) {
          data[destino] = items;
        }

        setPoisDestacados(data);
      } catch (error) {
        console.error(error);
        setPoisDestacados({});
      } finally {
        setLoading(false);
      }
    }

    void cargarPois();
  }, []);

  const seleccionarDestino = (destinoId: DestinoId) => {
    setDestinoSeleccionado(destinoId);
    navigate("/mapa");
  };

  const secciones = useMemo(() => {
    return ciudadesInicio.map((ciudad) => {
      const reales = poisDestacados[ciudad.id] ?? [];
      const comunidad = DESTINO_TO_CCAA[ciudad.id] ?? ciudad.nombre;

      const itemsVisuales: PoiVisualUi[] =
        reales.length > 0
          ? reales.map((poi) => {
              const nombre = poi.poi_canonico || poi.poi?.nombre || "POI destacado";
              const categoriaTraducida = traducirCategoriaPoi(
                poi.poi?.categoria ||
                  poi.poi?.categoria_poi?.nombre ||
                  poi.poi?.tipo ||
                  "Lugar de interés"
              );

              return {
                id: String(poi.id_poi),
                titulo: nombre,
                descripcion:
                  poi.poi?.descripcion_snippet ||
                  descripcionBasePorCategoria(categoriaTraducida, nombre, comunidad),
                imagen: getImagenPoiDestacado(
                  ciudad.id,
                  poi.poi_canonico || poi.poi?.nombre || ""
                ),
                real: true,
              };
            })
          : (poisInicioPorCiudad[ciudad.id] ?? []).map((poi) => ({
              id: poi.id,
              titulo: poi.titulo,
              descripcion: poi.descripcion,
              imagen: poi.imagen,
              real: false,
            }));

      const subtitulo =
        reales.length > 0
          ? `${itemsVisuales.length} lugares destacados para inspirarte antes de entrar al mapa.`
          : loading
          ? "Cargando lugares destacados..."
          : ciudad.subtitulo;

      return {
        ciudad,
        items: itemsVisuales,
        subtitulo,
      };
    });
  }, [loading, poisDestacados]);

  return (
    <div className="min-h-screen bg-[#f6f6f3]">
      <ContenedorPantallaPrincipal className="pt-3">
        <section>
          <div className="rounded-[30px] border border-[#eceae5] bg-white p-6 shadow-sm">
            <p
              className="text-[34px] font-bold leading-[38px] text-black"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Descubre tu próxima escapada
            </p>

            <p className="mt-4 max-w-[700px] text-[15px] leading-[27px] text-[#6d6d6d]">
              SpainWay te ayuda a explorar comunidades, detectar sus lugares más
              relevantes y convertir la inspiración en un itinerario real.
            </p>
          </div>
        </section>

        <section className="mt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <BloqueInfoInicio
              titulo="Lugares destacados reales"
              descripcion="La portada utiliza los POIs más interesantes de cada comunidad para ofrecer una inspiración más útil y más creíble."
            />
            <BloqueInfoInicio
              titulo="Exploración más rica"
              descripcion="Todo lo que ves aquí sirve también como base para enriquecer el mapa, el detalle del POI y futuras rutas personalizadas."
            />
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-[30px] font-bold text-black">Destinos destacados</h2>
            <p className="mt-1 text-[14px] text-[#7c6b69]">
              Selecciona una comunidad para ver el mapa y sus puntos más relevantes.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {ciudadesInicio.map((ciudad) => (
              <TarjetaCiudadDestacada
                key={ciudad.id}
                nombre={ciudad.nombre}
                subtitulo={ciudad.subtitulo}
                imagen={ciudad.imagen}
                onClick={() => seleccionarDestino(ciudad.id)}
              />
            ))}
          </div>
        </section>

        {secciones.map(({ ciudad, items, subtitulo }) => (
          <SeccionHorizontalPoi
            key={ciudad.id}
            titulo={`${ciudad.nombre} ahora`}
            subtitulo={subtitulo}
          >
            {items.map((poi) => (
              <TarjetaPoiPreview
                key={`${ciudad.id}-${poi.id}`}
                titulo={poi.titulo}
                descripcion={poi.descripcion}
                imagen={poi.imagen}
                onClick={() => {
                  setDestinoSeleccionado(ciudad.id);
                  navigate("/mapa");
                }}
              />
            ))}
          </SeccionHorizontalPoi>
        ))}
      </ContenedorPantallaPrincipal>
    </div>
  );
}