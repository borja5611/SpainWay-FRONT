# Itinerario explicable

La aportación diferencial de SpainWay es que el itinerario **se explica a sí mismo**: junto a la
ruta, la interfaz muestra los criterios usados, unas métricas de cómo se construyó el viaje y un
plan horario por día. Todo ello se surface con **lenguaje de producto**, nunca mostrando JSON en
crudo ni jerga técnica.

La pantalla que orquesta esta experiencia es
`src/app/pantallas/itinerarios/DetalleItinerarioPantalla.tsx`, apoyada en tres primitivas:
`TrustPanel`, `ItineraryInsightCard` y `ScheduleTimeline`.

## Contrato de datos (extendido, retrocompatible)

Los tipos viven en `src/app/servicios/itinerarios.ts`. Todos los campos nuevos son **opcionales
y aditivos**, de forma que los itinerarios antiguos siguen funcionando sin cambios.

| Tipo | Campos nuevos relevantes |
|------|--------------------------|
| `IaPoiPlan` | `score_breakdown`, `selection_reasons`, `confidence` |
| `IaDayPlan` | `schedule` (`IaScheduleSlot[]`), `route_metrics` (`IaRouteMetrics`) |
| `IaScheduleSlot` | `slot_type`, `start_time`, `end_time`, `poi_name`, `estimated_visit_minutes`, `travel_from_previous_minutes`, `estimated_distance_km`, `reason` |
| `IaRouteMetrics` | `total_visit_minutes`, `total_travel_minutes`, `estimated_distance_km`, `pace_feasibility`, `weather_feasibility`, `empty_day` |
| `IaEngineMetadata` | `engine_name`, `engine_version`, `generation_mode`, `llm_used_for_generation`, `llm_role` |
| `IaDecisionTrace` | `input_summary`, `candidate_pipeline[]`, `scoring_weights`, `selected_summary`, `quality_flags[]`, `runtime_warnings[]`, `user_summary` |
| `IaJsonItinerario` | `engine_metadata`, `decision_trace`, `quality_metrics`, `request_seed` |
| `ItinerarioAuditoria` | Respuesta de auditoría; `available:false` si el itinerario es antiguo. |

Se añade además el servicio `getItinerarioAuditoria(id)` → `GET /api/itinerarios/:id/auditoria`.

## Derivación en la pantalla (memoizada)

La pantalla no consume la traza directamente: la **transforma** en un objeto de vista
`ItineraryInsight` con `useMemo`, tolerando ausencias:

```tsx
const insightItinerario = useMemo<ItineraryInsight | null>(() => {
  const ia = itinerario?.ia_json;
  if (!ia) return null;
  const trace = ia.decision_trace;
  const qm = ia.quality_metrics as Record<string, unknown> | undefined;
  const selected = trace?.selected_summary as Record<string, unknown> | undefined;
  if (!trace && !qm) return null;                 // ← itinerario legado: se oculta
  const num = (v: unknown) => (typeof v === "number" ? v : null);
  return {
    totalPois,
    coveredMunicipalities: num(selected?.covered_municipalities) ?? num(qm?.territorial_coverage),
    premiumPois:           num(selected?.premium_pois)          ?? num(qm?.premium_pois),
    averageConfidence:     num(selected?.average_confidence),
    qualityFlags:          Array.isArray(trace?.quality_flags) ? trace?.quality_flags : [],
    scoringWeights:        trace?.scoring_weights ?? null,
    pipeline:              Array.isArray(trace?.candidate_pipeline) ? trace?.candidate_pipeline : null,
  };
}, [itinerario, totalPois]);
```

El plan horario se indexa por número de día:

```tsx
const scheduleByDay = useMemo(() => {
  const map = new Map<number, IaDayPlan>();
  for (const plan of getIaDayPlans(itinerario)) {
    const numero = plan.day_number ?? plan.dia;
    if (typeof numero === "number") map.set(numero, plan);
  }
  return map;
}, [itinerario]);
```

