import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getConversacionDetalle,
  procesarMensajeChat,
  type Conversacion,
  type Mensaje,
} from "@/app/servicios/conversacion";

function normalizarTexto(value?: string | null): string {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

function getDestinoDesdeConversacion(conversacion?: Conversacion | null): string {
  const titulo = conversacion?.titulo ?? "";
  const key = normalizarTexto(titulo);

  if (key.includes("madrid")) return "Madrid";
  if (key.includes("baleares") || key.includes("mallorca")) return "Baleares";
  if (key.includes("canarias")) return "Canarias";
  if (key.includes("valencia") || key.includes("valenciana")) return "Valencia";
  if (key.includes("andalucia")) return "Andalucía";
  if (key.includes("asturias")) return "Asturias";
  if (key.includes("cantabria")) return "Cantabria";
  if (key.includes("cataluna") || key.includes("cataluña") || key.includes("barcelona")) return "Cataluña";

  return "este destino";
}

function getSugerenciasChat(conversacion?: Conversacion | null): string[] {
  const destino = getDestinoDesdeConversacion(conversacion);
  const key = normalizarTexto(destino);
  const tieneCosta = ["baleares", "canarias", "valencia", "andalucia", "cataluna", "cantabria", "asturias"].some((item) => key.includes(item));

  return [
    "Añade 3 POIs destacados al día 3",
    "Quita el POI que menos encaje del día 1",
    tieneCosta ? "Añade una playa o cala al día 2" : "Añade un parque o mirador al día 2",
    `Cambia un POI del día 2 por otro mejor de ${destino}`,
    "Regenera el día 3 con un enfoque más gastronómico",
  ];
}

function formatHora(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

function esMensajeTecnicoInicial(mensaje: Mensaje): boolean {
  const contenido = (mensaje.contenido ?? "").toLowerCase();

  return (
    mensaje.rol === "user" &&
    contenido.includes("quiero generar un itinerario") &&
    contenido.includes("presupuesto") &&
    contenido.includes("transporte")
  );
}

function esRespuestaTecnicaLarga(mensaje: Mensaje): boolean {
  const contenido = mensaje.contenido ?? "";
  return (
    mensaje.rol === "assistant" &&
    contenido.length > 1200 &&
    (contenido.includes("Día 1") || contenido.includes("Dia 1")) &&
    (contenido.includes("Parada") || contenido.includes("POI") || contenido.includes("Consejo"))
  );
}

function limpiarMensajes(mensajes: Mensaje[]): Mensaje[] {
  return mensajes.filter((mensaje) => !esMensajeTecnicoInicial(mensaje) && !esRespuestaTecnicaLarga(mensaje));
}

export default function ChatDetallePantalla() {
  const navigate = useNavigate();
  const { idConversacion } = useParams();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const id = useMemo(() => Number(idConversacion), [idConversacion]);

  const [conversacion, setConversacion] = useState<Conversacion | null>(null);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const idItinerarioRelacionado = conversacion?.id_itinerario_relacionado ?? conversacion?.id_itinerario ?? null;

  useEffect(() => {
    async function cargar() {
      if (!Number.isInteger(id)) {
        setError("Conversación inválida.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getConversacionDetalle(id);
        setConversacion(data);
        setMensajes(limpiarMensajes(Array.isArray(data.mensajes) ? data.mensajes : []));
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar esta conversación.");
      } finally {
        setLoading(false);
      }
    }

    void cargar();
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes.length, sending]);

  async function enviarMensaje(textoForzado?: string) {
    const texto = (textoForzado ?? input).trim();
    if (!texto || sending || !Number.isInteger(id)) return;

    try {
      setSending(true);
      setError(null);
      setInput("");

      const result = await procesarMensajeChat(id, { contenido: texto });
      setMensajes((prev) => limpiarMensajes([...prev, result.user, result.assistant]));
    } catch (err) {
      console.error(err);
      setError("No se pudo procesar el mensaje. Revisa que el backend esté arrancado y que la ruta /api/chat-acciones esté registrada.");
      setInput(texto);
    } finally {
      setSending(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void enviarMensaje();
  }

  function abrirDetalleItinerario() {
    if (!idItinerarioRelacionado) return;
    navigate(`/itinerarios/${idItinerarioRelacionado}?refresh=${Date.now()}`);
  }

  const titulo = conversacion?.titulo || "Chat SpainWay";
  const sugerencias = useMemo(() => getSugerenciasChat(conversacion), [conversacion]);

  return (
    <div className="min-h-full bg-[#f3f5f9] text-[#111827]">
      <div className="mx-auto flex min-h-[calc(100vh-86px)] w-full max-w-[920px] flex-col px-4 pb-24 pt-4">
        <header className="rounded-[30px] bg-white px-4 py-4 shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/chat")}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f8fafc] text-lg font-black text-[#111827] transition hover:bg-[#eef2f7]"
            >
              ←
            </button>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff4ef] text-sm font-black text-[#ff5a36]">
              SW
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">
                SpainWay Assistant
              </p>
              <h1 className="truncate text-lg font-black text-[#0f172a]">{titulo}</h1>
            </div>
            {idItinerarioRelacionado && (
              <button
                type="button"
                onClick={abrirDetalleItinerario}
                className="hidden rounded-2xl bg-[#ff5a36] px-4 py-3 text-xs font-black text-white shadow-[0_10px_24px_rgba(255,90,54,0.24)] sm:block"
              >
                Ver itinerario
              </button>
            )}
          </div>
        </header>

        {error && (
          <div className="mt-4 rounded-[20px] bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        <main className="mt-4 flex min-h-[620px] flex-1 flex-col overflow-hidden rounded-[34px] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
          <section className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-[#f8fafc] p-5">
            {loading ? (
              <div className="rounded-[24px] bg-white p-4 text-sm font-semibold text-[#667085] shadow-sm">
                Cargando conversación...
              </div>
            ) : mensajes.length === 0 ? (
              <div className="rounded-[28px] bg-white p-5 shadow-sm">
                <p className="text-lg font-black text-[#111827]">Empieza la conversación</p>
                <p className="mt-2 text-sm leading-6 text-[#667085]">
                  Puedes pedir cambios directos sobre el itinerario. Si se puede aplicar, se guarda en base de datos y el detalle se actualiza al instante.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {sugerencias.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => void enviarMensaje(item)}
                      className="rounded-full bg-[#fff4ef] px-4 py-2 text-xs font-bold text-[#ff5a36] transition hover:bg-[#ffe7dc]"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {mensajes.map((mensaje, index) => {
                  const esUsuario = mensaje.rol === "user" || mensaje.rol === "usuario";
                  const esUltimoMensaje = index === mensajes.length - 1;

                  return (
                    <div
                      key={mensaje.id_mensaje}
                      className={`flex ${esUsuario ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[92%] rounded-[28px] px-5 py-4 text-[14px] leading-7 shadow-sm md:max-w-[78%] ${
                          esUsuario
                            ? "rounded-br-md bg-[#ff5a36] text-white"
                            : "rounded-bl-md bg-white text-[#344054]"
                        }`}
                      >
                        <div className="whitespace-pre-wrap break-words">{mensaje.contenido}</div>

                        {!esUsuario && idItinerarioRelacionado && esUltimoMensaje && (
                          <button
                            type="button"
                            onClick={abrirDetalleItinerario}
                            className="mt-4 w-full rounded-2xl bg-[#111827] px-4 py-3 text-sm font-black text-white transition hover:bg-[#0b1220]"
                          >
                            Ver detalle del itinerario →
                          </button>
                        )}

                        <p
                          className={`mt-2 text-right text-[10px] font-bold ${
                            esUsuario ? "text-white/75" : "text-[#98a2b3]"
                          }`}
                        >
                          {formatHora(mensaje.creado)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {sending && (
              <div className="mt-4 flex justify-start">
                <div className="rounded-[24px] rounded-bl-md bg-white px-4 py-3 text-sm font-semibold text-[#667085] shadow-sm">
                  SpainWay está comprobando y guardando el cambio...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </section>

          {idItinerarioRelacionado && (
            <div className="border-t border-[#eef2f7] bg-white px-4 py-3">
              <button
                type="button"
                onClick={abrirDetalleItinerario}
                className="w-full rounded-2xl bg-[#111827] px-5 py-4 text-sm font-black text-white shadow-[0_12px_28px_rgba(17,24,39,0.16)]"
              >
                Ver detalle del itinerario →
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="border-t border-[#eef2f7] bg-white p-4">
            <div className="flex items-end gap-3">
              <textarea
                rows={1}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void enviarMensaje();
                  }
                }}
                placeholder="Ej. añade 3 POIs al día 3, quita Plaza Mayor del día 2..."
                className="max-h-32 min-h-[48px] flex-1 resize-none rounded-[20px] border border-[#d9dee8] bg-[#fcfcfd] px-4 py-3 text-sm outline-none placeholder:text-[#98a2b3]"
              />
              <button
                type="submit"
                disabled={!input.trim() || sending}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-[#ff5a36] text-lg font-black text-white shadow-[0_10px_24px_rgba(255,90,54,0.28)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                ↑
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
