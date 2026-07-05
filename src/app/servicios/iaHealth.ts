// src/app/servicios/iaHealth.ts
//
// Cliente y modelo de estado del motor de recomendaciones (IA).
//
// El backend expone `/api/health/wake-ia` como un endpoint de ESTADO que
// siempre responde 200 con un envelope controlado. Aquí lo interpretamos a un
// estado de UI sin bloquear nunca la pantalla de crear itinerario.

const API_URL = import.meta.env.VITE_API_URL as string;

export type EstadoIa = "checking" | "ready" | "warming" | "unavailable" | "error";

export type CodigoIa =
  | "IA_READY"
  | "IA_WARMING"
  | "IA_TIMEOUT"
  | "IA_UNAVAILABLE"
  | null;

export type EstadoRecomendador = {
  estado: EstadoIa;
  iaReady: boolean;
  retryable: boolean;
  code: CodigoIa;
  message: string;
  checkedAt: string | null;
};

// Mensajes amables por estado (sin rojos agresivos, sin jerga técnica).
export const MENSAJES_ESTADO_IA: Record<EstadoIa, string> = {
  checking: "Comprobando el motor de recomendaciones…",
  ready: "Motor de recomendaciones listo",
  warming:
    "Estamos preparando el recomendador. Puedes completar el viaje mientras termina de iniciarse.",
  unavailable:
    "El recomendador está tardando más de lo normal en responder. Puedes guardar los datos del viaje y reintentarlo en unos segundos.",
  error:
    "No se ha podido comprobar el estado del recomendador. Revisa tu conexión o inténtalo de nuevo.",
};

// Mensaje específico cuando la generación falla porque la IA aún calienta.
export const MENSAJE_GENERACION_WARMING =
  "El motor de recomendaciones todavía se está iniciando. Tus datos se han conservado; vuelve a intentarlo en unos segundos.";

// Backoff de reintentos automáticos: intento inicial al montar + estos retardos.
// Máximo 5 intentos automáticos; después, botón manual.
export const RETRY_DELAYS_MS = [2000, 5000, 10000, 10000];
export const MAX_INTENTOS_AUTO = 5;

export function delayParaIntento(intentoIndex: number): number {
  const i = Math.min(Math.max(intentoIndex, 0), RETRY_DELAYS_MS.length - 1);
  return RETRY_DELAYS_MS[i];
}

function estadoError(): EstadoRecomendador {
  return {
    estado: "error",
    iaReady: false,
    retryable: true,
    code: "IA_UNAVAILABLE",
    message: MENSAJES_ESTADO_IA.error,
    checkedAt: null,
  };
}

// Normaliza un status devuelto por el backend a un EstadoIa conocido.
function normalizarEstado(valor: unknown): EstadoIa | null {
  if (valor === "ready" || valor === "warming" || valor === "unavailable") {
    return valor;
  }
  return null;
}

/**
 * Interpreta (de forma pura y testeable) el JSON del endpoint wake-ia.
 * Acepta el envelope nuevo `{ ok, data: {...} }` y degrada con seguridad si el
 * cuerpo no tiene la forma esperada.
 */
export function interpretarRespuestaWakeIa(json: unknown): EstadoRecomendador {
  if (!json || typeof json !== "object") return estadoError();

  const root = json as Record<string, unknown>;
  const data =
    root.data && typeof root.data === "object"
      ? (root.data as Record<string, unknown>)
      : root;

  const estado = normalizarEstado(data.status);
  if (!estado) return estadoError();

  const iaReady = data.iaReady === true || estado === "ready";
  const code = (typeof data.code === "string" ? data.code : null) as CodigoIa;
  const message =
    typeof data.message === "string" && data.message.trim()
      ? (data.message as string)
      : MENSAJES_ESTADO_IA[estado];
  const checkedAt =
    typeof data.checkedAt === "string" ? (data.checkedAt as string) : null;

  return {
    estado,
    iaReady,
    retryable: estado !== "ready",
    code,
    message,
    checkedAt,
  };
}

/**
 * Consulta el estado del recomendador. Nunca lanza salvo por cancelación
 * (AbortError), que se propaga para que el llamante la ignore al desmontar.
 */
export async function consultarEstadoRecomendador(
  signal?: AbortSignal,
): Promise<EstadoRecomendador> {
  try {
    const response = await fetch(`${API_URL}/api/health/wake-ia`, {
      method: "GET",
      cache: "no-store",
      signal,
    });

    if (!response.ok) {
      // wake-ia ya no debería devolver no-2xx; si el backend está caído,
      // lo tratamos como error controlado, no como crash.
      return estadoError();
    }

    const json = (await response.json()) as unknown;
    return interpretarRespuestaWakeIa(json);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }
    return estadoError();
  }
}

/**
 * Extrae un código IA_* de un mensaje de error del backend (`apiPost` lanza
 * Error cuyo `.message` incluye el cuerpo JSON del backend). Permite distinguir
 * warming/timeout/unavailable sin perder los datos del formulario.
 */
export function extraerCodigoIaDeError(error: unknown): CodigoIa {
  const texto = error instanceof Error ? error.message : String(error ?? "");
  if (texto.includes("IA_WARMING")) return "IA_WARMING";
  if (texto.includes("IA_TIMEOUT")) return "IA_TIMEOUT";
  if (texto.includes("IA_UNAVAILABLE")) return "IA_UNAVAILABLE";
  return null;
}
