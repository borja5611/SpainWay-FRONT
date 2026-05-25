import { useMemo, useState } from "react";
import {
  buscarRestauracionCercana,
  eliminarSeleccionRestauracion,
  getDetalleRestauracion,
  seleccionarRestauracion,
  type DetalleRestaurante,
  type LugarRestauracion,
  type MomentoRestauracion,
  type OrdenRestauracion,
  type PresupuestoEstimado,
  type SeleccionRestauracion,
  type TipoRestauracion,
} from "@/app/servicios/restauracion";

type PoiRestauracion = {
  nombre: string;
  idPoi: number | null;
  latitud: number | null;
  longitud: number | null;
};

type Props = {
  idItinerario: number;
  idDiaItinerario: number | null;
  diaNumero: number;
  pois: PoiRestauracion[];
  selecciones: SeleccionRestauracion[];
  onChange: () => Promise<void> | void;
};

const MOMENTOS: { id: MomentoRestauracion; label: string; icono: string }[] = [
  { id: "desayuno", label: "Desayuno", icono: "☕" },
  { id: "comida", label: "Comida", icono: "🍽️" },
  { id: "cena", label: "Cena", icono: "🌙" },
  { id: "cafe", label: "Café", icono: "🥐" },
];

const TIPOS: { id: TipoRestauracion; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "restaurante", label: "Restaurante" },
  { id: "tapas", label: "Tapas" },
  { id: "cafeteria", label: "Cafetería" },
  { id: "bar", label: "Bar" },
  { id: "fast_food", label: "Rápido" },
  { id: "pasteleria", label: "Pastelería" },
];

const PRESUPUESTOS: { id: PresupuestoEstimado; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "bajo", label: "Bajo" },
  { id: "medio", label: "Medio" },
  { id: "alto", label: "Alto" },
];

const ORDENES: { id: OrdenRestauracion; label: string }[] = [
  { id: "recomendado", label: "Recomendado" },
  { id: "cercania", label: "Más cercano" },
  { id: "contacto", label: "Con contacto" },
];

function metrosLabel(value?: number | null) {
  if (!value) return "distancia no disponible";
  if (value < 1000) return `${value} m`;
  return `${(value / 1000).toFixed(1)} km`;
}

function proveedorLabel(value?: string | null) {
  if (value === "foursquare") return "Foursquare";
  if (value === "openstreetmap") return "OpenStreetMap";
  return value ?? "Fuente externa";
}

function presupuestoLabel(value?: string | null) {
  if (value === "bajo") return "Bajo";
  if (value === "medio") return "Medio";
  if (value === "alto") return "Alto";
  return "Estimado";
}

