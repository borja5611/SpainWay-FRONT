import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type RangeState = {
  start: string | null;
  end: string | null;
};

type CalendarDay = {
  iso: string;
  label: number;
  inCurrentMonth: boolean;
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
  return compareIso(dayIso, range.start) >= 0 && compareIso(dayIso, range.end) <= 0;
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

export default function CalendarioPantalla() {
  const navigate = useNavigate();

  const today = useMemo(() => new Date(), []);
  const [displayMonth, setDisplayMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
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

  const days = useMemo(() => buildCalendarDays(displayMonth), [displayMonth]);

  const totalDays = useMemo(
    () => countRangeDays(range.start, range.end),
    [range.start, range.end]
  );

  function saveRange(next: RangeState) {
    setRange(next);
    localStorage.setItem("spainway_trip_date_range", JSON.stringify(next));
  }

  function handleDayClick(dayIso: string) {
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
              const inRange = isInRange(day.iso, range);

              return (
                <button
                  key={day.iso}
                  type="button"
                  onClick={() => handleDayClick(day.iso)}
                  className={`h-12 rounded-2xl text-sm font-semibold transition ${
                    selectedStart || selectedEnd
                      ? "bg-[#ff5a36] text-white shadow-[0_10px_20px_rgba(255,90,54,0.25)]"
                      : inRange
                      ? "bg-[#fff0ea] text-[#ff5a36]"
                      : day.inCurrentMonth
                      ? "bg-[#f8fafc] text-[#111827]"
                      : "bg-[#f8fafc] text-[#c0c7d4]"
                  }`}
                >
                  {day.label}
                </button>
              );
            })}
          </div>

          <div className="mt-5 rounded-[24px] border border-[#edf0f4] bg-[#fcfcfd] p-4">
            <p className="text-sm font-semibold text-[#111827]">Resumen del rango</p>
            <p className="mt-2 text-sm leading-6 text-[#667085]">
              {range.start && range.end
                ? `Has seleccionado del ${formatShortDate(range.start)} al ${formatShortDate(
                    range.end
                  )}.`
                : range.start
                ? `Has marcado el inicio el ${formatShortDate(
                    range.start
                  )}. Ahora selecciona la fecha final.`
                : "Pulsa primero la fecha de inicio y después la fecha de fin."}
            </p>
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
    </div>
  );
}