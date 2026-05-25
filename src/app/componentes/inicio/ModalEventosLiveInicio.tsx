import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { CIUDADES_SPAINWAY } from "@/app/utilidades/ciudadesSpainway";
import {
  buscarEventosLive,
  getEventosLiveGuardados,
  guardarEventoLiveLocal,
  isEventoLiveGuardado,
  quitarEventoLiveLocal,
  type EventoLive,
} from "@/app/servicios/eventosLive";

type Props = {
  abierto: boolean;
  onClose: () => void;
  ciudadInicial?: string;
};

const categorias = [
  { value: "all", label: "Todos" },
  { value: "music", label: "Conciertos" },
  { value: "nightlife", label: "Ocio nocturno" },
  { value: "local_fairs", label: "Fiestas locales" },
  { value: "theatre", label: "Teatro / shows" },
  { value: "festivals", label: "Festivales" },
  { value: "free", label: "Gratis" },
  { value: "food", label: "Gastronomía" },
];

function hoyISO(): string {
  const now = new Date();
  const local = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return local.toISOString().slice(0, 10);
}

function mananaISO(): string {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  const local = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return local.toISOString().slice(0, 10);
}

function fechaBonita(value?: string | null): string {
  if (!value) return "Fecha por confirmar";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function fuenteLabel(provider: string): string {
  if (provider === "ticketmaster") return "Ticketmaster";
  if (provider === "predicthq") return "PredictHQ";
  if (provider === "serpapi") return "Google Events";
  if (provider === "google_local") return "Google Local";
  if (provider === "google_maps") return "Google Maps";
  if (provider === "database") return "SpainWay";
  return provider;
}

function mapsUrl(evento: EventoLive): string {
  if (typeof evento.latitud === "number" && typeof evento.longitud === "number") {
    return `https://www.google.com/maps/dir/?api=1&destination=${evento.latitud},${evento.longitud}`;
  }
  const query = encodeURIComponent([evento.nombre, evento.direccion, evento.ciudad].filter(Boolean).join(" "));
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function EventoCard({ evento, guardado, onToggle }: { evento: EventoLive; guardado: boolean; onToggle: (evento: EventoLive) => void }) {
  return (
    <article className="overflow-hidden rounded-[28px] border border-[#eef2f7] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
      <div className="relative h-36 bg-gradient-to-br from-[#111827] via-[#283047] to-[#ff5a36]">
        {evento.imagen ? <img src={evento.imagen} alt={evento.nombre} className="h-full w-full object-cover" /> : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#ff5a36] shadow-sm">
          {fuenteLabel(evento.provider)}
        </span>
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-white/70">{evento.categoria || "Evento"}</p>
          <h3 className="mt-1 line-clamp-2 text-xl font-black leading-6 text-white">{evento.nombre}</h3>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs font-black text-[#ff5a36]">{fechaBonita(evento.fechaInicio)}</p>
        {evento.recinto && <p className="mt-2 text-sm font-black text-[#0f172a]">{evento.recinto}</p>}
        {evento.direccion && <p className="mt-1 text-sm font-semibold leading-5 text-[#64748b]">{evento.direccion}</p>}
        {evento.descripcion && <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#667085]">{evento.descripcion}</p>}
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button type="button" onClick={() => onToggle(evento)} className={`rounded-2xl px-4 py-3 text-xs font-black ${guardado ? "bg-[#ecfdf3] text-[#027a48]" : "bg-[#f8fafc] text-[#0f172a]"}`}>
            {guardado ? "Guardado" : "Guardar"}
          </button>
          <a href={mapsUrl(evento)} target="_blank" rel="noreferrer" className="rounded-2xl bg-[#fff4ef] px-4 py-3 text-center text-xs font-black text-[#ff5a36]">Cómo llegar</a>
          {evento.url && <a href={evento.url} target="_blank" rel="noreferrer" className="rounded-2xl bg-[#111827] px-4 py-3 text-center text-xs font-black text-white sm:col-span-2">Ver evento</a>}
        </div>
      </div>
    </article>
  );
}

export default function ModalEventosLiveInicio({ abierto, onClose, ciudadInicial = "" }: Props) {
const ciudadPorDefecto = (CIUDADES_SPAINWAY as readonly string[]).includes(ciudadInicial)
  ? ciudadInicial
  : "Madrid";  const [ciudad, setCiudad] = useState(ciudadPorDefecto);
  const [categoria, setCategoria] = useState("all");
  const [desde, setDesde] = useState(hoyISO());
  const [hasta, setHasta] = useState(mananaISO());
  const [resultados, setResultados] = useState<EventoLive[]>([]);
  const [guardados, setGuardados] = useState<EventoLive[]>(() => getEventosLiveGuardados());
  const [mostrarGuardados, setMostrarGuardados] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const guardadosIds = useMemo(() => new Set(guardados.map((item) => item.id)), [guardados]);
  const listaVisible = mostrarGuardados ? guardados : resultados;

  if (!abierto) return null;

  async function buscar(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    if (!hasta) {
      setError("Selecciona una fecha final para acotar la búsqueda.");
      return;
    }
    if (desde > hasta) {
      setError("La fecha final no puede ser anterior a la fecha inicial.");
      return;
    }
    try {
      setMostrarGuardados(false);
      setBuscando(true);
      setError(null);
      setWarnings([]);
      const response = await buscarEventosLive({ city: ciudad, from: desde, to: hasta, radiusKm: 70, category: categoria });
      const eventos = Array.isArray(response.events) ? response.events : [];
      setResultados(eventos);
      setMensaje(response.message ?? null);
      const avisos = Array.isArray(response.warnings) ? response.warnings : [];
      setWarnings(eventos.length > 0 ? avisos.filter((item) => !/no configurado|no respondió/i.test(item)).slice(0, 2) : avisos);
    } catch (err) {
      console.error(err);
      setError("No se pudieron buscar eventos. Revisa que el backend esté desplegado y las fuentes estén configuradas.");
    } finally {
      setBuscando(false);
    }
  }

  function toggleGuardado(evento: EventoLive) {
    const next = isEventoLiveGuardado(evento.id) ? quitarEventoLiveLocal(evento.id) : guardarEventoLiveLocal(evento);
    setGuardados(next);
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[34px] bg-white shadow-2xl">
        <div className="shrink-0 border-b border-[#eef2f7] bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#ff5a36]">Eventos live</p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#0f172a] sm:text-3xl">Buscar eventos y planes locales</h2>
              <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-[#64748b]">
                Conciertos, fiestas locales y planes nocturnos de calidad. SpainWay filtra resultados flojos para no mostrar cualquier discoteca.
              </p>
              <button type="button" onClick={() => setMostrarGuardados((value) => !value)} className="mt-4 rounded-2xl bg-[#111827] px-4 py-3 text-xs font-black text-white">
                {mostrarGuardados ? "Volver a la búsqueda" : `Ver planes guardados (${guardados.length})`}
              </button>
            </div>
            <button type="button" onClick={onClose} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#f8fafc] text-xl font-black text-[#64748b]" aria-label="Cerrar">×</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {!mostrarGuardados && (
            <form onSubmit={buscar} className="rounded-[30px] border border-[#eef2f7] bg-[#f8fafc] p-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label>
                  <span className="text-xs font-black uppercase tracking-[0.16em] text-[#94a3b8]">Ciudad</span>
                  <select value={ciudad} onChange={(event) => setCiudad(event.target.value)} className="mt-2 h-13 w-full rounded-2xl border border-[#d9dee8] bg-white px-4 text-sm font-bold text-[#0f172a] outline-none focus:border-[#ff5a36]">
                    {CIUDADES_SPAINWAY.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </label>
                <label>
                  <span className="text-xs font-black uppercase tracking-[0.16em] text-[#94a3b8]">Categoría</span>
                  <select value={categoria} onChange={(event) => setCategoria(event.target.value)} className="mt-2 h-13 w-full rounded-2xl border border-[#d9dee8] bg-white px-4 text-sm font-bold text-[#0f172a] outline-none focus:border-[#ff5a36]">
                    {categorias.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                </label>
                <label>
                  <span className="text-xs font-black uppercase tracking-[0.16em] text-[#94a3b8]">Desde</span>
                  <input type="date" value={desde} onChange={(event) => { setDesde(event.target.value); setHasta(""); }} className="mt-2 h-13 w-full rounded-2xl border border-[#d9dee8] bg-white px-4 text-sm font-bold text-[#0f172a] outline-none focus:border-[#ff5a36]" />
                </label>
                <label>
                  <span className="text-xs font-black uppercase tracking-[0.16em] text-[#94a3b8]">Hasta</span>
                  <input type="date" value={hasta} min={desde || undefined} onChange={(event) => setHasta(event.target.value)} className="mt-2 h-13 w-full rounded-2xl border border-[#d9dee8] bg-white px-4 text-sm font-bold text-[#0f172a] outline-none focus:border-[#ff5a36]" />
                </label>
              </div>
              <button type="submit" disabled={buscando || !hasta} className="mt-4 w-full rounded-2xl bg-[#ff5a36] px-5 py-4 text-sm font-black text-white shadow-[0_12px_30px_rgba(255,90,54,0.22)] disabled:cursor-not-allowed disabled:opacity-60">
                {buscando ? "Buscando eventos..." : "Buscar eventos"}
              </button>
            </form>
          )}

          {error && <div className="mt-4 rounded-3xl bg-red-50 p-4 text-sm font-bold text-red-600">{error}</div>}
          {mensaje && !mostrarGuardados && <div className="mt-4 rounded-3xl bg-[#fff7ed] p-4 text-sm font-bold leading-6 text-[#9a3412]">{mensaje}</div>}
          {warnings.length > 0 && !mostrarGuardados && <div className="mt-4 rounded-3xl bg-[#fff7ed] p-4 text-sm font-semibold leading-6 text-[#9a3412]">{warnings.slice(0, 3).map((item) => <p key={item}>• {item}</p>)}</div>}

          {listaVisible.length > 0 && (
            <section className="mt-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#94a3b8]">{mostrarGuardados ? "Guardados" : "Resultados"}</p>
              <h3 className="mt-1 text-xl font-black text-[#0f172a]">{mostrarGuardados ? `${guardados.length} planes guardados` : `${resultados.length} planes encontrados`}</h3>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                {listaVisible.map((evento) => <EventoCard key={evento.id} evento={evento} guardado={guardadosIds.has(evento.id)} onToggle={toggleGuardado} />)}
              </div>
            </section>
          )}

          {!buscando && !error && listaVisible.length === 0 && (
            <div className="mt-5 rounded-[28px] border border-dashed border-[#d9dee8] bg-[#fcfcfd] p-5 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#fff4ef] text-2xl">🎟️</div>
              <p className="mt-3 text-base font-black text-[#0f172a]">{mostrarGuardados ? "Aún no tienes planes guardados" : "Busca planes reales cuando los necesites"}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#667085]">
                {mostrarGuardados ? "Guarda un evento o plan nocturno y aparecerá aquí para consultarlo después." : "Usamos varias fuentes y filtramos resultados de baja calidad."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
