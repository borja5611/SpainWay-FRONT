import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { buscarEventosLive, type EventoLive } from "@/app/servicios/eventosLive";
import { CIUDADES_SPAINWAY } from "@/app/utilidades/ciudadesSpainway";

type Props = {
  abierto: boolean;
  onClose: () => void;
  ciudadInicial?: string;
};

type CategoriaEvento =
  | "all"
  | "music"
  | "nightlife"
  | "local_fairs"
  | "theatre"
  | "festivals"
  | "free"
  | "gastronomy";

const categorias: Array<{ value: CategoriaEvento; label: string; hint: string }> = [
  { value: "all", label: "Todos", hint: "Eventos y planes locales de calidad" },
  { value: "music", label: "Conciertos", hint: "Conciertos y música en directo" },
  { value: "nightlife", label: "Ocio nocturno", hint: "Discotecas, rooftops, clubs, flamenco y bares con música bien valorados" },
  { value: "local_fairs", label: "Fiestas locales", hint: "Ferias, verbenas y agenda cultural local" },
  { value: "theatre", label: "Teatro / shows", hint: "Teatro, monólogos y espectáculos" },
  { value: "festivals", label: "Festivales", hint: "Festivales y eventos especiales" },
  { value: "free", label: "Gratis", hint: "Planes gratuitos o de acceso libre" },
  { value: "gastronomy", label: "Gastronomía", hint: "Mercados, tapas y experiencias gastronómicas" },
];

function hoyISO(): string {
  const now = new Date();
  const local = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return local.toISOString().slice(0, 10);
}

function addDaysISO(days: number): string {
  const now = new Date();
  const local = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  local.setDate(local.getDate() + days);
  return local.toISOString().slice(0, 10);
}

