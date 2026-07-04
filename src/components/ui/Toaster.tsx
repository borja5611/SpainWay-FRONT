import { motion, AnimatePresence } from "motion/react";
import { useToastStore, type ToastType } from "@/app/store/useToastStore";

const TONE: Record<ToastType, string> = {
  success: "border-emerald-200 bg-white text-emerald-800",
  error: "border-red-200 bg-white text-red-800",
  info: "border-black/10 bg-white text-foreground",
};

const ICON: Record<ToastType, string> = {
  success: "✓",
  error: "!",
  info: "i",
};

const ICON_BG: Record<ToastType, string> = {
  success: "bg-emerald-500 text-white",
  error: "bg-red-500 text-white",
  info: "bg-coral text-coral-foreground",
};

/** Contenedor global de toasts. Se monta una vez en la raíz de la app. */
export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[100] flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.button
            key={t.id}
            type="button"
            onClick={() => dismiss(t.id)}
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            className={`pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium shadow-card ${TONE[t.type]}`}
          >
            <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${ICON_BG[t.type]}`}>
              {ICON[t.type]}
            </span>
            <span className="text-left">{t.message}</span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
