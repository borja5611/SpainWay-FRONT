import { useMemo, useState } from "react";
import {
  buscarEventosLive,
  eliminarSeleccionEventoLive,
  seleccionarEventoLive,
  type EventoLive,
  type SeleccionEventoLive,
} from "@/app/servicios/eventosLive";

type Props = {
  idItinerario: number;
  idDiaItinerario: number | null;
  diaNumero: number;
  destino: string;
  fecha: string | null;
  rangoDesde: string | null;
  rangoHasta: string | null;
  baseLat: number | null;
  baseLng: number | null;
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
  return value || "Evento";
}

function horaLabel(value?: string | null) {
  if (!value) return "Sin hora";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sin hora";
  return date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fechaLabel(value?: string | null) {
  if (!value) return "Sin fecha";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sin fecha";
  return date.toLocaleDateString("es-ES", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

function ymd(value?: string | null) {
  if (!value) return null;
  return value.slice(0, 10);
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
  const hour = date.getUTCHours();
  return hour >= 16;
}

function ordenarEventos(events: EventoLive[]) {
  return [...events].sort((a, b) => Number(b.score ?? 0) - Number(a.score ?? 0));
}

export default function BloqueEventosDia({
  idItinerario,
  idDiaItinerario,
  diaNumero,
  destino,
  fecha,
  rangoDesde,
  rangoHasta,
  baseLat,
  baseLng,
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
  const [mensajeBusqueda, setMensajeBusqueda] = useState<string | null>(null);
  const [detalleBusqueda, setDetalleBusqueda] = useState<string | null>(null);
  const [yaBuscado, setYaBuscado] = useState(false);

  const eventosSeleccionadosDia = useMemo(
    () =>
      selecciones.filter(
        (item) => item.id_dia_itinerario === idDiaItinerario
      ),
    [selecciones, idDiaItinerario]
  );

  async function buscar() {
    const fromBusqueda = ymd(rangoDesde) ?? ymd(fecha);
    const toBusqueda = ymd(rangoHasta) ?? ymd(fecha);
    const fechaDia = ymd(fecha);

    if (!fromBusqueda || !toBusqueda) {
      setError("Este itinerario no tiene rango de fechas válido.");
      return;
    }

    try {
      setCargando(true);
      setError(null);
      setMensajeBusqueda(null);
      setDetalleBusqueda(null);
      setResultados([]);
      setYaBuscado(true);

      const response = await buscarEventosLive({
        city: destino,
        from: fromBusqueda,
        to: toBusqueda,
        lat: baseLat,
        lng: baseLng,
        radiusKm: radioKm,
      });

      const base = ordenarEventos(
        (response.events ?? [])
          .filter((event) => pasaFiltroCategoria(event, categoria))
          .filter((event) => (soloTardeNoche ? esTardeONoche(event) : true))
      );

      const exactos =
        fechaDia !== null
          ? base.filter((event) => ymd(event.fechaInicio) === fechaDia)
          : base;

      setResultados(exactos.slice(0, 16));

      setMensajeBusqueda(
        exactos.length > 0
          ? `Se han encontrado ${exactos.length} eventos para este día dentro del rango del itinerario.`
          : response.message ??
              "No se han encontrado eventos para este día."
      );

      if (response.search_strategy?.success_label) {
        setDetalleBusqueda(
          `Estrategia usada: ${response.search_strategy.success_attempt} · ${response.search_strategy.success_label}`
        );
      }
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar eventos en vivo.");
    } finally {
      setCargando(false);
    }
  }

  async function seleccionar(event: EventoLive) {
    if (!idDiaItinerario) {
      setError("Este día todavía no está guardado en base de datos.");
      return;
    }

    try {
      setGuardandoId(event.id);

      await seleccionarEventoLive({
        id_itinerario: idItinerario,
        id_dia_itinerario: idDiaItinerario,
        event,
        motivo: `Evento live elegido manualmente por el usuario para el día ${diaNumero}.`,
      });

      await onChange();
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar el evento.");
    } finally {
      setGuardandoId(null);
    }
  }

  async function quitar(idItinerarioEvento: number) {
    try {
      await eliminarSeleccionEventoLive(idItinerarioEvento);
      await onChange();
    } catch (err) {
      console.error(err);
      setError("No se pudo quitar el evento.");
    }
  }

  return (
    <section className="mt-6 overflow-hidden rounded-[28px] border border-[#eef2f7] bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
      <button
        type="button"
        onClick={() => setAbierto((value) => !value)}
        className="flex w-full flex-col items-stretch justify-between gap-4 bg-gradient-to-br from-[#eef6ff] via-white to-[#f8fafc] p-5 text-left sm:flex-row sm:items-center"
      >
        <div className="min-w-0 flex-1">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563eb]">
            Eventos en vivo
          </p>
          <h3 className="mt-2 text-xl font-black tracking-[-0.03em] text-[#111827]">
            Cargar conciertos, teatro y planes para el día {diaNumero}
          </h3>
          <p className="mt-1 text-sm leading-6 text-[#667085]">
            Usa la misma búsqueda en vivo de Inicio, filtra resultados flojos y muestra primero los planes que encajan con este día.
          </p>
        </div>

        <span className="inline-flex w-full shrink-0 items-center justify-center rounded-full bg-[#2563eb] px-4 py-3 text-xs font-black text-white shadow-[0_12px_26px_rgba(37,99,235,0.22)] sm:w-auto">
          {abierto ? "Cerrar" : "Buscar eventos"}
        </span>
      </button>

      {abierto && (
        <div className="space-y-5 p-5">
          {eventosSeleccionadosDia.length > 0 && (
            <div className="rounded-[24px] border border-[#bfdbfe] bg-[#eff6ff] p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#2563eb]">
                Eventos añadidos a este día
              </p>

              <div className="mt-3 space-y-3">
                {eventosSeleccionadosDia.map((item) => (
                  <div
                    key={item.id_itinerario_evento}
                    className="flex flex-col gap-3 rounded-2xl bg-white p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <h4 className="text-lg font-black text-[#111827]">
                        {item.evento_turistico.nombre}
                      </h4>
                      <p className="mt-1 text-sm font-semibold text-[#667085]">
                        {categoriaEventoLabel(item.evento_turistico.categoria)} ·{" "}
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
                        onClick={() => quitar(item.id_itinerario_evento)}
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
              <span className="flex w-full items-center gap-3 rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] px-4 py-3 text-sm font-bold text-[#111827]">
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
              onClick={buscar}
              disabled={cargando}
              className="rounded-full bg-[#2563eb] px-5 py-3 text-sm font-black text-white shadow-[0_12px_26px_rgba(37,99,235,0.22)] disabled:opacity-60"
            >
              {cargando ? "Buscando..." : "Buscar eventos live"}
            </button>

            <span className="text-xs font-semibold text-[#667085]">
              {destino} · {fechaLabel(fecha)}
            </span>
          </div>

          {error && (
            <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          {mensajeBusqueda && !error && (
            <div className="rounded-2xl bg-[#f8fafc] px-4 py-3 text-sm font-semibold text-[#475467]">
              {mensajeBusqueda}
              {detalleBusqueda && (
                <div className="mt-1 text-xs font-medium text-[#667085]">
                  {detalleBusqueda}
                </div>
              )}
            </div>
          )}

          {resultados.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {resultados.map((event) => (
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
                      </div>

                      {(event.recinto || event.direccion) && (
                        <p className="mt-3 text-sm leading-6 text-[#667085]">
                          {event.recinto ?? "Sin recinto"}
                          {event.direccion ? ` · ${event.direccion}` : ""}
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
                          onClick={() => seleccionar(event)}
                          disabled={guardandoId === event.id}
                          className="rounded-full bg-[#111827] px-4 py-2 text-xs font-black text-white disabled:opacity-60"
                        >
                          {guardandoId === event.id
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
              ))}
            </div>
          ) : (
            yaBuscado &&
            !cargando &&
            !error && (
              <div className="rounded-2xl border border-[#e5e7eb] bg-white px-4 py-4 text-sm text-[#667085]">
                No hay eventos útiles para mostrar en este día.
              </div>
            )
          )}
        </div>
      )}
    </section>
  );
}