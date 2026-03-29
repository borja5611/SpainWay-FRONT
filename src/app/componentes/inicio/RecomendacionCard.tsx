import { motion } from "motion/react";
import { ImageWithFallback } from "@/app/componentes/figma/ImageWithFallback";
import { Star } from "lucide-react";

interface RecomendacionCardProps {
  titulo: string;
  imagen: string;
}

export default function RecomendacionCard({ titulo, imagen }: RecomendacionCardProps) {
  return (
    <motion.div
      className="flex-shrink-0 w-56 cursor-pointer group"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300">
        <div className="relative h-40 overflow-hidden">
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
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold text-gray-800">4.8</span>
          </div>
        </div>
        <div className="p-3">
          <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
            {titulo}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
