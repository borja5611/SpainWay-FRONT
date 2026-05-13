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
import { useDestinoStore } from "@/app/store/useDestinoStore";
import type { DestinoId } from "@/app/datos/mock/destinos";

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

type SugerenciaKind = "lodging" | "address" | "area" | "poi";

type SugerenciaBase = {
  id: string;
  nombre: string;
  lat: number;
  lon: number;
  kind: SugerenciaKind;
  secondaryText?: string;
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
  subdestino: string;
  dias: string;
  presupuesto: string;
  ritmo: string;
  tipoViaje: string;
  compania: string;
  intereses: string;
  transporte: string;
  restricciones: string;
  zonaBase: string;
  visitedGlobalIds: string;
  cargarEventosLiveLuego: boolean;
};

type BBoxMapa = {
  west: number;
  south: number;
  east: number;
  north: number;
};

const STORAGE_KEY_RANGE = "spainway_trip_date_range";
const STORAGE_KEY_RECOMMENDER_DRAFT = "spainway_recommender_draft";
const STORAGE_KEY_FORM_DRAFT = "spainway_crear_itinerario_form_v1";
const STORAGE_KEY_BASE_COORDS = "spainway_crear_itinerario_base_coords_v1";

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getTomorrowIso(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(0, 0, 0, 0);
  return toIsoDate(date);
}

function isBeforeIsoDate(value: string | null, min: string): boolean {
  if (!value) return false;
  return value < min;
}

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;
const API_URL = import.meta.env.VITE_API_URL as string | undefined;

const DESTINOS_DISPONIBLES: Array<{
  id: DestinoId;
  nombre: string;
}> = [
  { id: "andalucia", nombre: "Andalucía" },
  { id: "asturias", nombre: "Asturias" },
  { id: "baleares", nombre: "Baleares" },
  { id: "canarias", nombre: "Canarias" },
  { id: "cantabria", nombre: "Cantabria" },
  { id: "cataluna", nombre: "Cataluña" },
  { id: "madrid", nombre: "Madrid" },
  { id: "cv", nombre: "Comunidad Valenciana" },
];

const SUBDESTINOS_POR_DESTINO: Record<string, string[]> = {
  Andalucía: ["Málaga", "Sevilla", "Granada", "Córdoba", "Cádiz", "Jaén", "Huelva", "Almería"],
  Asturias: ["Oviedo", "Gijón", "Avilés"],
  Baleares: ["Mallorca", "Menorca", "Ibiza", "Formentera"],
  Canarias: [
    "Tenerife",
    "Gran Canaria",
    "Lanzarote",
    "Fuerteventura",
    "La Palma",
    "La Gomera",
    "El Hierro",
  ],
  Cantabria: ["Santander", "Cantabria"],
  Cataluña: ["Barcelona", "Girona", "Tarragona", "Lleida"],
  Madrid: ["Madrid"],
  "Comunidad Valenciana": ["Valencia", "Alicante", "Castellón"],
};

const CENTROS_SUBDESTINO: Record<string, [number, number, number]> = {
  "Andalucía|Málaga": [-4.4214, 36.7213, 10],
  "Andalucía|Sevilla": [-5.9845, 37.3891, 10],
  "Andalucía|Granada": [-3.5986, 37.1773, 10],
  "Andalucía|Córdoba": [-4.7794, 37.8882, 10],
  "Andalucía|Cádiz": [-6.2886, 36.5271, 10],
  "Andalucía|Jaén": [-3.7903, 37.7796, 10],
  "Andalucía|Huelva": [-6.9447, 37.2614, 10],
  "Andalucía|Almería": [-2.4637, 36.834, 10],
  "Asturias|Oviedo": [-5.8494, 43.3619, 10],
  "Asturias|Gijón": [-5.6619, 43.5322, 10],
  "Asturias|Avilés": [-5.9248, 43.5558, 10],
  "Baleares|Mallorca": [2.6502, 39.5696, 9],
  "Baleares|Menorca": [4.091, 39.9496, 10],
  "Baleares|Ibiza": [1.432, 38.9067, 10],
  "Baleares|Formentera": [1.4323, 38.6964, 11],
  "Canarias|Tenerife": [-16.6291, 28.2916, 9],
  "Canarias|Gran Canaria": [-15.598, 27.9202, 9],
  "Canarias|Lanzarote": [-13.636, 29.0469, 10],
  "Canarias|Fuerteventura": [-14.02, 28.3587, 9],
  "Canarias|La Palma": [-17.852, 28.6837, 10],
  "Canarias|La Gomera": [-17.24, 28.095, 11],
  "Canarias|El Hierro": [-17.997, 27.725, 11],
  "Cantabria|Santander": [-3.8099, 43.4623, 11],
  "Cantabria|Cantabria": [-3.8044, 43.1828, 9],
  "Cataluña|Barcelona": [2.1734, 41.3851, 10],
  "Cataluña|Girona": [2.8214, 41.9794, 10],
  "Cataluña|Tarragona": [1.2445, 41.1189, 10],
  "Cataluña|Lleida": [0.6222, 41.6176, 10],
  "Madrid|Madrid": [-3.7038, 40.4168, 11],
  "Comunidad Valenciana|Valencia": [-0.3763, 39.4699, 10],
  "Comunidad Valenciana|Alicante": [-0.4907, 38.3452, 10],
  "Comunidad Valenciana|Castellón": [-0.0577, 39.9864, 10],
};

function getCentroSubdestino(
  destino: string,
  subdestino: string,
): [number, number, number] | null {
  if (!destino || !subdestino) return null;
  return CENTROS_SUBDESTINO[`${destino}|${subdestino}`] ?? null;
}

function construirDestinoFinal(destino: string, subdestino: string): string {
  if (!destino.trim()) return "";
  if (!subdestino.trim()) return destino.trim();
  return `${destino.trim()}, ${subdestino.trim()}`;
}

