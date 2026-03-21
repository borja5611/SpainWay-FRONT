import { useState, FormEvent } from "react";
import { useNavigate } from "react-router";
import { BackButton } from "../components/auth/BackButton";

export default function ContrasenaOlvidadaPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Recuperar contraseña:", email);
    // Aquí iría la lógica de recuperación
    navigate("/verificacion-otp");
  };

  return (
    <div className="bg-white min-h-screen w-full overflow-clip rounded-[12px]">
      <div className="w-full max-w-[393px] mx-auto px-6 py-6">
        {/* Back Button */}
        <div className="mb-12 mt-6">
          <BackButton />
        </div>

        {/* Título y Subtítulo */}
        <div className="text-center mb-16">
          <h1 className="font-['SF_Pro:Semibold',sans-serif] font-[590] text-[26px] leading-[34px] text-[#1b1e28] mb-4" style={{ fontVariationSettings: "'wdth' 100" }}>
            ¿Olvidaste tu contraseña?
          </h1>
          <p className="font-['SF_Pro:Regular',sans-serif] font-normal text-[16px] leading-[20px] text-[#7d848d] px-8" style={{ fontVariationSettings: "'wdth' 100" }}>
            Introduce tu correo electrónico para restablecer tu contraseña
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Campo Email */}
          <div className="mb-12">
            <div className="bg-[#f7f7f9] h-[56px] rounded-[12px] flex items-center px-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="CorreoEjemplo@gmail.com"
                className="flex-1 bg-transparent font-['SF_Pro:Regular',sans-serif] font-normal text-[16px] leading-[20px] text-[#1b1e28] outline-none placeholder:text-[#1b1e28] w-full"
                style={{ fontVariationSettings: "'wdth' 100" }}
                required
              />
            </div>
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="bg-[#e12414] w-full h-[56px] rounded-[12px] hover:bg-[#c41f12] active:bg-[#a01810] transition-all duration-200 shadow-sm active:shadow-none"
          >
            <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] text-[16px] leading-[20px] text-white text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
              Restablecer contraseña
            </p>
          </button>
        </form>
      </div>
    </div>
  );
}
