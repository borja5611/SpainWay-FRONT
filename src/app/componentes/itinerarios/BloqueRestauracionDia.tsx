import { useMemo, useState } from "react";
import {
  buscarRestauracionCercana,
  eliminarSeleccionRestauracion,
  seleccionarRestauracion,
  type LugarRestauracion,
  type MomentoRestauracion,
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

function metrosLabel(value?: number | null) {
  if (!value) return "distancia no disponible";
  if (value < 1000) return `${value} m`;
  return `${(value / 1000).toFixed(1)} km`;
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
  const [radio, setRadio] = useState(1200);
  const [poiIndex, setPoiIndex] = useState(0);
  const [resultados, setResultados] = useState<LugarRestauracion[]>([]);
  const [cargando, setCargando] = useState(false);
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
      setError("Este día no tiene id de base de datos.");
      return;
    }

    if (!poiReferencia?.latitud || !poiReferencia?.longitud) {
      setError("No hay coordenadas disponibles en los POIs de este día.");
      return;
    }

    try {
      setCargando(true);
      setError(null);

      const data = await buscarRestauracionCercana({
        lat: poiReferencia.latitud,
        lng: poiReferencia.longitud,
        radio,
        momento,
        tipo,
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

    await seleccionarRestauracion({
      id_itinerario: idItinerario,
      id_dia_itinerario: idDiaItinerario,
      momento,
      id_lugar_restauracion: lugar.id_lugar_restauracion,
      id_poi_referencia: poiReferencia?.idPoi ?? null,
    });

    await onChange();
  }

  async function quitar(idSeleccion: number) {
    await eliminarSeleccionRestauracion(idSeleccion);
    await onChange();
  }

  return (
    <section className="mt-6 overflow-hidden rounded-[28px] border border-[#eef2f7] bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
      <button
        type="button"
        onClick={() => setAbierto((value) => !value)}
        className="flex w-full items-center justify-between gap-4 bg-gradient-to-br from-[#fff8f4] via-white to-[#f8fafc] p-5 text-left"
      >
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff5a36]">
            Restauración inteligente
          </p>
          <h3 className="mt-2 text-xl font-black tracking-[-0.03em] text-[#111827]">
            Añadir desayuno, comida o cena al día {diaNumero}
          </h3>
          <p className="mt-1 text-sm leading-6 text-[#667085]">
            Busca locales cerca del POI que elijas y guarda el recomendado en tu itinerario.
          </p>
        </div>

        <span className="rounded-full bg-[#111827] px-4 py-2 text-xs font-black text-white">
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

                <div className="flex gap-2">
                  {seleccionMomento.lugar.url && (
                    <a
                      href={seleccionMomento.lugar.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-white px-4 py-2 text-xs font-black text-[#111827]"
                    >
                      Ver en Maps
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

          <div className="grid gap-3 md:grid-cols-[1.3fr_1fr_0.8fr]">
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
                Tipo de local
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
          </div>

          <button
            type="button"
            onClick={buscar}
            disabled={cargando || !poiReferencia}
            className="w-full rounded-[22px] bg-[#ff5a36] px-5 py-4 text-sm font-black text-white shadow-[0_16px_32px_rgba(255,90,54,0.25)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cargando ? "Buscando restaurantes..." : "Buscar recomendaciones cerca del POI"}
          </button>

          {error && (
            <div className="rounded-2xl bg-[#fef2f2] p-4 text-sm font-bold text-[#b42318]">
              {error}
            </div>
          )}

          {resultados.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {resultados.map((lugar, index) => (
                <article
                  key={lugar.id_lugar_restauracion}
                  className="overflow-hidden rounded-[26px] border border-[#eef2f7] bg-[#fcfcfd]"
                >
                  <div className="bg-gradient-to-br from-[#fff7ed] to-[#f8fafc] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ff5a36]">
                          Recomendación #{index + 1}
                        </p>
                        <h4 className="mt-2 text-lg font-black leading-tight text-[#111827]">
                          {lugar.nombre}
                        </h4>
                      </div>

                      <div className="rounded-2xl bg-white px-3 py-2 text-center shadow-sm">
                        <p className="text-xs font-black text-[#94a3b8]">Score</p>
                        <p className="text-lg font-black text-[#111827]">{lugar.score ?? 0}</p>
                      </div>
                    </div>

                    <p className="mt-3 text-sm font-semibold text-[#667085]">
                      {lugar.categoria ?? "Restauración"} · {metrosLabel(lugar.distancia)}
                    </p>

                    {lugar.direccion && (
                      <p className="mt-2 text-sm leading-6 text-[#667085]">
                        {lugar.direccion}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 p-4">
                    <button
                      type="button"
                      onClick={() => seleccionar(lugar)}
                      className="rounded-full bg-[#111827] px-4 py-2 text-xs font-black text-white"
                    >
                      Guardar en {momento}
                    </button>

                    {lugar.url && (
                      <a
                        href={lugar.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-[#fff4ef] px-4 py-2 text-xs font-black text-[#ff5a36]"
                      >
                        Ver en Maps
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}