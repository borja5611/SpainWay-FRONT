import hotelResultado from "@/assets/chat/HotelResultado.png";

type Props = {
  destino: string;
};

export default function ResultadoResumenCard({ destino }: Props) {
  return (
    <div className="overflow-hidden rounded-[18px] bg-white shadow-sm">
      <img
        src={hotelResultado}
        alt="Hotel recomendado"
        className="h-[180px] w-full object-cover"
      />
      <div className="p-4">
        <p className="text-[18px] font-semibold text-black">
          {destino} · 2 noches
        </p>
        <p className="mt-1 text-[13px] text-[#7c6b69]">Hotel recomendado</p>
        <p className="mt-2 text-[13px] text-[#7c6b69]">⭐ 5.0 · Muy bien</p>
      </div>
    </div>
  );
}