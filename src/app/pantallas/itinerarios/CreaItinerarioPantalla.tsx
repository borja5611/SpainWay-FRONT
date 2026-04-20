import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type PreguntaIa = {
  id: string;
  titulo: string;
  ayuda: string;
};

const STORAGE_KEY_RANGE = "spainway_trip_date_range";

const preguntasIa: PreguntaIa[] = [
  {
    id: "destino",
    titulo: "¿Cuál es el destino principal?",
    ayuda: "Indica la ciudad, comunidad o zona base sobre la que quieres construir el viaje.",
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
  const [mostrarRecomendaciones, setMostrarRecomendaciones] = useState(false);

  const range = useMemo(() => readStoredRange(), []);
  const daysPlaceholder = useMemo(
    () => getDaysPlaceholder(range.start, range.end),
    [range.end, range.start]
  );

  return (
    <div className="min-h-full bg-[#f3f5f9] text-[#111827]">
      <div className="mx-auto w-full max-w-[430px] px-5 pb-28 pt-5">
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
                    <li key={pregunta.id}>• {pregunta.titulo}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        <section className="mt-5 rounded-[30px] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.07)]">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#111827]">
                Destino
              </label>
              <input
                type="text"
                placeholder="Ej. Andalucía, Madrid, Valencia..."
                className="w-full rounded-[18px] border border-[#d9dee8] bg-[#fcfcfd] px-4 py-3 text-sm outline-none placeholder:text-[#98a2b3]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#111827]">
                  Días
                </label>
                <input
                  type="text"
                  placeholder={daysPlaceholder}
                  className="w-full rounded-[18px] border border-[#d9dee8] bg-[#fcfcfd] px-4 py-3 text-sm outline-none placeholder:text-[#98a2b3]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#111827]">
                  Presupuesto
                </label>
                <input
                  type="text"
                  placeholder="Ej. Medio"
                  className="w-full rounded-[18px] border border-[#d9dee8] bg-[#fcfcfd] px-4 py-3 text-sm outline-none placeholder:text-[#98a2b3]"
                />
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
              <select className="w-full rounded-[18px] border border-[#d9dee8] bg-[#fcfcfd] px-4 py-3 text-sm outline-none">
                <option>Equilibrado</option>
                <option>Relajado</option>
                <option>Intenso</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#111827]">
                Tipo de viaje
              </label>
              <select className="w-full rounded-[18px] border border-[#d9dee8] bg-[#fcfcfd] px-4 py-3 text-sm outline-none">
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
                placeholder="Niños, movilidad, horarios, preferencias alimentarias..."
                className="w-full rounded-[18px] border border-[#d9dee8] bg-[#fcfcfd] px-4 py-3 text-sm outline-none placeholder:text-[#98a2b3]"
              />
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
                className="flex-1 rounded-2xl bg-[#ff5a36] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(255,90,54,0.28)]"
              >
                Generar itinerario
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}