## 1. `TrustPanel` — por qué se recomienda

Panel de confianza con la frase de producto autorizada y cuatro pilares (preferencias, calidad
turística, coherencia de ruta, contexto del destino). Se renderiza **siempre** bajo la cabecera:

> "SpainWay ha organizado este viaje combinando tus preferencias, la calidad turística de los
> lugares, la coherencia de la ruta y el contexto disponible del destino."

## 2. `ItineraryInsightCard` — cómo se construyó

Traduce la traza de decisión a una tarjeta visual titulada **"Cómo se ha construido tu viaje"**:

- **Chips de métricas**: Zonas (`coveredMunicipalities`), Destacados (`premiumPois`),
  Lugares (`totalPois`).
- **Confianza**: `averageConfidence` en % como `StatusPill` (verde si ≥ 70 %).
- **Criterios de selección**: barras horizontales a partir de `scoring_weights`, ordenadas de
  mayor a menor y **traducidas** a lenguaje de producto por `weightEntries()`.
- **Embudo de candidatos**: frase que resume `candidate_pipeline` ("De *N* lugares reales del
  destino, SpainWay ha filtrado y seleccionado los *M* más coherentes con tu viaje").
- **Banderas de calidad**: `quality_flags` traducidas con `translateFlag()`; las claves
  desconocidas se **descartan** (nunca se muestra jerga cruda).

La traducción vive en `src/lib/insightLabels.ts`:

| Clave técnica (pesos) | Etiqueta de producto |
|-----------------------|----------------------|
| `touristic_quality` | Calidad turística |
| `semantic_affinity` | Afinidad con tus intereses |
| `distance_coherence` | Coherencia de ruta |
| `territorial_diversity` | Diversidad territorial |
| `user_profile_affinity` | Tus preferencias |
| `weather_context` | Contexto del clima |
| `editorial_curation` | Curación editorial |

| Bandera de calidad | Etiqueta de producto |
|--------------------|----------------------|
| `sin_dias_vacios` | Sin días vacíos |
| `ranking_semantico_activo` | Afinidad semántica activa |
| `preferencias_negativas_aplicadas` | Respeta tus exclusiones |
| `adaptacion_meteorologica_aplicada` | Adaptado al clima previsto |
| `incluye_pois_destacados` | Incluye lugares destacados |

## 3. `ScheduleTimeline` — plan horario por día

Por cada día se renderiza el `schedule` como línea de tiempo (franjas con icono según
`slot_type`: 📍 visita, 🍽️ comida, ☕ descanso), horas `start–end`, y trayectos entre paradas
(minutos + km). Debajo, `route_metrics` se muestra como chips (Visitas, Trayectos, Distancia).
Si el día no trae `schedule`, el componente devuelve `null` y no ocupa espacio.

```tsx
<ScheduleTimeline
  schedule={scheduleByDay.get(dia.numero)?.schedule ?? []}
  routeMetrics={scheduleByDay.get(dia.numero)?.route_metrics ?? null}
/>
```

## Composición bajo la cabecera

```tsx
{insightItinerario ? (
  <div className="mt-5 grid gap-4 md:grid-cols-2">
    <TrustPanel />
    <ItineraryInsightCard insight={insightItinerario} />
  </div>
) : (
  <TrustPanel className="mt-5" />   // itinerario legado: solo el panel de confianza
)}
```

## Manejo elegante de itinerarios antiguos

- Sin `decision_trace` **ni** `quality_metrics` → `insightItinerario` es `null` → la tarjeta de
  métricas **no se monta**; el `TrustPanel` sí.
- Sin `schedule` en un día → `ScheduleTimeline` devuelve `null`.
- Claves de peso o banderas desconocidas → se filtran, no se pintan.

Así, la explicabilidad es **progresiva**: aparece cuando el backend la aporta y desaparece sin
romper la vista cuando no está.
