import { Outlet } from "react-router-dom";
import NavegacionInferior from "@/app/componentes/layout/NavegacionInferior";

export default function LayoutPrincipal() {
  return (
    <div className="min-h-screen bg-white">
      <Outlet />
      <NavegacionInferior />
    </div>
    
  );
  
}