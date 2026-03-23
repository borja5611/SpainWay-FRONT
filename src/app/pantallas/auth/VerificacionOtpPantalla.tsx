import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/app/componentes/auth/AuthLayout";
import { Logo } from "@/app/componentes/auth/Logo";
import { InputField } from "@/app/componentes/auth/InputField";
import { EmailIcon } from "@/app/componentes/auth/icons";

export default function RecuperarContrasenaPantalla() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/verificacion-otp");
  };

  return (
    <AuthLayout>
      <Logo />

      <div className="text-center mb-8">
        <h1 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[24px] leading-[32px] text-black tracking-[0.48px] mb-2">
          ¿Olvidaste tu contraseña?
        </h1>
        <p className="font-['Inter:Medium',sans-serif] font-medium text-[14px] leading-[24px] text-[#7c6b69] tracking-[0.5px]">
          Introduce tu correo y te enviaremos un código de verificación
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <InputField
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            icon={<EmailIcon />}
            backgroundColor="light"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-[#e12414] w-full px-6 py-[10px] rounded-[10px] mb-6 hover:bg-[#c41f12] active:bg-[#a01810] transition-all duration-200 shadow-sm active:shadow-none"
        >
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] text-[#f2f2f2] text-[16px] text-center">
            Enviar código
          </p>
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[15px] leading-[25px] text-[#e12414] tracking-[0.5px] hover:underline transition-all active:opacity-70"
          >
            Volver a iniciar sesión
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}