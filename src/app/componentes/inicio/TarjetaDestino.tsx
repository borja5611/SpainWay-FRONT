import type { Destino } from "@/app/datos/mock/destinos";

type Props = {
  destino: Destino;
  onClick?: () => void;
};

export default function TarjetaDestino({ destino, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full overflow-hidden rounded-[24px] bg-white text-left shadow-sm transition hover:shadow-md"
    >
      <div className="h-[160px] w-full bg-neutral-200">
        <img
          src={destino.imagen}
          alt={destino.nombre}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-4">
        <h3 className="text-[18px] font-semibold text-black">{destino.nombre}</h3>
        <p className="mt-1 text-[13px] text-[#7c6b69]">{destino.subtitulo}</p>
      </div>
    </button>
  );
}