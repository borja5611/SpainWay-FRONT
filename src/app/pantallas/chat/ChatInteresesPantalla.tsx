import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RoseAvatar from "../../../assets/chat/RoseAvatar.png";

type EstadoIntermedio = {
  destino?: string;
  dias?: string;
  presupuesto?: string;
  estilo?: string;
  preferenciaPrincipal?: string;
  preferenciaDescripcion?: string;
  ajustePresupuesto?: string;
  ajustePresupuestoDescripcion?: string;
};

const interesesDisponibles = [
  "Patrimonio",
  "Museos",
  "Miradores",
  "Gastronomía local",
  "Pueblos con encanto",
  "Playa",
  "Naturaleza",
  "Compras",
  "Vida nocturna",
  "Barrios con ambiente",
  "Arquitectura",
  "Experiencias locales",
];

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

export default function ChatInteresesPantalla() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as EstadoIntermedio;

  const [seleccionados, setSeleccionados] = useState<string[]>([
    "Patrimonio",
    "Gastronomía local",
    "Miradores",
  ]);

  const resumen = useMemo(() => {
    return seleccionados.slice(0, 4).join(" · ");
  }, [seleccionados]);

  function toggleInteres(interes: string) {
    setSeleccionados((prev) =>
      prev.includes(interes)
        ? prev.filter((item) => item !== interes)
        : [...prev, interes]
    );
  }

  function continuar() {
    navigate("/chat/cargando", {
      state: {
        ...state,
        intereses: seleccionados,
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
                    Selecciona intereses clave
                  </h1>
                  <p className="mt-2 text-sm leading-6 text-white/74">
                    Aquí es donde el viaje deja de ser genérico y empieza a
                    construirse alrededor de lo que realmente te motiva.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-[26px] border border-white/10 bg-white/10 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-white/50">
                  Resumen actual
                </p>
                <p className="mt-2 text-sm font-semibold text-white">
                  {state.destino || "Destino"} · {state.dias || "Duración"} ·{" "}
                  {state.estilo || "Estilo"}
                </p>
                <p className="mt-2 text-sm leading-6 text-white/74">
                  Prioridad principal:{" "}
                  <span className="font-semibold text-white">
                    {state.preferenciaPrincipal || "No definida"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 pt-5">
          <div className="mb-3">
            <h2 className="text-[18px] font-bold tracking-[-0.02em]">
              Marca lo que debe tener peso en el itinerario
            </h2>
            <p className="text-sm leading-6 text-[#667085]">
              Puedes combinar varios intereses. El resultado final se apoyará en ellos.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {interesesDisponibles.map((interes) => {
              const activo = seleccionados.includes(interes);

              return (
                <button
                  key={interes}
                  type="button"
                  onClick={() => toggleInteres(interes)}
                  className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
                    activo
                      ? "bg-[#111827] text-white shadow-[0_10px_20px_rgba(17,24,39,0.14)]"
                      : "bg-white text-[#334155] shadow-[0_8px_18px_rgba(15,23,42,0.06)]"
                  }`}
                >
                  {interes}
                </button>
              );
            })}
          </div>
        </section>

        <section className="px-5 pt-5">
          <div className="rounded-[28px] bg-white p-5 shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[#98a2b3]">
                  Selección activa
                </p>
                <h3 className="mt-2 text-[18px] font-bold text-[#111827]">
                  Intereses prioritarios
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#667085]">
                  {seleccionados.length > 0
                    ? resumen
                    : "Todavía no has seleccionado intereses."}
                </p>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#ecfdf3] text-[#059669]">
                <IconoCheck />
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => navigate("/chat/presupuesto", { state })}
                className="flex-1 rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-semibold text-[#111827]"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={continuar}
                disabled={seleccionados.length === 0}
                className="flex-1 rounded-2xl bg-[#ff6a47] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(255,106,71,0.24)] disabled:cursor-not-allowed disabled:opacity-45"
              >
                Generar propuesta
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}