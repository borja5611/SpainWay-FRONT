import { motion } from "motion/react";
import { ImageWithFallback } from "@/app/componentes/figma/ImageWithFallback";

interface EventoDiaCardProps {
  titulo: string;
  imagen: string;
}

export default function EventoDiaCard({ titulo, imagen }: EventoDiaCardProps) {
  return (
    <motion.div
      className="flex-shrink-0 w-48 cursor-pointer group"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative h-32 rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition-shadow duration-300">
        <motion.div
          className="w-full h-full"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
        >
          <ImageWithFallback
            src={imagen}
            alt={titulo}
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-white font-semibold text-sm leading-tight line-clamp-2">
            {titulo}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
