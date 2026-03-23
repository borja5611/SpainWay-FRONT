import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/app/componentes/auth/AuthLayout";
import { Logo } from "@/app/componentes/auth/Logo";

export default function ConfirmacionContrasenaPantalla() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <Logo />

      <div className="flex flex-col items-center text-center mt-8">
        <div className="mb-6 flex h-[88px] w-[88px] items-center justify-center rounded-full bg-green-100">
          <div className="text-[34px] text-green-600">✓</div>
        </div>

        <h1 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[24px] leading-[32px] text-black tracking-[0.48px] mb-2">
          Contraseña Actualizada
        </h1>
        <p className="font-['Inter:Medium',sans-serif] font-medium text-[14px] leading-[24px] text-[#7c6b69] tracking-[0.5px] mb-8 max-w-[280px]">
          Tu contraseña se ha actualizado correctamente
        </p>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="bg-[#e12414] w-full px-6 py-[10px] rounded-[10px] hover:bg-[#c41f12] active:bg-[#a01810] transition-all duration-200 shadow-sm active:shadow-none"
        >
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] text-[#f2f2f2] text-[16px] text-center">
            Iniciar sesión
          </p>
        </button>
      </div>
    </AuthLayout>
  );
}