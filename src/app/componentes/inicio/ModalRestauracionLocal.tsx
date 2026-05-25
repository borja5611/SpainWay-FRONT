import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  buscarLugaresLocales,
  getRestaurantesGuardados,
  guardarRestauranteLocal,
  isRestauranteGuardado,
  quitarRestauranteLocal,
  type FuenteLugarLocal,
  type LugarLocal,
  type TipoLugarLocal,
} from "@/app/servicios/lugaresLocales";

const CIUDADES_SPAINWAY = [
  "Almería",
  "Jaén",
  "Cádiz",
  "Sevilla",
  "Córdoba",
  "Huelva",
  "Granada",
  "Málaga",
  "Andalucía",
  "Asturias",
  "Illes Balears",
  "Las Palmas",
  "Santa Cruz de Tenerife",
  "Cantabria",
  "Girona",
  "Barcelona",
  "Lleida",
  "Tarragona",
  "Madrid",
  "Alicante",
  "Valencia",
  "Castellón",
];

type Props = {
  abierto: boolean;
  onClose: () => void;
  ciudadInicial?: string;
};

const tipos: Array<{ value: TipoLugarLocal; label: string; hint: string }> = [
  { value: "comer_bien", label: "Comer bien", hint: "Restaurantes recomendados" },
  { value: "cenar", label: "Cenar", hint: "Opciones para tarde/noche" },
  { value: "tapas", label: "Tapas", hint: "Bares y tabernas" },
  { value: "cafe_brunch", label: "Café / brunch", hint: "Cafeterías y desayunos" },
  { value: "tipico_local", label: "Típico local", hint: "Comida de la zona" },
  { value: "rapido", label: "Rápido", hint: "Algo práctico cerca" },
];

const fuentes: Array<{ value: FuenteLugarLocal; label: string }> = [
  { value: "all", label: "Todas las fuentes" },
  { value: "google_local", label: "Google Local" },
  { value: "google_maps", label: "Google Maps" },
  { value: "tripadvisor", label: "Tripadvisor" },
];

function hoyISO(): string {
  const now = new Date();
  const local = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return local.toISOString().slice(0, 10);
}

function textoFuente(provider: string): string {
  if (provider === "google_local") return "Google Local";
  if (provider === "google_maps") return "Google Maps";
  if (provider === "tripadvisor") return "Tripadvisor";
  if (provider === "cache") return "SpainWay";
  return provider;
}

function limpiarTexto(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  if (!text || ["nan", "null", "undefined", "none"].includes(text.toLowerCase())) return null;
  return text;
}

function textoRating(lugar: LugarLocal): string | null {
  if (!lugar.rating && !lugar.reviews) return null;
  const rating = lugar.rating ? `⭐ ${lugar.rating.toFixed(1)}` : null;
  const reviews = lugar.reviews ? `${lugar.reviews} reseñas` : null;
  return [rating, reviews].filter(Boolean).join(" · ");
}

