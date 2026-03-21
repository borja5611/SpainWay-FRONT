import { useState, FormEvent } from "react";
import { useNavigate } from "react-router";
import { AuthLayout } from "../components/auth/AuthLayout";
import { Logo } from "../components/auth/Logo";
import { InputField } from "../components/auth/InputField";
import { SocialLogin } from "../components/auth/SocialLogin";
import { EmailIcon, LockIcon, EyeIcon } from "../components/auth/icons";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Login:", { email, password });
    // Navegar al HomePage después del login
    navigate("/home");
  };

  return (
    <AuthLayout>
      <Logo />

      {/* Título y Subtítulo */}
      <div className="text-center mb-10">
        <h1 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[24px] leading-[32px] text-black tracking-[0.48px] mb-1">
          Bienvenido de nuevo!!
        </h1>
        <p className="font-['Inter:Medium',sans-serif] font-medium text-[14px] leading-[24px] text-[#7c6b69] tracking-[0.5px]">
          Inicia Sesión para continuar tu viaje
        </p>
        
        {/* Enlace para volver a ver el tour */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="font-['Inter:Medium',sans-serif] font-medium text-[12px] leading-[20px] text-[#e12414] tracking-[0.3px] hover:underline transition-all active:opacity-70 mt-2"
        >
          Ver tour de nuevo
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Campo Email */}
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

        {/* Campo Contraseña */}
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

        {/* Olvidé contraseña */}
        <div className="text-right mb-8">
          <button 
            type="button" 
            onClick={() => navigate("/contrasena-olvidada")}
            className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] leading-[24px] text-[#e12414] tracking-[0.5px] hover:underline transition-all active:opacity-70"
          >
            ¿Has olvidado tu contraseña?
          </button>
        </div>

        {/* Botón Login */}
        <button
          type="submit"
          className="bg-[#e12414] w-full px-6 py-[10px] rounded-[10px] mb-6 hover:bg-[#c41f12] active:bg-[#a01810] transition-all duration-200 shadow-sm active:shadow-none"
        >
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] text-[#f2f2f2] text-[16px] text-center">
            Inicia Sesión
          </p>
        </button>

        {/* Social Media */}
        <div className="mb-8">
          <SocialLogin text="O continúa con" />
        </div>

        {/* Registro */}
        <div className="text-center">
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