import { useEffect } from "react";
import NavegacionApp from "@/app/navegacion";
import { warmupIaService } from "@/app/servicios/iaWarmupService";

function App() {
  useEffect(() => {
    void warmupIaService({ force: true, silent: true });

    // Mantiene caliente el servicio IA durante la sesión para evitar el primer fallo de Render.
    const intervalId = window.setInterval(() => {
      void warmupIaService({ silent: true });
    }, 4 * 60 * 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  return <NavegacionApp />;
}

export default App;
