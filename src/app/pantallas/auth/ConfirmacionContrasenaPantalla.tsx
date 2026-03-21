import { useNavigate } from "react-router";

export default function ConfirmacionContrasenaPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f7f7f7] min-h-screen w-full flex items-center justify-center">
      <div className="w-full max-w-[393px] px-6">
        {/* Back Button (opcional, decorativo) */}
        <div className="absolute left-6 top-11">
          <button className="size-[24px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
              <path d="M15 6L9 12L15 18" stroke="#1A1A1A" />
            </svg>
          </button>
        </div>

        {/* Contenido centrado */}
        <div className="flex flex-col items-center gap-6">
          {/* Icono de éxito */}
          <div className="relative size-[125px]">
            <div className="absolute inset-[16.67%]">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 83.3333 83.3333">
                <circle cx="41.6667" cy="41.6667" fill="#388E3C" r="41.6667" />
              </svg>
            </div>
            <div className="absolute flex inset-[41.67%_35.42%_41.67%_39.58%] items-center justify-center">
              <div className="flex-none h-[6px] rotate-90 w-[4px]">
                <div className="relative size-full">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26.7461 36.1997">
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Texto */}
          <div className="text-center">
            <h1 className="font-['Poppins:Medium',sans-serif] text-[24px] leading-[normal] text-[#1a1a1a] mb-2">
              Contraseña Actualizada
            </h1>
            <p className="font-['Poppins:Regular',sans-serif] text-[14px] leading-[normal] text-[#666] px-4">
              Su contraseña se ha actualizado correctamente, ya puede iniciar sesión.
            </p>
          </div>

          {/* Botón */}
          <button
            onClick={() => navigate("/login")}
            className="bg-[#e12414] w-full max-w-[327px] rounded-[6px] px-6 py-3 hover:bg-[#c41f12] active:bg-[#a01810] transition-all duration-200 shadow-sm active:shadow-none mt-8"
          >
            <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#fefffe]">
              Volver al Login
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}