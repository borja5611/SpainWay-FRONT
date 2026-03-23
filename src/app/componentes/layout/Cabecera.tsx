import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Props = {
  titulo: string;
  subtitulo?: string;
  mostrarVolver?: boolean;
};

export default function Cabecera({
  titulo,
  subtitulo,
  mostrarVolver = false,
}: Props) {
  const navigate = useNavigate();

  return (
    <header className="mb-6 flex items-start gap-3">
      {mostrarVolver && (
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-1 rounded-full border border-gray-200 p-2 transition hover:bg-gray-100"
          aria-label="Volver"
        >
          <ArrowLeft size={18} />
        </button>
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">{titulo}</h1>
        {subtitulo ? (
          <p className="mt-1 text-sm text-gray-500">{subtitulo}</p>
        ) : null}
      </div>
    </header>
  );
}