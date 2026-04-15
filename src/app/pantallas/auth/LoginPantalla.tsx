import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/app/componentes/auth/AuthLayout";
import { Logo } from "@/app/componentes/auth/Logo";
import { InputField } from "@/app/componentes/auth/InputField";
import { SocialLogin } from "@/app/componentes/auth/SocialLogin";
import { EmailIcon, LockIcon, EyeIcon } from "@/app/componentes/auth/icons";
import { RUTAS_APP } from "@/app/utilidades/rutas";
import {
  getSocialAuthUrl,
  guardarSesion,
  login,
  type UsuarioAuth,
} from "@/app/servicios/auth";
import { useAuthStore } from "@/app/store/useAuthStore";

export default function LoginPantalla() {
  const navigate = useNavigate();
  const { setSesion } = useAuthStore();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!emailOrUsername.trim() || !password.trim()) {
      setError("Debes rellenar usuario/email y contraseña");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const auth = await login({
        emailOrUsername: emailOrUsername.trim(),
        password,
      });

      setSesion(auth.token, auth.usuario);
      navigate(RUTAS_APP.inicio);
    } catch (err) {
      console.error(err);
      setError("No se pudo iniciar sesión. Revisa tus credenciales.");
    } finally {
      setLoading(false);
    }
  }

  function loginSocial(provider: "google" | "facebook" | "linkedin") {
    if (provider !== "google") {
      setError("De momento solo está activo el acceso con Google.");
      return;
    }

    window.location.href = getSocialAuthUrl("google");
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
            className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] leading-[24px] text-[#e12414] tracking-[0.5px] opacity-50 cursor-not-allowed"
            disabled
          >
            ¿Has olvidado tu contraseña?
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-[10px] bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

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
    </AuthLayout>
  );
}