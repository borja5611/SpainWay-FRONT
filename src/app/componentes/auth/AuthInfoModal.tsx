import type { ReactNode } from "react";

type AuthInfoModalProps = {
  abierto: boolean;
  tipo?: "info" | "error" | "success";
  titulo: string;
  mensaje: string;
  textoBoton?: string;
  onCerrar: () => void;
  extra?: ReactNode;
};

const estilos = {
  info: {
    badge: "bg-[#fff4ef] text-[#ff5a36]",
    boton: "bg-[#ff5a36] shadow-[0_18px_34px_rgba(255,90,54,0.28)] hover:bg-[#ef4324]",
    icono: "Info",
  },
  error: {
    badge: "bg-[#fff1f2] text-[#e11d48]",
    boton: "bg-[#e12414] shadow-[0_18px_34px_rgba(225,36,20,0.28)] hover:bg-[#c41f12]",
    icono: "!",
  },
  success: {
    badge: "bg-[#ecfdf3] text-[#039855]",
    boton: "bg-[#12b76a] shadow-[0_18px_34px_rgba(18,183,106,0.22)] hover:bg-[#039855]",
    icono: "✓",
  },
};

export function AuthInfoModal({
  abierto,
  tipo = "info",
  titulo,
  mensaje,
  textoBoton = "Entendido",
  onCerrar,
  extra,
}: AuthInfoModalProps) {
  if (!abierto) return null;

  const estilo = estilos[tipo];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#111827]/45 px-5 backdrop-blur-[6px]">
      <div className="w-full max-w-[360px] rounded-[28px] bg-white p-5 text-center shadow-[0_28px_70px_rgba(15,23,42,0.30)]">
        <div className={`mx-auto flex min-h-[50px] min-w-[50px] max-w-max items-center justify-center rounded-[16px] px-4 text-sm font-black ${estilo.badge}`}>
          {estilo.icono}
        </div>

        <h2 className="mt-5 text-[21px] font-black leading-tight tracking-[-0.03em] text-[#111827]">
          {titulo}
        </h2>
        <p className="mt-3 whitespace-pre-line text-sm font-medium leading-6 text-[#667085]">
          {mensaje}
        </p>

        {extra && <div className="mt-4 text-left">{extra}</div>}

        <button
          type="button"
          onClick={onCerrar}
          className={`mt-5 w-full rounded-[16px] px-5 py-3 text-sm font-black text-white transition ${estilo.boton}`}
        >
          {textoBoton}
        </button>
      </div>
    </div>
  );
}
