import { motion } from "motion/react";
import { ImageWithFallback } from "@/app/componentes/figma/ImageWithFallback";
import { MapPin } from "lucide-react";

interface ExploraVisualmenteCardProps {
  titulo: string;
  descripcion: string;
  imagen: string;
  onAbrirMapa: () => void;
}

export default function ExploraVisualmenteCard({
  titulo,
  descripcion,
  imagen,
  onAbrirMapa,
}: ExploraVisualmenteCardProps) {
  return (
    <motion.div
      className="px-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
        <div className="p-6 flex items-start gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {titulo}
            </h2>
            <p className="text-sm text-gray-600 mb-5 leading-relaxed">
              {descripcion}
            </p>
            <motion.button
              onClick={onAbrirMapa}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 inline-flex items-center gap-2"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <MapPin className="w-4 h-4" />
              Abrir Mapa
            </motion.button>
          </div>
          
          <motion.div
            className="w-32 h-32 rounded-xl overflow-hidden shadow-lg flex-shrink-0"
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ duration: 0.3 }}
          >
            <ImageWithFallback
              src={imagen}
              alt={titulo}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
