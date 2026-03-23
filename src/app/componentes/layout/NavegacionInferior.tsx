import { Home, Map, Route, MessageCircle, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { RUTAS_APP } from "@/app/utilidades/rutas";

const items = [
  { label: "Inicio", to: RUTAS_APP.inicio, icon: Home },
  { label: "Mapa", to: RUTAS_APP.mapa, icon: Map },
  { label: "Itinerarios", to: RUTAS_APP.itinerarios, icon: Route },
  { label: "Chat", to: RUTAS_APP.chat, icon: MessageCircle },
  { label: "Perfil", to: RUTAS_APP.perfil, icon: User },
];

export default function NavegacionInferior() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-md items-center justify-between px-3 py-2">
        {items.map(({ label, to, icon: Icono }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                "flex min-w-[58px] flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] transition",
                isActive ? "text-blue-600" : "text-gray-500 hover:text-gray-800"
              )
            }
          >
            <Icono size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}