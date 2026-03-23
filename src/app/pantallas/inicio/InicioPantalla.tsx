import ContenedorPantalla from "@/app/componentes/layout/ContenedorPantalla";
import Cabecera from "@/app/componentes/layout/Cabecera";

export default function InicioPantalla() {
  return (
    <ContenedorPantalla conNavegacionInferior>
      <Cabecera titulo="Inicio" subtitulo="Pantalla principal" />
      <p className="text-sm text-gray-600">Base de inicio preparada.</p>
    </ContenedorPantalla>
  );
}