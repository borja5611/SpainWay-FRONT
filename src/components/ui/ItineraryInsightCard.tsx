import { MetricChip, StatusPill } from "./Chips";
import { translateFlag, weightEntries } from "@/lib/insightLabels";
import { cn } from "@/lib/cn";

export type ItineraryInsight = {
  totalPois?: number;
  coveredMunicipalities?: number | null;
  premiumPois?: number | null;
  averageConfidence?: number | null;
  qualityFlags?: string[];
  scoringWeights?: Record<string, number> | null;
  pipeline?: Array<{ stage: string; count: number }> | null;
};

/**
 * Tarjeta de métricas explicables del itinerario. Consume la traza de decisión
 * del recomendador y la muestra de forma visual (chips + barras), nunca en crudo.
 */
export function ItineraryInsightCard({
  insight,
  className,
}: {
  insight: ItineraryInsight;
  className?: string;
}) {
  const weights = weightEntries(insight.scoringWeights);
  const maxWeight = weights.length ? Math.max(...weights.map(([, v]) => v)) : 1;

  const funnel = insight.pipeline ?? [];
  const firstStage = funnel[0];
  const lastStage = funnel[funnel.length - 1];

  const confidencePct =
    typeof insight.averageConfidence === "number"
      ? Math.round(insight.averageConfidence * 100)
      : null;

  return (
    <section className={cn("rounded-3xl border border-black/5 bg-card p-5 shadow-card", className)}>
      <div className="mb-3 flex items-center justify-between">
        <h3
          className="text-base font-semibold text-foreground"
          style={{ fontFamily: "var(--font-family-display)" }}
        >
          Cómo se ha construido tu viaje
        </h3>
        {confidencePct !== null ? (
          <StatusPill status={confidencePct >= 70 ? "success" : "info"}>
            {confidencePct}% de confianza
          </StatusPill>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {typeof insight.coveredMunicipalities === "number" ? (
          <MetricChip tone="coral" label="Zonas" value={insight.coveredMunicipalities} />
        ) : null}
        {typeof insight.premiumPois === "number" ? (
          <MetricChip tone="coral" label="Destacados" value={insight.premiumPois} />
        ) : null}
        {typeof insight.totalPois === "number" ? (
          <MetricChip tone="neutral" label="Lugares" value={insight.totalPois} />
        ) : null}
      </div>

      {weights.length ? (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Criterios de selección
          </p>
          <div className="space-y-2">
            {weights.slice(0, 5).map(([label, value]) => (
              <div key={label} className="flex items-center gap-3">
                <span className="w-40 shrink-0 truncate text-sm text-foreground/80">{label}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted/70">
                  <div
                    className="h-full rounded-full bg-coral"
                    style={{ width: `${Math.max(8, (value / maxWeight) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {firstStage && lastStage && firstStage.count > 0 ? (
        <p className="mt-4 rounded-2xl bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          De{" "}
          <span className="font-semibold text-foreground">
            {firstStage.count.toLocaleString("es-ES")}
          </span>{" "}
          lugares reales del destino, SpainWay ha filtrado y seleccionado los{" "}
          <span className="font-semibold text-foreground">{lastStage.count}</span> más coherentes con
          tu viaje.
        </p>
      ) : null}

      {insight.qualityFlags && insight.qualityFlags.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {insight.qualityFlags.map((flag) => {
            const label = translateFlag(flag);
            return label ? (
              <StatusPill key={flag} status="success">
                {label}
              </StatusPill>
            ) : null;
          })}
        </div>
      ) : null}
    </section>
  );
}
