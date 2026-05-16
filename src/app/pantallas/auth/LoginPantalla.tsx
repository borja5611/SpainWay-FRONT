import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/app/componentes/auth/AuthLayout";
import { Logo } from "@/app/componentes/auth/Logo";
import { InputField } from "@/app/componentes/auth/InputField";
import { SocialLogin } from "@/app/componentes/auth/SocialLogin";
import { AuthInfoModal } from "@/app/componentes/auth/AuthInfoModal";
import { EmailIcon, LockIcon, EyeIcon } from "@/app/componentes/auth/icons";
import { RUTAS_APP } from "@/app/utilidades/rutas";
import {
  getSocialAuthUrl,
  guardarSesion,
  login,
  type UsuarioAuth,
} from "@/app/servicios/auth";
import { useAuthStore } from "@/app/store/useAuthStore";

type ModalLogin = {
  tipo: "info" | "error" | "success";
  titulo: string;
  mensaje: string;
};

export default function LoginPantalla() {
  const navigate = useNavigate();
  const { setSesion } = useAuthStore();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<ModalLogin | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const user = params.get("user");

    if (token && user) {
      try {
        const usuario = JSON.parse(decodeURIComponent(user)) as UsuarioAuth;
        guardarSesion({ token, usuario });
        setSesion(token, usuario);

        window.history.replaceState({}, document.title, window.location.pathname);
        navigate(RUTAS_APP.inicio);
      } catch (err) {
        console.error(err);
      }
    }
  }, [navigate, setSesion]);

  function mostrarError(mensaje: string) {
    setModal({
      tipo: "error",
      titulo: "No se pudo continuar",
      mensaje,
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!emailOrUsername.trim() || !password.trim()) {
      mostrarError("Introduce tu email o usuario y la contraseña para acceder a SpainWay.");
      return;
    }

    try {
      setLoading(true);

      const auth = await login({
        emailOrUsername: emailOrUsername.trim(),
        password,
      });

      setSesion(auth.token, auth.usuario);
      navigate(RUTAS_APP.inicio);
    } catch (err) {
      console.error(err);
      mostrarError("No hemos podido iniciar sesión con esos datos. Revisa el email, el usuario o la contraseña e inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  function loginSocial(provider: "google" | "facebook" | "linkedin") {
    if (provider !== "google") {
      setModal({
        tipo: "info",
        titulo: "Acceso social en preparación",
        mensaje: "El acceso con Facebook y LinkedIn todavía no está disponible. Puedes entrar con email y contraseña mientras terminamos estas integraciones.",
      });
      return;
    }

    try {
      window.location.href = getSocialAuthUrl("google");
    } catch {
      setModal({
        tipo: "info",
        titulo: "Google estará disponible pronto",
        mensaje: "Estamos preparando el acceso con Google. De momento puedes iniciar sesión con tu email o nombre de usuario.",
      });
    }
  }

  return (
    <AuthLayout>
      <Logo />

      <div className="text-center mb-8">
        <h1 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[24px] leading-[32px] text-black tracking-[0.48px] mb-1">
          Bienvenido de nuevo!!
        </h1>
        <p className="font-['Inter:Medium',sans-serif] font-medium text-[14px] leading-[24px] text-[#7c6b69] tracking-[0.5px]">
          Inicia Sesión para continuar tu viaje
        </p>

        <button
          type="button"
          onClick={() => navigate("/onboarding/1")}
          className="font-['Inter:Medium',sans-serif] font-medium text-[12px] leading-[20px] text-[#e12414] tracking-[0.3px] hover:underline transition-all active:opacity-70 mt-2"
        >
          Ver tour de nuevo
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <InputField
            type="text"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            placeholder="Email o nombre de usuario"
            icon={<EmailIcon />}
            backgroundColor="light"
            required
          />
        </div>

        <div className="mb-3">
          <InputField
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            icon={<LockIcon />}
            endIcon={<EyeIcon />}
            onIconClick={() => setShowPassword(!showPassword)}
            backgroundColor="lighter"
            required
          />
        </div>

        <div className="text-right mb-6">
          <button
            type="button"
            onClick={() => navigate(RUTAS_APP.recuperarContrasena)}
            className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] leading-[24px] text-[#e12414] tracking-[0.5px] hover:underline active:opacity-70"
          >
            ¿Has olvidado tu contraseña?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#e12414] w-full px-6 py-[10px] rounded-[10px] mb-6 hover:bg-[#c41f12] active:bg-[#a01810] transition-all duration-200 shadow-sm active:shadow-none disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] text-[#f2f2f2] text-[16px] text-center">
            {loading ? "Iniciando..." : "Inicia Sesión"}
          </p>
        </button>

        <div className="mb-6">
          <SocialLogin
            text="O continúa con"
            onGoogle={() => loginSocial("google")}
            onFacebook={() => loginSocial("facebook")}
            onLinkedin={() => loginSocial("linkedin")}
          />
        </div>

        <div className="mt-2 text-center pb-2">
          <span className="font-['Inter:Medium',sans-serif] font-medium text-[15px] leading-[25px] text-[#2e3e5c] tracking-[0.5px]">
            Si todavía no tienes una cuenta{" "}
          </span>
          <button
            type="button"
            onClick={() => navigate(RUTAS_APP.registro)}
            className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[15px] leading-[25px] text-[#e12414] tracking-[0.5px] hover:underline transition-all active:opacity-70"
          >
            Regístrate
          </button>
        </div>
      </form>

      <AuthInfoModal
        abierto={Boolean(modal)}
        tipo={modal?.tipo}
        titulo={modal?.titulo ?? ""}
        mensaje={modal?.mensaje ?? ""}
        onCerrar={() => setModal(null)}
      />
    </AuthLayout>
  );
}
