import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "@/app/store/useAuthStore";
import BloqueRestauracionDia from "@/app/componentes/itinerarios/BloqueRestauracionDia";
import BloqueEventosDia from "@/app/componentes/itinerarios/BloqueEventosDia";
import BloqueEventosRangoItinerario from "@/app/componentes/itinerarios/BloqueEventosRangoItinerario";
import {
  getSeleccionesRestauracion,
  type SeleccionRestauracion,
} from "@/app/servicios/restauracion";
import {
  getSeleccionesEventosLive,
  eliminarSeleccionEventoLive,
  type SeleccionEventoLive,
} from "@/app/servicios/eventosLive";
import {
  getItinerarioDetalle,
  aplicarAccionManualItinerario,
  regenerarItinerarioCompleto,
  type DiaItinerario,
  type ElementoItinerario,
  type IaDayPlan,
  type IaPoiPlan,
  type Itinerario,
  type PoiItinerario,
} from "@/app/servicios/itinerarios";
import { itinerariosMock } from "../../datos/mock/itinerariosMock";
import { crearFavorito, eliminarFavorito, getFavoritos } from "@/app/servicios/favoritos";
import { searchPoisDestacados, type PoiDestacado } from "@/app/servicios/poisDestacados";

type DiaUi = {
  numero: number;
  idDiaItinerario: number | null;
  titulo: string;
  minutos: number | null;
  fecha: string | null;
  tips: string[];
  pois: PoiUi[];
};


function IconoFavorito({ activo }: { activo: boolean }) {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill={activo ? "currentColor" : "none"}>
      <path
        d="M12 17.25L6.12215 20.3402L7.24472 13.7951L2.48944 9.15983L9.06107 8.20492L12 2.25L14.9389 8.20492L21.5106 9.15983L16.7553 13.7951L17.8779 20.3402L12 17.25Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type PoiUi = {
  key: string;
  nombre: string;
  motivo: string | null;
  idPoi: number | null;
  idGlobal: string | null;
  imagen: string | null;
  categoria: string | null;
  direccion: string | null;
  googleUrl: string | null;
  latitud: number | null;
  longitud: number | null;
};

type ItinerarioConBase = Itinerario & {
  base_nombre?: string | null;
  base_direccion?: string | null;
  base_place_id?: string | null;
  base_latitud?: number | string | null;
  base_longitud?: number | string | null;
  permite_excursiones?: boolean | null;
  radio_max_km?: number | string | null;
};

