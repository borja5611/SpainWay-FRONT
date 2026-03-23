import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/app/componentes/auth/AuthLayout";
import { Logo } from "@/app/componentes/auth/Logo";

export default function VerificacionOtpPantalla() {
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState(["", "", "", ""]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const nuevo = [...codigo];
    nuevo[index] = value;
    setCodigo(nuevo);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/nueva-contrasena");
  };

  return (
    <AuthLayout>
      <Logo />

      <div className="text-center mb-8">
        <h1 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[24px] leading-[32px] text-black tracking-[0.48px] mb-2">
          Verificación OTP
        </h1>
        <p className="font-['Inter:Medium',sans-serif] font-medium text-[14px] leading-[24px] text-[#7c6b69] tracking-[0.5px]">
          Introduce el código que has recibido
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-8 flex justify-center gap-3">
          {codigo.map((valor, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={valor}
              onChange={(e) => handleChange(index, e.target.value)}
              className="h-[56px] w-[56px] rounded-[12px] bg-[#ebf2f9] text-center text-[22px] font-semibold text-[#1C2D57] outline-none focus:ring-2 focus:ring-[#e12414]/30"
            />
          ))}
        </div>

        <button
          type="submit"
          className="bg-[#e12414] w-full px-6 py-[10px] rounded-[10px] mb-6 hover:bg-[#c41f12] active:bg-[#a01810] transition-all duration-200 shadow-sm active:shadow-none"
        >
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] text-[#f2f2f2] text-[16px] text-center">
            Verificar
          </p>
        </button>

        <div className="text-center">
          <button
            type="button"
            className="font-['Inter:Medium',sans-serif] font-medium text-[14px] leading-[24px] text-[#7c6b69] hover:underline"
          >
            Reenviar código
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}