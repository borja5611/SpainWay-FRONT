// src/app/servicios/iaWarmupService.ts
//
// Singleton que gestiona el warm-up del servicio IA en Render.
// Garantiza que nunca haya dos llamadas paralelas y que no se repita
// si ya se hizo correctamente en los últimos 5 minutos.

const API_URL = import.meta.env.VITE_API_URL as string;

const COOLDOWN_MS = 5 * 60 * 1000;

let _isWaking = false;
let _wakePromise: Promise<boolean> | null = null;
let _lastWakeOkAt = 0;

export function isWarmupInProgress(): boolean {
  return _isWaking;
}

export async function warmupIaService(options?: {
  force?: boolean;
  silent?: boolean;
}): Promise<boolean> {
  const force = options?.force === true;
  const now = Date.now();

  if (!force && _lastWakeOkAt > 0 && now - _lastWakeOkAt < COOLDOWN_MS) {
    return true;
  }

  if (_wakePromise) {
    return _wakePromise;
  }

  _isWaking = true;
  _wakePromise = (async (): Promise<boolean> => {
    try {
      await fetch(`${API_URL}/api/health/wake-ia`, {
        method: "GET",
        keepalive: true,
        cache: "no-store",
      });
      _lastWakeOkAt = Date.now();
      return true;
    } catch (error) {
      if (!options?.silent) {
        console.info("[SpainWay] IA warmup falló:", error);
      }
      return false;
    } finally {
      _isWaking = false;
      _wakePromise = null;
    }
  })();

  return _wakePromise;
}
