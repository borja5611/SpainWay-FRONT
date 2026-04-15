import { useEffect, useState } from "react";
import { useAuthStore } from "@/app/store/useAuthStore";
import {
  actualizarPreferencias,
  getPreferencias,
} from "@/app/servicios/preferencias";

const OPCIONES_PRESUPUESTO = [
  { label: "Sin definir", value: "" },
  { label: "Bajo", value: "1" },
  { label: "Medio", value: "2" },
  { label: "Alto", value: "3" },
];

const OPCIONES_TRANSPORTE = ["", "coche", "tren", "avion", "bus", "a pie"];
const OPCIONES_ACCESIBILIDAD = ["", "alta", "media", "baja"];
const OPCIONES_ESTILO = ["", "cultural", "relax", "aventura", "gastronomico", "urbano", "naturaleza"];

export default function EditarPreferenciasPantalla() {
  const { usuario } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const [formData, setFormData] = useState({
    presupuesto: "",
    modo_transporte: "",
    accesibilidad: "",
    con_ninos: false,
    estilo_viaje: "",
    intereses: "",
  });

  useEffect(() => {
    async function cargar() {
      if (!usuario?.id_usuario) {
        setError("No hay usuario autenticado.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const preferencias = await getPreferencias(usuario.id_usuario);

        setFormData({
          presupuesto:
            preferencias.presupuesto === null || preferencias.presupuesto === undefined
              ? ""
              : String(preferencias.presupuesto),
          modo_transporte: preferencias.modo_transporte || "",
          accesibilidad: preferencias.accesibilidad || "",
          con_ninos: Boolean(preferencias.con_ninos),
          estilo_viaje: preferencias.estilo_viaje || "",
          intereses: preferencias.intereses || "",
        });
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las preferencias.");
      } finally {
        setLoading(false);
      }
    }

    void cargar();
  }, [usuario?.id_usuario]);

  function handleChange(field: keyof typeof formData, value: string | boolean) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleGuardar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!usuario?.id_usuario) {
      setError("No hay usuario autenticado.");
      return;
    }

    try {
      setGuardando(true);
      setError("");
      setOk("");

      await actualizarPreferencias(usuario.id_usuario, {
        presupuesto: formData.presupuesto ? Number(formData.presupuesto) : null,
        modo_transporte: formData.modo_transporte || null,
        accesibilidad: formData.accesibilidad || null,
        con_ninos: formData.con_ninos,
        estilo_viaje: formData.estilo_viaje || null,
        intereses: formData.intereses.trim() || null,
      });

      setOk("Preferencias actualizadas correctamente.");
    } catch (err) {
      console.error(err);
      setError("No se pudieron guardar las preferencias.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="min-h-full bg-[#eef2f8]">
      <div className="mx-auto w-full max-w-[430px] px-5 py-5 pb-28">
        {loading ? (
          <div className="rounded-[28px] bg-white p-6 text-center shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
            <p className="text-sm text-[#667085]">Cargando preferencias...</p>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleGuardar}>
            <div className="rounded-[28px] bg-white p-5 shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
              <h2 className="text-[18px] font-bold text-[#111827]">Tu perfil de viaje</h2>
              <p className="mt-1 text-sm leading-6 text-[#667085]">
                Define cómo quieres viajar para personalizar mejor la experiencia.
              </p>

              <div className="mt-5 space-y-4">
                <CampoSelect
                  label="Presupuesto"
                  value={formData.presupuesto}
                  onChange={(value) => handleChange("presupuesto", value)}
                  options={OPCIONES_PRESUPUESTO}
                />

                <CampoSelect
                  label="Modo de transporte"
                  value={formData.modo_transporte}
                  onChange={(value) => handleChange("modo_transporte", value)}
                  options={OPCIONES_TRANSPORTE.map((x) => ({
                    label: x || "Sin definir",
                    value: x,
                  }))}
                />

                <CampoSelect
                  label="Accesibilidad"
                  value={formData.accesibilidad}
                  onChange={(value) => handleChange("accesibilidad", value)}
                  options={OPCIONES_ACCESIBILIDAD.map((x) => ({
                    label: x || "Sin definir",
                    value: x,
                  }))}
                />

                <CampoSelect
                  label="Estilo de viaje"
                  value={formData.estilo_viaje}
                  onChange={(value) => handleChange("estilo_viaje", value)}
                  options={OPCIONES_ESTILO.map((x) => ({
                    label: x || "Sin definir",
                    value: x,
                  }))}
                />

                <div className="rounded-[18px] border border-[#d9dfe8] bg-[#f8fafc] p-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.con_ninos}
                      onChange={(e) => handleChange("con_ninos", e.target.checked)}
                      className="h-4 w-4"
                    />
                    <span className="text-sm font-medium text-[#111827]">
                      Viajo con niños
                    </span>
                  </label>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#667085]">
                    Intereses
                  </label>
                  <textarea
                    value={formData.intereses}
                    onChange={(e) => handleChange("intereses", e.target.value)}
                    placeholder="Ejemplo: museos, gastronomía, playa, senderismo..."
                    className="w-full min-h-[120px] rounded-[16px] border border-[#d9dfe8] bg-[#f8fafc] px-4 py-3 text-[#111827] outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {error ? (
              <div className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            {ok ? (
              <div className="rounded-[18px] border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {ok}
              </div>
            ) : null}

            <div className="rounded-[28px] bg-[#111827] p-5 text-white shadow-[0_16px_34px_rgba(17,24,39,0.18)]">
              <h3 className="text-[20px] font-bold">Guardar preferencias</h3>
              <p className="mt-2 text-sm leading-6 text-white/75">
                Aplica estos ajustes para que SpainWay adapte mejor tus rutas y recomendaciones.
              </p>

              <button
                type="submit"
                disabled={guardando}
                className="mt-5 w-full rounded-2xl bg-[#ff6a47] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(255,106,71,0.28)] disabled:opacity-60"
              >
                {guardando ? "Guardando..." : "Guardar preferencias"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function CampoSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#667085]">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-[54px] rounded-[16px] border border-[#d9dfe8] bg-[#f8fafc] px-4 text-[#111827] outline-none"
      >
        {options.map((op) => (
          <option key={`${label}-${op.value}`} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>
    </div>
  );
}