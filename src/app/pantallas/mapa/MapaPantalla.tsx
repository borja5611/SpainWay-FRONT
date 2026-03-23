import ContenedorPantalla from "@/app/componentes/layout/ContenedorPantalla";
import Cabecera from "@/app/componentes/layout/Cabecera";

export default function MapaPantalla() {
  return (
    <ContenedorPantalla conNavegacionInferior>
      <Cabecera titulo="Mapa" subtitulo="Explora puntos de interés" />
      <p className="text-sm text-gray-600">Base del mapa preparada.</p>
    </ContenedorPantalla>
  );
}