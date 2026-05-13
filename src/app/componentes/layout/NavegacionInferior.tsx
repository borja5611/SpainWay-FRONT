import { Home, Map, Calendar, MessageCircle, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function NavegacionInferior() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Inicio", path: "/inicio" },
    { icon: Map, label: "Mapa", path: "/mapa" },
    { icon: Calendar, label: "Itinerarios", path: "/itinerarios" },
    { icon: MessageCircle, label: "Chat", path: "/chat" },
    { icon: User, label: "Perfil", path: "/perfil" },
  ];

  const isItemActive = (path: string) => {
    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center pointer-events-none">
      <div className="pointer-events-auto w-[92%] max-w-[980px]">
        <div className="mx-auto flex h-[76px] items-center justify-around rounded-[999px] border border-black/5 bg-white/95 px-4 shadow-[0_12px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl">
          {navItems.map((item) => {
            const isActive = isItemActive(item.path);
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex min-w-[62px] flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 transition-all duration-300"
                type="button"
              >
                <Icon
                  className={`h-6 w-6 transition-all duration-300 ${
                    isActive ? "text-[#ff3b30] scale-105" : "text-[#6b7280]"
                  }`}
                  strokeWidth={2}
                />
                <span
                  className={`text-[13px] font-medium transition-all duration-300 ${
                    isActive ? "text-[#ff3b30]" : "text-[#6b7280]"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}