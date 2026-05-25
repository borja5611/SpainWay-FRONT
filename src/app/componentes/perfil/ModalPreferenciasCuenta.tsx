import { useEffect, useState } from "react";
import {
  actualizarPreferencias,
  getPreferencias,
  type PreferenciasUsuario,
} from "@/app/servicios/preferencias";

type Props = {
  abierto: boolean;
  idUsuario: number | null;
  onClose: () => void;
};

type FormPreferencias = {
  presupuesto: string;
  modo_transporte: string;
  ritmo: string;
  intereses: string;
  accesibilidad: string;
  con_ninos: boolean;
};

const inicial: FormPreferencias = {
  presupuesto: "2",
  modo_transporte: "Transporte público",
  ritmo: "Equilibrado",
  intereses: "cultura, gastronomía, patrimonio",
  accesibilidad: "",
  con_ninos: false,
};

function toForm(pref: PreferenciasUsuario | null): FormPreferencias {
  if (!pref) return inicial;
  return {
    presupuesto: String(pref.presupuesto ?? 2),
    modo_transporte: pref.modo_transporte || inicial.modo_transporte,
    ritmo: pref.estilo_viaje || inicial.ritmo,
    intereses: pref.intereses || inicial.intereses,
    accesibilidad: pref.accesibilidad || "",
    con_ninos: Boolean(pref.con_ninos),
  };
}

function presupuestoLabel(value: string) {
  if (value === "1") return "Bajo";
  if (value === "3") return "Alto";
  return "Medio";
}

