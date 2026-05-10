import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getItinerarioDetalle,
  getItinerariosResumen,
  type Itinerario,
} from "@/app/servicios/itinerarios";
import { useAuthStore } from "@/app/store/useAuthStore";

type RangeState = {
  start: string | null;
  end: string | null;
};

type CalendarDay = {
  iso: string;
  label: number;
  inCurrentMonth: boolean;
};

type SavedItineraryPoi = {
  id: string;
  nombre: string;
  categoria?: string | null;
  direccion?: string | null;
  hora?: string | null;
  descripcion?: string | null;
};

type SavedItineraryDay = {
  iso: string | null;
  numeroDia: number;
  pois: SavedItineraryPoi[];
};

type SavedItineraryRange = {
  id: number;
  titulo: string;
  destino: string;
  start: string;
  end: string;
  dias: SavedItineraryDay[];
};

type DetalleDiaCalendario = {
  iso: string;
  itinerarios: SavedItineraryRange[];
};

const WEEKDAYS = ["L", "M", "X", "J", "V", "S", "D"];

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromIsoDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

function formatLongDate(iso: string | null): string {
  if (!iso) return "No seleccionada";
  return fromIsoDate(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatShortDate(iso: string): string {
  return fromIsoDate(iso).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
  });
}

function getMonthLabel(baseDate: Date): string {
  return baseDate.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });
}

function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function getMondayBasedWeekday(date: Date): number {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
}

