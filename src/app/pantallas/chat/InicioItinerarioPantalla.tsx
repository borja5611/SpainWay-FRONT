import { useNavigate } from "react-router-dom";
import inicioItinerarioHero from "@/assets/chat/InicioItinerarioHero.png";
import logoSpainWay from "@/assets/LogoSpainway.png";

export default function InicioItinerarioPantalla() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white pb-24">
      <img
        src={inicioItinerarioHero}
        alt="Inicio itinerario"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/60" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[393px] flex-col justify-between px-6 py-8">
        <div className="flex justify-center pt-4">
          <img
            src={logoSpainWay}
            alt="SpainWay"
            className="h-[120px] w-[180px] object-contain"
          />
        </div>

        <div className="pb-12 text-center text-white">
          <h1 className="text-[32px] font-bold leading-[40px]">
            Planifica tu viaje perfecto
          </h1>
          <p className="mx-auto mt-4 max-w-[280px] text-[16px] text-white/90">
            Descubre experiencias únicas adaptadas a tus gustos y presupuesto
          </p>

          <button
            type="button"
            onClick={() => navigate("/chat/destino")}
            className="mt-8 h-[57px] w-[300px] rounded-[30px] bg-white text-[20px] font-semibold text-black shadow-lg transition hover:bg-neutral-100"
          >
            Crear itinerario
          </button>

          <button
            type="button"
            onClick={() => navigate("/inicio")}
            className="mt-4 text-[14px] text-white/90 underline"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}