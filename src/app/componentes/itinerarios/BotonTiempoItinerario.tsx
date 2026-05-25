import { useMemo, useState } from "react";

type DiaTiempo = {
  fecha?: string;
  date?: string;
  dia?: string;
  tempMin?: number | null;
  tempMax?: number | null;
  temperatura_min?: number | null;
  temperatura_max?: number | null;
  lluvia?: number | null;
  probabilidadLluvia?: number | null;
  precipitation_probability_max?: number | null;
  viento?: number | null;
  wind_speed?: number | null;
  descripcion?: string | null;
  consejo?: string | null;
};

type TiempoResponse = {
  ok?: boolean;
  disponible?: boolean;
  fiable?: boolean;
  mensaje?: string;
  destino?: string;
  resumen?: string;
  motivo?: string;
  dias?: DiaTiempo[];
  forecast?: DiaTiempo[];
  proximos_14_dias?: DiaTiempo[];
  dias_itinerario?: DiaTiempo[];
  clima_estacional?: string | { titulo?: string; rango?: string; descripcion?: string };
  orientacion_estacional?: string;
  fuente?: string;
};

type Props = {
  idItinerario?: number | string | null;
  id_itinerario?: number | string | null;
  destino?: string | null;
  inicio?: string | null;
  fin?: string | null;
  diaIso?: string | null;
  diasIso?: string | null;
  label?: string;
  className?: string;
};

const API_URL = import.meta.env.VITE_API_URL ?? "";

