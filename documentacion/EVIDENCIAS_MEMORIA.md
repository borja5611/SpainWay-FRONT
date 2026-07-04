# Evidencias para la memoria — Frontend

## 1. Comandos que generan evidencia

```bash
npm install
npm run build     # tsc -b && vite build (exit 0)
npm test          # vitest run — 6 tests OK
npm run lint      # eslint — 0 errores
```

## 2. Capturas recomendadas

| # | Captura | Sirve para |
|---|---------|------------|
| 1 | Detalle de itinerario con `TrustPanel` + `ItineraryInsightCard` | Cap. 3, Anexo E |
| 2 | `ScheduleTimeline` (plan horario del día) | Anexo G |
| 3 | `LoadingJourney` (5 pasos) durante la generación | Cap. 3 |
| 4 | Chips de métricas / `StatusPill` de calidad | Cap. 3 |
| 5 | Toast de éxito (favoritos) | Cap. 3 |
| 6 | Estado vacío / error (EmptyState / ErrorState) | Cap. 4 |
| 7 | `theme.css` con el token coral y sombras | Anexo (sistema de diseño) |
| 8 | `npm test` (6 passing) + `npm run lint` (0 errores) | Anexo H |

## 3. Antes vs después (para justificar el salto visual)

| Aspecto | Antes | Después |
|---------|-------|---------|
| Coral | inline `#ff5a36` (deriva de tonos) | token `coral` en Tailwind v4 |
| Estados | loaders de texto / JSX inline | primitivas reutilizables + toasts |
| Explicabilidad | sin superficie | `TrustPanel` + `ItineraryInsightCard` + `ScheduleTimeline` |
| Carga del viaje | barras estáticas | `LoadingJourney` guiado (5 pasos) |
| Copy | «motor IA del TFG» visible | copy de producto, 0 términos prohibidos |

## 4. Frases técnicas defendibles

> «El frontend traduce la traza de decisión del recomendador (`decision_trace`,
> `score_breakdown`, `schedule`, `route_metrics`) en una experiencia premium y
> explicable, sin mostrar JSON en bruto ni jerga técnica, con un sistema de
> diseño coherente basado en tokens.»

## 5. Verificación de copy prohibido

```bash
grep -rniE "\bLLM\b|ChatGPT|OpenAI|\bTFG\b|defensa|tribunal|no genera|no inventa" src
# 0 coincidencias en runtime
```

Ver `COPY_PRODUCTO.md`.

## 6. Apartados de la memoria que respalda el frontend

- **Capítulo 3 (Desarrollo)** — sistema de diseño, itinerario explicable, estados.
- **Capítulo 4 (Discusión)** — UX premium, decisiones de copy, rendimiento.
- **Anexo E (API)** — consumo del contrato IA (tipos extendidos, servicio de
  auditoría).
- **Anexo H (Pruebas)** — build, tests, lint.

Consulta también `SISTEMA_DISENO.md`, `ITINERARIO_EXPLICABLE.md`,
`COMPONENTES_UI.md`, `ESTADOS_REACTIVOS.md` y `COPY_PRODUCTO.md`.
