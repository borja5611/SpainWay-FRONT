import { useNavigate } from "react-router-dom";
import { itinerariosMock } from "@/app/datos/mock/itinerariosMock";

const ideas = [
  {
    titulo: "Escapada urbana",
    texto: "Ciudades cómodas, imprescindibles bien elegidos y un ritmo realista.",
    mockIndex: 0,
  },
  {
    titulo: "Viaje cultural",
    texto: "Patrimonio, museos y monumentos con un orden que tenga sentido.",
    mockIndex: 1,
  },
  {
    titulo: "Naturaleza y relax",
    texto: "Paisajes, paradas bonitas y un ritmo más relajado y disfrutable.",
    mockIndex: 2,
  },
];

export default function InicioChatPantalla() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-[#f3f5f9] text-[#111827]">
      <div className="mx-auto w-full max-w-[430px] px-5 pb-28 pt-5">
        <section className="rounded-[30px] bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
          <p className="text-xs uppercase tracking-[0.18em] text-[#94a3b8]">Chat</p>
          <h1 className="mt-2 text-[28px] font-black tracking-[-0.04em]">
            Asistente SpainWay
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#667085]">
            Consulta tus conversaciones guardadas o usa ejemplos para inspirarte antes de generar un itinerario real.
          </p>
        </section>

        <section className="mt-5 rounded-[30px] bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
          <h2 className="text-lg font-black">Qué hace ahora mismo</h2>
          <p className="mt-3 text-sm leading-6 text-[#667085]">
            El asistente guarda conversaciones, genera itinerarios estructurados y permite continuar ajustando el viaje desde el chat.
          </p>

          <button
            type="button"
            onClick={() => navigate("/chat/destino")}
            className="mt-5 w-full rounded-2xl bg-[#ff5a36] px-5 py-4 text-sm font-black text-white shadow-[0_12px_28px_rgba(255,90,54,0.30)]"
          >
            Ver chats
          </button>
        </section>

        <section className="mt-6">
          <h2 className="text-[20px] font-black">Empieza con una idea</h2>
          <p className="mt-1 text-sm text-[#667085]">
            Estos accesos abren ejemplos de itinerarios, no chats vacíos.
          </p>

          <div className="mt-4 space-y-4">
            {ideas.map((idea) => {
              const ejemplo = itinerariosMock[idea.mockIndex];
              return (
                <article
                  key={idea.titulo}
                  className="rounded-[28px] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.07)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black">{idea.titulo}</h3>
                      <p className="mt-2 text-sm font-semibold leading-6 text-[#667085]">
                        {idea.texto}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fff4ef] text-[#ff5a36]">
                      ✧
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/itinerarios/${ejemplo?.id ?? "ejemplo-cultural"}`)}
                    className="mt-5 rounded-2xl bg-[#f8fafc] px-4 py-3 text-sm font-black text-[#344054]"
                  >
                    Ver ejemplo de itinerario
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
