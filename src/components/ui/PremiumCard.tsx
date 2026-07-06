import type { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type PremiumCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** Añade elevación y realce coral al pasar el ratón (para tarjetas clicables). */
  interactive?: boolean;
  /** Variante visual de la tarjeta. */
  tone?: "default" | "coral" | "muted";
};

/**
 * Tarjeta base premium de SpainWay: fondo claro, bordes redondeados grandes,
 * sombra suave y micro-interacción opcional. Unifica el look de tarjetas que
 * antes se repetía inline por toda la app.
 */
export function PremiumCard({
  children,
  interactive = false,
  tone = "default",
  className,
  ...rest
}: PremiumCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border p-5 shadow-card transition-all duration-300",
        tone === "default" && "border-black/5 bg-card",
        tone === "coral" && "border-coral-border bg-coral-soft",
        tone === "muted" && "border-black/5 bg-muted/40",
        interactive &&
          "cursor-pointer hover:-translate-y-1 hover:shadow-card-hover active:translate-y-0",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
