import { useState } from "react";
import { useNavigate } from "react-router-dom";

const preguntasBase = [
  "¿Cuál es el destino principal?",
  "¿Cuántos días durará el viaje?",
  "¿Cuál es el presupuesto aproximado?",
  "¿Qué ritmo prefieres: relajado, equilibrado o intenso?",
  "¿Qué tipo de viaje quieres: cultural, naturaleza, gastronómico, costa o mixto?",
  "¿Viajas solo, en pareja, con amigos o en familia?",
  "¿Quieres priorizar imprescindibles turísticos o lugares menos masificados?",
  "¿Necesitas incluir restaurantes, miradores, playas, compras o vida nocturna?",
  "¿Te moverás en coche, transporte público o a pie?",
  "¿Hay alguna ciudad, barrio o actividad obligatoria que quieras incluir?",
];

export default function CrearItinerarioPantalla() {
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    destino: "",
    dias: "",
    presupuesto: "",
    ritmo: "Equilibrado",
    tipoViaje: "Mixto",
    compania: "",
    imprescindibles: "",
    extras: "",
    transporte: "",
    restricciones: "",
  });

  function actualizarCampo(
    campo: keyof typeof formulario,
    valor: string
  ) {
    setFormulario((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  function manejarCrear() {
    console.log("Payload para IA:", formulario);
    navigate("/itinerarios");
  }

  return (
    <div className="min-h-full bg-[#f3f5f9] text-[#111827]">
      <div className="mx-auto w-full max-w-[430px] px-5 pb-28 pt-5">
        <section className="rounded-[30px] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.07)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-[24px] font-bold tracking-[-0.03em]">
                Crear itinerario
              </h1>
              <p className="mt-2 text-sm leading-6 text-[#667085]">
                Esta pantalla recoge la información que luego enviaremos al módulo
                de inteligencia artificial para generar una propuesta personalizada.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/itinerarios")}
              className="rounded-2xl bg-[#f3f4f6] px-3 py-2 text-sm font-semibold text-[#111827]"
            >
              Cerrar
            </button>
          </div>

          <div className="mt-5 rounded-2xl bg-[#fff7ed] p-4">
            <p className="text-sm font-semibold text-[#c2410c]">
              Preguntas clave para el motor de IA
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-[#7c2d12]">
              {preguntasBase.map((pregunta) => (
                <li key={pregunta}>• {pregunta}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold">Destino</label>
              <input
                value={formulario.destino}
                onChange={(e) => actualizarCampo("destino", e.target.value)}
                placeholder="Ej. Andalucía, Madrid, Valencia..."
                className="w-full rounded-2xl border border-[#e5e7eb] bg-[#fcfcfd] px-4 py-3 text-sm outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-sm font-semibold">Días</label>
                <input
                  value={formulario.dias}
                  onChange={(e) => actualizarCampo("dias", e.target.value)}
                  placeholder="Ej. 5"
                  className="w-full rounded-2xl border border-[#e5e7eb] bg-[#fcfcfd] px-4 py-3 text-sm outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Presupuesto</label>
                <input
                  value={formulario.presupuesto}
                  onChange={(e) => actualizarCampo("presupuesto", e.target.value)}
                  placeholder="Ej. Medio"
                  className="w-full rounded-2xl border border-[#e5e7eb] bg-[#fcfcfd] px-4 py-3 text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Ritmo del viaje</label>
              <select
                value={formulario.ritmo}
                onChange={(e) => actualizarCampo("ritmo", e.target.value)}
                className="w-full rounded-2xl border border-[#e5e7eb] bg-[#fcfcfd] px-4 py-3 text-sm outline-none"
              >
                <option>Relajado</option>
                <option>Equilibrado</option>
                <option>Intenso</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Tipo de viaje</label>
              <select
                value={formulario.tipoViaje}
                onChange={(e) => actualizarCampo("tipoViaje", e.target.value)}
                className="w-full rounded-2xl border border-[#e5e7eb] bg-[#fcfcfd] px-4 py-3 text-sm outline-none"
              >
                <option>Mixto</option>
                <option>Cultural</option>
                <option>Naturaleza</option>
                <option>Gastronómico</option>
                <option>Costa</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Compañía</label>
              <input
                value={formulario.compania}
                onChange={(e) => actualizarCampo("compania", e.target.value)}
                placeholder="Solo, pareja, amigos, familia..."
                className="w-full rounded-2xl border border-[#e5e7eb] bg-[#fcfcfd] px-4 py-3 text-sm outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Imprescindibles</label>
              <textarea
                value={formulario.imprescindibles}
                onChange={(e) => actualizarCampo("imprescindibles", e.target.value)}
                placeholder="Lugares o actividades que deben aparecer sí o sí"
                className="min-h-[96px] w-full rounded-2xl border border-[#e5e7eb] bg-[#fcfcfd] px-4 py-3 text-sm outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Extras deseados</label>
              <textarea
                value={formulario.extras}
                onChange={(e) => actualizarCampo("extras", e.target.value)}
                placeholder="Restaurantes, miradores, compras, playas, ocio nocturno..."
                className="min-h-[96px] w-full rounded-2xl border border-[#e5e7eb] bg-[#fcfcfd] px-4 py-3 text-sm outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Transporte</label>
              <input
                value={formulario.transporte}
                onChange={(e) => actualizarCampo("transporte", e.target.value)}
                placeholder="Coche, tren, transporte público, a pie..."
                className="w-full rounded-2xl border border-[#e5e7eb] bg-[#fcfcfd] px-4 py-3 text-sm outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Restricciones o notas</label>
              <textarea
                value={formulario.restricciones}
                onChange={(e) => actualizarCampo("restricciones", e.target.value)}
                placeholder="Niños, movilidad, horarios, preferencias alimentarias..."
                className="min-h-[96px] w-full rounded-2xl border border-[#e5e7eb] bg-[#fcfcfd] px-4 py-3 text-sm outline-none"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/itinerarios")}
              className="flex-1 rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-semibold text-[#111827]"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={manejarCrear}
              className="flex-1 rounded-2xl bg-[#ff5a36] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(255,90,54,0.28)]"
            >
              Generar itinerario
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}