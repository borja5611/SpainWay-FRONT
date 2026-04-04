import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RoseAvatar from "../../../assets/chat/RoseAvatar.png";

type RolMensaje = "asistente" | "usuario";

interface MensajeChat {
  id: string;
  rol: RolMensaje;
  texto: string;
  destacado?: boolean;
}

type PasoChat = "destino" | "dias" | "presupuesto" | "estilo" | "cierre";

interface EstadoBrief {
  destino: string;
  dias: string;
  presupuesto: string;
  estilo: string;
}

const opcionesDestino = [
  "Madrid",
  "Barcelona",
  "Valencia",
  "Andalucía",
  "Canarias",
  "Cantabria",
];

const opcionesDias = ["2-3 días", "4-5 días", "6-7 días", "Más de una semana"];
const opcionesPresupuesto = ["Bajo", "Medio", "Alto", "Flexible"];
const opcionesEstilo = [
  "Cultural",
  "Relax",
  "Gastronómico",
  "Naturaleza",
  "Equilibrado",
];

function generarId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizarTexto(valor: string) {
  return valor.trim().toLowerCase();
}

function inferirDestino(texto: string) {
  const limpio = normalizarTexto(texto);

  const coincidencia = opcionesDestino.find((destino) =>
    limpio.includes(destino.toLowerCase())
  );

  return coincidencia || texto.trim();
}

function inferirDias(texto: string) {
  const limpio = normalizarTexto(texto);

  if (limpio.includes("2") || limpio.includes("3")) return "2-3 días";
  if (limpio.includes("4") || limpio.includes("5")) return "4-5 días";
  if (limpio.includes("6") || limpio.includes("7")) return "6-7 días";
  if (limioContieneSemana(limpio)) return "Más de una semana";

  return texto.trim();
}

function limioContieneSemana(texto: string) {
  return (
    texto.includes("semana") ||
    texto.includes("10") ||
    texto.includes("12") ||
    texto.includes("14")
  );
}

function inferirPresupuesto(texto: string) {
  const limpio = normalizarTexto(texto);

  if (limpio.includes("bajo")) return "Bajo";
  if (limpio.includes("medio")) return "Medio";
  if (limpio.includes("alto")) return "Alto";
  if (limpio.includes("flex")) return "Flexible";

  return texto.trim();
}

function inferirEstilo(texto: string) {
  const limpio = normalizarTexto(texto);

  if (limpio.includes("cultur")) return "Cultural";
  if (limpio.includes("relax") || limpio.includes("tranquil")) return "Relax";
  if (limpio.includes("gastr")) return "Gastronómico";
  if (limpio.includes("natur")) return "Naturaleza";
  if (limpio.includes("equilibr")) return "Equilibrado";

  return texto.trim();
}

function siguientePasoSegunBrief(brief: EstadoBrief): PasoChat {
  if (!brief.destino) return "destino";
  if (!brief.dias) return "dias";
  if (!brief.presupuesto) return "presupuesto";
  if (!brief.estilo) return "estilo";
  return "cierre";
}

function preguntaDePaso(paso: PasoChat, brief: EstadoBrief) {
  switch (paso) {
    case "destino":
      return "Antes de empezar, dime a qué destino te gustaría viajar o qué zona te apetece descubrir.";
    case "dias":
      return `Perfecto. Ya tomo como base ${brief.destino}. Ahora necesito saber cuántos días quieres dedicarle al viaje.`;
    case "presupuesto":
      return `Genial. Para ajustar mejor el plan de ${brief.dias.toLowerCase()}, ¿qué presupuesto quieres manejar?`;
    case "estilo":
      return "Ya casi lo tengo. ¿Qué estilo de viaje quieres priorizar para que la propuesta encaje mejor contigo?";
    case "cierre":
      return `Perfecto. Ya tengo una base bastante sólida: destino ${brief.destino}, duración ${brief.dias}, presupuesto ${brief.presupuesto} y enfoque ${brief.estilo}. Cuando quieras, seguimos con el briefing detallado.`;
    default:
      return "";
  }
}

function descripcionPaso(paso: PasoChat) {
  switch (paso) {
    case "destino":
      return "Definiendo destino";
    case "dias":
      return "Ajustando duración";
    case "presupuesto":
      return "Ajustando presupuesto";
    case "estilo":
      return "Definiendo estilo";
    case "cierre":
      return "Brief listo";
    default:
      return "";
  }
}

