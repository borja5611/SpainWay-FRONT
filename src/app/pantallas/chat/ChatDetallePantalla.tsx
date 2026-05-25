import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getConversacionDetalle,
  procesarMensajeChat,
  type Conversacion,
  type Mensaje,
  type PoiRecomendadoChat,
} from "@/app/servicios/conversacion";
import { crearFavorito } from "@/app/servicios/favoritos";
import { obtenerUsuarioGuardado } from "@/app/servicios/auth";

function normalizarTexto(value?: string | null): string {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function getDestinoDesdeConversacion(conversacion?: Conversacion | null): string {
  const titulo = conversacion?.titulo ?? "";
  const limpio = titulo
    .replace(/itinerario/gi, "")
    .replace(/viaje/gi, "")
    .replace(/spainway/gi, "")
    .replace(/nuevo/gi, "")
    .replace(/con/gi, "")
    .replace(/[-–—]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return limpio || "tu destino";
}

function getSugerenciasChat(conversacion?: Conversacion | null): string[] {
  const idItinerario = conversacion?.id_itinerario_relacionado ?? conversacion?.id_itinerario ?? null;
  const destino = getDestinoDesdeConversacion(conversacion);
  const key = normalizarTexto(destino);
  const tieneCosta = ["baleares", "canarias", "valencia", "andalucia", "cataluna", "cantabria", "asturias", "malaga", "cadiz"].some((item) => key.includes(item));

  if (!idItinerario) {
    return [
      "Estoy en Madrid y necesito dos sitios para ver hoy por la tarde",
      "Estoy en Valencia y quiero un museo y algo de gastronomía cerca",
      "Estoy en Tenerife y quiero ver el Teide o algo imprescindible",
      "Estoy en Sevilla y quiero tres planes culturales para esta tarde",
      "Estoy en Baleares y quiero una cala bonita y un paseo tranquilo",
    ];
  }

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


function cleanText(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  if (!text || ["nan", "null", "undefined", "none"].includes(text.toLowerCase())) return null;
  return text;
}

function num(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function poiId(poi: PoiRecomendadoChat): number | null {
  const id = num(poi.id_poi ?? poi.id);
  return id && Number.isInteger(id) && id > 0 ? id : null;
}

function poiNombre(poi: PoiRecomendadoChat): string {
  return cleanText(poi.nombre ?? poi.name ?? poi.titulo) ?? "POI recomendado";
}

function poiCategoria(poi: PoiRecomendadoChat): string {
  return cleanText(poi.categoria_poi?.nombre ?? poi.tipo ?? poi.category ?? poi.categoria ?? poi.subcategoria) ?? "POI recomendado";
}

function poiDescripcion(poi: PoiRecomendadoChat): string | null {
  return cleanText(poi.descripcion ?? poi.description ?? poi.reason);
}

function poiUbicacion(poi: PoiRecomendadoChat): string {
  return [
    cleanText(poi.municipio?.nombre ?? poi.municipality),
    cleanText(poi.municipio?.provincia?.nombre ?? poi.province),
    cleanText(poi.ccaa),
  ].filter(Boolean).join(", ");
}

function poiLat(poi: PoiRecomendadoChat): number | null {
  return num(poi.latitud ?? poi.lat);
}

function poiLon(poi: PoiRecomendadoChat): number | null {
  return num(poi.longitud ?? poi.lon ?? poi.lng);
}

function getGoogleDirectionsUrl(poi: PoiRecomendadoChat): string | null {
  const existing = cleanText(poi.directionsUrl ?? poi.directions_url);
  if (existing) return existing;
  const lat = poiLat(poi);
  const lon = poiLon(poi);
  const destination = lat !== null && lon !== null
    ? `${lat},${lon}`
    : [poiNombre(poi), cleanText(poi.direccion ?? poi.address), poiUbicacion(poi), "España"].filter(Boolean).join(", ");

  if (!destination.trim()) return null;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

function getGoogleSearchUrl(poi: PoiRecomendadoChat): string {
  const existing = cleanText(poi.google_search_url ?? poi.googleUrl ?? poi.google_url);
  if (existing) return existing;
  const query = [poiNombre(poi), cleanText(poi.direccion ?? poi.address), poiUbicacion(poi), "España"].filter(Boolean).join(" ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function contenidoVisibleChat(mensaje: Mensaje, esUltimoMensaje: boolean, hayPois: boolean): string {
  const contenido = mensaje.contenido ?? "";
  if (mensaje.rol !== "user" && mensaje.rol !== "usuario" && esUltimoMensaje && hayPois) {
    return "Te dejo las recomendaciones reales encontradas. Puedes guardarlas, abrir su detalle o calcular cómo llegar.";
  }
  return contenido.replace(/\bnan\b/gi, "").replace(/\bundefined\b/gi, "").replace(/\bnull\b/gi, "").trim();
}

function PoiRecommendationCard({ poi }: { poi: PoiRecomendadoChat }) {
  const navigate = useNavigate();
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const id = poiId(poi);
  const nombre = poiNombre(poi);
  const categoria = poiCategoria(poi);
  const ubicacion = poiUbicacion(poi);
  const descripcion = poiDescripcion(poi);
  const directions = getGoogleDirectionsUrl(poi);

  async function guardar() {
    if (!id || guardando) return;
    const usuario = obtenerUsuarioGuardado();
    if (!usuario?.id_usuario) return;
    try {
      setGuardando(true);
      await crearFavorito({ id_usuario: usuario.id_usuario, id_poi: id });
      setGuardado(true);
    } catch (err) {
      console.error(err);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <article className="rounded-[24px] border border-[#eef2f7] bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#ff5a36]">{categoria}</p>
      <h3 className="mt-1 text-base font-black leading-6 text-[#111827]">{nombre}</h3>
      {ubicacion && <p className="mt-1 text-xs font-bold text-[#667085]">{ubicacion}</p>}
      {descripcion && <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#667085]">{descripcion}</p>}
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          type="button"
          disabled={!id || guardando || guardado}
          onClick={guardar}
          className={`rounded-2xl px-4 py-3 text-center text-xs font-black ${guardado ? "bg-[#ecfdf3] text-[#027a48]" : "bg-[#f8fafc] text-[#0f172a]"} disabled:opacity-60`}
        >
          {guardado ? "Guardado" : guardando ? "Guardando..." : "Guardar"}
        </button>
        <button
          type="button"
          disabled={!id}
          onClick={() => id && navigate(`/poi/${id}`)}
          className="rounded-2xl bg-[#f8fafc] px-4 py-3 text-center text-xs font-black text-[#0f172a] disabled:opacity-60"
        >
          Ver detalle
        </button>
        <a href={getGoogleSearchUrl(poi)} target="_blank" rel="noreferrer" className="rounded-2xl bg-[#111827] px-4 py-3 text-center text-xs font-black text-white">
          Ver en Google
        </a>
        {directions && <a href={directions} target="_blank" rel="noreferrer" className="rounded-2xl bg-[#fff4ef] px-4 py-3 text-center text-xs font-black text-[#ff5a36]">Cómo llegar</a>}
      </div>
    </article>
  );
}

export default function ChatDetallePantalla() {
  const navigate = useNavigate();
  const { idConversacion } = useParams();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const id = useMemo(() => Number(idConversacion), [idConversacion]);

  const [conversacion, setConversacion] = useState<Conversacion | null>(null);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [ultimosPois, setUltimosPois] = useState<PoiRecomendadoChat[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const idItinerarioRelacionado = conversacion?.id_itinerario_relacionado ?? conversacion?.id_itinerario ?? null;
  const modoItinerario = Boolean(idItinerarioRelacionado);

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
  }, [mensajes.length, sending, ultimosPois.length]);

  async function enviarMensaje(textoForzado?: string) {
    const texto = (textoForzado ?? input).trim();
    if (!texto || sending || !Number.isInteger(id)) return;

    try {
      setSending(true);
      setError(null);
      setInput("");
      setUltimosPois([]);

      const result = await procesarMensajeChat(id, { contenido: texto });
      setMensajes((prev) => limpiarMensajes([...prev, result.user, result.assistant]));
      setUltimosPois(Array.isArray(result.pois) ? result.pois : []);
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

  const titulo = conversacion?.titulo || "Asistente SpainWay";
  const sugerencias = useMemo(() => getSugerenciasChat(conversacion), [conversacion]);

  return (
    <div className="min-h-full bg-[#f3f5f9] text-[#111827]">
      <div className="mx-auto flex min-h-[calc(100vh-86px)] w-full max-w-[920px] flex-col px-4 pb-36 pt-4">
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
                {modoItinerario ? "Editor de itinerario" : "Recomendador rápido"}
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

        <main className="mt-4 mb-6 flex min-h-[620px] flex-1 flex-col overflow-hidden rounded-[34px] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
          <section className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-[#f8fafc] p-5">
            {loading ? (
              <div className="rounded-[24px] bg-white p-4 text-sm font-semibold text-[#667085] shadow-sm">
                Cargando conversación...
              </div>
            ) : mensajes.length === 0 ? (
              <div className="rounded-[28px] bg-white p-5 shadow-sm">
                <p className="text-lg font-black text-[#111827]">
                  {modoItinerario ? "Modifica tu itinerario hablando" : "Pide una recomendación rápida"}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#667085]">
                  {modoItinerario
                    ? "Puedes pedir cambios directos sobre el itinerario: añadir, quitar, mover, sustituir o regenerar un día concreto."
                    : "También puedes usar el chat sin itinerario: dime dónde estás, cuánto tiempo tienes y qué te apetece. SpainWay buscará POIs reales en la base de datos."}
                </p>
                <div className="mt-4 grid grid-cols-1 gap-2">
                  {sugerencias.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => void enviarMensaje(item)}
                      className="rounded-2xl bg-[#fff4ef] px-4 py-3 text-left text-xs font-bold leading-5 text-[#ff5a36] transition hover:bg-[#ffe7dc]"
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
                    <div key={`${mensaje.id_mensaje}-${index}`} className={`flex ${esUsuario ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[92%] rounded-[28px] px-5 py-4 text-[14px] leading-7 shadow-sm md:max-w-[78%] ${
                          esUsuario ? "rounded-br-md bg-[#ff5a36] text-white" : "rounded-bl-md bg-white text-[#344054]"
                        }`}
                      >
                        <div className="whitespace-pre-wrap break-words">{contenidoVisibleChat(mensaje, esUltimoMensaje, ultimosPois.length > 0)}</div>

                        {!esUsuario && idItinerarioRelacionado && esUltimoMensaje && (
                          <button
                            type="button"
                            onClick={abrirDetalleItinerario}
                            className="mt-4 w-full rounded-2xl bg-[#111827] px-4 py-3 text-sm font-black text-white transition hover:bg-[#0b1220]"
                          >
                            Ver detalle del itinerario →
                          </button>
                        )}

                        <p className={`mt-2 text-right text-[10px] font-bold ${esUsuario ? "text-white/75" : "text-[#98a2b3]"}`}>
                          {formatHora(mensaje.creado)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {ultimosPois.length > 0 && (
              <div className="mt-5 space-y-3">
                <p className="px-1 text-xs font-black uppercase tracking-[0.18em] text-[#94a3b8]">POIs recomendados</p>
                {ultimosPois.map((poi) => (
                  <PoiRecommendationCard key={String(poi.id_poi ?? poi.id ?? poi.nombre ?? poi.name)} poi={poi} />
                ))}
              </div>
            )}

            {sending && (
              <div className="mt-4 flex justify-start">
                <div className="rounded-[24px] rounded-bl-md bg-white px-4 py-3 text-sm font-semibold text-[#667085] shadow-sm">
                  {modoItinerario ? "SpainWay está comprobando y guardando el cambio..." : "SpainWay está buscando recomendaciones reales..."}
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

          <form onSubmit={handleSubmit} className="border-t border-[#eef2f7] bg-white p-3 sm:p-4">
            <div className="rounded-[26px] border border-[#d9dee8] bg-[#fcfcfd] p-2 shadow-[0_8px_22px_rgba(15,23,42,0.04)]">
              <textarea
                rows={2}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void enviarMensaje();
                  }
                }}
                placeholder={modoItinerario ? "Ej. añade el Teide al día 1, elimina la última parada..." : "Ej. estoy en Madrid y necesito dos sitios para ver hoy por la tarde..."}
                className="max-h-32 min-h-[62px] w-full resize-none bg-transparent px-3 py-2 text-sm leading-6 outline-none placeholder:text-[#98a2b3]"
              />
              <div className="flex items-center justify-between gap-3 px-1 pb-1">
                <p className="text-[11px] font-semibold text-[#98a2b3]">Enter envía · Shift+Enter salta línea</p>
                <button
                  type="submit"
                  disabled={!input.trim() || sending}
                  className="flex h-11 min-w-[92px] shrink-0 items-center justify-center rounded-[18px] bg-[#ff5a36] px-4 text-sm font-black text-white shadow-[0_10px_24px_rgba(255,90,54,0.28)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {sending ? "..." : "Enviar"}
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
