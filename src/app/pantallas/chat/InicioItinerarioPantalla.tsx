import { useNavigate } from "react-router-dom";
import HeroInicio from "../../../assets/chat/InicioItinerarioHero.png";

const sugerenciasRapidas = [
  {
    id: "escapada-urbana",
    titulo: "Escapada urbana",
    descripcion:
      "Ciudades con ritmo cómodo, iconos imprescindibles y buena organización por zonas.",
    prompt:
      "Quiero una escapada urbana bien organizada, con imprescindibles, buena gastronomía y rutas cómodas por zonas.",
  },
  {
    id: "viaje-cultural",
    titulo: "Viaje cultural",
    descripcion:
      "Museos, patrimonio, monumentos y contexto real para entender mejor cada destino.",
    prompt:
      "Quiero un viaje cultural centrado en patrimonio, monumentos y visitas bien distribuidas.",
  },
  {
    id: "naturaleza-relax",
    titulo: "Naturaleza y relax",
    descripcion:
      "Paisajes, miradores, costa o interior con un ritmo más relajado y disfrutable.",
    prompt:
      "Quiero un viaje de naturaleza y relax con paisajes, paradas bonitas y un ritmo tranquilo.",
  },
  {
    id: "gastronomico",
    titulo: "Ruta gastronómica",
    descripcion:
      "Propuestas donde comer bien forme parte real del viaje y no un añadido genérico.",
    prompt:
      "Quiero un viaje donde la gastronomía sea importante, con zonas buenas para comer y experiencias locales.",
  },
];

const preguntasBase = [
  "¿A qué destino te gustaría viajar?",
  "¿Cuántos días tienes disponibles?",
  "¿Qué presupuesto aproximado manejas?",
  "¿Quieres un viaje relajado, equilibrado o intenso?",
  "¿Qué te interesa más: cultura, naturaleza, gastronomía, playa o una mezcla?",
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

function IconoChat() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path
        d="M8 10H16M8 14H13M7 19L4 20V6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V16C20 17.1046 19.1046 18 18 18H8.41421L7 19Z"
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
            <div className="relative h-[290px] overflow-hidden">
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
                  Planificación personalizada
                </div>

                <h1 className="text-[34px] font-extrabold leading-[1.02] tracking-[-0.04em]">
                  Diseña tu viaje ideal
                </h1>

                <p className="mt-3 max-w-[290px] text-sm leading-6 text-white/85">
                  Responde unas pocas preguntas y deja que SpainWay construya una
                  propuesta mucho más útil, realista y adaptada a tu estilo.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 p-5">
              <div className="rounded-2xl bg-[#f8fafc] p-3">
                <p className="text-xs text-[#94a3b8]">Ritmo</p>
                <p className="mt-1 text-sm font-semibold text-[#0f172a]">
                  Personalizado
                </p>
              </div>
              <div className="rounded-2xl bg-[#f8fafc] p-3">
                <p className="text-xs text-[#94a3b8]">Plan</p>
                <p className="mt-1 text-sm font-semibold text-[#0f172a]">
                  Por días
                </p>
              </div>
              <div className="rounded-2xl bg-[#f8fafc] p-3">
                <p className="text-xs text-[#94a3b8]">Enfoque</p>
                <p className="mt-1 text-sm font-semibold text-[#0f172a]">
                  A medida
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 pt-5">
          <div className="rounded-[28px] bg-gradient-to-br from-[#fff8f4] via-[#ffffff] to-[#f6f2ff] p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#ff5a36] shadow-[0_8px_20px_rgba(15,23,42,0.08)]">
                <IconoChat />
              </div>

              <div>
                <h2 className="text-[18px] font-bold tracking-[-0.02em]">
                  Cómo trabaja el asistente
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#667085]">
                  Primero entiende tu destino, tus días, tu presupuesto y el tipo
                  de viaje que buscas. Después genera una propuesta mucho mejor
                  estructurada para continuar afinándola contigo.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {preguntasBase.map((pregunta, index) => (
                <div
                  key={pregunta}
                  className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_8px_18px_rgba(15,23,42,0.04)]"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#fff4ef] text-xs font-bold text-[#ff5a36]">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-[#334155]">{pregunta}</p>
                </div>
              ))}
            </div>

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
              Accesos rápidos para lanzar una conversación con intención clara.
            </p>
          </div>

          <div className="space-y-4">
            {sugerenciasRapidas.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => irAChat(item.prompt)}
                className="w-full rounded-[26px] bg-white p-5 text-left shadow-[0_12px_30px_rgba(15,23,42,0.07)] transition hover:translate-y-[-1px]"
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

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff4ef] text-[#ff5a36]">
                    <IconoSpark />
                  </div>
                </div>

                <div className="mt-4 inline-flex rounded-full bg-[#f8fafc] px-3 py-2 text-xs font-medium text-[#475467]">
                  Usar como punto de partida
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="px-5 pt-5">
          <div className="rounded-[28px] bg-[#111827] p-5 text-white shadow-[0_16px_34px_rgba(17,24,39,0.18)]">
            <p className="text-xs uppercase tracking-[0.18em] text-white/55">
              Recomendación
            </p>
            <h2 className="mt-2 text-[20px] font-bold tracking-[-0.02em]">
              Cuanto más concreto seas, mejor será el itinerario
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/75">
              Indica si priorizas monumentos, comida, relax, playa, escapadas
              cortas o días intensos. Eso le da mucha más calidad a la propuesta.
            </p>

            <button
              type="button"
              onClick={() => irAChat("Quiero que me ayudes a crear un viaje totalmente a medida.")}
              className="mt-5 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#111827]"
            >
              Hablar con el asistente
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}