function progresoPaso(paso: PasoChat) {
  switch (paso) {
    case "destino":
      return 20;
    case "dias":
      return 45;
    case "presupuesto":
      return 70;
    case "estilo":
      return 88;
    case "cierre":
      return 100;
    default:
      return 0;
  }
}

function obtenerOpcionesPaso(paso: PasoChat) {
  switch (paso) {
    case "destino":
      return opcionesDestino;
    case "dias":
      return opcionesDias;
    case "presupuesto":
      return opcionesPresupuesto;
    case "estilo":
      return opcionesEstilo;
    case "cierre":
      return [];
    default:
      return [];
  }
}

function IconoBrillo() {
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

function IconoEnviar() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.4 20.4L21 12L3.4 3.6L3.3 10.1L15 12L3.3 13.9L3.4 20.4Z" />
    </svg>
  );
}

function IconoEditar() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 20H8L18.5 9.5C19.3284 8.67157 19.3284 7.32843 18.5 6.5V6.5C17.6716 5.67157 16.3284 5.67157 15.5 6.5L5 17V20H4Z"
        stroke="currentColor"
        strokeWidth="1.8"
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

export default function ChatPantalla() {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const state = (location.state ?? {}) as {
    mensajeInicial?: string;
    estiloInicial?: string;
  };

  const [input, setInput] = useState("");
  const [cargandoRespuesta, setCargandoRespuesta] = useState(false);

  const [brief, setBrief] = useState<EstadoBrief>({
    destino: "",
    dias: "",
    presupuesto: "",
    estilo: state.estiloInicial || "",
  });

  const [mensajes, setMensajes] = useState<MensajeChat[]>([
    {
      id: generarId(),
      rol: "asistente",
      texto:
        "Hola, soy Rose. Voy a ayudarte a preparar un viaje mucho más afinado, visual y coherente con lo que realmente buscas.",
      destacado: true,
    },
    {
      id: generarId(),
      rol: "asistente",
      texto:
        state.mensajeInicial && state.mensajeInicial.trim().length > 0
          ? `He tomado como punto de partida esta idea: “${state.mensajeInicial}”. Vamos a convertirla en un briefing claro para construir una propuesta mejor.`
          : "Antes de empezar, quiero construir contigo una base sólida para que el itinerario esté realmente bien planteado.",
    },
  ]);

  const pasoActual = useMemo(() => siguientePasoSegunBrief(brief), [brief]);
  const opcionesPaso = useMemo(() => obtenerOpcionesPaso(pasoActual), [pasoActual]);
  const progreso = progresoPaso(pasoActual);

  useEffect(() => {
    if (state.mensajeInicial && !brief.destino) {
      const posibleDestino = inferirDestino(state.mensajeInicial);
      if (posibleDestino && posibleDestino !== state.mensajeInicial.trim()) {
        setBrief((prev) => ({
          ...prev,
          destino: posibleDestino,
        }));
      }
    }
  }, [state.mensajeInicial, brief.destino]);

  useEffect(() => {
    const paso = siguientePasoSegunBrief(brief);

    const ultimoMensaje = mensajes[mensajes.length - 1];
    const preguntaEsperada = preguntaDePaso(paso, brief);

    if (!ultimoMensaje || ultimoMensaje.rol !== "asistente" || ultimoMensaje.texto !== preguntaEsperada) {
      setMensajes((prev) => [
        ...prev,
        {
          id: generarId(),
          rol: "asistente",
          texto: preguntaEsperada,
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brief]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mensajes, cargandoRespuesta]);

  function registrarRespuestaUsuario(texto: string) {
    const limpio = texto.trim();
    if (!limpio) return;

    setMensajes((prev) => [
      ...prev,
      {
        id: generarId(),
        rol: "usuario",
        texto: limpio,
      },
    ]);

    setInput("");
    setCargandoRespuesta(true);

    window.setTimeout(() => {
      setBrief((prev) => {
        const nuevo = { ...prev };

        switch (siguientePasoSegunBrief(prev)) {
          case "destino":
            nuevo.destino = inferirDestino(limpio);
            break;
          case "dias":
            nuevo.dias = inferirDias(limpio);
            break;
          case "presupuesto":
            nuevo.presupuesto = inferirPresupuesto(limpio);
            break;
          case "estilo":
            nuevo.estilo = inferirEstilo(limpio);
            break;
          case "cierre":
            break;
        }

        return nuevo;
      });

      setCargandoRespuesta(false);
    }, 550);
  }

  function manejarEnviar() {
    registrarRespuestaUsuario(input);
  }

  function avanzarAlBriefing() {
    navigate("/chat/preferencias", {
      state: {
        destino: brief.destino,
        dias: brief.dias,
        presupuesto: brief.presupuesto,
        estilo: brief.estilo,
      },
    });
  }

  const briefingListo =
    Boolean(brief.destino) &&
    Boolean(brief.dias) &&
    Boolean(brief.presupuesto) &&
    Boolean(brief.estilo);

  return (
    <div className="min-h-full bg-[#eef2f8] text-[#0f172a]">
      <div className="mx-auto flex w-full max-w-[430px] flex-col pb-28">
        <section className="px-5 pt-5">
          <div className="overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#111827_0%,#1f2937_55%,#25324a_100%)] shadow-[0_20px_45px_rgba(15,23,42,0.18)]">
            <div className="relative px-5 pb-5 pt-5">
              <div className="absolute right-[-20px] top-[-10px] h-28 w-28 rounded-full bg-[#ff6a47]/15 blur-3xl" />
              <div className="absolute left-[-10px] bottom-[-20px] h-24 w-24 rounded-full bg-[#7c3aed]/12 blur-3xl" />

              <div className="relative flex items-start gap-3">
                <img
                  src={RoseAvatar}
                  alt="Rose"
                  className="h-14 w-14 rounded-2xl border border-white/15 object-cover shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-[22px] font-bold tracking-[-0.03em] text-white">
                      Rose
                    </h2>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/80 backdrop-blur">
                      <IconoBrillo />
                      Asistente IA
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-white/72">
                    Vamos a construir un briefing mucho más sólido para preparar un viaje que realmente tenga sentido contigo.
                  </p>
                </div>
              </div>

              <div className="relative mt-5 rounded-[26px] border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-white/48">
                      Estado actual
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {descripcionPaso(pasoActual)}
                    </p>
                  </div>

                  <div className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white/82">
                    {progreso}%
                  </div>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[#ff6a47]"
                    style={{ width: `${progreso}%` }}
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/8 p-3">
                    <p className="text-xs text-white/45">Destino</p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {brief.destino || "Pendiente"}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/8 p-3">
                    <p className="text-xs text-white/45">Duración</p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {brief.dias || "Pendiente"}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/8 p-3">
                    <p className="text-xs text-white/45">Presupuesto</p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {brief.presupuesto || "Pendiente"}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/8 p-3">
                    <p className="text-xs text-white/45">Estilo</p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {brief.estilo || "Pendiente"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 pt-5">
          <div className="rounded-[32px] bg-white p-4 shadow-[0_16px_38px_rgba(15,23,42,0.08)]">
            <div
              ref={scrollRef}
              className="max-h-[430px] space-y-4 overflow-y-auto pr-1"
            >
              {mensajes.map((mensaje) => (
                <div
                  key={mensaje.id}
                  className={`flex ${
                    mensaje.rol === "usuario" ? "justify-end" : "justify-start"
                  }`}
                >
                  {mensaje.rol === "asistente" ? (
                    <div className="flex max-w-[88%] items-start gap-3">
                      <img
                        src={RoseAvatar}
                        alt="Rose"
                        className="mt-1 h-10 w-10 rounded-2xl object-cover shadow-[0_8px_20px_rgba(15,23,42,0.10)]"
                      />

                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-sm font-bold text-[#111827]">
                            Rose
                          </span>
                          {mensaje.destacado && (
                            <span className="rounded-full bg-[#fff4ef] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#ff6a47]">
                              Inicio
                            </span>
                          )}
                        </div>

                        <div className="rounded-[24px] rounded-tl-[10px] bg-[#f6f8fc] px-4 py-3 text-sm leading-7 text-[#334155] shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
                          {mensaje.texto}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="max-w-[84%]">
                      <div className="mb-1 flex items-center justify-end gap-2">
                        <span className="rounded-full bg-[#111827] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/90">
                          Tú
                        </span>
                      </div>
                      <div className="rounded-[24px] rounded-tr-[10px] bg-[#ff6a47] px-4 py-3 text-sm leading-7 text-white shadow-[0_10px_24px_rgba(255,106,71,0.22)]">
                        {mensaje.texto}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {cargandoRespuesta && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-3">
                    <img
                      src={RoseAvatar}
                      alt="Rose"
                      className="mt-1 h-10 w-10 rounded-2xl object-cover shadow-[0_8px_20px_rgba(15,23,42,0.10)]"
                    />
                    <div className="rounded-[24px] rounded-tl-[10px] bg-[#f6f8fc] px-4 py-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#cbd5e1]" />
                        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#cbd5e1] [animation-delay:120ms]" />
                        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#cbd5e1] [animation-delay:240ms]" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {opcionesPaso.length > 0 && (
              <div className="mt-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#111827]">
                  <IconoEditar />
                  Respuestas rápidas
                </div>

                <div className="flex flex-wrap gap-2">
                  {opcionesPaso.map((opcion) => (
                    <button
                      key={opcion}
                      type="button"
                      onClick={() => registrarRespuestaUsuario(opcion)}
                      className="rounded-full border border-[#e7ecf3] bg-[#f8fafc] px-4 py-2 text-sm font-medium text-[#334155] transition hover:bg-white hover:shadow-[0_8px_16px_rgba(15,23,42,0.05)]"
                    >
                      {opcion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 rounded-[26px] border border-[#e7ecf3] bg-[#f8fafc] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
              <div className="flex items-end gap-3">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe aquí tu respuesta o describe directamente el viaje que buscas..."
                  className="min-h-[56px] flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-6 text-[#111827] outline-none placeholder:text-[#98a2b3]"
                />

                <button
                  type="button"
                  onClick={manejarEnviar}
                  disabled={!input.trim()}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111827] text-white shadow-[0_10px_22px_rgba(17,24,39,0.16)] transition disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Enviar mensaje"
                >
                  <IconoEnviar />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 pt-5">
          <div className="rounded-[30px] bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.07)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[#98a2b3]">
                  Brief de viaje
                </p>
                <h2 className="mt-2 text-[20px] font-bold tracking-[-0.02em] text-[#111827]">
                  Resumen de lo que ya tenemos
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#667085]">
                  Cuando este bloque esté completo, podemos pasar al siguiente tramo del flujo para afinar preferencias y construir el itinerario.
                </p>
              </div>

              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                  briefingListo
                    ? "bg-[#ecfdf3] text-[#059669]"
                    : "bg-[#f3f4f6] text-[#94a3b8]"
                }`}
              >
                {briefingListo ? <IconoCheck /> : <IconoRuta />}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[#f8fafc] p-4">
                <p className="text-xs text-[#94a3b8]">Destino</p>
                <p className="mt-1 text-sm font-semibold text-[#0f172a]">
                  {brief.destino || "Aún no definido"}
                </p>
              </div>

              <div className="rounded-2xl bg-[#f8fafc] p-4">
                <p className="text-xs text-[#94a3b8]">Duración</p>
                <p className="mt-1 text-sm font-semibold text-[#0f172a]">
                  {brief.dias || "Aún no definida"}
                </p>
              </div>

              <div className="rounded-2xl bg-[#f8fafc] p-4">
                <p className="text-xs text-[#94a3b8]">Presupuesto</p>
                <p className="mt-1 text-sm font-semibold text-[#0f172a]">
                  {brief.presupuesto || "Aún no definido"}
                </p>
              </div>

              <div className="rounded-2xl bg-[#f8fafc] p-4">
                <p className="text-xs text-[#94a3b8]">Estilo</p>
                <p className="mt-1 text-sm font-semibold text-[#0f172a]">
                  {brief.estilo || "Aún no definido"}
                </p>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => navigate("/chat")}
                className="flex-1 rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-semibold text-[#111827]"
              >
                Volver
              </button>

              <button
                type="button"
                onClick={avanzarAlBriefing}
                disabled={!briefingListo}
                className="flex-1 rounded-2xl bg-[#ff6a47] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(255,106,71,0.24)] transition disabled:cursor-not-allowed disabled:opacity-45"
              >
                Continuar briefing
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}