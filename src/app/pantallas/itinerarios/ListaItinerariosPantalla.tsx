import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/app/store/useAuthStore";
import {
  eliminarItinerario,
  getItinerariosResumen,
  type Itinerario,
} from "@/app/servicios/itinerarios";
import {
  itinerariosMock,
  type CategoriaItinerario,
} from "../../datos/mock/itinerariosMock";

type UserItinerary = {
  id: string;
  titulo: string;
  subtitulo: string;
  destino: string;
  categoria: CategoriaItinerario | "Personalizado";
  dias: number;
  lugares: string;
  presupuesto: string;
  progreso: number;
  siguientePaso: string;
  imagen: string;
  destacado?: boolean;
  etiquetas?: string[];
  idReal?: number;
  estado?: string | null;
  base?: string | null;
};

const filtros: Array<"Todos" | CategoriaItinerario | "Personalizado"> = [
  "Todos",
  "Escapada",
  "Cultural",
  "Costa",
  "Gastronomía",
  "Naturaleza",
  "Personalizado",
];

const imagenesDestino: Record<string, string> = {
  madrid:
    "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&q=80",
  malaga:
    "https://images.unsplash.com/photo-1589123053646-4e8c3266f071?auto=format&fit=crop&w=1200&q=80",
  barcelona:
    "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80",
  valencia:
    "https://images.unsplash.com/photo-1523204689348-397c1d0d1789?auto=format&fit=crop&w=1200&q=80",
};

