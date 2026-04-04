import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  itinerariosMock,
  type CategoriaItinerario,
} from "../../datos/mock/itinerariosMock";

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

function obtenerColorCategoria(categoria: CategoriaItinerario) {
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

export default function ListaItinerariosPantalla() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");
  const [filtroActivo, setFiltroActivo] = useState<"Todos" | CategoriaItinerario>(
    "Todos"
  );

  const destacados = itinerariosMock.filter((item) => item.destacado);

  const itinerariosFiltrados = useMemo(() => {
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

  return (
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
                  Busca itinerarios guardados, abre sus detalles o crea uno nuevo
                  para generar después la propuesta con IA.
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
                <p className="mt-1 text-xl font-bold">{itinerariosMock.length}</p>
              </div>

              <div className="rounded-2xl bg-white/90 p-3 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                <p className="text-xs text-[#6b7280]">En progreso</p>
                <p className="mt-1 text-xl font-bold">
                  {itinerariosMock.filter((i) => i.progreso < 100).length}
                </p>
              </div>

              <div className="rounded-2xl bg-white/90 p-3 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                <p className="text-xs text-[#6b7280]">Destinos</p>
                <p className="mt-1 text-xl font-bold">
                  {new Set(itinerariosMock.map((i) => i.destino)).size}
                </p>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <div className="flex flex-1 items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                <IconoBusqueda />
                <input
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar destino, estilo o categoría..."
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

        <section className="px-5 pt-5">
          <div className="mb-3">
            <h2 className="text-[18px] font-bold tracking-[-0.02em]">Destacados</h2>
            <p className="text-sm text-[#6b7280]">
              Tus rutas con más potencial y mejor nivel de avance.
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
                    Recomendado
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-[21px] font-bold leading-tight">{item.titulo}</h3>
                    <p className="mt-1 text-sm text-white/85">
                      {item.dias} días · {item.destino}
                    </p>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-sm leading-5 text-[#6b7280]">{item.subtitulo}</p>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#eceff5]">
                    <div
                      className="h-full rounded-full bg-[#ff5a36]"
                      style={{ width: `${item.progreso}%` }}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="text-sm text-[#6b7280]">{item.progreso}% completado</span>
                    <button
                      type="button"
                      onClick={() => navigate(`/itinerarios/${item.id}`)}
                      className="rounded-full bg-[#111827] px-4 py-2 text-sm font-semibold text-white"
                    >
                      Ver detalle
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

        <section className="px-5 pt-5">
          <div className="rounded-[28px] bg-gradient-to-r from-[#111827] to-[#1f2937] p-5 text-white shadow-[0_14px_30px_rgba(17,24,39,0.18)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                  Continuar planificación
                </p>
                <h3 className="mt-2 text-[18px] font-bold">Ruta por Andalucía</h3>
                <p className="mt-2 text-sm leading-5 text-white/75">
                  Te falta equilibrar traslados y cerrar mejor el orden de ciudades
                  para que el viaje sea más cómodo.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-3">
                <IconoCalendario />
              </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[56%] rounded-full bg-[#ff5a36]" />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-white/70">56% completado</span>
              <button
                type="button"
                onClick={() => navigate("/itinerarios/andalucia-5-dias")}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#111827]"
              >
                Seguir
              </button>
            </div>
          </div>
        </section>

        <section className="px-5 pt-5">
          <div className="mb-3">
            <h2 className="text-[18px] font-bold tracking-[-0.02em]">Tus itinerarios</h2>
            <p className="text-sm text-[#6b7280]">
              Abre cada viaje y consulta ya su estructura, preguntas de IA y plan por días.
            </p>
          </div>

          <div className="space-y-4">
            {itinerariosFiltrados.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-[28px] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.07)]"
              >
                <div className="relative h-[190px] overflow-hidden">
                  <img
                    src={item.imagen}
                    alt={item.titulo}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#111827] backdrop-blur">
                      {item.dias} días
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${obtenerColorCategoria(
                        item.categoria
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
                  <p className="text-sm leading-6 text-[#6b7280]">{item.subtitulo}</p>

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
                      {item.siguientePaso}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.etiquetas.map((etiqueta) => (
                      <span
                        key={etiqueta}
                        className="rounded-full bg-[#fff4ef] px-3 py-1 text-xs font-medium text-[#ff5a36]"
                      >
                        {etiqueta}
                      </span>
                    ))}

                    <span className="rounded-full bg-[#f3f4f6] px-3 py-1 text-xs font-medium text-[#4b5563]">
                      {item.temporada}
                    </span>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <button
                      type="button"
                      className="flex-1 rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-semibold text-[#111827]"
                      onClick={() => navigate(`/itinerarios/${item.id}`)}
                    >
                      Ver detalle
                    </button>

                    <button
                      type="button"
                      className="flex-1 rounded-2xl bg-[#ff5a36] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(255,90,54,0.28)]"
                      onClick={() => navigate(`/itinerarios/${item.id}`)}
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {itinerariosFiltrados.length === 0 && (
            <div className="mt-4 rounded-[24px] bg-white p-6 text-center shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
              <p className="text-base font-semibold text-[#111827]">
                No se han encontrado itinerarios
              </p>
              <p className="mt-2 text-sm text-[#6b7280]">
                Prueba con otra búsqueda o cambia el filtro activo.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}