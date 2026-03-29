import type { ReactNode } from "react";
import { motion } from "motion/react";

type Props = {
  children: ReactNode;
  tipo?: "bot" | "user";
};

export default function ChatBubble({ children, tipo = "bot" }: Props) {
  const esUsuario = tipo === "user";

  return (
    <div className={`flex ${esUsuario ? "justify-end" : "justify-start"}`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-[290px] rounded-[20px] px-4 py-3 shadow-sm ${
          esUsuario
            ? "bg-[#eb8f87] text-white rounded-br-[6px]"
            : "bg-white text-black rounded-tl-[6px]"
        }`}
      >
        <p className="text-[15px] leading-[23px]">{children}</p>
      </motion.div>
    </div>
  );
}