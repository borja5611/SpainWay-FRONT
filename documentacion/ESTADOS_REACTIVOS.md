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

## Warm-up del motor de recomendaciones

El motor de recomendaciones (IA) se despliega en Render (plan free) y se suspende
tras inactividad. Su arranque en frío puede tardar. La pantalla **Crear
itinerario** está diseñada para que ese warm-up **nunca bloquee** al usuario.

### Principios

- **No bloqueo del formulario.** El estado de la IA se comprueba en segundo plano
  al montar la pantalla. El usuario puede rellenar destino, fechas, zona base,
  preferencias y usar el mapa aunque la IA siga despertando.
- **Sin spinners eternos ni rojos permanentes.** Mientras la IA calienta se
  muestra un aviso **ámbar amable**, no un error rojo. El verde solo aparece
  cuando está lista.

### Piezas

| Pieza | Rol |
|-------|-----|
| `servicios/iaHealth.ts` | Cliente de `/api/health/wake-ia` + interpretación pura del envelope a un `EstadoRecomendador` (`ready`/`warming`/`unavailable`/`error`). |
| `utilidades/useEstadoRecomendador.ts` | Hook: chequeo al montar, **retry con backoff**, `AbortController` y limpieza al desmontar. |
| `componentes/itinerarios/EstadoRecomendadorAviso.tsx` | UI no bloqueante: chip verde (listo), chip neutro (comprobando), banner ámbar (warming/unavailable), aviso neutro (error). |

### Estados de UI

| Estado | Aspecto | Acciones |
|--------|---------|----------|
| `ready` | Chip verde suave "Motor de recomendaciones listo" | — |
| `checking` | Chip neutro con spinner | — |
| `warming` | Banner ámbar + spinner pequeño | **Reintentar ahora** |
| `unavailable` | Banner ámbar amable | **Reintentar** / **Seguir editando** |
| `error` | Aviso neutro controlado (sin stacktrace) | **Reintentar** / **Seguir editando** |

### Retry con backoff

- Intento inicial al montar.
- Reintentos automáticos a **2 s, 5 s, 10 s, 10 s**.
- Máximo **5 intentos automáticos**; después se detiene y deja un botón manual.
- **Sin polling infinito**. `AbortController` cancela cualquier petición en vuelo
  al desmontar el componente.

### Al pulsar "Generar itinerario"

1. Si la IA no está `ready`, se hace una **comprobación rápida** contra
   `wake-ia`.
2. Si sigue `warming`/`unavailable`: **no se lanza** una generación que se
   quede colgada. Se muestra un mensaje claro y se conservan **todos** los datos
   del formulario.
3. Si está `ready`: se genera con normalidad.
4. Si la generación falla con `IA_WARMING` / `IA_TIMEOUT` / `IA_UNAVAILABLE`
   (el backend devuelve `code` en el cuerpo): mensaje específico, **el
   formulario no se limpia**, y se permite reintentar.

> El formulario solo se limpia tras un **éxito real**.

### Conservación de datos

El formulario persiste en `localStorage` (`spainway_crear_itinerario_form_v1`,
`..._base_coords_v1`, `spainway_trip_date_range`). Ni el warm-up, ni un timeout,
ni la cancelación manual borran esos datos.

### LoadingJourney y overlay de generación con timeout real

- `LoadingJourney` y el overlay de generación muestran feedback por tiempo:
  - a los **20 s**: "Está tardando más de lo habitual, seguimos intentándolo…".
  - a los **45 s**: "El servicio puede estar despertando. Puedes cancelar y
    reintentar sin perder los datos".
- Botón **"Cancelar y volver al formulario"**: cierra el overlay sin perder datos
  y evita cualquier navegación posterior aunque la petición termine.

### Mapbox y adblock

El error `POST https://events.mapbox.com/events/... ERR_BLOCKED_BY_CLIENT`
proviene de la **telemetría de Mapbox bloqueada por un adblock**. Es benigno: se
ignora en silencio y **no** rompe el mapa. Solo un fallo real de estilo/tiles/token
activa el fallback "No se ha podido cargar el mapa. Puedes continuar introduciendo
la zona manualmente".

## Buenas prácticas aplicadas

- Nada de JSON en bruto en pantalla.
- Estados vacíos/errores como componentes reutilizables (no JSX inline por
  pantalla).
- Animaciones sutiles (`AnimatedList`, `FadeIn`) para dar sensación reactiva.
- El warm-up de la IA nunca bloquea la UI ni muestra errores fatales.

## Evidencia para la memoria

- Captura de `LoadingJourney` durante la generación.
- Captura de un `EmptyState` y un `ErrorState`.
- GIF/secuencia de un toast de éxito al añadir a favoritos.
