import { describe, it, expect } from "vitest";
import {
  interpretarRespuestaWakeIa,
  extraerCodigoIaDeError,
  delayParaIntento,
  RETRY_DELAYS_MS,
  MAX_INTENTOS_AUTO,
  MENSAJES_ESTADO_IA,
} from "./iaHealth";

describe("interpretarRespuestaWakeIa", () => {
  it("mapea el envelope ready a estado listo", () => {
    const r = interpretarRespuestaWakeIa({
      ok: true,
      data: {
        status: "ready",
        iaReady: true,
        retryable: false,
        code: "IA_READY",
        message: "Motor de recomendaciones disponible",
        checkedAt: "2026-01-01T00:00:00.000Z",
      },
    });
    expect(r.estado).toBe("ready");
    expect(r.iaReady).toBe(true);
    expect(r.retryable).toBe(false);
  });

  it("mapea warming como estado no bloqueante y retryable", () => {
    const r = interpretarRespuestaWakeIa({
      ok: true,
      data: { status: "warming", iaReady: false, code: "IA_WARMING" },
    });
    expect(r.estado).toBe("warming");
    expect(r.iaReady).toBe(false);
    expect(r.retryable).toBe(true);
    // Sin message del backend, usa el copy amable por defecto (nunca vacío).
    expect(r.message).toBe(MENSAJES_ESTADO_IA.warming);
  });

  it("mapea unavailable (timeout) manteniendo el código", () => {
    const r = interpretarRespuestaWakeIa({
      ok: true,
      data: { status: "unavailable", code: "IA_TIMEOUT" },
    });
    expect(r.estado).toBe("unavailable");
    expect(r.code).toBe("IA_TIMEOUT");
    expect(r.retryable).toBe(true);
  });

  it("degrada a error controlado si el cuerpo no tiene forma válida", () => {
    expect(interpretarRespuestaWakeIa(null).estado).toBe("error");
    expect(interpretarRespuestaWakeIa({ foo: 1 }).estado).toBe("error");
    expect(interpretarRespuestaWakeIa({ data: { status: "raro" } }).estado).toBe("error");
  });
});

describe("extraerCodigoIaDeError", () => {
  it("detecta el código IA_* dentro del mensaje de error del backend", () => {
    expect(
      extraerCodigoIaDeError(
        new Error("Error POST /api/recomendador/generar: 503. IA_WARMING ..."),
      ),
    ).toBe("IA_WARMING");
    expect(extraerCodigoIaDeError(new Error("... IA_TIMEOUT ..."))).toBe("IA_TIMEOUT");
    expect(extraerCodigoIaDeError(new Error("boom"))).toBeNull();
  });
});

describe("backoff de reintentos", () => {
  it("sigue la progresión 2s, 5s, 10s y luego se mantiene", () => {
    expect(delayParaIntento(0)).toBe(2000);
    expect(delayParaIntento(1)).toBe(5000);
    expect(delayParaIntento(2)).toBe(10000);
    // Fuera de rango: se queda en el último valor, sin romper.
    expect(delayParaIntento(99)).toBe(RETRY_DELAYS_MS[RETRY_DELAYS_MS.length - 1]);
  });

  it("no hace polling infinito: como máximo 5 intentos automáticos", () => {
    expect(MAX_INTENTOS_AUTO).toBe(5);
  });
});
