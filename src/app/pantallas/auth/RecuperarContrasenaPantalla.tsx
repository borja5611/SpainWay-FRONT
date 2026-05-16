import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/app/componentes/auth/AuthLayout";
import { Logo } from "@/app/componentes/auth/Logo";
import { InputField } from "@/app/componentes/auth/InputField";
import { AuthInfoModal } from "@/app/componentes/auth/AuthInfoModal";
import { EmailIcon } from "@/app/componentes/auth/icons";
import { solicitarRecuperacionContrasena } from "@/app/servicios/auth";

const RESET_EMAIL_KEY = "spainway_reset_email";
const RESET_DEV_CODE_KEY = "spainway_reset_dev_code";

type ModalState = {
  tipo: "info" | "error" | "success";
  titulo: string;
  mensaje: string;
  continuar?: boolean;
  devCode?: string;
};

function esEmailValido(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function RecuperarContrasenaPantalla() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<ModalState | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const emailNormalizado = email.trim().toLowerCase();

    if (!esEmailValido(emailNormalizado)) {
      setModal({
        tipo: "error",
        titulo: "Correo no válido",
        mensaje: "Escribe el email con el que creaste tu cuenta de SpainWay para poder recuperar el acceso.",
      });
      return;
    }

    try {
      setLoading(true);
      const respuesta = await solicitarRecuperacionContrasena(emailNormalizado);

      sessionStorage.setItem(RESET_EMAIL_KEY, emailNormalizado);
      if (respuesta.devCode) {
        sessionStorage.setItem(RESET_DEV_CODE_KEY, respuesta.devCode);
      } else {
        sessionStorage.removeItem(RESET_DEV_CODE_KEY);
      }

      setModal({
        tipo: "success",
        titulo: "Código preparado",
        mensaje:
          respuesta.message ||
          "Hemos preparado un código de verificación para cambiar tu contraseña.",
        continuar: true,
        devCode: respuesta.devCode,
      });
    } catch (err) {
      console.error(err);
      setModal({
        tipo: "error",
        titulo: "No se pudo iniciar la recuperación",
        mensaje:
          err instanceof Error
            ? err.message
            : "Revisa el correo introducido e inténtalo de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  }

  function cerrarModal() {
    const debeContinuar = modal?.continuar;
    setModal(null);
    if (debeContinuar) navigate("/verificacion-otp");
  }

  return (
    <AuthLayout>
      <Logo />

      <div className="text-center mb-8">
        <h1 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[24px] leading-[32px] text-black tracking-[0.48px] mb-2">
          ¿Olvidaste tu contraseña?
        </h1>
        <p className="font-['Inter:Medium',sans-serif] font-medium text-[14px] leading-[24px] text-[#7c6b69] tracking-[0.5px]">
          Introduce tu correo y validaremos un código para crear una contraseña nueva.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <InputField
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            icon={<EmailIcon />}
            backgroundColor="light"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#e12414] w-full px-6 py-[10px] rounded-[10px] mb-6 hover:bg-[#c41f12] active:bg-[#a01810] transition-all duration-200 shadow-sm active:shadow-none disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] text-[#f2f2f2] text-[16px] text-center">
            {loading ? "Preparando código..." : "Enviar código"}
          </p>
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[15px] leading-[25px] text-[#e12414] tracking-[0.5px] hover:underline transition-all active:opacity-70"
          >
            Volver a iniciar sesión
          </button>
        </div>
      </form>

      <AuthInfoModal
        abierto={Boolean(modal)}
        tipo={modal?.tipo}
        titulo={modal?.titulo ?? ""}
        mensaje={modal?.mensaje ?? ""}
        textoBoton={modal?.continuar ? "Introducir código" : "Entendido"}
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
              <p className="mt-2 text-xs leading-5 text-[#9a3412]">
                Cuando incorpores envío de email real, este código dejará de mostrarse en pantalla.
              </p>
            </div>
          ) : null
        }
      />
    </AuthLayout>
  );
}
