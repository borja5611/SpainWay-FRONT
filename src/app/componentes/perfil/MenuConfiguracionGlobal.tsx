import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "@/app/servicios/auth";
import { useAuthStore } from "@/app/store/useAuthStore";

type Props = {
  abierto: boolean;
  onCerrar?: () => void;
  onClose?: () => void;
};

type ModalTipo = "app" | "ayuda" | "acerca" | null;

type Grupo = {
  label: string;
  items: {
    id: string;
    titulo: string;
    danger?: boolean;
  }[];
};

const STORAGE_FONT = "spainway_font_scale";
const STORAGE_COMPACT = "spainway_compact_mode";

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

function aplicarPreferenciasVisuales(fontScale: string, compactMode: boolean) {
  const root = document.documentElement;
  root.style.fontSize = fontScale === "grande" ? "17px" : fontScale === "pequena" ? "15px" : "16px";
  root.dataset.spainwayCompact = compactMode ? "1" : "0";
}

export default function MenuConfiguracionGlobal({ abierto, onCerrar, onClose }: Props) {
  const cerrarPanel = onCerrar ?? onClose ?? (() => undefined);
  const navigate = useNavigate();
  const { cerrarSesion } = useAuthStore();

  const [cerrandoSesion, setCerrandoSesion] = useState(false);
  const [modalTipo, setModalTipo] = useState<ModalTipo>(null);
  const [fontScale, setFontScale] = useState(() => localStorage.getItem(STORAGE_FONT) || "normal");
  const [compactMode, setCompactMode] = useState(() => localStorage.getItem(STORAGE_COMPACT) === "1");

  useEffect(() => {
    aplicarPreferenciasVisuales(fontScale, compactMode);
    localStorage.setItem(STORAGE_FONT, fontScale);
    localStorage.setItem(STORAGE_COMPACT, compactMode ? "1" : "0");
  }, [fontScale, compactMode]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrarPanel();
    };
    if (abierto) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [abierto, cerrarPanel]);

  async function handleCerrarSesion() {
    try {
      setCerrandoSesion(true);
      await logout();
    } catch (e) {
      console.error(e);
    } finally {
      cerrarSesion();
      cerrarPanel();
      navigate("/login");
      setCerrandoSesion(false);
    }
  }

  async function handleClick(id: string) {
    switch (id) {
      case "perfil":
        cerrarPanel();
        navigate("/perfil");
        break;
      case "calendario":
        cerrarPanel();
        navigate("/calendario");
        break;
      case "itinerarios":
        cerrarPanel();
        navigate("/itinerarios");
        break;
      case "app":
        setModalTipo("app");
        break;
      case "ayuda":
        setModalTipo("ayuda");
        break;
      case "acerca":
        setModalTipo("acerca");
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
        { id: "calendario", titulo: "Calendario" },
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
      <div className={`fixed inset-0 z-[120] transition-all duration-300 ${abierto ? "visible" : "invisible"}`}>
        <div
          className={`absolute inset-0 bg-[#0f172a]/30 backdrop-blur-[2px] transition-opacity duration-300 ${abierto ? "opacity-100" : "opacity-0"}`}
          onClick={cerrarPanel}
        />

        <aside
          className={`absolute right-0 top-0 h-full w-full max-w-[380px] transform bg-[#f2f2f7] shadow-[-12px_0_32px_rgba(15,23,42,0.14)] transition-transform duration-300 ease-out ${
            abierto ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-[#e5e5ea] bg-[#f2f2f7] px-5 pb-4 pt-14">
              <h2 className="text-[22px] font-bold text-[#111827]">Ajustes</h2>
              <button
                onClick={cerrarPanel}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e5e5ea] text-[#6b7280] transition hover:bg-[#d1d1d6] active:scale-95"
              >
                <IconoCerrar />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-8 pt-6">
              <div className="space-y-6">
                {grupos.map((grupo) => (
                  <div key={grupo.label}>
                    <p className="mb-1 px-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#8e8e93]">
                      {grupo.label}
                    </p>

                    <div className="overflow-hidden rounded-[14px] bg-white">
                      {grupo.items.map((item, index) => (
                        <div key={item.id}>
                          <button
                            onClick={() => void handleClick(item.id)}
                            disabled={item.id === "logout" && cerrandoSesion}
                            className={`flex w-full items-center justify-between px-4 py-[14px] text-left transition-colors active:bg-[#f2f2f7] ${
                              item.danger ? "text-[#e53935]" : "text-[#111827]"
                            } ${item.id === "logout" && cerrandoSesion ? "cursor-not-allowed opacity-50" : "hover:bg-[#f9f9f9]"}`}
                          >
                            <span className="text-[16px] font-medium">{item.titulo}</span>
                            {!item.danger && <IconoChevron />}
                          </button>
                          {index < grupo.items.length - 1 && <div className="ml-4 border-b border-[#f0f0f0]" />}
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

      {modalTipo && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/45 px-6 backdrop-blur-sm" onClick={() => setModalTipo(null)}>
          <div className="w-full max-w-[360px] rounded-[28px] bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff5a36]">SpainWay</p>
                <h3 className="mt-2 text-[21px] font-black tracking-[-0.03em] text-[#111827]">
                  {modalTipo === "app" ? "Ajustes de la app" : modalTipo === "ayuda" ? "Ayuda" : "Acerca de SpainWay"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalTipo(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f4f6] text-[#667085]"
              >
                <IconoCerrar />
              </button>
            </div>

            {modalTipo === "app" && (
              <div className="space-y-4">
                <div className="rounded-[22px] border border-[#eef2f7] bg-[#f8fafc] p-4">
                  <div>
                    <p className="text-[16px] font-black text-[#111827]">Tamaño de letra</p>
                    <p className="mt-1 text-[13px] leading-5 text-[#667085]">Ajusta la lectura de la app sin cambiar el diseño general.</p>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {[
                      ["pequena", "Pequeña", "A"],
                      ["normal", "Normal", "Aa"],
                      ["grande", "Grande", "Aa+"],
                    ].map(([value, label, sample]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setFontScale(value)}
                        className={`rounded-[18px] border px-2 py-3 text-center transition ${
                          fontScale === value
                            ? "border-[#ff5a36] bg-[#ff5a36] text-white shadow-[0_10px_24px_rgba(255,90,54,0.22)]"
                            : "border-[#e5e7eb] bg-white text-[#344054]"
                        }`}
                      >
                        <span className="block text-[17px] font-black leading-5">{sample}</span>
                        <span className="mt-1 block text-[11px] font-bold">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[22px] border border-[#eef2f7] bg-white p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[16px] font-black text-[#111827]">Vista compacta</p>
                      <p className="mt-1 text-[13px] leading-5 text-[#667085]">Reduce espacios en pantallas largas. Recomendado para móvil pequeño.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCompactMode((prev) => !prev)}
                      aria-pressed={compactMode}
                      className={`relative h-9 w-[62px] shrink-0 rounded-full border p-1 transition ${
                        compactMode ? "border-[#ff5a36] bg-[#ff5a36]" : "border-[#d0d5dd] bg-[#f2f4f7]"
                      }`}
                    >
                      <span
                        className={`block h-7 w-7 rounded-full bg-white shadow-sm transition ${
                          compactMode ? "translate-x-[26px]" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="mt-4 rounded-[18px] bg-[#f8fafc] p-3">
                    <div className={`rounded-2xl bg-white p-3 shadow-sm ${compactMode ? "space-y-1" : "space-y-2"}`}>
                      <p className="text-[13px] font-black text-[#111827]">Vista previa</p>
                      <p className="text-[12px] leading-5 text-[#667085]">Así se separan títulos, descripciones y acciones.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {modalTipo === "ayuda" && (
              <div className="space-y-3 text-sm leading-6 text-[#667085]">
                <p><strong className="text-[#111827]">Inicio:</strong> elige una comunidad y entra al mapa con ese destino preparado.</p>
                <p><strong className="text-[#111827]">Mapa:</strong> revisa POIs, abre detalles, céntralos en el mapa o consúltalos en Google.</p>
                <p><strong className="text-[#111827]">Itinerarios:</strong> crea rutas usando destino, zona base, fechas y preferencias reales.</p>
              </div>
            )}

            {modalTipo === "acerca" && (
              <div className="space-y-3 text-sm leading-6 text-[#667085]">
                <p>
                  SpainWay es una aplicación de planificación turística centrada en explorar destinos españoles, guardar lugares relevantes y crear itinerarios personalizados.
                </p>
                <p>
                  Esta versión prioriza navegación clara, mapa interactivo, POIs destacados y un flujo de generación de viajes preparado para integrarse con el motor IA del TFG.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setModalTipo(null)}
              className="mt-6 w-full rounded-2xl bg-[#ff5a36] py-3 text-[15px] font-semibold text-white transition hover:bg-[#e85a38] active:scale-[0.98]"
            >
              Guardar y cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
