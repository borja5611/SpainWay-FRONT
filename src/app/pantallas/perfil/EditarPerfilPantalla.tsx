import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoSpainway from "../../../assets/LogoSpainway.png";

function IconoUsuario() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M5 20C5.85038 17.1085 8.53784 15 12 15C15.4622 15 18.1496 17.1085 19 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconoCorreo() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 7L11.2 12.4C11.6745 12.7559 12.3255 12.7559 12.8 12.4L20 7M6 19H18C19.1046 19 20 18.1046 20 17V7C20 5.89543 19.1046 5 18 5H6C4.89543 5 4 5.89543 4 7V17C4 18.1046 4.89543 19 6 19Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconoTelefono() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M7.5 4H5.6C4.71634 4 4 4.71634 4 5.6C4 13.5529 10.4471 20 18.4 20C19.2837 20 20 19.2837 20 18.4V16.5C20 15.6716 19.3284 15 18.5 15H16.2627C15.8733 15 15.4999 15.1518 15.2208 15.4231L13.8543 16.7511C11.6835 15.6429 9.95707 13.9165 8.8489 11.7457L10.1769 10.3792C10.4482 10.1001 10.6 9.72668 10.6 9.33726V7.5C10.6 6.67157 9.92843 6 9.1 6H7.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconoCandado() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M8 11V8.5C8 6.29086 9.79086 4.5 12 4.5C14.2091 4.5 16 6.29086 16 8.5V11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconoCheck() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 13L9 17L19 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconoChevron() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 6L15 12L9 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type CampoInputProps = {
  label: string;
  value: string;
  onChange: (valor: string) => void;
  placeholder?: string;
  type?: string;
  icono: React.ReactNode;
};

function CampoInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icono,
}: CampoInputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#111827]">{label}</span>
      <div className="flex items-center gap-3 rounded-[22px] border border-[#e8edf4] bg-[#f8fafc] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] transition focus-within:border-[#ff6a47] focus-within:bg-white">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#ff6a47] shadow-[0_6px_16px_rgba(15,23,42,0.06)]">
          {icono}
        </div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm font-medium text-[#111827] outline-none placeholder:text-[#98a2b3]"
        />
      </div>
    </label>
  );
}

export default function EditarPerfilPantalla() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("Rose");
  const [correo, setCorreo] = useState("rose@email.com");
  const [telefono, setTelefono] = useState("+34 600 000 000");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [guardado, setGuardado] = useState(false);

  function manejarGuardar() {
    setGuardado(true);
    window.setTimeout(() => {
      navigate("/perfil");
    }, 700);
  }

  return (
    <div className="min-h-full bg-[#eef2f8] text-[#111827]">
      <div className="mx-auto w-full max-w-[430px] pb-28">
        <section className="px-5 pt-5">
          <div className="overflow-hidden rounded-[34px] bg-[linear-gradient(135deg,#fff8f4_0%,#ffffff_50%,#f4f1ff_100%)] shadow-[0_18px_38px_rgba(15,23,42,0.08)]">
            <div className="relative px-5 pb-6 pt-6">
              <div className="absolute right-[-20px] top-[-16px] h-28 w-28 rounded-full bg-[#ff6a47]/10 blur-3xl" />
              <div className="absolute left-[-12px] bottom-[-18px] h-24 w-24 rounded-full bg-[#7c3aed]/10 blur-3xl" />

              <div className="relative flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#fff4ef] shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
                  <img
                    src={LogoSpainway}
                    alt="SpainWay"
                    className="h-10 w-10 object-contain"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#98a2b3]">
                    Cuenta y perfil
                  </p>
                  <h1 className="mt-1 text-[28px] font-extrabold tracking-[-0.04em] text-[#111827]">
                    Editar perfil
                  </h1>
                  <p className="mt-2 text-sm leading-6 text-[#667085]">
                    Actualiza tus datos personales y deja tu cuenta preparada para
                    una experiencia más coherente con el resto de la app.
                  </p>
                </div>
              </div>

              <div className="relative mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-white/90 p-3 text-center shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                  <p className="text-xs text-[#94a3b8]">Cuenta</p>
                  <p className="mt-1 text-sm font-bold text-[#0f172a]">Activa</p>
                </div>
                <div className="rounded-2xl bg-white/90 p-3 text-center shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                  <p className="text-xs text-[#94a3b8]">Perfil</p>
                  <p className="mt-1 text-sm font-bold text-[#0f172a]">Personal</p>
                </div>
                <div className="rounded-2xl bg-white/90 p-3 text-center shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                  <p className="text-xs text-[#94a3b8]">Estado</p>
                  <p className="mt-1 text-sm font-bold text-[#0f172a]">Seguro</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 pt-5">
          <div className="rounded-[30px] bg-white p-5 shadow-[0_16px_34px_rgba(15,23,42,0.08)]">
            <div className="mb-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[#98a2b3]">
                Información principal
              </p>
              <h2 className="mt-2 text-[19px] font-bold tracking-[-0.02em] text-[#111827]">
                Datos de la cuenta
              </h2>
            </div>

            <div className="space-y-4">
              <CampoInput
                label="Usuario"
                value={nombre}
                onChange={setNombre}
                placeholder="Tu nombre"
                icono={<IconoUsuario />}
              />

              <CampoInput
                label="Correo electrónico"
                value={correo}
                onChange={setCorreo}
                placeholder="Tu email"
                type="email"
                icono={<IconoCorreo />}
              />

              <CampoInput
                label="Número de teléfono"
                value={telefono}
                onChange={setTelefono}
                placeholder="Tu teléfono"
                icono={<IconoTelefono />}
              />
            </div>
          </div>
        </section>

        <section className="px-5 pt-5">
          <div className="rounded-[30px] bg-white p-5 shadow-[0_16px_34px_rgba(15,23,42,0.08)]">
            <div className="mb-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[#98a2b3]">
                Seguridad
              </p>
              <h2 className="mt-2 text-[19px] font-bold tracking-[-0.02em] text-[#111827]">
                Cambiar contraseña
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#667085]">
                Déjalo vacío si no quieres cambiarla ahora.
              </p>
            </div>

            <div className="space-y-4">
              <CampoInput
                label="Contraseña"
                value={contrasena}
                onChange={setContrasena}
                placeholder="Nueva contraseña"
                type="password"
                icono={<IconoCandado />}
              />

              <CampoInput
                label="Confirmar contraseña"
                value={confirmarContrasena}
                onChange={setConfirmarContrasena}
                placeholder="Repite la contraseña"
                type="password"
                icono={<IconoCheck />}
              />
            </div>
          </div>
        </section>

        <section className="px-5 pt-5">
          <div className="rounded-[30px] bg-[#111827] p-5 text-white shadow-[0_18px_36px_rgba(17,24,39,0.18)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/50">
                  Confirmación
                </p>
                <h2 className="mt-2 text-[21px] font-bold tracking-[-0.03em]">
                  Guarda los cambios del perfil
                </h2>
                <p className="mt-3 text-sm leading-6 text-white/74">
                  Revisa tus datos y aplica los cambios cuando todo esté correcto.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-3">
                <IconoChevron />
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => navigate("/perfil")}
                className="flex-1 rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={manejarGuardar}
                className="flex-1 rounded-2xl bg-[#ff6a47] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(255,106,71,0.28)]"
              >
                {guardado ? "Guardado" : "Guardar cambios"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}