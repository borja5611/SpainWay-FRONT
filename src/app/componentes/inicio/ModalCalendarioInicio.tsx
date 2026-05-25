import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  abierto: boolean;
  onClose: () => void;
};

function hoyISO(): string {
  const now = new Date();
  const local = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return local.toISOString().slice(0, 10);
}

export default function ModalCalendarioInicio({ abierto, onClose }: Props) {
  const navigate = useNavigate();
  const [inicio, setInicio] = useState(hoyISO());
  const [fin, setFin] = useState("");

  if (!abierto) return null;

  function abrirCalendario() {
    onClose();
    navigate("/calendario");
  }

  function limpiar() {
    setInicio(hoyISO());
    setFin("");
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[34px] bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#ff5a36]">Calendario</p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#0f172a]">Planifica por fechas</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#64748b]">
              Revisa tus viajes y usa las fechas como referencia antes de crear o consultar un itinerario.
            </p>
          </div>
          <button type="button" onClick={onClose} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#f8fafc] text-xl font-black text-[#64748b]" aria-label="Cerrar">
            ×
          </button>
        </div>

        <div className="mt-5 rounded-[30px] border border-[#eef2f7] bg-[#f8fafc] p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-[#94a3b8]">Inicio</span>
              <input type="date" value={inicio} onChange={(event) => { setInicio(event.target.value); setFin(""); }} className="mt-2 h-13 w-full rounded-2xl border border-[#d9dee8] bg-white px-4 text-sm font-bold text-[#0f172a] outline-none focus:border-[#ff5a36]" />
            </label>
            <label className="block">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-[#94a3b8]">Fin</span>
              <input type="date" value={fin} min={inicio || hoyISO()} onChange={(event) => setFin(event.target.value)} className="mt-2 h-13 w-full rounded-2xl border border-[#d9dee8] bg-white px-4 text-sm font-bold text-[#0f172a] outline-none focus:border-[#ff5a36]" />
            </label>
          </div>
          <p className="mt-4 rounded-2xl bg-white p-4 text-sm font-semibold leading-6 text-[#667085]">
            Al cambiar la fecha de inicio se limpia la fecha final para evitar rangos incoherentes.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button type="button" onClick={limpiar} className="rounded-2xl bg-white px-5 py-4 text-sm font-black text-[#0f172a]">Limpiar</button>
            <button type="button" onClick={abrirCalendario} className="rounded-2xl bg-[#ff5a36] px-5 py-4 text-sm font-black text-white shadow-[0_12px_30px_rgba(255,90,54,0.22)]">Abrir calendario</button>
          </div>
        </div>
      </div>
    </div>
  );
}
