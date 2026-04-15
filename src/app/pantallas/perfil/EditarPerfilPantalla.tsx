import { useEffect, useState } from "react";
import { useAuthStore } from "@/app/store/useAuthStore";
import { actualizarUsuario, getUsuarioById } from "@/app/servicios/usuarios";

const PREFIJOS_PAISES = [
  { label: "🇪🇸 +34", value: "+34" },
  { label: "🇵🇹 +351", value: "+351" },
  { label: "🇫🇷 +33", value: "+33" },
  { label: "🇮🇹 +39", value: "+39" },
  { label: "🇩🇪 +49", value: "+49" },
  { label: "🇬🇧 +44", value: "+44" },
  { label: "🇺🇸 +1", value: "+1" },
];

function limpiarTelefono(valor: string) {
  return valor.replace(/\D/g, "");
}

function esTelefonoValido(valor: string) {
  return /^[0-9]{6,15}$/.test(valor);
}

function separarTelefono(telefono: string | null | undefined) {
  if (!telefono) {
    return {
      prefijo: "+34",
      numero: "",
    };
  }

  const prefijoDetectado =
    PREFIJOS_PAISES.find((p) => telefono.startsWith(p.value))?.value || "+34";

  const numero = telefono.startsWith(prefijoDetectado)
    ? telefono.slice(prefijoDetectado.length)
    : telefono.replace(/\D/g, "");

  return {
    prefijo: prefijoDetectado,
    numero: numero.replace(/\D/g, ""),
  };
}