function normalizarDestinoTexto(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function getDestinoPermitido(value?: string | null): { id: DestinoId; nombre: string } | null {
  const key = normalizarDestinoTexto(value ?? "");
  if (!key) return null;

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
    return DESTINOS_DISPONIBLES.find((item) => item.id === "andalucia") ?? null;
  }

  if (key.includes("asturias") || key.includes("oviedo") || key.includes("gijon")) {
    return DESTINOS_DISPONIBLES.find((item) => item.id === "asturias") ?? null;
  }

  if (
    key.includes("baleares") ||
    key.includes("mallorca") ||
    key.includes("menorca") ||
    key.includes("ibiza") ||
    key.includes("formentera")
  ) {
    return DESTINOS_DISPONIBLES.find((item) => item.id === "baleares") ?? null;
  }

  if (
    key.includes("canarias") ||
    key.includes("tenerife") ||
    key.includes("gran canaria") ||
    key.includes("lanzarote") ||
    key.includes("fuerteventura") ||
    key.includes("la palma")
  ) {
    return DESTINOS_DISPONIBLES.find((item) => item.id === "canarias") ?? null;
  }

  if (key.includes("cantabria") || key.includes("santander")) {
    return DESTINOS_DISPONIBLES.find((item) => item.id === "cantabria") ?? null;
  }

  if (
    key.includes("cataluna") ||
    key.includes("catalunya") ||
    key.includes("barcelona") ||
    key.includes("girona") ||
    key.includes("tarragona") ||
    key.includes("lleida")
  ) {
    return DESTINOS_DISPONIBLES.find((item) => item.id === "cataluna") ?? null;
  }

  if (key.includes("madrid")) {
    return DESTINOS_DISPONIBLES.find((item) => item.id === "madrid") ?? null;
  }

  if (
    key.includes("comunidad valenciana") ||
    key.includes("valencia") ||
    key.includes("alicante") ||
    key.includes("castellon")
  ) {
    return DESTINOS_DISPONIBLES.find((item) => item.id === "cv") ?? null;
  }

  return DESTINOS_DISPONIBLES.find((item) => normalizarDestinoTexto(item.nombre) === key) ?? null;
}

function getDestinoConfig(nombre?: string | null): { id: DestinoId; centro: [number, number] } | null {
  const destino = getDestinoPermitido(nombre);
  if (!destino) return null;

  switch (destino.id) {
    case "andalucia":
      return { id: destino.id, centro: [-4.5, 37.4] };
    case "asturias":
      return { id: destino.id, centro: [-5.85, 43.36] };
    case "baleares":
      return { id: destino.id, centro: [2.9, 39.6] };
    case "canarias":
      return { id: destino.id, centro: [-15.5, 28.3] };
    case "cantabria":
      return { id: destino.id, centro: [-3.8, 43.2] };
    case "cataluna":
      return { id: destino.id, centro: [1.5, 41.8] };
    case "madrid":
      return { id: destino.id, centro: [-3.7038, 40.4168] };
    case "cv":
      return { id: destino.id, centro: [-0.5, 39.4] };
    default:
      return null;
  }
}

const FORM_INICIAL: FormularioItinerario = {
  destino: "",
  subdestino: "",
  dias: "",
  presupuesto: "Medio",
  ritmo: "Equilibrado",
  tipoViaje: "Mixto",
  compania: "Pareja",
  intereses: "",
  transporte: "Transporte público",
  restricciones: "",
  zonaBase: "",
  visitedGlobalIds: "",
  cargarEventosLiveLuego: true,
};

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
    ayuda: "Puedes escribir nombres normales; el backend los convierte a global_id comparando con la tabla Poi.",
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

  const rawDestino = parsed?.destino ?? "";
  const partes = rawDestino.split(",").map((item) => item.trim());
  const destinoPrincipal = partes[0] ?? "";
  const subdestino = partes[1] ?? parsed?.subdestino ?? "";

  const destinoPermitido = getDestinoPermitido(destinoPrincipal);

  return {
    ...FORM_INICIAL,
    ...parsed,
    destino: destinoPermitido?.nombre ?? "",
    subdestino,
  };
}

function readStoredBaseCoords(): CoordenadasBase | null {
  const parsed = safeJsonParse<CoordenadasBase>(localStorage.getItem(STORAGE_KEY_BASE_COORDS));
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
    .filter((item) => item.toUpperCase().includes("_") || item.toUpperCase().startsWith("ES"));
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
  const parts = label.split(",").map((part) => part.trim()).filter(Boolean);
  const postalCity = parts.find((part) => /^\d{5}\s+/.test(part));

  if (postalCity) return postalCity.replace(/^\d{5}\s+/, "").trim();
  if (parts.length >= 3) return parts[parts.length - 3];
  if (parts.length >= 2) return parts[parts.length - 2];
  return parts[0] ?? "Destino";
}

