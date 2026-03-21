import { useState, FormEvent } from "react";
import { useNavigate } from "react-router";
import { BackButton } from "../components/auth/BackButton";

export default function NuevaContrasenaPage() {
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    nueva: "",
    repetir: ""
  });
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (passwords.nueva !== passwords.repetir) {
      alert("Las contraseñas no coinciden");
      return;
    }
    
    console.log("Nueva contraseña:", passwords.nueva);
    navigate("/confirmacion-contrasena");
  };

  const PasswordIcon = () => (
    <div className="relative size-[24px]">
      <div className="absolute inset-[33.33%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
        </svg>
      </div>
      <div className="absolute inset-[22.92%_11.37%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.541 13">
        </svg>
      </div>
      <div className="absolute bottom-1/4 left-[20.83%] right-[12.5%] top-[8.33%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.7071 16.7071">
        </svg>
      </div>
    </div>
  );

  return (
    <div className="bg-[#f7f7f7] min-h-screen w-full">
      <div className="w-full max-w-[393px] mx-auto px-6 py-6">
        {/* Back Button */}
        <div className="mb-8 mt-3">
          <BackButton />
        </div>

        {/* Título y Descripción */}
        <div className="mb-12">
          <h1 className="font-['Poppins:Medium',sans-serif] text-[24px] leading-[normal] text-[#1a1a1a] mb-2">
            Crear Nueva Contraseña
          </h1>
          <p className="font-['Poppins:Regular',sans-serif] text-[14px] leading-[normal] text-[#626262]">
            La contraseña usada debe ser diferente a la que hayas usado previamente
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Campo Nueva Contraseña */}
          <div className="mb-4 relative">
            <div className="bg-white border border-[#eaeaea] rounded-[8px] h-[56px] flex items-center px-4">
              <input
                type={showPassword1 ? "text" : "password"}
                value={passwords.nueva}
                onChange={(e) => setPasswords({ ...passwords, nueva: e.target.value })}
                placeholder="Nueva Contraseña"
                className="flex-1 bg-transparent font-['Poppins:Regular',sans-serif] text-[14px] text-[#999] outline-none placeholder:text-[#999] w-full"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword1(!showPassword1)}
                className="ml-3 active:opacity-70 transition-opacity"
              >
                <PasswordIcon />
              </button>
            </div>
            <div className="absolute left-[8px] top-[-12px] bg-[#f7f7f7] px-2 py-[2px] rounded-[8px]">
              <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#333]">
                Contraseña
              </p>
            </div>
          </div>

          {/* Campo Repetir Contraseña */}
          <div className="mb-8 relative">
            <div className="bg-white border border-[#eaeaea] rounded-[8px] h-[56px] flex items-center px-4">
              <input
                type={showPassword2 ? "text" : "password"}
                value={passwords.repetir}
                onChange={(e) => setPasswords({ ...passwords, repetir: e.target.value })}
                placeholder="Repite la Nueva Contraseña"
                className="flex-1 bg-transparent font-['Poppins:Regular',sans-serif] text-[14px] text-[#999] outline-none placeholder:text-[#999] w-full"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword2(!showPassword2)}
                className="ml-3 active:opacity-70 transition-opacity"
              >
                <PasswordIcon />
              </button>
            </div>
            <div className="absolute left-[8px] top-[-12px] bg-[#f7f7f7] px-2 py-[2px] rounded-[8px]">
              <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#333]">
                Contraseña
              </p>
            </div>
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="bg-[#e12414] w-full rounded-[6px] px-6 py-3 hover:bg-[#c41f12] active:bg-[#a01810] transition-all duration-200 shadow-sm active:shadow-none"
          >
            <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#fefffe]">
              Cambiar Contraseña
            </p>
          </button>
        </form>
      </div>
    </div>
  );
}
