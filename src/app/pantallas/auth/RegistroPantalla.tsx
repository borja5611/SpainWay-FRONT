import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/app/componentes/auth/AuthLayout";
import { Logo } from "@/app/componentes/auth/Logo";
import { InputField } from "@/app/componentes/auth/InputField";
import { SocialLogin } from "@/app/componentes/auth/SocialLogin";
import { AuthInfoModal } from "@/app/componentes/auth/AuthInfoModal";
import { EmailIcon, LockIcon, EyeIcon } from "@/app/componentes/auth/icons";
import { RUTAS_APP } from "@/app/utilidades/rutas";
import { getSocialAuthUrl, register } from "@/app/servicios/auth";
import { useAuthStore } from "@/app/store/useAuthStore";

const PREFIJOS_PAISES = [
  { label: "🇪🇸 +34", value: "+34" },
  { label: "🇵🇹 +351", value: "+351" },
  { label: "🇫🇷 +33", value: "+33" },
  { label: "🇮🇹 +39", value: "+39" },
  { label: "🇩🇪 +49", value: "+49" },
  { label: "🇬🇧 +44", value: "+44" },
  { label: "🇺🇸 +1", value: "+1" },
];

function esEmailValido(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function limpiarTelefono(valor: string) {
  return valor.replace(/\D/g, "");
}

function esTelefonoValido(valor: string) {
  return /^[0-9]{6,15}$/.test(valor);
}

export default function RegistroPantalla() {
  const navigate = useNavigate();
  const { setSesion } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    username: "",
    countryCode: "+34",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{ tipo: "info" | "error" | "success"; titulo: string; mensaje: string } | null>(null);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  function mostrarError(mensaje: string) {
    setModal({
      tipo: "error",
      titulo: "No se pudo continuar",
      mensaje,
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const email = formData.email.trim().toLowerCase();
    const username = formData.username.trim().toLowerCase();
    const nombre = formData.name.trim();
    const telefonoLimpio = limpiarTelefono(formData.phone);

    if (
      !email ||
      !formData.password.trim() ||
      !formData.confirmPassword.trim() ||
      !nombre ||
      !username
    ) {
      mostrarError("Completa los campos obligatorios para crear tu cuenta.");
      return;
    }

    if (!esEmailValido(email)) {
      mostrarError("Introduce un email válido para poder acceder y recuperar tu cuenta más adelante.");
      return;
    }

    if (!/^[a-zA-Z0-9._-]{3,30}$/.test(username)) {
      mostrarError("El nombre de usuario debe tener entre 3 y 30 caracteres y solo puede usar letras, números, punto, guion o guion bajo.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      mostrarError("Las contraseñas no coinciden. Revísalas antes de continuar.");
      return;
    }

    if (formData.password.length < 6) {
      mostrarError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (formData.phone.trim() && !esTelefonoValido(telefonoLimpio)) {
      mostrarError("Introduce un número de teléfono válido o deja el campo vacío.");
      return;
    }

    try {
      setLoading(true);


      const telefonoCompleto = formData.phone.trim()
        ? `${formData.countryCode}${telefonoLimpio}`
        : undefined;

      const auth = await register({
        nombre,
        nombre_usuario: username,
        email,
        telefono: telefonoCompleto,
        password: formData.password,
      });

      setSesion(auth.token, auth.usuario);
      navigate(RUTAS_APP.inicio);
    } catch (err) {
      console.error(err);
      mostrarError("No se pudo crear la cuenta. Puede que el email o el nombre de usuario ya estén registrados.");
    } finally {
      setLoading(false);
    }
  }

  function loginSocial(provider: "google" | "facebook" | "linkedin") {
    if (provider !== "google") {
      setModal({
        tipo: "info",
        titulo: "Registro social en preparación",
        mensaje: "El registro con Facebook y LinkedIn todavía no está disponible. Puedes crear tu cuenta con email y contraseña.",
      });
      return;
    }

    try {
      window.location.href = getSocialAuthUrl("google");
    } catch {
      setModal({
        tipo: "info",
        titulo: "Google estará disponible pronto",
        mensaje: "Estamos preparando el registro con Google. De momento puedes crear tu cuenta con email y contraseña.",
      });
    }
  }

  return (
    <AuthLayout>
      <Logo />

      <div className="text-center mb-8">
        <h1 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[24px] leading-[32px] text-black tracking-[0.48px] mb-2">
          Crea tu cuenta en SpainWay
        </h1>
        <p className="font-['Inter:Medium',sans-serif] font-medium text-[14px] leading-[24px] text-[#7c6b69] tracking-[0.5px]">
          Crea tu cuenta y empieza a explorar experiencias
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <InputField
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Email"
            icon={<EmailIcon />}
            backgroundColor="light"
            required
          />
        </div>

        <div className="mb-4">
          <InputField
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="Contraseña"
            icon={<LockIcon />}
            endIcon={<EyeIcon />}
            onIconClick={() => setShowPassword(!showPassword)}
            backgroundColor="lighter"
            required
          />
        </div>

        <div className="mb-4">
          <InputField
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            placeholder="Confirmar Contraseña"
            icon={<LockIcon />}
            endIcon={<EyeIcon />}
            onIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
            backgroundColor="lighter"
            required
          />
        </div>

        <div className="mb-4">
          <InputField
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Nombre completo"
            icon={<EmailIcon />}
            backgroundColor="light"
            required
          />
        </div>

        <div className="mb-4">
          <InputField
            type="text"
            value={formData.username}
            onChange={(e) => handleChange("username", e.target.value)}
            placeholder="Nombre de usuario"
            icon={<EmailIcon />}
            backgroundColor="light"
            required
          />
        </div>

        <div className="mb-4">
          <div className="flex gap-2">
            <select
              value={formData.countryCode}
              onChange={(e) => handleChange("countryCode", e.target.value)}
              className="h-[54px] rounded-[12px] border border-[#d9dfe8] bg-[#f4f7fb] px-3 text-[#2e3e5c] outline-none min-w-[108px]"
            >
              {PREFIJOS_PAISES.map((pais) => (
                <option key={pais.value} value={pais.value}>
                  {pais.label}
                </option>
              ))}
            </select>

            <div className="flex-1">
              <InputField
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  handleChange("phone", limpiarTelefono(e.target.value))
                }
                placeholder="Número de teléfono"
                icon={<EmailIcon />}
                backgroundColor="light"
              />
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <p className="font-['Poppins:ExtraLight',sans-serif] text-[12px] leading-[25px] text-black">
            Al registrarte, estás aceptando nuestros{" "}
            <button
              type="button"
              onClick={() =>
                setModal({
                  tipo: "info",
                  titulo: "Términos y condiciones",
                  mensaje:
                    "Al crear una cuenta aceptas usar SpainWay de forma responsable, mantener tus datos de acceso protegidos y permitir que guardemos la información necesaria para gestionar tu perfil, preferencias, favoritos e itinerarios.\n\nSpainWay muestra recomendaciones turísticas y rutas orientativas. Revisa siempre horarios, precios, disponibilidad y condiciones reales antes de desplazarte o reservar."
                })
              }
              className="font-['Poppins:Medium',sans-serif] text-[#ef7464] active:opacity-70 transition-all hover:underline"
            >
              términos y condiciones
            </button>
            .
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#e12414] w-full px-6 py-[10px] rounded-[10px] mb-6 hover:bg-[#c41f12] active:bg-[#a01810] transition-all duration-200 shadow-sm active:shadow-none disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] text-[#f2f2f2] text-[16px] text-center">
            {loading ? "Registrando..." : "Registrarse"}
          </p>
        </button>

        <div className="mb-6">
          <SocialLogin
            text="O regístrate con"
            onGoogle={() => loginSocial("google")}
            onFacebook={() => loginSocial("facebook")}
            onLinkedin={() => loginSocial("linkedin")}
          />
        </div>

        <div className="text-center pb-4">
          <span className="font-['Inter:Medium',sans-serif] font-medium text-[15px] leading-[25px] text-[#2e3e5c] tracking-[0.5px]">
            Si ya tienes una cuenta{" "}
          </span>
          <button
            type="button"
            onClick={() => navigate(RUTAS_APP.login)}
            className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[15px] leading-[25px] text-[#e12414] tracking-[0.5px] hover:underline transition-all active:opacity-70"
          >
            Inicia Sesión
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