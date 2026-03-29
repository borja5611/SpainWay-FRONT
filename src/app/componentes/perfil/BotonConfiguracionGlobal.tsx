type Props = {
  onClick: () => void;
};

export default function BotonConfiguracionGlobal({ onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed right-4 top-4 z-[55] flex h-[42px] w-[42px] items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50"
      aria-label="Abrir configuración"
    >
      ⚙
    </button>
  );
}