import { motion } from "motion/react";
import { ImageWithFallback } from "@/app/componentes/figma/ImageWithFallback";

interface Destino {
  id: string;
  nombre: string;
  descripcion: string;
  imagen: string;
}

interface TarjetaDestinoProps {
  destino: Destino;
  onClick: () => void;
}

export default function TarjetaDestino({ destino, onClick }: TarjetaDestinoProps) {
  return (
    <motion.button
      onClick={onClick}
      className="w-full bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative h-48 overflow-hidden">
        <motion.div
          className="w-full h-full"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
        >
          <ImageWithFallback
            src={destino.imagen}
            alt={destino.nombre}
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>
      
      <div className="p-5 text-left">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-300">
          {destino.nombre}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {destino.descripcion}
        </p>
      </div>
    </motion.button>
  );
}
