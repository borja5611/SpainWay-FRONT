type Props = {
  icono: string;
  titulo: string;
  activa?: boolean;
  onClick: () => void;
};

export default function TarjetaOpcion({
  icono,
  titulo,
  activa = false,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-[84px] flex-col items-center justify-center rounded-[14px] border transition ${
        activa
          ? "border-[#eb8f87] bg-[#fdf1f0]"
          : "border-[#ececec] bg-white hover:bg-[#fafafa]"
      }`}
    >
      <span className="text-[24px]">{icono}</span>
      <span className="mt-2 text-[13px] font-medium text-black">{titulo}</span>
    </button>
  );
}