import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/app/store/useAuthStore";
import { crearConversacion, crearMensaje } from "@/app/servicios/conversacion";
import { crearItinerario } from "@/app/servicios/itinerarios";

type PasoClave = "destino" | "dias" | "presupuesto" | "estilo";

type MensajeUI = {
  id: string;
  rol: "asistente" | "usuario";
  texto: string;
};

type BriefingViaje = {
  destino: string;
  dias: number | null;
  presupuesto: string;
  estilo: string;
};

const PASOS: Array<{
  clave: PasoClave;
  titulo: string;
  pregunta: string;
  placeholder: string;
  sugerencias: string[];
}> = [
  {
    clave: "destino",
    titulo: "Destino",
    pregunta: "¿Qué destino o zona te gustaría visitar?",
    placeholder: "Ejemplo: Andalucía, Madrid, Valencia...",
    sugerencias: ["Andalucía", "Madrid", "Barcelona", "Valencia", "Bilbao"],
  },
  {
    clave: "dias",
    titulo: "Duración",
    pregunta: "¿Cuántos días tienes disponibles?",
    placeholder: "Ejemplo: 3, 5 o 7",
    sugerencias: ["2", "3", "5", "7"],
  },
  {
    clave: "presupuesto",
    titulo: "Presupuesto",
    pregunta: "¿Qué presupuesto manejas?",
    placeholder: "Ejemplo: bajo, medio o alto",
    sugerencias: ["bajo", "medio", "alto"],
  },
  {
    clave: "estilo",
    titulo: "Estilo",
    pregunta: "¿Qué estilo de viaje te gustaría priorizar?",
    placeholder: "Ejemplo: cultural, relax, gastronomía...",
    sugerencias: ["cultural", "relax", "gastronomía", "naturaleza", "mixto"],
  },
];

function generarId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function detectarPresupuestoNumero(presupuesto: string): number {
  const valor = presupuesto.toLowerCase();
  if (valor.includes("bajo")) return 1;
  if (valor.includes("medio")) return 2;
  if (valor.includes("alto")) return 3;
  return 2;
}

function detectarTransporte(destino: string, dias: number | null): string {
  const texto = destino.toLowerCase();

  if (
    texto.includes("madrid") ||
    texto.includes("barcelona") ||
    texto.includes("sevilla") ||
    texto.includes("valencia") ||
    texto.includes("bilbao")
  ) {
    return "tren";
  }

  if (dias !== null && dias <= 3) return "tren";

  return "coche";
}

function detectarAccesibilidad(estilo: string): string {
  const texto = estilo.toLowerCase();

  if (texto.includes("relax")) return "alta";
  if (texto.includes("cultural")) return "media";
  if (texto.includes("gastronom")) return "media";
  if (texto.includes("naturaleza")) return "media";

  return "media";
}

function construirTitulo(briefing: BriefingViaje) {
  const diasTexto = briefing.dias ? `${briefing.dias} días` : "viaje";
  return `${briefing.destino} · ${diasTexto}`;
}

