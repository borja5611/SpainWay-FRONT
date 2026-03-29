import { motion } from "motion/react";
import { MapPinned } from "lucide-react";

interface CambiarDestinoButtonProps {
  onClick: () => void;
}

export default function CambiarDestinoButton({ onClick }: CambiarDestinoButtonProps) {
  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-10">
      <motion.button
        onClick={onClick}
        className="bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-6 rounded-full shadow-xl border-2 border-gray-200 hover:border-red-600 transition-all duration-300 flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
      >
        <MapPinned className="w-5 h-5 text-red-600" />
        Cambiar destino
      </motion.button>
    </div>
  );
}
