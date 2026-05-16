import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/app/componentes/auth/AuthLayout";
import { Logo } from "@/app/componentes/auth/Logo";
import { InputField } from "@/app/componentes/auth/InputField";
import { AuthInfoModal } from "@/app/componentes/auth/AuthInfoModal";
import { EyeIcon, LockIcon } from "@/app/componentes/auth/icons";
import { cambiarContrasenaConToken } from "@/app/servicios/auth";

const RESET_EMAIL_KEY = "spainway_reset_email";
const RESET_DEV_CODE_KEY = "spainway_reset_dev_code";
const RESET_TOKEN_KEY = "spainway_reset_token";

type ModalState = {
  tipo: "info" | "error" | "success";
  titulo: string;
  mensaje: string;
  volver?: boolean;
};

export default function NuevaContrasenaPantalla() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [modal, setModal] = useState<ModalState | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem(RESET_TOKEN_KEY) ?? "";
    setResetToken(token);

    if (!token) {
      setModal({
        tipo: "info",
        titulo: "Verifica primero el código",
        mensaje: "Para proteger tu cuenta, antes de elegir una nueva contraseña debes validar el código de recuperación.",
        volver: true,
      });
    }
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!resetToken) {
      navigate("/recuperar-contrasena");
      return;
    }

    if (password.length < 6) {
      setModal({
        tipo: "error",
        titulo: "Contraseña demasiado corta",
        mensaje: "La nueva contraseña debe tener al menos 6 caracteres.",
      });
      return;
    }

    if (password !== confirmPassword) {
      setModal({
        tipo: "error",
        titulo: "Las contraseñas no coinciden",
        mensaje: "Revisa ambos campos y vuelve a intentarlo.",
      });
      return;
    }

    try {
      setLoading(true);
      await cambiarContrasenaConToken(resetToken, password);
      sessionStorage.removeItem(RESET_EMAIL_KEY);
      sessionStorage.removeItem(RESET_DEV_CODE_KEY);
      sessionStorage.removeItem(RESET_TOKEN_KEY);
      navigate("/confirmacion-contrasena");
    } catch (err) {
      console.error(err);
      setModal({
        tipo: "error",
        titulo: "No se pudo cambiar la contraseña",
        mensaje:
          err instanceof Error
            ? err.message
            : "El enlace de recuperación ya no es válido. Solicita un código nuevo e inténtalo de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  }

  function cerrarModal() {
    const volver = modal?.volver;
    setModal(null);
    if (volver) navigate("/recuperar-contrasena");
  }

  return (
    <AuthLayout>
      <Logo />

      <div className="text-center mb-8">
        <h1 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[24px] leading-[32px] text-black tracking-[0.48px] mb-2">
          Nueva contraseña
        </h1>
        <p className="font-['Inter:Medium',sans-serif] font-medium text-[14px] leading-[24px] text-[#7c6b69] tracking-[0.5px]">
          Elige una contraseña segura para volver a entrar en SpainWay.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <InputField
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nueva contraseña"
            icon={<LockIcon />}
            endIcon={<EyeIcon />}
            onIconClick={() => setShowPassword(!showPassword)}
            backgroundColor="light"
            required
          />
        </div>

        <div className="mb-6">
          <InputField
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repetir contraseña"
            icon={<LockIcon />}
            endIcon={<EyeIcon />}
            onIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
            backgroundColor="lighter"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#e12414] w-full px-6 py-[10px] rounded-[10px] mb-6 hover:bg-[#c41f12] active:bg-[#a01810] transition-all duration-200 shadow-sm active:shadow-none disabled:opacity-60"
        >
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] text-[#f2f2f2] text-[16px] text-center">
            {loading ? "Guardando..." : "Actualizar contraseña"}
          </p>
        </button>
      </form>

      <AuthInfoModal
        abierto={Boolean(modal)}
        tipo={modal?.tipo}
        titulo={modal?.titulo ?? ""}
        mensaje={modal?.mensaje ?? ""}
        onCerrar={cerrarModal}
      />
    </AuthLayout>
  );
}
