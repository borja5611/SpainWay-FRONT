import ContenedorPantalla from "@/app/componentes/layout/ContenedorPantalla";
import Cabecera from "@/app/componentes/layout/Cabecera";

export default function ChatPantalla() {
  return (
    <ContenedorPantalla conNavegacionInferior>
      <Cabecera titulo="Chat" subtitulo="Asistente de viaje" />
      <p className="text-sm text-gray-600">Base del chat preparada.</p>
    </ContenedorPantalla>
  );
}