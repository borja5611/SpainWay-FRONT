// Traducción de las señales técnicas del recomendador a lenguaje de producto.
// Fuente única usada por la UI de explicabilidad (nunca se muestra jerga interna).

export const FLAG_LABELS: Record<string, string> = {
  sin_dias_vacios: "Sin días vacíos",
  ranking_semantico_activo: "Afinidad semántica activa",
  preferencias_negativas_aplicadas: "Respeta tus exclusiones",
  adaptacion_meteorologica_aplicada: "Adaptado al clima previsto",
  incluye_pois_destacados: "Incluye lugares destacados",
};

export const WEIGHT_LABELS: Record<string, string> = {
  touristic_quality: "Calidad turística",
  editorial_curation: "Curación editorial",
  semantic_affinity: "Afinidad con tus intereses",
  distance_coherence: "Coherencia de ruta",
  territorial_diversity: "Diversidad territorial",
  user_profile_affinity: "Tus preferencias",
  weather_context: "Contexto del clima",
};

/** Devuelve la etiqueta de producto de una bandera de calidad, o null si es desconocida. */
export function translateFlag(flag: string): string | null {
  return FLAG_LABELS[flag] ?? null;
}

/** Convierte el mapa de pesos en pares [etiqueta, valor] ordenados de mayor a menor. */
export function weightEntries(
  weights: Record<string, number> | null | undefined,
): Array<[string, number]> {
  if (!weights) return [];
  return Object.entries(weights)
    .filter(([key]) => key in WEIGHT_LABELS)
    .map(([key, value]) => [WEIGHT_LABELS[key], value] as [string, number])
    .sort((a, b) => b[1] - a[1]);
}
