import { useLocation, useNavigate } from "react-router-dom";
import HeroInicio from "../../../assets/chat/InicioItinerarioHero.png";

type EstadoResultado = {
  destino?: string;
  dias?: string;
  presupuesto?: string;
  estilo?: string;
  preferenciaPrincipal?: string;
  ajustePresupuesto?: string;
  intereses?: string[];
};

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

function IconoRuta() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 19C7.10457 19 8 18.1046 8 17C8 15.8954 7.10457 15 6 15C4.89543 15 4 15.8954 4 17C4 18.1046 4.89543 19 6 19Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M18 9C19.1046 9 20 8.10457 20 7C20 5.89543 19.1046 5 18 5C16.8954 5 16 5.89543 16 7C16 8.10457 16.8954 9 18 9Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8 17C12 17 12 7 16 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ResultadoChatPantalla() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as EstadoResultado;

  const destino = state.destino || "Destino personalizado";
  const dias = state.dias || "4-5 días";
  const presupuesto = state.presupuesto || "Medio";
  const estilo = state.estilo || "Equilibrado";
  const preferencia = state.preferenciaPrincipal || "Imprescindibles primero";
  const ajustePresupuesto =
    state.ajustePresupuesto || "Mantener un equilibrio razonable";
  const intereses = state.intereses || ["Patrimonio", "Gastronomía local", "Miradores"];

  return (
    <div className="min-h-full bg-[#eef2f8] text-[#0f172a]">
      <div className="mx-auto w-full max-w-[430px] pb-28">
        <section className="relative overflow-hidden px-5 pt-5">
          <div className="overflow-hidden rounded-[34px] bg-[#111827] shadow-[0_20px_45px_rgba(15,23,42,0.18)]">
            <div className="absolute inset-0">
              <img
                src={HeroInicio}
                alt="Resultado del itinerario"
                className="h-full w-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.25)_0%,rgba(15,23,42,0.70)_55%,rgba(15,23,42,0.96)_100%)]" />
            </div>

            <div className="relative px-5 pb-6 pt-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white">
                <IconoCheck />
                Propuesta base generada
              </div>

              <h1 className="mt-5 text-[32px] font-extrabold leading-[1.02] tracking-[-0.05em] text-white">
                Ya tengo una
                <br />
                primera propuesta
              </h1>

              <p className="mt-4 max-w-[300px] text-sm leading-6 text-white/78">
                He montado una estructura inicial teniendo en cuenta tu destino,
                duración, presupuesto, prioridades e intereses.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-3 text-white">
                  <p className="text-xs text-white/50">Destino</p>
                  <p className="mt-1 text-sm font-semibold">{destino}</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-3 text-white">
                  <p className="text-xs text-white/50">Duración</p>
                  <p className="mt-1 text-sm font-semibold">{dias}</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-3 text-white">
                  <p className="text-xs text-white/50">Presupuesto</p>
                  <p className="mt-1 text-sm font-semibold">{presupuesto}</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-3 text-white">
                  <p className="text-xs text-white/50">Estilo</p>
                  <p className="mt-1 text-sm font-semibold">{estilo}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 pt-5">
          <div className="rounded-[28px] bg-white p-5 shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
            <p className="text-xs uppercase tracking-[0.16em] text-[#98a2b3]">
              Cómo queda orientado el viaje
            </p>

            <div className="mt-4 space-y-4">
              <div className="rounded-2xl bg-[#f8fafc] p-4">
                <p className="text-xs text-[#94a3b8]">Prioridad principal</p>
                <p className="mt-1 text-sm font-semibold text-[#111827]">{preferencia}</p>
              </div>

              <div className="rounded-2xl bg-[#f8fafc] p-4">
                <p className="text-xs text-[#94a3b8]">Tratamiento del presupuesto</p>
                <p className="mt-1 text-sm font-semibold text-[#111827]">
                  {ajustePresupuesto}
                </p>
              </div>

              <div className="rounded-2xl bg-[#f8fafc] p-4">
                <p className="text-xs text-[#94a3b8]">Intereses seleccionados</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {intereses.map((interes) => (
                    <span
                      key={interes}
                      className="rounded-full bg-[#fff4ef] px-3 py-1 text-xs font-semibold text-[#ff6a47]"
                    >
                      {interes}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 pt-5">
          <div className="rounded-[28px] bg-white p-5 shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
            <h2 className="text-[18px] font-bold text-[#111827]">
              Estructura inicial propuesta
            </h2>

            <div className="mt-4 space-y-4">
              <div className="rounded-[24px] border border-[#edf0f4] bg-[#fcfcfd] p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-[#94a3b8]">
                  Día 1
                </p>
                <h3 className="mt-1 text-[16px] font-bold">Entrada y primer bloque fuerte</h3>
                <p className="mt-2 text-sm leading-6 text-[#667085]">
                  Primer contacto con el destino y bloque inicial centrado en lo
                  más representativo, sin saturar demasiado la llegada.
                </p>
              </div>

              <div className="rounded-[24px] border border-[#edf0f4] bg-[#fcfcfd] p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-[#94a3b8]">
                  Días centrales
                </p>
                <h3 className="mt-1 text-[16px] font-bold">Desarrollo principal del viaje</h3>
                <p className="mt-2 text-sm leading-6 text-[#667085]">
                  Aquí se concentran los imprescindibles, los intereses con más peso
                  y las experiencias que mejor encajan contigo.
                </p>
              </div>

              <div className="rounded-[24px] border border-[#edf0f4] bg-[#fcfcfd] p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-[#94a3b8]">
                  Cierre
                </p>
                <h3 className="mt-1 text-[16px] font-bold">Final más cómodo y bien rematado</h3>
                <p className="mt-2 text-sm leading-6 text-[#667085]">
                  Último tramo más flexible, pensado para rematar el viaje sin perder
                  calidad ni convertir el final en una carrera.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 pt-5">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/chat/intereses", { state })}
              className="flex-1 rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-semibold text-[#111827]"
            >
              Ajustar
            </button>
            <button
              type="button"
              onClick={() => navigate("/itinerarios")}
              className="flex-1 rounded-2xl bg-[#ff6a47] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(255,106,71,0.24)]"
            >
              Guardar propuesta
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate("/chat")}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#111827] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(17,24,39,0.16)]"
          >
            <IconoRuta />
            Empezar otro briefing
          </button>
        </section>
      </div>
    </div>
  );
}