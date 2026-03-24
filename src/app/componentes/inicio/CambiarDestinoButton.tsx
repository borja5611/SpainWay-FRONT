type Props = {
  onClick: () => void;
};

export default function CambiarDestinoButton({ onClick }: Props) {
  return (
    <div className="px-6 mt-8 mb-6">
      <button
        type="button"
        onClick={onClick}
        className="w-full h-[42px] rounded-[10px] bg-[#f2361d] transition hover:bg-[#d12f17]"
      >
        <span className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-white">
          Cambiar destino
        </span>
      </button>
    </div>
  );
}