function getToken(): string | null {
  return (
    localStorage.getItem("spainway_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("access_token")
  );
}

function normalizarFecha(valor?: string | null): string | null {
  if (!valor) return null;
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return valor;
  return fecha.toISOString().slice(0, 10);
}

function formatoFecha(valor?: string | null): string {
  if (!valor) return "Fecha no disponible";
  const fecha = new Date(`${valor}T12:00:00`);
  if (Number.isNaN(fecha.getTime())) return valor;
  return fecha.toLocaleDateString("es-ES", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

function numeroSeguro(valor: unknown): number | null {
  if (valor === null || valor === undefined || valor === "") return null;
  const n = Number(valor);
  return Number.isFinite(n) ? n : null;
}

function extraerDias(data: TiempoResponse): DiaTiempo[] {
  if (Array.isArray(data.dias_itinerario) && data.dias_itinerario.length) return data.dias_itinerario;
  if (Array.isArray(data.dias) && data.dias.length) return data.dias;
  if (Array.isArray(data.forecast) && data.forecast.length) return data.forecast;
  if (Array.isArray(data.proximos_14_dias) && data.proximos_14_dias.length) return data.proximos_14_dias;
  return [];
}

function textoTemperatura(dia: DiaTiempo): string {
  const min = numeroSeguro(dia.tempMin ?? dia.temperatura_min);
  const max = numeroSeguro(dia.tempMax ?? dia.temperatura_max);
  if (min === null && max === null) return "Temperatura no disponible";
  if (min === null) return `Máx. ${Math.round(max ?? 0)} ºC`;
  if (max === null) return `Mín. ${Math.round(min)} ºC`;
  return `${Math.round(min)} ºC / ${Math.round(max)} ºC`;
}

function textoLluvia(dia: DiaTiempo): string {
  const lluvia = numeroSeguro(dia.lluvia ?? dia.probabilidadLluvia ?? dia.precipitation_probability_max);
  if (lluvia === null) return "Lluvia no disponible";
  return `${Math.round(lluvia)}% lluvia`;
}

function textoViento(dia: DiaTiempo): string {
  const viento = numeroSeguro(dia.viento ?? dia.wind_speed);
  if (viento === null) return "Viento no disponible";
  return `${Math.round(viento)} km/h viento`;
}

function textoOrientacion(value: TiempoResponse["clima_estacional"], fallback?: string): string | null {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    return [value.titulo, value.rango, value.descripcion].filter(Boolean).join(" · ");
  }
  return fallback || null;
}

export default function BotonTiempoItinerario({
  idItinerario,
  id_itinerario,
  destino,
  inicio,
  fin,
  diaIso,
  diasIso,
  label = "Ver tiempo",
  className = "",
}: Props) {
  const [abierto, setAbierto] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tiempo, setTiempo] = useState<TiempoResponse | null>(null);

  const idFinal = idItinerario ?? id_itinerario ?? null;
  const diaFinal = diaIso ?? diasIso ?? null;

  const titulo = useMemo(() => (diaFinal ? "Tiempo del día" : "Tiempo del itinerario"), [diaFinal]);

  async function cargarTiempo() {
    setAbierto(true);
    if (tiempo || cargando) return;

    try {
      setCargando(true);
      setError(null);

      const params = new URLSearchParams();
      if (idFinal !== null && idFinal !== undefined && String(idFinal).trim() !== "") {
        params.set("idItinerario", String(idFinal));
      }
      if (destino) params.set("destino", destino);
      if (inicio) params.set("inicio", normalizarFecha(inicio) ?? inicio);
      if (fin) params.set("fin", normalizarFecha(fin) ?? fin);
      if (diaFinal) params.set("diaIso", normalizarFecha(diaFinal) ?? diaFinal);

      const token = getToken();
      const response = await fetch(`${API_URL}/api/meteorologia/contexto?${params.toString()}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.message || data?.mensaje || "No se pudo cargar la información meteorológica.");
      }
      setTiempo(data as TiempoResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar la información meteorológica.");
    } finally {
      setCargando(false);
    }
  }

  const dias = tiempo ? extraerDias(tiempo) : [];
  const disponible = tiempo?.disponible ?? tiempo?.fiable ?? dias.length > 0;
  const mensaje =
    tiempo?.mensaje ||
    tiempo?.resumen ||
    tiempo?.motivo ||
    (!disponible ? "La previsión fiable solo está disponible para los próximos 14 días." : null);
  const orientacion = textoOrientacion(tiempo?.clima_estacional, tiempo?.orientacion_estacional);

  return (
    <>
      <button
        type="button"
        onClick={cargarTiempo}
        className={
          className ||
          "mt-3 w-full rounded-2xl bg-[#2563eb] px-4 py-3 text-sm font-black text-white shadow-[0_12px_26px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5 hover:bg-[#1d4ed8]"
        }
      >
        {label}
      </button>

      {abierto && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/45 p-3 sm:items-center">
          <div className="max-h-[88vh] w-full max-w-md overflow-y-auto rounded-[2rem] bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-[#2563eb]">Meteorología</p>
                <h2 className="mt-1 text-2xl font-black tracking-[-0.03em] text-[#0f172a]">{titulo}</h2>
                <p className="mt-1 text-sm font-semibold text-[#64748b]">{destino || tiempo?.destino || "Destino del itinerario"}</p>
              </div>

              <button
                type="button"
                onClick={() => setAbierto(false)}
                className="grid h-10 w-10 place-items-center rounded-full bg-[#f8fafc] text-lg font-black text-[#0f172a]"
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

            {cargando && (
              <div className="rounded-3xl bg-[#f8fafc] p-5 text-center">
                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#ffe1d9] border-t-[#2563eb]" />
                <p className="text-sm font-bold text-[#64748b]">Consultando previsión meteorológica...</p>
              </div>
            )}

            {!cargando && error && (
              <div className="rounded-3xl bg-[#fff1f2] p-4 text-sm font-bold leading-6 text-[#dc2626]">{error}</div>
            )}

            {!cargando && !error && tiempo && (
              <div className="space-y-4">
                {mensaje && (
                  <div className={`rounded-3xl p-4 text-sm font-bold leading-6 ${disponible ? "bg-[#eff6ff] text-[#1d4ed8]" : "bg-[#fff7ed] text-[#c2410c]"}`}>
                    {mensaje}
                  </div>
                )}

                {dias.length > 0 && (
                  <div className="space-y-3">
                    {dias.slice(0, diaFinal ? 1 : 14).map((dia, index) => (
                      <div key={`${dia.fecha ?? dia.date ?? dia.dia ?? index}`} className="rounded-3xl border border-[#e5e7eb] bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.05)]">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563eb]">
                              {formatoFecha(dia.fecha ?? dia.date ?? dia.dia)}
                            </p>
                            <p className="mt-2 text-base font-black text-[#0f172a]">{textoTemperatura(dia)}</p>
                          </div>
                          <div className="rounded-2xl bg-[#f8fafc] px-3 py-2 text-right text-xs font-black text-[#475569]">
                            {textoLluvia(dia)}
                          </div>
                        </div>
                        <p className="mt-2 text-sm font-semibold text-[#64748b]">{textoViento(dia)}</p>
                        {(dia.descripcion || dia.consejo) && (
                          <p className="mt-3 rounded-2xl bg-[#fff7ed] p-3 text-sm font-semibold leading-6 text-[#9a3412]">
                            {dia.consejo || dia.descripcion}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {orientacion && (
                  <div className="rounded-3xl bg-[#f8fafc] p-4">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#94a3b8]">Orientación estacional</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-[#475569]">{orientacion}</p>
                  </div>
                )}

                {!dias.length && !orientacion && (
                  <div className="rounded-3xl bg-[#f8fafc] p-4 text-sm font-bold text-[#64748b]">
                    No hay previsión disponible para este itinerario.
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    const query = encodeURIComponent(`tiempo ${destino || tiempo.destino || ""}`);
                    window.open(`https://www.google.com/search?q=${query}`, "_blank", "noopener,noreferrer");
                  }}
                  className="w-full rounded-2xl bg-[#0f172a] px-5 py-3 text-sm font-black text-white"
                >
                  Abrir tiempo externo
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
