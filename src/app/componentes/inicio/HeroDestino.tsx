type Props = {
  titulo: string;
  subtitulo: string;
  imagen: string;
  onExplorar: () => void;
  onEventos: () => void;
  botonExplorarTexto?: string;
  botonEventosTexto?: string;
};

export default function HeroDestino({
  titulo,
  subtitulo,
  imagen,
  onExplorar,
  onEventos,
  botonExplorarTexto = "Explora más",
  botonEventosTexto = "Ver eventos hoy",
}: Props) {
  return (
    <section className="relative h-[335px] w-full overflow-hidden rounded-b-[24px]">
      <img
        src={imagen}
        alt={titulo}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/20" />

      <div className="absolute inset-x-0 top-[52px] px-6 text-center text-white">
        <h1 className="font-['Poppins:SemiBold',sans-serif] text-[30px] leading-[40px]">
          {titulo}
        </h1>

        <p className="mt-3 font-['Poppins:SemiBold',sans-serif] text-[10px]">
          {subtitulo}
        </p>

        <div className="mt-10 flex justify-center gap-3">
          <button
            onClick={onExplorar}
            className="h-[31px] rounded-[10px] bg-[#f2361d] px-6 transition hover:bg-[#d12f17]"
            type="button"
          >
            <span className="font-['Poppins:SemiBold',sans-serif] text-[10px] text-white">
              {botonExplorarTexto}
            </span>
          </button>

          <button
            onClick={onEventos}
            className="h-[31px] rounded-[10px] bg-[#f2361d] px-6 transition hover:bg-[#d12f17]"
            type="button"
          >
            <span className="font-['Poppins:SemiBold',sans-serif] text-[10px] text-white">
              {botonEventosTexto}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}