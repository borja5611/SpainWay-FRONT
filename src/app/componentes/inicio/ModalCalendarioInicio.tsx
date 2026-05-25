import { useNavigate } from "react-router-dom";

type Props = { abierto: boolean; onClose: () => void };

export default function ModalCalendarioInicio({ abierto, onClose }: Props) {
  const navigate = useNavigate();
  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[34px] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#ff5a36]">Calendario</p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#0f172a]">Organiza tus viajes</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#64748b]">Consulta tus itinerarios por fecha, revisa próximos viajes y entra al calendario completo cuando lo necesites.</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-11 w-11 place-items-center rounded-full bg-[#f8fafc] text-xl font-black text-[#64748b]">×</button>
        </div>
        <div className="mt-5 rounded-[28px] bg-gradient-to-br from-[#fff4ef] to-[#f8fafc] p-5">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-2xl shadow-sm">📅</div>
          <p className="mt-4 text-sm font-bold leading-6 text-[#475569]">Accede al calendario para ver el viaje por días y preparar mejor cada tramo de la ruta.</p>
        </div>
        <button type="button" onClick={() => { onClose(); navigate("/calendario"); }} className="mt-5 w-full rounded-2xl bg-[#ff5a36] px-5 py-4 text-sm font-black text-white shadow-[0_12px_30px_rgba(255,90,54,0.22)]">Abrir calendario</button>
      </div>
    </div>
  );
}
