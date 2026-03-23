import { useParams, useNavigate } from "react-router-dom";
import ContenedorPantalla from "@/app/componentes/layout/ContenedorPantalla";
import Boton from "@/app/componentes/comun/Boton";
import { RUTAS_APP } from "@/app/utilidades/rutas";

const pasos = [
  {
    titulo: "Descubre destinos",
    descripcion: "Explora ciudades, rutas y puntos de interés.",
  },
  {
    titulo: "Organiza itinerarios",
    descripcion: "Guarda planes personalizados para tu viaje.",
  },
  {
    titulo: "Habla con el asistente",
    descripcion: "Recibe ayuda para crear experiencias a medida.",
  },
];

export default function OnboardingPantalla() {
  const { paso } = useParams();
  const navigate = useNavigate();

  const indice = Math.max(0, Math.min((Number(paso) || 1) - 1, pasos.length - 1));
  const actual = pasos[indice];
  const esUltimo = indice === pasos.length - 1;

  const siguiente = () => {
    if (esUltimo) {
      navigate(RUTAS_APP.login);
      return;
    }
    navigate(`/onboarding/${indice + 2}`);
  };

  return (
    <ContenedorPantalla className="flex min-h-screen items-center">
      <div className="w-full rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-8 h-56 rounded-3xl bg-gradient-to-br from-blue-100 to-cyan-100" />
        <h1 className="text-2xl font-bold text-gray-900">{actual.titulo}</h1>
        <p className="mt-3 text-sm text-gray-600">{actual.descripcion}</p>

        <div className="mt-8 flex gap-2">
          {pasos.map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full ${
                i === indice ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <div className="mt-8">
          <Boton onClick={siguiente}>
            {esUltimo ? "Empezar" : "Siguiente"}
          </Boton>
        </div>
      </div>
    </ContenedorPantalla>
  );
}