import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatAvatar from "@/app/componentes/chat/ChatAvatar";
import ChatBubble from "@/app/componentes/chat/ChatBubble";
import OpcionChip from "@/app/componentes/chat/OpcionChip";
import { useChatStore } from "@/app/store/useChatStore";
import ContenedorPantallaPrincipal from "@/app/componentes/layout/ContenedorPantallaPrincipal";

const destinos = ["Madrid", "Barcelona", "Valencia"];

export default function ChatPantalla() {
  const navigate = useNavigate();
  const setDestino = useChatStore((state) => state.setDestino);
  const [customDestination, setCustomDestination] = useState("");

  const elegirDestino = (destino: string) => {
    setDestino(destino);
    navigate("/chat/preferencias");
  };

  return (
    <div className="min-h-screen bg-[#f6f6f3]">
      <ContenedorPantallaPrincipal>
        <div className="rounded-[24px] bg-white p-4 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <ChatAvatar />
            <div>
              <p className="text-[18px] font-semibold italic text-black">Rose</p>
            </div>
          </div>

          <ChatBubble tipo="bot">
            Antes de empezar, ¿a dónde quieres viajar?
          </ChatBubble>

          <div className="mt-6 flex flex-wrap gap-3">
            {destinos.map((destino) => (
              <OpcionChip
                key={destino}
                texto={destino}
                onClick={() => elegirDestino(destino)}
              />
            ))}
          </div>

          <div className="mt-8 rounded-full border border-black bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center gap-3">
              <input
                value={customDestination}
                onChange={(e) => setCustomDestination(e.target.value)}
                placeholder="Elige otro destino"
                className="flex-1 bg-transparent text-[15px] outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (!customDestination.trim()) return;
                  elegirDestino(customDestination.trim());
                }}
                className="text-[18px]"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      </ContenedorPantallaPrincipal>
    </div>
  );
}