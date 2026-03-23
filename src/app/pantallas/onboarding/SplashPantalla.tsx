import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ContenedorPantalla from "@/app/componentes/layout/ContenedorPantalla";

export default function SplashPantalla() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/onboarding/1");
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <ContenedorPantalla className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 rounded-3xl bg-blue-600 px-6 py-4 text-3xl font-bold text-white">
          SpainWay
        </div>
        <p className="text-sm text-gray-500">Preparando tu experiencia...</p>
      </div>
    </ContenedorPantalla>
  );
}