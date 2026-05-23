import { AlertTriangle, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RutaNoEncontradaPantalla() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#fff7f3] px-5 py-8 text-[#111827]">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[520px] flex-col items-center justify-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <AlertTriangle className="h-10 w-10 text-[#ff3b30]" strokeWidth={2.4} />
        </div>

        <p className="mb-2 text-sm font-bold uppercase tracking-[0.24em] text-[#ff3b30]">
          Ruta no disponible
        </p>

        <h1 className="mb-3 text-3xl font-black leading-tight text-[#111827]">
          Esta pantalla no existe
        </h1>

        <p className="mb-8 max-w-[420px] text-base leading-7 text-[#6b7280]">
          La dirección que has abierto no está disponible actualmente o ha cambiado.
          Puedes volver a la pantalla principal y continuar usando SpainWay con normalidad.
        </p>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => navigate("/inicio", { replace: true })}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ff3b30] px-6 py-4 text-sm font-black text-white shadow-[0_16px_30px_rgba(255,59,48,0.28)] transition active:scale-[0.98]"
          >
            <Home className="h-5 w-5" />
            Ir al inicio
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-black text-[#111827] shadow-[0_12px_28px_rgba(15,23,42,0.10)] transition active:scale-[0.98]"
          >
            <ArrowLeft className="h-5 w-5" />
            Volver atrás
          </button>
        </div>
      </div>
    </main>
  );
}
