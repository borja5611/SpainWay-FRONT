type Props = {
  titulo: string;
  descripcion: string;
  imagen: string;
  onAbrirMapa: () => void;
};

export default function ExploraVisualmenteCard({
  titulo,
  descripcion,
  imagen,
  onAbrirMapa,
}: Props) {
  return (
    <section className="mt-6 px-6">
      <h2 className="font-['Poppins:SemiBold',sans-serif] text-[22px] text-black mb-4">
        {titulo}
      </h2>

      <div className="relative min-h-[180px]">
        <div className="max-w-[188px]">
          <p className="font-['Poppins:Light',sans-serif] text-[12px] leading-[20px] text-black mb-4">
            {descripcion}
          </p>

          <button
            onClick={onAbrirMapa}
            className="h-[31px] rounded-[10px] bg-[#f2361d] px-6 transition hover:bg-[#d12f17]"
            type="button"
          >
            <span className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white">
              Abrir Mapa
            </span>
          </button>
        </div>

        <div className="absolute right-0 top-0 h-[158px] w-[158px] overflow-hidden rounded-[24px] bg-neutral-200 shadow-sm">
          <img
            src={imagen}
            alt={titulo}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}