import { useNavigate, useParams } from "react-router-dom";
import { obtenerItinerarioPorId, itinerariosMock } from "../../datos/mock/itinerariosMock";

export default function DetalleItinerarioPantalla() {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const itinerarioId = params.id ?? "";

  const itinerario = obtenerItinerarioPorId(itinerarioId);

  if (!itinerario) {
    return (
      <div className="min-h-full bg-[#f3f5f9] text-[#111827]">
        <div className="mx-auto w-full max-w-[430px] px-5 pb-28 pt-5">
          <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.07)]">
            <h1 className="text-xl font-bold">Itinerario no encontrado</h1>
            <p className="mt-2 text-sm leading-6 text-[#6b7280]">
              No hemos podido localizar el itinerario seleccionado.
            </p>

            <div className="mt-4 rounded-2xl bg-[#f8fafc] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">
                Debug
              </p>
              <p className="mt-2 text-sm text-[#334155]">
                ID recibido: <span className="font-semibold">{itinerarioId || "(vacío)"}</span>
              </p>
              <p className="mt-2 text-sm text-[#334155]">
                IDs disponibles:{" "}
                <span className="font-semibold">
                  {itinerariosMock.map((item) => item.id).join(", ")}
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/itinerarios")}
              className="mt-5 rounded-2xl bg-[#111827] px-4 py-3 text-sm font-semibold text-white"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#f3f5f9] text-[#111827]">
      <div className="mx-auto w-full max-w-[430px] pb-28">
        <section className="relative h-[270px] overflow-hidden">
          <img
            src={itinerario.imagen}
            alt={itinerario.titulo}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <button
            type="button"
            onClick={() => navigate("/itinerarios")}
            className="absolute left-5 top-5 rounded-2xl bg-white/90 px-4 py-2 text-sm font-semibold text-[#111827] backdrop-blur"
          >
            Volver
          </button>

          <div className="absolute bottom-5 left-5 right-5 text-white">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                {itinerario.dias} días
              </span>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                {itinerario.destino}
              </span>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                {itinerario.presupuesto}
              </span>
            </div>

            <h1 className="mt-3 text-[28px] font-bold leading-tight">
              {itinerario.titulo}
            </h1>
            <p className="mt-2 text-sm leading-6 text-white/85">
              {itinerario.subtitulo}
            </p>
          </div>
        </section>

        <section className="px-5 pt-5">
          <div className="rounded-[28px] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.07)]">
            <h2 className="text-[18px] font-bold">Resumen del itinerario</h2>
            <p className="mt-3 text-sm leading-6 text-[#667085]">
              {itinerario.descripcionLarga}
            </p>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-[#f8fafc] p-3">
                <p className="text-xs text-[#94a3b8]">Avance</p>
                <p className="mt-1 text-sm font-semibold">{itinerario.progreso}%</p>
              </div>
              <div className="rounded-2xl bg-[#f8fafc] p-3">
                <p className="text-xs text-[#94a3b8]">Lugares</p>
                <p className="mt-1 text-sm font-semibold">{itinerario.lugares}</p>
              </div>
              <div className="rounded-2xl bg-[#f8fafc] p-3">
                <p className="text-xs text-[#94a3b8]">Temporada</p>
                <p className="mt-1 text-sm font-semibold">{itinerario.temporada}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 pt-5">
          <div className="rounded-[28px] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.07)]">
            <h2 className="text-[18px] font-bold">Preguntas para la IA</h2>
            <p className="mt-2 text-sm leading-6 text-[#667085]">
              Estas son las preguntas base que usaríamos para generar o mejorar este viaje.
            </p>

            <div className="mt-4 space-y-3">
              {itinerario.preguntasIA.map((pregunta, index) => (
                <div
                  key={`${itinerario.id}-pregunta-${index}`}
                  className="rounded-2xl border border-[#edf0f4] bg-[#fcfcfd] p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">
                    Pregunta {index + 1}
                  </p>
                  <p className="mt-2 text-sm font-medium leading-6 text-[#111827]">
                    {pregunta}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pt-5">
          <div className="rounded-[28px] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.07)]">
            <h2 className="text-[18px] font-bold">Plan por días</h2>

            <div className="mt-4 space-y-4">
              {itinerario.diasPlan.map((dia) => (
                <div
                  key={`${itinerario.id}-dia-${dia.dia}`}
                  className="rounded-[24px] border border-[#edf0f4] bg-[#fcfcfd] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">
                        Día {dia.dia}
                      </p>
                      <h3 className="mt-1 text-[16px] font-bold">{dia.titulo}</h3>
                    </div>
                    <span className="rounded-full bg-[#fff4ef] px-3 py-1 text-xs font-semibold text-[#ff5a36]">
                      {dia.actividades.length} actividades
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-[#667085]">{dia.resumen}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {dia.actividades.map((actividad, index) => (
                      <span
                        key={`${itinerario.id}-dia-${dia.dia}-actividad-${index}`}
                        className="rounded-full bg-[#f3f4f6] px-3 py-1 text-xs font-medium text-[#374151]"
                      >
                        {actividad}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pt-5">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/itinerarios")}
              className="flex-1 rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-semibold text-[#111827]"
            >
              Volver
            </button>
            <button
              type="button"
              onClick={() => navigate("/itinerarios/crear")}
              className="flex-1 rounded-2xl bg-[#ff5a36] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(255,90,54,0.28)]"
            >
              Regenerar con IA
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}