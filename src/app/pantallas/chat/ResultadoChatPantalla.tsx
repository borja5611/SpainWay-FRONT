import { useNavigate } from "react-router-dom";
import ChatAvatar from "@/app/componentes/chat/ChatAvatar";
import ResultadoResumenCard from "@/app/componentes/chat/ResultadoResumenCard";
import { useChatStore } from "@/app/store/useChatStore";

export default function ResultadoChatPantalla() {
  const navigate = useNavigate();
  const destino = useChatStore((state) => state.destino) || "Madrid";

  return (
    <div className="min-h-screen bg-[#f5f7fb] pb-24">
      <div className="mx-auto w-full max-w-[393px] px-4 pt-6">
        <div className="mb-6 flex items-center gap-3">
          <ChatAvatar />
          <div>
            <p className="text-[18px] font-semibold italic text-black">Rose</p>
            <p className="text-[13px] text-[#7c6b69]">
              ¡Aquí tienes tu itinerario!
            </p>
          </div>
        </div>

        <ResultadoResumenCard destino={destino} />

        <div className="mt-5 rounded-[18px] bg-white p-4 shadow-sm">
          <h2 className="text-[16px] font-semibold text-black">
            Actividades incluidas
          </h2>

          <ul className="mt-4 space-y-3 text-[14px] text-[#7c6b69]">
            <li>• Paseo por el Retiro</li>
            <li>• Visita al Museo del Prado</li>
            <li>• Cena romántica en el centro</li>
            <li>• Tour por la zona histórica</li>
          </ul>
        </div>

        <button
          type="button"
          onClick={() => navigate("/itinerarios")}
          className="mt-6 h-[48px] w-full rounded-[12px] bg-[#f2361d] text-[15px] font-semibold text-white"
        >
          Guardar itinerario
        </button>

        <button
          type="button"
          onClick={() => navigate("/chat")}
          className="mt-3 h-[46px] w-full rounded-[12px] bg-white text-[15px] font-semibold text-black shadow-sm"
        >
          Crear nuevo itinerario
        </button>
      </div>
    </div>
  );
}