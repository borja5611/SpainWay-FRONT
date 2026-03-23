import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/app/componentes/auth/AuthLayout";
import { Logo } from "@/app/componentes/auth/Logo";
import { InputField } from "@/app/componentes/auth/InputField";
import { SocialLogin } from "@/app/componentes/auth/SocialLogin";
import { EmailIcon, LockIcon, EyeIcon } from "@/app/componentes/auth/icons";

export default function LoginPantalla() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/inicio");
  };

  return (
    <AuthLayout>
      <Logo />

      <div className="text-center mb-8">
        <h1 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[24px] leading-[32px] text-black tracking-[0.48px] mb-1">
          Bienvenido de nuevo!!
        </h1>
        <p className="font-['Inter:Medium',sans-serif] font-medium text-[14px] leading-[24px] text-[#7c6b69] tracking-[0.5px]">
          Inicia Sesión para continuar tu viaje
        </p>

        <button
          type="button"
          onClick={() => navigate("/onboarding/1")}
          className="font-['Inter:Medium',sans-serif] font-medium text-[12px] leading-[20px] text-[#e12414] tracking-[0.3px] hover:underline transition-all active:opacity-70 mt-2"
        >
          Ver tour de nuevo
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <InputField
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email o número de telefono"
            icon={<EmailIcon />}
            backgroundColor="light"
            required
          />
        </div>

        <div className="mb-3">
          <InputField
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            icon={<LockIcon />}
            endIcon={<EyeIcon />}
            onIconClick={() => setShowPassword(!showPassword)}
            backgroundColor="lighter"
            required
          />
        </div>

        <div className="text-right mb-8">
          <button
            type="button"
            onClick={() => navigate("/recuperar-contrasena")}
            className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] leading-[24px] text-[#e12414] tracking-[0.5px] hover:underline transition-all active:opacity-70"
          >
            ¿Has olvidado tu contraseña?
          </button>
        </div>

        <button
          type="submit"
          className="bg-[#e12414] w-full px-6 py-[10px] rounded-[10px] mb-6 hover:bg-[#c41f12] active:bg-[#a01810] transition-all duration-200 shadow-sm active:shadow-none"
        >
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] text-[#f2f2f2] text-[16px] text-center">
            Inicia Sesión
          </p>
        </button>

        <div className="mb-6">
          <SocialLogin text="O continúa con" />
        </div>

        <div className="mt-2 text-center pb-2">
          <span className="font-['Inter:Medium',sans-serif] font-medium text-[15px] leading-[25px] text-[#2e3e5c] tracking-[0.5px]">
            Si todavía no tienes una cuenta{" "}
          </span>
          <button
            type="button"
            onClick={() => navigate("/registro")}
            className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[15px] leading-[25px] text-[#e12414] tracking-[0.5px] hover:underline transition-all active:opacity-70"
          >
            Regístrate
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}