import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  itinerariosMock,
  type CategoriaItinerario,
} from "../../datos/mock/itinerariosMock";
import { getItinerarios, type Itinerario } from "@/app/servicios/itinerarios";
import { useAuthStore } from "@/app/store/useAuthStore";

const filtros: Array<"Todos" | CategoriaItinerario> = [
  "Todos",
  "Escapada",
  "Cultural",
  "Costa",
  "Gastronomía",
  "Naturaleza",
];

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
      <circle cx="12" cy="10.5" r="2.5" stroke="currentColor" strokeWidth="1.8" />
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

function colorCategoria(categoria: CategoriaItinerario) {
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
    default:
      return "bg-[#f3f4f6] text-[#374151]";
  }
}

type ItinerarioDemo = (typeof itinerariosMock)[number];

function obtenerDescripcionPreview(item: ItinerarioDemo) {
  return (
    item.subtitulo ||
    `Una propuesta de ${item.dias} días en ${item.destino} con un enfoque ${item.categoria.toLowerCase()}.`
  );
}

function formatearFecha(valor?: string | null) {
  if (!valor) return "Sin fecha";
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return "Sin fecha";
  return fecha.toLocaleDateString("es-ES");
}

function construirTituloReal(item: Itinerario) {
  return item.titulo || "Itinerario sin título";
}

function construirSubtituloReal(item: Itinerario) {
  const destino = item.destino || "Destino sin definir";
  const inicio = formatearFecha(item.inicio);
  const fin = formatearFecha(item.fin);

  if (inicio !== "Sin fecha" || fin !== "Sin fecha") {
    return `${destino} · ${inicio} - ${fin}`;
  }

  return destino;
}

