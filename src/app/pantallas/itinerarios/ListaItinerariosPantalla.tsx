export default function ListaItinerariosPantalla() {
  return (
    <div className="min-h-screen bg-[#f5f7fb] pb-24">
      <div className="mx-auto w-full max-w-[393px] px-4 pt-6">
        <h1 className="text-[24px] font-semibold text-black">Itinerarios guardados</h1>
        <p className="mt-2 text-[14px] text-[#7c6b69]">
          Aquí aparecerán tus viajes, rutas e itinerarios guardados
        </p>

        <div className="mt-6 space-y-4">
          <div className="rounded-[20px] bg-white p-4 shadow-sm">
            <p className="text-[16px] font-semibold text-black">Escapada a Madrid</p>
            <p className="mt-1 text-[13px] text-[#7c6b69]">3 días · Guardado</p>
          </div>

          <div className="rounded-[20px] bg-white p-4 shadow-sm">
            <p className="text-[16px] font-semibold text-black">Ruta por Andalucía</p>
            <p className="mt-1 text-[13px] text-[#7c6b69]">5 días · Guardado</p>
          </div>
        </div>
      </div>
    </div>
  );
}