function formatFecha(value?: string | null): string {
  if (!value) return "Sin fecha";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sin fecha";
  return date.toLocaleDateString("es-ES", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

function formatHora(value?: string | null): string {
  if (!value) return "Sin hora";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sin hora";
  return date.toLocaleTimeString("es-ES", {
    timeZone: "Europe/Madrid",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function presupuestoLabel(value: number | null): string {
  if (value === 1) return "Bajo";
  if (value === 2) return "Medio";
  if (value === 3) return "Alto";
  return "Sin definir";
}

function getIaDayPlans(itinerario: Itinerario | null): IaDayPlan[] {
  if (!itinerario?.ia_json) return [];
  if (Array.isArray(itinerario.ia_json.day_plans)) return itinerario.ia_json.day_plans;
  if (Array.isArray(itinerario.ia_json.dias)) return itinerario.ia_json.dias;
  return [];
}

function getIaPois(day: IaDayPlan): IaPoiPlan[] {
  if (Array.isArray(day.pois)) return day.pois;
  if (Array.isArray(day.items)) return day.items;
  return [];
}

function getIaTips(day: IaDayPlan): string[] {
  if (Array.isArray(day.local_tips)) return day.local_tips;
  if (Array.isArray(day.consejos)) return day.consejos;
  return [];
}

function getPoiImage(poi?: PoiItinerario): string | null {
  return poi?.destacados_ccaa?.find((item) => item.imagen_url)?.imagen_url ?? null;
}

function getPoiCategoria(poi?: PoiItinerario): string | null {
  return poi?.categoria_poi?.nombre ?? poi?.tipo ?? poi?.subcategoria ?? null;
}

function normalizarTexto(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function categoriaEventoLabel(value?: string | null) {
  const c = normalizarTexto(value ?? "");

  if (c.includes("music") || c.includes("concert")) return "Música";
  if (c.includes("arts")) return "Artes";
  if (c.includes("theatre") || c.includes("performing")) return "Teatro";
  if (c.includes("festival")) return "Festival";
  if (c.includes("sport")) return "Deporte";
  if (c.includes("community")) return "Local";
  if (c.includes("expo")) return "Exposición";
  return value || "Evento";
}

function getCategoriaVisual(categoria?: string | null, titulo?: string | null) {
  const raw = normalizarTexto([categoria, titulo].filter(Boolean).join(" "));

  if (raw.includes("museo") || raw.includes("cultura") || raw.includes("patrimonio")) {
    return {
      icono: "🏛️",
      label: "Cultura",
      fondo: "from-[#eef2ff] to-[#fff7ed]",
      texto: "text-[#4f46e5]",
    };
  }

  if (raw.includes("playa") || raw.includes("costa") || raw.includes("mar")) {
    return {
      icono: "🌊",
      label: "Costa",
      fondo: "from-[#ecfeff] to-[#eff6ff]",
      texto: "text-[#0891b2]",
    };
  }

  if (raw.includes("naturaleza") || raw.includes("parque") || raw.includes("jardin")) {
    return {
      icono: "🌿",
      label: "Naturaleza",
      fondo: "from-[#ecfdf5] to-[#f0fdf4]",
      texto: "text-[#059669]",
    };
  }

  if (raw.includes("gastr") || raw.includes("mercado") || raw.includes("comida")) {
    return {
      icono: "🍽️",
      label: "Gastronomía",
      fondo: "from-[#fff7ed] to-[#fef2f2]",
      texto: "text-[#ea580c]",
    };
  }

  if (raw.includes("mirador") || raw.includes("vista")) {
    return {
      icono: "🌄",
      label: "Mirador",
      fondo: "from-[#fefce8] to-[#fff7ed]",
      texto: "text-[#ca8a04]",
    };
  }

  if (raw.includes("ruta") || raw.includes("sender")) {
    return {
      icono: "🥾",
      label: "Ruta",
      fondo: "from-[#f0fdf4] to-[#f8fafc]",
      texto: "text-[#16a34a]",
    };
  }

  if (raw.includes("ocio") || raw.includes("teatro") || raw.includes("noche")) {
    return {
      icono: "✨",
      label: "Ocio",
      fondo: "from-[#faf5ff] to-[#fff7ed]",
      texto: "text-[#9333ea]",
    };
  }

  return {
    icono: "📍",
    label: "Lugar",
    fondo: "from-[#fff4ef] to-[#eef2ff]",
    texto: "text-[#ff5a36]",
  };
}

function findElementoForIaPoi(
  iaPoi: IaPoiPlan,
  elementos: ElementoItinerario[]
): ElementoItinerario | null {
  const globalId = iaPoi.global_id ?? iaPoi.id_global;
  const nombre = iaPoi.name ?? iaPoi.nombre;

  if (globalId) {
    const byGlobal = elementos.find((elemento) => elemento.poi?.id_global === globalId);
    if (byGlobal) return byGlobal;
  }

  if (nombre) {
    const n = normalizarTexto(nombre);
    const byName = elementos.find((elemento) => {
      const poiName = elemento.poi?.nombre;
      if (!poiName) return false;
      return normalizarTexto(poiName).includes(n) || n.includes(normalizarTexto(poiName));
    });
    if (byName) return byName;
  }

  return null;
}

function buildPoiFromElemento(elemento: ElementoItinerario, index: number): PoiUi {
  const poi = elemento.poi;

  return {
    key: `db-${elemento.id_elemento_itinerario}-${index}`,
    nombre: poi?.nombre ?? "POI",
    motivo: poi?.descripcion ?? null,
    idPoi: poi?.id_poi ?? elemento.id_poi ?? null,
    idGlobal: poi?.id_global ?? null,
    imagen: getPoiImage(poi),
    categoria: getPoiCategoria(poi),
    direccion: poi?.direccion ?? null,
    googleUrl: poi?.google_search_url ?? null,
    latitud: poi?.latitud ?? null,
    longitud: poi?.longitud ?? null,
  };
}

function buildDiasUi(itinerario: Itinerario): DiaUi[] {
  const iaDays = getIaDayPlans(itinerario);
  const dbDays = itinerario.dias ?? [];

  // IMPORTANTE: para que los cambios hechos desde el chat se vean siempre,
  // priorizamos los elementos reales guardados en BD.
  // El ia_json se mantiene como apoyo, pero la fuente de verdad son Dia_Itinerario + Elemento_Itinerario.
  if (dbDays.length > 0) {
    return dbDays.map((dia: DiaItinerario, index) => {
      const iaDay = iaDays[index];
      const numero = iaDay?.day_number ?? iaDay?.dia ?? index + 1;

      return {
        numero,
        idDiaItinerario: dia.id_dia_itinerario,
        titulo: iaDay?.theme ?? iaDay?.titulo ?? dia.notas?.split("|")[0]?.trim() ?? `Día ${numero}`,
        minutos: dia.minutos ?? iaDay?.total_minutes ?? iaDay?.minutos ?? null,
        fecha: dia.fecha,
        tips: iaDay ? getIaTips(iaDay) : dia.notas
          ? dia.notas
              .split("|")
              .slice(1)
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
        pois: (dia.elementos ?? []).map(buildPoiFromElemento),
      };
    });
  }

  if (iaDays.length > 0) {
    return iaDays.map((day, index) => {
      const numero = day.day_number ?? day.dia ?? index + 1;
      const dbDay = dbDays.find((_, idx) => idx + 1 === numero) ?? dbDays[index];
      const elementos = dbDay?.elementos ?? [];

      const pois = getIaPois(day).map((iaPoi, poiIndex) => {
        const elemento = findElementoForIaPoi(iaPoi, elementos);
        const dbPoi = elemento?.poi;
        const nombre = iaPoi.name ?? iaPoi.nombre ?? dbPoi?.nombre ?? "POI";

        return {
          key: `ia-${numero}-${poiIndex}-${iaPoi.global_id ?? iaPoi.id_global ?? nombre}`,
          nombre,
          motivo: iaPoi.reason ?? iaPoi.motivo ?? dbPoi?.descripcion ?? null,
          idPoi: dbPoi?.id_poi ?? elemento?.id_poi ?? null,
          idGlobal: iaPoi.global_id ?? iaPoi.id_global ?? dbPoi?.id_global ?? null,
          imagen: iaPoi.image_url ?? iaPoi.imagen_url ?? getPoiImage(dbPoi),
          categoria: getPoiCategoria(dbPoi),
          direccion: dbPoi?.direccion ?? null,
          googleUrl: iaPoi.google_search_url ?? dbPoi?.google_search_url ?? null,
          latitud: dbPoi?.latitud ?? null,
          longitud: dbPoi?.longitud ?? null,
        };
      });

      return {
        numero,
        idDiaItinerario: dbDay?.id_dia_itinerario ?? null,
        titulo: day.theme ?? day.titulo ?? dbDay?.notas?.split("|")[0]?.trim() ?? `Día ${numero}`,
        minutos: day.total_minutes ?? day.minutos ?? dbDay?.minutos ?? null,
        fecha: dbDay?.fecha ?? null,
        tips: getIaTips(day),
        pois,
      };
    });
  }

  return dbDays.map((dia: DiaItinerario, index) => ({
    numero: index + 1,
    idDiaItinerario: dia.id_dia_itinerario,
    titulo: dia.notas?.split("|")[0]?.trim() || `Día ${index + 1}`,
    minutos: dia.minutos,
    fecha: dia.fecha,
    tips: dia.notas
      ? dia.notas
          .split("|")
          .slice(1)
          .map((item) => item.trim())
          .filter(Boolean)
      : [],
    pois: (dia.elementos ?? []).map(buildPoiFromElemento),
  }));
}

function getResumen(itinerario: Itinerario): string {
  return (
    itinerario.ia_resumen ||
    itinerario.ia_json?.summary ||
    itinerario.ia_json?.resumen ||
    `Itinerario generado para ${itinerario.destino ?? "tu destino"}.`
  );
}

function getAnchors(itinerario: Itinerario): string[] {
  return Array.isArray(itinerario.ia_json?.anchors_used)
    ? itinerario.ia_json.anchors_used
    : [];
}
function buildGoogleMapsDirectionsUrl(poi: PoiUi): string {
  if (
    typeof poi.latitud === "number" &&
    Number.isFinite(poi.latitud) &&
    typeof poi.longitud === "number" &&
    Number.isFinite(poi.longitud)
  ) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      `${poi.latitud},${poi.longitud}`
    )}&travelmode=walking`;
  }

  const destino = [poi.nombre, poi.direccion].filter(Boolean).join(", ");
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    destino
  )}&travelmode=walking`;
}

function getPreferenciasJson(itinerario: Itinerario): Record<string, unknown> {
  return itinerario.preferencias_json &&
    typeof itinerario.preferencias_json === "object" &&
    !Array.isArray(itinerario.preferencias_json)
    ? (itinerario.preferencias_json as Record<string, unknown>)
    : {};
}

function stringValue(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}


export default function DetalleItinerarioPantalla() {
  const navigate = useNavigate();
  const { itinerarioId } = useParams();
  const usuario = useAuthStore((state) => state.usuario);
  const idUsuario = usuario?.id_usuario ?? 1;

  const idParam = itinerarioId ?? "";
  const id = Number(idParam);

  const ejemplo = useMemo(
    () => itinerariosMock.find((item) => String(item.id) === String(idParam)) ?? null,
    [idParam]
  );

  const [itinerario, setItinerario] = useState<Itinerario | null>(null);
  const [seleccionesRestauracion, setSeleccionesRestauracion] = useState<SeleccionRestauracion[]>([]);
  const [seleccionesEventosLive, setSeleccionesEventosLive] = useState<SeleccionEventoLive[]>([]);
  const [favoritosPoiIds, setFavoritosPoiIds] = useState<Set<number>>(new Set());
  const [favoritoEnProceso, setFavoritoEnProceso] = useState<number | null>(null);
  const [accionPoiEnProceso, setAccionPoiEnProceso] = useState<string | null>(null);
  const [poisDestacados, setPoisDestacados] = useState<PoiDestacado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [diaAbierto, setDiaAbierto] = useState<number | null>(1);
  const [regenerando, setRegenerando] = useState(false);
  const [preferenciasRegeneracion, setPreferenciasRegeneracion] = useState({
    pace: "medio",
    trip_type: "mixto",
    transport: "mixto",
    notes: "",
  });

  async function recargarSeleccionesRestauracion() {
    if (!Number.isInteger(id)) return;

    try {
      const data = await getSeleccionesRestauracion(id);
      setSeleccionesRestauracion(data);
    } catch (err) {
      console.error("No se pudieron recargar selecciones de restauración:", err);
      setSeleccionesRestauracion([]);
    }
  }

  async function recargarSeleccionesEventosLive() {
    if (!Number.isInteger(id)) return;

    try {
      const data = await getSeleccionesEventosLive(id);
      setSeleccionesEventosLive(data);
    } catch (err) {
      console.error("No se pudieron recargar selecciones de eventos live:", err);
      setSeleccionesEventosLive([]);
    }
  }

  useEffect(() => {
    async function cargar() {
      if (ejemplo) {
        setLoading(false);
        return;
      }

      if (!Number.isInteger(id)) {
        setError("Itinerario inválido.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [data, favoritos] = await Promise.all([
          getItinerarioDetalle(id),
          getFavoritos(idUsuario).catch(() => []),
        ]);
        setItinerario(data);
        const preferenciasGuardadas = getPreferenciasJson(data);
        setPreferenciasRegeneracion({
          pace: stringValue(preferenciasGuardadas.pace, data.accesibilidad ?? "medio"),
          trip_type: stringValue(preferenciasGuardadas.trip_type, "mixto"),
          transport: stringValue(preferenciasGuardadas.transport, data.transporte ?? "mixto"),
          notes: "",
        });
        setFavoritosPoiIds(
          new Set(
            (favoritos ?? [] as { id_poi: number }[]).map((item) => item.id_poi)
          )
        );
        try {
          const selecciones = await getSeleccionesRestauracion(id);
          setSeleccionesRestauracion(selecciones);
        } catch (err) {
          console.error("No se pudieron cargar selecciones de restauración:", err);
          setSeleccionesRestauracion([]);
        }

        try {
          const seleccionesEventos = await getSeleccionesEventosLive(id);
          setSeleccionesEventosLive(seleccionesEventos);
        } catch (err) {
          console.error("No se pudieron cargar selecciones de eventos live:", err);
          setSeleccionesEventosLive([]);
        }

        try {
          const destacados = await searchPoisDestacados(data.destino ?? "");
          setPoisDestacados(Array.isArray(destacados) ? destacados.slice(0, 12) : []);
        } catch (err) {
          console.error("No se pudieron cargar POIs destacados:", err);
          setPoisDestacados([]);
        }
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el itinerario estructurado.");
      } finally {
        setLoading(false);
      }
    }

    void cargar();
  }, [id, ejemplo, idUsuario]);

  const diasUi = useMemo(() => (itinerario ? buildDiasUi(itinerario) : []), [itinerario]);
  const totalPois = diasUi.reduce((acc, dia) => acc + dia.pois.length, 0);

  function abrirPoiEnMapa(poi: PoiUi) {
    if (poi.idPoi) {
      sessionStorage.setItem(
        "spainway_selected_poi_mapa",
        JSON.stringify({ id: String(poi.idPoi), nombre: poi.nombre })
      );
      navigate(`/mapa?poi=${poi.idPoi}`);
      return;
    }

    window.open(buildGoogleMapsDirectionsUrl(poi), "_blank", "noopener,noreferrer");
  }

  function abrirGoogleMapsDesdeUbicacion(poi: PoiUi) {
    window.open(buildGoogleMapsDirectionsUrl(poi), "_blank", "noopener,noreferrer");
  }

  async function regenerarItinerarioConPreferencias() {
    if (!itinerario || !usuario?.id_usuario || regenerando) return;

    const preferenciasBase = getPreferenciasJson(itinerario);
    const itinerarioBase = itinerario as ItinerarioConBase;
    const visitedGlobalIds = diasUi
      .flatMap((dia) => dia.pois)
      .map((poi) => poi.idGlobal)
      .filter((value): value is string => typeof value === "string" && value.length > 0);

    const visitedPoiNames = diasUi
      .flatMap((dia) => dia.pois)
      .map((poi) => poi.nombre)
      .filter(Boolean);

    const dates = [itinerario.inicio, itinerario.fin]
      .filter((value): value is string => typeof value === "string" && value.length > 0)
      .map((value) => value.slice(0, 10));

    try {
      setRegenerando(true);

      const respuesta = await regenerarItinerarioCompleto({
        id_usuario: usuario.id_usuario,
        destination: itinerario.destino ?? stringValue(preferenciasBase.destination, "España"),
        days: diasUi.length || Number(preferenciasBase.days ?? 3),
        budget: stringValue(preferenciasBase.budget, presupuestoLabel(itinerario.presupuesto).toLowerCase()),
        dates,
        pace: preferenciasRegeneracion.pace,
        trip_type: preferenciasRegeneracion.trip_type,
        transport: preferenciasRegeneracion.transport,
        companions: stringValue(preferenciasBase.companions, ""),
        must_see: stringValue(preferenciasBase.must_see, ""),
        extras: stringValue(preferenciasBase.extras, ""),
        notes: preferenciasRegeneracion.notes,
        base_location_name:
          itinerarioBase.base_nombre ?? stringValue(preferenciasBase.base_location_name, ""),
        base_address: itinerarioBase.base_direccion ?? stringValue(preferenciasBase.base_address, ""),
        base_place_id: itinerarioBase.base_place_id ?? stringValue(preferenciasBase.base_place_id, ""),
        base_lat: itinerarioBase.base_latitud != null ? Number(itinerarioBase.base_latitud) : null,
        base_lon: itinerarioBase.base_longitud != null ? Number(itinerarioBase.base_longitud) : null,
        allow_excursions: itinerarioBase.permite_excursiones ?? true,
        max_distance_km:
          itinerarioBase.radio_max_km != null ? Number(itinerarioBase.radio_max_km) : null,
        visited_global_ids: visitedGlobalIds,
        visited_poi_names: visitedPoiNames,
        negative_preferences: visitedPoiNames,
        include_live_events: true,
        user_message: preferenciasRegeneracion.notes,
      });

      navigate(`/itinerarios/${respuesta.id_itinerario}`);
    } catch (error) {
      console.error(error);
      setError("No se pudo regenerar el itinerario con las nuevas preferencias.");
    } finally {
      setRegenerando(false);
    }
  }

  async function toggleFavoritoPoi(poi: PoiUi) {
    if (!poi.idPoi || favoritoEnProceso === poi.idPoi) return;

    const estabaActivo = favoritosPoiIds.has(poi.idPoi);

    try {
      setFavoritoEnProceso(poi.idPoi);

      if (estabaActivo) {
        await eliminarFavorito(idUsuario, poi.idPoi);
        setFavoritosPoiIds((prev) => {
          const next = new Set(prev);
          next.delete(poi.idPoi!);
          return next;
        });
      } else {
        await crearFavorito({ id_usuario: idUsuario, id_poi: poi.idPoi });
        setFavoritosPoiIds((prev) => new Set(prev).add(poi.idPoi!));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setFavoritoEnProceso(null);
    }
  }

  async function eliminarPoiDelDia(diaNumero: number, poi: PoiUi) {
    if (!itinerario?.id_itinerario || !poi.idPoi || accionPoiEnProceso) return;

    try {
      setAccionPoiEnProceso(`remove-${diaNumero}-${poi.idPoi}`);
      await aplicarAccionManualItinerario(itinerario.id_itinerario, {
        action: "remove",
        dayNumber: diaNumero,
        poiId: poi.idPoi,
        poiName: poi.nombre,
      });
      const actualizado = await getItinerarioDetalle(itinerario.id_itinerario);
      setItinerario(actualizado);
    } catch (error) {
      console.error(error);
      setError("No se pudo eliminar este POI del itinerario.");
    } finally {
      setAccionPoiEnProceso(null);
    }
  }

  async function agregarPoiDestacado(poi: PoiDestacado, diaNumero: number) {
    if (!itinerario?.id_itinerario || accionPoiEnProceso) return;

    try {
      setAccionPoiEnProceso(`add-${poi.id_poi_destacado_ccaa}`);
      await aplicarAccionManualItinerario(itinerario.id_itinerario, {
        action: "insert",
        dayNumber: diaNumero,
        poiId: poi.id_poi,
        poiName: poi.poi?.nombre ?? poi.poi_canonico,
        query: poi.poi?.nombre ?? poi.poi_canonico,
      });
      const actualizado = await getItinerarioDetalle(itinerario.id_itinerario);
      setItinerario(actualizado);
      setDiaAbierto(diaNumero);
    } catch (error) {
      console.error(error);
      setError("No se pudo añadir este POI destacado al itinerario.");
    } finally {
      setAccionPoiEnProceso(null);
    }
  }

  const poisDestacadosNoIncluidos = useMemo(() => {
    const usados = new Set(
      diasUi
        .flatMap((dia) => dia.pois)
        .map((poi) => String(poi.idPoi ?? poi.idGlobal ?? poi.nombre).toLowerCase()),
    );

    return poisDestacados.filter((item) => {
      const keyId = String(item.id_poi).toLowerCase();
      const keyNombre = String(item.poi?.nombre ?? item.poi_canonico ?? "").toLowerCase();
      return !usados.has(keyId) && !usados.has(keyNombre);
    });
  }, [diasUi, poisDestacados]);

  const diaSugeridoParaDestacados = useMemo(() => {
    if (!diasUi.length) return 1;
    return [...diasUi].sort((a, b) => a.pois.length - b.pois.length || a.numero - b.numero)[0]?.numero ?? 1;
  }, [diasUi]);

  const poisFavoritosItinerario = useMemo(() => {
    return diasUi
      .flatMap((dia) => dia.pois)
      .filter((poi) => poi.idPoi !== null && favoritosPoiIds.has(poi.idPoi));
  }, [diasUi, favoritosPoiIds]);

  if (loading) {
    return (
      <div className="min-h-full bg-[#f3f5f9] px-5 pb-28 pt-5 text-[#111827]">
        <div className="mx-auto max-w-[900px] rounded-[30px] bg-white p-6 shadow-sm">
          Cargando itinerario...
        </div>
      </div>
    );
  }

  if (ejemplo && !itinerario) {
    return (
      <div className="min-h-full bg-[#f3f5f9] text-[#111827]">
        <div className="mx-auto w-full max-w-[900px] px-5 pb-28 pt-5">
          <section className="overflow-hidden rounded-[34px] bg-white shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
            <div className="relative h-[260px] overflow-hidden">
              <img src={ejemplo.imagen} alt={ejemplo.titulo} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              <button
                type="button"
                onClick={() => navigate("/itinerarios")}
                className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-sm font-black text-[#111827] shadow-sm"
              >
                ← Volver
              </button>

              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/80">
                  Itinerario de ejemplo
                </p>
                <h1 className="mt-2 text-[32px] font-black tracking-[-0.04em]">
                  {ejemplo.titulo}
                </h1>
                <p className="mt-2 text-sm font-semibold text-white/85">{ejemplo.destino}</p>
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm leading-7 text-[#667085]">{ejemplo.subtitulo}</p>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-[#f8fafc] p-4">
                  <p className="text-xs text-[#94a3b8]">Categoría</p>
                  <p className="mt-1 text-sm font-black">{ejemplo.categoria}</p>
                </div>
                <div className="rounded-2xl bg-[#f8fafc] p-4">
                  <p className="text-xs text-[#94a3b8]">Días</p>
                  <p className="mt-1 text-sm font-black">{ejemplo.dias}</p>
                </div>
                <div className="rounded-2xl bg-[#f8fafc] p-4">
                  <p className="text-xs text-[#94a3b8]">Presupuesto</p>
                  <p className="mt-1 text-sm font-black">{ejemplo.presupuesto}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/itinerarios/crear")}
                className="mt-6 w-full rounded-2xl bg-[#ff5a36] px-5 py-4 text-sm font-black text-white shadow-[0_12px_28px_rgba(255,90,54,0.30)]"
              >
                Usar como inspiración para crear uno real
              </button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (error || !itinerario) {
    return (
      <div className="min-h-full bg-[#f3f5f9] px-5 pb-28 pt-5 text-[#111827]">
        <div className="mx-auto max-w-[900px] rounded-[30px] bg-white p-6 shadow-sm">
          <h1 className="text-xl font-black">Itinerario no encontrado</h1>
          <p className="mt-2 text-sm text-[#667085]">{error ?? "No existe este itinerario."}</p>
          <button
            type="button"
            onClick={() => navigate("/itinerarios")}
            className="mt-5 rounded-2xl bg-[#111827] px-4 py-3 text-sm font-bold text-white"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  const anchors = getAnchors(itinerario);

  return (
    <div className="min-h-full bg-[#f3f5f9] text-[#111827]">
      <div className="mx-auto w-full max-w-[980px] px-5 pb-28 pt-5">
        <section className="overflow-hidden rounded-[34px] bg-white shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
          <div className="bg-gradient-to-br from-[#fff8f4] via-white to-[#f5f3ff] p-6">
            <button
              type="button"
              onClick={() => navigate("/itinerarios")}
              className="mb-5 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#111827] shadow-sm"
            >
              ← Volver
            </button>

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ff5a36]">
              Itinerario estructurado
            </p>

            <h1 className="mt-2 text-[32px] font-black tracking-[-0.04em] text-[#111827]">
              {itinerario.titulo ?? `Itinerario ${itinerario.destino ?? ""}`}
            </h1>

            <p className="mt-3 max-w-[760px] text-sm leading-6 text-[#667085]">
              {getResumen(itinerario)}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs text-[#94a3b8]">Destino</p>
                <p className="mt-1 text-sm font-black">{itinerario.destino ?? "-"}</p>
              </div>

              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs text-[#94a3b8]">Días</p>
                <p className="mt-1 text-sm font-black">{diasUi.length}</p>
              </div>

              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs text-[#94a3b8]">POIs</p>
                <p className="mt-1 text-sm font-black">{totalPois}</p>
              </div>

              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs text-[#94a3b8]">Presupuesto</p>
                <p className="mt-1 text-sm font-black">{presupuestoLabel(itinerario.presupuesto)}</p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-[#fff7f3] p-4 text-sm leading-6 text-[#9a3412]">
              <strong>Base:</strong> {itinerario.base_nombre || itinerario.base_direccion || "sin base"}
              {itinerario.base_latitud && itinerario.base_longitud ? (
                <span>
                  {" "}· {itinerario.base_latitud.toFixed(5)}, {itinerario.base_longitud.toFixed(5)}
                </span>
              ) : null}
            </div>

            <BloqueEventosRangoItinerario
              idItinerario={itinerario.id_itinerario}
              destino={itinerario.destino ?? ""}
              rangoDesde={itinerario.inicio ?? null}
              rangoHasta={itinerario.fin ?? null}
              baseLat={itinerario.base_latitud ?? null}
              baseLng={itinerario.base_longitud ?? null}
              dias={diasUi.map((dia) => ({
                numero: dia.numero,
                idDiaItinerario: dia.idDiaItinerario,
                fecha: dia.fecha,
                titulo: dia.titulo,
              }))}
              selecciones={seleccionesEventosLive}
              onChange={recargarSeleccionesEventosLive}
            />
          </div>
        </section>

        <section className="mt-5 rounded-[28px] bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#ff5a36]">
                Regeneración inteligente
              </p>
              <h2 className="mt-2 text-[22px] font-black text-[#111827]">
                Regenerar con nuevas preferencias
              </h2>
              <p className="mt-2 max-w-[680px] text-sm leading-6 text-[#667085]">
                Crea una nueva versión del itinerario usando la IA2 actual, el contexto guardado del usuario,
                favoritos, mensajes recientes y la meteorología del destino. La versión actual no se borra.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void regenerarItinerarioConPreferencias()}
              disabled={regenerando || !usuario?.id_usuario}
              className="rounded-2xl bg-[#ff5a36] px-5 py-3 text-sm font-black text-white shadow-[0_12px_28px_rgba(255,90,54,0.25)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {regenerando ? "Regenerando..." : "Regenerar itinerario"}
            </button>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
            <label className="text-sm font-bold text-[#344054]">
              Ritmo
              <select
                value={preferenciasRegeneracion.pace}
                onChange={(event) =>
                  setPreferenciasRegeneracion((prev) => ({ ...prev, pace: event.target.value }))
                }
                className="mt-2 w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm outline-none focus:border-[#ff5a36]"
              >
                <option value="relajado">Relajado</option>
                <option value="medio">Medio</option>
                <option value="intenso">Intenso</option>
              </select>
            </label>

            <label className="text-sm font-bold text-[#344054]">
              Tipo de viaje
              <select
                value={preferenciasRegeneracion.trip_type}
                onChange={(event) =>
                  setPreferenciasRegeneracion((prev) => ({ ...prev, trip_type: event.target.value }))
                }
                className="mt-2 w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm outline-none focus:border-[#ff5a36]"
              >
                <option value="mixto">Mixto</option>
                <option value="cultura">Cultura</option>
                <option value="naturaleza">Naturaleza</option>
                <option value="gastronomia">Gastronomía</option>
                <option value="playa">Playa</option>
                <option value="familia">Familia</option>
                <option value="pareja">Pareja</option>
              </select>
            </label>

            <label className="text-sm font-bold text-[#344054]">
              Transporte
              <select
                value={preferenciasRegeneracion.transport}
                onChange={(event) =>
                  setPreferenciasRegeneracion((prev) => ({ ...prev, transport: event.target.value }))
                }
                className="mt-2 w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm outline-none focus:border-[#ff5a36]"
              >
                <option value="mixto">Mixto</option>
                <option value="a_pie">A pie</option>
                <option value="transporte_publico">Transporte público</option>
                <option value="coche">Coche</option>
              </select>
            </label>
          </div>

          <label className="mt-4 block text-sm font-bold text-[#344054]">
            Notas para la nueva versión
            <textarea
              value={preferenciasRegeneracion.notes}
              onChange={(event) =>
                setPreferenciasRegeneracion((prev) => ({ ...prev, notes: event.target.value }))
              }
              placeholder="Ejemplo: hazlo más local, añade más naturaleza y evita repetir sitios parecidos."
              className="mt-2 min-h-[96px] w-full resize-none rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm outline-none focus:border-[#ff5a36]"
            />
          </label>
        </section>

        <section className="mt-5 rounded-[28px] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[#94a3b8]">Favoritos</p>
              <h2 className="mt-2 text-[22px] font-bold text-[#111827]">POIs favoritos de este itinerario</h2>
            </div>
            <span className="rounded-full bg-[#fff4ef] px-3 py-1 text-sm font-semibold text-[#ff5a36]">
              {poisFavoritosItinerario.length}
            </span>
          </div>

          {poisFavoritosItinerario.length === 0 ? (
            <p className="mt-4 text-sm leading-6 text-[#667085]">
              Marca la estrella de cualquier parada y este apartado se rellenará automáticamente.
            </p>
          ) : (
            <div className="mt-5 flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {poisFavoritosItinerario.map((poi) => (
                <article
                  key={`fav-${poi.key}`}
                  className="min-w-[260px] rounded-[24px] border border-[#eef2f7] bg-[#fcfcfd] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#ff5a36]">
                        {poi.categoria ?? 'POI'}
                      </p>
                      <h3 className="mt-2 text-lg font-black text-[#111827]">{poi.nombre}</h3>
                    </div>
                    <div className="text-[#ff5a36]">
                      <IconoFavorito activo />
                    </div>
                  </div>

                  {poi.motivo && (
                    <p className="mt-3 line-clamp-4 text-sm leading-6 text-[#667085]">{poi.motivo}</p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => abrirPoiEnMapa(poi)}
                      className="rounded-full bg-[#111827] px-4 py-2 text-xs font-bold text-white"
                    >
                      Ver en mapa
                    </button>
                    <button
                      type="button"
                      onClick={() => void toggleFavoritoPoi(poi)}
                      className="rounded-full bg-[#fff4ef] px-4 py-2 text-xs font-bold text-[#ff5a36]"
                    >
                      Quitar favorito
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {anchors.length > 0 && (
          <section className="mt-5 rounded-[28px] bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#94a3b8]">
              Anclas usadas por el modelo
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {anchors.map((anchor) => (
                <span
                  key={anchor}
                  className="rounded-full bg-[#f8fafc] px-3 py-2 text-xs font-bold text-[#344054]"
                >
                  {anchor}
                </span>
              ))}
            </div>
          </section>
        )}

        {poisDestacadosNoIncluidos.length > 0 && (
          <section className="mt-5 rounded-[30px] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff5a36]">POIs destacados</p>
                <h2 className="mt-1 text-xl font-black text-[#111827]">Añade imprescindibles que no están en la ruta</h2>
                <p className="mt-2 text-sm leading-6 text-[#667085]">
                  Son recursos destacados del destino. Puedes añadirlos directamente al día con menos paradas y luego reorganizar desde el chat.
                </p>
              </div>
              <span className="rounded-full bg-[#f8fafc] px-3 py-2 text-xs font-black text-[#667085]">
                Día sugerido {diaSugeridoParaDestacados}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {poisDestacadosNoIncluidos.slice(0, 6).map((item) => {
                const nombre = item.poi?.nombre ?? item.poi_canonico;
                const categoria = item.poi?.categoria_poi?.nombre ?? item.poi?.tipo ?? "Destacado";
                return (
                  <article key={item.id_poi_destacado_ccaa} className="rounded-[22px] border border-[#eef2f7] bg-[#fcfcfd] p-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#94a3b8]">{categoria}</p>
                    <h3 className="mt-1 text-base font-black text-[#111827]">{nombre}</h3>
                    {item.motivo && <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#667085]">{item.motivo}</p>}
                    <button
                      type="button"
                      onClick={() => void agregarPoiDestacado(item, diaSugeridoParaDestacados)}
                      disabled={accionPoiEnProceso === `add-${item.id_poi_destacado_ccaa}`}
                      className="mt-4 w-full rounded-full bg-[#111827] px-4 py-3 text-xs font-black text-white disabled:opacity-60"
                    >
                      {accionPoiEnProceso === `add-${item.id_poi_destacado_ccaa}` ? "Añadiendo..." : `Añadir al día ${diaSugeridoParaDestacados}`}
                    </button>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        <section className="mt-5 space-y-5">
          {diasUi.map((dia) => {
            const abierto = diaAbierto === dia.numero;
            const visualDia = getCategoriaVisual(null, dia.titulo);
            const eventosDelDia = seleccionesEventosLive.filter(
              (item) => item.id_dia_itinerario === dia.idDiaItinerario
            );

            return (
              <article
                key={dia.numero}
                className="overflow-hidden rounded-[32px] bg-white shadow-[0_14px_34px_rgba(15,23,42,0.08)]"
              >
                <button
                  type="button"
                  onClick={() => setDiaAbierto(abierto ? null : dia.numero)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] bg-gradient-to-br ${visualDia.fondo} text-2xl`}
                    >
                      {visualDia.icono}
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ff5a36]">
                        Día {dia.numero} · {formatFecha(dia.fecha)}
                      </p>

                      <h2 className="mt-2 text-[22px] font-black tracking-[-0.03em] text-[#111827]">
                        {dia.titulo}
                      </h2>

                      <p className="mt-1 text-sm text-[#667085]">
                        {dia.pois.length} lugares{dia.minutos ? ` · ${dia.minutos} min estimados` : ""}
                        {eventosDelDia.length > 0 ? ` · ${eventosDelDia.length} eventos live` : ""}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-[#f8fafc] px-4 py-2 text-sm font-black text-[#111827]">
                    {abierto ? "Ocultar" : "Ver"}
                  </span>
                </button>

                {abierto && (
                  <div className="border-t border-[#eef2f7] p-5">
                    {dia.tips.length > 0 && (
                      <div className="mb-5 rounded-2xl bg-[#fff7f3] p-4">
                        <p className="text-sm font-black text-[#7a271a]">Consejos del día</p>

                        <ul className="mt-2 space-y-1 text-sm leading-6 text-[#9a3412]">
                          {dia.tips.map((tip) => (
                            <li key={tip}>• {tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {eventosDelDia.length > 0 && (
                      <div className="mb-5 rounded-[24px] border border-[#dbeafe] bg-[#eff6ff] p-4">
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#2563eb]">
                              Eventos live añadidos al día
                            </p>
                            <h3 className="mt-1 text-lg font-black text-[#111827]">
                              Planes en directo para este día
                            </h3>
                          </div>

                          <span className="rounded-full bg-white px-3 py-2 text-xs font-black text-[#2563eb]">
                            {eventosDelDia.length} eventos
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          {eventosDelDia.map((item) => (
                            <article
                              key={item.id_itinerario_evento}
                              className="overflow-hidden rounded-[24px] border border-[#bfdbfe] bg-white"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr]">
                                <div className="h-[170px] bg-gradient-to-br from-[#eef6ff] to-[#f8fafc] md:h-full">
                                  {item.evento_turistico.imagen_url ? (
                                    <img
                                      src={item.evento_turistico.imagen_url}
                                      alt={item.evento_turistico.nombre}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-full items-center justify-center text-5xl">
                                      🎟️
                                    </div>
                                  )}
                                </div>

                                <div className="p-4">
                                  <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#2563eb]">
                                        {categoriaEventoLabel(item.evento_turistico.categoria)}
                                      </p>
                                      <h4 className="mt-1 text-lg font-black text-[#111827]">
                                        {item.evento_turistico.nombre}
                                      </h4>
                                    </div>

                                    <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-black text-[#3730a3]">
                                      {item.evento_turistico.source ?? "live"}
                                    </span>
                                  </div>

                                  <div className="mt-3 flex flex-wrap gap-2">
                                    <span className="rounded-full bg-[#f8fafc] px-3 py-2 text-xs font-bold text-[#344054]">
                                      {formatFecha(item.evento_turistico.inicio)}
                                    </span>

                                    <span className="rounded-full bg-[#f8fafc] px-3 py-2 text-xs font-bold text-[#344054]">
                                      {formatHora(item.evento_turistico.inicio)}
                                    </span>

                                    {item.evento_turistico.venue_nombre && (
                                      <span className="rounded-full bg-[#fff7ed] px-3 py-2 text-xs font-bold text-[#c2410c]">
                                        {item.evento_turistico.venue_nombre}
                                      </span>
                                    )}
                                  </div>

                                  {(item.evento_turistico.venue_nombre || item.evento_turistico.direccion) && (
                                    <p className="mt-3 text-sm leading-6 text-[#667085]">
                                      {item.evento_turistico.venue_nombre ?? "Sin recinto"}
                                      {item.evento_turistico.direccion
                                        ? ` · ${item.evento_turistico.direccion}`
                                        : ""}
                                    </p>
                                  )}

                                  {item.evento_turistico.descripcion && (
                                    <p className="mt-3 text-sm leading-6 text-[#667085]">
                                      {item.evento_turistico.descripcion}
                                    </p>
                                  )}

                                  <div className="mt-4 flex flex-wrap gap-2">
  {item.evento_turistico.url && (
    <a
      href={item.evento_turistico.url}
      target="_blank"
      rel="noreferrer"
      className="rounded-full bg-[#111827] px-4 py-2 text-xs font-black text-white"
    >
      Ver evento
    </a>
  )}

  <button
    type="button"
    onClick={() => {
      void (async () => {
        try {
          await eliminarSeleccionEventoLive(item.id_itinerario_evento);
          await recargarSeleccionesEventosLive();
        } catch (error) {
          console.error(error);
        }
      })();
    }}
    className="rounded-full bg-[#dc2626] px-4 py-2 text-xs font-black text-white"
  >
    Quitar
  </button>

  {item.motivo && (
    <span className="rounded-full bg-[#ecfdf3] px-4 py-2 text-xs font-bold text-[#027a48]">
      Añadido al itinerario
    </span>
  )}
</div>
                                </div>
                              </div>
                            </article>
                          ))}
                        </div>
                      </div>
                    )}

                    {dia.pois.length === 0 ? (
                      <div className="rounded-2xl bg-[#f8fafc] p-4 text-sm text-[#667085]">
                        El modelo no asignó POIs para este día.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {dia.pois.map((poi, index) => {
                          const visualPoi = getCategoriaVisual(poi.categoria, poi.nombre);

                          return (
                            <article
                              key={poi.key}
                              className="overflow-hidden rounded-[24px] border border-[#eef2f7] bg-[#fcfcfd]"
                            >
                              <div
                                className={`flex h-[130px] flex-col items-center justify-center bg-gradient-to-br ${visualPoi.fondo}`}
                              >
                                <div className="text-[40px]">{visualPoi.icono}</div>
                                <div
                                  className={`mt-2 text-xs font-black uppercase tracking-[0.16em] ${visualPoi.texto}`}
                                >
                                  {visualPoi.label}
                                </div>
                              </div>

                              <div className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#94a3b8]">
                                      Parada {index + 1}
                                    </p>

                                    <h3 className="mt-1 text-lg font-black text-[#111827]">
                                      {poi.nombre}
                                    </h3>
                                  </div>

                                  {poi.categoria && (
                                    <span className="rounded-full bg-[#fff4ef] px-3 py-1 text-xs font-bold text-[#ff5a36]">
                                      {poi.categoria}
                                    </span>
                                  )}
                                </div>

                                {poi.motivo && (
                                  <p className="mt-3 text-sm leading-6 text-[#667085]">
                                    {poi.motivo}
                                  </p>
                                )}

                                {poi.direccion && (
                                  <p className="mt-3 text-xs font-semibold leading-5 text-[#98a2b3]">
                                    {poi.direccion}
                                  </p>
                                )}

                                <div className="mt-4 grid grid-cols-2 gap-2">
                                  <button
                                    type="button"
                                    onClick={() => void toggleFavoritoPoi(poi)}
                                    disabled={!poi.idPoi || favoritoEnProceso === poi.idPoi}
                                    className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-xs font-bold transition ${
                                      favoritosPoiIds.has(poi.idPoi ?? -1)
                                        ? "bg-[#fff4ef] text-[#ff5a36]"
                                        : "bg-[#f8fafc] text-[#475467]"
                                    } disabled:opacity-60`}
                                  >
                                    <IconoFavorito activo={favoritosPoiIds.has(poi.idPoi ?? -1)} />
                                    {favoritosPoiIds.has(poi.idPoi ?? -1) ? "Guardado" : "Guardar"}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => void eliminarPoiDelDia(dia.numero, poi)}
                                    disabled={!poi.idPoi || accionPoiEnProceso === `remove-${dia.numero}-${poi.idPoi}`}
                                    className="rounded-full bg-red-50 px-4 py-3 text-xs font-black text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                                  >
                                    {accionPoiEnProceso === `remove-${dia.numero}-${poi.idPoi}` ? "Quitando..." : "Eliminar"}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => abrirPoiEnMapa(poi)}
                                    className="rounded-full bg-[#111827] px-4 py-3 text-xs font-bold text-white"
                                  >
                                    Ver en mapa
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => abrirGoogleMapsDesdeUbicacion(poi)}
                                    className="rounded-full bg-[#fff4ef] px-4 py-3 text-xs font-bold text-[#ff5a36]"
                                  >
                                    Cómo llegar
                                  </button>
                                </div>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    )}

                    {itinerario.id_itinerario ? (
                      <>
                        <BloqueRestauracionDia
                          idItinerario={itinerario.id_itinerario}
                          idDiaItinerario={dia.idDiaItinerario}
                          diaNumero={dia.numero}
                          pois={dia.pois}
                          selecciones={seleccionesRestauracion}
                          onChange={recargarSeleccionesRestauracion}
                        />

                        <BloqueEventosDia
                          idItinerario={itinerario.id_itinerario}
                          idDiaItinerario={dia.idDiaItinerario}
                          diaNumero={dia.numero}
                          destino={itinerario.destino ?? ""}
                          fecha={dia.fecha}
                          rangoDesde={itinerario.inicio ?? null}
                          rangoHasta={itinerario.fin ?? null}
                          baseLat={itinerario.base_latitud ?? null}
                          baseLng={itinerario.base_longitud ?? null}
                          selecciones={seleccionesEventosLive}
                          onChange={recargarSeleccionesEventosLive}
                        />
                      </>
                    ) : null}
                  </div>
                )}
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}