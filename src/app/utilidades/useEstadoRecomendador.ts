// src/app/utilidades/useEstadoRecomendador.ts
//
// Hook que gestiona el estado del motor de recomendaciones sin bloquear la UI:
//   - Lanza una comprobación al montar (en segundo plano).
//   - Reintenta con backoff (2s, 5s, 10s, 10s) hasta MAX_INTENTOS_AUTO.
//   - Cancela con AbortController al desmontar y limpia timers.
//   - No hace polling infinito: al agotar los intentos automáticos, para y deja
//     un botón manual de reintento.

import { useCallback, useEffect, useRef, useState } from "react";
import {
  consultarEstadoRecomendador,
  delayParaIntento,
  MAX_INTENTOS_AUTO,
  MENSAJES_ESTADO_IA,
  type EstadoRecomendador,
} from "@/app/servicios/iaHealth";

const ESTADO_INICIAL: EstadoRecomendador = {
  estado: "checking",
  iaReady: false,
  retryable: true,
  code: null,
  message: MENSAJES_ESTADO_IA.checking,
  checkedAt: null,
};

export type UseEstadoRecomendador = {
  estadoRecomendador: EstadoRecomendador;
  intentos: number;
  autoAgotado: boolean;
  reintentar: () => void;
};

export function useEstadoRecomendador(): UseEstadoRecomendador {
  const [estadoRecomendador, setEstadoRecomendador] =
    useState<EstadoRecomendador>(ESTADO_INICIAL);
  const [intentos, setIntentos] = useState(0);
  const [autoAgotado, setAutoAgotado] = useState(false);

  const montadoRef = useRef(true);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<number | null>(null);
  const intentoRef = useRef(0);
  // Referencia estable a la propia función para el reintento recursivo, sin
  // auto-referenciarla dentro de su declaración.
  const ejecutarChequeoRef = useRef<() => void>(() => {});

  const limpiarTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const ejecutarChequeo = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // No pisamos el chip verde con "comprobando" si ya estaba listo.
    setEstadoRecomendador((prev) =>
      prev.estado === "ready"
        ? prev
        : { ...prev, estado: "checking", message: MENSAJES_ESTADO_IA.checking },
    );

    try {
      const resultado = await consultarEstadoRecomendador(controller.signal);
      if (!montadoRef.current) return;

      setEstadoRecomendador(resultado);

      if (resultado.estado === "ready") {
        setAutoAgotado(true); // no hacen falta más reintentos
        return;
      }

      const siguiente = intentoRef.current + 1;
      if (siguiente >= MAX_INTENTOS_AUTO) {
        setAutoAgotado(true);
        return;
      }

      const delay = delayParaIntento(intentoRef.current);
      intentoRef.current = siguiente;
      setIntentos(siguiente);
      limpiarTimer();
      timerRef.current = window.setTimeout(() => {
        ejecutarChequeoRef.current();
      }, delay);
    } catch {
      // AbortError al desmontar / reintento manual: se ignora sin tocar estado.
    }
  }, [limpiarTimer]);

  // Mantiene la referencia recursiva siempre apuntando a la última versión.
  useEffect(() => {
    ejecutarChequeoRef.current = () => {
      void ejecutarChequeo();
    };
  }, [ejecutarChequeo]);

  const reintentar = useCallback(() => {
    limpiarTimer();
    intentoRef.current = 0;
    setIntentos(0);
    setAutoAgotado(false);
    void ejecutarChequeo();
  }, [ejecutarChequeo, limpiarTimer]);

  useEffect(() => {
    montadoRef.current = true;
    // Lanzamos el primer chequeo en el siguiente tick para no ejecutar setState
    // de forma síncrona dentro del efecto (evita renders en cascada).
    const kickoff = window.setTimeout(() => {
      ejecutarChequeoRef.current();
    }, 0);

    return () => {
      montadoRef.current = false;
      abortRef.current?.abort();
      limpiarTimer();
      window.clearTimeout(kickoff);
    };
  }, [limpiarTimer]);

  return { estadoRecomendador, intentos, autoAgotado, reintentar };
}
