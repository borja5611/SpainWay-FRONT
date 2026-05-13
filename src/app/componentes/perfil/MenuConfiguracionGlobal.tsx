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

const IconoChevron = () => (
  <svg className="h-4 w-4 text-[#c4cdd6]" viewBox="0 0 24 24" fill="none">
    <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type Grupo = {
  label: string;
  items: {
    id: string;
    titulo: string;
    danger?: boolean;
  }[];
};

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

  function abrirModal(titulo: string, descripcion: string) {
    setModalInfo({ abierto: true, titulo, descripcion });
  }

  function cerrarModal() {
    setModalInfo({ abierto: false, titulo: "", descripcion: "" });
  }

  async function handleCerrarSesion() {
    try {
      setCerrandoSesion(true);
      await logout();
    } catch (e) {
      console.error(e);
    } finally {
      cerrarSesion();
      onCerrar();
      navigate("/login");
      setCerrandoSesion(false);
    }
  }

  async function handleClick(id: string) {
    switch (id) {
      case "perfil":
        onCerrar();
        navigate("/perfil");
        break;
      case "favoritos":
        abrirModal(
          "Favoritos",
          "Aquí podrás ver los lugares y destinos que has guardado. Próximamente disponible."
        );
        break;
      case "itinerarios":
        onCerrar();
        navigate("/itinerarios");
        break;
      case "app":
        abrirModal(
          "Ajustes de la app",
          "Notificaciones, privacidad y otros ajustes básicos de la aplicación. Próximamente disponible."
        );
        break;
      case "ayuda":
        abrirModal(
          "Ayuda",
          "Aquí podrás consultar dudas frecuentes, soporte básico y recomendaciones rápidas de uso de SpainWay."
        );
        break;
      case "acerca":
        abrirModal(
          "Acerca de SpainWay",
          "SpainWay está pensada para descubrir lugares, explorar comunidades, guardar favoritos y construir itinerarios personalizados de forma mucho más visual."
        );
        break;
      case "logout":
        await handleCerrarSesion();
        break;
    }
  }

  const grupos: Grupo[] = [
    {
      label: "Mi cuenta",
      items: [
        { id: "perfil", titulo: "Mi perfil" },
        { id: "favoritos", titulo: "Favoritos" },
        { id: "itinerarios", titulo: "Mis itinerarios" },
      ],
    },
    {
      label: "Aplicación",
      items: [
        { id: "app", titulo: "Ajustes de la app" },
        { id: "ayuda", titulo: "Ayuda" },
        { id: "acerca", titulo: "Acerca de SpainWay" },
      ],
    },
    {
      label: "Sesión",
      items: [
        {
          id: "logout",
          titulo: cerrandoSesion ? "Cerrando sesión..." : "Cerrar sesión",
          danger: true,
        },
      ],
    },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 z-[120] transition-all duration-300 ${
          abierto ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-[#0f172a]/30 backdrop-blur-[2px] transition-opacity duration-300 ${
            abierto ? "opacity-100" : "opacity-0"
          }`}
          onClick={onCerrar}
        />

        <aside
          className={`absolute right-0 top-0 h-full w-full max-w-[380px] transform bg-[#f2f2f7] shadow-[-12px_0_32px_rgba(15,23,42,0.14)] transition-transform duration-300 ease-out ${
            abierto ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">

            {/* Header minimalista */}
            <div className="flex items-center justify-between border-b border-[#e5e5ea] bg-[#f2f2f7] px-5 pb-4 pt-14">
              <h2 className="text-[22px] font-bold text-[#111827]">Ajustes</h2>
              <button
                onClick={onCerrar}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e5e5ea] text-[#6b7280] transition hover:bg-[#d1d1d6] active:scale-95"
              >
                <IconoCerrar />
              </button>
            </div>

            {/* Lista */}
            <div className="flex-1 overflow-y-auto px-4 pb-8 pt-6">
              <div className="space-y-6">
                {grupos.map((grupo) => (
                  <div key={grupo.label}>
                    {/* Label de sección */}
                    <p className="mb-1 px-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#8e8e93]">
                      {grupo.label}
                    </p>

                    {/* Grupo de filas */}
                    <div className="overflow-hidden rounded-[14px] bg-white">
                      {grupo.items.map((item, index) => (
                        <div key={item.id}>
                          <button
                            onClick={() => void handleClick(item.id)}
                            disabled={item.id === "logout" && cerrandoSesion}
                            className={`flex w-full items-center justify-between px-4 py-[14px] text-left transition-colors active:bg-[#f2f2f7] ${
                              item.danger
                                ? "text-[#e53935]"
                                : "text-[#111827]"
                            } ${
                              item.id === "logout" && cerrandoSesion
                                ? "cursor-not-allowed opacity-50"
                                : "hover:bg-[#f9f9f9]"
                            }`}
                          >
                            <span className="text-[16px] font-medium">
                              {item.titulo}
                            </span>
                            {!item.danger && <IconoChevron />}
                          </button>

                          {/* Separador interno excepto el último */}
                          {index < grupo.items.length - 1 && (
                            <div className="ml-4 border-b border-[#f0f0f0]" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Modal informativo */}
      {modalInfo.abierto && (
        <>
          <div
            className="fixed inset-0 z-[130] bg-black/40"
            onClick={cerrarModal}
          />
          <div className="fixed inset-0 z-[140] flex items-center justify-center px-6">
            <div className="w-full max-w-[320px] rounded-[20px] bg-white p-6 shadow-2xl">
              <h3 className="text-[18px] font-bold text-[#111827]">
                {modalInfo.titulo}
              </h3>
              <p className="mt-2 text-[15px] leading-7 text-[#6b7280]">
                {modalInfo.descripcion}
              </p>
              <button
                type="button"
                onClick={cerrarModal}
                className="mt-5 w-full rounded-xl bg-[#ff6a47] py-3 text-[15px] font-semibold text-white transition hover:bg-[#e85a38] active:scale-[0.98]"
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