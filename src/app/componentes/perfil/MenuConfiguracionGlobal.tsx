import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "@/app/servicios/auth";
import { useAuthStore } from "@/app/store/useAuthStore";

type Props = {
  abierto: boolean;
  onCerrar: () => void;
};

type ModalInfoState = {
  abierto: boolean;
  titulo: string;
  descripcion: string;
};

const IconoCerrar = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
    <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const IconoSpark = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
    <path d="M12 3L13.8 8.2L19 10L13.8 11.8L12 17L10.2 11.8L5 10L10.2 8.2L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

const IconoChevron = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
    <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function MenuConfiguracionGlobal({ abierto, onCerrar }: Props) {
  const navigate = useNavigate();
  const { cerrarSesion } = useAuthStore();

  const [cerrandoSesion, setCerrandoSesion] = useState(false);
  const [modalInfo, setModalInfo] = useState<ModalInfoState>({
    abierto: false,
    titulo: "",
    descripcion: "",
  });

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCerrar();
    };

    if (abierto) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [abierto, onCerrar]);

  function abrirModalInfo(titulo: string, descripcion: string) {
    setModalInfo({
      abierto: true,
      titulo,
      descripcion,
    });
  }

  function cerrarModalInfo() {
    setModalInfo({
      abierto: false,
      titulo: "",
      descripcion: "",
    });
  }

  async function handleCerrarSesion() {
    try {
      setCerrandoSesion(true);
      await logout();
    } catch (error) {
      console.error(error);
    } finally {
      cerrarSesion();
      onCerrar();
      navigate("/login");
      setCerrandoSesion(false);
    }
  }

  async function handleItemClick(id: string, link: string) {
    switch (id) {
      case "perfil":
        onCerrar();
        navigate("/perfil");
        break;

      case "favoritos":
        abrirModalInfo(
          "Destinos favoritos",
          "Aquí podrás gestionar los lugares guardados. La navegación específica de favoritos la conectaremos en la siguiente iteración."
        );
        break;

      case "itinerarios":
        onCerrar();
        navigate("/itinerarios");
        break;

      case "notificaciones":
        abrirModalInfo(
          "Notificaciones",
          "Aquí podrás activar o desactivar recordatorios, avisos de itinerarios y mensajes importantes de la aplicación."
        );
        break;

      case "privacidad":
        abrirModalInfo(
          "Privacidad",
          "Aquí mostraremos opciones de seguridad, permisos y control de la cuenta cuando terminemos de conectar esa parte."
        );
        break;

      case "ayuda":
        abrirModalInfo(
          "Ayuda y soporte",
          "Aquí podrás acceder a ayuda, preguntas frecuentes y soporte de SpainWay."
        );
        break;

      case "acerca":
        abrirModalInfo(
          "Acerca de SpainWay",
          "SpainWay te ayuda a descubrir lugares, guardar favoritos, organizar itinerarios y gestionar tu viaje desde una sola app."
        );
        break;

      case "logout":
        await handleCerrarSesion();
        break;

      default:
        if (link !== "#") {
          onCerrar();
          navigate(link);
        } else {
          abrirModalInfo(
            "Próximamente",
            "Esta sección estará disponible más adelante."
          );
        }
        break;
    }
  }

  const items = [
    {
      id: "perfil",
      titulo: "Cuenta y perfil",
      descripcion: "Edita tus datos personales y preferencias.",
      importante: true,
      link: "/perfil",
    },
    {
      id: "favoritos",
      titulo: "Destinos favoritos",
      descripcion: "Gestiona ciudades y lugares guardados.",
      link: "#",
    },
    {
      id: "itinerarios",
      titulo: "Itinerarios guardados",
      descripcion: "Consulta tus rutas y viajes creados.",
      link: "/itinerarios",
    },
    {
      id: "notificaciones",
      titulo: "Notificaciones",
      descripcion: "Ajusta avisos y recordatorios.",
      link: "#",
    },
    {
      id: "privacidad",
      titulo: "Privacidad",
      descripcion: "Controla permisos y seguridad.",
      link: "#",
    },
    {
      id: "ayuda",
      titulo: "Ayuda y soporte",
      descripcion: "Soporte y dudas frecuentes.",
      link: "#",
    },
    {
      id: "acerca",
      titulo: "Acerca de SpainWay",
      descripcion: "Información general de la app.",
      link: "#",
    },
    {
      id: "logout",
      titulo: cerrandoSesion ? "Cerrando sesión..." : "Cerrar sesión",
      descripcion: "Salir de la cuenta actual.",
      link: "#",
    },
  ];

  return (
    <>
      <div className={`fixed inset-0 z-[120] transition-all duration-300 ${abierto ? "visible" : "invisible"}`}>
        <div
          className={`absolute inset-0 bg-[#0f172a]/32 backdrop-blur-[2px] transition-opacity duration-300 ${abierto ? "opacity-100" : "opacity-0"}`}
          onClick={onCerrar}
        />

        <aside
          className={`absolute right-0 top-0 h-full w-full max-w-[390px] transform bg-[#f5f7fb] shadow-[-18px_0_40px_rgba(15,23,42,0.18)] transition-transform duration-300 ease-out ${
            abierto ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="relative overflow-hidden border-b border-[#edf1f6] bg-[linear-gradient(135deg,#fff8f4_0%,#ffffff_50%,#f4f1ff_100%)] px-5 pb-5 pt-6">
              <div className="absolute right-[-20px] top-[-20px] h-24 w-24 rounded-full bg-[#ff6a47]/10 blur-3xl" />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#ff6a47] shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
                    <IconoSpark />
                    Configuración
                  </div>
                  <h2 className="mt-3 text-[30px] font-extrabold tracking-[-0.04em] text-[#111827]">
                    Ajustes
                  </h2>
                </div>

                <button
                  onClick={onCerrar}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#111827] shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition hover:scale-105 active:scale-95"
                >
                  <IconoCerrar />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => void handleItemClick(item.id, item.link)}
                    disabled={item.id === "logout" && cerrandoSesion}
                    className={`group w-full rounded-[28px] p-5 text-left transition-all hover:translate-y-[-2px] ${
                      item.importante
                        ? "border border-[#ffd7cd] bg-[linear-gradient(135deg,#fff7f4_0%,#fffdfc_100%)] shadow-[0_14px_30px_rgba(255,106,71,0.08)]"
                        : "bg-white shadow-[0_14px_30px_rgba(15,23,42,0.04)]"
                    } ${item.id === "logout" ? "hover:bg-[#fff5f5]" : ""} ${
                      item.id === "logout" && cerrandoSesion ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className={`text-[17px] font-bold ${item.id === "logout" ? "text-[#b42318]" : "text-[#111827]"}`}>
                          {item.titulo}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-[#667085]">{item.descripcion}</p>
                      </div>

                      <div
                        className={`shrink-0 rounded-2xl p-3 transition-colors ${
                          item.id === "logout"
                            ? "bg-[#fff1f1] text-[#d92d20] group-hover:bg-[#d92d20] group-hover:text-white"
                            : "bg-[#f8fafc] text-[#98a2b3] group-hover:bg-[#ff6a47] group-hover:text-white"
                        }`}
                      >
                        <IconoChevron />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-[#edf1f6] bg-white px-4 py-4">
              <div className="rounded-[24px] bg-[#111827] p-5 text-white shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
                <h3 className="text-[18px] font-bold">Perfil al día</h3>
                <p className="mt-1 text-sm text-white/70">Mejora tus rutas personalizadas.</p>
                <button
                  onClick={() => {
                    navigate("/perfil/editar");
                    onCerrar();
                  }}
                  className="mt-4 w-full rounded-xl bg-[#ff6a47] py-3 text-sm font-bold shadow-lg shadow-[#ff6a47]/20"
                >
                  Editar ahora
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {modalInfo.abierto && (
        <>
          <div
            className="fixed inset-0 z-[130] bg-black/40"
            onClick={cerrarModalInfo}
          />
          <div className="fixed inset-0 z-[140] flex items-center justify-center px-5">
            <div className="w-full max-w-[360px] rounded-[24px] bg-white p-6 shadow-2xl">
              <h3 className="text-[22px] font-bold text-[#111827]">
                {modalInfo.titulo}
              </h3>
              <p className="mt-3 text-[15px] leading-7 text-[#667085]">
                {modalInfo.descripcion}
              </p>

              <button
                type="button"
                onClick={cerrarModalInfo}
                className="mt-6 w-full rounded-xl bg-[#ff6a47] py-3 text-sm font-bold text-white"
              >
                Entendido
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}