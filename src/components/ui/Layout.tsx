import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";

/** Contenedor de página con ancho máximo mobile-first y transición de entrada. */
export function AppShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn("mx-auto w-full max-w-[980px] px-4 pb-24 pt-4", className)}
    >
      {children}
    </motion.main>
  );
}

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  onBack?: () => void;
  actions?: ReactNode;
  className?: string;
};

/** Cabecera de pantalla con botón atrás opcional, título display y acciones. */
export function PageHeader({ title, subtitle, eyebrow, onBack, actions, className }: PageHeaderProps) {
  return (
    <header className={cn("mb-5 flex items-start gap-3", className)}>
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver"
          className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-muted/60 text-foreground/80 transition-colors hover:bg-muted"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={2}>
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ) : null}
      <div className="min-w-0 flex-1">
        {eyebrow ? (
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-coral">{eyebrow}</p>
        ) : null}
        <h1
          className="text-2xl font-semibold leading-tight text-foreground"
          style={{ fontFamily: "var(--font-family-display)" }}
        >
          {title}
        </h1>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </header>
  );
}
