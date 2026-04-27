import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

type PreguntaIa = {
  id: string;
  titulo: string;
  ayuda: string;
};

type CoordenadasBase = {
  lat: number;
  lon: number;
  label: string;
};

type FormularioItinerario = {
  destino: string;
  dias: string;
  presupuesto: string;
  ritmo: string;
  tipoViaje: string;
  compania: string;
  imprescindibles: string;
  extras: string;
  transporte: string;
  restricciones: string;
  zonaBase: string;
  preferenciasNegativas: string;
  visitedGlobalIds: string;
};

const STORAGE_KEY_RANGE = "spainway_trip_date_range";
const STORAGE_KEY_RECOMMENDER_DRAFT = "spainway_recommender_draft";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

const preguntasIa: PreguntaIa[] = [
  {
    id: "destino",
    titulo: "¿Cuál es el destino principal?",
    ayuda: "Indica la ciudad, comunidad o zona base sobre la que quieres construir el viaje.",
  },
  {
    id: "base",
    titulo: "¿Desde qué zona o alojamiento empieza cada día?",
    ayuda: "Se geocodifica para obtener base_lat y base_lon sin meter coordenadas a mano.",
  },
  {
    id: "negativas",
    titulo: "¿Qué cosas NO quieres incluir?",
    ayuda: "Ej. no museos, no caminar mucho, no playas, no vida nocturna.",
  },
  {
    id: "visitados",
    titulo: "¿Qué POIs ya se han usado?",
    ayuda: "Permite evitar repetir lugares mediante visited_global_ids.",
  },
  {
    id: "dias",
    titulo: "¿Cuántos días durará el viaje?",
    ayuda: "Puedes apoyarte en el rango de fechas elegido en el calendario o introducir una duración estimada.",
  },
  {
    id: "presupuesto",
    titulo: "¿Cuál es el presupuesto aproximado?",
    ayuda: "Marca una cifra orientativa para ajustar el nivel de gasto del plan.",
  },
  {
    id: "ritmo",
    titulo: "¿Qué ritmo prefieres: relajado, equilibrado o intenso?",
    ayuda: "Esto afecta al número de visitas por día y al tiempo reservado para pausas.",
  },
  {
    id: "tipo",
    titulo: "¿Qué tipo de viaje quieres: cultural, naturaleza, gastronomía, costa o mixto?",
    ayuda: "Sirve para priorizar el tipo de lugares y experiencias.",
  },
  {
    id: "companeros",
    titulo: "¿Viajas solo, en pareja, con amigos o en familia?",
    ayuda: "Permite adaptar mejor el estilo del itinerario.",
  },
  {
    id: "prioridad",
    titulo: "¿Quieres priorizar imprescindibles turísticos o lugares menos masificados?",
    ayuda: "Puedes elegir entre una ruta clásica, alternativa o una mezcla de ambas.",
  },
  {
    id: "extras",
    titulo: "¿Necesitas incluir restaurantes, miradores, playas, compras o vida nocturna?",
    ayuda: "Añade servicios o ambientes concretos que quieras ver reflejados en la propuesta.",
  },
  {
    id: "movilidad",
    titulo: "¿Te moverás en coche, transporte público o a pie?",
    ayuda: "Esto modifica el radio de desplazamiento y la estructura del plan.",
  },
  {
    id: "obligatorio",
    titulo: "¿Hay alguna ciudad, barrio o actividad obligatoria que quieras incluir?",
    ayuda: "Usa este punto para fijar condiciones que la IA deba respetar sí o sí.",
  },
];

function readStoredRange(): { start: string | null; end: string | null } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RANGE);
    if (!raw) return { start: null, end: null };
    const parsed = JSON.parse(raw) as { start?: string | null; end?: string | null };

    return {
      start: parsed.start ?? null,
      end: parsed.end ?? null,
    };
  } catch {
    return { start: null, end: null };
  }
}

function formatRangeText(start: string | null, end: string | null): string {
  if (!start && !end) return "Sin rango seleccionado";
  if (start && !end) return `Inicio: ${start}`;
  return `${start} → ${end}`;
}

function getDaysPlaceholder(start: string | null, end: string | null): string {
  if (!start || !end) return "Ej. 5";

  const a = new Date(start).getTime();
  const b = new Date(end).getTime();
  const diff = Math.floor((b - a) / 86400000) + 1;

  return diff > 0 ? String(diff) : "Ej. 5";
}

