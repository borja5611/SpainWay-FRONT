import { motion } from "motion/react";
import type { ReactNode } from "react";

interface SeccionInicioProps {
  titulo: string;
  children: ReactNode;
}

export default function SeccionInicio({ titulo, children }: SeccionInicioProps) {
  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        {titulo}
      </h2>
      {children}
    </motion.div>
  );
}
