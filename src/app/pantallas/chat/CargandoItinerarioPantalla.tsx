import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatAvatar from "@/app/componentes/chat/ChatAvatar";
import LoadingDots from "@/app/componentes/chat/LoadingDots";

export default function CargandoItinerarioPantalla() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => {
      navigate("/chat/resultado");
    }, 1800);

    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[393px] flex-col items-center justify-center px-6">
        <ChatAvatar />
        <h1 className="mt-6 text-[26px] font-bold text-black">
          Creando tu viaje perfecto
        </h1>
        <p className="mt-3 text-center text-[14px] leading-[24px] text-[#7c6b69]">
          Estamos preparando tu itinerario personalizado por Madrid
        </p>

        <div className="mt-8">
          <LoadingDots />
        </div>
      </div>
    </div>
  );
}