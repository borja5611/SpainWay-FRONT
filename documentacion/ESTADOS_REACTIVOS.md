# Estados reactivos

La app pasa de "loaders de texto plano" a un sistema de estados reactivos
consistente y premium. Cada pantalla puede cubrir el ciclo completo.

## Ciclo de estados

| Estado | Componente / patrón | Cuándo |
|--------|---------------------|--------|
| loading | `SkeletonCard` / `LoadingJourney` | Mientras se piden datos. |
| skeleton | `SkeletonCard` (shimmer) | Listas y tarjetas en carga. |
| empty | `EmptyState` | Sin resultados (favoritos, itinerarios). |
| error | `ErrorState` (con `onRetry`) | Fallo de red/servicio. |
| retry | `ErrorState.onRetry` | Reintento explícito por el usuario. |
| success | `toast.success(...)` | Confirmación de acción. |

## Feedback visual (toasts)

Sistema propio con Zustand (`useToastStore`) + `<Toaster/>` global. Sin `alert`
nativo ni librerías externas.

```tsx
import { toast } from "@/app/store/useToastStore";

// favoritos
toast.success("Guardado en favoritos");
// regenerar
toast.info("Regenerando el día…");
// mapa / eventos / restauración
toast.error("No se pudo cargar el mapa");
```

Tipos de toast: `success` (verde), `error` (rojo), `info` (coral). Se autodescartan
(~3,2 s) y se pueden cerrar con clic. Animación de entrada/salida con `motion`.

## LoadingJourney (carga guiada)

Para procesos largos (generación de viaje) se usa `LoadingJourney`, con 5 pasos
visibles y microcopy de producto:

1. Leyendo tus preferencias
2. Consultando datos del destino
3. Seleccionando los mejores lugares
4. Trazando una ruta coherente
5. Preparando tu propuesta

Adoptado en `CargandoItinerarioPantalla`.

## Buenas prácticas aplicadas

- Nada de JSON en bruto en pantalla.
- Estados vacíos/errores como componentes reutilizables (no JSX inline por
  pantalla).
- Animaciones sutiles (`AnimatedList`, `FadeIn`) para dar sensación reactiva.

## Evidencia para la memoria

- Captura de `LoadingJourney` durante la generación.
- Captura de un `EmptyState` y un `ErrorState`.
- GIF/secuencia de un toast de éxito al añadir a favoritos.