export default function ListaItinerariosPantalla() {
  const navigate = useNavigate();
  const { usuario } = useAuthStore();

  const [busqueda, setBusqueda] = useState("");
  const [filtroActivo, setFiltroActivo] = useState<"Todos" | CategoriaItinerario>(
    "Todos"
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [itinerariosReales, setItinerariosReales] = useState<Itinerario[]>([]);

  const [itinerarioPreview, setItinerarioPreview] = useState<ItinerarioDemo | null>(null);

  useEffect(() => {
    async function cargarItinerarios() {
      if (!usuario?.id_usuario) {
        setLoading(false);
        setError("No hay usuario autenticado.");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getItinerarios(usuario.id_usuario);
        setItinerariosReales(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los itinerarios reales.");
        setItinerariosReales([]);
      } finally {
        setLoading(false);
      }
    }

    void cargarItinerarios();
  }, [usuario?.id_usuario]);

  const hayItinerariosReales = itinerariosReales.length > 0;

  const destacados = itinerariosMock.filter((item) => item.destacado);

  const itinerariosMockFiltrados = useMemo(() => {
    return itinerariosMock.filter((item) => {
      const coincideFiltro =
        filtroActivo === "Todos" ? true : item.categoria === filtroActivo;

      const texto = [
        item.titulo,
        item.subtitulo,
        item.destino,
        item.categoria,
        item.etiquetas.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      const coincideBusqueda = texto.includes(busqueda.toLowerCase());

      return coincideFiltro && coincideBusqueda;
    });
  }, [busqueda, filtroActivo]);

  const itinerariosRealesFiltrados = useMemo(() => {
    return itinerariosReales.filter((item) => {
      const texto = [
        item.titulo || "",
        item.destino || "",
        item.estado || "",
        item.transporte || "",
      ]
        .join(" ")
        .toLowerCase();

      return texto.includes(busqueda.toLowerCase());
    });
  }, [itinerariosReales, busqueda]);

  const resumenReal = useMemo(() => {
    return {
      guardados: itinerariosReales.length,
      enProgreso: itinerariosReales.filter(
        (i) => (i.estado || "").toLowerCase() !== "archivado"
      ).length,
      destinos: new Set(
        itinerariosReales
          .map((i) => i.destino)
          .filter((x): x is string => Boolean(x))
      ).size,
    };
  }, [itinerariosReales]);

  const resumenMock = useMemo(() => {
    return {
      guardados: 0,
      enProgreso: 0,
      destinos: 0,
    };
  }, []);

  const resumen = hayItinerariosReales ? resumenReal : resumenMock;

  if (loading) {
    return (
      <div className="min-h-full bg-[#f3f5f9] text-[#111827] px-5 py-6">
        <div className="mx-auto w-full max-w-[430px] rounded-[28px] bg-white p-6 text-center shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
          <p className="text-sm text-[#667085]">Cargando itinerarios...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-full bg-[#f3f5f9] text-[#111827]">
        <div className="mx-auto w-full max-w-[430px] pb-28">
          <section className="px-5 pt-5">
            <div className="rounded-[30px] bg-gradient-to-br from-[#fff8f4] via-[#ffffff] to-[#f4f1ff] p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-[16px] font-bold tracking-[-0.02em] text-[#0f172a]">
                    Retoma y organiza mejor tus viajes
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#667085]">
                    Busca itinerarios guardados, abre sus detalles o revisa una vista previa antes de entrar.
                  </p>
                </div>

                <button
                  type="button"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
                >
                  <IconoFiltro />
                </button>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-white/90 p-3 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                  <p className="text-xs text-[#6b7280]">Guardados</p>
                  <p className="mt-1 text-xl font-bold">{resumen.guardados}</p>
                </div>

                <div className="rounded-2xl bg-white/90 p-3 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                  <p className="text-xs text-[#6b7280]">En progreso</p>
                  <p className="mt-1 text-xl font-bold">{resumen.enProgreso}</p>
                </div>

                <div className="rounded-2xl bg-white/90 p-3 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                  <p className="text-xs text-[#6b7280]">Destinos</p>
                  <p className="mt-1 text-xl font-bold">{resumen.destinos}</p>
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <div className="flex flex-1 items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                  <IconoBusqueda />
                  <input
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder={
                      hayItinerariosReales
                        ? "Buscar itinerarios reales..."
                        : "Buscar ejemplos por destino, estilo o categoría..."
                    }
                    className="w-full bg-transparent text-sm outline-none placeholder:text-[#9ca3af]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/itinerarios/crear")}
                  className="flex h-[56px] w-[56px] items-center justify-center rounded-2xl bg-[#ff5a36] text-[28px] leading-none text-white shadow-[0_12px_24px_rgba(255,90,54,0.28)]"
                  aria-label="Crear itinerario"
                >
                  +
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

          {hayItinerariosReales ? (
            <section className="px-5 pt-5 space-y-4">
              {itinerariosRealesFiltrados.length === 0 ? (
                <div className="rounded-[28px] bg-white p-6 text-center shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
                  <p className="text-[18px] font-bold text-[#111827]">
                    No hay resultados para esa búsqueda
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#667085]">
                    Prueba con otro título, destino o estado.
                  </p>
                </div>
              ) : (
                itinerariosRealesFiltrados.map((item) => (
                  <article
                    key={item.id_itinerario}
                    className="rounded-[28px] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="inline-flex rounded-full bg-[#fff4ef] px-3 py-1 text-xs font-semibold text-[#ff5a36]">
                          {item.estado || "activo"}
                        </p>

                        <h3 className="mt-3 text-[20px] font-bold text-[#111827] break-words">
                          {construirTituloReal(item)}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-[#667085] break-words">
                          {construirSubtituloReal(item)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => navigate(`/itinerarios/detalle/${item.id_itinerario}`)}
                        className="shrink-0 rounded-xl bg-[#ff5a36] px-4 py-2 text-sm font-semibold text-white"
                      >
                        Ver
                      </button>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <MiniDato label="Presupuesto" value={item.presupuesto ? `${item.presupuesto}` : "—"} />
                      <MiniDato label="Transporte" value={item.transporte || "—"} />
                      <MiniDato label="Inicio" value={formatearFecha(item.inicio)} />
                      <MiniDato label="Fin" value={formatearFecha(item.fin)} />
                    </div>
                  </article>
                ))
              )}
            </section>
          ) : (
            <>
              <section className="px-5 pt-5">
                <div className="rounded-[28px] bg-white p-6 text-center shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
                  <h2 className="text-[20px] font-bold text-[#111827]">
                    Vaya, no hay ningún itinerario guardado
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#667085]">
                    Todavía no has creado rutas en tu cuenta. Mientras tanto, aquí tienes algunos ejemplos para inspirarte.
                  </p>
                </div>
              </section>

              <section className="px-5 pt-5">
                <div className="mb-3">
                  <h2 className="text-[18px] font-bold tracking-[-0.02em]">Ejemplos destacados</h2>
                  <p className="text-sm text-[#6b7280]">
                    Ideas visuales para que veas cómo podrían ser tus próximos itinerarios.
                  </p>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {destacados.map((item) => (
                    <article
                      key={item.id}
                      className="min-w-[290px] overflow-hidden rounded-[28px] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                    >
                      <div className="relative h-[180px] overflow-hidden">
                        <img
                          src={item.imagen}
                          alt={item.titulo}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

                        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#111827] backdrop-blur">
                          <span className="text-[#ff5a36]">
                            <IconoSparkle />
                          </span>
                          Ejemplo
                        </div>

                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <h3 className="text-[21px] font-bold leading-tight">{item.titulo}</h3>
                          <p className="mt-1 text-sm text-white/85">
                            {item.dias} días · {item.destino}
                          </p>
                        </div>
                      </div>

                      <div className="p-4">
                        <p className="text-sm leading-5 text-[#6b7280]">
                          {obtenerDescripcionPreview(item)}
                        </p>

                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#eceff5]">
                          <div
                            className="h-full rounded-full bg-[#ff5a36]"
                            style={{ width: `${item.progreso}%` }}
                          />
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <span className="text-sm text-[#6b7280]">
                            {item.progreso}% completado
                          </span>
                          <button
                            type="button"
                            onClick={() => setItinerarioPreview(item)}
                            className="rounded-full bg-[#111827] px-4 py-2 text-sm font-semibold text-white"
                          >
                            Vista previa
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
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

              <section className="px-5 pt-5 space-y-4">
                {itinerariosMockFiltrados.map((item) => (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-[28px] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                  >
                    <div className="relative h-[180px] overflow-hidden">
                      <img
                        src={item.imagen}
                        alt={item.titulo}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

                      <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${colorCategoria(
                            item.categoria
                          )}`}
                        >
                          {item.categoria}
                        </span>
                        {item.etiquetas.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#111827]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="text-[22px] font-bold leading-tight">{item.titulo}</h3>
                        <p className="mt-1 text-sm text-white/85">{item.subtitulo}</p>
                      </div>
                    </div>

                    <div className="p-4">
                      <p className="text-sm leading-6 text-[#667085]">
                        {obtenerDescripcionPreview(item)}
                      </p>

                      <div className="mt-4 grid grid-cols-3 gap-3">
                        <MiniDato label="Días" value={`${item.dias}`} />
                        <MiniDato label="Budget" value={item.presupuesto} />
                        <MiniDato label="Avance" value={`${item.progreso}%`} />
                      </div>

                      <div className="mt-4 flex items-center gap-2 text-sm text-[#667085]">
                        <span className="text-[#ff5a36]">
                          <IconoUbicacion />
                        </span>
                        {item.destino}
                      </div>

                      <div className="mt-5 flex gap-3">
                        <button
                          type="button"
                          onClick={() => setItinerarioPreview(item)}
                          className="flex-1 rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-semibold text-[#111827]"
                        >
                          Ver ejemplo
                        </button>

                        <button
                          type="button"
                          onClick={() => navigate("/itinerarios/crear")}
                          className="flex-1 rounded-2xl bg-[#ff5a36] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(255,90,54,0.28)]"
                        >
                          Crear itinerario
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </section>
            </>
          )}
        </div>
      </div>

      {itinerarioPreview && (
        <>
          <div
            className="fixed inset-0 z-[80] bg-black/45"
            onClick={() => setItinerarioPreview(null)}
          />
          <div className="fixed inset-0 z-[90] flex items-center justify-center px-5 py-10">
            <div className="w-full max-w-[420px] overflow-hidden rounded-[30px] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.25)]">
              <div className="relative h-[220px] overflow-hidden">
                <img
                  src={itinerarioPreview.imagen}
                  alt={itinerarioPreview.titulo}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                <button
                  type="button"
                  onClick={() => setItinerarioPreview(null)}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#111827]"
                >
                  ×
                </button>

                <div className="absolute left-5 bottom-5 right-5 text-white">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${colorCategoria(
                        itinerarioPreview.categoria
                      )}`}
                    >
                      {itinerarioPreview.categoria}
                    </span>
                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#111827]">
                      {itinerarioPreview.dias} días
                    </span>
                  </div>

                  <h3 className="text-[24px] font-bold leading-tight">
                    {itinerarioPreview.titulo}
                  </h3>
                  <p className="mt-1 text-sm text-white/85">
                    {itinerarioPreview.destino}
                  </p>
                </div>
              </div>

              <div className="p-5">
                <p className="text-sm leading-7 text-[#667085]">
                  {obtenerDescripcionPreview(itinerarioPreview)}
                </p>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <MiniDato label="Presupuesto" value={itinerarioPreview.presupuesto} />
                  <MiniDato label="Avance" value={`${itinerarioPreview.progreso}%`} />
                  <MiniDato label="Estilo" value={itinerarioPreview.categoria} />
                </div>

                <div className="mt-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-[#94a3b8]">
                    Qué incluiría
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {itinerarioPreview.etiquetas.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[#f8fafc] px-3 py-2 text-sm font-medium text-[#374151]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setItinerarioPreview(null)}
                    className="flex-1 rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-semibold text-[#111827]"
                  >
                    Cerrar
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setItinerarioPreview(null);
                      navigate("/itinerarios/crear");
                    }}
                    className="flex-1 rounded-2xl bg-[#ff5a36] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(255,90,54,0.28)]"
                  >
                    Usar como base
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function MiniDato({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#f8fafc] p-3 text-center">
      <p className="text-[11px] text-[#94a3b8]">{label}</p>
      <p className="mt-1 text-sm font-bold text-[#111827] break-words">{value}</p>
    </div>
  );
}