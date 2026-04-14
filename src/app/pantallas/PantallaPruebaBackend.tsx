import { useEffect, useState } from "react";
import { apiGet } from "../servicios/api";
import { getComunidades, getCategoriasPoi, getFiltrosPoi } from "../servicios/territorio";
import { getPois, getPoisDestacados } from "../servicios/pois";
import { getPreferencias, getUsuarioResumen } from "../servicios/preferencias";
import { getFavoritos } from "../servicios/favoritos";
import { getItinerariosResumen } from "../servicios/itinerarios";
import { getConversaciones } from "../servicios/conversacion";

type HealthResponse = {
  ok: boolean;
  message: string;
};

type EstadoCarga = "idle" | "loading" | "success" | "error";

const ID_USUARIO_PRUEBA = 1;

export default function PantallaPruebaBackend() {
  const [estadoGeneral, setEstadoGeneral] = useState<EstadoCarga>("idle");
  const [errorGeneral, setErrorGeneral] = useState<string>("");

  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [comunidades, setComunidades] = useState<unknown[]>([]);
  const [categorias, setCategorias] = useState<unknown[]>([]);
  const [filtros, setFiltros] = useState<unknown | null>(null);
  const [pois, setPois] = useState<unknown[]>([]);
  const [destacados, setDestacados] = useState<unknown[]>([]);
  const [preferencias, setPreferencias] = useState<unknown | null>(null);
  const [usuarioResumen, setUsuarioResumen] = useState<unknown | null>(null);
  const [favoritos, setFavoritos] = useState<unknown[]>([]);
  const [itinerarios, setItinerarios] = useState<unknown[]>([]);
  const [conversaciones, setConversaciones] = useState<unknown[]>([]);

   async function cargarTodo() {
    setEstadoGeneral("loading");
    setErrorGeneral("");

    const resultados = await Promise.allSettled([
      apiGet<HealthResponse>("/api/health"),
      getComunidades(),
      getCategoriasPoi(),
      getFiltrosPoi(),
      getPois(1, 10),
      getPoisDestacados(10),
      getPreferencias(ID_USUARIO_PRUEBA),
      getUsuarioResumen(ID_USUARIO_PRUEBA),
      getFavoritos(ID_USUARIO_PRUEBA),
      getItinerariosResumen(ID_USUARIO_PRUEBA),
      getConversaciones(ID_USUARIO_PRUEBA),
    ]);

    const [
      healthRes,
      comunidadesRes,
      categoriasRes,
      filtrosRes,
      poisRes,
      destacadosRes,
      preferenciasRes,
      usuarioResumenRes,
      favoritosRes,
      itinerariosRes,
      conversacionesRes,
    ] = resultados;

    const errores: string[] = [];

    if (healthRes.status === "fulfilled") {
      setHealth(healthRes.value);
    } else {
      errores.push(`Health: ${String(healthRes.reason)}`);
      setHealth(null);
    }

    if (comunidadesRes.status === "fulfilled") {
      setComunidades(Array.isArray(comunidadesRes.value) ? comunidadesRes.value : []);
    } else {
      errores.push(`Comunidades: ${String(comunidadesRes.reason)}`);
      setComunidades([]);
    }

    if (categoriasRes.status === "fulfilled") {
      setCategorias(Array.isArray(categoriasRes.value) ? categoriasRes.value : []);
    } else {
      errores.push(`Categorías: ${String(categoriasRes.reason)}`);
      setCategorias([]);
    }

    if (filtrosRes.status === "fulfilled") {
      setFiltros(filtrosRes.value);
    } else {
      errores.push(`Filtros: ${String(filtrosRes.reason)}`);
      setFiltros(null);
    }

    if (poisRes.status === "fulfilled") {
      const poisData = poisRes.value;
      if (
        poisData &&
        typeof poisData === "object" &&
        "data" in poisData &&
        Array.isArray((poisData as { data: unknown[] }).data)
      ) {
        setPois((poisData as { data: unknown[] }).data);
      } else {
        setPois([]);
      }
    } else {
      errores.push(`POIs: ${String(poisRes.reason)}`);
      setPois([]);
    }

    if (destacadosRes.status === "fulfilled") {
      setDestacados(Array.isArray(destacadosRes.value) ? destacadosRes.value : []);
    } else {
      errores.push(`Destacados: ${String(destacadosRes.reason)}`);
      setDestacados([]);
    }

    if (preferenciasRes.status === "fulfilled") {
      setPreferencias(preferenciasRes.value);
    } else {
      errores.push(`Preferencias: ${String(preferenciasRes.reason)}`);
      setPreferencias(null);
    }

    if (usuarioResumenRes.status === "fulfilled") {
      setUsuarioResumen(usuarioResumenRes.value);
    } else {
      errores.push(`Usuario resumen: ${String(usuarioResumenRes.reason)}`);
      setUsuarioResumen(null);
    }

    if (favoritosRes.status === "fulfilled") {
      setFavoritos(Array.isArray(favoritosRes.value) ? favoritosRes.value : []);
    } else {
      errores.push(`Favoritos: ${String(favoritosRes.reason)}`);
      setFavoritos([]);
    }

    if (itinerariosRes.status === "fulfilled") {
      setItinerarios(Array.isArray(itinerariosRes.value) ? itinerariosRes.value : []);
    } else {
      errores.push(`Itinerarios: ${String(itinerariosRes.reason)}`);
      setItinerarios([]);
    }

    if (conversacionesRes.status === "fulfilled") {
      setConversaciones(Array.isArray(conversacionesRes.value) ? conversacionesRes.value : []);
    } else {
      errores.push(`Conversaciones: ${String(conversacionesRes.reason)}`);
      setConversaciones([]);
    }

    if (errores.length > 0) {
      setEstadoGeneral("error");
      setErrorGeneral(errores.join(" | "));
    } else {
      setEstadoGeneral("success");
    }
  }

    useEffect(() => {
    const fetchDatos = async () => {
        await cargarTodo(); 
    };
    
    fetchDatos();
    }, []);
  return (
    <div
      style={{
        padding: "24px",
        fontFamily: "Arial, sans-serif",
        background: "#f7f7f8",
        minHeight: "100vh",
        color: "#111827",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1 style={{ marginBottom: "8px" }}>Pantalla de prueba Backend ↔ Front</h1>
        <p style={{ marginTop: 0, color: "#4b5563" }}>
          Esta pantalla sirve para comprobar que el frontend consume correctamente los endpoints del backend.
        </p>

        <div style={{ marginBottom: "20px" }}>
          <button
            onClick={() => void cargarTodo()}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "none",
              background: "#111827",
              color: "white",
              cursor: "pointer",
            }}
          >
            Recargar datos
          </button>
        </div>

        <div
          style={{
            padding: "16px",
            borderRadius: "12px",
            background: "white",
            border: "1px solid #e5e7eb",
            marginBottom: "20px",
          }}
        >
          <strong>Estado general:</strong>{" "}
          {estadoGeneral === "idle" && "Idle"}
          {estadoGeneral === "loading" && "Cargando..."}
          {estadoGeneral === "success" && "Correcto"}
          {estadoGeneral === "error" && "Error"}
          {errorGeneral && (
            <div style={{ marginTop: "8px", color: "#b91c1c" }}>
              <strong>Error:</strong> {errorGeneral}
            </div>
          )}
        </div>

        <Seccion titulo="Health / API">
          <pre style={estiloPre}>{JSON.stringify(health, null, 2)}</pre>
        </Seccion>

        <Seccion titulo="Comunidades">
          <p>Total: {comunidades.length}</p>
          <pre style={estiloPre}>{JSON.stringify(comunidades.slice(0, 5), null, 2)}</pre>
        </Seccion>

        <Seccion titulo="Categorías POI">
          <p>Total: {categorias.length}</p>
          <pre style={estiloPre}>{JSON.stringify(categorias.slice(0, 5), null, 2)}</pre>
        </Seccion>

        <Seccion titulo="Filtros POI">
          <pre style={estiloPre}>{JSON.stringify(filtros, null, 2)}</pre>
        </Seccion>

        <Seccion titulo="POIs paginados">
          <p>Total cargados en pantalla: {pois.length}</p>
          <pre style={estiloPre}>{JSON.stringify(pois.slice(0, 3), null, 2)}</pre>
        </Seccion>

        <Seccion titulo="POIs destacados">
          <p>Total cargados en pantalla: {destacados.length}</p>
          <pre style={estiloPre}>{JSON.stringify(destacados.slice(0, 3), null, 2)}</pre>
        </Seccion>

        <Seccion titulo={`Preferencias usuario ${ID_USUARIO_PRUEBA}`}>
          <pre style={estiloPre}>{JSON.stringify(preferencias, null, 2)}</pre>
        </Seccion>

        <Seccion titulo={`Resumen usuario ${ID_USUARIO_PRUEBA}`}>
          <pre style={estiloPre}>{JSON.stringify(usuarioResumen, null, 2)}</pre>
        </Seccion>

        <Seccion titulo={`Favoritos usuario ${ID_USUARIO_PRUEBA}`}>
          <p>Total: {favoritos.length}</p>
          <pre style={estiloPre}>{JSON.stringify(favoritos.slice(0, 3), null, 2)}</pre>
        </Seccion>

        <Seccion titulo={`Itinerarios resumen usuario ${ID_USUARIO_PRUEBA}`}>
          <p>Total: {itinerarios.length}</p>
          <pre style={estiloPre}>{JSON.stringify(itinerarios.slice(0, 3), null, 2)}</pre>
        </Seccion>

        <Seccion titulo={`Conversaciones usuario ${ID_USUARIO_PRUEBA}`}>
          <p>Total: {conversaciones.length}</p>
          <pre style={estiloPre}>{JSON.stringify(conversaciones.slice(0, 3), null, 2)}</pre>
        </Seccion>
      </div>
    </div>
  );
}

function Seccion({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        marginBottom: "20px",
        padding: "16px",
        borderRadius: "12px",
        background: "white",
        border: "1px solid #e5e7eb",
      }}
    >
      <h2 style={{ marginTop: 0, fontSize: "18px" }}>{titulo}</h2>
      {children}
    </section>
  );
}

const estiloPre: React.CSSProperties = {
  background: "#111827",
  color: "#e5e7eb",
  padding: "12px",
  borderRadius: "10px",
  overflowX: "auto",
  fontSize: "13px",
  lineHeight: 1.5,
};