function fechaBonita(value: string | null | undefined): string {
  if (!value) return "Fecha por confirmar";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fuenteTexto(provider: string): string {
  if (provider === "ticketmaster") return "Ticketmaster";
  if (provider === "predicthq") return "PredictHQ";
  if (provider === "serpapi") return "Google Events";
  if (provider === "google_local") return "Google Local";
  if (provider === "google_maps") return "Google Maps";
  return provider;
}

function googleMapsUrl(evento: EventoLive): string {
  if (evento.latitud && evento.longitud) {
    return `https://www.google.com/maps/dir/?api=1&destination=${evento.latitud},${evento.longitud}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${evento.nombre} ${evento.ciudad}`)}`;
}

function EventoCard({ evento }: { evento: EventoLive }) {
  const esPlanLocal = evento.provider === "google_local" || evento.provider === "google_maps";

  return (
    <article className="overflow-hidden rounded-[28px] border border-[#eef2f7] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
      <div className="relative min-h-[128px] bg-gradient-to-br from-[#111827] via-[#283347] to-[#ff5a36]">
        {evento.imagen ? (
          <img src={evento.imagen} alt={evento.nombre} className="h-36 w-full object-cover" />
        ) : (
          <div className="flex h-36 flex-col items-center justify-center px-5 text-center text-white">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-2xl shadow-sm">{esPlanLocal ? "🌙" : "🎟️"}</div>
            <p className="mt-3 text-[11px] font-black uppercase tracking-[0.18em] text-white/85">{esPlanLocal ? "Plan local" : "Evento"}</p>
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#ff5a36] shadow-sm">
          {fuenteTexto(evento.provider)}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-black leading-6 text-[#0f172a]">{evento.nombre}</h3>
        <p className="mt-1 text-xs font-bold text-[#64748b]">{evento.categoria}</p>
        <p className="mt-2 text-xs font-black text-[#ff5a36]">{esPlanLocal ? "Plan recomendado" : fechaBonita(evento.fechaInicio)}</p>
        {(evento.recinto || evento.direccion) && (
          <p className="mt-2 text-sm font-semibold leading-5 text-[#475569]">{[evento.recinto, evento.direccion].filter(Boolean).join(" · ")}</p>
        )}
        {evento.descripcion && <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#667085]">{evento.descripcion}</p>}

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <a href={googleMapsUrl(evento)} target="_blank" rel="noreferrer" className="rounded-2xl bg-[#fff4ef] px-4 py-3 text-center text-xs font-black text-[#ff5a36]">
            Cómo llegar
          </a>
          <a href={`https://www.google.com/search?q=${encodeURIComponent(`${evento.nombre} ${evento.ciudad}`)}`} target="_blank" rel="noreferrer" className="rounded-2xl bg-[#111827] px-4 py-3 text-center text-xs font-black text-white">
            Ver en Google
          </a>
          {evento.url && (
            <a href={evento.url} target="_blank" rel="noreferrer" className="rounded-2xl bg-[#f8fafc] px-4 py-3 text-center text-xs font-black text-[#475569] sm:col-span-2">
              Ver fuente externa
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ModalEventosLiveInicio({ abierto, onClose, ciudadInicial = "Madrid" }: Props) {
  const [ciudad, setCiudad] = useState(ciudadInicial || "Madrid");
  const [categoria, setCategoria] = useState<CategoriaEvento>("nightlife");
  const [from, setFrom] = useState(hoyISO());
  const [to, setTo] = useState(addDaysISO(2));
  const [resultados, setResultados] = useState<EventoLive[]>([]);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categoriaActual = useMemo(() => categorias.find((item) => item.value === categoria), [categoria]);

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
      const response = await buscarEventosLive({
        city: ciudad,
        from,
        to,
        radiusKm: 70,
        category: categoria,
      });
      setResultados(Array.isArray(response.events) ? response.events : []);
      setMensaje(response.message ?? null);
      setWarnings(Array.isArray(response.warnings) ? response.warnings : []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron buscar eventos. Revisa que el backend esté desplegado y que SerpApi/Ticketmaster/PredictHQ estén configurados.");
    } finally {
      setBuscando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[34px] bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#eef2f7] bg-white/95 p-5 backdrop-blur sm:p-6">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#ff5a36]">Eventos live</p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#0f172a] sm:text-3xl">Buscar eventos y planes locales</h2>
            <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-[#64748b]">
              Conciertos, fiestas locales y planes nocturnos de calidad. SpainWay filtra resultados flojos para no mostrar cualquier discoteca.
            </p>
          </div>
          <button type="button" onClick={onClose} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#f8fafc] text-xl font-black text-[#64748b]" aria-label="Cerrar">
            ×
          </button>
        </div>

        <div className="overflow-y-auto p-5 sm:p-6">
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
                <input type="date" value={from} onChange={(event) => { setFrom(event.target.value); setTo(""); }} className="mt-2 h-13 w-full rounded-2xl border border-[#d9dee8] bg-white px-4 text-sm font-bold text-[#0f172a] outline-none focus:border-[#ff5a36]" />
              </label>

              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-[#94a3b8]">Hasta</span>
                <input type="date" min={from || undefined} value={to} onChange={(event) => setTo(event.target.value)} className="mt-2 h-13 w-full rounded-2xl border border-[#d9dee8] bg-white px-4 text-sm font-bold text-[#0f172a] outline-none focus:border-[#ff5a36]" />
              </label>
            </div>

            <div className="mt-4 rounded-2xl bg-white p-4">
              <p className="text-sm font-black text-[#0f172a]">{categoriaActual?.label}</p>
              <p className="mt-1 text-sm font-semibold leading-6 text-[#667085]">{categoriaActual?.hint}. Usa Google Events, Google Local/Maps, Ticketmaster y PredictHQ cuando estén configuradas.</p>
            </div>

            <button type="submit" disabled={buscando} className="mt-4 w-full rounded-2xl bg-[#ff5a36] px-5 py-4 text-sm font-black text-white shadow-[0_12px_30px_rgba(255,90,54,0.22)] disabled:cursor-not-allowed disabled:opacity-60">
              {buscando ? "Buscando eventos..." : "Buscar eventos"}
            </button>
          </form>

          {error && <div className="mt-4 rounded-3xl bg-red-50 p-4 text-sm font-bold text-red-600">{error}</div>}
          {mensaje && <div className="mt-4 rounded-3xl bg-[#fff7ed] p-4 text-sm font-semibold leading-6 text-[#9a3412]">{mensaje}</div>}
          {warnings.length > 0 && resultados.length === 0 && (
            <div className="mt-4 rounded-3xl bg-[#fff7ed] p-4 text-sm font-semibold leading-6 text-[#9a3412]">
              {warnings.slice(0, 4).map((item) => <p key={item}>• {item}</p>)}
            </div>
          )}

          {resultados.length > 0 && (
            <section className="mt-5">
              <div className="mb-3">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#94a3b8]">Resultados</p>
                <h3 className="mt-1 text-xl font-black text-[#0f172a]">{resultados.length} planes encontrados</h3>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {resultados.map((evento) => <EventoCard key={evento.id} evento={evento} />)}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
