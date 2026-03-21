import { useState, FormEvent, useRef, KeyboardEvent } from "react";
import { useNavigate } from "react-router";
import { BackButton } from "../components/auth/BackButton";

export default function VerificacionOTPPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus al siguiente input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpCode = otp.join("");
    console.log("Código OTP:", otpCode);
    navigate("/nueva-contrasena");
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
            Verificación OTP
          </h1>
          <p className="font-['SF_Pro:Regular',sans-serif] font-normal text-[16px] leading-[20px] text-[#7d848d] px-4" style={{ fontVariationSettings: "'wdth' 100" }}>
            Por favor, revisa tu correo CorreoEjemplo@gmail.com para ver el código de verificación
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Código OTP */}
          <div className="mb-12">
            <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] text-[20px] leading-[28px] text-[#1b1e28] mb-6" style={{ fontVariationSettings: "'wdth' 100" }}>
              Código OTP
            </p>
            
            <div className="flex gap-4 justify-center">
              {otp.map((digit, index) => (
                <div key={index} className="bg-[#f7f7f9] h-[56px] w-[70px] rounded-[12px] flex items-center justify-center">
                  <input
                    ref={inputRefs[index]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="bg-transparent font-['SF_UI_Display:Medium',sans-serif] text-[18px] leading-[24px] text-[#1b1e28] text-center outline-none w-full"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Botón Verificar */}
          <button
            type="submit"
            className="bg-[#e12414] w-full h-[56px] rounded-[12px] mb-4 hover:bg-[#c41f12] active:bg-[#a01810] transition-all duration-200 shadow-sm active:shadow-none"
          >
            <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] text-[16px] leading-[20px] text-white text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
              Verificar
            </p>
          </button>

          {/* Reenviar código */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              className="font-['SF_Pro:Regular',sans-serif] font-normal text-[14px] leading-[16px] text-[#7d848d] active:opacity-70 transition-opacity"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              Reenviar código
            </button>
            <p className="font-['SF_Pro:Regular',sans-serif] font-normal text-[14px] leading-[16px] text-[#7d848d]" style={{ fontVariationSettings: "'wdth' 100" }}>
              01:26
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
