import { motion } from "motion/react";
import { ImageWithFallback } from "@/app/componentes/figma/ImageWithFallback";

type Props = {
  titulo: string;
  descripcion: string;
  imagen: string;
  onClick: () => void;
};

export default function TarjetaPoiPreview({
  titulo,
  descripcion,
  imagen,
  onClick,
}: Props) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="w-[280px] shrink-0 overflow-hidden rounded-[24px] bg-white text-left shadow-md"
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="h-[185px] w-full overflow-hidden bg-neutral-200">
        <ImageWithFallback
          src={imagen}
          alt={titulo}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-4">
        <p className="text-[18px] font-semibold text-black">{titulo}</p>
        <p className="mt-2 text-[13px] leading-[22px] text-[#6d6d6d]">
          {descripcion}
        </p>
      </div>
    </motion.button>
  );
}