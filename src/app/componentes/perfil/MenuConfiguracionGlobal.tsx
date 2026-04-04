import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  abierto: boolean;
  onCerrar: () => void;
};

// Iconos internos para mantener el diseño premium
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

  // Manejo de tecla Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCerrar();
    };
    if (abierto) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [abierto, onCerrar]);

  const items = [
    { id: "perfil", titulo: "Cuenta y perfil", descripcion: "Edita tus datos personales y preferencias.", importante: true, link: "/perfil" },
    { id: "favoritos", titulo: "Destinos favoritos", descripcion: "Gestiona ciudades y lugares guardados.", link: "#" },
    { id: "itinerarios", titulo: "Itinerarios guardados", descripcion: "Consulta tus rutas y viajes creados.", link: "/itinerarios" },
    { id: "notificaciones", titulo: "Notificaciones", descripcion: "Ajusta avisos y recordatorios.", link: "#" },
    { id: "privacidad", titulo: "Privacidad", descripcion: "Controla permisos y seguridad.", link: "#" },
    { id: "ayuda", titulo: "Ayuda y soporte", descripcion: "Soporte y dudas frecuentes.", link: "#" },
    { id: "acerca", titulo: "Acerca de SpainWay", descripcion: "Información general de la app.", link: "#" },
    { id: "logout", titulo: "Cerrar sesión", descripcion: "Salir de la cuenta actual.", link: "#" },
  ];

  return (
    <div className={`fixed inset-0 z-[120] transition-all duration-300 ${abierto ? "visible" : "invisible"}`}>
      {/* Overlay / Fondo oscuro */}
      <div
        className={`absolute inset-0 bg-[#0f172a]/32 backdrop-blur-[2px] transition-opacity duration-300 ${abierto ? "opacity-100" : "opacity-0"}`}
        onClick={onCerrar}
      />

      {/* Panel Lateral */}
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-[390px] transform bg-[#f5f7fb] shadow-[-18px_0_40px_rgba(15,23,42,0.18)] transition-transform duration-300 ease-out ${
          abierto ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Cabecera del Menú con Gradiente */}
          <div className="relative overflow-hidden border-b border-[#edf1f6] bg-[linear-gradient(135deg,#fff8f4_0%,#ffffff_50%,#f4f1ff_100%)] px-5 pb-5 pt-6">
            <div className="absolute right-[-20px] top-[-20px] h-24 w-24 rounded-full bg-[#ff6a47]/10 blur-3xl" />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#ff6a47] shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
                  <IconoSpark />
                  Configuración
                </div>
                <h2 className="mt-3 text-[30px] font-extrabold tracking-[-0.04em] text-[#111827]">Ajustes</h2>
              </div>
              <button
                onClick={onCerrar}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#111827] shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition hover:scale-105 active:scale-95"
              >
                <IconoCerrar />
              </button>
            </div>
          </div>

          {/* Listado de Opciones */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="space-y-4">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.link !== "#") navigate(item.link);
                    onCerrar();
                  }}
                  className={`group w-full rounded-[28px] p-5 text-left transition-all hover:translate-y-[-2px] ${
                    item.importante
                      ? "border border-[#ffd7cd] bg-[linear-gradient(135deg,#fff7f4_0%,#fffdfc_100%)] shadow-[0_14px_30px_rgba(255,106,71,0.08)]"
                      : "bg-white shadow-[0_14px_30px_rgba(15,23,42,0.04)]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-[17px] font-bold text-[#111827]">{item.titulo}</h3>
                      <p className="mt-1 text-sm leading-6 text-[#667085]">{item.descripcion}</p>
                    </div>
                    <div className="shrink-0 rounded-2xl bg-[#f8fafc] p-3 text-[#98a2b3] transition-colors group-hover:bg-[#ff6a47] group-hover:text-white">
                      <IconoChevron />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer - Tarjeta de Recomendación */}
          <div className="border-t border-[#edf1f6] bg-white px-4 py-4">
            <div className="rounded-[24px] bg-[#111827] p-5 text-white shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
              <h3 className="text-[18px] font-bold">Perfil al día</h3>
              <p className="mt-1 text-sm text-white/70">Mejora tus rutas personalizadas.</p>
              <button
                onClick={() => { navigate("/perfil/editar"); onCerrar(); }}
                className="mt-4 w-full rounded-xl bg-[#ff6a47] py-3 text-sm font-bold shadow-lg shadow-[#ff6a47]/20"
              >
                Editar ahora
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}