import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoSpainway from "../../../assets/LogoSpainway.png";
import { me, type UsuarioAuth } from "@/app/servicios/auth";
import { useAuthStore } from "@/app/store/useAuthStore";
import { getFavoritos } from "@/app/servicios/favoritos";
import { getItinerarios } from "@/app/servicios/itinerarios";

function IconoEditar() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 20H8L18.5 9.5C19.3284 8.67157 19.3284 7.32843 18.5 6.5C17.6716 5.67157 16.3284 5.67157 15.5 6.5L5 17V20H4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
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

function IconoAjustes() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M19.4 15A1.65 1.65 0 0 0 19.73 16.82L19.79 16.88A2 2 0 1 1 16.96 19.71L16.9 19.65A1.65 1.65 0 0 0 15.08 19.32A1.65 1.65 0 0 0 14 20.85V21A2 2 0 1 1 10 21V20.91A1.65 1.65 0 0 0 8.91 19.39A1.65 1.65 0 0 0 7.09 19.72L7.03 19.78A2 2 0 1 1 4.2 16.95L4.26 16.89A1.65 1.65 0 0 0 4.59 15.07A1.65 1.65 0 0 0 3.06 14H3A2 2 0 1 1 3 10H3.09A1.65 1.65 0 0 0 4.61 8.91A1.65 1.65 0 0 0 4.28 7.09L4.22 7.03A2 2 0 1 1 7.05 4.2L7.11 4.26A1.65 1.65 0 0 0 8.93 4.59H9A1.65 1.65 0 0 0 10 3.06V3A2 2 0 1 1 14 3V3.09A1.65 1.65 0 0 0 15.09 4.61A1.65 1.65 0 0 0 16.91 4.28L16.97 4.22A2 2 0 1 1 19.8 7.05L19.74 7.11A1.65 1.65 0 0 0 19.41 8.93V9A1.65 1.65 0 0 0 20.94 10H21A2 2 0 1 1 21 14H20.91A1.65 1.65 0 0 0 19.39 15.09L19.4 15Z"
        stroke="currentColor"
        strokeWidth="1.3"
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

function IconoCorazon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 20C12 20 5 15.2 5 9.8C5 7.14903 7.01472 5 9.5 5C10.9286 5 12.2016 5.70867 13 6.81579C13.7984 5.70867 15.0714 5 16.5 5C18.9853 5 21 7.14903 21 9.8C21 15.2 14 20 14 20H12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconoRuta() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 19C7.10457 19 8 18.1046 8 17C8 15.8954 7.10457 15 6 15C4.89543 15 4 15.8954 4 17C4 18.1046 4.89543 19 6 19Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M18 9C19.1046 9 20 8.10457 20 7C20 5.89543 19.1046 5 18 5C16.8954 5 16 5.89543 16 7C16 8.10457 16.8954 9 18 9Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8 17C12 17 12 7 16 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

const accesosRapidosBase = [
  {
    titulo: "Editar perfil",
    descripcion: "Actualiza tus datos personales y preferencias básicas.",
    icono: <IconoEditar />,
    accion: "editar",
  },
  {
    titulo: "Preferencias de cuenta",
    descripcion: "Ajusta cómo quieres que SpainWay adapte tu experiencia.",
    icono: <IconoAjustes />,
    accion: "configuracion",
  },
  {
    titulo: "Viajes guardados",
    descripcion: "Consulta las rutas y propuestas que has ido construyendo.",
    icono: <IconoRuta />,
    accion: "itinerarios",
  },
];

function formatearTelefono(telefono: string | null | undefined) {
  if (!telefono) return "No indicado";
  return telefono;
}

