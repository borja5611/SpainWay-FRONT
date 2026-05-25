import { useState } from "react";
import type { FormEvent } from "react";
import { buscarEventosLive, type EventoLive } from "@/app/servicios/eventosLive";

const ciudades = ["Madrid", "Barcelona", "Valencia", "Sevilla", "Málaga", "Granada", "Bilbao", "Zaragoza", "Alicante", "Palma de Mallorca", "Tenerife"];
const categorias = ["Todos", "Conciertos", "Teatro", "Festivales", "Fiestas locales", "Cultura", "Deporte"];

type Props = { abierto: boolean; onClose: () => void };

function hoyISO() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString().slice(0, 10);
}

function sumarDias(base: string, dias: number) {
  const date = new Date(`${base}T00:00:00`);
  date.setDate(date.getDate() + dias);
  return date.toISOString().slice(0, 10);
}

function eventoFecha(evento: EventoLive) {
  if (!evento.fechaInicio) return "Fecha por confirmar";
  const date = new Date(evento.fechaInicio);
  if (Number.isNaN(date.getTime())) return evento.fechaInicio;
  return date.toLocaleString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function ModalEventosLiveInicio({ abierto, onClose }: Props) {
  const [city, setCity] = useState("Barcelona");
  const [from, setFrom] = useState(hoyISO());
  const [to, setTo] = useState(sumarDias(hoyISO(), 3));
  const [category, setCategory] = useState("Todos");
  const [events, setEvents] = useState<EventoLive[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!abierto) return null;

  async function buscar(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setMessage(null);
      const response = await buscarEventosLive({ city, from, to, radiusKm: 70, category });
      setEvents(Array.isArray(response.events) ? response.events : []);
      setMessage(response.message ?? null);
    } catch (err) {
      console.error(err);
      setError("No se pudieron buscar eventos live ahora mismo. Revisa el backend o las claves de eventos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[34px] bg-white p-5 shadow-2xl sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#ff5a36]">Eventos live</p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#0f172a] sm:text-3xl">Buscar eventos en directo</h2>
            <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-[#64748b]">Consulta conciertos, teatro, festivales y planes locales por ciudad y fechas.</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#f8fafc] text-xl font-black text-[#64748b]" aria-label="Cerrar">×</button>
        </div>

        <form onSubmit={buscar} className="rounded-[30px] border border-[#eef2f7] bg-[#f8fafc] p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <label className="block"><span className="text-xs font-black uppercase tracking-[0.16em] text-[#94a3b8]">Ciudad</span><select value={city} onChange={(e) => setCity(e.target.value)} className="mt-2 h-13 w-full rounded-2xl border border-[#d9dee8] bg-white px-4 text-sm font-bold text-[#0f172a] outline-none focus:border-[#ff5a36]">{ciudades.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
            <label className="block"><span className="text-xs font-black uppercase tracking-[0.16em] text-[#94a3b8]">Categoría</span><select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-2 h-13 w-full rounded-2xl border border-[#d9dee8] bg-white px-4 text-sm font-bold text-[#0f172a] outline-none focus:border-[#ff5a36]">{categorias.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
            <label className="block"><span className="text-xs font-black uppercase tracking-[0.16em] text-[#94a3b8]">Desde</span><input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="mt-2 h-13 w-full rounded-2xl border border-[#d9dee8] bg-white px-4 text-sm font-bold text-[#0f172a] outline-none focus:border-[#ff5a36]" /></label>
            <label className="block"><span className="text-xs font-black uppercase tracking-[0.16em] text-[#94a3b8]">Hasta</span><input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="mt-2 h-13 w-full rounded-2xl border border-[#d9dee8] bg-white px-4 text-sm font-bold text-[#0f172a] outline-none focus:border-[#ff5a36]" /></label>
          </div>
          <button type="submit" disabled={loading} className="mt-4 w-full rounded-2xl bg-[#ff5a36] px-5 py-4 text-sm font-black text-white shadow-[0_12px_30px_rgba(255,90,54,0.22)] disabled:opacity-60">{loading ? "Buscando eventos..." : "Buscar eventos"}</button>
        </form>

        {error && <div className="mt-4 rounded-3xl bg-red-50 p-4 text-sm font-bold text-red-600">{error}</div>}
        {message && <div className="mt-4 rounded-3xl bg-[#fff7ed] p-4 text-sm font-semibold leading-6 text-[#9a3412]">{message}</div>}
        {events.length > 0 && <section className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">{events.map((evento) => (
          <article key={evento.id} className="overflow-hidden rounded-[28px] border border-[#eef2f7] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
            {evento.imagen ? <img src={evento.imagen} alt={evento.nombre} className="h-36 w-full object-cover" /> : <div className="flex h-36 items-center justify-center bg-gradient-to-br from-[#fff4ef] to-[#eef2ff] text-3xl">🎟️</div>}
            <div className="p-4"><p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#ff5a36]">{evento.provider}</p><h3 className="mt-1 text-lg font-black text-[#0f172a]">{evento.nombre}</h3><p className="mt-2 text-sm font-bold text-[#64748b]">{eventoFecha(evento)}</p>{evento.recinto && <p className="mt-2 text-sm font-semibold text-[#475569]">{evento.recinto}</p>}<div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">{evento.url && <a href={evento.url} target="_blank" rel="noreferrer" className="rounded-2xl bg-[#111827] px-4 py-3 text-center text-xs font-black text-white">Ver evento</a>}<a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([evento.nombre, evento.recinto, evento.ciudad, "España"].filter(Boolean).join(" "))}`} target="_blank" rel="noreferrer" className="rounded-2xl bg-[#fff4ef] px-4 py-3 text-center text-xs font-black text-[#ff5a36]">Cómo llegar</a></div></div>
          </article>
        ))}</section>}
      </div>
    </div>
  );
}
