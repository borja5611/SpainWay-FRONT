import { useMemo, useState } from "react";
import {
  buscarEventosLive,
  eliminarSeleccionEventoLive,
  seleccionarEventoLive,
  type EventoLive,
  type SeleccionEventoLive,
} from "@/app/servicios/eventosLive";

type DiaResumen = {
  numero: number;
  idDiaItinerario: number | null;
  fecha: string | null;
  titulo: string;
};

type Props = {
  idItinerario: number;
  destino: string;
  rangoDesde: string | null;
  rangoHasta: string | null;
  baseLat: number | null;
  baseLng: number | null;
  dias: DiaResumen[];
  selecciones: SeleccionEventoLive[];
  onChange: () => Promise<void>;
};

type CategoriaFiltro =
  | "todos"
  | "music"
  | "arts"
  | "theatre"
  | "festival"
  | "sports"
  | "community";

const CATEGORIAS: { id: CategoriaFiltro; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "music", label: "Música" },
  { id: "arts", label: "Artes" },
  { id: "theatre", label: "Teatro" },
  { id: "festival", label: "Festivales" },
  { id: "sports", label: "Deporte" },
  { id: "community", label: "Locales" },
];

function normalizarTexto(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function limpiarNombreEvento(value: string) {
  return normalizarTexto(value)
    .replace(/\bvip\b/g, "")
    .replace(/\bpackages\b/g, "")
    .replace(/\bpackage\b/g, "")
    .replace(/\bentradas\b/g, "")
    .replace(/\btickets\b/g, "")
    .replace(/\bworld tour\b/g, "")
    .replace(/\btour\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getLocalYmdMadrid(value?: string | null) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) return null;

  return `${year}-${month}-${day}`;
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

function fechaLabel(value?: string | null) {
  if (!value) return "Sin fecha";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sin fecha";

  return date.toLocaleDateString("es-ES", {
    timeZone: "Europe/Madrid",
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

function horaLabel(value?: string | null) {
  if (!value) return "Sin hora";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sin hora";

  return date.toLocaleTimeString("es-ES", {
    timeZone: "Europe/Madrid",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function pasaFiltroCategoria(event: EventoLive, filtro: CategoriaFiltro) {
  if (filtro === "todos") return true;

  const c = normalizarTexto(event.categoria);

  if (filtro === "music") return c.includes("music") || c.includes("concert");
  if (filtro === "arts") return c.includes("arts");
  if (filtro === "theatre") {
    return c.includes("theatre") || c.includes("performing");
  }
  if (filtro === "festival") return c.includes("festival");
  if (filtro === "sports") return c.includes("sport");
  if (filtro === "community") return c.includes("community");

  return true;
}

function esTardeONoche(event: EventoLive) {
  const date = new Date(event.fechaInicio);

  if (Number.isNaN(date.getTime())) return false;

  const hour = Number(
    date.toLocaleTimeString("en-GB", {
      timeZone: "Europe/Madrid",
      hour: "2-digit",
      hour12: false,
    })
  );

  return hour >= 16;
}

function getMillis(value?: string | null) {
  if (!value) return 0;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function getEventoBaseScore(event: EventoLive) {
  let score = Number(event.score ?? 0);

  if (event.imagen) score += 12;
  if (event.url) score += 8;
  if (event.recinto) score += 8;
  if (event.descripcion) score += 4;
  if (event.provider === "ticketmaster") score += 5;

  const nombre = normalizarTexto(event.nombre);
  const categoria = normalizarTexto(event.categoria);

  if (nombre.includes("vip") || nombre.includes("package")) score -= 25;
  if (categoria.includes("festival")) score += 8;
  if (categoria.includes("music") || categoria.includes("concert")) score += 6;
  if (categoria.includes("performing") || categoria.includes("theatre")) score += 6;
  if (categoria.includes("sport")) score += 2;

  return score;
}

function ordenarEventos(events: EventoLive[]) {
  return [...events].sort((a, b) => {
    const fechaA = getMillis(a.fechaInicio);
    const fechaB = getMillis(b.fechaInicio);

    if (fechaA !== fechaB) return fechaA - fechaB;

    return getEventoBaseScore(b) - getEventoBaseScore(a);
  });
}

function sonEventosParecidos(a: EventoLive, b: EventoLive) {
  const diaA = getLocalYmdMadrid(a.fechaInicio);
  const diaB = getLocalYmdMadrid(b.fechaInicio);

  if (!diaA || !diaB || diaA !== diaB) return false;

  const nombreA = limpiarNombreEvento(a.nombre);
  const nombreB = limpiarNombreEvento(b.nombre);

  if (!nombreA || !nombreB) return false;

  const recintoA = normalizarTexto(a.recinto ?? "");
  const recintoB = normalizarTexto(b.recinto ?? "");

  const mismoRecinto =
    recintoA &&
    recintoB &&
    (recintoA.includes(recintoB) || recintoB.includes(recintoA));

  const nombreIncluido =
    nombreA.includes(nombreB) ||
    nombreB.includes(nombreA) ||
    nombreA.split(" ").some((word) => word.length >= 4 && nombreB.includes(word));

  const horaA = horaLabel(a.fechaInicio);
  const horaB = horaLabel(b.fechaInicio);
  const mismaHora = horaA !== "Sin hora" && horaA === horaB;

  return nombreIncluido && (mismoRecinto || mismaHora);
}

function deduplicarEventos(events: EventoLive[]) {
  const ordenados = [...events].sort(
    (a, b) => getEventoBaseScore(b) - getEventoBaseScore(a)
  );

  const result: EventoLive[] = [];

  for (const event of ordenados) {
    const yaExiste = result.some((current) => sonEventosParecidos(current, event));

    if (!yaExiste) {
      result.push(event);
    }
  }

  return ordenarEventos(result);
}

function agruparPorFecha(events: EventoLive[]) {
  const map = new Map<string, EventoLive[]>();

  for (const event of events) {
    const key = getLocalYmdMadrid(event.fechaInicio) ?? "sin-fecha";
    const current = map.get(key) ?? [];

    current.push(event);
    map.set(key, current);
  }

  return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
}

function getSeleccionKey(item: SeleccionEventoLive) {
  const nombre = limpiarNombreEvento(item.evento_turistico.nombre ?? "");
  const fecha = getLocalYmdMadrid(item.evento_turistico.inicio);
  const recinto = normalizarTexto(item.evento_turistico.venue_nombre ?? "");

  return `${nombre}|${fecha ?? ""}|${recinto}`;
}

function getEventoKey(event: EventoLive) {
  const nombre = limpiarNombreEvento(event.nombre);
  const fecha = getLocalYmdMadrid(event.fechaInicio);
  const recinto = normalizarTexto(event.recinto ?? "");

  return `${nombre}|${fecha ?? ""}|${recinto}`;
}

function estaYaSeleccionado(event: EventoLive, selecciones: SeleccionEventoLive[]) {
  const eventKey = getEventoKey(event);

  return selecciones.some((item) => {
    const seleccionKey = getSeleccionKey(item);

    if (seleccionKey === eventKey) return true;

    const fakeEvent: EventoLive = {
      id: item.evento_turistico.external_id,
      provider:
        item.evento_turistico.source === "predicthq" ? "predicthq" : "ticketmaster",
      nombre: item.evento_turistico.nombre,
      descripcion: item.evento_turistico.descripcion,
      categoria: item.evento_turistico.categoria ?? "Evento",
      fechaInicio: item.evento_turistico.inicio ?? "",
      fechaFin: item.evento_turistico.fin,
      ciudad: item.evento_turistico.ciudad ?? "",
      recinto: item.evento_turistico.venue_nombre,
      direccion: item.evento_turistico.direccion,
      latitud: item.evento_turistico.latitud,
      longitud: item.evento_turistico.longitud,
      imagen: item.evento_turistico.imagen_url,
      url: item.evento_turistico.url,
      score: item.score_recomendacion ?? 0,
    };

    return sonEventosParecidos(event, fakeEvent);
  });
}

function getDiaParaEvento(event: EventoLive, mapaDias: Map<string, DiaResumen>) {
  const key = getLocalYmdMadrid(event.fechaInicio);
  return key ? mapaDias.get(key) ?? null : null;
}

export default function BloqueEventosRangoItinerario({
  idItinerario,
  destino,
  rangoDesde,
  rangoHasta,
  baseLat,
  baseLng,
  dias,
  selecciones,
  onChange,
}: Props) {
  const [abierto, setAbierto] = useState(false);
  const [categoria, setCategoria] = useState<CategoriaFiltro>("todos");
  const [soloTardeNoche, setSoloTardeNoche] = useState(false);
  const [radioKm, setRadioKm] = useState(30);
  const [resultados, setResultados] = useState<EventoLive[]>([]);
  const [cargando, setCargando] = useState(false);
  const [guardandoId, setGuardandoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [detalle, setDetalle] = useState<string | null>(null);
  const [yaBuscado, setYaBuscado] = useState(false);

  const mapaDias = useMemo(() => {
    const map = new Map<string, DiaResumen>();

    for (const dia of dias) {
      const key = getLocalYmdMadrid(dia.fecha);
      if (key) map.set(key, dia);
    }

    return map;
  }, [dias]);

  const seleccionesOrdenadas = useMemo(() => {
    return [...selecciones].sort((a, b) => {
      const aFecha = a.evento_turistico.inicio ?? "";
      const bFecha = b.evento_turistico.inicio ?? "";
      return aFecha.localeCompare(bFecha);
    });
  }, [selecciones]);

  const resultadosFiltrados = useMemo(() => {
    const filtrados = resultados
      .filter((event) => pasaFiltroCategoria(event, categoria))
      .filter((event) => (soloTardeNoche ? esTardeONoche(event) : true))
      .filter((event) => {
        const key = getLocalYmdMadrid(event.fechaInicio);
        return key ? mapaDias.has(key) : false;
      });

    return deduplicarEventos(filtrados);
  }, [categoria, mapaDias, resultados, soloTardeNoche]);

  const grupos = useMemo(
    () => agruparPorFecha(resultadosFiltrados),
    [resultadosFiltrados]
  );

  async function cargarEventosRango() {
    if (!rangoDesde || !rangoHasta) {
      setError("El itinerario no tiene un rango de fechas válido.");
      return;
    }

    const from = getLocalYmdMadrid(rangoDesde);
    const to = getLocalYmdMadrid(rangoHasta);

    if (!from || !to) {
      setError("No se pudo interpretar el rango de fechas del itinerario.");
      return;
    }

    try {
      setCargando(true);
      setError(null);
      setMensaje(null);
      setDetalle(null);
      setResultados([]);
      setYaBuscado(true);

      const response = await buscarEventosLive({
        city: destino,
        from,
        to,
        lat: baseLat,
        lng: baseLng,
        radiusKm: radioKm,
      });

      const deduplicados = deduplicarEventos(response.events ?? []);

      setResultados(deduplicados);

      const dentroDelRango = deduplicados.filter((event) => {
        const key = getLocalYmdMadrid(event.fechaInicio);
        return key ? mapaDias.has(key) : false;
      });

      setMensaje(
        dentroDelRango.length > 0
          ? `Se han encontrado ${dentroDelRango.length} eventos útiles para el rango completo del itinerario.`
          : response.message ??
              "No se han encontrado eventos útiles para el rango del viaje."
      );

      if (response.search_strategy?.success_label) {
        setDetalle(
          `Estrategia usada: ${response.search_strategy.success_attempt} · ${response.search_strategy.success_label}`
        );
      } else if (response.search_strategy?.attempted?.length) {
        const resumen = response.search_strategy.attempted
          .map((item) => `${item.code}:${item.total}`)
          .join(" · ");

        setDetalle(`Intentos: ${resumen}`);
      }
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los eventos del rango del itinerario.");
    } finally {
      setCargando(false);
    }
  }

  async function anadirAlItinerario(event: EventoLive) {
    const dia = getDiaParaEvento(event, mapaDias);

    if (!dia?.idDiaItinerario) {
      setError(
        "No se ha podido asignar el evento a un día concreto del itinerario."
      );
      return;
    }

    if (estaYaSeleccionado(event, selecciones)) {
      setError("Este evento ya está añadido al itinerario.");
      return;
    }

    try {
      setGuardandoId(event.id);
      setError(null);

      await seleccionarEventoLive({
        id_itinerario: idItinerario,
        id_dia_itinerario: dia.idDiaItinerario,
        event,
        motivo: `Evento live añadido manualmente desde el bloque global del rango del itinerario. Día ${dia.numero}.`,
      });

      await onChange();
    } catch (err) {
      console.error(err);
      setError("No se pudo añadir el evento al itinerario.");
    } finally {
      setGuardandoId(null);
    }
  }

  async function quitarSeleccion(idItinerarioEvento: number) {
    try {
      setError(null);
      await eliminarSeleccionEventoLive(idItinerarioEvento);
      await onChange();
    } catch (err) {
      console.error(err);
      setError("No se pudo quitar el evento.");
    }
  }

  return (
    <div className="mt-5 rounded-[28px] border border-[#dbeafe] bg-gradient-to-br from-[#eff6ff] via-white to-[#f8fafc] p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563eb]">
            Eventos live del viaje
          </p>

          <h3 className="mt-2 text-xl font-black tracking-[-0.03em] text-[#111827]">
            Cargar todos los eventos en directo del rango del itinerario
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#667085]">
            Busca conciertos, teatro, festivales y planes del rango completo del
            viaje. Se agrupan por día y puedes añadir solo los que te interesen.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAbierto((value) => !value)}
          className="rounded-full bg-[#111827] px-5 py-3 text-sm font-black text-white"
        >
          {abierto ? "Cerrar eventos del viaje" : "Ver eventos del viaje"}
        </button>
      </div>

      {abierto && (
        <div className="mt-5 space-y-5">
          <div className="grid gap-3 md:grid-cols-3">
            <label className="block">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-[#94a3b8]">
                Categoría
              </span>

              <select
                value={categoria}
                onChange={(event) =>
                  setCategoria(event.target.value as CategoriaFiltro)
                }
                className="mt-2 w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-bold text-[#111827] outline-none"
              >
                {CATEGORIAS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-[#94a3b8]">
                Radio inicial
              </span>

              <select
                value={radioKm}
                onChange={(event) => setRadioKm(Number(event.target.value))}
                className="mt-2 w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-bold text-[#111827] outline-none"
              >
                <option value={20}>20 km</option>
                <option value={30}>30 km</option>
                <option value={50}>50 km</option>
                <option value={70}>70 km</option>
              </select>
            </label>

            <label className="flex items-end">
              <span className="flex w-full items-center gap-3 rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-bold text-[#111827]">
                <input
                  type="checkbox"
                  checked={soloTardeNoche}
                  onChange={(event) => setSoloTardeNoche(event.target.checked)}
                />
                Priorizar tarde / noche
              </span>
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={cargarEventosRango}
              disabled={cargando}
              className="rounded-full bg-[#111827] px-5 py-3 text-sm font-black text-white disabled:opacity-60"
            >
              {cargando ? "Buscando..." : "Cargar todos los eventos del viaje"}
            </button>

            <span className="text-xs font-semibold text-[#667085]">
              {destino} · {fechaLabel(rangoDesde)} → {fechaLabel(rangoHasta)}
            </span>
          </div>

          {error && (
            <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          {mensaje && !error && (
            <div className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#475467]">
              {mensaje}

              <div className="mt-1 text-xs font-medium text-[#667085]">
                Mostrados tras filtros y deduplicación: {resultadosFiltrados.length}
              </div>

              {detalle && (
                <div className="mt-1 text-xs font-medium text-[#667085]">
                  {detalle}
                </div>
              )}
            </div>
          )}

          {seleccionesOrdenadas.length > 0 && (
            <div className="rounded-[24px] border border-[#bfdbfe] bg-[#eff6ff] p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#2563eb]">
                Eventos ya añadidos al itinerario
              </p>

              <div className="mt-3 space-y-3">
                {seleccionesOrdenadas.map((item) => (
                  <div
                    key={item.id_itinerario_evento}
                    className="flex flex-col gap-3 rounded-2xl bg-white p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <h4 className="text-lg font-black text-[#111827]">
                        {item.evento_turistico.nombre}
                      </h4>

                      <p className="mt-1 text-sm font-semibold text-[#667085]">
                        {fechaLabel(item.evento_turistico.inicio)} ·{" "}
                        {horaLabel(item.evento_turistico.inicio)} ·{" "}
                        {item.evento_turistico.venue_nombre ?? "Sin recinto"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {item.evento_turistico.url && (
                        <a
                          href={item.evento_turistico.url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full bg-[#eef2ff] px-4 py-2 text-xs font-black text-[#3730a3]"
                        >
                          Ver evento
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          quitarSeleccion(item.id_itinerario_evento)
                        }
                        className="rounded-full bg-[#dc2626] px-4 py-2 text-xs font-black text-white"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {grupos.length > 0 ? (
            <div className="space-y-5">
              {grupos.map(([fechaGrupo, eventos]) => {
                const dia = mapaDias.get(fechaGrupo);

                return (
                  <section
                    key={fechaGrupo}
                    className="rounded-[24px] border border-[#e5e7eb] bg-white p-4"
                  >
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#2563eb]">
                          {dia ? `Día ${dia.numero}` : "Fecha del rango"}
                        </p>

                        <h4 className="mt-1 text-lg font-black text-[#111827]">
                          {fechaLabel(fechaGrupo)}
                          {dia ? ` · ${dia.titulo}` : ""}
                        </h4>
                      </div>

                      <span className="rounded-full bg-[#f8fafc] px-3 py-2 text-xs font-black text-[#344054]">
                        {eventos.length} eventos
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {eventos.map((event) => {
                        const yaSeleccionado = estaYaSeleccionado(
                          event,
                          selecciones
                        );
                        const diaEvento = getDiaParaEvento(event, mapaDias);

                        return (
                          <article
                            key={event.id}
                            className="overflow-hidden rounded-[24px] border border-[#eef2f7] bg-[#fcfcfd]"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-[180px_1fr]">
                              <div className="h-[180px] bg-gradient-to-br from-[#eff6ff] to-[#f8fafc] md:h-full">
                                {event.imagen ? (
                                  <img
                                    src={event.imagen}
                                    alt={event.nombre}
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
                                      {categoriaEventoLabel(event.categoria)}
                                    </p>

                                    <h4 className="mt-1 text-lg font-black text-[#111827]">
                                      {event.nombre}
                                    </h4>
                                  </div>

                                  <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-black text-[#3730a3]">
                                    {event.provider}
                                  </span>
                                </div>

                                <div className="mt-3 flex flex-wrap gap-2">
                                  <span className="rounded-full bg-[#f8fafc] px-3 py-2 text-xs font-bold text-[#344054]">
                                    {fechaLabel(event.fechaInicio)}
                                  </span>

                                  <span className="rounded-full bg-[#f8fafc] px-3 py-2 text-xs font-bold text-[#344054]">
                                    {horaLabel(event.fechaInicio)}
                                  </span>

                                  {event.recinto && (
                                    <span className="rounded-full bg-[#fff7ed] px-3 py-2 text-xs font-bold text-[#c2410c]">
                                      {event.recinto}
                                    </span>
                                  )}

                                  {diaEvento && (
                                    <span className="rounded-full bg-[#ecfdf3] px-3 py-2 text-xs font-bold text-[#027a48]">
                                      Se añadirá al día {diaEvento.numero}
                                    </span>
                                  )}
                                </div>

                                {(event.recinto || event.direccion) && (
                                  <p className="mt-3 text-sm leading-6 text-[#667085]">
                                    {event.recinto ?? "Sin recinto"}
                                    {event.direccion
                                      ? ` · ${event.direccion}`
                                      : ""}
                                  </p>
                                )}

                                {event.descripcion && (
                                  <p className="mt-3 text-sm leading-6 text-[#667085]">
                                    {event.descripcion}
                                  </p>
                                )}

                                <div className="mt-4 flex flex-wrap gap-2">
                                  <button
                                    type="button"
                                    onClick={() => anadirAlItinerario(event)}
                                    disabled={
                                      guardandoId === event.id || yaSeleccionado
                                    }
                                    className="rounded-full bg-[#111827] px-4 py-2 text-xs font-black text-white disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    {yaSeleccionado
                                      ? "Ya añadido"
                                      : guardandoId === event.id
                                        ? "Guardando..."
                                        : "Añadir al itinerario"}
                                  </button>

                                  {event.url && (
                                    <a
                                      href={event.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="rounded-full bg-[#eef2ff] px-4 py-2 text-xs font-black text-[#3730a3]"
                                    >
                                      Ver fuente
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          ) : (
            yaBuscado &&
            !cargando &&
            !error && (
              <div className="rounded-2xl border border-[#e5e7eb] bg-white px-4 py-4 text-sm text-[#667085]">
                No hay eventos útiles para mostrar en el rango del viaje con la
                búsqueda actual.
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}