export default function EditarPerfilPantalla() {
  const { usuario, setSesion, token } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    nombre_usuario: "",
    email: "",
    prefijo: "+34",
    telefono: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
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

        const data = await getUsuarioById(usuario.id_usuario);
        const tel = separarTelefono(data.telefono);

        setFormData((prev) => ({
          ...prev,
          nombre: data.nombre || "",
          nombre_usuario: data.nombre_usuario || "",
          email: data.email || "",
          prefijo: tel.prefijo,
          telefono: tel.numero,
        }));
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los datos del perfil.");
      } finally {
        setLoading(false);
      }
    }

    void cargar();
  }, [usuario?.id_usuario]);

  function handleChange(field: keyof typeof formData, value: string) {
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

    const nombre = formData.nombre.trim();
    const nombreUsuario = formData.nombre_usuario.trim().toLowerCase();
    const telefonoLimpio = limpiarTelefono(formData.telefono);

    if (!nombre || !nombreUsuario) {
      setError("Nombre y nombre de usuario son obligatorios.");
      return;
    }

    if (!/^[a-zA-Z0-9._-]{3,30}$/.test(nombreUsuario)) {
      setError(
        "El nombre de usuario debe tener entre 3 y 30 caracteres y solo usar letras, números, punto, guion o guion bajo."
      );
      return;
    }

    if (formData.telefono.trim() && !esTelefonoValido(telefonoLimpio)) {
      setError("Introduce un número de teléfono válido.");
      return;
    }

    const quiereCambiarPassword =
      formData.currentPassword.trim() ||
      formData.newPassword.trim() ||
      formData.confirmNewPassword.trim();

    if (quiereCambiarPassword) {
      if (!formData.currentPassword.trim()) {
        setError("Debes introducir tu contraseña actual.");
        return;
      }

      if (!formData.newPassword.trim()) {
        setError("Debes introducir una nueva contraseña.");
        return;
      }

      if (formData.newPassword.length < 6) {
        setError("La nueva contraseña debe tener al menos 6 caracteres.");
        return;
      }

      if (formData.newPassword !== formData.confirmNewPassword) {
        setError("La nueva contraseña y la confirmación no coinciden.");
        return;
      }
    }

    try {
      setGuardando(true);
      setError("");
      setOk("");

      const telefonoCompleto = formData.telefono.trim()
        ? `${formData.prefijo}${telefonoLimpio}`
        : null;

      const actualizado = await actualizarUsuario(usuario.id_usuario, {
        nombre,
        nombre_usuario: nombreUsuario,
        telefono: telefonoCompleto,
        currentPassword: formData.currentPassword || undefined,
        newPassword: formData.newPassword || undefined,
        confirmNewPassword: formData.confirmNewPassword || undefined,
      });

      if (token) {
        setSesion(token, {
          id_usuario: actualizado.id_usuario,
          nombre: actualizado.nombre,
          nombre_usuario: actualizado.nombre_usuario,
          email: actualizado.email,
          telefono: actualizado.telefono,
          rol: actualizado.rol,
        });
      }

      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      }));

      setOk("Perfil actualizado correctamente.");
    } catch (err) {
      console.error(err);
      setError("No se pudo actualizar el perfil.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="min-h-full bg-[#eef2f8]">
      <div className="mx-auto w-full max-w-[520px] px-5 py-5 pb-28">
        {loading ? (
          <div className="rounded-[28px] bg-white p-6 text-center shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
            <p className="text-sm text-[#667085]">Cargando datos del perfil...</p>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleGuardar}>
            <div className="rounded-[30px] bg-[linear-gradient(135deg,#fff8f4_0%,#ffffff_55%,#f4f1ff_100%)] p-6 shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
              <p className="text-xs uppercase tracking-[0.18em] text-[#94a3b8]">
                Cuenta y perfil
              </p>
              <h2 className="mt-2 text-[26px] font-bold tracking-[-0.03em] text-[#111827]">
                Editar perfil
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#667085]">
                Actualiza tus datos personales y deja tu cuenta preparada para una experiencia más coherente con el resto de la app.
              </p>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <ResumenMini label="Cuenta" value="Activa" />
                <ResumenMini label="Perfil" value="Editable" />
                <ResumenMini label="Seguridad" value="Protegida" />
              </div>
            </div>

            <div className="rounded-[30px] bg-white p-6 shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
              <p className="text-xs uppercase tracking-[0.18em] text-[#94a3b8]">
                Información principal
              </p>
              <h3 className="mt-2 text-[20px] font-bold text-[#111827]">
                Datos de la cuenta
              </h3>

              <div className="mt-5 space-y-4">
                <CampoTexto
                  label="Nombre completo"
                  value={formData.nombre}
                  onChange={(value) => handleChange("nombre", value)}
                  placeholder="Tu nombre completo"
                />

                <CampoTexto
                  label="Nombre de usuario"
                  value={formData.nombre_usuario}
                  onChange={(value) => handleChange("nombre_usuario", value)}
                  placeholder="Tu nombre de usuario"
                />

                <CampoTexto
                  label="Correo electrónico"
                  value={formData.email}
                  onChange={() => {}}
                  placeholder="Correo electrónico"
                  disabled
                />

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#667085]">
                    Número de teléfono
                  </label>

                  <div className="flex gap-2">
                    <select
                      value={formData.prefijo}
                      onChange={(e) => handleChange("prefijo", e.target.value)}
                      className="h-[54px] rounded-[16px] border border-[#d9dfe8] bg-[#f8fafc] px-3 text-[#111827] outline-none min-w-[108px]"
                    >
                      {PREFIJOS_PAISES.map((pais) => (
                        <option key={pais.value} value={pais.value}>
                          {pais.label}
                        </option>
                      ))}
                    </select>

                    <input
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) =>
                        handleChange("telefono", limpiarTelefono(e.target.value))
                      }
                      placeholder="Número de teléfono"
                      className="flex-1 h-[54px] rounded-[16px] border border-[#d9dfe8] bg-[#f8fafc] px-4 text-[#111827] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[30px] bg-white p-6 shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
              <p className="text-xs uppercase tracking-[0.18em] text-[#94a3b8]">
                Seguridad
              </p>
              <h3 className="mt-2 text-[20px] font-bold text-[#111827]">
                Cambiar contraseña
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#667085]">
                Para cambiar tu contraseña debes indicar primero la contraseña actual.
              </p>

              <div className="mt-5 space-y-4">
                <CampoPassword
                  label="Contraseña actual"
                  value={formData.currentPassword}
                  onChange={(value) => handleChange("currentPassword", value)}
                  placeholder="Tu contraseña actual"
                />

                <CampoPassword
                  label="Nueva contraseña"
                  value={formData.newPassword}
                  onChange={(value) => handleChange("newPassword", value)}
                  placeholder="Nueva contraseña"
                />

                <CampoPassword
                  label="Confirmar nueva contraseña"
                  value={formData.confirmNewPassword}
                  onChange={(value) => handleChange("confirmNewPassword", value)}
                  placeholder="Repite la nueva contraseña"
                />
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
              <p className="text-xs uppercase tracking-[0.18em] text-white/50">
                Confirmación
              </p>
              <h3 className="mt-2 text-[20px] font-bold">Guarda los cambios del perfil</h3>
              <p className="mt-2 text-sm leading-6 text-white/75">
                Revisa tus datos y aplica los cambios cuando todo esté correcto.
              </p>

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="flex-1 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={guardando}
                  className="flex-1 rounded-2xl bg-[#ff6a47] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(255,106,71,0.28)] disabled:opacity-60"
                >
                  {guardando ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function ResumenMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/90 p-3 text-center shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
      <p className="text-xs text-[#94a3b8]">{label}</p>
      <p className="mt-1 text-sm font-bold text-[#111827]">{value}</p>
    </div>
  );
}

function CampoTexto({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#667085]">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full h-[54px] rounded-[16px] border px-4 outline-none ${
          disabled
            ? "border-[#e5e7eb] bg-[#f3f4f6] text-[#94a3b8]"
            : "border-[#d9dfe8] bg-[#f8fafc] text-[#111827]"
        }`}
      />
    </div>
  );
}

function CampoPassword({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#667085]">
        {label}
      </label>
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-[54px] rounded-[16px] border border-[#d9dfe8] bg-[#f8fafc] px-4 text-[#111827] outline-none"
      />
    </div>
  );
}