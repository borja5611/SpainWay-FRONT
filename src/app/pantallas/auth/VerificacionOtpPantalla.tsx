import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/app/componentes/auth/AuthLayout";
import { Logo } from "@/app/componentes/auth/Logo";
import { AuthInfoModal } from "@/app/componentes/auth/AuthInfoModal";
import {
  solicitarRecuperacionContrasena,
  verificarCodigoRecuperacion,
} from "@/app/servicios/auth";

const RESET_EMAIL_KEY = "spainway_reset_email";
const RESET_DEV_CODE_KEY = "spainway_reset_dev_code";
const RESET_TOKEN_KEY = "spainway_reset_token";

type ModalState = {
  tipo: "info" | "error" | "success";
  titulo: string;
  mensaje: string;
  devCode?: string;
};

export default function VerificacionOtpPantalla() {
  const navigate = useNavigate();
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [codigo, setCodigo] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [reenviando, setReenviando] = useState(false);
  const [modal, setModal] = useState<ModalState | null>(null);

  useEffect(() => {
    const emailGuardado = sessionStorage.getItem(RESET_EMAIL_KEY) ?? "";
    setEmail(emailGuardado);

    if (!emailGuardado) {
      setModal({
        tipo: "info",
        titulo: "Primero indica tu correo",
        mensaje: "Para verificar el código necesitamos saber qué cuenta quieres recuperar.",
      });
    }
  }, []);

  function handleChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nuevo = [...codigo];
    nuevo[index] = digit;
    setCodigo(nuevo);

    if (digit && index < codigo.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !codigo[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const code = codigo.join("");

    if (!email) {
      navigate("/recuperar-contrasena");
      return;
    }

    if (code.length !== 6) {
      setModal({
        tipo: "error",
        titulo: "Código incompleto",
        mensaje: "Introduce los 6 dígitos del código de recuperación.",
      });
      return;
    }

    try {
      setLoading(true);
      const respuesta = await verificarCodigoRecuperacion(email, code);
      sessionStorage.setItem(RESET_TOKEN_KEY, respuesta.resetToken);
      navigate("/nueva-contrasena");
    } catch (err) {
      console.error(err);
      setModal({
        tipo: "error",
        titulo: "Código no válido",
        mensaje:
          err instanceof Error
            ? err.message
            : "El código introducido no es correcto o ha caducado. Solicita uno nuevo e inténtalo otra vez.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function reenviarCodigo() {
    if (!email) {
      navigate("/recuperar-contrasena");
      return;
    }

    try {
      setReenviando(true);
      const respuesta = await solicitarRecuperacionContrasena(email);
      if (respuesta.devCode) sessionStorage.setItem(RESET_DEV_CODE_KEY, respuesta.devCode);
      setCodigo(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
      setModal({
        tipo: "success",
        titulo: "Código reenviado",
        mensaje: respuesta.message || "Si el correo pertenece a una cuenta de SpainWay, recibirás un nuevo código de recuperación.",
        devCode: respuesta.devCode,
      });
    } catch (err) {
      console.error(err);
      setModal({
        tipo: "error",
        titulo: "No se pudo reenviar",
        mensaje: "Vuelve a intentarlo en unos segundos.",
      });
    } finally {
      setReenviando(false);
    }
  }

  function cerrarModal() {
    const volver = modal?.titulo === "Primero indica tu correo";
    setModal(null);
    if (volver) navigate("/recuperar-contrasena");
  }

  return (
    <AuthLayout>
      <Logo />

      <div className="text-center mb-8">
        <h1 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[24px] leading-[32px] text-black tracking-[0.48px] mb-2">
          Verificación OTP
        </h1>
        <p className="font-['Inter:Medium',sans-serif] font-medium text-[14px] leading-[24px] text-[#7c6b69] tracking-[0.5px]">
          Introduce el código de 6 dígitos para continuar con el cambio de contraseña.
        </p>
        {email && <p className="mt-2 text-xs font-semibold text-[#e12414]">{email}</p>}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-8 flex justify-center gap-2">
          {codigo.map((valor, index) => (
            <input
              key={index}
              ref={(element) => {
                inputsRef.current[index] = element;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={valor}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="h-[52px] w-[44px] rounded-[12px] bg-[#ebf2f9] text-center text-[22px] font-semibold text-[#1C2D57] outline-none focus:ring-2 focus:ring-[#e12414]/30"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#e12414] w-full px-6 py-[10px] rounded-[10px] mb-6 hover:bg-[#c41f12] active:bg-[#a01810] transition-all duration-200 shadow-sm active:shadow-none disabled:opacity-60"
        >
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] text-[#f2f2f2] text-[16px] text-center">
            {loading ? "Verificando..." : "Verificar"}
          </p>
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={reenviarCodigo}
            disabled={reenviando}
            className="font-['Inter:Medium',sans-serif] font-medium text-[14px] leading-[24px] text-[#7c6b69] hover:underline disabled:opacity-60"
          >
            {reenviando ? "Reenviando..." : "Reenviar código"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-5 block w-full font-['Inter:Semi_Bold',sans-serif] text-[14px] font-semibold leading-[24px] text-[#e12414] hover:underline"
          >
            Volver al login
          </button>
        </div>
      </form>

      <AuthInfoModal
        abierto={Boolean(modal)}
        tipo={modal?.tipo}
        titulo={modal?.titulo ?? ""}
        mensaje={modal?.mensaje ?? ""}
        onCerrar={cerrarModal}
        extra={
          modal?.devCode ? (
            <div className="rounded-[18px] border border-[#fed7aa] bg-[#fff7ed] px-4 py-3 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#c2410c]">
                Código temporal para pruebas
              </p>
              <p className="mt-2 text-[28px] font-black tracking-[0.22em] text-[#111827]">
                {modal.devCode}
              </p>
            </div>
          ) : null
        }
      />
    </AuthLayout>
  );
}
