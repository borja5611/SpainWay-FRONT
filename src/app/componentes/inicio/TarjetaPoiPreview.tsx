type Props = {
  titulo: string;
  descripcion: string;
  imagen: string;
  onClick?: () => void;
};

export default function TarjetaPoiPreview({
  titulo,
  descripcion,
  imagen,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-[320px] shrink-0 overflow-hidden rounded-[24px] bg-white text-left shadow-sm transition hover:shadow-md"
    >
      <div className="flex h-[470px] flex-col">
        <div className="h-[240px] w-full overflow-hidden bg-white">
          <img
            src={imagen}
            alt={titulo}
            loading="lazy"
            className="block h-full w-full object-cover object-center"
          />
        </div>

        <div className="flex min-h-0 flex-1 flex-col border-t border-[#eef0f3] p-5">
          <h4 className="line-clamp-2 min-h-[56px] text-[18px] font-semibold leading-[28px] text-black">
            {titulo}
          </h4>

          <p className="mt-3 line-clamp-5 text-[14px] leading-[28px] text-[#667085]">
            {descripcion}
          </p>
        </div>
      </div>
    </button>
  );
}