import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/app/componentes/auth/AuthLayout";

const API_URL = import.meta.env.VITE_API_URL as string | undefined;

const STORAGE_EMAIL_KEY = "spainway_password_reset_email";
const STORAGE_EMAIL_LEGACY_KEY = "spainway_reset_email";
const STORAGE_CODE_KEY = "spainway_password_reset_code";

type ModalInfo = {
  tipo: "error" | "ok";
  titulo: string;
  mensaje: string;
};

function IconoCandado() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 10V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10M6 10H18C19.1046 10 20 10.8954 20 12V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V12C4 10.8954 4.89543 10 6 10Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconoOjo({ visible }: { visible: boolean }) {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      {visible ? (
        <>
          <path
            d="M3 12C4.8 8.6 7.8 6.5 12 6.5C16.2 6.5 19.2 8.6 21 12C19.2 15.4 16.2 17.5 12 17.5C7.8 17.5 4.8 15.4 3 12Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.8" />
        </>
      ) : (
        <>
          <path
            d="M4 4L20 20"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M9.7 6.8C10.43 6.6 11.2 6.5 12 6.5C16.2 6.5 19.2 8.6 21 12C20.4 13.13 19.66 14.11 18.79 14.92M14.12 17.25C13.45 17.42 12.75 17.5 12 17.5C7.8 17.5 4.8 15.4 3 12C3.85 10.39 4.97 9.08 6.36 8.15"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}

function ModalMensaje({
  modal,
  onClose,
}: {
  modal: ModalInfo;
  onClose: () => void;
}) {
  const esError = modal.tipo === "error";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#111827]/45 px-6 backdrop-blur-sm">
      <div className="w-full max-w-[350px] rounded-[30px] bg-white p-6 text-center shadow-[0_24px_70px_rgba(185,28,28,0.25)]">
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-sm font-black ${
            esError ? "bg-[#fff1f2] text-[#e12414]" : "bg-[#ecfdf3] text-[#027a48]"
          }`}
        >
          {esError ? "!" : "✓"}
        </div>

        <h2 className="mt-5 text-[21px] font-black leading-tight text-[#111827]">
          {modal.titulo}
        </h2>

        <p className="mt-3 text-sm leading-6 text-[#667085]">{modal.mensaje}</p>

        <button
          type="button"
          onClick={onClose}
          className={`mt-6 w-full rounded-2xl px-4 py-3 text-sm font-bold text-white shadow-[0_12px_28px_rgba(225,36,20,0.25)] ${
            esError ? "bg-[#e12414]" : "bg-[#ff5a36]"
          }`}
        >
          Entendido
        </button>
      </div>
    </div>
  );
}

export default function NuevaContrasenaPantalla() {
  const navigate = useNavigate();

  const emailGuardado = useMemo(() => {
    return (
      sessionStorage.getItem(STORAGE_EMAIL_KEY) ??
      sessionStorage.getItem(STORAGE_EMAIL_LEGACY_KEY) ??
      ""
    );
  }, []);

  const codigoGuardado = useMemo(() => {
    return sessionStorage.getItem(STORAGE_CODE_KEY) ?? "";
  }, []);

  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarPasswordRepeat, setMostrarPasswordRepeat] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [modal, setModal] = useState<ModalInfo | null>(null);

  function validarFormulario(): string | null {
    if (!emailGuardado || !codigoGuardado) {
      return "Vuelve a iniciar el proceso de recuperación para poder cambiar tu contraseña.";
    }

    if (password.length < 6) {
      return "La nueva contraseña debe tener al menos 6 caracteres.";
    }

    if (password !== passwordRepeat) {
      return "Las contraseñas no coinciden.";
    }

    return null;
  }

  async function guardarNuevaContrasena(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errorValidacion = validarFormulario();

    if (errorValidacion) {
      setModal({
        tipo: "error",
        titulo: "Revisa los datos",
        mensaje: errorValidacion,
      });
      return;
    }

    if (!API_URL) {
      setModal({
        tipo: "error",
        titulo: "No se pudo guardar",
        mensaje:
          "La recuperación no está disponible ahora mismo. Inténtalo de nuevo más tarde.",
      });
      return;
    }

    try {
      setCargando(true);

      const response = await fetch(`${API_URL}/api/auth/password/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailGuardado,
          correo: emailGuardado,
          code: codigoGuardado,
          codigo: codigoGuardado,
          password,
          nuevaPassword: password,
          nueva_contrasena: password,
        }),
      });

      const data = (await response.json().catch(() => null)) as {
        message?: string;
        error?: string;
      } | null;

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "No se pudo actualizar la contraseña.",
        );
      }

      sessionStorage.removeItem(STORAGE_EMAIL_KEY);
      sessionStorage.removeItem(STORAGE_CODE_KEY);

      setModal({
        tipo: "ok",
        titulo: "Contraseña actualizada",
        mensaje:
          "Ya puedes iniciar sesión con tu nueva contraseña en SpainWay.",
      });

      window.setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1300);
    } catch (error) {
      setModal({
        tipo: "error",
        titulo: "No se pudo guardar",
        mensaje:
          error instanceof Error
            ? error.message
            : "Inténtalo de nuevo en unos minutos.",
      });
    } finally {
      setCargando(false);
    }
  }

  return (
    <AuthLayout>
      

  <div className="flex flex-col items-center text-center">

        <h1 className="text-[25px] font-black leading-tight tracking-[-0.03em] text-[#020617]">
          Nueva contraseña
        </h1>

        <p className="mt-3 max-w-[310px] text-[14px] leading-6 tracking-[0.2px] text-[#667085]">
          Elige una contraseña segura para volver a entrar en SpainWay.
        </p>

        <form onSubmit={guardarNuevaContrasena} className="mt-8 w-full max-w-[340px]">
          <div className="flex h-[56px] items-center gap-3 rounded-2xl bg-[#eef4fb] px-4 text-[#0f2a5f]">
            <IconoCandado />
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type={mostrarPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Nueva contraseña"
              className="w-full bg-transparent text-[14px] font-semibold text-[#111827] outline-none placeholder:text-[#7280aa]"
            />
            <button
              type="button"
              onClick={() => setMostrarPassword((prev) => !prev)}
              className="text-[#98a2b3]"
              aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              <IconoOjo visible={mostrarPassword} />
            </button>
          </div>

          <div className="mt-4 flex h-[56px] items-center gap-3 rounded-2xl bg-[#eef4fb] px-4 text-[#0f2a5f]">
            <IconoCandado />
            <input
              value={passwordRepeat}
              onChange={(event) => setPasswordRepeat(event.target.value)}
              type={mostrarPasswordRepeat ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Repetir contraseña"
              className="w-full bg-transparent text-[14px] font-semibold text-[#111827] outline-none placeholder:text-[#7280aa]"
            />
            <button
              type="button"
              onClick={() => setMostrarPasswordRepeat((prev) => !prev)}
              className="text-[#98a2b3]"
              aria-label={
                mostrarPasswordRepeat ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              <IconoOjo visible={mostrarPasswordRepeat} />
            </button>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="mt-6 h-[50px] w-full rounded-2xl bg-[#e12414] text-[15px] font-black text-white shadow-[0_10px_22px_rgba(225,36,20,0.24)] transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cargando ? "Guardando..." : "Guardar contraseña"}
          </button>
        </form>

        <div className="mt-7 flex w-full max-w-[340px] flex-col gap-3 text-center">
          <button
            type="button"
            onClick={() => navigate("/recuperar-contrasena")}
            className="h-[48px] rounded-2xl border border-[#fecaca] bg-white text-[15px] font-black text-[#e12414] shadow-sm transition active:scale-[0.98]"
          >
            Solicitar otro código
          </button>

          <button
            type="button"
            onClick={() => navigate("/login", { replace: true })}
            className="h-[48px] rounded-2xl bg-[#111827] text-[15px] font-black text-white shadow-sm transition active:scale-[0.98]"
          >
            Volver al login
          </button>
        </div>
      </div>

      {modal && <ModalMensaje modal={modal} onClose={() => setModal(null)} />}
    </AuthLayout>
  );
}