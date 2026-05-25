import { useEffect } from "react";
import NavegacionApp from "@/app/navegacion";
import { despertarServicioIA } from "@/app/servicios/auth";

function App() {
  useEffect(() => {
    void despertarServicioIA({ force: true });

    // Mantiene caliente el servicio IA durante la sesión para evitar el primer fallo de Render.
    const intervalId = window.setInterval(() => {
      void despertarServicioIA();
    }, 4 * 60 * 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  return <NavegacionApp />;
}

export default App;