function construirDescripcion(briefing: BriefingViaje) {
  return `Propuesta inicial para ${briefing.destino}, con un enfoque ${briefing.estilo.toLowerCase()} y un presupuesto ${briefing.presupuesto.toLowerCase()}.`;
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
  const { usuario } = useAuthStore();

  const state = (location.state ?? {}) as {
    mensajeInicial?: string;
  };

  const [input, setInput] = useState("");
  const [mensajes, setMensajes] = useState<MensajeUI[]>([]);
  const [pasoActual, setPasoActual] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [briefing, setBriefing] = useState<BriefingViaje>({
    destino: "",
    dias: null,
    presupuesto: "",
    estilo: "",
  });

  useEffect(() => {
    const primerTexto = state.mensajeInicial
      ? `Partimos de esta idea: "${state.mensajeInicial}". ${PASOS[0].pregunta}`
      : PASOS[0].pregunta;

    setMensajes([
      {
        id: generarId(),
        rol: "asistente",
        texto: primerTexto,
      },
    ]);
  }, [state.mensajeInicial]);

  const paso = PASOS[Math.min(pasoActual, PASOS.length - 1)];

  const progreso = useMemo(() => {
    return Math.round((pasoActual / PASOS.length) * 100);
  }, [pasoActual]);

  function anadirMensaje(rol: "asistente" | "usuario", texto: string) {
    setMensajes((prev) => [
      ...prev,
      {
        id: generarId(),
        rol,
        texto,
      },
    ]);
  }

  function aplicarRespuesta(clave: PasoClave, respuesta: string) {
    const limpio = respuesta.trim();

    if (clave === "destino") {
      setBriefing((prev) => ({ ...prev, destino: limpio }));
      return;
    }

    if (clave === "dias") {
      const numero = Number(limpio);
      setBriefing((prev) => ({
        ...prev,
        dias: Number.isNaN(numero) ? null : numero,
      }));
      return;
    }

    if (clave === "presupuesto") {
      setBriefing((prev) => ({ ...prev, presupuesto: limpio }));
      return;
    }

    if (clave === "estilo") {
      setBriefing((prev) => ({ ...prev, estilo: limpio }));
    }
  }

  async function persistirConversacionYResultado(resumenFinal: string) {
    if (!usuario?.id_usuario) return;

    const conversacion = await crearConversacion({
      id_usuario: usuario.id_usuario,
      titulo: briefing.destino
        ? `Plan para ${briefing.destino}`
        : "Nueva planificación",
    });

    for (const mensaje of mensajes) {
      await crearMensaje({
        id_conversacion: conversacion.id_conversacion,
        rol: mensaje.rol === "asistente" ? "assistant" : "user",
        contenido: mensaje.texto,
      });
    }

    await crearMensaje({
      id_conversacion: conversacion.id_conversacion,
      rol: "assistant",
      contenido: resumenFinal,
    });
  }

  async function finalizarProceso() {
    if (!usuario?.id_usuario) {
      setError("No hay usuario autenticado.");
      return;
    }

    const titulo = construirTitulo(briefing);
    const descripcion = construirDescripcion(briefing);
    const presupuestoNumerico = detectarPresupuestoNumero(briefing.presupuesto);
    const transporte = detectarTransporte(briefing.destino, briefing.dias);
    const accesibilidad = detectarAccesibilidad(briefing.estilo);

    const hoy = new Date();
    const inicio = hoy.toISOString().slice(0, 10);

    const finDate = new Date(hoy);
    finDate.setDate(hoy.getDate() + Math.max((briefing.dias || 3) - 1, 1));
    const fin = finDate.toISOString().slice(0, 10);

    const resumenFinal = `${titulo}. ${descripcion} Transporte sugerido: ${transporte}.`;

    await persistirConversacionYResultado(resumenFinal);

    const itinerario = await crearItinerario({
      id_usuario: usuario.id_usuario,
      titulo,
      destino: briefing.destino,
      inicio,
      fin,
      presupuesto: presupuestoNumerico,
      transporte,
      accesibilidad,
      estado: "borrador",
    });

    navigate(`/itinerarios/${itinerario.id_itinerario}`);
  }

  async function enviarRespuesta(respuestaManual?: string) {
    const respuesta = (respuestaManual ?? input).trim();
    if (!respuesta) return;

    setLoading(true);
    setError("");

    try {
      anadirMensaje("usuario", respuesta);
      aplicarRespuesta(paso.clave, respuesta);
      setInput("");

      const siguiente = pasoActual + 1;

      if (siguiente >= PASOS.length) {
        anadirMensaje(
          "asistente",
          "Perfecto. Ya tengo una base suficiente para generar tu primera propuesta de viaje."
        );

        await finalizarProceso();
        return;
      }

      setPasoActual(siguiente);

      setTimeout(() => {
        anadirMensaje("asistente", PASOS[siguiente].pregunta);
      }, 120);
    } catch (err) {
      console.error(err);
      setError("No se pudo continuar con la planificación.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-full bg-[#f4f6fb] text-[#111827]">
      <div className="mx-auto w-full max-w-[430px] pb-28">
        <section className="px-5 pt-5">
          <div className="rounded-[30px] bg-[#111827] p-5 text-white shadow-[0_16px_34px_rgba(17,24,39,0.18)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/50">
                  Estado actual
                </p>
                <h2 className="mt-2 text-[22px] font-bold">
                  {paso.titulo}
                </h2>
              </div>

              <div className="rounded-full bg-white/10 px-3 py-2 text-sm font-semibold">
                {progreso}%
              </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#ff5a36]"
                style={{ width: `${progreso}%` }}
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <MiniEstado label="Destino" value={briefing.destino || "Pendiente"} />
              <MiniEstado
                label="Duración"
                value={briefing.dias ? `${briefing.dias} días` : "Pendiente"}
              />
              <MiniEstado
                label="Presupuesto"
                value={briefing.presupuesto || "Pendiente"}
              />
              <MiniEstado label="Estilo" value={briefing.estilo || "Pendiente"} />
            </div>
          </div>
        </section>

        <section className="px-5 pt-5">
          <div className="rounded-[28px] bg-white p-5 shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
            <div className="flex items-center gap-2 text-[#ff5a36]">
              <IconoBrillo />
              <p className="text-sm font-semibold">Conversación guiada</p>
            </div>

            <div className="mt-4 space-y-3">
              {mensajes.map((mensaje) => (
                <div
                  key={mensaje.id}
                  className={`max-w-[88%] rounded-[20px] px-4 py-3 text-sm leading-6 ${
                    mensaje.rol === "asistente"
                      ? "bg-[#f5f7fb] text-[#374151]"
                      : "ml-auto bg-[#fff4ef] text-[#111827]"
                  }`}
                >
                  {mensaje.texto}
                </div>
              ))}
            </div>

            <div className="mt-5">
              <p className="mb-2 text-sm font-medium text-[#667085]">
                Respuestas rápidas
              </p>

              <div className="flex flex-wrap gap-2">
                {paso.sugerencias.map((opcion) => (
                  <button
                    key={opcion}
                    type="button"
                    onClick={() => void enviarRespuesta(opcion)}
                    disabled={loading}
                    className="rounded-full bg-[#f8fafc] px-4 py-2 text-sm font-medium text-[#111827]"
                  >
                    {opcion}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={paso.placeholder}
                className="flex-1 h-[54px] rounded-[16px] border border-[#d9dfe8] bg-[#f8fafc] px-4 text-[#111827] outline-none"
              />

              <button
                type="button"
                onClick={() => void enviarRespuesta()}
                disabled={loading}
                className="flex h-[54px] w-[54px] items-center justify-center rounded-[16px] bg-[#ff5a36] text-white shadow-[0_12px_24px_rgba(255,90,54,0.28)] disabled:opacity-60"
              >
                <IconoEnviar />
              </button>
            </div>
          </div>
        </section>

        {error ? (
          <section className="px-5 pt-4">
            <div className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          </section>
        ) : null}

        <section className="px-5 pt-5">
          <div className="rounded-[28px] bg-white p-5 shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
            <div className="flex items-center gap-2 text-[#22c55e]">
              <IconoCheck />
              <p className="text-sm font-semibold">Qué se guarda al terminar</p>
            </div>

            <p className="mt-3 text-sm leading-6 text-[#667085]">
              Al completar estos 4 pasos, SpainWay guardará la conversación y creará un itinerario borrador real para que puedas seguir trabajándolo.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function MiniEstado({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-3">
      <p className="text-[11px] text-white/55">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white break-words">{value}</p>
    </div>
  );
}