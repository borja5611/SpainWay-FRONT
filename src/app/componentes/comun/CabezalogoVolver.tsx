import { useNavigate } from "react-router-dom";
import LogoSpainway from "@/assets/LogoSpainway.png";

type Props = {
  titulo: string;
  subtitulo?: string;
  fallbackRuta?: string;
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

export default function CabeceraLogoVolver({
  titulo,
  subtitulo,
  fallbackRuta = "/perfil",
}: Props) {
  const navigate = useNavigate();

  function volver() {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(fallbackRuta);
  }

  return (
    <div className="sticky top-0 z-20 bg-white border-b border-[#e7ecf3] px-4 py-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={volver}
          className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-white shadow-[0_6px_16px_rgba(15,23,42,0.08)] border border-[#eef2f7] text-[#111827]"
          aria-label="Volver"
        >
          <IconoVolver />
        </button>

        <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#fff4ef] shadow-[0_6px_16px_rgba(15,23,42,0.06)] overflow-hidden">
          <img
            src={LogoSpainway}
            alt="SpainWay"
            className="h-7 w-7 object-contain"
          />
        </div>

        <div className="min-w-0">
          <h1 className="text-[20px] font-semibold text-black">{titulo}</h1>
          {subtitulo ? (
            <p className="text-[#7c6b69] mt-1 text-sm">{subtitulo}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}