function buildCalendarDays(baseDate: Date): CalendarDay[] {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - getMondayBasedWeekday(firstDay));

  const end = new Date(lastDay);
  end.setDate(lastDay.getDate() + (6 - getMondayBasedWeekday(lastDay)));

  const days: CalendarDay[] = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    days.push({
      iso: toIsoDate(cursor),
      label: cursor.getDate(),
      inCurrentMonth: cursor.getMonth() === month,
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
}

function compareIso(a: string, b: string): number {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

function isInRange(dayIso: string, range: RangeState): boolean {
  if (!range.start || !range.end) return false;
  return (
    compareIso(dayIso, range.start) >= 0 && compareIso(dayIso, range.end) <= 0
  );
}

function isSameDay(a: string | null, b: string): boolean {
  return a === b;
}

function countRangeDays(start: string | null, end: string | null): number {
  if (!start || !end) return 0;
  const a = fromIsoDate(start).getTime();
  const b = fromIsoDate(end).getTime();
  return Math.floor((b - a) / 86400000) + 1;
}

function normalizarFechaItinerario(value?: string | null): string | null {
  if (!value) return null;
  return value.slice(0, 10);
}

function addDaysIso(iso: string, days: number): string {
  const date = fromIsoDate(iso);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

function extraerTextoPoi(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const text = value.trim();
  return text.length > 0 ? text : null;
}

function mapElementoToPoi(
  elemento: unknown,
  index: number,
): SavedItineraryPoi | null {
  const item = elemento as Record<string, unknown>;
  const poi = (item.poi ?? item.Poi ?? item.punto_interes ?? {}) as Record<
    string,
    unknown
  >;
  const categoria = (poi.categoria_poi ?? item.categoria_poi ?? {}) as Record<
    string,
    unknown
  >;

  const nombre =
    extraerTextoPoi(poi.nombre) ??
    extraerTextoPoi(item.nombre) ??
    extraerTextoPoi(item.titulo) ??
    extraerTextoPoi(item.nombre_poi) ??
    extraerTextoPoi(item.poi_nombre) ??
    null;

  if (!nombre) return null;

  return {
    id: String(
      item.id_elemento_itinerario ??
        item.id_elemento ??
        item.id_itinerario_dia_elemento ??
        item.id_poi ??
        poi.id_poi ??
        `${nombre}-${index}`,
    ),
    nombre,
    categoria:
      extraerTextoPoi(categoria.nombre) ??
      extraerTextoPoi(item.tipo) ??
      extraerTextoPoi(item.categoria) ??
      null,
    direccion:
      extraerTextoPoi(poi.direccion) ?? extraerTextoPoi(item.direccion) ?? null,
    hora:
      extraerTextoPoi(item.hora_inicio) ??
      extraerTextoPoi(item.hora) ??
      extraerTextoPoi(item.inicio) ??
      null,
    descripcion:
      extraerTextoPoi(item.descripcion) ??
      extraerTextoPoi(item.notas) ??
      extraerTextoPoi(poi.descripcion) ??
      null,
  };
}

function mapDiasItinerario(
  item: Itinerario,
  start: string,
): SavedItineraryDay[] {
  const dias = (item.dias ?? []) as unknown[];

  return dias.map((diaRaw, index) => {
    const dia = diaRaw as Record<string, unknown>;
    const numeroDia =
      typeof dia.numero_dia === "number"
        ? dia.numero_dia
        : typeof dia.orden === "number"
          ? dia.orden
          : index + 1;

    const iso =
      normalizarFechaItinerario(extraerTextoPoi(dia.fecha)) ??
      normalizarFechaItinerario(extraerTextoPoi(dia.dia)) ??
      addDaysIso(start, Math.max(0, numeroDia - 1));

    const elementos = Array.isArray(dia.elementos) ? dia.elementos : [];
    const pois = elementos
      .map((elemento, poiIndex) => mapElementoToPoi(elemento, poiIndex))
      .filter((poi): poi is SavedItineraryPoi => poi !== null);

    return {
      iso,
      numeroDia,
      pois,
    };
  });
}

function mapItinerariosGuardados(items: Itinerario[]): SavedItineraryRange[] {
  return items
    .map((item) => {
      const start = normalizarFechaItinerario(item.inicio);
      const end = normalizarFechaItinerario(item.fin);

      if (!start || !end) return null;

      return {
        id: item.id_itinerario,
        titulo: item.titulo ?? "Itinerario guardado",
        destino: item.destino ?? "Destino",
        start,
        end,
        dias: mapDiasItinerario(item, start),
      };
    })
    .filter((item): item is SavedItineraryRange => item !== null);
}

function getItinerariosEnDia(
  dayIso: string,
  itinerarios: SavedItineraryRange[],
): SavedItineraryRange[] {
  return itinerarios.filter(
    (item) =>
      compareIso(dayIso, item.start) >= 0 && compareIso(dayIso, item.end) <= 0,
  );
}

function getItinerariosDelMes(
  monthDate: Date,
  itinerarios: SavedItineraryRange[],
): SavedItineraryRange[] {
  const monthStart = toIsoDate(
    new Date(monthDate.getFullYear(), monthDate.getMonth(), 1),
  );
  const monthEnd = toIsoDate(
    new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0),
  );

  return itinerarios.filter(
    (item) =>
      compareIso(item.end, monthStart) >= 0 &&
      compareIso(item.start, monthEnd) <= 0,
  );
}

function getPoisDelItinerarioEnDia(
  itinerario: SavedItineraryRange,
  dayIso: string,
): SavedItineraryPoi[] {
  return itinerario.dias
    .filter((dia) => dia.iso === dayIso)
    .flatMap((dia) => dia.pois);
}

function getNumeroDiaItinerario(
  itinerario: SavedItineraryRange,
  dayIso: string,
): number {
  const diaConFecha = itinerario.dias.find((dia) => dia.iso === dayIso);
  if (diaConFecha) return diaConFecha.numeroDia;

  const diff = countRangeDays(itinerario.start, dayIso);
  return diff > 0 ? diff : 1;
}

export default function CalendarioPantalla() {
  const navigate = useNavigate();
  const usuario = useAuthStore((state) => state.usuario);
  const idUsuario = usuario?.id_usuario ?? 1;

  const today = useMemo(() => new Date(), []);
  const [displayMonth, setDisplayMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [range, setRange] = useState<RangeState>(() => {
    try {
      const raw = localStorage.getItem("spainway_trip_date_range");
      if (!raw) return { start: null, end: null };
      const parsed = JSON.parse(raw) as RangeState;
      return {
        start: parsed.start ?? null,
        end: parsed.end ?? null,
      };
    } catch {
      return { start: null, end: null };
    }
  });
  const [itinerariosGuardados, setItinerariosGuardados] = useState<
    SavedItineraryRange[]
  >([]);
  const [cargandoItinerarios, setCargandoItinerarios] = useState(false);
  const [errorItinerarios, setErrorItinerarios] = useState<string | null>(null);
  const [detalleDia, setDetalleDia] = useState<DetalleDiaCalendario | null>(
    null,
  );
  const [cargandoDetalleDia, setCargandoDetalleDia] = useState(false);

  const days = useMemo(() => buildCalendarDays(displayMonth), [displayMonth]);

  const totalDays = useMemo(
    () => countRangeDays(range.start, range.end),
    [range.start, range.end],
  );

  const itinerariosMes = useMemo(
    () => getItinerariosDelMes(displayMonth, itinerariosGuardados),
    [displayMonth, itinerariosGuardados],
  );

  useEffect(() => {
    async function cargarItinerariosCalendario() {
      try {
        setCargandoItinerarios(true);
        setErrorItinerarios(null);

        const data = await getItinerariosResumen(idUsuario);
        setItinerariosGuardados(
          Array.isArray(data) ? mapItinerariosGuardados(data) : [],
        );
      } catch (error) {
        console.error(error);
        setItinerariosGuardados([]);
        setErrorItinerarios("No se pudieron cargar los itinerarios guardados.");
      } finally {
        setCargandoItinerarios(false);
      }
    }

    void cargarItinerariosCalendario();
  }, [idUsuario]);

  function saveRange(next: RangeState) {
    setRange(next);
    localStorage.setItem("spainway_trip_date_range", JSON.stringify(next));
  }

  function seleccionarDiaParaRango(dayIso: string) {
    if (!range.start || (range.start && range.end)) {
      saveRange({ start: dayIso, end: null });
      return;
    }

    if (compareIso(dayIso, range.start) < 0) {
      saveRange({ start: dayIso, end: range.start });
      return;
    }

    if (dayIso === range.start) {
      saveRange({ start: dayIso, end: dayIso });
      return;
    }

    saveRange({ start: range.start, end: dayIso });
  }

  async function abrirDetalleItinerariosDia(dayIso: string) {
    const itinerariosDia = getItinerariosEnDia(dayIso, itinerariosGuardados);

    if (itinerariosDia.length === 0) {
      seleccionarDiaParaRango(dayIso);
      return;
    }

    setDetalleDia({ iso: dayIso, itinerarios: itinerariosDia });
    setCargandoDetalleDia(true);

    try {
      const detalles = await Promise.all(
        itinerariosDia.map(async (resumen) => {
          try {
            const detalle = await getItinerarioDetalle(resumen.id);
            return mapItinerariosGuardados([detalle])[0] ?? resumen;
          } catch (error) {
            console.error(error);
            return resumen;
          }
        }),
      );

      setItinerariosGuardados((prev) =>
        prev.map((item) => detalles.find((detalle) => detalle.id === item.id) ?? item),
      );

      setDetalleDia({ iso: dayIso, itinerarios: detalles });
    } finally {
      setCargandoDetalleDia(false);
    }
  }

  function handleDayClick(dayIso: string) {
    const itinerariosDia = getItinerariosEnDia(dayIso, itinerariosGuardados);

    if (itinerariosDia.length > 0) {
      void abrirDetalleItinerariosDia(dayIso);
      return;
    }

    seleccionarDiaParaRango(dayIso);
  }

  function clearRange() {
    saveRange({ start: null, end: null });
  }

  return (
    <div className="min-h-full bg-[#f3f5f9] text-[#111827]">
      <div className="mx-auto w-full max-w-[430px] px-5 pb-28 pt-5">
        <section className="rounded-[30px] bg-gradient-to-br from-[#fff8f4] via-[#ffffff] to-[#f4f1ff] p-5 shadow-[0_12px_30px_rgba(15,23,42,0.07)]">
          <p className="text-xs uppercase tracking-[0.18em] text-[#94a3b8]">
            Itinerarios
          </p>
          <h1 className="mt-2 text-[24px] font-bold tracking-[-0.03em]">
            Selecciona el rango del viaje
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#667085]">
            Elige fecha de inicio y fin directamente desde el calendario. Así el
            itinerario podrá tener una base temporal real.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs text-[#94a3b8]">Inicio</p>
              <p className="mt-1 text-sm font-semibold text-[#111827]">
                {formatLongDate(range.start)}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs text-[#94a3b8]">Fin</p>
              <p className="mt-1 text-sm font-semibold text-[#111827]">
                {formatLongDate(range.end)}
              </p>
            </div>
          </div>

          <div className="mt-3 rounded-2xl bg-white p-4">
            <p className="text-xs text-[#94a3b8]">Duración</p>
            <p className="mt-1 text-lg font-bold text-[#111827]">
              {totalDays > 0 ? `${totalDays} días` : "Sin rango completo"}
            </p>
          </div>
        </section>

        <section className="mt-5 rounded-[30px] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.07)]">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setDisplayMonth((prev) => addMonths(prev, -1))}
              className="rounded-2xl bg-[#f8fafc] px-4 py-3 text-sm font-semibold text-[#111827]"
            >
              ←
            </button>

            <h2 className="text-[18px] font-bold capitalize">
              {getMonthLabel(displayMonth)}
            </h2>

            <button
              type="button"
              onClick={() => setDisplayMonth((prev) => addMonths(prev, 1))}
              className="rounded-2xl bg-[#f8fafc] px-4 py-3 text-sm font-semibold text-[#111827]"
            >
              →
            </button>
          </div>

          <div className="mt-5 grid grid-cols-7 gap-2">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="pb-2 text-center text-xs font-semibold uppercase tracking-[0.08em] text-[#94a3b8]"
              >
                {day}
              </div>
            ))}

            {days.map((day) => {
              const selectedStart = isSameDay(range.start, day.iso);
              const selectedEnd = isSameDay(range.end, day.iso);
              const selectedSingleDay = selectedStart && selectedEnd;
              const inRange = isInRange(day.iso, range);
              const itinerariosDia = getItinerariosEnDia(
                day.iso,
                itinerariosGuardados,
              );
              const ocupado = itinerariosDia.length > 0;


              return (
                <button
                  key={day.iso}
                  type="button"
                  onClick={() => handleDayClick(day.iso)}
                  title={
                    ocupado
                      ? itinerariosDia
                          .map((item) => `${item.titulo} · ${item.destino}`)
                          .join("\n")
                      : undefined
                  }
                  className={`relative h-12 rounded-2xl text-sm font-semibold transition ${
                    selectedSingleDay
                      ? "bg-[#7c3aed] text-white shadow-[0_10px_20px_rgba(124,58,237,0.25)]"
                      : selectedStart || selectedEnd
                        ? "bg-[#ff5a36] text-white shadow-[0_10px_20px_rgba(255,90,54,0.25)]"
                        : inRange
                          ? "bg-[#fff0ea] text-[#ff5a36]"
                          : ocupado
                            ? "bg-[#e0f2fe] text-[#0369a1] ring-2 ring-[#7dd3fc]"
                            : day.inCurrentMonth
                              ? "bg-[#f8fafc] text-[#111827]"
                              : "bg-[#f8fafc] text-[#c0c7d4]"
                  }`}
                >
                  {day.label}

                  {ocupado && (
                    <span
                      className={`absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${
                        selectedStart || selectedEnd
                          ? "bg-white"
                          : inRange
                            ? "bg-[#ff5a36]"
                            : "bg-[#0284c7]"
                      }`}
                    />
                  )}

            
                </button>
              );
            })}
          </div>

          <div className="mt-5 rounded-[24px] border border-[#edf0f4] bg-[#fcfcfd] p-4">
            <p className="text-sm font-semibold text-[#111827]">
              Resumen del rango
            </p>
            <p className="mt-2 text-sm leading-6 text-[#667085]">
              {range.start && range.end
                ? `Has seleccionado del ${formatShortDate(range.start)} al ${formatShortDate(
                    range.end,
                  )}.`
                : range.start
                  ? `Has marcado el inicio el ${formatShortDate(
                      range.start,
                    )}. Ahora selecciona la fecha final.`
                  : "Pulsa primero la fecha de inicio y después la fecha de fin."}
            </p>
          </div>

          <div className="mt-4 rounded-[24px] border border-[#dbeafe] bg-[#eff6ff] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black text-[#1d4ed8]">
                  Itinerarios guardados en este mes
                </p>
                <p className="mt-1 text-xs leading-5 text-[#1e3a8a]">
                  Los días marcados en azul ya tienen un itinerario guardado, pero puedes reutilizar esas fechas para otro viaje.
                </p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#1d4ed8]">
                {itinerariosMes.length}
              </span>
            </div>

            {cargandoItinerarios ? (
              <p className="mt-3 text-sm text-[#1e3a8a]">
                Cargando itinerarios...
              </p>
            ) : errorItinerarios ? (
              <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">
                {errorItinerarios}
              </p>
            ) : itinerariosMes.length === 0 ? (
              <p className="mt-3 text-sm leading-6 text-[#1e3a8a]">
                No hay itinerarios con fechas guardadas en este mes.
              </p>
            ) : (
              <div className="mt-3 space-y-2">
                {itinerariosMes.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-white/80 px-4 py-3"
                  >
                    <p className="text-sm font-bold text-[#0f172a]">
                      {item.titulo}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#1e3a8a]">
                      {item.destino} · {formatShortDate(item.start)} →{" "}
                      {formatShortDate(item.end)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={clearRange}
              className="flex-1 rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-semibold text-[#111827]"
            >
              Limpiar
            </button>
            <button
              type="button"
              onClick={() => navigate("/itinerarios/crear")}
              className="flex-1 rounded-2xl bg-[#ff5a36] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(255,90,54,0.28)]"
            >
              Continuar
            </button>
          </div>
        </section>
      </div>

      {detalleDia && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-5 backdrop-blur-sm">
          <div className="max-h-[82vh] w-full max-w-[390px] overflow-hidden rounded-[30px] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.26)]">
            <div className="border-b border-[#edf0f4] bg-gradient-to-br from-[#fff8f4] via-white to-[#eff6ff] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#ff5a36]">
                    Itinerarios del día
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-[#111827]">
                    {formatLongDate(detalleDia.iso)}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#667085]">
                    Estos son los POIs previstos para visitar ese día. También puedes usar esta fecha para crear otro itinerario.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setDetalleDia(null)}
                  className="rounded-full bg-white px-3 py-2 text-sm font-bold text-[#111827] shadow-sm"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="max-h-[58vh] overflow-y-auto p-5">
              {cargandoDetalleDia && (
                <div className="mb-4 rounded-2xl bg-[#fff7f4] px-4 py-3 text-sm font-semibold text-[#ff5a36]">
                  Cargando POIs reales del itinerario...
                </div>
              )}

              <div className="space-y-4">
                {detalleDia.itinerarios.map((itinerario) => {
                  const poisDia = getPoisDelItinerarioEnDia(
                    itinerario,
                    detalleDia.iso,
                  );
                  const numeroDia = getNumeroDiaItinerario(
                    itinerario,
                    detalleDia.iso,
                  );

                  return (
                    <div
                      key={itinerario.id}
                      className="rounded-[24px] border border-[#dbeafe] bg-[#eff6ff] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-black text-[#1d4ed8]">
                            {itinerario.titulo}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-[#1e3a8a]">
                            {itinerario.destino} · Día {numeroDia}
                          </p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#1d4ed8]">
                          {poisDia.length} POIs
                        </span>
                      </div>

                      {poisDia.length === 0 ? (
                        <p className="mt-4 rounded-2xl bg-white/75 px-4 py-3 text-sm leading-6 text-[#1e3a8a]">
                          Este itinerario ocupa este día, pero no se han encontrado POIs
                          detallados para esta fecha. Si el itinerario se generó
                          desde IA, revisa que el backend haya guardado los elementos
                          del día en DiaItinerario.elementos.
                        </p>
                      ) : (
                        <div className="mt-4 space-y-3">
                          {poisDia.map((poi, index) => (
                            <div
                              key={`${poi.id}-${index}`}
                              className="rounded-2xl bg-white px-4 py-3 shadow-[0_8px_18px_rgba(15,23,42,0.04)]"
                            >
                              <div className="flex items-start gap-3">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ff5a36] text-xs font-black text-white">
                                  {index + 1}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-bold text-[#111827]">
                                    {poi.nombre}
                                  </p>
                                  {(poi.hora || poi.categoria) && (
                                    <p className="mt-1 text-xs font-semibold text-[#1d4ed8]">
                                      {[poi.hora, poi.categoria]
                                        .filter(Boolean)
                                        .join(" · ")}
                                    </p>
                                  )}
                                  {poi.direccion && (
                                    <p className="mt-1 text-xs leading-5 text-[#667085]">
                                      {poi.direccion}
                                    </p>
                                  )}
                                  {poi.descripcion && (
                                    <p className="mt-2 line-clamp-3 text-xs leading-5 text-[#667085]">
                                      {poi.descripcion}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-[#edf0f4] bg-white p-5">
              <button
                type="button"
                onClick={() => setDetalleDia(null)}
                className="rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-semibold text-[#111827]"
              >
                Cerrar
              </button>

              <button
                type="button"
                onClick={() => {
                  seleccionarDiaParaRango(detalleDia.iso);
                  setDetalleDia(null);
                }}
                className="rounded-2xl bg-[#ff5a36] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(255,90,54,0.28)]"
              >
                Usar fecha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
