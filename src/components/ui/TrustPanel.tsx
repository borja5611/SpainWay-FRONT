import { cn } from "@/lib/cn";

const PILLARS = [
  { icon: "✨", title: "Tus preferencias", desc: "Intereses, ritmo y transporte del viaje." },
  { icon: "🏛️", title: "Calidad turística", desc: "Lugares con valor real, no relleno genérico." },
  { icon: "🗺️", title: "Coherencia de ruta", desc: "Paradas encadenadas por cercanía." },
  { icon: "📍", title: "Contexto del destino", desc: "Datos disponibles del lugar y su entorno." },
];

/**
 * Panel de confianza "Por qué SpainWay te recomienda este viaje". Explica, con
 * lenguaje de producto (sin jerga técnica), los criterios del recomendador.
 */
export function TrustPanel({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-coral-border bg-coral-soft p-5 shadow-card",
        className,
      )}
    >
      <h3
        className="text-base font-semibold text-foreground"
        style={{ fontFamily: "var(--font-family-display)" }}
      >
        Por qué SpainWay te recomienda este viaje
      </h3>
      <p className="mt-1.5 text-sm text-foreground/75">
        SpainWay ha organizado este viaje combinando tus preferencias, la calidad turística de los
        lugares, la coherencia de la ruta y el contexto disponible del destino.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {PILLARS.map((p) => (
          <div key={p.title} className="rounded-2xl bg-card/80 p-3">
            <div className="mb-1 text-lg" aria-hidden>
              {p.icon}
            </div>
            <p className="text-sm font-semibold text-foreground">{p.title}</p>
            <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
