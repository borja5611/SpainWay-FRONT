import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  generarItinerario,
  type PayloadRecomendador,
} from "@/app/servicios/recomendador";
import { useAuthStore } from "@/app/store/useAuthStore";

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

type SugerenciaBase = {
  id: string;
  nombre: string;
  lat: number;
  lon: number;
};

type MapboxFeature = {
  id?: string;
  center?: [number, number];
  place_name?: string;
  text?: string;
  place_type?: string[];
  context?: Array<{
    id?: string;
    text?: string;
  }>;
};

type MapboxResponse = {
  features?: MapboxFeature[];
};

type PoiExcluidoSugerencia = {
  id_poi: number;
  id_global?: string | null;
  nombre: string;
  tipo?: string | null;
  direccion?: string | null;
  categoria_poi?: { nombre?: string | null } | null;
  municipio?: { nombre?: string | null } | null;
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
const STORAGE_KEY_FORM_DRAFT = "spainway_crear_itinerario_form_v1";
const STORAGE_KEY_BASE_COORDS = "spainway_crear_itinerario_base_coords_v1";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;
const API_URL = import.meta.env.VITE_API_URL as string | undefined;

const FORM_INICIAL: FormularioItinerario = {
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
};

const preguntasIa: PreguntaIa[] = [
  {
    id: "destino",
    titulo: "¿Cuál es el destino principal?",
    ayuda:
      "Indica la ciudad, comunidad o zona base sobre la que quieres construir el viaje.",
  },
  {
    id: "base",
    titulo: "¿Desde qué zona o alojamiento empieza cada día?",
    ayuda:
      "Se geocodifica para obtener base_lat y base_lon sin meter coordenadas a mano.",
  },
  {
    id: "negativas",
    titulo: "¿Qué cosas NO quieres incluir?",
    ayuda: "Ej. no museos, no caminar mucho, no playas, no vida nocturna.",
  },
  {
    id: "visitados",
    titulo: "¿Qué POIs ya se han usado?",
    ayuda:
      "Puedes escribir nombres normales; el backend los convierte a global_id comparando con la tabla Poi.",
  },
];

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function readStoredRange(): { start: string | null; end: string | null } {
  const parsed = safeJsonParse<{ start?: string | null; end?: string | null }>(
    localStorage.getItem(STORAGE_KEY_RANGE),
  );

  return {
    start: parsed?.start ?? null,
    end: parsed?.end ?? null,
  };
}

function readStoredForm(): FormularioItinerario {
  const parsed = safeJsonParse<Partial<FormularioItinerario>>(
    localStorage.getItem(STORAGE_KEY_FORM_DRAFT),
  );

  return {
    ...FORM_INICIAL,
    ...parsed,
  };
}

function readStoredBaseCoords(): CoordenadasBase | null {
  const parsed = safeJsonParse<CoordenadasBase>(
    localStorage.getItem(STORAGE_KEY_BASE_COORDS),
  );

  if (!parsed) return null;
  if (!Number.isFinite(parsed.lat) || !Number.isFinite(parsed.lon)) return null;
  if (!parsed.label) return null;

  return parsed;
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
    .filter(Boolean)
    .filter(
      (item) =>
        item.toUpperCase().includes("_") || item.toUpperCase().startsWith("ES"),
    );
}

function parseVisitedNames(value: string): string[] {
  return value
    .split(/[\n,;]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item) => !item.toUpperCase().includes("_"));
}

