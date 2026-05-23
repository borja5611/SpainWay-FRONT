import { useMemo, useState } from "react";
import {
  getMeteorologiaItinerario,
  type DiaMeteorologia,
  type MeteorologiaItinerario,
} from "@/app/servicios/meteorologia";

type Props = {
  idItinerario: number;
  destino: string;
};

function formatearFecha(fecha: string): string {
  const d = new Date(`${fecha}T12:00:00`);
  if (Number.isNaN(d.getTime())) return fecha;
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(d);
}

function valorTemperatura(value: number | null): string {
  return value === null || value === undefined ? "-" : `${Math.round(value)}º`;
}

function valorPorcentaje(value: number | null): string {
  return value === null || value === undefined ? "-" : `${Math.round(value)}%`;
}

function abrirBusquedaTiempo(destino: string) {
  const query = encodeURIComponent(`tiempo ${destino} próximos 14 días`);
  window.open(`https://www.google.com/search?q=${query}`, "_blank", "noopener,noreferrer");
}

function DiaTiempoCard({ dia }: { dia: DiaMeteorologia }) {
  return (
    <article className="rounded-[22px] border border-[#edf0f4] bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#94a3b8]">
            {formatearFecha(dia.fecha)}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-2xl">{dia.icono}</span>
            <p className="text-sm font-bold text-[#111827]">{dia.estado}</p>
          </div>
        </div>

        {dia.dentro_itinerario && (
          <span className="rounded-full bg-[#ecfdf5] px-3 py-1 text-[11px] font-bold text-[#059669]">
            viaje
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-[#f8fafc] p-3">
          <p className="text-[11px] text-[#94a3b8]">Temp.</p>
          <p className="mt-1 text-sm font-bold text-[#0f172a]">
            {valorTemperatura(dia.temperatura_min)} / {valorTemperatura(dia.temperatura_max)}
          </p>
        </div>
        <div className="rounded-2xl bg-[#f8fafc] p-3">
          <p className="text-[11px] text-[#94a3b8]">Lluvia</p>
          <p className="mt-1 text-sm font-bold text-[#0f172a]">
            {valorPorcentaje(dia.probabilidad_lluvia)}
          </p>
        </div>
        <div className="rounded-2xl bg-[#f8fafc] p-3">
          <p className="text-[11px] text-[#94a3b8]">Viento</p>
          <p className="mt-1 text-sm font-bold text-[#0f172a]">
            {dia.viento_max == null ? "-" : `${Math.round(dia.viento_max)} km/h`}
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm leading-6 text-[#667085]">{dia.consejo}</p>
    </article>
  );
}

export default function BotonTiempoItinerario({ idItinerario, destino }: Props) {
  const [abierto, setAbierto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<MeteorologiaItinerario | null>(null);

  const diasAMostrar = useMemo(() => {
    if (!data) return [];
    return data.prevision_fiable_para_itinerario && data.dias_itinerario.length > 0
      ? data.dias_itinerario
      : data.proximos_14_dias.slice(0, 5);
  }, [data]);

  async function abrirModal() {
    setAbierto(true);
    if (data || loading) return;

    try {
      setLoading(true);
      setError(null);
      const respuesta = await getMeteorologiaItinerario(idItinerario);
      setData(respuesta);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar el tiempo para este itinerario. Inténtalo de nuevo en unos segundos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={abrirModal}
        className="mt-3 w-full rounded-2xl border border-[#bfdbfe] bg-[#eff6ff] px-4 py-3 text-sm font-bold text-[#1d4ed8] shadow-[0_8px_20px_rgba(37,99,235,0.08)]"
      >
        Ver tiempo
      </button>

      {abierto && (
        <div className="fixed inset-0 z-[140] flex items-end justify-center bg-black/45 p-3 sm:items-center">
          <div className="max-h-[88vh] w-full max-w-[410px] overflow-hidden rounded-[30px] bg-[#f3f5f9] shadow-[0_24px_70px_rgba(15,23,42,0.28)]">
            <div className="sticky top-0 z-10 border-b border-[#e5e7eb] bg-white/95 px-5 py-4 backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2563eb]">
                    Meteorología
                  </p>
                  <h3 className="mt-1 text-xl font-black tracking-[-0.03em] text-[#111827]">
                    Tiempo en {data?.destino || destino}
                  </h3>
                  <p className="mt-1 text-sm leading-5 text-[#667085]">
                    Previsión disponible para los próximos 14 días.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setAbierto(false)}
                  className="rounded-full bg-[#f3f4f6] px-3 py-2 text-sm font-bold text-[#111827]"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="max-h-[calc(88vh-96px)] overflow-y-auto px-5 py-5">
              {loading && (
                <div className="rounded-[24px] bg-white p-5 text-sm font-semibold text-[#667085]">
                  Cargando previsión meteorológica...
                </div>
              )}

              {error && (
                <div className="rounded-[24px] bg-red-50 p-5 text-sm font-semibold leading-6 text-red-600">
                  {error}
                </div>
              )}

              {data && !loading && !error && (
                <>
                  <div
                    className={`rounded-[24px] p-4 text-sm leading-6 ${
                      data.prevision_fiable_para_itinerario
                        ? "bg-[#ecfdf5] text-[#065f46]"
                        : "bg-[#fff7ed] text-[#9a3412]"
                    }`}
                  >
                    <p className="font-black">
                      {data.prevision_fiable_para_itinerario
                        ? "Previsión aplicable al itinerario"
                        : "Tus fechas están fuera del rango fiable"}
                    </p>
                    <p className="mt-1">{data.motivo}</p>
                    <p className="mt-2 text-xs font-semibold opacity-80">
                      Rango consultado: {data.rango_prevision_inicio} → {data.rango_prevision_fin}
                    </p>
                  </div>

                  {diasAMostrar.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {diasAMostrar.map((dia) => (
                        <DiaTiempoCard key={dia.fecha} dia={dia} />
                      ))}
                    </div>
                  )}

                  {!data.prevision_fiable_para_itinerario && (
                    <div className="mt-4 rounded-[24px] bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.05)]">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#94a3b8]">
                        {data.clima_estacional.titulo}
                      </p>
                      <p className="mt-2 text-lg font-black text-[#111827]">
                        {data.clima_estacional.rango}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#667085]">
                        {data.clima_estacional.descripcion}
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => abrirBusquedaTiempo(data.destino || destino)}
                    className="mt-4 w-full rounded-2xl bg-[#111827] px-4 py-3 text-sm font-bold text-white"
                  >
                    Abrir tiempo externo
                  </button>

                  <p className="mt-3 text-center text-[11px] leading-5 text-[#98a2b3]">
                    Fuente: {data.fuente}. La previsión meteorológica se usa como apoyo contextual,
                    no como garantía absoluta.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
