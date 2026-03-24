import { useNavigate } from "react-router-dom";
import ChatAvatar from "@/app/componentes/chat/ChatAvatar";
import ChatBubble from "@/app/componentes/chat/ChatBubble";
import { useChatStore } from "@/app/store/useChatStore";

const presupuestos = ["Económico", "Moderado", "Alto/Lujoso"];

export default function ChatPresupuestoPantalla() {
  const navigate = useNavigate();
  const preferencias = useChatStore((state) => state.preferencias);
  const presupuesto = useChatStore((state) => state.presupuesto);
  const setPresupuesto = useChatStore((state) => state.setPresupuesto);

  return (
    <div className="min-h-screen bg-[#f5f7fb] pb-24">
      <div className="mx-auto w-full max-w-[393px] px-4 pt-6">
        <div className="mb-6 flex items-center gap-3">
          <ChatAvatar />
          <p className="text-[18px] font-semibold italic text-black">Rose</p>
        </div>

        <ChatBubble tipo="user">
          {preferencias.length > 0
            ? `Me interesa un viaje ${preferencias.join(", ")}`
            : "Quiero un viaje especial"}
        </ChatBubble>

        <div className="mt-5">
          <ChatBubble tipo="bot">
            Un viaje romántico por Madrid suena perfecto. ¿Cuál es tu presupuesto aproximado?
          </ChatBubble>
        </div>

        <div className="mt-8 space-y-4">
          {presupuestos.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPresupuesto(item)}
              className={`h-[52px] w-full rounded-[10px] px-5 text-left shadow-sm transition ${
                presupuesto === item
                  ? "bg-[#fdf1f0] border border-[#eb8f87]"
                  : "bg-[#ededed]"
              }`}
            >
              <span className="text-[18px] text-black">{item}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => navigate("/chat/intereses")}
          className="mt-8 h-[48px] w-full rounded-[12px] bg-[#f2361d] text-[15px] font-semibold text-white"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}