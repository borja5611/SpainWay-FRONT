import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";

type AnimatedListProps = {
  children: ReactNode[];
  className?: string;
  /** Retardo entre elementos (efecto cascada). */
  stagger?: number;
};

/** Lista con entrada escalonada (stagger) para dar sensación reactiva y premium. */
export function AnimatedList({ children, className, stagger = 0.05 }: AnimatedListProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: stagger } } }}
    >
      {children.map((child, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

/** Envuelve un único bloque con una animación de aparición suave. */
export function FadeIn({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
