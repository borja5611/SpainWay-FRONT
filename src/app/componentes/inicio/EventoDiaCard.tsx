type Props = {
  titulo: string;
  imagen: string;
};

export default function EventoDiaCard({ titulo, imagen }: Props) {
  return (
    <div className="w-[145px] shrink-0">
      <div className="h-[96px] w-full overflow-hidden rounded-[23px] bg-neutral-200 shadow-sm">
        <img
          src={imagen}
          alt={titulo}
          className="h-full w-full object-cover"
        />
      </div>
      <p className="mt-2 font-['Poppins:Medium',sans-serif] text-[11px] text-black">
        {titulo}
      </p>
    </div>
  );
}