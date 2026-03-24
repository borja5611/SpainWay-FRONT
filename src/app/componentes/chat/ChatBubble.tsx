import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  tipo?: "bot" | "user";
};

export default function ChatBubble({ children, tipo = "bot" }: Props) {
  const esUsuario = tipo === "user";

  return (
    <div className={`flex ${esUsuario ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[290px] rounded-[20px] px-4 py-3 shadow-sm ${
          esUsuario
            ? "bg-[#eb8f87] text-white rounded-tl-[20px] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[6px]"
            : "bg-white text-black rounded-tl-[6px] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[20px]"
        }`}
      >
        <p className="text-[16px] leading-[22px]">{children}</p>
      </div>
    </div>
  );
}