import LogoSpainway from "@/assets/LogoSpainway.png";

type Props = {
  titulo: string;
  subtitulo?: string;
  onAbrirConfiguracion: () => void;
  onVolver?: () => void;
  mostrarBotonVolver?: boolean;
};

function IconoVolver() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 18L9 12L15 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconoAjustes() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M19.4 15A1.65 1.65 0 0 0 19.73 16.82L19.79 16.88A2 2 0 1 1 16.96 19.71L16.9 19.65A1.65 1.65 0 0 0 15.08 19.32A1.65 1.65 0 0 0 14 20.85V21A2 2 0 1 1 10 21V20.91A1.65 1.65 0 0 0 8.91 19.39A1.65 1.65 0 0 0 7.09 19.72L7.03 19.78A2 2 0 1 1 4.2 16.95L4.26 16.89A1.65 1.65 0 0 0 4.59 15.07A1.65 1.65 0 0 0 3.06 14H3A2 2 0 1 1 3 10H3.09A1.65 1.65 0 0 0 4.61 8.91A1.65 1.65 0 0 0 4.28 7.09L4.22 7.03A2 2 0 1 1 7.05 4.2L7.11 4.26A1.65 1.65 0 0 0 8.93 4.59H9A1.65 1.65 0 0 0 10 3.06V3A2 2 0 1 1 14 3V3.09A1.65 1.65 0 0 0 15.09 4.61A1.65 1.65 0 0 0 16.91 4.28L16.97 4.22A2 2 0 1 1 19.8 7.05L19.74 7.11A1.65 1.65 0 0 0 19.41 8.93V9A1.65 1.65 0 0 0 20.94 10H21A2 2 0 1 1 21 14H20.91A1.65 1.65 0 0 0 19.39 15.09L19.4 15Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function BarraSuperior({
  titulo,
  subtitulo = "",
  onAbrirConfiguracion,
  onVolver,
  mostrarBotonVolver = false,
}: Props) {
  return (
    <header className="sticky top-0 z-30 w-full bg-[#f6f6f3]/95 backdrop-blur border-b border-[#ebe9e4]">
      <div className="w-full px-4 py-4 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            {mostrarBotonVolver ? (
              <button
                type="button"
                onClick={onVolver}
                className="mt-[2px] flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#111827] shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition hover:scale-105 active:scale-95"
                aria-label="Volver"
              >
                <IconoVolver />
              </button>
            ) : null}

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fff4ef] shadow-[0_10px_24px_rgba(15,23,42,0.06)] overflow-hidden">
              <img
                src={LogoSpainway}
                alt="SpainWay"
                className="h-7 w-7 object-contain"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-[20px] font-semibold tracking-[-0.03em] text-[#111827] break-words">
                {titulo}
              </h1>

              {subtitulo ? (
                <p className="mt-1 max-w-[520px] text-sm leading-6 text-[#6b7280] break-words">
                  {subtitulo}
                </p>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            onClick={onAbrirConfiguracion}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#111827] shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition hover:scale-105 active:scale-95"
            aria-label="Abrir configuración"
          >
            <IconoAjustes />
          </button>
        </div>
      </div>
    </header>
  );
}