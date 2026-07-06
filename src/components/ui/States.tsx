import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";

/** Bloque skeleton con shimmer para estados de carga (sustituye loaders de texto). */
export function SkeletonCard({ className, lines = 3 }: { className?: string; lines?: number }) {
  return (
    <div className={cn("rounded-3xl border border-black/5 bg-card p-5 shadow-card", className)}>
      <div className="mb-4 h-32 w-full animate-pulse rounded-2xl bg-muted/70" />
      <div className="space-y-2.5">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-3.5 animate-pulse rounded-full bg-muted/70"
            style={{ width: `${90 - i * 18}%` }}
          />
        ))}
      </div>
    </div>
  );
}

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

/** Estado vacío consistente con ilustración/emoji, título y CTA. */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border border-dashed border-black/10 bg-muted/20 px-6 py-12 text-center",
        className,
      )}
    >
      {icon ? (
        <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-coral-soft text-coral [&>svg]:h-7 [&>svg]:w-7">
          {icon}
        </div>
      ) : null}
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {description ? (
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </motion.div>
  );
}

type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
};

/** Estado de error con acción de reintento (evita alerts nativos). */
export function ErrorState({
  title = "Algo no ha salido como esperábamos",
  description = "Vuelve a intentarlo en unos segundos.",
  onRetry,
  retryLabel = "Reintentar",
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border border-red-100 bg-red-50/60 px-6 py-10 text-center",
        className,
      )}
    >
      <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-white text-red-500 shadow-sm">
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth={2}>
          <path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-coral-foreground transition-colors hover:bg-coral-hover"
        >
          {retryLabel}
        </button>
      ) : null}
    </div>
  );
}
