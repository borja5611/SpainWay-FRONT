import { RouterProvider } from "react-router-dom";
import { router } from "./rutas.tsx";

export default function NavegacionApp() {
  return <RouterProvider router={router} />;
}