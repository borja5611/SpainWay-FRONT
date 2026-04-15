import { useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import NavegacionInferior from "@/app/componentes/layout/NavegacionInferior";
import MenuConfiguracionGlobal from "@/app/componentes/perfil/MenuConfiguracionGlobal";
import BarraSuperior from "@/app/componentes/layout/BarraSuperior";

export default function LayoutPrincipal() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const headerConfig = useMemo(() => {
    const pathname = location.pathname;

    if (pathname.startsWith("/inicio")) {
      return {
        titulo: "SpainWay",
        subtitulo:
          "Explora ciudades, descubre lugares únicos y crea viajes personalizados",
        mostrarBotonVolver: false,
        fallback: "/inicio",
      };
    }

    if (pathname.startsWith("/selector-destino")) {
      return {
        titulo: "Destino",
        subtitulo: "Selecciona el punto de partida de tu viaje",
        mostrarBotonVolver: true,
        fallback: "/inicio",
      };
    }

    if (pathname.startsWith("/mapa")) {
      return {
        titulo: "Mapa",
        subtitulo: "Explora puntos de interés y lugares destacados",
        mostrarBotonVolver: true,
        fallback: "/inicio",
      };
    }

    if (pathname.startsWith("/poi/")) {
      return {
        titulo: "Detalle del lugar",
        subtitulo: "Consulta toda la información del punto de interés",
        mostrarBotonVolver: true,
        fallback: "/mapa",
      };
    }

    if (pathname.startsWith("/itinerarios/crear")) {
      return {
        titulo: "Crear itinerario",
        subtitulo: "Prepara una nueva ruta personalizada",
        mostrarBotonVolver: true,
        fallback: "/itinerarios",
      };
    }

    if (pathname.startsWith("/itinerarios/detalle")) {
      return {
        titulo: "Detalle del itinerario",
        subtitulo: "Consulta y ajusta tu viaje guardado",
        mostrarBotonVolver: true,
        fallback: "/itinerarios",
      };
    }

    if (pathname.startsWith("/itinerarios")) {
      return {
        titulo: "Itinerarios",
        subtitulo: "Consulta y organiza tus viajes guardados",
        mostrarBotonVolver: true,
        fallback: "/inicio",
      };
    }

    if (pathname.startsWith("/calendario")) {
      return {
        titulo: "Calendario",
        subtitulo: "Visualiza tu agenda y eventos sugeridos",
        mostrarBotonVolver: true,
        fallback: "/itinerarios",
      };
    }

    if (pathname.startsWith("/chat")) {
      return {
        titulo: "Asistente",
        subtitulo: "Crea tu viaje ideal paso a paso",
        mostrarBotonVolver: true,
        fallback: "/inicio",
      };
    }

    if (pathname.startsWith("/perfil/editar")) {
      return {
        titulo: "Editar perfil",
        subtitulo: "Actualiza tus datos y preferencias",
        mostrarBotonVolver: true,
        fallback: "/perfil",
      };
    }

    if (pathname.startsWith("/perfil")) {
      return {
        titulo: "Perfil",
        subtitulo: "Gestiona tu cuenta y tus preferencias",
        mostrarBotonVolver: true,
        fallback: "/inicio",
      };
    }

    return {
      titulo: "SpainWay",
      subtitulo: "",
      mostrarBotonVolver: true,
      fallback: "/inicio",
    };
  }, [location.pathname]);

  function handleVolver() {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(headerConfig.fallback);
  }

  return (
    <div className="min-h-screen bg-[#f6f6f3]">
      <BarraSuperior
        titulo={headerConfig.titulo}
        subtitulo={headerConfig.subtitulo}
        mostrarBotonVolver={headerConfig.mostrarBotonVolver}
        onVolver={handleVolver}
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