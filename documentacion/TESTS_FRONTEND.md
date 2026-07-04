# Pruebas del frontend

## Infraestructura

Se usa **Vitest** (runner de pruebas nativo del ecosistema Vite, dependencia de
desarrollo). Integra con `vite.config.ts` y el alias `@`.

`package.json`:

```json
{
  "scripts": {
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "test": "vitest run"
  }
}
```

Los archivos `*.test.ts` se excluyen de la compilación de producción
(`tsconfig.app.json` → `exclude`).

## Cobertura actual

`src/lib/insightLabels.test.ts` (6 tests) valida la capa de traducción de la
explicabilidad y el helper de estilos:

| Test | Qué garantiza |
|------|---------------|
| Traducción de banderas conocidas | `sin_dias_vacios` → «Sin días vacíos», etc. |
| Banderas desconocidas → `null` | No se filtra jerga cruda a la UI. |
| Etiquetas sin jerga prohibida | Ninguna etiqueta contiene `llm`/`chatgpt`/`openai`/`tfg`. |
| Orden de pesos | Criterios ordenados de mayor a menor. |
| Pesos desconocidos ignorados | Robustez ante claves nuevas. |
| `cn()` | Resuelve conflictos de clases Tailwind. |

## Comandos

```bash
npm install
npm run build     # tsc -b && vite build (exit 0)
npm test          # vitest run — 6 tests OK
npm run lint      # eslint — 0 errores (warnings preexistentes no bloqueantes)
```

## Estado de lint

- **0 errores** (se corrigió un error preexistente de `no-empty-object-type` en
  `src/imports/SocialMedia.tsx`).
- **10 warnings** preexistentes (`react-hooks/exhaustive-deps`) en pantallas ya
  existentes, no bloqueantes. Se documentan como deuda técnica menor; ningún
  componente nuevo del sistema de diseño genera warnings.

## Ampliaciones recomendadas (futuro)

- Tests de componentes con `@testing-library/react` + `jsdom`.
- Test de render de `ItineraryInsightCard` con un `insight` simulado.

## Evidencia para la memoria

- Salida de `npm test` (6 passing) y `npm run build` (exit 0).
- Salida de `npm run lint` (0 errores).
