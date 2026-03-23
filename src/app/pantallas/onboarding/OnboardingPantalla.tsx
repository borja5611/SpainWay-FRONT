import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import svgPaths1 from "@/imports/svg-90rlyxzuq5";
import svgPaths2 from "@/imports/svg-6rukgroaar";
import svgPaths3 from "@/imports/svg-hgbukjg3ls";
import onboarding1 from "@/assets/onboarding1.png";
import onboarding2 from "@/assets/onboarding2.png";
import onboarding3 from "@/assets/onboarding3.png";
import logoSpainWay from "@/assets/LogoSpainway.png";

type PasoOnboarding = {
  id: number;
  image: string;
  title: string;
  description: string;
  arrowPath: string;
};

const onboardingData: PasoOnboarding[] = [
  {
    id: 1,
    image: onboarding1,
    title: "Bienvenidos a Spainway",
    description:
      "En SpainWay cada destino es una oportunidad para explorar, conectar y vivir España de una forma auténtica y sin límites.",
    arrowPath: svgPaths1.p4227480,
  },
  {
    id: 2,
    image: onboarding2,
    title: "Bienvenidos a Spainway",
    description:
      "Explora lugares únicos, encuentra planes cercanos y organiza cada viaje con herramientas pensadas para que solo te preocupes de disfrutar.",
    arrowPath: svgPaths2.p4227480,
  },
  {
    id: 3,
    image: onboarding3,
    title: "Bienvenidos a Spainway",
    description:
      "Todo está listo. Empieza ahora y convierte cada trayecto en una experiencia hecha a tu medida con SpainWay.",
    arrowPath: svgPaths3.p3c89f80,
  },
];

function FondoOnboarding({ src, alt }: { src: string; alt: string }) {
  const [imagenLista, setImagenLista] = useState(false);

  useEffect(() => {
    let activa = true;

    const img = new Image();
    img.src = src;

    img.onload = () => {
      if (activa) {
        setImagenLista(true);
      }
    };

    img.onerror = () => {
      if (activa) {
        setImagenLista(true);
      }
    };

    return () => {
      activa = false;
    };
  }, [src]);

  return (
    <div className="absolute inset-0">
      {imagenLista ? (
        <img alt={alt} className="h-full w-full object-cover" src={src} />
      ) : (
        <div className="h-full w-full bg-neutral-300" />
      )}
    </div>
  );
}

export default function OnboardingPantalla() {
  const navigate = useNavigate();
  const { step } = useParams<{ step: string }>();

  const currentStep = useMemo(() => {
    const parsed = Number(step || "1");
    if (Number.isNaN(parsed) || parsed < 1) return 1;
    if (parsed > onboardingData.length) return onboardingData.length;
    return parsed;
  }, [step]);

  const currentData = onboardingData[currentStep - 1];

  const handleNext = () => {
    if (currentStep < onboardingData.length) {
      navigate(`/onboarding/${currentStep + 1}`);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      <FondoOnboarding
        key={currentData.id}
        src={currentData.image}
        alt={`Onboarding ${currentStep}`}
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[393px] flex-col">
        <div className="flex justify-center pt-4">
          <img
            alt="SpainWay Logo"
            className="h-[76px] w-[120px] object-contain"
            src={logoSpainWay}
          />
        </div>

        <div className="mt-auto px-6 pb-16">
          <div className="relative">
            <div className="rounded-[24px] bg-white/20 px-6 pb-24 pt-8 backdrop-blur-[10px]">
              <h2 className="mb-6 text-center text-[24px] font-extrabold leading-[26px] tracking-[-0.24px] text-white">
                {currentData.title}
              </h2>

              <p className="text-center text-[16px] font-bold leading-[20px] tracking-[-0.16px] text-white/90">
                {currentData.description}
              </p>
            </div>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
              <button
                type="button"
                onClick={handleNext}
                className="relative h-[99px] w-[99px]"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-[70px] w-[70px] -rotate-45 rounded-[35px] bg-gradient-to-br from-[#E58F88] via-[#E4746B] via-[#E3594E] via-[#E23F31] to-[#E12414]" />
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-[82px] w-[82px] -rotate-45 rounded-[50px] border border-white/40" />
                </div>

                <div className="absolute inset-[37%] flex items-center justify-center">
                  <svg
                    className="h-full w-full"
                    fill="none"
                    viewBox="0 0 17.6667 15.6667"
                  >
                    <path
                      d="M0.833333 7.83333H16.8333"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.66667"
                    />
                    <path
                      d={currentData.arrowPath}
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.66667"
                    />
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