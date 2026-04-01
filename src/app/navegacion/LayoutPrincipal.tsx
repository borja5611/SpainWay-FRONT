import { useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavegacionInferior from "@/app/componentes/layout/NavegacionInferior";
import MenuConfiguracionGlobal from "@/app/componentes/perfil/MenuConfiguracionGlobal";
import BarraSuperior from "@/app/componentes/layout/BarraSuperior";

export default function LayoutPrincipal() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const location = useLocation();

  const headerConfig = useMemo(() => {
    const pathname = location.pathname;

    if (pathname.startsWith("/inicio")) {
      return {
        titulo: "SpainWay",
        subtitulo:
          "Explora ciudades, descubre lugares únicos y crea viajes personalizados",
      };
    }

    if (pathname.startsWith("/mapa")) {
      return {
        titulo: "Mapa",
        subtitulo: "Explora puntos de interés y lugares destacados",
      };
    }

    if (pathname.startsWith("/itinerarios")) {
      return {
        titulo: "Itinerarios",
        subtitulo: "Consulta y organiza tus viajes guardados",
      };
    }

    if (pathname.startsWith("/calendario")) {
      return {
        titulo: "Calendario",
        subtitulo: "Visualiza tu agenda y eventos sugeridos",
      };
    }

    if (pathname.startsWith("/chat")) {
      return {
        titulo: "Asistente",
        subtitulo: "Crea tu viaje ideal paso a paso",
      };
    }

    if (pathname.startsWith("/perfil")) {
      return {
        titulo: "Perfil",
        subtitulo: "Gestiona tu cuenta y tus preferencias",
      };
    }

    return {
      titulo: "SpainWay",
      subtitulo: "",
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#f6f6f3]">
      <BarraSuperior
        titulo={headerConfig.titulo}
        subtitulo={headerConfig.subtitulo}
        onAbrirConfiguracion={() => setMenuAbierto(true)}
      />

      <Outlet />

      <NavegacionInferior />

      <MenuConfiguracionGlobal
        abierto={menuAbierto}
        onCerrar={() => setMenuAbierto(false)}
      />
    </div>
  );
}