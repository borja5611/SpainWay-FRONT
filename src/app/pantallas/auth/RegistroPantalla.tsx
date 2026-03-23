import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/app/componentes/auth/AuthLayout";
import { Logo } from "@/app/componentes/auth/Logo";
import { InputField } from "@/app/componentes/auth/InputField";
import { SocialLogin } from "@/app/componentes/auth/SocialLogin";
import { EmailIcon, LockIcon, EyeIcon } from "@/app/componentes/auth/icons";

export default function RegistroPantalla() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    navigate("/login");
  };

  return (
    <AuthLayout>
      <Logo />

      <div className="text-center mb-8">
        <h1 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[24px] leading-[32px] text-black tracking-[0.48px] mb-2">
          Crea tu cuenta en SpainWay
        </h1>
        <p className="font-['Inter:Medium',sans-serif] font-medium text-[14px] leading-[24px] text-[#7c6b69] tracking-[0.5px]">
          Crea tu cuenta y empieza a explorar experiencias
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <InputField
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Email o número de teléfono"
            icon={<EmailIcon />}
            backgroundColor="light"
            required
          />
        </div>

        <div className="mb-4">
          <InputField
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="Contraseña"
            icon={<LockIcon />}
            endIcon={<EyeIcon />}
            onIconClick={() => setShowPassword(!showPassword)}
            backgroundColor="lighter"
            required
          />
        </div>

        <div className="mb-4">
          <InputField
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            placeholder="Confirmar Contraseña"
            icon={<LockIcon />}
            endIcon={<EyeIcon />}
            onIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
            backgroundColor="lighter"
            required
          />
        </div>

        <div className="mb-4">
          <InputField
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Nombre completo"
            icon={<EmailIcon />}
            backgroundColor="light"
            required
          />
        </div>

        <div className="mb-4">
          <InputField
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Número de teléfono"
            icon={<EmailIcon />}
            backgroundColor="light"
            required
          />
        </div>

        <div className="text-center mb-6">
          <p className="font-['Poppins:ExtraLight',sans-serif] text-[12px] leading-[25px] text-black">
            Al registrarte, estás aceptando nuestros{" "}
            <button
              type="button"
              className="font-['Poppins:Medium',sans-serif] text-[#ef7464] active:opacity-70 transition-all"
            >
              términos y condiciones
            </button>
            .
          </p>
        </div>

        <button
          type="submit"
          className="bg-[#e12414] w-full px-6 py-[10px] rounded-[10px] mb-6 hover:bg-[#c41f12] active:bg-[#a01810] transition-all duration-200 shadow-sm active:shadow-none"
        >
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] text-[#f2f2f2] text-[16px] text-center">
            Registrarse
          </p>
        </button>

        <div className="mb-6">
          <SocialLogin text="O regístrate con" />
        </div>

        <div className="text-center pb-4">
          <span className="font-['Inter:Medium',sans-serif] font-medium text-[15px] leading-[25px] text-[#2e3e5c] tracking-[0.5px]">
            Si ya tienes una cuenta{" "}
          </span>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[15px] leading-[25px] text-[#e12414] tracking-[0.5px] hover:underline transition-all active:opacity-70"
          >
            Inicia Sesión
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}