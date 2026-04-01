import logoPerfil from "@/assets/perfil/LogoPerfil.png";

type Props = {
  titulo: string;
  onAbrirConfiguracion: () => void;
  mostrarLogo?: boolean;
  subtitulo?: string;
};

export default function BarraSuperior({
  titulo,
  onAbrirConfiguracion,
  mostrarLogo = true,
  subtitulo,
}: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#eceae5] bg-[#f6f6f3]/95 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[980px] items-start justify-between px-4 pt-5 pb-4">
        <div className="flex min-w-0 items-center gap-3">
          {mostrarLogo && (
            <div className="flex h-[42px] w-[42px] items-center justify-center overflow-hidden rounded-full bg-white shadow-sm">
              <img
                src={logoPerfil}
                alt="SpainWay"
                className="h-[28px] w-[28px] object-contain"
              />
            </div>
          )}

          <div className="min-w-0">
            <h1
              className="truncate text-[26px] font-bold text-black"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              {titulo}
            </h1>

            {subtitulo ? (
              <p className="mt-1 max-w-[260px] text-[13px] leading-[20px] text-[#6d6d6d]">
                {subtitulo}
              </p>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onClick={onAbrirConfiguracion}
          className="ml-4 flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-[#f0f0f0]"
          aria-label="Abrir configuración"
        >
          ⚙
        </button>
      </div>
    </header>
  );
}