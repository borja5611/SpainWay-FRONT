import { useNavigate } from "react-router-dom";
import ChatAvatar from "@/app/componentes/chat/ChatAvatar";
import ChatBubble from "@/app/componentes/chat/ChatBubble";
import TarjetaOpcion from "@/app/componentes/chat/TarjetaOpcion";
import { useChatStore } from "@/app/store/useChatStore";

const opciones = [
  { id: "romantico", titulo: "Romántico", icono: "💗" },
  { id: "aventurero", titulo: "Aventurero", icono: "🧭" },
  { id: "familiar", titulo: "Familiar", icono: "👨‍👩‍👧" },
  { id: "tranquilo", titulo: "Tranquilo", icono: "😌" },
];

export default function ChatPreferenciasPantalla() {
  const navigate = useNavigate();
  const destino = useChatStore((state) => state.destino);
  const preferencias = useChatStore((state) => state.preferencias);
  const togglePreferencia = useChatStore((state) => state.togglePreferencia);

  return (
    <div className="min-h-screen bg-[#f5f7fb] pb-24">
      <div className="mx-auto w-full max-w-[393px] px-4 pt-6">
        <div className="mb-6 flex items-center gap-3">
          <ChatAvatar />
          <p className="text-[18px] font-semibold italic text-black">Rose</p>
        </div>

        <ChatBubble tipo="user">Quiero ir a {destino}</ChatBubble>

        <div className="mt-5">
          <ChatBubble tipo="bot">
            ¡Excelente elección! ¿Qué tipo de viaje prefieres?
          </ChatBubble>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          {opciones.map((opcion) => (
            <TarjetaOpcion
              key={opcion.id}
              icono={opcion.icono}
              titulo={opcion.titulo}
              activa={preferencias.includes(opcion.id)}
              onClick={() => togglePreferencia(opcion.id)}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => navigate("/chat/presupuesto")}
          className="mt-8 h-[48px] w-full rounded-[12px] bg-[#f2361d] text-[15px] font-semibold text-white"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}