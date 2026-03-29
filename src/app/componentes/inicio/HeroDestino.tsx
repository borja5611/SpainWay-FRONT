import { motion } from "motion/react";
import { ImageWithFallback } from "@/app/componentes/figma/ImageWithFallback";

interface HeroDestinoProps {
  titulo: string;
  subtitulo: string;
  imagen: string;
  onExplorar: () => void;
  onEventos: () => void;
  botonExplorarTexto: string;
  botonEventosTexto: string;
}

export default function HeroDestino({
  titulo,
  subtitulo,
  imagen,
  onExplorar,
  onEventos,
  botonExplorarTexto,
  botonEventosTexto,
}: HeroDestinoProps) {
  return (
    <motion.div
      className="relative h-[400px] w-full overflow-hidden rounded-b-3xl mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="absolute inset-0">
        <ImageWithFallback
          src={imagen}
          alt={titulo}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
      </div>

      <div className="relative h-full flex flex-col justify-end p-6 pb-8">
        <motion.h1
          className="text-4xl font-bold text-white mb-3 leading-tight"
          style={{ fontFamily: 'var(--font-family-display)' }}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {titulo}
        </motion.h1>
        
        <motion.p
          className="text-base text-white/90 mb-6 leading-relaxed"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {subtitulo}
        </motion.p>

        <motion.div
          className="flex gap-3"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <motion.button
            onClick={onExplorar}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {botonExplorarTexto}
          </motion.button>
          
          <motion.button
            onClick={onEventos}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {botonEventosTexto}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
