import { describe, it, expect } from "vitest";
import { translateFlag, weightEntries, FLAG_LABELS } from "./insightLabels";
import { cn } from "./cn";

describe("insightLabels", () => {
  it("traduce banderas conocidas a lenguaje de producto", () => {
    expect(translateFlag("sin_dias_vacios")).toBe("Sin días vacíos");
    expect(translateFlag("ranking_semantico_activo")).toBe("Afinidad semántica activa");
  });

  it("devuelve null para banderas desconocidas (no filtra jerga cruda)", () => {
    expect(translateFlag("clave_interna_desconocida")).toBeNull();
  });

  it("no expone jerga técnica prohibida en las etiquetas", () => {
    const prohibidas = ["llm", "chatgpt", "openai", "tfg"];
    for (const label of Object.values(FLAG_LABELS)) {
      for (const bad of prohibidas) {
        expect(label.toLowerCase()).not.toContain(bad);
      }
    }
  });

  it("ordena los pesos de mayor a menor y traduce las claves", () => {
    const entries = weightEntries({ semantic_affinity: 0.55, touristic_quality: 1.0 });
    expect(entries[0][0]).toBe("Calidad turística");
    expect(entries[0][1]).toBeGreaterThan(entries[1][1]);
  });

  it("ignora pesos desconocidos", () => {
    expect(weightEntries({ clave_rara: 5 })).toHaveLength(0);
    expect(weightEntries(null)).toHaveLength(0);
  });
});

describe("cn", () => {
  it("combina clases y resuelve conflictos de Tailwind", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("a", false, "b")).toBe("a b");
  });
});
