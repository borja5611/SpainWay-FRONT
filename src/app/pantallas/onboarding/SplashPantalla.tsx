import { useNavigate } from "react-router";
import imgImage4 from "figma:asset/6cf74d2aa2eb841bca4332ed4dbec63ad2a6b89c.png";
import imgLogoApp from "figma:asset/5e0c374c0135b55aca0be12783eb4a026febd58a.png";

export default function SplashPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-white relative min-h-screen w-full overflow-hidden">
      {/* Imagen de fondo */}
      <div className="absolute h-full left-[-115px] opacity-85 top-0 w-[625px]">
        <img 
          alt="" 
          className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" 
          src={imgImage4} 
        />
      </div>

      <div className="relative w-full max-w-[393px] mx-auto px-6 py-6 min-h-screen flex flex-col justify-between">
        {/* Logo */}
        <div className="flex justify-center pt-6">
          <div className="h-[223px] w-[335px]">
            <img 
              alt="SpainWay Logo" 
              className="w-full h-full object-contain" 
              src={imgLogoApp} 
            />
          </div>
        </div>

        {/* Contenido inferior */}
        <div className="pb-16">
          <div className="text-white text-center mb-8">
            <p className="font-['Eczar:SemiBold',sans-serif] font-semibold text-[20px] leading-[normal] mb-2">
              Prepárate para
            </p>
            <p className="font-['Eczar:SemiBold',sans-serif] font-semibold text-[40px] leading-[normal] mb-6">
              Nuevas Aventuras
            </p>
            <p className="font-['Poppins:Bold',sans-serif] text-[14px] leading-[normal] px-4">
              Si te gusta viajar, esta app es para ti. Descubre la belleza de España y planifica nuevas experiencias.
            </p>
          </div>

          {/* Botón */}
          <button
            onClick={() => navigate("/onboarding/1")}
            className="bg-white w-full max-w-[233px] h-[47px] rounded-[45px] mx-auto block hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 shadow-lg active:shadow-md"
          >
            <p className="font-['Poppins:Medium',sans-serif] text-[18px] leading-[normal] text-black">
              Let's Tour
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
