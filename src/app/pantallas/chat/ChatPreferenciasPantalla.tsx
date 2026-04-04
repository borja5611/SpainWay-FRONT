import { useLocation, useNavigate } from "react-router-dom";
import RoseAvatar from "../../../assets/chat/RoseAvatar.png";

type EstadoBase = {
  destino?: string;
  dias?: string;
  presupuesto?: string;
  estilo?: string;
};

const preferenciasOpciones = [
  {
    id: "imprescindibles",
    titulo: "Imprescindibles primero",
    descripcion:
      "Prioriza los lugares más icónicos y organiza el viaje alrededor de ellos.",
  },
  {
    id: "menos-turistico",
    titulo: "Más local y menos típico",
    descripcion:
      "Busca rincones con más personalidad y evita que todo sea demasiado turístico.",
  },
  {
    id: "ritmo-comodo",
    titulo: "Ritmo cómodo",
    descripcion:
      "Menos cambios bruscos, trayectos mejor medidos y días más disfrutables.",
  },
  {
    id: "muy-aprovechado",
    titulo: "Muy aprovechado",
    descripcion:
      "Más visitas por día, jornadas más intensas y sensación de exprimir el viaje.",
  },
  {
    id: "comida-importante",
    titulo: "Comida importante",
    descripcion:
      "Que la gastronomía sea una parte real del viaje y no un añadido secundario.",
  },
  {
    id: "fotos-miradores",
    titulo: "Miradores y sitios bonitos",
    descripcion:
      "Añade lugares visuales, paseos con encanto y paradas que luzcan mucho.",
  },
];

function IconoSpark() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3L13.8 8.2L19 10L13.8 11.8L12 17L10.2 11.8L5 10L10.2 8.2L12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconoCheck() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 13L9 17L19 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ChatPreferenciasPantalla() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as EstadoBase;

  const destino = state.destino || "tu destino";
  const dias = state.dias || "varios días";
  const presupuesto = state.presupuesto || "presupuesto flexible";
  const estilo = state.estilo || "equilibrado";

  function continuar(opcion: (typeof preferenciasOpciones)[number]) {
    navigate("/chat/presupuesto", {
      state: {
        ...state,
        preferenciaPrincipal: opcion.titulo,
        preferenciaDescripcion: opcion.descripcion,
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
                  <div className="flex items-center gap-2">
                    <h1 className="text-[22px] font-bold tracking-[-0.03em] text-white">
                      Afinemos tus preferencias
                    </h1>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/80">
                      <IconoSpark />
                      Paso 2
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-white/74">
                    Ya tenemos una base del viaje. Ahora toca decidir cómo quieres
                    que se sienta realmente la experiencia.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-[26px] border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
                <p className="text-[11px] uppercase tracking-[0.16em] text-white/50">
                  Base actual
                </p>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/8 p-3">
                    <p className="text-xs text-white/45">Destino</p>
                    <p className="mt-1 text-sm font-semibold text-white">{destino}</p>
                  </div>
                  <div className="rounded-2xl bg-white/8 p-3">
                    <p className="text-xs text-white/45">Duración</p>
                    <p className="mt-1 text-sm font-semibold text-white">{dias}</p>
                  </div>
                  <div className="rounded-2xl bg-white/8 p-3">
                    <p className="text-xs text-white/45">Presupuesto</p>
                    <p className="mt-1 text-sm font-semibold text-white">{presupuesto}</p>
                  </div>
                  <div className="rounded-2xl bg-white/8 p-3">
                    <p className="text-xs text-white/45">Estilo</p>
                    <p className="mt-1 text-sm font-semibold text-white">{estilo}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 pt-5">
          <div className="mb-3">
            <h2 className="text-[18px] font-bold tracking-[-0.02em]">
              ¿Qué quieres priorizar de verdad?
            </h2>
            <p className="text-sm leading-6 text-[#667085]">
              Elige la línea principal que debería seguir el asistente al montar el viaje.
            </p>
          </div>

          <div className="space-y-4">
            {preferenciasOpciones.map((opcion) => (
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
                    <IconoCheck />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="px-5 pt-5">
          <div className="rounded-[28px] bg-white p-5 shadow-[0_14px_30px_rgba(15,23,42,0.07)]">
            <p className="text-xs uppercase tracking-[0.16em] text-[#98a2b3]">
              Qué hará esto
            </p>
            <h3 className="mt-2 text-[18px] font-bold text-[#111827]">
              El asistente reorganizará el viaje en torno a esa prioridad
            </h3>
            <p className="mt-3 text-sm leading-6 text-[#667085]">
              No es lo mismo optimizar un viaje para imprescindibles que hacerlo
              para relax, comida o rincones locales. Aquí es donde empieza a
              volverse realmente personalizado.
            </p>

            <button
              type="button"
              onClick={() => navigate("/chat/destino")}
              className="mt-5 rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-semibold text-[#111827]"
            >
              Volver al chat
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}