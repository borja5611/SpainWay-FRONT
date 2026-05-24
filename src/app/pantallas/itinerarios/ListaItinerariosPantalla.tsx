import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/app/store/useAuthStore";
import BotonTiempoItinerario from "@/app/componentes/itinerarios/BotonTiempoItinerario";
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
  andalucia: "/pois-destacados/andalucia/alhambra.webp",
  asturias: "/pois-destacados/asturias/covadonga.webp",
  baleares: "/pois-destacados/baleares/ses-illetes.webp",
  canarias: "/pois-destacados/canarias/playa-cofete.webp",
  cantabria: "/pois-destacados/cantabria/san-vicente.webp",
  cataluna: "/pois-destacados/cataluña/sagrada-familia.webp",
  madrid: "/pois-destacados/madrid/museo-prado.webp",
  valencia: "/pois-destacados/valencia/artes-ciencias.webp",
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

function IconoFavorito() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3.8L14.55 9.02L20.28 9.86L16.14 13.92L17.12 19.64L12 16.94L6.88 19.64L7.86 13.92L3.72 9.86L9.45 9.02L12 3.8Z"
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

function limpiarResumenTecnico(texto?: string | null): string {
  const raw = (texto ?? "").trim();
  if (!raw) return "";

  const normalizado = normalizarTexto(raw);

  const esTecnico =
    normalizado.includes("itinerario hibrido") ||
    normalizado.includes("calidad ia1") ||
    normalizado.includes("ia2") ||
    normalizado.includes("distribucion [") ||
    normalizado.includes("actualizado:") ||
    normalizado.startsWith("he anadido") ||
    normalizado.startsWith("he eliminado") ||
    normalizado.startsWith("dia ");

  if (esTecnico) return "";

  return raw
    .replace(/\s+/g, " ")
    .replace(/\s*,\s*/g, ", ")
    .replace(/\s*\.\s*/g, ". ")
    .trim();
}

function crearResumenPresentable(item: Itinerario, totalDias: number, totalPois: number): string {
  const destino = item.destino ?? "tu destino";
  const transporte = item.transporte ? `, movilidad ${item.transporte}` : "";
  const base = item.base_nombre || item.base_direccion;
  const diasTexto = totalDias > 0 ? `${totalDias} día${totalDias === 1 ? "" : "s"}` : "varios días";
  const poisTexto = totalPois > 0 ? `${totalPois} lugar${totalPois === 1 ? "" : "es"}` : "lugares seleccionados";

  if (base) {
    return `Ruta personalizada por ${destino} durante ${diasTexto}, con ${poisTexto}${transporte} y base en ${base}.`;
  }

  return `Ruta personalizada por ${destino} durante ${diasTexto}, con ${poisTexto}${transporte} y propuesta organizada por jornadas.`;
}

function getResumen(item: Itinerario, totalDias = 0, totalPois = 0): string {
  const resumenLimpio = limpiarResumenTecnico(
    item.ia_resumen || item.ia_json?.summary || item.ia_json?.resumen,
  );

  return resumenLimpio || crearResumenPresentable(item, totalDias, totalPois);
}

