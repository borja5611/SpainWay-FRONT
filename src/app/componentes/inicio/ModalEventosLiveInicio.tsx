import { useState } from "react";
import type { FormEvent } from "react";
import { buscarEventosLive, type EventoLive } from "@/app/servicios/eventosLive";
import { CIUDADES_SPAINWAY } from "@/app/utilidades/ciudadesSpainway";
type Props = {
  abierto: boolean;
  onClose: () => void;
  ciudadInicial?: string;
};

type CategoriaEvento = "all" | "music" | "theatre" | "festival" | "fiestas" | "cultural" | "sports";

const categorias: Array<{ value: CategoriaEvento; label: string; query: string }> = [
  { value: "all", label: "Todos", query: "eventos conciertos teatro festivales fiestas locales agenda cultural" },
  { value: "music", label: "Conciertos", query: "conciertos música live" },
  { value: "theatre", label: "Teatro", query: "teatro artes escénicas" },
  { value: "festival", label: "Festivales", query: "festivales música cultura" },
  { value: "fiestas", label: "Fiestas locales", query: "fiestas locales ferias eventos populares" },
  { value: "cultural", label: "Cultural", query: "agenda cultural exposiciones teatro" },
  { value: "sports", label: "Deporte", query: "eventos deportivos" },
];

function hoyISO(): string {
  const now = new Date();
  const local = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return local.toISOString().slice(0, 10);
}

function fechaBonita(value?: string | null): string {
  if (!value) return "Fecha por confirmar";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("es-ES", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: value.includes("T") ? "2-digit" : undefined,
    minute: value.includes("T") ? "2-digit" : undefined,
  });
}

function fuenteLabel(provider: string): string {
  if (provider === "ticketmaster") return "Ticketmaster";
  if (provider === "predicthq") return "PredictHQ";
  if (provider === "serpapi") return "Google Events";
  if (provider === "database") return "SpainWay";
  return provider;
}

