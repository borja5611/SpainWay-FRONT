import { useNavigate } from "react-router-dom";
import ChatAvatar from "@/app/componentes/chat/ChatAvatar";
import ChatBubble from "@/app/componentes/chat/ChatBubble";
import OpcionChip from "@/app/componentes/chat/OpcionChip";
import { useChatStore } from "@/app/store/useChatStore";

const interesesDisponibles = ["Arte", "Food", "Fiesta", "Moda"];

export default function ChatInteresesPantalla() {
  const navigate = useNavigate();
  const intereses = useChatStore((state) => state.intereses);
  const toggleInteres = useChatStore((state) => state.toggleInteres);

  return (
    <div className="min-h-screen bg-[#f5f7fb] pb-24">
      <div className="mx-auto w-full max-w-[393px] px-4 pt-6">
        <div className="mb-6 flex items-center gap-3">
          <ChatAvatar />
          <p className="text-[18px] font-semibold italic text-black">Rose</p>
        </div>

        <ChatBubble tipo="user">Mi presupuesto es moderado</ChatBubble>

        <div className="mt-5">
          <ChatBubble tipo="bot">
            ¡Genial! ¿Cuáles de estos temas te interesan más?
          </ChatBubble>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {interesesDisponibles.map((interes) => (
            <OpcionChip
              key={interes}
              texto={interes}
              activa={intereses.includes(interes)}
              onClick={() => toggleInteres(interes)}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => navigate("/chat/cargando")}
          className="mt-8 h-[48px] w-full rounded-[12px] bg-[#f2361d] text-[15px] font-semibold text-white"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}