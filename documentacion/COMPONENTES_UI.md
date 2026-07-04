# Catálogo de componentes UI

Sistema de diseño premium en `src/components/ui/` (barrel `index.ts`). Todos son
reutilizables, coherentes con el token **coral** y usan `motion` para las
micro-interacciones. Se importan con `@/components/ui`.

## Primitivas

| Componente | Props principales | Uso |
|------------|-------------------|-----|
| `PremiumCard` | `interactive?`, `tone` (default/coral/muted) | Tarjeta base con sombra suave y hover. |
| `MetricChip` | `icon?`, `label`, `value?`, `tone` | Chip de métrica (días, ritmo, distancia). |
| `StatusPill` | `status` (success/warning/danger/info/neutral) | Píldora de estado con anillo. |
| `SectionHeader` | `title`, `subtitle?`, `eyebrow?`, `action?` | Cabecera de sección con eyebrow coral. |
| `SkeletonCard` | `lines?` | Placeholder de carga con shimmer. |
| `EmptyState` | `icon?`, `title`, `description?`, `action?` | Estado vacío consistente. |
| `ErrorState` | `title?`, `description?`, `onRetry?` | Estado de error con reintento. |
| `LoadingJourney` | `steps?`, `currentStep?`, `title?` | Cargador premium por pasos (5 por defecto). |
| `AnimatedList` / `FadeIn` | `stagger?` / `delay?` | Entrada escalonada / aparición suave. |
| `BottomSheet` | `open`, `onClose`, `title?` | Hoja inferior mobile-first (Escape + backdrop). |
| `AppShell` / `PageHeader` | `onBack?`, `actions?` | Contenedor de página y cabecera. |
| `TrustPanel` | `className?` | "Por qué SpainWay te recomienda este viaje". |
| `ItineraryInsightCard` | `insight` | Métricas visuales del `decision_trace`. |
| `ScheduleTimeline` | `schedule`, `routeMetrics?` | Línea de tiempo del día + métricas de ruta. |
| `Toaster` | — | Contenedor global de toasts (montado en `App.tsx`). |

## Ejemplos

```tsx
import { PremiumCard, MetricChip, EmptyState } from "@/components/ui";

<PremiumCard interactive tone="coral">
  <MetricChip tone="coral" label="Días" value={3} />
</PremiumCard>

<EmptyState title="Aún no tienes viajes"
  description="Crea tu primer itinerario personalizado."
  action={<button className="rounded-full bg-coral px-5 py-2.5 text-coral-foreground">Crear viaje</button>} />
```

## Toasts (feedback visual)

```tsx
import { toast } from "@/app/store/useToastStore";
toast.success("Añadido a favoritos");
toast.error("No se pudo regenerar el día");
```

Store en `src/app/store/useToastStore.ts` (Zustand, sin librería externa de
toasts). `<Toaster/>` se monta una vez en `App.tsx`.

## Helper `cn()`

`src/lib/cn.ts` combina clases de Tailwind resolviendo conflictos
(`clsx` + `tailwind-merge`). Base de todas las primitivas.

## Notas de reutilización

Las primitivas están adoptadas en el detalle de itinerario
(`ItineraryInsightCard`, `TrustPanel`, `ScheduleTimeline`) y en la carga del chat
(`LoadingJourney`). Están listas para adoptarse de forma incremental en inicio y
mapa sin romper la navegación.