export default function PerfilPantalla() {
  const navigate = useNavigate();
  const { token, usuario } = useAuthStore();

  const [perfil, setPerfil] = useState<UsuarioAuth | null>(usuario);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalFavoritos, setTotalFavoritos] = useState(0);
  const [totalItinerarios, setTotalItinerarios] = useState(0);

  useEffect(() => {
    async function cargarPerfil() {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await me(token);
        setPerfil(data);

        const [favoritos, itinerarios] = await Promise.all([
          getFavoritos(data.id_usuario),
          getItinerarios(data.id_usuario),
        ]);

        setTotalFavoritos(Array.isArray(favoritos) ? favoritos.length : 0);
        setTotalItinerarios(Array.isArray(itinerarios) ? itinerarios.length : 0);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el perfil.");
      } finally {
        setLoading(false);
      }
    }

    void cargarPerfil();
  }, [token, navigate]);


  function manejarAccion(accion: string) {
    if (accion === "editar") {
      navigate("/perfil/editar");
      return;
    }

    if (accion === "itinerarios") {
      navigate("/itinerarios");
      return;
    }

    if (accion === "configuracion") {
      navigate("/perfil");
    }
  }

  if (loading) {
    return (
      <div className="min-h-full bg-[#eef2f8] text-[#111827] flex items-center justify-center">
        <p className="text-sm text-[#667085]">Cargando perfil...</p>
      </div>
    );
  }

  if (error || !perfil) {
    return (
      <div className="min-h-full bg-[#eef2f8] px-5 py-10">
        <div className="mx-auto max-w-[430px] rounded-[24px] bg-white p-6 text-center shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
          <p className="text-sm text-red-600">
            {error || "No se pudo cargar el perfil"}
          </p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-4 rounded-xl bg-[#ff6a47] px-4 py-3 text-sm font-semibold text-white"
          >
            Ir a login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#eef2f8] text-[#111827]">
      <div className="mx-auto w-full max-w-[430px] pb-28">
        <section className="px-5 pt-5">
          <div className="overflow-hidden rounded-[34px] bg-[linear-gradient(135deg,#fff8f4_0%,#ffffff_50%,#f4f1ff_100%)] shadow-[0_18px_38px_rgba(15,23,42,0.08)]">
            <div className="relative px-5 pb-6 pt-6">
              <div className="absolute right-[-22px] top-[-18px] h-28 w-28 rounded-full bg-[#ff6a47]/10 blur-3xl" />
              <div className="absolute left-[-12px] bottom-[-18px] h-24 w-24 rounded-full bg-[#7c3aed]/10 blur-3xl" />

              <div className="relative flex flex-col items-center text-center">
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#fff4ef] shadow-[0_14px_32px_rgba(15,23,42,0.08)] overflow-hidden">
                  <img
                    src={LogoSpainway}
                    alt="Perfil SpainWay"
                    className="h-14 w-14 object-contain"
                  />
                </div>

                <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#ff6a47] shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
                  <IconoCorazon />
                  Perfil activo
                </div>

                <h1 className="mt-4 text-[34px] font-extrabold tracking-[-0.04em] text-[#111827] break-words">
                  {perfil.nombre}
                </h1>

                <p className="mt-2 text-sm leading-6 text-[#667085] break-all">
                  {perfil.email}
                </p>

                <p className="mt-4 max-w-[290px] text-sm leading-6 text-[#667085]">
                  Gestiona tu cuenta, revisa tu información y mantén tu experiencia
                  de viaje alineada con tus preferencias.
                </p>
              </div>

              <div className="relative mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-white/90 p-3 text-center shadow-[0_8px_24px_rgba(15,23,42,0.05)] min-h-[82px] flex flex-col items-center justify-center">
                  <p className="text-xs text-[#94a3b8]">Itinerarios</p>
                  <p className="mt-1 text-lg font-bold text-[#0f172a]">
                    {totalItinerarios}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/90 p-3 text-center shadow-[0_8px_24px_rgba(15,23,42,0.05)] min-h-[82px] flex flex-col items-center justify-center">
                  <p className="text-xs text-[#94a3b8]">Favoritos</p>
                  <p className="mt-1 text-lg font-bold text-[#0f172a]">
                    {totalFavoritos}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/90 p-3 text-center shadow-[0_8px_24px_rgba(15,23,42,0.05)] min-h-[82px] flex flex-col items-center justify-center">
                  <p className="text-xs text-[#94a3b8]">Teléfono</p>
                  <p className="mt-1 text-[13px] font-bold text-[#0f172a] break-words leading-5">
                    {perfil.telefono || "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 pt-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-[26px] bg-white p-4 shadow-[0_12px_28px_rgba(15,23,42,0.07)] min-h-[140px]">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff4ef] text-[#ff6a47]">
                <IconoUsuario />
              </div>
              <p className="text-xs text-[#94a3b8]">Usuario</p>
              <p className="mt-1 text-base font-bold text-[#111827] break-words">
                {perfil.nombre_usuario || perfil.nombre}
              </p>
            </div>

            <div className="rounded-[26px] bg-white p-4 shadow-[0_12px_28px_rgba(15,23,42,0.07)] min-h-[140px]">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff4ef] text-[#ff6a47]">
                <IconoCorreo />
              </div>
              <p className="text-xs text-[#94a3b8]">Correo</p>
              <p className="mt-1 text-base font-bold text-[#111827] break-all">
                {perfil.email}
              </p>
            </div>

            <div className="rounded-[26px] bg-white p-4 shadow-[0_12px_28px_rgba(15,23,42,0.07)] min-h-[140px]">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff4ef] text-[#ff6a47]">
                <IconoTelefono />
              </div>
              <p className="text-xs text-[#94a3b8]">Teléfono</p>
              <p className="mt-1 text-base font-bold text-[#111827] break-words leading-6">
                {formatearTelefono(perfil.telefono)}
              </p>
            </div>

            <div className="rounded-[26px] bg-white p-4 shadow-[0_12px_28px_rgba(15,23,42,0.07)] min-h-[140px]">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff4ef] text-[#ff6a47]">
                <IconoAjustes />
              </div>
              <p className="text-xs text-[#94a3b8]">Cuenta</p>
              <p className="mt-1 text-base font-bold text-[#111827] break-words">
                Personalización activa
              </p>
            </div>
          </div>
        </section>

        <section className="px-5 pt-5">
          <div className="mb-3">
            <h2 className="text-[18px] font-bold tracking-[-0.02em]">
              Accesos rápidos
            </h2>
            <p className="text-sm leading-6 text-[#667085]">
              Las acciones más útiles para gestionar tu cuenta sin perder tiempo.
            </p>
          </div>

          <div className="space-y-4">
            {accesosRapidosBase.map((item) => (
              <button
                key={item.titulo}
                type="button"
                onClick={() => manejarAccion(item.accion)}
                className="w-full rounded-[28px] bg-white p-5 text-left shadow-[0_14px_30px_rgba(15,23,42,0.08)] transition hover:translate-y-[-1px]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fff4ef] text-[#ff6a47]">
                      {item.icono}
                    </div>

                    <div>
                      <h3 className="text-[17px] font-bold text-[#111827]">
                        {item.titulo}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[#667085]">
                        {item.descripcion}
                      </p>
                    </div>
                  </div>

                  <div className="text-[#98a2b3]">
                    <IconoChevron />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="px-5 pt-5">
          <div className="rounded-[28px] bg-[#111827] p-5 text-white shadow-[0_16px_34px_rgba(17,24,39,0.18)]">
            <p className="text-xs uppercase tracking-[0.18em] text-white/50">
              Cuenta y personalización
            </p>
            <h2 className="mt-2 text-[22px] font-bold tracking-[-0.03em]">
              Mantén SpainWay alineado contigo
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/74">
              Ajusta tu perfil y deja preparada la app para que tus próximos viajes,
              rutas y recomendaciones encajen mejor con tu estilo.
            </p>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => navigate("/perfil/editar")}
                className="flex-1 rounded-2xl bg-[#ff6a47] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(255,106,71,0.28)]"
              >
                Editar perfil
              </button>

              <button
                type="button"
                onClick={() => navigate("/itinerarios")}
                className="flex-1 rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur"
              >
                Ver itinerarios
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}