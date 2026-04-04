import { useLocation, useNavigate } from "react-router-dom";
import RoseAvatar from "../../../assets/chat/RoseAvatar.png";

type EstadoPreferencias = {
  destino?: string;
  dias?: string;
  presupuesto?: string;
  estilo?: string;
  preferenciaPrincipal?: string;
  preferenciaDescripcion?: string;
};

const ajustesPresupuesto = [
  {
    id: "ahorro",
    titulo: "Optimizar bastante el gasto",
    descripcion:
      "Buscar una propuesta más contenida, con menos puntos caros y mejor equilibrio general.",
  },
  {
    id: "equilibrado",
    titulo: "Mantener un equilibrio razonable",
    descripcion:
      "Priorizar buena experiencia sin disparar el presupuesto innecesariamente.",
  },
  {
    id: "experiencias",
    titulo: "Invertir en experiencias potentes",
    descripcion:
      "Dar más peso a lugares, actividades o comidas especiales aunque suba el coste.",
  },
  {
    id: "muy-flexible",
    titulo: "Ser flexible si merece la pena",
    descripcion:
      "No limitar demasiado el viaje si eso mejora mucho la calidad final del itinerario.",
  },
];

function IconoMoneda() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M9.5 13.5C9.5 14.6046 10.6193 15.5 12 15.5C13.3807 15.5 14.5 14.6046 14.5 13.5C14.5 12.3954 13.3807 11.5 12 11.5C10.6193 11.5 9.5 10.6046 9.5 9.5C9.5 8.39543 10.6193 7.5 12 7.5C13.3807 7.5 14.5 8.39543 14.5 9.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M12 6V18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function ChatPresupuestoPantalla() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as EstadoPreferencias;

  function continuar(opcion: (typeof ajustesPresupuesto)[number]) {
    navigate("/chat/intereses", {
      state: {
        ...state,
        ajustePresupuesto: opcion.titulo,
        ajustePresupuestoDescripcion: opcion.descripcion,
      },
    });
  }

  return (
    <div className="min-h-full bg-[#eef2f8] text-[#0f172a]">
      <div className="mx-auto w-full max-w-[430px] pb-28">
        <section className="px-5 pt-5">
          <div className="overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#111827_0%,#1f2937_55%,#25324a_100%)] shadow-[0_20px_45px_rgba(15,23,42,0.18)]">
            <div className="px-5 pb-5 pt-5">
              <div className="flex items-start gap-3">
                <img
                  src={RoseAvatar}
                  alt="Rose"
                  className="h-14 w-14 rounded-2xl border border-white/15 object-cover"
                />

                <div className="min-w-0 flex-1">
                  <h1 className="text-[22px] font-bold tracking-[-0.03em] text-white">
                    Ajuste fino del presupuesto
                  </h1>
                  <p className="mt-2 text-sm leading-6 text-white/74">
                    No se trata solo de cuánto gastar, sino de dónde merece la pena
                    concentrar más valor dentro del viaje.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-[26px] border border-white/10 bg-white/10 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-white/50">
                  Enfoque actual
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white">
                    {state.destino || "Destino"}
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white">
                    {state.dias || "Duración"}
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white">
                    {state.presupuesto || "Presupuesto"}
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white">
                    {state.preferenciaPrincipal || "Preferencia"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 pt-5">
          <div className="mb-3">
            <h2 className="text-[18px] font-bold tracking-[-0.02em]">
              ¿Cómo quieres tratar el presupuesto?
            </h2>
            <p className="text-sm leading-6 text-[#667085]">
              Esto nos ayuda a decidir si el asistente debe contener, equilibrar o
              potenciar más ciertas partes del viaje.
            </p>
          </div>

          <div className="space-y-4">
            {ajustesPresupuesto.map((opcion) => (
              <button
                key={opcion.id}
                type="button"
                onClick={() => continuar(opcion)}
                className="w-full rounded-[28px] bg-white p-5 text-left shadow-[0_14px_30px_rgba(15,23,42,0.08)] transition hover:translate-y-[-1px]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[17px] font-bold text-[#111827]">
                      {opcion.titulo}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#667085]">
                      {opcion.descripcion}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff4ef] text-[#ff6a47]">
                    <IconoMoneda />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="px-5 pt-5">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/chat/preferencias", { state })}
              className="flex-1 rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-semibold text-[#111827]"
            >
              Volver
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}