function parseNegativePreferences(value: string): string[] {
  return value
    .split(/[\n,;]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function uniqueText(values: string[]): string[] {
  return Array.from(new Set(values.map((item) => item.trim()).filter(Boolean)));
}

function normalizarValor(value: string): string {
  return value.trim().toLowerCase();
}

function inferDestinationFromBase(label: string): string {
  const parts = label
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const postalCity = parts.find((part) => /^\d{5}\s+/.test(part));
  if (postalCity) return postalCity.replace(/^\d{5}\s+/, "").trim();

  if (parts.length >= 3) return parts[parts.length - 3];
  if (parts.length >= 2) return parts[parts.length - 2];
  return parts[0] ?? "Destino";
}

function featureToSuggestion(feature: MapboxFeature): SugerenciaBase | null {
  if (!feature.center) return null;

  const [lon, lat] = feature.center;

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

  return {
    id: feature.id ?? feature.place_name ?? `${lat}-${lon}`,
    nombre: feature.place_name ?? feature.text ?? "Ubicación",
    lat,
    lon,
  };
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
  const usuario = useAuthStore((state) => state.usuario);
  const idUsuario = usuario?.id_usuario ?? 1;

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  const [mostrarRecomendaciones, setMostrarRecomendaciones] = useState(false);
  const [buscandoBase, setBuscandoBase] = useState(false);
  const [errorBase, setErrorBase] = useState<string | null>(null);
  const [baseCoords, setBaseCoords] = useState<CoordenadasBase | null>(() =>
    readStoredBaseCoords(),
  );
  const [generando, setGenerando] = useState(false);
  const [sugerencias, setSugerencias] = useState<SugerenciaBase[]>([]);
  const [mostrandoSugerencias, setMostrandoSugerencias] = useState(false);
  const [busquedaPoiExcluido, setBusquedaPoiExcluido] = useState("");
  const [sugerenciasPoisExcluidos, setSugerenciasPoisExcluidos] = useState<
    PoiExcluidoSugerencia[]
  >([]);
  const [buscandoPoiExcluido, setBuscandoPoiExcluido] = useState(false);

  const [form, setForm] = useState<FormularioItinerario>(() =>
    readStoredForm(),
  );

  const range = useMemo(() => readStoredRange(), []);

  const daysPlaceholder = useMemo(
    () => getDaysPlaceholder(range.start, range.end),
    [range.end, range.start],
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FORM_DRAFT, JSON.stringify(form));
  }, [form]);

  useEffect(() => {
    if (baseCoords) {
      localStorage.setItem(STORAGE_KEY_BASE_COORDS, JSON.stringify(baseCoords));
    } else {
      localStorage.removeItem(STORAGE_KEY_BASE_COORDS);
    }
  }, [baseCoords]);

  useEffect(() => {
    if (!MAPBOX_TOKEN) return;
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: baseCoords
        ? [baseCoords.lon, baseCoords.lat]
        : [-3.7038, 40.4168],
      zoom: baseCoords ? 14 : 11,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", () => {
      if (baseCoords) {
        colocarMarker(baseCoords.lon, baseCoords.lat, false);
      }
    });

    map.on("click", async (event) => {
      const lon = event.lngLat.lng;
      const lat = event.lngLat.lat;
      const label = await reverseGeocode(lat, lon);

      aplicarUbicacion({
        id: `${lat}-${lon}`,
        nombre: label,
        lat,
        lon,
      });
    });

    mapRef.current = map;

    return () => {
      markerRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!MAPBOX_TOKEN) return;

    const query = form.zonaBase.trim();

    if (query.length < 3) {
      setSugerencias([]);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void cargarSugerencias(query);
    }, 300);

    return () => window.clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.zonaBase, form.destino]);

  useEffect(() => {
    const query = busquedaPoiExcluido.trim();

    if (query.length < 3) {
      setSugerenciasPoisExcluidos([]);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void buscarPoisParaExcluir(query);
    }, 280);

    return () => window.clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busquedaPoiExcluido]);

  function updateForm<K extends keyof FormularioItinerario>(
    key: K,
    value: FormularioItinerario[K],
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function updateZonaBase(value: string) {
    setForm((prev) => ({
      ...prev,
      zonaBase: value,
    }));
    setMostrandoSugerencias(true);

    if (baseCoords && value !== baseCoords.label) {
      setBaseCoords(null);
    }
  }

  function colocarMarker(lon: number, lat: number, fly = true) {
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

      aplicarUbicacion({
        id: `${lngLat.lat}-${lngLat.lng}`,
        nombre: label,
        lat: lngLat.lat,
        lon: lngLat.lng,
      });
    });

    if (fly) {
      map.flyTo({
        center: [lon, lat],
        zoom: 14,
        essential: true,
      });
    }
  }

  async function reverseGeocode(lat: number, lon: number): Promise<string> {
    if (!MAPBOX_TOKEN)
      return `Zona seleccionada (${lat.toFixed(5)}, ${lon.toFixed(5)})`;

    try {
      const url =
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json` +
        `?access_token=${MAPBOX_TOKEN}&language=es&limit=1`;

      const response = await fetch(url);
      const data = (await response.json()) as MapboxResponse;
      const placeName = data.features?.[0]?.place_name;

      return (
        placeName ?? `Zona seleccionada (${lat.toFixed(5)}, ${lon.toFixed(5)})`
      );
    } catch {
      return `Zona seleccionada (${lat.toFixed(5)}, ${lon.toFixed(5)})`;
    }
  }

  async function cargarSugerencias(query: string) {
    if (!MAPBOX_TOKEN) return;

    try {
      const busqueda = form.destino.trim()
        ? `${query}, ${form.destino}`
        : query;
      const url =
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(busqueda)}.json` +
        `?access_token=${MAPBOX_TOKEN}&language=es&country=es&autocomplete=true&limit=6&types=address,place,postcode,poi,neighborhood,locality`;

      const response = await fetch(url);
      if (!response.ok) return;

      const data = (await response.json()) as MapboxResponse;
      const next = (data.features ?? [])
        .map(featureToSuggestion)
        .filter((item): item is SugerenciaBase => item !== null);

      setSugerencias(next);
    } catch (error) {
      console.error(error);
      setSugerencias([]);
    }
  }

  function aplicarUbicacion(sugerencia: SugerenciaBase) {
    const coords = {
      lat: sugerencia.lat,
      lon: sugerencia.lon,
      label: sugerencia.nombre,
    };

    setBaseCoords(coords);
    setErrorBase(null);
    setMostrandoSugerencias(false);
    setSugerencias([]);

    setForm((prev) => ({
      ...prev,
      zonaBase: sugerencia.nombre,
      destino:
        prev.destino.trim() || inferDestinationFromBase(sugerencia.nombre),
    }));

    colocarMarker(sugerencia.lon, sugerencia.lat);
  }

  async function buscarPoisParaExcluir(query: string) {
    if (!API_URL) return;

    try {
      setBuscandoPoiExcluido(true);
      const response = await fetch(
        `${API_URL}/api/pois/busqueda/texto?q=${encodeURIComponent(query)}`,
      );

      if (!response.ok) {
        setSugerenciasPoisExcluidos([]);
        return;
      }

      const data = (await response.json()) as PoiExcluidoSugerencia[];
      setSugerenciasPoisExcluidos(Array.isArray(data) ? data.slice(0, 8) : []);
    } catch (error) {
      console.error(error);
      setSugerenciasPoisExcluidos([]);
    } finally {
      setBuscandoPoiExcluido(false);
    }
  }

  function setPoisExcluidosNombres(nombres: string[]) {
    const valores = uniqueText(nombres);
    setForm((prev) => ({
      ...prev,
      visitedGlobalIds: valores.join(", "),
    }));
  }

  function seleccionarPoiExcluido(poi: PoiExcluidoSugerencia) {
    const actuales = parseVisitedNames(form.visitedGlobalIds);
    setPoisExcluidosNombres([...actuales, poi.nombre]);
    setBusquedaPoiExcluido("");
    setSugerenciasPoisExcluidos([]);
  }

  function eliminarPoiExcluido(nombre: string) {
    const actuales = parseVisitedNames(form.visitedGlobalIds);
    setPoisExcluidosNombres(actuales.filter((item) => item !== nombre));
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

      await cargarSugerencias(query);

      const busqueda = form.destino.trim()
        ? `${query}, ${form.destino}`
        : query;
      const url =
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(busqueda)}.json` +
        `?access_token=${MAPBOX_TOKEN}&language=es&country=es&limit=1&types=address,place,postcode,poi,neighborhood,locality`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("No se pudo geocodificar la zona base.");
      }

      const data = (await response.json()) as MapboxResponse;
      const sugerencia = featureToSuggestion(data.features?.[0] ?? {});

      if (!sugerencia) {
        setErrorBase("No se ha encontrado esa zona. Prueba con otra búsqueda.");
        return;
      }

      aplicarUbicacion(sugerencia);
    } catch (error) {
      console.error(error);
      setErrorBase("No se pudo buscar la zona base.");
    } finally {
      setBuscandoBase(false);
    }
  }

  function generarPayloadRecomendador(): PayloadRecomendador {
    if (!baseCoords) {
      throw new Error(
        "Selecciona una zona base con el buscador o haciendo click en el mapa.",
      );
    }

    const negativePreferences = parseNegativePreferences(
      form.preferenciasNegativas,
    );
    const destination =
      form.destino.trim() || inferDestinationFromBase(form.zonaBase);
    const days = Number(form.dias || daysPlaceholder || 1);

    const notes = [
      form.restricciones.trim(),
      negativePreferences.length > 0
        ? `Preferencias negativas: ${negativePreferences.join(", ")}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");

    return {
      id_usuario: idUsuario,
      destination,
      days: Number.isFinite(days) && days > 0 ? days : 1,
      budget: normalizarValor(form.presupuesto),
      dates: [range.start, range.end].filter((item): item is string =>
        Boolean(item),
      ),
      pace: normalizarValor(form.ritmo),
      trip_type: normalizarValor(form.tipoViaje),
      companions: form.compania.trim(),
      transport: normalizarValor(form.transporte),
      must_see: form.imprescindibles.trim(),
      extras: form.extras.trim(),
      notes,
      base_location_name: form.zonaBase.trim(),
      base_address: form.zonaBase.trim(),
      base_lat: baseCoords.lat,
      base_lon: baseCoords.lon,
      allow_excursions: false,
      visited_global_ids: parseVisitedGlobalIds(form.visitedGlobalIds),
      visited_poi_names: parseVisitedNames(form.visitedGlobalIds),
      negative_preferences: negativePreferences,
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!baseCoords) {
      setErrorBase(
        "Selecciona una zona base con el buscador o haciendo click en el mapa.",
      );
      return;
    }

    try {
      setGenerando(true);
      setErrorBase(null);

      const payload = generarPayloadRecomendador();
      localStorage.setItem(
        STORAGE_KEY_RECOMMENDER_DRAFT,
        JSON.stringify(payload),
      );

      const resultado = await generarItinerario(payload);

      localStorage.removeItem(STORAGE_KEY_FORM_DRAFT);
      localStorage.removeItem(STORAGE_KEY_BASE_COORDS);

      navigate(`/chat/conversacion/${resultado.id_conversacion}`);
    } catch (error) {
      console.error(error);
      setErrorBase(
        error instanceof Error
          ? error.message
          : "No se pudo generar el itinerario. Revisa que el backend y la IA estén arrancados.",
      );
    } finally {
      setGenerando(false);
    }
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
                Rellena el destino, la zona base y tus preferencias. Al generar
                se abrirá automáticamente el chat con la propuesta guardada.
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
                placeholder="Ej. Madrid, Málaga, Valencia..."
                className="w-full rounded-[18px] border border-[#d9dee8] bg-[#fcfcfd] px-4 py-3 text-sm outline-none placeholder:text-[#98a2b3]"
              />
            </div>

            <div className="rounded-[24px] border border-[#e5e7eb] bg-[#fcfcfd] p-4">
              <div className="mb-3">
                <p className="text-sm font-bold text-[#111827]">
                  Zona base del viaje
                </p>

                <p className="mt-1 text-xs leading-5 text-[#667085]">
                  Escribe al menos 3 letras. Por ejemplo, si escribes{" "}
                  <strong>serr</strong>, aparecerán opciones como Calle de
                  Serrano. También puedes hacer click directamente en el mapa.
                </p>
              </div>

              <div className="relative grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
                <div className="relative">
                  <input
                    type="text"
                    value={form.zonaBase}
                    onChange={(event) => updateZonaBase(event.target.value)}
                    onFocus={() => setMostrandoSugerencias(true)}
                    placeholder="Ej. Serrano, Bernabéu, Gran Vía, 28013..."
                    className="w-full rounded-[18px] border border-[#d9dee8] bg-white px-4 py-3 text-sm outline-none placeholder:text-[#98a2b3]"
                  />

                  {mostrandoSugerencias && sugerencias.length > 0 && (
                    <div className="absolute left-0 right-0 top-[54px] z-30 overflow-hidden rounded-[18px] border border-[#e5e7eb] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.16)]">
                      {sugerencias.map((sugerencia) => (
                        <button
                          key={sugerencia.id}
                          type="button"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => aplicarUbicacion(sugerencia)}
                          className="block w-full border-b border-[#f1f5f9] px-4 py-3 text-left text-sm text-[#344054] transition last:border-b-0 hover:bg-[#fff7f3] hover:text-[#ff5a36]"
                        >
                          {sugerencia.nombre}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

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
                    base_lat: <strong>{baseCoords.lat.toFixed(6)}</strong> ·
                    base_lon: <strong>{baseCoords.lon.toFixed(6)}</strong>
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

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#111827]">
                  Días
                </label>

                <input
                  type="number"
                  min="1"
                  max="14"
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
                  onChange={(event) =>
                    updateForm("presupuesto", event.target.value)
                  }
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

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                  onChange={(event) =>
                    updateForm("tipoViaje", event.target.value)
                  }
                  className="w-full rounded-[18px] border border-[#d9dee8] bg-[#fcfcfd] px-4 py-3 text-sm outline-none"
                >
                  <option>Mixto</option>
                  <option>Cultural</option>
                  <option>Naturaleza</option>
                  <option>Gastronomía</option>
                  <option>Costa</option>
                </select>
              </div>
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
                onChange={(event) =>
                  updateForm("imprescindibles", event.target.value)
                }
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
                onChange={(event) =>
                  updateForm("transporte", event.target.value)
                }
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
                onChange={(event) =>
                  updateForm("restricciones", event.target.value)
                }
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
                Puedes separarlas por comas o escribir una por línea. Se
                enviarán como negative_preferences.
              </p>
            </div>

            <div className="rounded-[24px] border border-[#e5e7eb] bg-[#fcfcfd] p-4">
              <label className="mb-2 block text-sm font-semibold text-[#111827]">
                POIs que NO quieres que salgan
              </label>

              <p className="mb-3 text-xs leading-5 text-[#667085]">
                Escribe parte del nombre y selecciona el POI real. Por ejemplo,
                si escribes <strong>plaza</strong>, aparecerán lugares como
                Plaza de España, Puerta del Sol o plazas similares guardadas en
                tu base de datos.
              </p>

              <div className="relative">
                <input
                  type="text"
                  value={busquedaPoiExcluido}
                  onChange={(event) =>
                    setBusquedaPoiExcluido(event.target.value)
                  }
                  placeholder="Ej. Plaza España, Bernabéu, Museo del Prado..."
                  className="w-full rounded-[18px] border border-[#d9dee8] bg-white px-4 py-3 text-sm outline-none placeholder:text-[#98a2b3]"
                />

                {busquedaPoiExcluido.trim().length >= 3 && (
                  <div className="absolute left-0 right-0 top-[54px] z-40 overflow-hidden rounded-[18px] border border-[#e5e7eb] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.16)]">
                    {buscandoPoiExcluido ? (
                      <div className="px-4 py-3 text-sm text-[#667085]">
                        Buscando POIs...
                      </div>
                    ) : sugerenciasPoisExcluidos.length > 0 ? (
                      sugerenciasPoisExcluidos.map((poi) => (
                        <button
                          key={poi.id_poi}
                          type="button"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => seleccionarPoiExcluido(poi)}
                          className="block w-full border-b border-[#f1f5f9] px-4 py-3 text-left transition last:border-b-0 hover:bg-[#fff7f3]"
                        >
                          <p className="text-sm font-semibold text-[#111827]">
                            {poi.nombre}
                          </p>
                          <p className="mt-1 text-xs text-[#667085]">
                            {[
                              poi.categoria_poi?.nombre,
                              poi.municipio?.nombre,
                              poi.direccion,
                            ]
                              .filter(Boolean)
                              .join(" · ") || "POI de la base de datos"}
                          </p>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-[#667085]">
                        No hay coincidencias. Prueba con otro nombre.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {parseVisitedNames(form.visitedGlobalIds).length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {parseVisitedNames(form.visitedGlobalIds).map((nombre) => (
                    <button
                      key={nombre}
                      type="button"
                      onClick={() => eliminarPoiExcluido(nombre)}
                      className="rounded-full bg-red-50 px-3 py-2 text-xs font-semibold text-red-600"
                    >
                      {nombre} ×
                    </button>
                  ))}
                </div>
              )}

              <textarea
                rows={2}
                value={form.visitedGlobalIds}
                onChange={(event) =>
                  updateForm("visitedGlobalIds", event.target.value)
                }
                placeholder="También puedes escribir nombres separados por comas: Bernabéu, Puerta del Sol..."
                className="mt-4 w-full rounded-[18px] border border-[#d9dee8] bg-white px-4 py-3 text-sm outline-none placeholder:text-[#98a2b3]"
              />

              <p className="mt-2 text-xs leading-5 text-[#667085]">
                El backend comparará estos nombres con la tabla Poi y los
                convertirá a global_id para que el recomendador no los elija.
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
                disabled={generando}
                className="flex-1 rounded-2xl bg-[#ff5a36] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(255,90,54,0.28)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {generando ? "Generando..." : "Generar itinerario"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
