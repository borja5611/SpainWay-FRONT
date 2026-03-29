import { useState } from "react";
import { Outlet } from "react-router-dom";
import NavegacionInferior from "@/app/componentes/layout/NavegacionInferior";
import BotonConfiguracionGlobal from "@/app/componentes/perfil/BotonConfiguracionGlobal";
import MenuConfiguracionGlobal from "@/app/componentes/perfil/MenuConfiguracionGlobal";

export default function LayoutPrincipal() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <BotonConfiguracionGlobal onClick={() => setMenuAbierto(true)} />
      <Outlet />
      <NavegacionInferior />
      <MenuConfiguracionGlobal
        abierto={menuAbierto}
        onCerrar={() => setMenuAbierto(false)}
      />
    </div>
  );
}