function LugarCard({
  lugar,
  onToggleGuardado,
  guardado,
}: {
  lugar: LugarLocal;
  onToggleGuardado: (lugar: LugarLocal) => void;
  guardado: boolean;
}) {
  const rating = textoRating(lugar);
  const descripcion = limpiarTexto(lugar.descripcion);
  const direccion = limpiarTexto(lugar.direccion);

  return (
    <article className="overflow-hidden rounded-[28px] border border-[#eef2f7] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
      <div className="relative min-h-[128px] bg-gradient-to-br from-[#fff4ef] via-[#f8fafc] to-[#eef2ff]">
        {lugar.imagen ? (
          <img src={lugar.imagen} alt={lugar.nombre} className="h-36 w-full object-cover" />
        ) : (
          <div className="flex h-36 flex-col items-center justify-center px-5 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-2xl shadow-sm">🍽️</div>
            <p className="mt-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#ff5a36]">
              {limpiarTexto(lugar.categoria) || "Restauración"}
            </p>
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#ff5a36] shadow-sm">
          {textoFuente(lugar.provider)}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-black leading-6 text-[#0f172a]">{lugar.nombre}</h3>
        <p className="mt-1 text-xs font-bold text-[#64748b]">
          {limpiarTexto(lugar.categoria) || "Restauración"}
        </p>

        {rating && <p className="mt-2 text-xs font-black text-[#ff5a36]">{rating}</p>}
        {direccion && <p className="mt-2 text-sm font-semibold leading-5 text-[#475569]">{direccion}</p>}
        {descripcion && <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#667085]">{descripcion}</p>}

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onToggleGuardado(lugar)}
            className={`rounded-2xl px-4 py-3 text-center text-xs font-black ${
              guardado ? "bg-[#ecfdf3] text-[#027a48]" : "bg-[#f8fafc] text-[#0f172a]"
            }`}
          >
            {guardado ? "Guardado" : "Guardar"}
          </button>

          <a
            href={lugar.directionsUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl bg-[#fff4ef] px-4 py-3 text-center text-xs font-black text-[#ff5a36]"
          >
            Cómo llegar
          </a>

          <a
            href={lugar.googleUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl bg-[#111827] px-4 py-3 text-center text-xs font-black text-white sm:col-span-2"
          >
            Ver en Google
          </a>

          {lugar.url && (
            <a
              href={lugar.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl bg-[#f8fafc] px-4 py-3 text-center text-xs font-black text-[#475569] sm:col-span-2"
            >
              Ver fuente externa
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ModalRestauracionLocal({ abierto, onClose, ciudadInicial = "" }: Props) {
  const ciudadValida = CIUDADES_SPAINWAY.includes(ciudadInicial as (typeof CIUDADES_SPAINWAY)[number])
    ? ciudadInicial
    : "Valencia";

  const [ciudad, setCiudad] = useState(ciudadValida);
  const [fecha, setFecha] = useState(hoyISO());
  const [tipo, setTipo] = useState<TipoLugarLocal>("comer_bien");
  const [fuente, setFuente] = useState<FuenteLugarLocal>("all");
  const [resultados, setResultados] = useState<LugarLocal[]>([]);
  const [guardados, setGuardados] = useState<LugarLocal[]>(() => getRestaurantesGuardados());
  const [warnings, setWarnings] = useState<string[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const guardadosIds = useMemo(() => new Set(guardados.map((item) => item.id)), [guardados]);
  const tipoSeleccionado = tipos.find((item) => item.value === tipo);
  const warningsVisibles = resultados.length === 0 ? warnings.slice(0, 3) : [];

  if (!abierto) return null;

  async function buscar(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const ciudadFinal = ciudad.trim();
    if (!ciudadFinal) {
      setError("Selecciona una ciudad para buscar restaurantes.");
      return;
    }

    try {
      setBuscando(true);
      setError(null);
      setWarnings([]);
      const response = await buscarLugaresLocales({
        ciudad: ciudadFinal,
        fecha,
        tipo,
        fuente,
        radiusKm: 12,
        limit: 18,
      });
      setResultados(Array.isArray(response.items) ? response.items : []);
      setWarnings(Array.isArray(response.warnings) ? response.warnings : []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron buscar sitios para comer. Revisa que el backend esté desplegado y la ruta /api/lugares-locales esté registrada.");
    } finally {
      setBuscando(false);
    }
  }

  function toggleGuardado(lugar: LugarLocal) {
    const next = isRestauranteGuardado(lugar.id)
      ? quitarRestauranteLocal(lugar.id)
      : guardarRestauranteLocal(lugar);
    setGuardados(next);
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[34px] bg-white shadow-2xl">
        <div className="shrink-0 border-b border-[#eef2f7] bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#ff5a36]">Restauración local</p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#0f172a] sm:text-3xl">Buscar sitios para comer</h2>
              <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-[#64748b]">
                Combina Google Local, Google Maps y Tripadvisor para encontrar restaurantes reales por ciudad, fecha y tipo de plan.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#f8fafc] text-xl font-black text-[#64748b]"
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
          <form onSubmit={buscar} className="rounded-[30px] border border-[#eef2f7] bg-[#f8fafc] p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-[#94a3b8]">Ciudad</span>
                <select
                  value={ciudad}
                  onChange={(event) => setCiudad(event.target.value)}
                  className="mt-2 h-13 w-full rounded-2xl border border-[#d9dee8] bg-white px-4 text-sm font-bold text-[#0f172a] outline-none focus:border-[#ff5a36]"
                >
                  {CIUDADES_SPAINWAY.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-[#94a3b8]">Fecha</span>
                <input
                  type="date"
                  value={fecha}
                  onChange={(event) => setFecha(event.target.value)}
                  className="mt-2 h-13 w-full rounded-2xl border border-[#d9dee8] bg-white px-4 text-sm font-bold text-[#0f172a] outline-none focus:border-[#ff5a36]"
                />
              </label>

              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-[#94a3b8]">Tipo de plan</span>
                <select
                  value={tipo}
                  onChange={(event) => setTipo(event.target.value as TipoLugarLocal)}
                  className="mt-2 h-13 w-full rounded-2xl border border-[#d9dee8] bg-white px-4 text-sm font-bold text-[#0f172a] outline-none focus:border-[#ff5a36]"
                >
                  {tipos.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-[#94a3b8]">Fuente</span>
                <select
                  value={fuente}
                  onChange={(event) => setFuente(event.target.value as FuenteLugarLocal)}
                  className="mt-2 h-13 w-full rounded-2xl border border-[#d9dee8] bg-white px-4 text-sm font-bold text-[#0f172a] outline-none focus:border-[#ff5a36]"
                >
                  {fuentes.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 rounded-2xl bg-white p-4">
              <p className="text-sm font-black text-[#0f172a]">{tipoSeleccionado?.label}</p>
              <p className="mt-1 text-sm font-semibold leading-6 text-[#667085]">
                {tipoSeleccionado?.hint}. Si una fuente falla, SpainWay sigue con el resto y solo muestra avisos si no hay resultados útiles.
              </p>
            </div>

            <button
              type="submit"
              disabled={buscando}
              className="mt-4 w-full rounded-2xl bg-[#ff5a36] px-5 py-4 text-sm font-black text-white shadow-[0_12px_30px_rgba(255,90,54,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {buscando ? "Buscando restaurantes..." : "Buscar restaurantes"}
            </button>
          </form>

          {error && <div className="mt-4 rounded-3xl bg-red-50 p-4 text-sm font-bold text-red-600">{error}</div>}

          {warningsVisibles.length > 0 && (
            <div className="mt-4 rounded-3xl bg-[#fff7ed] p-4 text-sm font-semibold leading-6 text-[#9a3412]">
              {warningsVisibles.map((item) => <p key={item}>• {item}</p>)}
            </div>
          )}

          {resultados.length > 0 && (
            <section className="mt-5 pb-3">
              <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#94a3b8]">Resultados</p>
                  <h3 className="mt-1 text-xl font-black text-[#0f172a]">{resultados.length} sitios encontrados</h3>
                </div>
                {guardados.length > 0 && <p className="text-xs font-black text-[#ff5a36]">{guardados.length} guardados</p>}
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {resultados.map((lugar) => (
                  <LugarCard key={lugar.id} lugar={lugar} guardado={guardadosIds.has(lugar.id)} onToggleGuardado={toggleGuardado} />
                ))}
              </div>
            </section>
          )}

          {!buscando && !error && resultados.length === 0 && (
            <div className="mt-5 rounded-[28px] border border-dashed border-[#d9dee8] bg-[#fcfcfd] p-5 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#fff4ef] text-2xl">🍽️</div>
              <p className="mt-3 text-base font-black text-[#0f172a]">Busca restaurantes reales cuando los necesites</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#667085]">
                La búsqueda se hace bajo demanda para no saturar el inicio y para mantener el recomendador turístico separado de la restauración práctica.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
