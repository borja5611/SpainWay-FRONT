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
      className="w-full overflow-hidden rounded-3xl border border-gray-200 bg-white text-left shadow-sm transition hover:shadow-md"
    >
      <img
        src={destino.imagen}
        alt={destino.nombre}
        className="h-44 w-full object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{destino.nombre}</h3>
        <p className="mt-1 text-sm text-gray-600">{destino.subtitulo}</p>
      </div>
    </button>
  );
}