import { useNavigate } from "react-router-dom";
import HeroInicio from "../../../assets/chat/InicioItinerarioHero.png";

const sugerenciasRapidas = [
  {
    id: "escapada-urbana",
    titulo: "Escapada urbana",
    descripcion:
      "Ciudades cómodas, imprescindibles bien elegidos y un ritmo realista.",
    prompt:
      "Quiero una escapada urbana bien organizada, con imprescindibles y buena gastronomía.",
  },
  {
    id: "viaje-cultural",
    titulo: "Viaje cultural",
    descripcion:
      "Patrimonio, museos y monumentos con un orden que tenga sentido.",
    prompt:
      "Quiero un viaje cultural centrado en patrimonio, monumentos y visitas bien distribuidas.",
  },
  {
    id: "naturaleza-relax",
    titulo: "Naturaleza y relax",
    descripcion:
      "Paisajes, paradas bonitas y un ritmo más relajado y disfrutable.",
    prompt:
      "Quiero un viaje de naturaleza y relax con paisajes y un ritmo tranquilo.",
  },
];

const pasosResumen = [
  "Destino",
  "Días disponibles",
  "Presupuesto",
  "Estilo del viaje",
];

function IconoSpark() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3L13.8 8.2L19 10L13.8 11.8L12 17L10.2 11.8L5 10L10.2 8.2L12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconoRuta() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
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

export default function InicioItinerarioPantalla() {
  const navigate = useNavigate();

  const irAChat = (mensaje?: string) => {
    navigate("/chat/destino", {
      state: mensaje ? { mensajeInicial: mensaje } : undefined,
    });
  };

  return (
    <div className="min-h-full bg-[#f4f6fb] text-[#111827]">
      <div className="mx-auto w-full max-w-[430px] pb-28">
        <section className="px-5 pt-5">
          <div className="overflow-hidden rounded-[32px] bg-white shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
            <div className="relative h-[250px] overflow-hidden">
              <img
                src={HeroInicio}
                alt="Asistente de viaje SpainWay"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

              <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-[#ff5a36] backdrop-blur">
                Asistente inteligente
              </div>

              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-2 text-xs font-medium backdrop-blur">
                  <IconoSpark />
                  Planificación simplificada
                </div>

                <h1 className="text-[32px] font-extrabold leading-[1.02] tracking-[-0.04em]">
                  Diseña tu viaje ideal
                </h1>

                <p className="mt-3 max-w-[300px] text-sm leading-6 text-white/85">
                  Solo te pediré 4 cosas clave y te prepararé una propuesta inicial útil y guardable.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-5">
              {pasosResumen.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-[#f8fafc] p-3"
                >
                  <p className="text-xs text-[#94a3b8]">Paso</p>
                  <p className="mt-1 text-sm font-semibold text-[#0f172a]">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pt-5">
          <div className="rounded-[28px] bg-gradient-to-br from-[#fff8f4] via-[#ffffff] to-[#f6f2ff] p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
            <h2 className="text-[18px] font-bold tracking-[-0.02em]">
              Qué hace ahora mismo
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#667085]">
              El asistente ya puede guardar tu conversación, construir un briefing y generar una propuesta inicial de itinerario sin depender todavía del modelo IA final.
            </p>

            <button
              type="button"
              onClick={() => irAChat()}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ff5a36] px-4 py-4 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(255,90,54,0.28)]"
            >
              <IconoRuta />
              Empezar planificación
            </button>
          </div>
        </section>

        <section className="px-5 pt-5">
          <div className="mb-3">
            <h2 className="text-[18px] font-bold tracking-[-0.02em]">
              Empieza con una idea
            </h2>
            <p className="text-sm text-[#6b7280]">
              Accesos rápidos para abrir el chat con intención clara.
            </p>
          </div>

          <div className="space-y-4">
            {sugerenciasRapidas.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => irAChat(item.prompt)}
                className="w-full rounded-[28px] bg-white p-5 text-left shadow-[0_14px_30px_rgba(15,23,42,0.08)] transition hover:translate-y-[-1px]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[17px] font-bold text-[#111827]">
                      {item.titulo}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#667085]">
                      {item.descripcion}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#fff4ef] p-3 text-[#ff5a36]">
                    <IconoSpark />
                  </div>
                </div>

                <div className="mt-4 inline-flex rounded-full bg-[#f8fafc] px-4 py-2 text-sm font-medium text-[#334155]">
                  Usar como punto de partida
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="px-5 pt-5">
          <div className="rounded-[28px] bg-[#111827] p-5 text-white shadow-[0_16px_34px_rgba(17,24,39,0.18)]">
            <p className="text-xs uppercase tracking-[0.18em] text-white/50">
              Recomendación
            </p>
            <h2 className="mt-2 text-[22px] font-bold tracking-[-0.03em]">
              Cuanto más concreto seas, mejor será el itinerario
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/74">
              Indica si priorizas monumentos, comida, relax, playa, escapadas cortas o días intensos. Eso le da mucha más calidad a la propuesta.
            </p>

            <button
              type="button"
              onClick={() => irAChat()}
              className="mt-5 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[#111827]"
            >
              Hablar con el asistente
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}