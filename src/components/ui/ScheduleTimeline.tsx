import { MetricChip } from "./Chips";
import { cn } from "@/lib/cn";

export type ScheduleSlot = {
  slot_type?: string;
  start_time?: string;
  end_time?: string;
  poi_name?: string | null;
  estimated_visit_minutes?: number;
  travel_from_previous_minutes?: number;
  estimated_distance_km?: number;
  reason?: string;
};

export type RouteMetrics = {
  total_visit_minutes?: number;
  total_travel_minutes?: number;
  estimated_distance_km?: number;
  pace_feasibility?: string;
  weather_feasibility?: string;
};

const SLOT_ICON: Record<string, string> = {
  visita: "📍",
  comida: "🍽️",
  descanso: "☕",
};

function minutesToLabel(min?: number): string {
  if (!min || min <= 0) return "";
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h ${m ? `${m}min` : ""}`.trim() : `${m}min`;
}

/**
 * Línea de tiempo del día con franjas horarias estimadas y métricas de ruta.
 * Consume el `schedule`/`route_metrics` que emite el recomendador.
 */
export function ScheduleTimeline({
  schedule,
  routeMetrics,
  className,
}: {
  schedule: ScheduleSlot[];
  routeMetrics?: RouteMetrics | null;
  className?: string;
}) {
  if (!schedule || schedule.length === 0) return null;

  return (
    <div className={cn("rounded-2xl bg-muted/30 p-4", className)}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Plan horario estimado
      </p>
      <ol className="relative space-y-3 border-l-2 border-coral-border pl-4">
        {schedule.map((slot, i) => {
          const type = slot.slot_type ?? "visita";
          return (
            <li key={i} className="relative">
              <span className="absolute -left-[1.42rem] grid h-6 w-6 place-items-center rounded-full bg-card text-xs shadow-sm">
                {SLOT_ICON[type] ?? "📍"}
              </span>
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">{slot.poi_name}</p>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">
                  {slot.start_time}–{slot.end_time}
                </span>
              </div>
              {slot.travel_from_previous_minutes && slot.travel_from_previous_minutes > 0 ? (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  🚶 {slot.travel_from_previous_minutes} min
                  {slot.estimated_distance_km ? ` · ${slot.estimated_distance_km} km` : ""}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>

      {routeMetrics ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {routeMetrics.total_visit_minutes ? (
            <MetricChip label="Visitas" value={minutesToLabel(routeMetrics.total_visit_minutes)} />
          ) : null}
          {routeMetrics.total_travel_minutes ? (
            <MetricChip label="Trayectos" value={minutesToLabel(routeMetrics.total_travel_minutes)} />
          ) : null}
          {routeMetrics.estimated_distance_km ? (
            <MetricChip label="Distancia" value={`${routeMetrics.estimated_distance_km} km`} />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
