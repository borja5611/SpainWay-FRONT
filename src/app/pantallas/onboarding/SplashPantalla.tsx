import { useNavigate } from "react-router-dom";
import splashPortada from "@/assets/SplashPortada.png";
import logoSpainWay from "@/assets/LogoSpainway.png";

export default function SplashPantalla() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      <div className="absolute inset-0">
        <img
          alt="Portada SpainWay"
          className="h-full w-full object-cover"
          src={splashPortada}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[393px] flex-col justify-between px-6 py-8">
        <div className="flex justify-center pt-4">
          <img
            alt="SpainWay Logo"
            className="h-[140px] w-[220px] object-contain"
            src={logoSpainWay}
          />
        </div>

        <div className="pb-10 text-center text-white">
          <p className="mb-1 font-serif text-[20px] font-semibold">
            Prepárate para
          </p>
          <p className="mb-5 font-serif text-[38px] font-semibold leading-none">
            Nuevas Aventuras
          </p>
          <p className="mx-auto mb-8 max-w-[300px] text-[14px] leading-5">
            Si te gusta viajar, esta app es para ti. Descubre la belleza de
            España y planifica nuevas experiencias.
          </p>

          <button
            type="button"
            onClick={() => navigate("/onboarding/1")}
            className="mx-auto block h-[47px] w-[233px] rounded-full bg-white text-[18px] text-black shadow-lg transition hover:bg-neutral-100"
          >
            Let&apos;s Tour
          </button>
        </div>
      </div>
    </div>
  );
}