function normalizarTexto(texto?: string | null): string {
  return (texto ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getImagenDestino(destino?: string | null): string {
  const key = normalizarTexto(destino);

  if (
    key.includes("andalucia") ||
    key.includes("malaga") ||
    key.includes("sevilla") ||
    key.includes("granada") ||
    key.includes("cordoba") ||
    key.includes("cadiz") ||
    key.includes("huelva") ||
    key.includes("jaen") ||
    key.includes("almeria")
  ) {
    return imagenesDestino.andalucia;
  }

  if (key.includes("asturias") || key.includes("oviedo") || key.includes("gijon")) {
    return imagenesDestino.asturias;
  }

  if (
    key.includes("baleares") ||
    key.includes("mallorca") ||
    key.includes("menorca") ||
    key.includes("ibiza") ||
    key.includes("formentera")
  ) {
    return imagenesDestino.baleares;
  }

  if (
    key.includes("canarias") ||
    key.includes("tenerife") ||
    key.includes("gran canaria") ||
    key.includes("lanzarote") ||
    key.includes("fuerteventura") ||
    key.includes("la palma")
  ) {
    return imagenesDestino.canarias;
  }

  if (key.includes("cantabria") || key.includes("santander")) {
    return imagenesDestino.cantabria;
  }

  if (
    key.includes("cataluna") ||
    key.includes("catalunya") ||
    key.includes("barcelona") ||
    key.includes("girona") ||
    key.includes("tarragona") ||
    key.includes("lleida")
  ) {
    return imagenesDestino.cataluna;
  }

  if (key.includes("madrid")) {
    return imagenesDestino.madrid;
  }

  if (
    key.includes("valencia") ||
    key.includes("alicante") ||
    key.includes("castellon") ||
    key.includes("comunidad valenciana")
  ) {
    return imagenesDestino.valencia;
  }

  return imagenesDestino.andalucia;
}

function getImagenItinerario(item: Itinerario): string {
  return getImagenDestino(
    [
      item.destino,
      item.titulo,
      item.ia_resumen,
      item.ia_json?.summary,
      item.ia_json?.resumen,
      item.base_nombre,
      item.base_direccion,
    ]
      .filter(Boolean)
      .join(" "),
  );
}

function deduplicarItinerariosVisuales(items: UserItinerary[]): UserItinerary[] {
  const vistos = new Map<string, UserItinerary>();

  for (const item of items) {
    const clave = [
      normalizarTexto(item.destino),
      normalizarTexto(item.titulo.replace(/^itinerario\s+/i, "")),
      item.dias,
      normalizarTexto(item.base ?? ""),
    ].join("|");

    const previo = vistos.get(clave);

    if (!previo || Number(item.idReal ?? 0) > Number(previo.idReal ?? 0)) {
      vistos.set(clave, item);
    }
  }

  return [...vistos.values()].sort((a, b) => Number(b.idReal ?? 0) - Number(a.idReal ?? 0));
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
    subtitulo: getResumen(item, totalDias, totalPois),
    destino: item.destino ?? "Destino sin definir",
    categoria: "Personalizado",
    dias: totalDias,
    lugares: String(totalPois),
    presupuesto: presupuestoLabel(item.presupuesto),
    progreso: item.estado?.includes("borrador") ? 60 : 100,
    imagen: getImagenItinerario(item),
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
  const idUsuario = usuario?.id_usuario ?? null;

  const [busqueda, setBusqueda] = useState("");
  const [filtroActivo, setFiltroActivo] = useState<
    "Todos" | CategoriaItinerario | "Personalizado"
  >("Todos");
  const [userItineraries, setUserItineraries] = useState<UserItinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [borrandoId, setBorrandoId] = useState<number | null>(null);
  const [confirmacionEliminar, setConfirmacionEliminar] = useState<UserItinerary | null>(null);
  const [ejemplosAbiertos, setEjemplosAbiertos] = useState(false);

  async function cargarItinerarios() {
    try {
      setLoading(true);
      setError(null);

      if (!idUsuario) {
        setUserItineraries([]);
        return;
      }

      const data = await getItinerariosResumen(idUsuario);
      setUserItineraries(Array.isArray(data) ? deduplicarItinerariosVisuales(data.map(mapItinerarioReal)) : []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar tus itinerarios. Inténtalo de nuevo en unos segundos.");
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
      setConfirmacionEliminar(null);
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar el itinerario. Inténtalo de nuevo.");
    } finally {
      setBorrandoId(null);
    }
  }

  return (
    <div className="min-h-full bg-[#f3f5f9] text-[#111827]">
      <div className="mx-auto w-full max-w-[430px] pb-28">
        <section className="px-5 pt-5">
          <div className="rounded-[30px] bg-gradient-to-br from-[#fff8f4] via-[#ffffff] to-[#f5f3ff] p-5 shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
            <p className="text-xs uppercase tracking-[0.18em] text-[#94a3b8]">
              Itinerarios
            </p>

            <h1 className="mt-2 text-[28px] font-bold tracking-[-0.03em] text-[#111827]">
              Retoma y organiza mejor tus viajes
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#667085]">
              Aquí verás primero los itinerarios reales guardados. Los ejemplos quedan separados
              para que no se mezclen con tus viajes.
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
              onClick={() => navigate("/favoritos")}
              className="rounded-[26px] bg-white p-5 text-left shadow-[0_12px_28px_rgba(15,23,42,0.07)]"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-[#94a3b8]">Favoritos</p>
              <h3 className="mt-2 text-[18px] font-bold text-[#111827]">POIs guardados</h3>
              <p className="mt-2 text-sm leading-6 text-[#667085]">
                Consulta en un mapa tus lugares marcados y revisa su descripción.
              </p>
              <div className="mt-4 inline-flex rounded-2xl bg-[#fff4ef] p-3 text-[#ff5a36]">
                <IconoFavorito />
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
            <p className="text-sm text-[#6b7280]">
              Aquí solo se muestran tus itinerarios reales.
            </p>
          </div>

          {loading ? (
            <div className="rounded-[24px] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
              <p className="text-sm font-semibold text-[#667085]">Cargando itinerarios...</p>
            </div>
          ) : itinerariosUsuarioFiltrados.length === 0 ? (
            <div className="rounded-[24px] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
              <p className="text-base font-semibold text-[#111827]">
                Aún no tienes itinerarios guardados
              </p>

              <p className="mt-2 text-sm leading-6 text-[#6b7280]">
                Cuando crees tu primer itinerario aparecerá aquí. Los ejemplos se pueden consultar
                en el desplegable inferior.
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
                  <div className="relative h-[190px] overflow-hidden bg-[#e5e7eb]">
                    <img
                      src={item.imagen}
                      alt={item.titulo}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#111827] backdrop-blur">
                        {item.dias || "-"} días
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${obtenerColorCategoria(
                          item.categoria,
                        )}`}
                      >
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
                    <p className="line-clamp-3 text-sm leading-6 text-[#6b7280]">
                      {item.subtitulo}
                    </p>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="rounded-2xl bg-[#f8fafc] p-3">
                        <p className="text-xs text-[#94a3b8]">Lugares</p>
                        <p className="mt-1 text-sm font-semibold text-[#0f172a]">
                          {item.lugares}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-[#f8fafc] p-3">
                        <p className="text-xs text-[#94a3b8]">Presupuesto</p>
                        <p className="mt-1 text-sm font-semibold text-[#0f172a]">
                          {item.presupuesto}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-[#f8fafc] p-3">
                        <p className="text-xs text-[#94a3b8]">Avance</p>
                        <p className="mt-1 text-sm font-semibold text-[#0f172a]">
                          {item.progreso}%
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-[#edf0f4] bg-[#fcfcfd] p-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[#111827]">
                        <IconoCalendario />
                        Siguiente paso
                      </div>

                      <p className="mt-2 text-sm leading-5 text-[#6b7280]">
                        Revisa la propuesta y ajusta cada día según tus preferencias.
                      </p>
                    </div>

                    {item.base && (
                      <div className="mt-3 rounded-2xl bg-[#fff7f3] p-3 text-xs leading-5 text-[#9a3412]">
                        Base: {item.base}
                      </div>
                    )}

                    {item.idReal && (
                      <BotonTiempoItinerario
                        idItinerario={item.idReal}
                        destino={item.destino}
                      />
                    )}

                    <button
                      type="button"
                      className="mt-3 w-full rounded-2xl bg-[#ff5a36] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(255,90,54,0.28)]"
                      onClick={() => navigate(`/itinerarios/${item.id}`)}
                    >
                      Ver itinerario
                    </button>

                    <button
                      type="button"
                      onClick={() => setConfirmacionEliminar(item)}
                      className="mt-3 w-full rounded-2xl border border-[#fecaca] bg-white px-4 py-3 text-sm font-semibold text-[#dc2626]"
                    >
                      Eliminar itinerario
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="px-5 pt-6">
          <button
            type="button"
            onClick={() => setEjemplosAbiertos((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-[24px] bg-white px-5 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.06)]"
          >
            <div>
              <p className="text-left text-[18px] font-bold text-[#111827]">
                Ejemplos visuales
              </p>
              <p className="text-left text-sm text-[#6b7280]">
                Inspiración con tarjetas demo, separadas de tus datos reales.
              </p>
            </div>

            <IconoChevron open={ejemplosAbiertos} />
          </button>

          {ejemplosAbiertos && (
            <div className="mt-4 space-y-4">
              {ejemplosFiltrados.length === 0 ? (
                <div className="rounded-[24px] bg-white p-5 text-sm text-[#6b7280] shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
                  No hay ejemplos que coincidan con tu búsqueda actual.
                </div>
              ) : (
                ejemplosFiltrados.map((item) => (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-[28px] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.07)]"
                  >
                    <div className="relative h-[185px] overflow-hidden bg-[#e5e7eb]">
                      <img
                        src={item.imagen}
                        alt={item.titulo}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

                      <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#111827] backdrop-blur">
                          {item.dias} días
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${obtenerColorCategoria(
                            item.categoria,
                          )}`}
                        >
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
                      <p className="line-clamp-3 text-sm leading-6 text-[#6b7280]">
                        {item.subtitulo}
                      </p>

                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <div className="rounded-2xl bg-[#f8fafc] p-3">
                          <p className="text-xs text-[#94a3b8]">Lugares</p>
                          <p className="mt-1 text-sm font-semibold text-[#0f172a]">
                            {item.lugares}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-[#f8fafc] p-3">
                          <p className="text-xs text-[#94a3b8]">Presupuesto</p>
                          <p className="mt-1 text-sm font-semibold text-[#0f172a]">
                            {item.presupuesto}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-[#f8fafc] p-3">
                          <p className="text-xs text-[#94a3b8]">Avance</p>
                          <p className="mt-1 text-sm font-semibold text-[#0f172a]">
                            {item.progreso}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          )}
        </section>

        {confirmacionEliminar && (
          <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/40 p-4 sm:items-center">
            <div className="w-full max-w-[380px] rounded-[28px] bg-white p-5 shadow-[0_20px_48px_rgba(15,23,42,0.18)]">
              <p className="text-lg font-bold text-[#111827]">Eliminar itinerario</p>

              <p className="mt-2 text-sm leading-6 text-[#6b7280]">
                Vas a eliminar{" "}
                <span className="font-semibold text-[#111827]">
                  {confirmacionEliminar.titulo}
                </span>
                . Esta acción no se puede deshacer.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmacionEliminar(null)}
                  className="rounded-2xl border border-[#e5e7eb] px-4 py-3 text-sm font-semibold text-[#374151]"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={() => void borrarItinerario(confirmacionEliminar.idReal)}
                  disabled={borrandoId === confirmacionEliminar.idReal}
                  className="rounded-2xl bg-[#dc2626] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {borrandoId === confirmacionEliminar.idReal ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}