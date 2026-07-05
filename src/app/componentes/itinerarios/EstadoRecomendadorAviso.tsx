// src/app/componentes/itinerarios/EstadoRecomendadorAviso.tsx
//
// Aviso NO bloqueante del estado del motor de recomendaciones.
// Nunca usa rojo agresivo mientras la IA calienta: verde suave si está lista,
// ámbar amable si está arrancando/tardando, neutro controlado si hay error.

import type { EstadoIa } from "@/app/servicios/iaHealth";

type Props = {
  estado: EstadoIa;
  message: string;
  onReintentar: () => void;
  onSeguirEditando?: () => void;
};

function MiniSpinner({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
      aria-hidden
    />
  );
}

export default function EstadoRecomendadorAviso({
  estado,
  message,
  onReintentar,
  onSeguirEditando,
}: Props) {
  // Estado listo: chip verde discreto.
  if (estado === "ready") {
    return (
      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
        <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
        Motor de recomendaciones listo
      </div>
    );
  }

  // Comprobando: chip neutro con spinner, sin alarmar.
  if (estado === "checking") {
    return (
      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
        <MiniSpinner />
        {message}
      </div>
    );
  }

  // Warming: aviso ámbar suave con reintento inmediato.
  if (estado === "warming") {
    return (
      <div className="mb-4 rounded-[18px] border border-amber-200 bg-amber-50 px-4 py-3">
        <div className="flex items-start gap-3">
          <MiniSpinner className="mt-1 text-amber-500" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-900">
              Preparando el recomendador
            </p>
            <p className="mt-1 text-xs leading-5 text-amber-800">{message}</p>
            <button
              type="button"
              onClick={onReintentar}
              className="mt-3 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-amber-700 shadow-sm transition hover:bg-amber-100"
            >
              Reintentar ahora
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Timeout / no disponible: aviso amable con dos acciones. No bloquea la pantalla.
  if (estado === "unavailable") {
    return (
      <div className="mb-4 rounded-[18px] border border-amber-200 bg-amber-50/70 px-4 py-3">
        <p className="text-sm font-semibold text-amber-900">
          El recomendador está tardando un poco más
        </p>
        <p className="mt-1 text-xs leading-5 text-amber-800">{message}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onReintentar}
            className="rounded-full bg-[#ff5a36] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            Reintentar
          </button>
          {onSeguirEditando && (
            <button
              type="button"
              onClick={onSeguirEditando}
              className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#344054] shadow-sm transition hover:bg-slate-50"
            >
              Seguir editando
            </button>
          )}
        </div>
      </div>
    );
  }

  // Error controlado: neutro, nunca stacktrace ni rojo permanente agresivo.
  return (
    <div className="mb-4 rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-sm font-semibold text-[#344054]">
        No se ha podido comprobar el recomendador
      </p>
      <p className="mt-1 text-xs leading-5 text-[#667085]">{message}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onReintentar}
          className="rounded-full bg-[#111827] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          Reintentar
        </button>
        {onSeguirEditando && (
          <button
            type="button"
            onClick={onSeguirEditando}
            className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#344054] shadow-sm transition hover:bg-slate-50"
          >
            Seguir editando
          </button>
        )}
      </div>
    </div>
  );
}