export default function ModalPreferenciasCuenta({ abierto, idUsuario, onClose }: Props) {
  const [form, setForm] = useState<FormPreferencias>(inicial);
  const [cargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  let activo = true;

  async function cargarPreferencias() {
    try {
      if (!idUsuario) {
        return;
      }

      const pref = await getPreferencias(idUsuario);

      if (!activo || !pref) {
        return;
      }

      setForm(toForm(pref));
    } catch {
      if (activo) {
        setError("No se pudieron cargar las preferencias. Puedes guardarlas de nuevo.");
      }
    }
  }

  if (abierto) {
    cargarPreferencias();
  }

  return () => {
    activo = false;
  };
}, [abierto, idUsuario]);

  if (!abierto) return null;

  async function guardar() {
    if (!idUsuario) return;
    try {
      setGuardando(true);
      setError(null);
      setMensaje(null);
      await actualizarPreferencias(idUsuario, {
        presupuesto: Number(form.presupuesto),
        modo_transporte: form.modo_transporte,
        estilo_viaje: form.ritmo,
        intereses: form.intereses,
        accesibilidad: form.accesibilidad || null,
        con_ninos: form.con_ninos,
      });
      setMensaje("Preferencias guardadas. Podrás aplicarlas al crear un itinerario.");
    } catch (err) {
      console.error(err);
      setError("No se pudieron guardar las preferencias.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-[34px] bg-white shadow-2xl">
        <div className="shrink-0 border-b border-[#eef2f7] bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#ff5a36]">Preferencias</p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#0f172a]">Preferencias de viaje</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#64748b]">
                Guarda valores fijos para rellenar automáticamente el cuestionario de creación. No se guardan destino, fechas ni zona base.
              </p>
            </div>
            <button type="button" onClick={onClose} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#f8fafc] text-xl font-black text-[#64748b]" aria-label="Cerrar">×</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {cargando ? (
            <div className="rounded-3xl bg-[#f8fafc] p-5 text-center text-sm font-bold text-[#64748b]">Cargando preferencias...</div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label>
                  <span className="text-xs font-black uppercase tracking-[0.16em] text-[#94a3b8]">Presupuesto</span>
                  <select value={form.presupuesto} onChange={(e) => setForm((v) => ({ ...v, presupuesto: e.target.value }))} className="mt-2 h-13 w-full rounded-2xl border border-[#d9dee8] bg-white px-4 text-sm font-bold text-[#0f172a] outline-none focus:border-[#ff5a36]">
                    <option value="1">Bajo</option>
                    <option value="2">Medio</option>
                    <option value="3">Alto</option>
                  </select>
                </label>

                <label>
                  <span className="text-xs font-black uppercase tracking-[0.16em] text-[#94a3b8]">Ritmo</span>
                  <select value={form.ritmo} onChange={(e) => setForm((v) => ({ ...v, ritmo: e.target.value }))} className="mt-2 h-13 w-full rounded-2xl border border-[#d9dee8] bg-white px-4 text-sm font-bold text-[#0f172a] outline-none focus:border-[#ff5a36]">
                    <option>Relajado</option>
                    <option>Equilibrado</option>
                    <option>Intenso</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-[#94a3b8]">Transporte habitual</span>
                <select value={form.modo_transporte} onChange={(e) => setForm((v) => ({ ...v, modo_transporte: e.target.value }))} className="mt-2 h-13 w-full rounded-2xl border border-[#d9dee8] bg-white px-4 text-sm font-bold text-[#0f172a] outline-none focus:border-[#ff5a36]">
                  <option>Transporte público</option>
                  <option>Coche</option>
                  <option>Mixto</option>
                  <option>A pie</option>
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-[#94a3b8]">Intereses habituales</span>
                <textarea value={form.intereses} onChange={(e) => setForm((v) => ({ ...v, intereses: e.target.value }))} rows={4} className="mt-2 w-full rounded-2xl border border-[#d9dee8] bg-white px-4 py-3 text-sm font-bold text-[#0f172a] outline-none focus:border-[#ff5a36]" placeholder="cultura, gastronomía, naturaleza, patrimonio..." />
              </label>

              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-[#94a3b8]">Accesibilidad / restricciones habituales</span>
                <textarea value={form.accesibilidad} onChange={(e) => setForm((v) => ({ ...v, accesibilidad: e.target.value }))} rows={3} className="mt-2 w-full rounded-2xl border border-[#d9dee8] bg-white px-4 py-3 text-sm font-bold text-[#0f172a] outline-none focus:border-[#ff5a36]" placeholder="evitar muchas escaleras, no caminar demasiado..." />
              </label>

              <label className="flex items-center justify-between gap-4 rounded-3xl bg-[#f8fafc] p-4">
                <span>
                  <span className="block text-sm font-black text-[#0f172a]">Viajes con niños</span>
                  <span className="mt-1 block text-xs font-semibold leading-5 text-[#667085]">Al aplicar preferencias, la compañía se marcará como familia.</span>
                </span>
                <input type="checkbox" checked={form.con_ninos} onChange={(e) => setForm((v) => ({ ...v, con_ninos: e.target.checked }))} className="h-5 w-5 accent-[#ff5a36]" />
              </label>

              <div className="rounded-3xl bg-[#fff7ed] p-4 text-sm font-semibold leading-6 text-[#9a3412]">
                Se aplicará: presupuesto {presupuestoLabel(form.presupuesto)}, ritmo {form.ritmo.toLowerCase()}, transporte {form.modo_transporte.toLowerCase()} e intereses guardados.
              </div>
            </div>
          )}

          {error && <div className="mt-4 rounded-3xl bg-red-50 p-4 text-sm font-bold text-red-600">{error}</div>}
          {mensaje && <div className="mt-4 rounded-3xl bg-[#ecfdf3] p-4 text-sm font-bold text-[#027a48]">{mensaje}</div>}
        </div>

        <div className="shrink-0 border-t border-[#eef2f7] bg-white p-5">
          <button type="button" onClick={guardar} disabled={guardando || cargando} className="w-full rounded-2xl bg-[#ff5a36] px-5 py-4 text-sm font-black text-white shadow-[0_12px_30px_rgba(255,90,54,0.22)] disabled:opacity-60">
            {guardando ? "Guardando..." : "Guardar preferencias"}
          </button>
        </div>
      </div>
    </div>
  );
}
