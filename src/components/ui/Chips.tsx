import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type MetricChipProps = {
  icon?: ReactNode;
  label: string;
  value?: ReactNode;
  tone?: "coral" | "neutral" | "success";
  className?: string;
};

/** Chip compacto para métricas/atributos del viaje (ritmo, días, transporte...). */
export function MetricChip({ icon, label, value, tone = "neutral", className }: MetricChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium",
        tone === "coral" && "bg-coral-soft text-coral-strong",
        tone === "neutral" && "bg-muted/60 text-foreground/80",
        tone === "success" && "bg-emerald-50 text-emerald-700",
        className,
      )}
    >
      {icon ? <span className="grid place-items-center [&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span> : null}
      <span>{label}</span>
      {value !== undefined ? <span className="font-semibold">{value}</span> : null}
    </span>
  );
}

type StatusPillProps = {
  status: "success" | "warning" | "danger" | "info" | "neutral";
  children: ReactNode;
  className?: string;
};

const STATUS_STYLES: Record<StatusPillProps["status"], string> = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
  warning: "bg-amber-50 text-amber-700 ring-amber-600/10",
  danger: "bg-red-50 text-red-700 ring-red-600/10",
  info: "bg-sky-50 text-sky-700 ring-sky-600/10",
  neutral: "bg-muted/60 text-foreground/70 ring-black/5",
};

/** Píldora de estado con anillo suave. */
export function StatusPill({ status, children, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        STATUS_STYLES[status],
        className,
      )}
    >
      {children}
    </span>
  );
}

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  action?: ReactNode;
  className?: string;
};

/** Cabecera de sección con eyebrow coral, título display y acción opcional. */
export function SectionHeader({ title, subtitle, eyebrow, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-4 flex items-end justify-between gap-3", className)}>
      <div className="min-w-0">
        {eyebrow ? (
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-coral">{eyebrow}</p>
        ) : null}
        <h2
          className="truncate text-lg font-semibold text-foreground"
          style={{ fontFamily: "var(--font-family-display)" }}
        >
          {title}
        </h2>
        {subtitle ? <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
