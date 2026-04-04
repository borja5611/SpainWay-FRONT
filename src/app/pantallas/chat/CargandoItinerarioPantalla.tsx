import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RoseAvatar from "../../../assets/chat/RoseAvatar.png";

export default function CargandoItinerarioPantalla() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as Record<string, unknown>;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate("/chat/resultado", { state });
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [navigate, state]);

  return (
    <div className="min-h-full bg-[#eef2f8] text-[#0f172a]">
      <div className="mx-auto flex w-full max-w-[430px] flex-col items-center justify-center px-5 pb-28 pt-10">
        <div className="w-full rounded-[34px] bg-[linear-gradient(135deg,#111827_0%,#1f2937_55%,#25324a_100%)] p-6 text-white shadow-[0_22px_48px_rgba(15,23,42,0.20)]">
          <div className="flex items-center gap-4">
            <img
              src={RoseAvatar}
              alt="Rose"
              className="h-16 w-16 rounded-2xl border border-white/15 object-cover"
            />
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/50">
                SpainWay Assistant
              </p>
              <h1 className="mt-1 text-[24px] font-bold tracking-[-0.03em]">
                Construyendo tu propuesta
              </h1>
            </div>
          </div>

          <p className="mt-5 text-sm leading-7 text-white/76">
            Estoy organizando una propuesta más coherente con tu destino,
            duración, presupuesto, prioridades e intereses seleccionados.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm text-white/72">
                <span>Analizando base del viaje</span>
                <span>100%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-full rounded-full bg-[#ff6a47]" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm text-white/72">
                <span>Combinando estilo e intereses</span>
                <span>86%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[86%] rounded-full bg-[#ff6a47]" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm text-white/72">
                <span>Preparando estructura del itinerario</span>
                <span>72%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[72%] rounded-full bg-[#ff6a47]" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 w-full rounded-[28px] bg-white p-5 shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
          <h2 className="text-[18px] font-bold text-[#111827]">
            Qué estoy afinando ahora
          </h2>

          <div className="mt-4 space-y-3">
            {[
              "Reparto de días con un ritmo más lógico",
              "Peso de patrimonio, gastronomía o naturaleza según tus intereses",
              "Equilibrio entre experiencia y presupuesto",
              "Base visual para un itinerario más usable",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl bg-[#f8fafc] px-4 py-3 text-sm font-medium text-[#334155]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}