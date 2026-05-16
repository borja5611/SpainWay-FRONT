import { useState } from "react";
import LogoSpainway from "../../../assets/LogoSpainway.png";
import MenuConfiguracionGlobal from "../perfil/MenuConfiguracionGlobal";

type CabeceraProps = {
  titulo: string;
  subtitulo?: string;
  mostrarVolver?: boolean;
};

function IconoConfig() {
  return (
    <svg className="h-5 w-5 text-[#374151]" viewBox="0 0 24 24" fill="none">
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

export default function Cabecera({ titulo, subtitulo }: CabeceraProps) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#eceff4] bg-[#f7f7f4]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[430px] items-center justify-between px-4 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_6px_16px_rgba(15,23,42,0.08)]">
              <img
                src={LogoSpainway}
                alt="SpainWay"
                className="h-7 w-7 object-contain"
              />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-[22px] font-bold tracking-[-0.03em] text-[#111827]">
                {titulo}
              </h1>
              {subtitulo && (
                <p className="mt-1 text-sm leading-5 text-[#6b7280]">
                  {subtitulo}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMenuAbierto(true)}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#e8edf4] bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition hover:scale-[1.02]"
            aria-label="Abrir configuración"
          >
            <IconoConfig />
          </button>
        </div>
      </header>

      {/* Llamada al componente global pasando el estado de apertura y la función de cierre */}
      <MenuConfiguracionGlobal 
        abierto={menuAbierto} 
        onClose={() => setMenuAbierto(false)} 
      />
    </>
  );
}