function parseVisitedGlobalIds(value: string): string[] {
  return value
    .split(/[\n,;]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseNegativePreferences(value: string): string[] {
  return value
    .split(/[\n,;]+/)
    .map((item) => item.trim())
    .filter(Boolean);
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

export default function CrearItinerarioPantalla() {
  const navigate = useNavigate();

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  const [mostrarRecomendaciones, setMostrarRecomendaciones] = useState(false);
  const [buscandoBase, setBuscandoBase] = useState(false);
  const [errorBase, setErrorBase] = useState<string | null>(null);
  const [baseCoords, setBaseCoords] = useState<CoordenadasBase | null>(null);

  const [form, setForm] = useState<FormularioItinerario>({
    destino: "",
    dias: "",
    presupuesto: "Medio",
    ritmo: "Equilibrado",
    tipoViaje: "Mixto",
    compania: "",
    imprescindibles: "",
    extras: "",
    transporte: "Transporte público",
    restricciones: "",
    zonaBase: "",
    preferenciasNegativas: "",
    visitedGlobalIds: "",
  });

  const range = useMemo(() => readStoredRange(), []);

  const daysPlaceholder = useMemo(
    () => getDaysPlaceholder(range.start, range.end),
    [range.end, range.start]
  );

  useEffect(() => {
    if (!MAPBOX_TOKEN) return;
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-3.7038, 40.4168],
      zoom: 11,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("click", async (event) => {
      const lon = event.lngLat.lng;
      const lat = event.lngLat.lat;

      const label = await reverseGeocode(lat, lon);

      setBaseCoords({
        lat,
        lon,
        label,
      });

      setForm((prev) => ({
        ...prev,
        zonaBase: label,
      }));

      colocarMarker(lon, lat);
    });

    mapRef.current = map;

    return () => {
      markerRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  function updateForm<K extends keyof FormularioItinerario>(
    key: K,
    value: FormularioItinerario[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function colocarMarker(lon: number, lat: number) {
    const map = mapRef.current;
    if (!map) return;

    markerRef.current?.remove();

    markerRef.current = new mapboxgl.Marker({
      color: "#ff5a36",
      draggable: true,
    })
      .setLngLat([lon, lat])
      .addTo(map);

    markerRef.current.on("dragend", async () => {
      const lngLat = markerRef.current?.getLngLat();
      if (!lngLat) return;

      const label = await reverseGeocode(lngLat.lat, lngLat.lng);

      setBaseCoords({
        lat: lngLat.lat,
        lon: lngLat.lng,
        label,
      });

      setForm((prev) => ({
        ...prev,
        zonaBase: label,
      }));
    });

    map.flyTo({
      center: [lon, lat],
      zoom: 14,
      essential: true,
    });
  }

  async function reverseGeocode(lat: number, lon: number): Promise<string> {
    if (!MAPBOX_TOKEN) return `Zona seleccionada (${lat.toFixed(5)}, ${lon.toFixed(5)})`;

    try {
      const url =
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json` +
        `?access_token=${MAPBOX_TOKEN}&language=es&limit=1`;

      const response = await fetch(url);
      const data = await response.json();

      const placeName = data?.features?.[0]?.place_name as string | undefined;

      return placeName ?? `Zona seleccionada (${lat.toFixed(5)}, ${lon.toFixed(5)})`;
    } catch {
      return `Zona seleccionada (${lat.toFixed(5)}, ${lon.toFixed(5)})`;
    }
  }

  async function buscarZonaBase() {
    if (!MAPBOX_TOKEN) {
      setErrorBase("Falta VITE_MAPBOX_TOKEN en el .env del frontend.");
      return;
    }

    const query = form.zonaBase.trim();

    if (!query) {
      setErrorBase("Escribe una zona, hotel, barrio, calle o código postal.");
      return;
    }

    try {
      setBuscandoBase(true);
      setErrorBase(null);

      const busqueda = form.destino.trim() ? `${query}, ${form.destino}` : query;

      const url =
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          busqueda
        )}.json` +
        `?access_token=${MAPBOX_TOKEN}&language=es&country=es&limit=1`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("No se pudo geocodificar la zona base.");
      }

      const data = await response.json();
      const feature = data?.features?.[0];

      if (!feature?.center) {
        setErrorBase("No se ha encontrado esa zona. Prueba con otra búsqueda.");
        return;
      }

      const [lon, lat] = feature.center as [number, number];
      const label = feature.place_name as string;

      setBaseCoords({
        lat,
        lon,
        label,
      });

      setForm((prev) => ({
        ...prev,
        zonaBase: label,
      }));

      colocarMarker(lon, lat);
    } catch (error) {
      console.error(error);
      setErrorBase("No se pudo buscar la zona base.");
    } finally {
      setBuscandoBase(false);
    }
  }

  function generarPayloadRecomendador() {
    return {
      destination: form.destino,
      days: Number(form.dias || daysPlaceholder || 1),
      start_date: range.start,
      end_date: range.end,

      base_text: form.zonaBase,
      base_lat: baseCoords?.lat ?? null,
      base_lon: baseCoords?.lon ?? null,

      budget: form.presupuesto,
      pace: form.ritmo,
      trip_type: form.tipoViaje,
      transport: form.transporte,
      companions: form.compania,

      must_include: form.imprescindibles,
      desired_extras: form.extras,
      restrictions: form.restricciones,

      negative_preferences: parseNegativePreferences(form.preferenciasNegativas),
      visited_global_ids: parseVisitedGlobalIds(form.visitedGlobalIds),
    };
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!baseCoords) {
      setErrorBase("Selecciona una zona base con el buscador o haciendo click en el mapa.");
      return;
    }

    const payload = generarPayloadRecomendador();

    localStorage.setItem(STORAGE_KEY_RECOMMENDER_DRAFT, JSON.stringify(payload));

    console.log("Payload recomendador:", payload);

    navigate("/chat/cargando");
  }

  return (
    <div className="min-h-full bg-[#f3f5f9] text-[#111827]">
      <div className="mx-auto w-full max-w-[860px] px-5 pb-28 pt-5">
        <section className="rounded-[30px] bg-gradient-to-br from-[#fff8f4] via-[#ffffff] to-[#f4f1ff] p-5 shadow-[0_12px_30px_rgba(15,23,42,0.07)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#94a3b8]">
                Itinerarios
              </p>

              <h1 className="mt-2 text-[24px] font-bold tracking-[-0.03em]">
                Crear itinerario
              </h1>

              <p className="mt-2 text-sm leading-6 text-[#667085]">
                Esta pantalla recoge la información que luego usará el módulo de
                inteligencia artificial para generar una propuesta personalizada.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/itinerarios")}
              className="shrink-0 rounded-2xl bg-white px-4 py-2 text-xs font-semibold text-[#111827] shadow-sm"
            >
              Cerrar
            </button>
          </div>

          <div className="mt-5 rounded-[22px] bg-[#fff7f1] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#8c2d12]">
                  Preguntas clave para el motor de IA
                </p>

                <p className="mt-1 text-xs leading-5 text-[#b54708]">
                  Pulsa para ver u ocultar las recomendaciones.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMostrarRecomendaciones((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#ff5a36]"
              >
                <span>{mostrarRecomendaciones ? "Ocultar" : "Ver guía"}</span>
                <IconoChevron open={mostrarRecomendaciones} />
              </button>
            </div>

            {mostrarRecomendaciones && (
              <div className="mt-4 rounded-[18px] border border-[#f2d7ca] bg-white px-4 py-4">
                <ul className="space-y-2 text-[12px] leading-5 text-[#8c2d12]">
                  {preguntasIa.map((pregunta) => (
                    <li key={pregunta.id}>
                      <strong>{pregunta.titulo}</strong>
                      <br />
                      <span>{pregunta.ayuda}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        <form
          onSubmit={handleSubmit}
          className="mt-5 rounded-[30px] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.07)]"
        >
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#111827]">
                Destino
              </label>

              <input
                type="text"
                value={form.destino}
                onChange={(event) => updateForm("destino", event.target.value)}
                placeholder="Ej. Andalucía, Madrid, Valencia..."
                className="w-full rounded-[18px] border border-[#d9dee8] bg-[#fcfcfd] px-4 py-3 text-sm outline-none placeholder:text-[#98a2b3]"
              />
            </div>

            <div className="rounded-[24px] border border-[#e5e7eb] bg-[#fcfcfd] p-4">
              <div className="mb-3">
                <p className="text-sm font-bold text-[#111827]">
                  Zona base del viaje
                </p>

                <p className="mt-1 text-xs leading-5 text-[#667085]">
                  Busca un hotel, barrio, calle, monumento o código postal. También puedes
                  hacer click directamente en el mapa. Esto genera automáticamente
                  <strong> base_lat</strong> y <strong>base_lon</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
                <input
                  type="text"
                  value={form.zonaBase}
                  onChange={(event) => updateForm("zonaBase", event.target.value)}
                  placeholder="Ej. Bernabéu, Gran Vía, 28013, Hotel..."
                  className="w-full rounded-[18px] border border-[#d9dee8] bg-white px-4 py-3 text-sm outline-none placeholder:text-[#98a2b3]"
                />

                <button
                  type="button"
                  onClick={buscarZonaBase}
                  disabled={buscandoBase}
                  className="rounded-[18px] bg-[#111827] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {buscandoBase ? "Buscando..." : "Buscar zona"}
                </button>
              </div>

              {errorBase && (
                <p className="mt-3 rounded-[14px] bg-red-50 px-4 py-3 text-xs font-medium text-red-600">
                  {errorBase}
                </p>
              )}

              {baseCoords && (
                <div className="mt-3 rounded-[16px] bg-[#ecfdf3] px-4 py-3 text-xs leading-5 text-[#027a48]">
                  <p className="font-semibold">Base seleccionada:</p>
                  <p>{baseCoords.label}</p>
                  <p className="mt-1">
                    base_lat: <strong>{baseCoords.lat.toFixed(6)}</strong> · base_lon:{" "}
                    <strong>{baseCoords.lon.toFixed(6)}</strong>
                  </p>
                </div>
              )}

              <div className="mt-4 h-[280px] overflow-hidden rounded-[22px] border border-[#e5e7eb] bg-[#eef2f7]">
                {MAPBOX_TOKEN ? (
                  <div ref={mapContainerRef} className="h-full w-full" />
                ) : (
                  <div className="flex h-full items-center justify-center p-6 text-center text-sm text-[#667085]">
                    Falta configurar VITE_MAPBOX_TOKEN en el .env del frontend.
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#111827]">
                  Días
                </label>

                <input
                  type="text"
                  value={form.dias}
                  onChange={(event) => updateForm("dias", event.target.value)}
                  placeholder={daysPlaceholder}
                  className="w-full rounded-[18px] border border-[#d9dee8] bg-[#fcfcfd] px-4 py-3 text-sm outline-none placeholder:text-[#98a2b3]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#111827]">
                  Presupuesto
                </label>

                <select
                  value={form.presupuesto}
                  onChange={(event) => updateForm("presupuesto", event.target.value)}
                  className="w-full rounded-[18px] border border-[#d9dee8] bg-[#fcfcfd] px-4 py-3 text-sm outline-none"
                >
                  <option>Bajo</option>
                  <option>Medio</option>
                  <option>Alto</option>
                </select>
              </div>
            </div>

            <div className="rounded-[18px] bg-[#fff7f4] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#ff5a36]">
                Fechas seleccionadas
              </p>

              <p className="mt-2 text-sm font-medium text-[#7a271a]">
                {formatRangeText(range.start, range.end)}
              </p>

              <button
                type="button"
                onClick={() => navigate("/calendario")}
                className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#111827]"
              >
                Abrir calendario
              </button>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#111827]">
                Ritmo del viaje
              </label>

              <select
                value={form.ritmo}
                onChange={(event) => updateForm("ritmo", event.target.value)}
                className="w-full rounded-[18px] border border-[#d9dee8] bg-[#fcfcfd] px-4 py-3 text-sm outline-none"
              >
                <option>Equilibrado</option>
                <option>Relajado</option>
                <option>Intenso</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#111827]">
                Tipo de viaje
              </label>

              <select
                value={form.tipoViaje}
                onChange={(event) => updateForm("tipoViaje", event.target.value)}
                className="w-full rounded-[18px] border border-[#d9dee8] bg-[#fcfcfd] px-4 py-3 text-sm outline-none"
              >
                <option>Mixto</option>
                <option>Cultural</option>
                <option>Naturaleza</option>
                <option>Gastronomía</option>
                <option>Costa</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#111827]">
                Compañía
              </label>

              <input
                type="text"
                value={form.compania}
                onChange={(event) => updateForm("compania", event.target.value)}
                placeholder="Solo, pareja, amigos, familia..."
                className="w-full rounded-[18px] border border-[#d9dee8] bg-[#fcfcfd] px-4 py-3 text-sm outline-none placeholder:text-[#98a2b3]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#111827]">
                Imprescindibles
              </label>

              <textarea
                rows={3}
                value={form.imprescindibles}
                onChange={(event) => updateForm("imprescindibles", event.target.value)}
                placeholder="Lugares o actividades que deben aparecer sí o sí"
                className="w-full rounded-[18px] border border-[#d9dee8] bg-[#fcfcfd] px-4 py-3 text-sm outline-none placeholder:text-[#98a2b3]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#111827]">
                Extras deseados
              </label>

              <textarea
                rows={3}
                value={form.extras}
                onChange={(event) => updateForm("extras", event.target.value)}
                placeholder="Restaurantes, miradores, compras, playas, ocio nocturno..."
                className="w-full rounded-[18px] border border-[#d9dee8] bg-[#fcfcfd] px-4 py-3 text-sm outline-none placeholder:text-[#98a2b3]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#111827]">
                Transporte
              </label>

              <input
                type="text"
                value={form.transporte}
                onChange={(event) => updateForm("transporte", event.target.value)}
                placeholder="Coche, tren, transporte público, a pie..."
                className="w-full rounded-[18px] border border-[#d9dee8] bg-[#fcfcfd] px-4 py-3 text-sm outline-none placeholder:text-[#98a2b3]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#111827]">
                Restricciones o notas
              </label>

              <textarea
                rows={3}
                value={form.restricciones}
                onChange={(event) => updateForm("restricciones", event.target.value)}
                placeholder="Niños, movilidad, horarios, preferencias alimentarias..."
                className="w-full rounded-[18px] border border-[#d9dee8] bg-[#fcfcfd] px-4 py-3 text-sm outline-none placeholder:text-[#98a2b3]"
              />
            </div>

            <div className="rounded-[24px] border border-[#e5e7eb] bg-[#fcfcfd] p-4">
              <label className="mb-2 block text-sm font-semibold text-[#111827]">
                Preferencias negativas
              </label>

              <textarea
                rows={3}
                value={form.preferenciasNegativas}
                onChange={(event) =>
                  updateForm("preferenciasNegativas", event.target.value)
                }
                placeholder="Ej. No quiero museos, no quiero caminar mucho, evitar playas..."
                className="w-full rounded-[18px] border border-[#d9dee8] bg-white px-4 py-3 text-sm outline-none placeholder:text-[#98a2b3]"
              />

              <p className="mt-2 text-xs leading-5 text-[#667085]">
                Puedes separarlas por comas o escribir una por línea. Se enviarán como
                negative_preferences.
              </p>
            </div>

            <div className="rounded-[24px] border border-[#e5e7eb] bg-[#fcfcfd] p-4">
              <label className="mb-2 block text-sm font-semibold text-[#111827]">
                POIs ya usados
              </label>

              <textarea
                rows={3}
                value={form.visitedGlobalIds}
                onChange={(event) => updateForm("visitedGlobalIds", event.target.value)}
                placeholder="Ej. ES_AND_POI_0001, ES_AND_POI_0002..."
                className="w-full rounded-[18px] border border-[#d9dee8] bg-white px-4 py-3 text-sm outline-none placeholder:text-[#98a2b3]"
              />

              <p className="mt-2 text-xs leading-5 text-[#667085]">
                Campo avanzado para evitar repetir lugares. Puedes pegar IDs separados por
                comas o por líneas. Se enviarán como visited_global_ids.
              </p>
            </div>

            <div className="mt-2 flex gap-3">
              <button
                type="button"
                onClick={() => navigate("/itinerarios")}
                className="flex-1 rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-semibold text-[#111827]"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="flex-1 rounded-2xl bg-[#ff5a36] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(255,90,54,0.28)]"
              >
                Generar itinerario
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}