export default function BloqueRestauracionDia({
  idItinerario,
  idDiaItinerario,
  diaNumero,
  pois,
  selecciones,
  onChange,
}: Props) {
  const [abierto, setAbierto] = useState(false);
  const [momento, setMomento] = useState<MomentoRestauracion>("comida");
  const [tipo, setTipo] = useState<TipoRestauracion>("todos");
  const [presupuesto, setPresupuesto] = useState<PresupuestoEstimado>("todos");
  const [orden, setOrden] = useState<OrdenRestauracion>("recomendado");
  const [soloConContacto, setSoloConContacto] = useState(false);
  const [radio, setRadio] = useState(1200);
  const [poiIndex, setPoiIndex] = useState(0);
  const [resultados, setResultados] = useState<LugarRestauracion[]>([]);
  const [detalle, setDetalle] = useState<DetalleRestaurante | null>(null);
  const [cargando, setCargando] = useState(false);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [guardandoId, setGuardandoId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const poisConCoords = useMemo(
    () => pois.filter((poi) => poi.latitud !== null && poi.longitud !== null),
    [pois]
  );

  const poiReferencia = poisConCoords[poiIndex] ?? poisConCoords[0] ?? null;

  const seleccionMomento = selecciones.find(
    (item) => item.id_dia_itinerario === idDiaItinerario && item.momento === momento
  );

  async function buscar() {
    if (!idDiaItinerario) {
      setError("Este día todavía no tiene id de base de datos.");
      return;
    }

    if (!poiReferencia?.latitud || !poiReferencia?.longitud) {
      setError("No hay coordenadas disponibles en los POIs de este día.");
      return;
    }

    try {
      setCargando(true);
      setError(null);
      setResultados([]);

      const data = await buscarRestauracionCercana({
        lat: poiReferencia.latitud,
        lng: poiReferencia.longitud,
        radio,
        momento,
        tipo,
        presupuesto,
        orden,
        soloConContacto,
      });

      setResultados(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar restaurantes.");
    } finally {
      setCargando(false);
    }
  }

  async function seleccionar(lugar: LugarRestauracion) {
    if (!idDiaItinerario) return;

    try {
      setGuardandoId(lugar.id_lugar_restauracion);

      await seleccionarRestauracion({
        id_itinerario: idItinerario,
        id_dia_itinerario: idDiaItinerario,
        momento,
        id_lugar_restauracion: lugar.id_lugar_restauracion,
        id_poi_referencia: poiReferencia?.idPoi ?? null,
      });

      await onChange();
    } finally {
      setGuardandoId(null);
    }
  }

  async function quitar(idSeleccion: number) {
    await eliminarSeleccionRestauracion(idSeleccion);
    await onChange();
  }

  async function abrirDetalle(lugar: LugarRestauracion) {
    try {
      setCargandoDetalle(true);
      setDetalle(null);
      const data = await getDetalleRestauracion(lugar.id_lugar_restauracion);
      setDetalle(data);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar la ficha del restaurante.");
    } finally {
      setCargandoDetalle(false);
    }
  }

  return (
    <section className="mt-6 overflow-hidden rounded-[28px] border border-[#eef2f7] bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
      <button
        type="button"
        onClick={() => setAbierto((value) => !value)}
        className="flex w-full flex-col items-stretch justify-between gap-4 bg-gradient-to-br from-[#fff8f4] via-white to-[#f8fafc] p-5 text-left sm:flex-row sm:items-center"
      >
        <div className="min-w-0 flex-1">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff5a36]">
            Restauración inteligente
          </p>
          <h3 className="mt-2 text-xl font-black tracking-[-0.03em] text-[#111827]">
            Añadir desayuno, comida o cena al día {diaNumero}
          </h3>
          <p className="mt-1 text-sm leading-6 text-[#667085]">
            Busca restaurantes reales cerca de tus POIs con la misma idea de resultados limpios que en Inicio, priorizando cercanía, contacto y calidad.
          </p>
        </div>

        <span className="inline-flex w-full shrink-0 items-center justify-center rounded-full bg-[#111827] px-4 py-3 text-xs font-black text-white sm:w-auto">
          {abierto ? "Cerrar" : "Buscar comida"}
        </span>
      </button>

      {abierto && (
        <div className="space-y-5 p-5">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {MOMENTOS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setMomento(item.id)}
                className={`rounded-2xl px-4 py-3 text-left transition ${
                  momento === item.id
                    ? "bg-[#111827] text-white shadow-[0_12px_24px_rgba(15,23,42,0.18)]"
                    : "bg-[#f8fafc] text-[#344054]"
                }`}
              >
                <span className="text-lg">{item.icono}</span>
                <span className="ml-2 text-sm font-black">{item.label}</span>
              </button>
            ))}
          </div>

          {seleccionMomento && (
            <div className="rounded-[24px] border border-[#bbf7d0] bg-[#f0fdf4] p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#16a34a]">
                Seleccionado para {momento}
              </p>

              <div className="mt-2 flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div>
                  <h4 className="text-lg font-black text-[#111827]">
                    {seleccionMomento.lugar.nombre}
                  </h4>
                  <p className="mt-1 text-sm font-semibold text-[#667085]">
                    {seleccionMomento.lugar.categoria ?? "Restauración"} ·{" "}
                    {metrosLabel(seleccionMomento.lugar.distancia)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => abrirDetalle(seleccionMomento.lugar)}
                    className="rounded-full bg-white px-4 py-2 text-xs font-black text-[#111827]"
                  >
                    Info
                  </button>

                  {(seleccionMomento.lugar.googleUrl || seleccionMomento.lugar.url) && (
                    <a
                      href={seleccionMomento.lugar.googleUrl ?? seleccionMomento.lugar.url ?? "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-white px-4 py-2 text-xs font-black text-[#ff5a36]"
                    >
                      Google
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => quitar(seleccionMomento.id_itinerario_restauracion)}
                    className="rounded-full bg-[#dc2626] px-4 py-2 text-xs font-black text-white"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-3 md:grid-cols-3">
            <label className="block">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-[#94a3b8]">
                Buscar cerca de
              </span>
              <select
                value={poiIndex}
                onChange={(event) => setPoiIndex(Number(event.target.value))}
                className="mt-2 w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-bold text-[#111827] outline-none"
              >
                {poisConCoords.map((poi, index) => (
                  <option key={`${poi.nombre}-${index}`} value={index}>
                    {poi.nombre}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-[#94a3b8]">
                Tipo
              </span>
              <select
                value={tipo}
                onChange={(event) => setTipo(event.target.value as TipoRestauracion)}
                className="mt-2 w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-bold text-[#111827] outline-none"
              >
                {TIPOS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-[#94a3b8]">
                Radio
              </span>
              <select
                value={radio}
                onChange={(event) => setRadio(Number(event.target.value))}
                className="mt-2 w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-bold text-[#111827] outline-none"
              >
                <option value={500}>500 m</option>
                <option value={1000}>1 km</option>
                <option value={1200}>1.2 km</option>
                <option value={2000}>2 km</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-[#94a3b8]">
                Presupuesto estimado
              </span>
              <select
                value={presupuesto}
                onChange={(event) => setPresupuesto(event.target.value as PresupuestoEstimado)}
                className="mt-2 w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-bold text-[#111827] outline-none"
              >
                {PRESUPUESTOS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-[#94a3b8]">
                Orden
              </span>
              <select
                value={orden}
                onChange={(event) => setOrden(event.target.value as OrdenRestauracion)}
                className="mt-2 w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-bold text-[#111827] outline-none"
              >
                {ORDENES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex items-end">
              <button
                type="button"
                onClick={() => setSoloConContacto((value) => !value)}
                className={`w-full rounded-2xl px-4 py-3 text-sm font-black transition ${
                  soloConContacto
                    ? "bg-[#111827] text-white"
                    : "bg-[#f8fafc] text-[#344054]"
                }`}
              >
                {soloConContacto ? "Solo con contacto ✓" : "Permitir sin contacto"}
              </button>
            </label>
          </div>

          <button
            type="button"
            onClick={buscar}
            disabled={cargando || !poiReferencia}
            className="w-full rounded-[22px] bg-[#ff5a36] px-5 py-4 text-sm font-black text-white shadow-[0_16px_32px_rgba(255,90,54,0.25)] transition hover:-translate-y-0.5 hover:bg-[#ff4320] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cargando ? "Buscando restaurantes..." : "Buscar recomendaciones cerca del POI"}
          </button>

          {error && (
            <div className="rounded-2xl bg-[#fef2f2] p-4 text-sm font-bold text-[#b42318]">
              {error}
            </div>
          )}

          {cargandoDetalle && (
            <div className="rounded-2xl bg-[#f8fafc] p-4 text-sm font-bold text-[#344054]">
              Cargando ficha del restaurante...
            </div>
          )}

          {resultados.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {resultados.map((lugar, index) => (
                <article
                  key={lugar.id_lugar_restauracion}
                  className="overflow-hidden rounded-[28px] border border-[#eef2f7] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
                >
                  <div className="flex h-[116px] items-center justify-center bg-gradient-to-br from-[#fff4ef] via-[#f8fafc] to-[#eef2ff] text-4xl">
                    🍽️
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ff5a36]">
                          Recomendación #{index + 1}
                        </p>
                        <h4 className="mt-2 line-clamp-2 text-lg font-black leading-tight text-[#111827]">
                          {lugar.nombre}
                        </h4>
                      </div>

                      <div className="rounded-2xl bg-white px-3 py-2 text-center shadow-sm">
                        <p className="text-xs font-black text-[#94a3b8]">Score</p>
                        <p className="text-lg font-black text-[#111827]">{lugar.score ?? 0}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#f8fafc] px-3 py-1 text-xs font-black text-[#344054]">
                        {lugar.categoria ?? "Restauración"}
                      </span>
                      <span className="rounded-full bg-[#f8fafc] px-3 py-1 text-xs font-black text-[#344054]">
                        {metrosLabel(lugar.distancia)}
                      </span>
                      <span className="rounded-full bg-[#ecfdf3] px-3 py-1 text-xs font-black text-[#16a34a]">
                        Presupuesto {presupuestoLabel(lugar.presupuestoEstimado ?? lugar.precio)}
                      </span>
                    </div>

                    {lugar.direccion && (
                      <p className="mt-3 text-sm leading-6 text-[#667085]">
                        {lugar.direccion}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-[#667085]">
                      {lugar.telefono && <span>☎ Tiene teléfono</span>}
                      {lugar.website && <span>🌐 Tiene web</span>}
                      <span>Fuente: {proveedorLabel(lugar.proveedor)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 border-t border-[#eef2f7] p-4 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => seleccionar(lugar)}
                      disabled={guardandoId === lugar.id_lugar_restauracion}
                      className="rounded-2xl bg-[#111827] px-4 py-3 text-xs font-black text-white disabled:opacity-60"
                    >
                      {guardandoId === lugar.id_lugar_restauracion
                        ? "Guardando..."
                        : `Guardar en ${momento}`}
                    </button>

                    <button
                      type="button"
                      onClick={() => abrirDetalle(lugar)}
                      className="rounded-2xl bg-[#f8fafc] px-4 py-3 text-xs font-black text-[#111827]"
                    >
                      Ver info
                    </button>

                    {(lugar.googleUrl || lugar.url) && (
                      <a
                        href={lugar.googleUrl ?? lugar.url ?? "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-2xl bg-[#fff4ef] px-4 py-3 text-center text-xs font-black text-[#ff5a36]"
                      >
                        Google
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {detalle && (
        <div className="fixed inset-0 z-[999] flex items-end justify-center bg-black/45 px-4 py-5 backdrop-blur-sm md:items-center">
          <div className="max-h-[88vh] w-full max-w-[620px] overflow-y-auto rounded-[30px] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.25)]">
            <div className="flex h-[140px] items-center justify-center rounded-t-[30px] bg-gradient-to-br from-[#fff7ed] to-[#eef2ff] text-5xl">
              🍽️
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff5a36]">
                    Ficha del restaurante
                  </p>
                  <h3 className="mt-2 text-2xl font-black tracking-[-0.03em] text-[#111827]">
                    {detalle.nombre}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setDetalle(null)}
                  className="rounded-2xl bg-[#f8fafc] px-4 py-3 text-xs font-black text-[#111827]"
                >
                  Cerrar
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#f8fafc] px-3 py-2 text-xs font-black text-[#344054]">
                  {detalle.categoria ?? "Restauración"}
                </span>
                <span className="rounded-full bg-[#ecfdf3] px-3 py-2 text-xs font-black text-[#16a34a]">
                  Presupuesto {presupuestoLabel(detalle.presupuestoEstimado ?? detalle.precio)}
                </span>
                <span className="rounded-full bg-[#eef2ff] px-3 py-2 text-xs font-black text-[#4f46e5]">
                  {proveedorLabel(detalle.proveedor)}
                </span>
              </div>

              <div className="mt-5 rounded-[22px] bg-[#f8fafc] p-4">
                {detalle.direccion && (
                  <p className="text-sm leading-6 text-[#344054]">
                    <strong>Dirección:</strong> {detalle.direccion}
                  </p>
                )}

                {detalle.telefono && (
                  <p className="mt-2 text-sm leading-6 text-[#344054]">
                    <strong>Teléfono:</strong> {detalle.telefono}
                  </p>
                )}

                {detalle.website && (
                  <p className="mt-2 text-sm leading-6 text-[#344054]">
                    <strong>Web:</strong>{" "}
                    <a
                      href={detalle.website}
                      target="_blank"
                      rel="noreferrer"
                      className="font-black text-[#ff5a36]"
                    >
                      Abrir web
                    </a>
                  </p>
                )}
              </div>

              <div className="mt-5 rounded-[20px] bg-[#fff7ed] p-4 text-sm font-bold leading-6 text-[#9a3412]">
                {detalle.reviewExternalMessage ??
                  "Para ver reseñas, fotos, menú y horarios se abre Google, evitando usar campos Premium de Foursquare."}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => seleccionar(detalle)}
                  className="rounded-full bg-[#111827] px-5 py-3 text-xs font-black text-white"
                >
                  Guardar en {momento}
                </button>

                {(detalle.googleUrl || detalle.url) && (
                  <a
                    href={detalle.googleUrl ?? detalle.url ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-[#ff5a36] px-5 py-3 text-xs font-black text-white"
                  >
                    Ver reseñas en Google
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setDetalle(null)}
                  className="rounded-full bg-[#f8fafc] px-5 py-3 text-xs font-black text-[#111827]"
                >
                  Volver
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}