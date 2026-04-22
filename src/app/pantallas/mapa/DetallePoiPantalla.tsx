import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDestinoStore } from "@/app/store/useDestinoStore";
import {
  getPoiById,
  searchPoisDestacados,
  type PoiApi,
  type PoiDestacado,
  extraerLat,
  extraerLng,
} from "@/app/servicios/poisDestacados";
import { DESTINO_TO_CCAA } from "@/app/datos/poisDestacadosVisuales";
import { poiPorDestino } from "@/app/datos/mock/poiPorDestino";
import type { DestinoId } from "@/app/datos/mock/destinos";

type CampoTexto = string | null;

type PoiMockRecord = {
  id?: string | number;
  nombre?: string;
  categoria?: string;
  descripcion?: string;
  imagenHero?: string;
  imagen?: string;
  municipio?: string;
  provincia?: string;
  comunidad?: string;
  tipo?: string;
  subcategoria?: string;
  direccion?: string;
  temporada?: string;
  lat?: number;
  lng?: number;
};

type PoiRecordSafe = Record<string, unknown>;

const BLANK_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900">
      <rect width="100%" height="100%" fill="white"/>
    </svg>
  `);

function normalizarTexto(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function getDynamicString(poi: PoiApi | null, keys: string[]): CampoTexto {
  if (!poi) return null;

  const record = poi as unknown as PoiRecordSafe;

  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

function extraerLatSeguro(poi?: PoiApi | null): number | null {
  if (!poi) return null;
  return extraerLat(poi);
}

function extraerLngSeguro(poi?: PoiApi | null): number | null {
  if (!poi) return null;
  return extraerLng(poi);
}

function traducirTipoValor(valor?: string | null): string {
  if (!valor) return "Lugar de interés";

  const v = normalizarTexto(valor);

  if (v === "naturaleza") return "Espacio natural";
  if (v === "cultura") return "Espacio cultural";
  if (v === "otro") return "Lugar singular";
  if (v === "playa") return "Playa";
  if (v === "ocio") return "Espacio de ocio";
  if (v === "ruta") return "Ruta";
  if (v === "arquitectura") return "Elemento arquitectónico";
  if (v === "deporte") return "Espacio deportivo";
  if (v === "mirador") return "Mirador";
  if (v === "religioso") return "Espacio religioso";
  if (v === "gastronomia") return "Lugar gastronómico";
  if (v === "poi") return "Lugar de interés";
  if (v === "patrimonio") return "Patrimonio";

  if (v.includes("museum") || v.includes("museo")) return "Museo";
  if (v.includes("cultural_center") || v.includes("cultural center")) return "Centro cultural";
  if (v.includes("monument") || v.includes("monumento")) return "Monumento";
  if (v.includes("heritage") || v.includes("patrimonio")) return "Patrimonio";
  if (v.includes("church") || v.includes("iglesia")) return "Iglesia";
  if (v.includes("cathedral") || v.includes("catedral")) return "Catedral";
  if (v.includes("castle") || v.includes("castillo")) return "Castillo";
  if (v.includes("fort") || v.includes("fortaleza")) return "Fortaleza";
  if (v.includes("beach") || v.includes("playa")) return "Playa";
  if (v.includes("park") || v.includes("parque")) return "Parque";
  if (v.includes("garden") || v.includes("jardin")) return "Jardín";
  if (v.includes("nature") || v.includes("natural")) return "Espacio natural";
  if (v.includes("viewpoint") || v.includes("mirador")) return "Mirador";
  if (v.includes("theatre") || v.includes("theater") || v.includes("teatro")) return "Teatro";
  if (v.includes("gallery") || v.includes("galeria")) return "Galería";
  if (v.includes("stadium") || v.includes("estadio")) return "Estadio";
  if (v.includes("archaeolog")) return "Yacimiento arqueológico";
  if (v.includes("square") || v.includes("plaza")) return "Plaza";
  if (v.includes("bridge") || v.includes("puente")) return "Puente";
  if (v.includes("building") || v.includes("edificio")) return "Edificio singular";
  if (v.includes("historic")) return "Lugar histórico";

  return valor.replaceAll("_", " ");
}

function traducirCategoriaValor(valor?: string | null): string {
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

  if (v.includes("museum") || v.includes("museo") || v.includes("culture") || v.includes("cultura")) {
    return "Cultura";
  }

  if (v.includes("architecture") || v.includes("arquitect")) {
    return "Arquitectura";
  }

  if (v.includes("heritage") || v.includes("patrimonio") || v.includes("monument")) {
    return "Patrimonio";
  }

  if (v.includes("religious") || v.includes("church") || v.includes("cathedral") || v.includes("iglesia")) {
    return "Patrimonio religioso";
  }

  if (v.includes("nature") || v.includes("natural") || v.includes("park") || v.includes("parque")) {
    return "Naturaleza";
  }

  if (v.includes("beach") || v.includes("playa") || v.includes("coast")) {
    return "Playa";
  }

  if (v.includes("sport") || v.includes("deporte") || v.includes("stadium") || v.includes("estadio")) {
    return "Deporte";
  }

  return valor.replaceAll("_", " ");
}

function getIconoPoi(tipo?: string | null, categoria?: string | null): string {
  const combinado = normalizarTexto(`${tipo ?? ""} ${categoria ?? ""}`);

  if (combinado.includes("museum") || combinado.includes("museo") || combinado.includes("cultura")) {
    return "🏛️";
  }
  if (combinado.includes("castle") || combinado.includes("castillo") || combinado.includes("fort") || combinado.includes("patrimonio")) {
    return "🏰";
  }
  if (combinado.includes("church") || combinado.includes("cathedral") || combinado.includes("iglesia") || combinado.includes("religioso")) {
    return "⛪";
  }
  if (combinado.includes("beach") || combinado.includes("playa") || combinado.includes("coast")) {
    return "🏖️";
  }
  if (combinado.includes("park") || combinado.includes("parque") || combinado.includes("nature") || combinado.includes("mirador")) {
    return "🌿";
  }
  if (combinado.includes("theatre") || combinado.includes("gallery") || combinado.includes("arte") || combinado.includes("ocio")) {
    return "🎭";
  }
  if (combinado.includes("stadium") || combinado.includes("deporte")) {
    return "🏟️";
  }
  if (combinado.includes("architecture") || combinado.includes("arquitect")) {
    return "🧱";
  }
  return "📍";
}

function traducirTemporada(valor?: string | null): string {
  if (!valor) return "Todo el año";

  const v = normalizarTexto(valor);

  if (v.includes("todo_ano") || v.includes("todo ano") || v.includes("all_year")) {
    return "Todo el año";
  }
  if (v.includes("verano") || v.includes("summer")) {
    return "Especialmente recomendable en verano";
  }
  if (v.includes("invierno") || v.includes("winter")) {
    return "Especialmente recomendable en invierno";
  }
  if (v.includes("primavera") || v.includes("spring")) {
    return "Especialmente recomendable en primavera";
  }
  if (v.includes("otono") || v.includes("autumn") || v.includes("fall")) {
    return "Especialmente recomendable en otoño";
  }

  return valor.replaceAll("_", " ");
}

function capitalizar(value: string): string {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatCoordenada(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "No disponible";
  return value.toFixed(6);
}

function inferDestinoDesdeComunidad(
  comunidad?: string | null,
  destinoActual?: DestinoId | null
): DestinoId {
  if (destinoActual) return destinoActual;

  const comunidadNormalizada = normalizarTexto(comunidad ?? "");
  const entries = Object.entries(DESTINO_TO_CCAA) as Array<[DestinoId, string]>;
  const match = entries.find(([, nombre]) => normalizarTexto(nombre) === comunidadNormalizada);

  return match?.[0] ?? "madrid";
}

function descripcionBasePorCategoria(
  categoria: string,
  nombreLugar: string,
  municipio: string,
  provincia: string,
  comunidad: string
): string {
  const c = normalizarTexto(categoria);
  const zona =
    provincia !== "No disponible"
      ? `${municipio}, ${provincia}`
      : comunidad !== "No disponible"
      ? `${municipio}, ${comunidad}`
      : municipio;

  if (c.includes("naturaleza")) {
    return `${nombreLugar} es una parada recomendable para disfrutar del paisaje, del entorno natural y de una visita más abierta y visual en ${zona}.`;
  }

  if (c.includes("cultura")) {
    return `${nombreLugar} es una visita cultural muy interesante para conocer mejor el legado artístico, histórico y simbólico de ${zona}.`;
  }

  if (c.includes("playa")) {
    return `${nombreLugar} destaca como visita ligada a la costa y resulta una muy buena opción si quieres incorporar mar, paisaje y paseo a tu recorrido por ${zona}.`;
  }

  if (c.includes("arquitectura")) {
    return `${nombreLugar} sobresale por su interés arquitectónico y merece la pena si buscas construcciones singulares y espacios con identidad propia en ${zona}.`;
  }

  if (c.includes("patrimonio")) {
    return `${nombreLugar} forma parte del patrimonio más representativo de ${zona} y resulta muy interesante para una visita con contenido histórico y cultural.`;
  }

  return `${nombreLugar} es una parada recomendable para completar una visita equilibrada por ${zona}.`;
}

function crearPuntosClave(params: {
  tipoTraducido: string;
  categoriaTraducida: string;
  municipio: string;
  temporada: string;
}): string[] {
  const { tipoTraducido, categoriaTraducida, municipio, temporada } = params;

  return [
    `Encaja especialmente si te interesa ${categoriaTraducida.toLowerCase()}.`,
    `Es una parada recomendable dentro de una ruta por ${municipio}.`,
    `Tipo de visita: ${tipoTraducido.toLowerCase()}.`,
    `Momento recomendado para ir: ${temporada.toLowerCase()}.`,
  ];
}

function buscarPoiMockPorId(id: string): PoiMockRecord | null {
  const destinos = Object.values(poiPorDestino) as unknown[];

  for (const lista of destinos) {
    if (!Array.isArray(lista)) continue;

    for (const item of lista) {
      const poi = item as PoiMockRecord;
      if (String(poi.id ?? "") === id) {
        return poi;
      }
    }
  }

  return null;
}

function mapearPoiMockAPoiApi(id: string, mock: PoiMockRecord): PoiApi {
  const comunidad = mock.comunidad?.trim() || undefined;
  const provincia = mock.provincia?.trim() || undefined;
  const municipio = mock.municipio?.trim() || undefined;

  const municipioObj = municipio
    ? {
        nombre: municipio,
        provincia: provincia
          ? {
              nombre: provincia,
              comunidad: comunidad
                ? {
                    nombre: comunidad,
                  }
                : undefined,
            }
          : undefined,
      }
    : null;

  return {
    id_poi: Number(id),
    nombre: mock.nombre || "Lugar de interés",
    tipo: mock.tipo || mock.categoria || "point_of_interest",
    categoria: mock.categoria || "Lugar de interés",
    descripcion_snippet: mock.descripcion || undefined,
    latitud: mock.lat ?? undefined,
    longitud: mock.lng ?? undefined,
    image_url: mock.imagenHero || mock.imagen || undefined,
    municipio: municipioObj,
    categoria_poi: mock.categoria
      ? {
          nombre: mock.categoria,
        }
      : null,
  };
}

function elegirDestacadoMasProbable(
  items: PoiDestacado[],
  routeId: string,
  nombrePoi?: string
): PoiDestacado | null {
  if (!items.length) return null;

  const porId = items.find((item) => String(item.id_poi) === routeId);
  if (porId) return porId;

  if (nombrePoi) {
    const nombreNormalizado = normalizarTexto(nombrePoi);

    const porNombreCanonico = items.find(
      (item) => normalizarTexto(item.poi_canonico || "") === nombreNormalizado
    );
    if (porNombreCanonico) return porNombreCanonico;

    const porNombrePoi = items.find(
      (item) => normalizarTexto(item.poi?.nombre || "") === nombreNormalizado
    );
    if (porNombrePoi) return porNombrePoi;
  }

  return items[0];
}

function BloqueInfo({
  titulo,
  valor,
}: {
  titulo: string;
  valor: string;
}) {
  return (
    <div className="rounded-[20px] bg-[#f7f8fb] p-4">
      <p className="text-[12px] font-medium text-[#98a2b3]">{titulo}</p>
      <p className="mt-2 text-[15px] font-semibold leading-[22px] text-[#111827]">
        {valor}
      </p>
    </div>
  );
}

export default function DetallePoiPantalla() {
  const navigate = useNavigate();
  const params = useParams();
  const destinoSeleccionado = useDestinoStore((state) => state.destinoSeleccionado);

  const routeId = params.id ?? params.poiId ?? params.slug ?? null;

  const [poi, setPoi] = useState<PoiApi | null>(null);
  const [poiDestacado, setPoiDestacado] = useState<PoiDestacado | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargarPoi() {
      if (!routeId) {
        setError("No se ha recibido el identificador del POI.");
        setPoi(null);
        setPoiDestacado(null);
        setLoading(false);
        return;
      }

      let poiBase: PoiApi | null = null;

      try {
        setLoading(true);
        setError(null);

        poiBase = await getPoiById(Number(routeId));
        setPoi(poiBase);
      } catch (err) {
        console.warn("No se pudo cargar el POI desde backend, probando fallback mock:", err);
      }

      if (!poiBase) {
        const mock = buscarPoiMockPorId(routeId);

        if (mock) {
          poiBase = mapearPoiMockAPoiApi(routeId, mock);
          setPoi(poiBase);
          setError(null);
        } else {
          setPoi(null);
          setPoiDestacado(null);
          setError("No se ha podido cargar la información del lugar.");
          setLoading(false);
          return;
        }
      }

      try {
        const query = poiBase.nombre?.trim();
        if (query) {
          const resultados = await searchPoisDestacados(query);
          const match = elegirDestacadoMasProbable(resultados, routeId, poiBase.nombre);
          setPoiDestacado(match);
        } else {
          setPoiDestacado(null);
        }
      } catch (err) {
        console.warn("No se pudo enriquecer el POI con la tabla de destacados:", err);
        setPoiDestacado(null);
      }

      setLoading(false);
    }

    void cargarPoi();
  }, [routeId]);

  const datosVista = useMemo(() => {
    if (!poi) return null;

    const nombre = poiDestacado?.poi_canonico?.trim() || poi.nombre?.trim() || "Lugar de interés";

    const tipoRaw = poi.tipo ?? getDynamicString(poi, ["tipo"]);

    const categoriaRaw =
      poi.categoria ??
      poi.categoria_poi?.nombre ??
      getDynamicString(poi, ["categoria", "subcategoria"]) ??
      poiDestacado?.poi?.categoria ??
      poiDestacado?.poi?.categoria_poi?.nombre ??
      poiDestacado?.poi?.tipo ??
      null;

    const subcategoriaRaw =
      getDynamicString(poi, ["subcategoria", "subcategoria2"]) ??
      getDynamicString(poiDestacado?.poi ?? null, ["subcategoria", "subcategoria2"]);

    const descripcionRaw =
      poi.descripcion_snippet ??
      poi.descripcion ??
      getDynamicString(poi, ["descripcion", "descripcion_corta", "resumen"]) ??
      poiDestacado?.poi?.descripcion_snippet ??
      poiDestacado?.poi?.descripcion ??
      getDynamicString(poiDestacado?.poi ?? null, ["descripcion", "descripcion_corta", "resumen"]);

    const direccion =
      getDynamicString(poi, ["direccion", "address"]) ??
      getDynamicString(poiDestacado?.poi ?? null, ["direccion", "address"]);

    const temporadaRaw =
      getDynamicString(poi, ["temporada"]) ??
      getDynamicString(poiDestacado?.poi ?? null, ["temporada"]);

    const municipio =
      poi.municipio?.nombre?.trim() ||
      poiDestacado?.ciudad_fuente?.trim() ||
      poiDestacado?.poi?.municipio?.nombre?.trim() ||
      "No disponible";

    const provincia =
      poi.municipio?.provincia?.nombre?.trim() ||
      poiDestacado?.provincia_fuente?.trim() ||
      poiDestacado?.poi?.municipio?.provincia?.nombre?.trim() ||
      "No disponible";

    const comunidad =
      poi.municipio?.provincia?.comunidad?.nombre?.trim() ||
      poiDestacado?.comunidad?.trim() ||
      poiDestacado?.poi?.municipio?.provincia?.comunidad?.nombre?.trim() ||
      (destinoSeleccionado ? DESTINO_TO_CCAA[destinoSeleccionado] : undefined) ||
      "No disponible";

    const lat = extraerLatSeguro(poi) ?? extraerLatSeguro(poiDestacado?.poi);
    const lng = extraerLngSeguro(poi) ?? extraerLngSeguro(poiDestacado?.poi);

    const tipoTraducido = traducirTipoValor(tipoRaw);
    const categoriaTraducida = traducirCategoriaValor(categoriaRaw);
    const subcategoriaTraducida = subcategoriaRaw
      ? capitalizar(subcategoriaRaw.replaceAll("_", " "))
      : "No disponible";
    const temporadaTraducida = traducirTemporada(temporadaRaw);

    const descripcion =
      descripcionRaw?.trim() ||
      descripcionBasePorCategoria(
        categoriaTraducida,
        nombre,
        municipio,
        provincia,
        comunidad
      );

    const destinoVisual = inferDestinoDesdeComunidad(
      comunidad !== "No disponible" ? comunidad : null,
      destinoSeleccionado
    );

    const imagen =
      poiDestacado?.imagen_url ||
      poi.image_url ||
      poiDestacado?.poi?.image_url ||
      BLANK_IMAGE;

    const icono = getIconoPoi(tipoRaw, categoriaRaw);

    const puntosClave = crearPuntosClave({
      tipoTraducido,
      categoriaTraducida,
      municipio,
      temporada: temporadaTraducida,
    });

    return {
      nombre,
      tipoTraducido,
      categoriaTraducida,
      subcategoriaTraducida,
      descripcion,
      direccion: direccion || "No disponible",
      temporadaTraducida,
      municipio,
      provincia,
      comunidad,
      lat,
      lng,
      imagen,
      icono,
      puntosClave,
      destinoVisual,
    };
  }, [poi, poiDestacado, destinoSeleccionado]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f6f3] px-5 py-6">
        <div className="mx-auto max-w-[980px]">
          <div className="rounded-[30px] bg-white p-6 shadow-sm">
            <p className="text-sm text-[#667085]">Cargando información del lugar...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !datosVista) {
    return (
      <div className="min-h-screen bg-[#f6f6f3] px-5 py-6">
        <div className="mx-auto max-w-[980px]">
          <div className="rounded-[30px] bg-white p-6 shadow-sm">
            <h1 className="text-[24px] font-semibold text-[#111827]">
              No se pudo cargar el lugar
            </h1>
            <p className="mt-3 text-[15px] leading-[26px] text-[#667085]">
              {error ?? "No hay información disponible para este punto de interés."}
            </p>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-5 rounded-[14px] bg-[#111827] px-5 py-3 text-sm font-semibold text-white"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f6f3] px-5 py-6 pb-48 md:pb-28">
      <div className="mx-auto max-w-[980px]">
        <div className="mb-5 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-[#111827] shadow-sm"
          >
            <span>←</span>
            <span>Volver</span>
          </button>
        </div>

        <section className="overflow-hidden rounded-[32px] bg-white shadow-sm">
          <div className="relative h-[420px] w-full overflow-hidden bg-white md:h-[520px]">
            <img
              src={datosVista.imagen}
              alt={datosVista.nombre}
              className="block h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/22 to-transparent" />

            <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full bg-white/92 px-4 py-2 text-sm font-semibold text-[#111827] backdrop-blur">
              <span className="text-[18px]">{datosVista.icono}</span>
              <span>{datosVista.categoriaTraducida}</span>
            </div>

            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-sm font-medium text-white/85">
                {datosVista.municipio}
                {datosVista.provincia !== "No disponible" ? ` · ${datosVista.provincia}` : ""}
              </p>
              <h1 className="mt-2 text-[34px] font-bold leading-[1.05] text-white md:text-[42px]">
                {datosVista.nombre}
              </h1>
              <p className="mt-3 max-w-[760px] text-[15px] leading-[26px] text-white/88">
                {datosVista.tipoTraducido} con interés en {datosVista.categoriaTraducida.toLowerCase()}.
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.25fr_0.9fr]">
              <div className="space-y-6">
                <section className="rounded-[26px] bg-[#fcfcfd] p-6">
                  <h2 className="text-[28px] font-semibold text-[#111827]">
                    Descripción
                  </h2>
                  <p className="mt-4 text-[15px] leading-[28px] text-[#667085]">
                    {datosVista.descripcion}
                  </p>
                </section>

                <section className="rounded-[26px] bg-[#fcfcfd] p-6">
                  <h2 className="text-[28px] font-semibold text-[#111827]">
                    Qué te aporta este lugar
                  </h2>

                  <div className="mt-4 grid gap-3">
                    {datosVista.puntosClave.map((item, index) => (
                      <div
                        key={`clave-${index}`}
                        className="rounded-[18px] border border-[#eaecf0] bg-white px-4 py-4"
                      >
                        <p className="text-[14px] leading-[24px] text-[#475467]">{item}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-[26px] bg-[#fcfcfd] p-6">
                  <h2 className="text-[28px] font-semibold text-[#111827]">
                    Ubicación y visita
                  </h2>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <BloqueInfo titulo="Municipio" valor={datosVista.municipio} />
                    <BloqueInfo titulo="Provincia" valor={datosVista.provincia} />
                    <BloqueInfo titulo="Comunidad" valor={datosVista.comunidad} />
                    <BloqueInfo
                      titulo="Temporada recomendada"
                      valor={datosVista.temporadaTraducida}
                    />
                    <BloqueInfo titulo="Dirección" valor={datosVista.direccion} />
                    <BloqueInfo
                      titulo="Coordenadas"
                      valor={`${formatCoordenada(datosVista.lat)}, ${formatCoordenada(
                        datosVista.lng
                      )}`}
                    />
                  </div>
                </section>
              </div>

              <aside className="space-y-6">
                <section className="rounded-[26px] bg-[#fcfcfd] p-6">
                  <h2 className="text-[28px] font-semibold text-[#111827]">
                    Información útil
                  </h2>

                  <div className="mt-5 grid gap-4">
                    <BloqueInfo titulo="Tipo de lugar" valor={datosVista.tipoTraducido} />
                    <BloqueInfo titulo="Categoría principal" valor={datosVista.categoriaTraducida} />
                    <BloqueInfo titulo="Subcategoría" valor={datosVista.subcategoriaTraducida} />
                  </div>
                </section>

                <section className="rounded-[26px] bg-[#fff7f4] p-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#ff5a36]">
                    <span>{datosVista.icono}</span>
                    <span>Consejo SpainWay</span>
                  </div>

                  <p className="mt-4 text-[15px] leading-[27px] text-[#7a271a]">
                    Añádelo a una ruta del mismo entorno para aprovechar mejor la visita. Este tipo
                    de lugar funciona especialmente bien cuando se combina con otros puntos de interés
                    cercanos del mismo municipio o de la misma zona.
                  </p>
                </section>
              </aside>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}