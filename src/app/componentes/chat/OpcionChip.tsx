type Props = {
  texto: string;
  activa?: boolean;
  onClick: () => void;
};

export default function OpcionChip({ texto, activa = false, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-[13px] font-medium transition ${
        activa
          ? "bg-[#eb8f87] text-white"
          : "bg-[#f1f1f1] text-black hover:bg-[#e5e5e5]"
      }`}
    >
      {texto}
    </button>
  );
}