import { motion } from "motion/react";
import { ImageWithFallback } from "@/app/componentes/figma/ImageWithFallback";

type Props = {
  nombre: string;
  subtitulo: string;
  imagen: string;
  onClick: () => void;
};

export default function TarjetaCiudadDestacada({
  nombre,
  subtitulo,
  imagen,
  onClick,
}: Props) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="relative h-[240px] w-full overflow-hidden rounded-[28px] text-left shadow-xl"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.99 }}
    >
      <ImageWithFallback
        src={imagen}
        alt={nombre}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="text-[28px] font-bold text-white">{nombre}</h3>
        <p className="mt-2 text-[14px] text-white/90">{subtitulo}</p>
      </div>
    </motion.button>
  );
}