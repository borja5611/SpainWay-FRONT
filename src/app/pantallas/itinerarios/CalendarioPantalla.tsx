import { useNavigate } from "react-router-dom";
import { useDestinoStore } from "@/app/store/useDestinoStore";
import { calendarioPorDestino } from "@/app/datos/mock/calendarioPorDestino";

export default function CalendarioPantalla() {
  const navigate = useNavigate();
  const destinoSeleccionado = useDestinoStore((state) => state.destinoSeleccionado);

  if (!destinoSeleccionado) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-[24px] font-semibold text-black mb-3">
            No has seleccionado destino
          </h1>
          <button
            onClick={() => navigate("/inicio")}
            className="rounded-[10px] bg-[#e12414] px-6 py-3 text-white"
          >
            Ir a inicio
          </button>
        </div>
      </div>
    );
  }

  const eventos = calendarioPorDestino[destinoSeleccionado];

  return (
    <div className="min-h-screen bg-[#f5f7fb] pb-24">
      <div className="mx-auto w-full max-w-[393px] px-4 pt-6">
        <h1 className="text-[24px] font-semibold text-black">Agenda</h1>
        <p className="mt-2 text-[14px] text-[#7c6b69]">
          Eventos sugeridos para el destino seleccionado
        </p>

        <div className="mt-6 space-y-4">
          {eventos.length > 0 ? (
            eventos.map((evento) => (
              <div
                key={evento.id}
                className="overflow-hidden rounded-[20px] bg-white shadow-sm"
              >
                <img
                  src={evento.imagen}
                  alt={evento.titulo}
                  className="w-full object-cover"
                />
                <div className="p-4">
                  <p className="text-[16px] font-semibold text-black">
                    {evento.titulo}
                  </p>
                  <p className="mt-1 text-[13px] text-[#7c6b69]">{evento.fecha}</p>
                  <p className="text-[13px] text-[#7c6b69]">{evento.lugar}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[20px] bg-white p-4 shadow-sm">
              <p className="text-[14px] text-[#7c6b69]">
                Próximamente habrá agenda visual para este destino.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}