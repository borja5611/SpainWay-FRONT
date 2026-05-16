import { useNavigate } from "react-router-dom";

type AuthBackHeaderProps = {
  rightText?: string;
  rightTo?: string;
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

export function AuthBackHeader({
  rightText = "Login",
  rightTo = "/login",
}: AuthBackHeaderProps) {
  const navigate = useNavigate();

  function volverAtras() {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(rightTo, { replace: true });
  }

  return (
    <div className="mb-10 flex items-center justify-between">
      <button
        type="button"
        onClick={volverAtras}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f6f7fb] text-[#111827] shadow-[0_8px_22px_rgba(15,23,42,0.08)] transition active:scale-95"
        aria-label="Volver atrás"
      >
        <IconoVolver />
      </button>

      <button
        type="button"
        onClick={() => navigate(rightTo, { replace: true })}
        className="rounded-full bg-[#fff4ef] px-4 py-2 text-sm font-semibold text-[#e12414] transition active:scale-95"
      >
        {rightText}
      </button>
    </div>
  );
}