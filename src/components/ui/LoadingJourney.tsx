import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/cn";

const DEFAULT_STEPS = [
  "Leyendo tus preferencias",
  "Consultando datos del destino",
  "Seleccionando los mejores lugares",
  "Trazando una ruta coherente",
  "Preparando tu propuesta",
];

type LoadingJourneyProps = {
  steps?: string[];
  /** Paso activo controlado. Si se omite, avanza solo con microcopy de producto. */
  currentStep?: number;
  title?: string;
  className?: string;
};

/**
 * Cargador premium por pasos para la generación de viajes. Sustituye a los
 * "Cargando..." de texto plano por una experiencia de producto guiada.
 */
export function LoadingJourney({
  steps = DEFAULT_STEPS,
  currentStep,
  title = "Preparando tu viaje",
  className,
}: LoadingJourneyProps) {
  const [auto, setAuto] = useState(0);
  const controlled = currentStep !== undefined;
  const active = controlled ? Math.min(currentStep, steps.length - 1) : auto;

  useEffect(() => {
    if (controlled) return;
    const id = window.setInterval(() => {
      setAuto((prev) => (prev + 1) % steps.length);
    }, 1600);
    return () => window.clearInterval(id);
  }, [controlled, steps.length]);

  const progress = ((active + 1) / steps.length) * 100;

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-md rounded-3xl border border-black/5 bg-card p-6 shadow-card",
        className,
      )}
    >
      <div className="mb-5 flex items-center gap-3">
        <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-coral-soft">
          <motion.span
            className="h-5 w-5 rounded-full border-2 border-coral border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, ease: "linear", duration: 0.9 }}
          />
        </span>
        <div>
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">
            Paso {active + 1} de {steps.length}
          </p>
        </div>
      </div>

      <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-muted/70">
        <motion.div
          className="h-full rounded-full bg-coral"
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeInOut", duration: 0.5 }}
        />
      </div>

      <ul className="space-y-2.5">
        {steps.map((step, i) => {
          const done = i < active;
          const isActive = i === active;
          return (
            <li key={step} className="flex items-center gap-3">
              <span
                className={cn(
                  "grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors",
                  done && "bg-emerald-500 text-white",
                  isActive && "bg-coral text-coral-foreground",
                  !done && !isActive && "bg-muted text-muted-foreground",
                )}
              >
                {done ? "✓" : i + 1}
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={`${step}-${isActive}`}
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: isActive || done ? 1 : 0.5 }}
                  className={cn(
                    "text-sm",
                    isActive ? "font-medium text-foreground" : "text-muted-foreground",
                  )}
                >
                  {step}
                </motion.span>
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
