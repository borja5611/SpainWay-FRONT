import { useNavigate, useParams } from "react-router";
import imgImage8 from "figma:asset/1d16d2d096c0d9cceb846ef21ce1d26d29b92c4c.png";
import imgPexelsFran from "figma:asset/5f61dd1227aab7503b08f0196954c0d68b1c964d.png";
import imgPexelsDavid from "figma:asset/b0c9b81a00f9088db3bfda097a0480db7df384a0.png";
import imgLogoApp from "figma:asset/5e0c374c0135b55aca0be12783eb4a026febd58a.png";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { step } = useParams<{ step: string }>();
  const currentStep = parseInt(step || "1");

  const onboardingData = [
    {
      image: imgImage8,
      title: "Bienvenidos a Spainway",
      description: "En SpainWay cada destino es una oportunidad para explorar, conectar y vivir España de una forma auténtica y sin límites.",
    },
    {
      image: imgPexelsFran,
      title: "Bienvenidos a Spainway",
      description: "Explora lugares únicos, encuentra planes cercanos y organiza cada viaje con herramientas pensadas para que solo te preocupes de disfrutar.",
    },
    {
      image: imgPexelsDavid,
      title: "Bienvenidos a Spainway",
      description: "Todo está listo. Empieza ahora y convierte cada trayecto en una experiencia hecha a tu medida con SpainWay.",
    }
  ];

  const currentData = onboardingData[currentStep - 1];

  const handleNext = () => {
    if (currentStep < 3) {
      navigate(`/onboarding/${currentStep + 1}`);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="bg-white relative min-h-screen w-full overflow-hidden">
      {/* Imagen de fondo */}
      <div className="absolute h-full left-[-87px] opacity-85 top-0 w-[552px]">
        <img 
          alt="" 
          className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" 
          src={currentData.image} 
        />
      </div>

      <div className="relative w-full max-w-[393px] mx-auto min-h-screen flex flex-col">
        {/* Logo */}
        <div className="flex justify-center pt-0">
          <div className="h-[111px] w-[166px]">
            <img 
              alt="SpainWay Logo" 
              className="w-full h-full object-contain" 
              src={imgLogoApp} 
            />
          </div>
        </div>

        {/* Contenido inferior */}
        <div className="mt-auto pb-16 px-6">
          {/* Card con blur */}
          <div className="relative mb-16">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[204px] w-[315px] bg-[#FFF7F0] bg-opacity-22 backdrop-blur-[10px] rounded-[24px]" />
            
            {/* Texto */}
            <div className="relative text-white text-center px-6 pb-24 pt-8">
              <h2 className="font-['Inter:Extra_Bold',sans-serif] font-extrabold text-[24px] leading-[26px] tracking-[-0.24px] mb-6">
                {currentData.title}
              </h2>
              <p className="font-['Inter:Bold',sans-serif] font-bold text-[16px] leading-[16px] tracking-[-0.16px] opacity-80">
                {currentData.description}
              </p>
            </div>

            {/* Botón Next */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
              <button
                onClick={handleNext}
                className="relative size-[99px] group"
              >
                {/* Círculo principal con gradiente */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="-rotate-45 size-[70px] rounded-[35px] bg-gradient-to-br from-[#E58F88] via-[#E4746B] via-[#E3594E] via-[#E23F31] to-[#E12414]" />
                </div>
                
                {/* Borde exterior */}
                <div className="absolute flex inset-[-9%] items-center justify-center">
                  <div className="-rotate-45 size-[82.5px] border-[0.5px] border-white border-solid opacity-40 rounded-[50px]" />
                </div>

                {/* Icono flecha */}
                <div className="absolute inset-[37%] overflow-clip flex items-center justify-center">
                  <svg className="size-full" fill="none" viewBox="0 0 17.6667 15.6667">
                    <path d="M0.833333 7.83333H16.8333" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}