function mapsUrl(evento: EventoLive): string {
  const destination = evento.latitud !== null && evento.longitud !== null
    ? `${evento.latitud},${evento.longitud}`
    : [evento.recinto, evento.direccion, evento.ciudad, "España"].filter(Boolean).join(", ");
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

function EventoCard({ evento }: { evento: EventoLive }) {
  return (
    <article className="overflow-hidden rounded-[28px] border border-[#eef2f7] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
      <div className="relative min-h-[126px] bg-gradient-to-br from-[#fff4ef] via-[#f8fafc] to-[#eef2ff]">
        {evento.imagen ? (
          <img src={evento.imagen} alt={evento.nombre} className="h-36 w-full object-cover" />
        ) : (
          <div className="flex h-36 flex-col items-center justify-center px-5 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-2xl shadow-sm">🎟️</div>
            <p className="mt-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#ff5a36]">{evento.categoria || "Evento"}</p>
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#ff5a36] shadow-sm">
          {fuenteLabel(evento.provider)}
        </span>
      </div>
      <div className="p-4">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#ff5a36]">{fechaBonita(evento.fechaInicio)}</p>
        <h3 className="mt-2 text-lg font-black leading-6 text-[#0f172a]">{evento.nombre}</h3>
        {evento.recinto && <p className="mt-2 text-sm font-bold text-[#475569]">{evento.recinto}</p>}
        {evento.direccion && <p className="mt-1 text-sm font-semibold leading-5 text-[#64748b]">{evento.direccion}</p>}
        {evento.descripcion && <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#667085]">{evento.descripcion}</p>}
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {evento.url && (
            <a href={evento.url} target="_blank" rel="noreferrer" className="rounded-2xl bg-[#111827] px-4 py-3 text-center text-xs font-black text-white">
              Ver evento
            </a>
          )}
          <a href={mapsUrl(evento)} target="_blank" rel="noreferrer" className="rounded-2xl bg-[#fff4ef] px-4 py-3 text-center text-xs font-black text-[#ff5a36]">
            Cómo llegar
          </a>
        </div>
      </div>
    </article>
  );
}

export default function ModalEventosLiveInicio({ abierto, onClose, ciudadInicial = "Madrid" }: Props) {
  const ciudadValida = CIUDADES_SPAINWAY.includes(ciudadInicial as (typeof CIUDADES_SPAINWAY)[number])
    ? ciudadInicial
    : "Madrid";
  const [ciudad, setCiudad] = useState(ciudadValida);
  const [categoria, setCategoria] = useState<CategoriaEvento>("all");
  const [from, setFrom] = useState(hoyISO());
  const [to, setTo] = useState("");
  const [eventos, setEventos] = useState<EventoLive[]>([]);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!abierto) return null;

  async function buscar(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    if (!from || !to) {
      setError("Selecciona fecha de inicio y fecha final para buscar eventos.");
      return;
    }

    if (new Date(from) > new Date(to)) {
      setError("La fecha final no puede ser anterior a la fecha de inicio.");
      return;
    }

    try {
      setBuscando(true);
      setError(null);
      setWarnings([]);
      setMensaje(null);
      const cat = categorias.find((item) => item.value === categoria);
      const response = await buscarEventosLive({
        city: ciudad,
        from,
        to,
        radiusKm: 70,
        category: cat?.query ?? undefined,
      });
      setEventos(Array.isArray(response.events) ? response.events : []);
      setMensaje(response.message ?? null);
      setWarnings(Array.isArray(response.warnings) ? response.warnings : []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar eventos. Revisa que el backend tenga registrada la ruta /api/eventos-live/search.");
    } finally {
      setBuscando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[34px] bg-white shadow-2xl">
        <div className="shrink-0 border-b border-[#eef2f7] bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#ff5a36]">Eventos live</p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#0f172a] sm:text-3xl">Buscar eventos en directo</h2>
              <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-[#64748b]">
                Consulta conciertos, teatro, fiestas locales, festivales y agenda cultural por ciudad y fechas.
              </p>
            </div>
            <button type="button" onClick={onClose} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#f8fafc] text-xl font-black text-[#64748b]" aria-label="Cerrar">
              ×
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
          <form onSubmit={buscar} className="rounded-[30px] border border-[#eef2f7] bg-[#f8fafc] p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-[#94a3b8]">Ciudad</span>
                <select value={ciudad} onChange={(event) => setCiudad(event.target.value)} className="mt-2 h-13 w-full rounded-2xl border border-[#d9dee8] bg-white px-4 text-sm font-bold text-[#0f172a] outline-none focus:border-[#ff5a36]">
                  {CIUDADES_SPAINWAY.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-[#94a3b8]">Categoría</span>
                <select value={categoria} onChange={(event) => setCategoria(event.target.value as CategoriaEvento)} className="mt-2 h-13 w-full rounded-2xl border border-[#d9dee8] bg-white px-4 text-sm font-bold text-[#0f172a] outline-none focus:border-[#ff5a36]">
                  {categorias.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-[#94a3b8]">Desde</span>
                <input
                  type="date"
                  required
                  value={from}
                  onChange={(event) => {
                    setFrom(event.target.value);
                    setTo("");
                  }}
                  className="mt-2 h-13 w-full rounded-2xl border border-[#d9dee8] bg-white px-4 text-sm font-bold text-[#0f172a] outline-none focus:border-[#ff5a36]"
                />
              </label>

              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-[#94a3b8]">Hasta</span>
                <input
                  type="date"
                  required
                  min={from || hoyISO()}
                  value={to}
                  onChange={(event) => setTo(event.target.value)}
                  className="mt-2 h-13 w-full rounded-2xl border border-[#d9dee8] bg-white px-4 text-sm font-bold text-[#0f172a] outline-none focus:border-[#ff5a36]"
                />
              </label>
            </div>

            <div className="mt-4 rounded-2xl bg-white p-4 text-sm font-semibold leading-6 text-[#667085]">
              Si cambias la fecha inicial, la fecha final se limpia para evitar rangos incoherentes. SpainWay consulta Ticketmaster, PredictHQ y Google Events cuando están configurados.
            </div>

            <button type="submit" disabled={buscando} className="mt-4 w-full rounded-2xl bg-[#ff5a36] px-5 py-4 text-sm font-black text-white shadow-[0_12px_30px_rgba(255,90,54,0.22)] disabled:cursor-not-allowed disabled:opacity-60">
              {buscando ? "Buscando eventos..." : "Buscar eventos"}
            </button>
          </form>

          {error && <div className="mt-4 rounded-3xl bg-red-50 p-4 text-sm font-bold text-red-600">{error}</div>}
          {mensaje && <div className="mt-4 rounded-3xl bg-[#fff7ed] p-4 text-sm font-bold leading-6 text-[#9a3412]">{mensaje}</div>}
          {eventos.length === 0 && warnings.length > 0 && (
            <div className="mt-4 rounded-3xl bg-[#fff7ed] p-4 text-sm font-semibold leading-6 text-[#9a3412]">
              {warnings.slice(0, 3).map((warning) => <p key={warning}>• {warning}</p>)}
            </div>
          )}

          {eventos.length > 0 && (
            <section className="mt-5 pb-3">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#94a3b8]">Resultados</p>
              <h3 className="mt-1 text-xl font-black text-[#0f172a]">{eventos.length} eventos encontrados</h3>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                {eventos.map((evento) => <EventoCard key={evento.id} evento={evento} />)}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
