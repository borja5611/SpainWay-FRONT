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

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center pointer-events-none">
      <div className="pointer-events-auto w-[92%] max-w-[980px]">
        <div className="mx-auto flex h-[88px] items-center justify-around rounded-[999px] border border-gray-200 bg-white px-4 shadow-lg backdrop-blur-sm">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path === "/chat" && location.pathname.startsWith("/chat")) ||
              (item.path === "/perfil" && location.pathname.startsWith("/perfil"));

            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex min-w-[62px] flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 transition-all duration-300 hover:bg-gray-50"
                type="button"
              >
                <Icon
                  className={`h-7 w-7 transition-all duration-300 ${
                    isActive 
                      ? "text-red-500 scale-105" 
                      : "text-gray-500"
                  }`}
                  strokeWidth={2}
                />
                <span
                  className={`text-[13px] font-medium transition-all duration-300 ${
                    isActive ? "text-red-500" : "text-gray-500"
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