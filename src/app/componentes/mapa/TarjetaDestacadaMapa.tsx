type Props = {
  titulo: string;
  categoria: string;
  descripcion: string;
  imagen: string;
};

export default function TarjetaDestacadaMapa({
  titulo,
  categoria,
  descripcion,
  imagen,
}: Props) {
  return (
    <div className="overflow-hidden rounded-[22px] bg-white shadow-sm">
      <img
        src={imagen}
        alt={titulo}
        className="h-[200px] w-full object-cover"
      />

      <div className="p-4">
        <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#9a7f75]">
          {categoria}
        </p>
        <h3 className="mt-2 text-[20px] font-semibold text-black">{titulo}</h3>
        <p className="mt-2 text-[14px] leading-[24px] text-[#6d6d6d]">
          {descripcion}
        </p>
      </div>
    </div>
  );
}