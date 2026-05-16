import { Navigate } from "react-router-dom";
import { RUTAS_APP } from "@/app/utilidades/rutas";

export default function SplashPantalla() {
  return <Navigate to={RUTAS_APP.login} replace />;
}