function IconoBusqueda() {
  return (
    <svg className="h-4 w-4 text-[#8b93a7]" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 21L16.65 16.65M18 11C18 14.866 14.866 18 11 18C7.13401 18 4 14.866 4 11C4 7.13401 7.13401 4 11 4C14.866 4 18 7.13401 18 11Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconoFiltro() {
  return (
    <svg className="h-4 w-4 text-[#4b5563]" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 6H20M7 12H17M10 18H14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconoUbicacion() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21C12 21 18 15.6274 18 10.5C18 7.18629 15.3137 4.5 12 4.5C8.68629 4.5 6 7.18629 6 10.5C6 15.6274 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="10.5" r="2.25" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function IconoCalendario() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M8 3V6M16 3V6M4 9H20M6 5H18C19.1046 5 20 5.89543 20 7V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V7C4 5.89543 4.89543 5 6 5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconoSparkle() {
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

function IconoChevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function obtenerColorCategoria(categoria: string) {
  switch (categoria) {
    case "Cultural":
      return "bg-[#eef2ff] text-[#4f46e5]";
    case "Costa":
      return "bg-[#ecfeff] text-[#0891b2]";
    case "Escapada":
      return "bg-[#fff7ed] text-[#ea580c]";
    case "Gastronomía":
      return "bg-[#fef2f2] text-[#dc2626]";
    case "Naturaleza":
      return "bg-[#ecfdf5] text-[#059669]";
    case "Personalizado":
      return "bg-[#fff4ef] text-[#ff5a36]";
    default:
      return "bg-[#f3f4f6] text-[#374151]";
  }
}

function presupuestoLabel(value: number | null): string {
  if (value === 1) return "Bajo";
  if (value === 2) return "Medio";
  if (value === 3) return "Alto";
  return "Medio";
}

function calcularDias(inicio?: string | null, fin?: string | null): number {
  if (!inicio || !fin) return 0;
  const a = new Date(inicio).getTime();
  const b = new Date(fin).getTime();
  if (Number.isNaN(a) || Number.isNaN(b)) return 0;
  return Math.max(1, Math.floor((b - a) / 86400000) + 1);
}

function contarPois(item: Itinerario): number {
  return item.dias?.reduce((acc, dia) => acc + (dia.elementos?.length ?? 0), 0) ?? 0;
}

function getResumen(item: Itinerario): string {
  return (
    item.ia_resumen ||
    item.ia_json?.summary ||
    item.ia_json?.resumen ||
    `Itinerario generado para ${item.destino ?? "tu destino"}.`
  );
}

function getImagenDestino(destino?: string | null): string {
  const key = (destino ?? "").toLowerCase();
  if (key.includes("madrid")) return imagenesDestino.madrid;
  if (key.includes("malaga") || key.includes("málaga")) return imagenesDestino.malaga;
  if (key.includes("barcelona")) return imagenesDestino.barcelona;
  if (key.includes("valencia")) return imagenesDestino.valencia;
  return "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80";
}

function mapItinerarioReal(item: Itinerario): UserItinerary {
  const diasFechas = calcularDias(item.inicio, item.fin);
  const diasIa = item.ia_json?.days ?? 0;
  const totalDias = diasFechas || diasIa || item.dias?.length || 0;
  const totalPois = contarPois(item);

  return {
    id: String(item.id_itinerario),
    idReal: item.id_itinerario,
    titulo: item.titulo ?? `Itinerario ${item.destino ?? ""}`,
    subtitulo: getResumen(item),
    destino: item.destino ?? "Destino sin definir",
    categoria: "Personalizado",
    dias: totalDias,
    lugares: String(totalPois),
    presupuesto: presupuestoLabel(item.presupuesto),
    progreso: item.estado?.includes("borrador") ? 60 : 100,
    siguientePaso:
      totalPois > 0
        ? "Consulta el flow por días y ajusta el viaje desde el chat."
        : "Revisa el JSON generado y completa los POIs enlazados.",
    imagen: getImagenDestino(item.destino),
    etiquetas: [
      item.estado ?? "",
      item.transporte ?? "",
      item.base_nombre ?? item.base_direccion ?? "",
      item.ia_json?.summary ?? "",
    ].filter(Boolean),
    estado: item.estado,
    base: item.base_nombre || item.base_direccion || null,
  };
}

export default function ListaItinerariosPantalla() {
  const navigate = useNavigate();
  const usuario = useAuthStore((state) => state.usuario);
  const idUsuario = usuario?.id_usuario ?? 1;

  const [busqueda, setBusqueda] = useState("");
  const [filtroActivo, setFiltroActivo] = useState<
    "Todos" | CategoriaItinerario | "Personalizado"
  >("Todos");
  const [userItineraries, setUserItineraries] = useState<UserItinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [borrandoId, setBorrandoId] = useState<number | null>(null);
  const [ejemplosAbiertos, setEjemplosAbiertos] = useState(false);

  async function cargarItinerarios() {
    try {
      setLoading(true);
      setError(null);
      const data = await getItinerariosResumen(idUsuario);
      setUserItineraries(Array.isArray(data) ? data.map(mapItinerarioReal) : []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los itinerarios reales del backend.");
      setUserItineraries([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void cargarItinerarios();
  }, [idUsuario]);

  const ejemplos = itinerariosMock;

  const itinerariosUsuarioFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return userItineraries.filter((item) => {
      const coincideFiltro = filtroActivo === "Todos" ? true : item.categoria === filtroActivo;
      const texto = [
        item.titulo,
        item.subtitulo,
        item.destino,
        item.categoria,
        item.estado ?? "",
        item.base ?? "",
        item.etiquetas?.join(" ") ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return coincideFiltro && texto.includes(q);
    });
  }, [busqueda, filtroActivo, userItineraries]);

  const ejemplosFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return ejemplos.filter((item) => {
      const coincideFiltro = filtroActivo === "Todos" ? true : item.categoria === filtroActivo;
      const texto = [
        item.titulo,
        item.subtitulo,
        item.destino,
        item.categoria,
        item.etiquetas.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return coincideFiltro && texto.includes(q);
    });
  }, [busqueda, ejemplos, filtroActivo]);

  async function borrarItinerario(idReal?: number) {
    if (!idReal) return;
    try {
      setBorrandoId(idReal);
      setError(null);
      await eliminarItinerario(idReal);
      setUserItineraries((prev) => prev.filter((item) => item.idReal !== idReal));
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar el itinerario.");
    } finally {
      setBorrandoId(null);
    }
  }

  return (
    <div className="min-h-full bg-[#f3f5f9] text-[#111827]">
      <div className="mx-auto w-full max-w-[430px] pb-28">
        <section className="px-5 pt-5">
          <div className="rounded-[30px] bg-gradient-to-br from-[#fff8f4] via-[#ffffff] to-[#f5f3ff] p-5 shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
            <p className="text-xs uppercase tracking-[0.18em] text-[#94a3b8]">Itinerarios</p>
            <h1 className="mt-2 text-[28px] font-bold tracking-[-0.03em] text-[#111827]">
              Retoma y organiza mejor tus viajes
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#667085]">
              Aquí verás primero los itinerarios reales guardados en base de datos. Los ejemplos quedan guardados en un desplegable aparte.
            </p>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs text-[#94a3b8]">Guardados</p>
                <p className="mt-1 text-lg font-bold text-[#111827]">{userItineraries.length}</p>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs text-[#94a3b8]">En progreso</p>
                <p className="mt-1 text-lg font-bold text-[#111827]">
                  {userItineraries.filter((item) => item.progreso < 100).length}
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs text-[#94a3b8]">Ejemplos</p>
                <p className="mt-1 text-lg font-bold text-[#111827]">{ejemplos.length}</p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-[22px] bg-white px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
              <IconoBusqueda />
              <input
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
                placeholder="Buscar destino, categoría o idea"
                className="w-full bg-transparent text-sm text-[#111827] outline-none placeholder:text-[#98a2b3]"
              />
              <div className="rounded-full bg-[#f3f4f6] p-2">
                <IconoFiltro />
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 pt-5">
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => navigate("/itinerarios/crear")}
              className="rounded-[26px] bg-white p-5 text-left shadow-[0_12px_28px_rgba(15,23,42,0.07)]"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-[#94a3b8]">Crear</p>
              <h3 className="mt-2 text-[18px] font-bold text-[#111827]">Nuevo itinerario</h3>
              <p className="mt-2 text-sm leading-6 text-[#667085]">
                Usa el formulario base para preparar una propuesta nueva.
              </p>
              <div className="mt-4 inline-flex rounded-2xl bg-[#fff4ef] p-3 text-[#ff5a36]">
                <IconoSparkle />
              </div>
            </button>

            <button
              type="button"
              onClick={() => navigate("/calendario")}
              className="rounded-[26px] bg-white p-5 text-left shadow-[0_12px_28px_rgba(15,23,42,0.07)]"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-[#94a3b8]">Planificar</p>
              <h3 className="mt-2 text-[18px] font-bold text-[#111827]">Calendario del viaje</h3>
              <p className="mt-2 text-sm leading-6 text-[#667085]">
                Selecciona el rango de fechas y define la base temporal.
              </p>
              <div className="mt-4 inline-flex rounded-2xl bg-[#fff4ef] p-3 text-[#ff5a36]">
                <IconoCalendario />
              </div>
            </button>
          </div>
        </section>

        <section className="px-5 pt-4">
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filtros.map((filtro) => {
              const activo = filtro === filtroActivo;
              return (
                <button
                  key={filtro}
                  type="button"
                  onClick={() => setFiltroActivo(filtro)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                    activo
                      ? "bg-[#111827] text-white shadow-[0_8px_20px_rgba(17,24,39,0.16)]"
                      : "bg-white text-[#4b5563] shadow-[0_6px_18px_rgba(15,23,42,0.05)]"
                  }`}
                >
                  {filtro}
                </button>
              );
            })}
          </div>
        </section>

        {error && (
          <section className="px-5 pt-4">
            <div className="rounded-[22px] bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
              {error}
            </div>
          </section>
        )}

        <section className="px-5 pt-5">
          <div className="mb-3">
            <h2 className="text-[20px] font-bold tracking-[-0.02em]">Tus itinerarios</h2>
            <p className="text-sm text-[#6b7280]">Aquí solo se muestran los itinerarios reales del usuario.</p>
          </div>

          {loading ? (
            <div className="rounded-[24px] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
              <p className="text-sm font-semibold text-[#667085]">Cargando itinerarios...</p>
            </div>
          ) : itinerariosUsuarioFiltrados.length === 0 ? (
            <div className="rounded-[24px] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
              <p className="text-base font-semibold text-[#111827]">Aún no tienes itinerarios guardados</p>
              <p className="mt-2 text-sm leading-6 text-[#6b7280]">
                Cuando crees tu primer itinerario aparecerá aquí. Los ejemplos se pueden consultar en el desplegable inferior.
              </p>
              <button
                type="button"
                onClick={() => navigate("/itinerarios/crear")}
                className="mt-4 rounded-2xl bg-[#ff5a36] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(255,90,54,0.28)]"
              >
                Crear primer itinerario
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {itinerariosUsuarioFiltrados.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-[28px] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.07)]"
                >
                  <div className="relative h-[190px] overflow-hidden">
                    <img src={item.imagen} alt={item.titulo} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#111827] backdrop-blur">
                        {item.dias || "-"} días
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${obtenerColorCategoria(item.categoria)}`}>
                        {item.categoria}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-[22px] font-bold leading-tight">{item.titulo}</h3>
                      <div className="mt-2 flex items-center gap-2 text-sm text-white/85">
                        <IconoUbicacion />
                        <span>{item.destino}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="line-clamp-3 text-sm leading-6 text-[#6b7280]">{item.subtitulo}</p>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="rounded-2xl bg-[#f8fafc] p-3">
                        <p className="text-xs text-[#94a3b8]">Lugares</p>
                        <p className="mt-1 text-sm font-semibold text-[#0f172a]">{item.lugares}</p>
                      </div>
                      <div className="rounded-2xl bg-[#f8fafc] p-3">
                        <p className="text-xs text-[#94a3b8]">Presupuesto</p>
                        <p className="mt-1 text-sm font-semibold text-[#0f172a]">{item.presupuesto}</p>
                      </div>
                      <div className="rounded-2xl bg-[#f8fafc] p-3">
                        <p className="text-xs text-[#94a3b8]">Avance</p>
                        <p className="mt-1 text-sm font-semibold text-[#0f172a]">{item.progreso}%</p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-[#edf0f4] bg-[#fcfcfd] p-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[#111827]">
                        <IconoCalendario />
                        Siguiente paso
                      </div>
                      <p className="mt-2 text-sm leading-5 text-[#6b7280]">{item.siguientePaso}</p>
                    </div>

                    {item.base && (
                      <div className="mt-3 rounded-2xl bg-[#fff7f3] p-3 text-xs leading-5 text-[#9a3412]">
                        Base: {item.base}
                      </div>
                    )}

                    <button
                      type="button"
                      className="mt-5 w-full rounded-2xl bg-[#ff5a36] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(255,90,54,0.28)]"
                      onClick={() => navigate(`/itinerarios/${item.id}`)}
                    >
                      Ver itinerario
                    </button>

                    {item.idReal && (
                      <button
                        type="button"
                        disabled={borrandoId === item.idReal}
                        onClick={() => void borrarItinerario(item.idReal)}
                        className="mt-3 w-full rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 disabled:opacity-60"
                      >
                        {borrandoId === item.idReal ? "Borrando..." : "Eliminar itinerario"}
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="px-5 pt-5">
          <button
            type="button"
            onClick={() => setEjemplosAbiertos((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-[24px] bg-white px-5 py-4 text-left shadow-[0_10px_24px_rgba(15,23,42,0.06)]"
          >
            <div>
              <p className="text-base font-semibold text-[#111827]">Itinerarios de ejemplo</p>
              <p className="mt-1 text-sm text-[#6b7280]">
                {ejemplosAbiertos ? "Oculta los ejemplos." : "Despliega propuestas de referencia."}
              </p>
            </div>
            <div className="rounded-full bg-[#f8fafc] p-2 text-[#111827]">
              <IconoChevron open={ejemplosAbiertos} />
            </div>
          </button>

          {ejemplosAbiertos && (
            <div className="mt-4 space-y-4">
              {ejemplosFiltrados.map((item) => (
                <article key={item.id} className="overflow-hidden rounded-[28px] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.07)]">
                  <div className="relative h-[190px] overflow-hidden">
                    <img src={item.imagen} alt={item.titulo} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#111827] backdrop-blur">Ejemplo</span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${obtenerColorCategoria(item.categoria)}`}>
                        {item.categoria}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-[22px] font-bold leading-tight">{item.titulo}</h3>
                      <div className="mt-2 flex items-center gap-2 text-sm text-white/85">
                        <IconoUbicacion />
                        <span>{item.destino}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm leading-6 text-[#6b7280]">{item.subtitulo}</p>
                    <div className="mt-4 flex gap-3">
                      <button
                        type="button"
                        className="flex-1 rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-semibold text-[#111827]"
                        onClick={() => navigate(`/itinerarios/${item.id}`)}
                      >
                        Ver ejemplo
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