function normalizarTextoBusqueda(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function getQueryTerms(value: string): string[] {
  return normalizarTextoBusqueda(value)
    .split(/\s+/)
    .map((item) => item.trim())
    .filter((item) => item.length >= 2);
}

function esBusquedaAlojamiento(query: string): boolean {
  const q = normalizarTextoBusqueda(query);
  return [
    "hotel",
    "hostal",
    "hostel",
    "apartamento",
    "apartamentos",
    "apartahotel",
    "alojamiento",
    "parador",
    "resort",
    "pension",
    "pensión",
    "airbnb",
    "riu",
    "nh",
    "ibis",
    "melia",
    "melia",
    "barcelo",
    "barceló",
    "room mate",
    "vincci",
  ].some((term) => q.includes(normalizarTextoBusqueda(term)));
}

function deduplicarSugerencias(items: SugerenciaBase[]): SugerenciaBase[] {
  const seen = new Set<string>();

  return items.filter((item) => {
    const key = `${normalizarTextoBusqueda(item.nombre)}|${item.lat.toFixed(5)}|${item.lon.toFixed(5)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function inferKindFromMapbox(
  placeType?: string,
  query?: string,
  category?: string,
  text?: string,
  placeName?: string,
): SugerenciaKind {
  const referencia = [category, text, placeName, query].filter(Boolean).join(" ");
  if (esBusquedaAlojamiento(referencia)) return "lodging";
  if (!placeType) return "address";
  if (placeType === "poi") return "poi";
  if (["neighborhood", "locality", "place", "district", "postcode"].includes(placeType)) {
    return "area";
  }
  if (placeType === "address") return "address";
  return "address";
}

function inferSecondaryTextFromMapbox(
  kind: SugerenciaKind,
  placeType?: string,
  placeName?: string,
  featureText?: string,
): string {
  const referencia = [featureText, placeName].filter(Boolean).join(" ");

  if (kind === "lodging" || esBusquedaAlojamiento(referencia)) return "Hotel / alojamiento";
  if (placeType === "postcode") return "Código postal";
  if (["neighborhood", "locality", "place", "district"].includes(placeType ?? "")) {
    return "Zona";
  }
  if (kind === "poi") return "Punto de interés";
  return "Dirección";
}

function puntuarSugerencia(item: SugerenciaBase, query: string): number {
  const q = normalizarTextoBusqueda(query);
  const nombre = normalizarTextoBusqueda(item.nombre);
  const secondary = normalizarTextoBusqueda(item.secondaryText ?? "");
  const terminos = getQueryTerms(query);

  let score = 0;

  if (item.kind === "lodging") score += 170;
  else if (item.kind === "poi") score += 90;
  else if (item.kind === "address") score += 50;
  else if (item.kind === "area") score += 30;

  if (q.length > 0) {
    if (nombre === q) score += 520;
    else if (nombre.startsWith(q)) score += 320;
    else if (nombre.includes(q)) score += 180;
  }

  for (const termino of terminos) {
    if (nombre === termino) score += 170;
    else if (nombre.startsWith(termino)) score += 95;
    else if (nombre.includes(termino)) score += 45;

    if (secondary.includes(termino)) score += 18;
  }

  if (secondary.includes("hotel")) score += 45;
  if (secondary.includes("alojamiento")) score += 35;

  return score;
}

function ordenarSugerencias(items: SugerenciaBase[], query?: string): SugerenciaBase[] {
  const prioridad: Record<SugerenciaKind, number> = {
    lodging: 0,
    poi: 1,
    address: 2,
    area: 3,
  };

  return [...items].sort((a, b) => {
    const diferenciaScore = query ? puntuarSugerencia(b, query) - puntuarSugerencia(a, query) : 0;
    if (diferenciaScore !== 0) return diferenciaScore;

    return prioridad[a.kind] - prioridad[b.kind];
  });
}

function getBadgeSugerencia(kind: SugerenciaBase["kind"], secondaryText?: string): string {
  if (secondaryText) return secondaryText;
  if (kind === "lodging") return "Hotel / alojamiento";
  if (kind === "address") return "Dirección";
  if (kind === "area") return "Zona";
  return "Punto de interés";
}

function IconoChevron({ open }: { open: boolean }) {
  return (
    <svg className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none">
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

function IconoCalendarioMini() {
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

export default function CrearItinerarioPantalla() {
  const navigate = useNavigate();
  const usuario = useAuthStore((state) => state.usuario);
  const setDestinoSeleccionado = useDestinoStore((state) => state.setDestinoSeleccionado);
  const idUsuario = usuario?.id_usuario ?? null;

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const sugerenciasAbortRef = useRef<AbortController | null>(null);
  const sugerenciasRequestIdRef = useRef(0);
  const cacheSugerenciasRef = useRef<Map<string, SugerenciaBase[]>>(new Map());

  const [mostrarRecomendaciones, setMostrarRecomendaciones] = useState(false);
  const [buscandoBase, setBuscandoBase] = useState(false);
  const [errorBase, setErrorBase] = useState<string | null>(null);
  const [baseCoords, setBaseCoords] = useState<CoordenadasBase | null>(() => readStoredBaseCoords());
  const [sugerencias, setSugerencias] = useState<SugerenciaBase[]>([]);
  const [mostrandoSugerencias, setMostrandoSugerencias] = useState(false);
  const [busquedaPoiExcluido, setBusquedaPoiExcluido] = useState("");
  const [sugerenciasPoisExcluidos, setSugerenciasPoisExcluidos] = useState<PoiExcluidoSugerencia[]>([]);
  const [buscandoPoiExcluido, setBuscandoPoiExcluido] = useState(false);
  const [form, setForm] = useState<FormularioItinerario>(() => readStoredForm());
  const [range, setRange] = useState(() => readStoredRange());
  const [calendarioAbierto, setCalendarioAbierto] = useState(false);
  const [fechaInicioTemp, setFechaInicioTemp] = useState(getTomorrowIso());
  const [fechaFinTemp, setFechaFinTemp] = useState(getTomorrowIso());
  const [errorFormulario, setErrorFormulario] = useState<string | null>(null);
  const [avisoValidacion, setAvisoValidacion] = useState<string | null>(null);
  const [generando, setGenerando] = useState(false);
  const [progresoGeneracion, setProgresoGeneracion] = useState(0);

  const daysPlaceholder = useMemo(
    () => getDaysPlaceholder(range.start, range.end),
    [range.start, range.end],
  );

  useEffect(() => {
    const destinoPermitido = getDestinoPermitido(form.destino);
    if (destinoPermitido) {
      setDestinoSeleccionado(destinoPermitido.id);
    }
  }, [form.destino, setDestinoSeleccionado]);

  useEffect(() => {
    if (!generando) {
      setProgresoGeneracion(0);
      return;
    }

    setProgresoGeneracion(8);

    const intervalId = window.setInterval(() => {
      setProgresoGeneracion((prev) => {
        if (prev >= 92) return prev;
        return prev + Math.max(1, Math.round((92 - prev) / 8));
      });
    }, 650);

    return () => window.clearInterval(intervalId);
  }, [generando]);

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
    if (!MAPBOX_TOKEN || !mapContainerRef.current || mapRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: baseCoords ? [baseCoords.lon, baseCoords.lat] : [-3.7038, 40.4168],
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
        kind: "address",
        secondaryText: "Dirección",
      });
    });

    mapRef.current = map;

    return () => {
      markerRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
  }, [baseCoords]);

  useEffect(() => {
    const query = form.zonaBase.trim();

    if (query.length < 3) {
      sugerenciasAbortRef.current?.abort();
      setSugerencias([]);
      setMostrandoSugerencias(false);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void cargarSugerencias(query);
    }, 70);

    return () => window.clearTimeout(timeoutId);
  }, [form.zonaBase, form.destino, form.subdestino]);

  useEffect(() => {
    const query = busquedaPoiExcluido.trim();
    if (query.length < 3) {
      setSugerenciasPoisExcluidos([]);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void buscarPoisParaExcluir(query);
    }, 220);

    return () => window.clearTimeout(timeoutId);
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

  function updateDestino(nombreDestino: string) {
    const destinoPermitido = getDestinoPermitido(nombreDestino);

    setForm((prev) => ({
      ...prev,
      destino: destinoPermitido?.nombre ?? "",
      subdestino: "",
      zonaBase: "",
      visitedGlobalIds: "",
    }));

    setBaseCoords(null);
    setSugerencias([]);
    setMostrandoSugerencias(false);
    setErrorBase(null);

    markerRef.current?.remove();
    markerRef.current = null;

    if (destinoPermitido) {
      setDestinoSeleccionado(destinoPermitido.id);

      const config = getDestinoConfig(destinoPermitido.nombre);
      if (config && mapRef.current) {
        mapRef.current.flyTo({
          center: config.centro,
          zoom: config.id === "madrid" ? 11 : 8,
          essential: true,
        });
      }
    }
  }

  function updateSubdestino(value: string) {
    updateForm("subdestino", value);

    const centro = getCentroSubdestino(form.destino, value);
    if (centro && mapRef.current) {
      const [lon, lat, zoom] = centro;
      mapRef.current.flyTo({
        center: [lon, lat],
        zoom,
        essential: true,
      });
    }
  }

  function abrirCalendarioPopup() {
    const minDate = getTomorrowIso();
    const start = range.start && !isBeforeIsoDate(range.start, minDate) ? range.start : minDate;
    const end = range.end && range.end >= start ? range.end : start;

    setFechaInicioTemp(start);
    setFechaFinTemp(end);
    setCalendarioAbierto(true);
  }

  function guardarRangoFechas() {
    const minDate = getTomorrowIso();

    if (fechaInicioTemp < minDate) {
      setErrorFormulario("La fecha de inicio debe ser como mínimo mañana.");
      return;
    }

    if (fechaFinTemp < fechaInicioTemp) {
      setErrorFormulario("La fecha final no puede ser anterior a la fecha de inicio.");
      return;
    }

    const nextRange = { start: fechaInicioTemp, end: fechaFinTemp };
    setRange(nextRange);
    localStorage.setItem(STORAGE_KEY_RANGE, JSON.stringify(nextRange));
    setErrorFormulario(null);
    setCalendarioAbierto(false);
  }

  function limpiarRangoFechas() {
    const emptyRange = { start: null, end: null };
    setRange(emptyRange);
    localStorage.removeItem(STORAGE_KEY_RANGE);
    setErrorFormulario(null);
    setCalendarioAbierto(false);
  }

  function getErroresValidacion(): string[] {
    const errores: string[] = [];
    const destino = construirDestinoFinal(form.destino, form.subdestino);
    const dias = Number(form.dias);
    const daysFromDates = Number(getDaysPlaceholder(range.start, range.end));

    if (!destino.trim()) {
      errores.push("Destino principal");
    } else if (!getDestinoPermitido(form.destino)) {
      errores.push("Destino válido de la lista disponible");
    }

    if (!form.subdestino.trim()) errores.push("Provincia / isla / ciudad concreta");
    if (!form.presupuesto.trim()) errores.push("Presupuesto");
    if (!form.ritmo.trim()) errores.push("Ritmo del viaje");
    if (!form.tipoViaje.trim()) errores.push("Tipo de viaje");
    if (!form.transporte.trim()) errores.push("Transporte principal");

    if (!baseCoords || !form.zonaBase.trim()) {
      errores.push("Zona base válida seleccionada en el mapa o buscador");
    }

    if (
      (!Number.isFinite(dias) || dias <= 0) &&
      (!Number.isFinite(daysFromDates) || daysFromDates <= 0)
    ) {
      errores.push("Número de días o rango de fechas");
    }

    if (form.dias && (dias < 1 || dias > 14)) {
      errores.push("Número de días entre 1 y 14");
    }

    if (range.start && isBeforeIsoDate(range.start, getTomorrowIso())) {
      errores.push("Fecha de inicio como mínimo mañana");
    }

    if (range.start && range.end && range.end < range.start) {
      errores.push("Fecha final posterior o igual a la fecha de inicio");
    }

    return uniqueText(errores);
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
        kind: "address",
        secondaryText: "Dirección",
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

  function getMapSearchContext(): {
    proximity: { lon: number; lat: number } | null;
    bbox: BBoxMapa | null;
  } {
    const map = mapRef.current;

    if (!map) {
      return {
        proximity: null,
        bbox: null,
      };
    }

    const center = map.getCenter();
    const bounds = map.getBounds();

    if (!bounds) {
      return {
        proximity: {
          lon: center.lng,
          lat: center.lat,
        },
        bbox: null,
      };
    }

    return {
      proximity: {
        lon: center.lng,
        lat: center.lat,
      },
      bbox: {
        west: bounds.getWest(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        north: bounds.getNorth(),
      },
    };
  }

  async function reverseGeocode(lat: number, lon: number): Promise<string> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
          String(lat),
        )}&lon=${encodeURIComponent(String(lon))}&zoom=18&addressdetails=1`,
        {
          headers: {
            "Accept-Language": "es",
          },
        },
      );

      if (!response.ok) {
        return `Zona seleccionada (${lat.toFixed(5)}, ${lon.toFixed(5)})`;
      }

      const data = (await response.json()) as {
        display_name?: string;
      };

      return data.display_name ?? `Zona seleccionada (${lat.toFixed(5)}, ${lon.toFixed(5)})`;
    } catch {
      return `Zona seleccionada (${lat.toFixed(5)}, ${lon.toFixed(5)})`;
    }
  }

  async function cargarSugerenciasMapbox(
    query: string,
    signal?: AbortSignal,
  ): Promise<SugerenciaBase[]> {
    if (!MAPBOX_TOKEN) return [];

    const limpio = query.trim();
    if (limpio.length < 3) return [];

    const { bbox, proximity } = getMapSearchContext();
    const destinoBusqueda = construirDestinoFinal(form.destino, form.subdestino);
    const busquedaAlojamiento = esBusquedaAlojamiento(limpio);
    const busqueda = destinoBusqueda ? `${limpio}, ${destinoBusqueda}` : limpio;

    const params = new URLSearchParams({
      access_token: MAPBOX_TOKEN,
      autocomplete: "true",
      language: "es",
      country: "es",
      limit: busquedaAlojamiento ? "10" : "8",
      types: busquedaAlojamiento
        ? "poi,address,place,postcode,neighborhood,locality"
        : "address,poi,place,postcode,neighborhood,locality",
    });

    if (bbox) {
      params.set("bbox", `${bbox.west},${bbox.south},${bbox.east},${bbox.north}`);
    }

    if (proximity) {
      params.set("proximity", `${proximity.lon},${proximity.lat}`);
    }

    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(busqueda)}.json?${params.toString()}`,
      { signal },
    );

    if (!response.ok) return [];

    const data = (await response.json()) as {
      features?: Array<{
        id?: string;
        place_name?: string;
        text?: string;
        center?: [number, number];
        place_type?: string[];
        properties?: {
          category?: string;
          maki?: string;
        };
      }>;
    };

    const resultados: SugerenciaBase[] = [];

    for (const feature of data.features ?? []) {
      const center = Array.isArray(feature.center) ? feature.center : null;
      const lon = center?.[0];
      const lat = center?.[1];

      if (typeof lat !== "number" || typeof lon !== "number") continue;

      const placeType = feature.place_type?.[0];
      const category = feature.properties?.category ?? "";
      const placeName = feature.place_name ?? feature.text ?? limpio;
      const text = feature.text ?? placeName;

      const kind = inferKindFromMapbox(placeType, limpio, category, text, placeName);
      const secondaryText = inferSecondaryTextFromMapbox(kind, placeType, placeName, text);

      resultados.push({
        id: String(feature.id ?? `${placeName}-${lat}-${lon}`),
        nombre: placeName,
        lat,
        lon,
        kind,
        secondaryText,
      });
    }

    return ordenarSugerencias(deduplicarSugerencias(resultados), limpio).slice(0, 8);
  }

  async function cargarSugerenciasDireccion(
    query: string,
    signal?: AbortSignal,
  ): Promise<SugerenciaBase[]> {
    const limpio = query.trim();
    if (limpio.length < 3) return [];

    const { bbox } = getMapSearchContext();
    const destinoBusqueda = construirDestinoFinal(form.destino, form.subdestino);
    const busqueda = destinoBusqueda ? `${limpio}, ${destinoBusqueda}` : limpio;

    const params = new URLSearchParams({
      q: busqueda,
      format: "jsonv2",
      addressdetails: "1",
      limit: "6",
      countrycodes: "es",
      "accept-language": "es",
    });

    if (bbox) {
      params.set("viewbox", `${bbox.west},${bbox.north},${bbox.east},${bbox.south}`);
      params.set("bounded", "1");
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params.toString()}`,
      {
        headers: {
          "Accept-Language": "es",
        },
        signal,
      },
    );

    if (!response.ok) return [];

    const data = (await response.json()) as Array<{
      place_id: number;
      display_name: string;
      lat: string;
      lon: string;
      type?: string;
    }>;

    const results: SugerenciaBase[] = [];

    for (const item of data) {
      const lat = Number(item.lat);
      const lon = Number(item.lon);

      if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        continue;
      }

      let kind: SugerenciaBase["kind"] = "address";
      let secondaryText = "Dirección";

      if (item.type === "suburb" || item.type === "neighbourhood") {
        kind = "area";
        secondaryText = "Barrio";
      } else if (item.type === "postcode") {
        kind = "address";
        secondaryText = "Código postal";
      } else if (item.type === "city" || item.type === "town" || item.type === "village") {
        kind = "area";
        secondaryText = "Zona";
      }

      results.push({
        id: `nominatim-${item.place_id}`,
        nombre: item.display_name,
        lat,
        lon,
        kind,
        secondaryText,
      });
    }

    return ordenarSugerencias(deduplicarSugerencias(results), limpio).slice(0, 6);
  }

  async function cargarSugerencias(query: string) {
    const limpio = query.trim();
    if (limpio.length < 3) {
      setSugerencias([]);
      setMostrandoSugerencias(false);
      return;
    }

    const queryNormalizada = normalizarTextoBusqueda(limpio);
    const cacheKey = `${normalizarTextoBusqueda(form.destino)}|${normalizarTextoBusqueda(
      form.subdestino,
    )}|${queryNormalizada}`;

    const cached = cacheSugerenciasRef.current.get(cacheKey);
    if (cached) {
      setSugerencias(cached);
      setMostrandoSugerencias(cached.length > 0);
    }

    const requestId = ++sugerenciasRequestIdRef.current;

    sugerenciasAbortRef.current?.abort();
    const controller = new AbortController();
    sugerenciasAbortRef.current = controller;

    try {
      const mapboxResultados = await cargarSugerenciasMapbox(limpio, controller.signal);

      if (controller.signal.aborted || requestId !== sugerenciasRequestIdRef.current) {
        return;
      }

      let resultados = mapboxResultados;

      if (resultados.length < 5) {
        const direcciones = await cargarSugerenciasDireccion(limpio, controller.signal);

        if (controller.signal.aborted || requestId !== sugerenciasRequestIdRef.current) {
          return;
        }

        resultados = [...resultados, ...direcciones];
      }

      const mezcladas = ordenarSugerencias(
        deduplicarSugerencias(resultados),
        limpio,
      ).slice(0, 8);

      cacheSugerenciasRef.current.set(cacheKey, mezcladas);

      if (cacheSugerenciasRef.current.size > 60) {
        const primerKey = cacheSugerenciasRef.current.keys().next().value as string | undefined;
        if (primerKey) {
          cacheSugerenciasRef.current.delete(primerKey);
        }
      }

      setSugerencias(mezcladas);
      setMostrandoSugerencias(mezcladas.length > 0);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      console.error(error);

      if (requestId === sugerenciasRequestIdRef.current && !cached) {
        setSugerencias([]);
        setMostrandoSugerencias(false);
      }
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

    setForm((prev) => {
      const destinoInferido = getDestinoPermitido(inferDestinationFromBase(sugerencia.nombre));

      return {
        ...prev,
        zonaBase: sugerencia.nombre,
        destino: prev.destino.trim() || destinoInferido?.nombre || "",
      };
    });

    colocarMarker(sugerencia.lon, sugerencia.lat);
  }

  async function buscarPoisParaExcluir(query: string) {
    if (!API_URL) return;

    try {
      setBuscandoPoiExcluido(true);
      const destinoBusqueda = construirDestinoFinal(form.destino, form.subdestino);

      const response = await fetch(
        `${API_URL}/api/pois/busqueda/texto?q=${encodeURIComponent(query)}&destino=${encodeURIComponent(destinoBusqueda)}`,
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
    const query = form.zonaBase.trim();
    if (!query) {
      setErrorBase("Escribe una zona, hotel, barrio, calle o código postal.");
      return;
    }

    try {
      setBuscandoBase(true);
      setErrorBase(null);

      const mapboxResultados = await cargarSugerenciasMapbox(query);
      let sugerenciasOrdenadas = ordenarSugerencias(
        deduplicarSugerencias(mapboxResultados),
        query,
      );

      if (!sugerenciasOrdenadas.length) {
        const direcciones = await cargarSugerenciasDireccion(query);
        sugerenciasOrdenadas = ordenarSugerencias(
          deduplicarSugerencias(direcciones),
          query,
        );
      }

      sugerenciasOrdenadas = sugerenciasOrdenadas.slice(0, 8);

      setSugerencias(sugerenciasOrdenadas);
      setMostrandoSugerencias(true);

      const primera = sugerenciasOrdenadas[0];
      if (!primera) {
        setErrorBase("No se ha encontrado esa zona. Prueba con otra búsqueda.");
        return;
      }

      aplicarUbicacion(primera);
    } catch (error) {
      console.error(error);
      setErrorBase("No se pudo buscar la zona base.");
    } finally {
      setBuscandoBase(false);
    }
  }

  function generarPayloadRecomendador(): PayloadRecomendador {
    if (!idUsuario) {
      throw new Error("No hay una sesión válida para generar el itinerario.");
    }

    if (!baseCoords) {
      throw new Error("Selecciona una zona base con el buscador o haciendo click en el mapa.");
    }

    const negativePreferences = parseNegativePreferences(form.restricciones);
    const destinoPermitido = getDestinoPermitido(form.destino);
    const destination = construirDestinoFinal(
      destinoPermitido?.nombre ?? form.destino.trim(),
      form.subdestino,
    );
    const daysFromDates = Number(getDaysPlaceholder(range.start, range.end));
    const days = Number(form.dias) || daysFromDates || 1;

    return {
      id_usuario: idUsuario,
      destination,
      days: Number.isFinite(days) && days > 0 ? days : 1,
      budget: normalizarValor(form.presupuesto),
      dates: [range.start, range.end].filter((item): item is string => Boolean(item)),
      pace: normalizarValor(form.ritmo),
      trip_type: normalizarValor(form.tipoViaje),
      companions: form.compania.trim(),
      transport: normalizarValor(form.transporte),
      must_see: form.intereses.trim(),
      extras: form.intereses.trim(),
      notes: form.restricciones.trim(),
      base_location_name: form.zonaBase.trim(),
      base_address: form.zonaBase.trim(),
      base_lat: baseCoords.lat,
      base_lon: baseCoords.lon,
      allow_excursions: false,
      visited_global_ids: parseVisitedGlobalIds(form.visitedGlobalIds),
      visited_poi_names: parseVisitedNames(form.visitedGlobalIds),
      negative_preferences: negativePreferences,
      include_live_events: false,
    };
  }

  async function generarItinerarioAhora() {
    if (generando) return;

    const erroresValidacion = getErroresValidacion();

    if (erroresValidacion.length > 0) {
      const mensaje = `Te faltan estos datos para generar el itinerario:\n\n${erroresValidacion
        .map((campo) => `• ${campo}`)
        .join("\n")}`;

      setAvisoValidacion(mensaje);
      setErrorFormulario(null);
      setErrorBase(
        erroresValidacion.some((campo) => campo.toLowerCase().includes("zona base"))
          ? "Selecciona una zona base válida con el buscador o haciendo click en el mapa."
          : null,
      );
      return;
    }

    try {
      setGenerando(true);
      setProgresoGeneracion(8);
      setAvisoValidacion(null);
      setErrorBase(null);
      setErrorFormulario(null);

      const destinoPermitido = getDestinoPermitido(form.destino);
      if (destinoPermitido) {
        setDestinoSeleccionado(destinoPermitido.id);
      }

      const payload = generarPayloadRecomendador();
      localStorage.setItem(STORAGE_KEY_RECOMMENDER_DRAFT, JSON.stringify(payload));

      const resultado = await generarItinerario(payload);

      localStorage.removeItem(STORAGE_KEY_FORM_DRAFT);
      localStorage.removeItem(STORAGE_KEY_BASE_COORDS);

      setProgresoGeneracion(100);

      window.setTimeout(() => {
        navigate(`/chat/conversacion/${resultado.id_conversacion}`);
      }, 350);
    } catch (error) {
      console.error(error);
      setErrorFormulario(
        error instanceof Error
          ? error.message
          : "No se pudo generar el itinerario. Revisa que el backend y la IA estén arrancados.",
      );
    } finally {
      window.setTimeout(() => {
        setGenerando(false);
      }, 350);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void generarItinerarioAhora();
  }

  return (
    <div className="min-h-full bg-[#f3f5f9] text-[#111827]">
      <div className="mx-auto w-full max-w-[860px] px-5 pb-28 pt-5">
        <section className="rounded-[30px] bg-gradient-to-br from-[#fff8f4] via-[#ffffff] to-[#f4f1ff] p-5 shadow-[0_12px_30px_rgba(15,23,42,0.07)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#94a3b8]">Itinerarios</p>
              <h1 className="mt-2 text-[24px] font-bold tracking-[-0.03em]">Crear itinerario</h1>
              <p className="mt-2 text-sm leading-6 text-[#667085]">
                Rellena el destino, la zona base y tus preferencias. Al generar se abrirá automáticamente el chat con la propuesta guardada.
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
                <p className="text-sm font-semibold text-[#8c2d12]">Preguntas clave para el motor de IA</p>
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
          noValidate
          onSubmit={handleSubmit}
          className="mt-5 rounded-[30px] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.07)]"
        >
          {errorFormulario && (
            <div className="mb-4 rounded-[18px] bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {errorFormulario}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#111827]">Destino</label>
                <select
                  value={form.destino}
                  onChange={(event) => updateDestino(event.target.value)}
                  required
                  className="w-full rounded-[18px] border border-[#d9dee8] bg-[#fcfcfd] px-4 py-3 text-sm text-[#111827] outline-none"
                >
                  <option value="">Selecciona un destino disponible</option>
                  {DESTINOS_DISPONIBLES.map((destino) => (
                    <option key={destino.id} value={destino.nombre}>
                      {destino.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#111827]">
                  Provincia / isla / ciudad
                </label>
                <select
                  value={form.subdestino}
                  onChange={(event) => updateSubdestino(event.target.value)}
                  disabled={!form.destino}
                  className="w-full rounded-[18px] border border-[#d9dee8] bg-[#fcfcfd] px-4 py-3 text-sm text-[#111827] outline-none disabled:opacity-60"
                >
                  <option value="">
                    {form.destino ? "Selecciona una zona concreta" : "Selecciona antes un destino"}
                  </option>
                  {(SUBDESTINOS_POR_DESTINO[form.destino] ?? []).map((item) => (
                    <option key={item} value={item}>
                      {form.destino}, {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs leading-5 text-[#667085]">
                  Así evitamos mezclar territorios demasiado amplios. Por ejemplo:
                  <strong> Canarias, Tenerife</strong> o <strong>Baleares, Ibiza</strong>.
                </p>
              </div>
            </div>

            <div className="rounded-[24px] border border-[#e5e7eb] bg-[#fcfcfd] p-4">
              <div className="mb-3">
                <p className="text-sm font-bold text-[#111827]">Zona base del viaje</p>
                <p className="mt-1 text-xs leading-5 text-[#667085]">
                  Escribe al menos 3 letras. Buscamos hoteles, barrios, calles y zonas usando mejor el contexto del mapa y del destino.
                </p>
              </div>

              <div className="relative grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
                <div className="relative">
                  <input
                    type="text"
                    value={form.zonaBase}
                    onChange={(event) => updateZonaBase(event.target.value)}
                    onFocus={() => setMostrandoSugerencias(true)}
                    placeholder="Ej. hotel, calle, barrio, código postal..."
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
                          className="block w-full border-b border-[#f1f5f9] px-4 py-3 text-left transition last:border-b-0 hover:bg-[#fff7f3]"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-[#344054]">{sugerencia.nombre}</p>
                            </div>
                            <span className="shrink-0 rounded-full bg-[#fff1eb] px-2.5 py-1 text-[11px] font-semibold text-[#ff5a36]">
                              {getBadgeSugerencia(sugerencia.kind, sugerencia.secondaryText)}
                            </span>
                          </div>
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

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#111827]">Días</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={form.dias}
                    onChange={(event) => updateForm("dias", event.target.value)}
                    placeholder={daysPlaceholder}
                    className="w-full rounded-[18px] border border-[#d9dee8] bg-[#fcfcfd] px-4 py-3 text-sm outline-none placeholder:text-[#98a2b3]"
                  />
                  <button
                    type="button"
                    onClick={abrirCalendarioPopup}
                    className="flex h-[46px] w-[52px] shrink-0 items-center justify-center rounded-[18px] bg-[#ff5a36] text-white shadow-[0_10px_24px_rgba(255,90,54,0.28)]"
                    title="Seleccionar fechas"
                  >
                    <IconoCalendarioMini />
                  </button>
                </div>

                <p className="mt-2 text-xs leading-5 text-[#667085]">
                  Puedes escribir solo los días o seleccionar un rango de fechas.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#111827]">Presupuesto</label>
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
                onClick={abrirCalendarioPopup}
                className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#111827]"
              >
                Abrir calendario
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#111827]">Ritmo del viaje</label>
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
                <label className="mb-2 block text-sm font-semibold text-[#111827]">Tipo de viaje</label>
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
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#111827]">Compañía</label>
              <select
                value={form.compania}
                onChange={(event) => updateForm("compania", event.target.value)}
                className="w-full rounded-[18px] border border-[#d9dee8] bg-[#fcfcfd] px-4 py-3 text-sm outline-none"
              >
                <option value="Solo">Solo</option>
                <option value="Pareja">Pareja</option>
                <option value="Amigos">Amigos</option>
                <option value="Familia">Familia</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#111827]">
                Lugares imprescindibles y extras deseados
              </label>
              <textarea
                rows={4}
                value={form.intereses}
                onChange={(event) => updateForm("intereses", event.target.value)}
                placeholder="Ej. playas top, casco histórico, restaurantes locales, miradores, compras, ocio nocturno..."
                className="w-full rounded-[18px] border border-[#d9dee8] bg-[#fcfcfd] px-4 py-3 text-sm outline-none placeholder:text-[#98a2b3]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#111827]">Transporte</label>
              <select
                value={form.transporte}
                onChange={(event) => updateForm("transporte", event.target.value)}
                className="w-full rounded-[18px] border border-[#d9dee8] bg-[#fcfcfd] px-4 py-3 text-sm outline-none"
              >
                <option value="Transporte público">Transporte público</option>
                <option value="Coche">Coche</option>
                <option value="Mixto">Mixto</option>
                <option value="A pie">A pie</option>
              </select>
            </div>

            <div className="rounded-[24px] border border-[#e5e7eb] bg-[#fcfcfd] p-4">
              <label className="mb-2 block text-sm font-semibold text-[#111827]">
                Restricciones y preferencias negativas
              </label>
              <textarea
                rows={4}
                value={form.restricciones}
                onChange={(event) => updateForm("restricciones", event.target.value)}
                placeholder="Ej. No quiero museos, no caminar mucho, evitar playas, movilidad reducida, horarios concretos..."
                className="w-full rounded-[18px] border border-[#d9dee8] bg-white px-4 py-3 text-sm outline-none placeholder:text-[#98a2b3]"
              />
              <p className="mt-2 text-xs leading-5 text-[#667085]">
                Aquí unificamos restricciones y cosas que quieres evitar. Puedes separarlas por comas o escribir una por línea.
              </p>
            </div>

            <div className="rounded-[24px] border border-[#e5e7eb] bg-[#fcfcfd] p-4">
              <label className="mb-2 block text-sm font-semibold text-[#111827]">
                POIs que NO quieres que salgan
              </label>
              <p className="mb-3 text-xs leading-5 text-[#667085]">
                Escribe parte del nombre y selecciona el POI real.
              </p>

              <div className="relative">
                <input
                  type="text"
                  value={busquedaPoiExcluido}
                  onChange={(event) => setBusquedaPoiExcluido(event.target.value)}
                  placeholder="Ej. Plaza España, Bernabéu, Museo del Prado..."
                  className="w-full rounded-[18px] border border-[#d9dee8] bg-white px-4 py-3 text-sm outline-none placeholder:text-[#98a2b3]"
                />

                {busquedaPoiExcluido.trim().length >= 3 && (
                  <div className="absolute left-0 right-0 top-[54px] z-40 overflow-hidden rounded-[18px] border border-[#e5e7eb] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.16)]">
                    {buscandoPoiExcluido ? (
                      <div className="px-4 py-3 text-sm text-[#667085]">Buscando POIs...</div>
                    ) : sugerenciasPoisExcluidos.length > 0 ? (
                      sugerenciasPoisExcluidos.map((poi) => (
                        <button
                          key={poi.id_poi}
                          type="button"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => seleccionarPoiExcluido(poi)}
                          className="block w-full border-b border-[#f1f5f9] px-4 py-3 text-left transition last:border-b-0 hover:bg-[#fff7f3]"
                        >
                          <p className="text-sm font-semibold text-[#111827]">{poi.nombre}</p>
                          <p className="mt-1 text-xs text-[#667085]">
                            {[poi.categoria_poi?.nombre, poi.municipio?.nombre, poi.direccion]
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
                onChange={(event) => updateForm("visitedGlobalIds", event.target.value)}
                placeholder="También puedes escribir nombres separados por comas: Bernabéu, Puerta del Sol..."
                className="mt-4 w-full rounded-[18px] border border-[#d9dee8] bg-white px-4 py-3 text-sm outline-none placeholder:text-[#98a2b3]"
              />

              <p className="mt-2 text-xs leading-5 text-[#667085]">
                El backend comparará estos nombres con la tabla Poi y los convertirá a global_id para que el recomendador no los elija.
              </p>
            </div>

            <div className="rounded-[24px] border border-[#dbeafe] bg-[#eff6ff] p-4">
              <p className="text-sm font-black text-[#1d4ed8]">Eventos en vivo bajo demanda</p>
              <p className="mt-2 text-sm leading-6 text-[#1e3a8a]">
                El itinerario se generará sin cargar conciertos, teatro o eventos live automáticamente. Después, dentro de cada día del itinerario, podrás buscar eventos en vivo y añadir solo los que realmente te interesen.
              </p>

              <label className="mt-4 flex items-center gap-3 text-sm font-semibold text-[#1e3a8a]">
                <input
                  type="checkbox"
                  checked={form.cargarEventosLiveLuego}
                  onChange={(event) => updateForm("cargarEventosLiveLuego", event.target.checked)}
                />
                Gestionar eventos live manualmente después
              </label>

              <div className="mt-4 rounded-[18px] bg-white/70 px-4 py-3 text-xs leading-5 text-[#1e3a8a]">
                Esta opción evita cargar eventos de pago o demasiadas propuestas desde el principio.
              </div>
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
                type="button"
                disabled={generando}
                onClick={() => void generarItinerarioAhora()}
                className="flex-1 rounded-2xl bg-[#ff5a36] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(255,90,54,0.28)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {generando ? "Generando..." : "Generar itinerario"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {calendarioAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-5 backdrop-blur-sm">
          <div className="w-full max-w-[430px] rounded-[30px] bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.28)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#ff5a36]">Calendario</p>
                <h2 className="mt-2 text-[22px] font-bold tracking-[-0.03em] text-[#111827]">
                  Seleccionar fechas
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#667085]">
                  El inicio mínimo es mañana. También puedes cerrar esto y escribir solo los días.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCalendarioAbierto(false)}
                className="rounded-full bg-[#f3f4f6] px-3 py-2 text-sm font-bold text-[#111827]"
              >
                ×
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#111827]">Fecha de inicio</label>
                <input
                  type="date"
                  min={getTomorrowIso()}
                  value={fechaInicioTemp}
                  onChange={(event) => {
                    const nextStart = event.target.value;
                    setFechaInicioTemp(nextStart);
                    if (fechaFinTemp < nextStart) setFechaFinTemp(nextStart);
                  }}
                  className="w-full rounded-[18px] border border-[#d9dee8] bg-[#fcfcfd] px-4 py-3 text-sm outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#111827]">Fecha final</label>
                <input
                  type="date"
                  min={fechaInicioTemp || getTomorrowIso()}
                  value={fechaFinTemp}
                  onChange={(event) => setFechaFinTemp(event.target.value)}
                  className="w-full rounded-[18px] border border-[#d9dee8] bg-[#fcfcfd] px-4 py-3 text-sm outline-none"
                />
              </div>

              <div className="rounded-[18px] bg-[#fff7f4] px-4 py-3 text-sm font-semibold text-[#9a3412]">
                Duración calculada: {getDaysPlaceholder(fechaInicioTemp, fechaFinTemp)} días
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={limpiarRangoFechas}
                className="rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-semibold text-[#111827]"
              >
                Sin fecha
              </button>

              <button
                type="button"
                onClick={() => setCalendarioAbierto(false)}
                className="rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-semibold text-[#111827]"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={guardarRangoFechas}
                className="rounded-2xl bg-[#ff5a36] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(255,90,54,0.28)]"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {avisoValidacion && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-5 backdrop-blur-sm">
          <div className="w-full max-w-[360px] rounded-[30px] bg-white p-6 text-center shadow-[0_24px_70px_rgba(15,23,42,0.24)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#fff4ef] text-xl font-black text-[#ff5a36]">
              !
            </div>
            <h2 className="mt-5 text-xl font-bold text-[#111827]">Faltan datos</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-[#667085]">{avisoValidacion}</p>

            <button
              type="button"
              onClick={() => setAvisoValidacion(null)}
              className="mt-5 w-full rounded-2xl bg-[#ff5a36] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(255,90,54,0.28)]"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {generando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 px-5 backdrop-blur-sm">
          <div className="w-full max-w-[360px] rounded-[30px] bg-white p-6 text-center shadow-[0_24px_70px_rgba(15,23,42,0.24)]">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#ffe0d6] border-t-[#ff5a36]" />
            <h2 className="mt-5 text-xl font-bold text-[#111827]">Generando itinerario</h2>
            <p className="mt-2 text-sm leading-6 text-[#667085]">
              Estamos preparando la ruta con tus preferencias. No cierres esta pantalla.
            </p>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#f3f4f6]">
              <div
                className="h-full rounded-full bg-[#ff5a36] transition-all duration-500"
                style={{ width: `${progresoGeneracion}%` }}
              />
            </div>
            <p className="mt-3 text-sm font-black text-[#ff5a36]">{progresoGeneracion}%</p>
          </div>
        </div>
      )}
    </div>
  );
}