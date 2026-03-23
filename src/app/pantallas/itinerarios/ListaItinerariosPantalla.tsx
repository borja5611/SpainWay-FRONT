import ContenedorPantalla from "@/app/componentes/layout/ContenedorPantalla";
import Cabecera from "@/app/componentes/layout/Cabecera";

export default function ListaItinerariosPantalla() {
  return (
    <ContenedorPantalla conNavegacionInferior>
      <Cabecera titulo="Itinerarios" subtitulo="Tus rutas y recomendaciones" />
      <p className="text-sm text-gray-600">Base de itinerarios preparada.</p>
    </ContenedorPantalla>
  );
}