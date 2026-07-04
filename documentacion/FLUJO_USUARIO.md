# Flujo de usuario

Este documento describe el recorrido principal (*happy path*) del usuario, desde que abre la app
hasta que consulta un itinerario explicable, y cómo se conectan pantallas, stores y servicios.

## Recorrido de alto nivel

```
Splash / Onboarding
        │
        ▼
     Login  ──▶  useAuthStore.setSesion(token, usuario)   (persiste en localStorage)
        │
        ▼
     Inicio ──┬─────────────▶  Chat (asistente por pasos)
              │                      │
              │                      ▼
              └──▶ Crear        Cargando (LoadingJourney)
                   itinerario         │
                       │              ▼
                       └────────▶  Resultado / Detalle del itinerario
                                          │
                                          ├──▶ Mapa (ver POI)
                                          └──▶ Favoritos
```

## 1. Arranque y sesión

`SplashPantalla` (`/`) es el punto de entrada. El primer uso pasa por `OnboardingPantalla`
(`/onboarding/:step`). La autenticación (`LoginPantalla`, `RegistroPantalla`, recuperación con
OTP) fija la sesión en `useAuthStore` mediante `setSesion`, que persiste token y usuario vía el
servicio `auth`. A partir de ahí, `api.ts` adjunta `Authorization: Bearer <token>` en cada
petición; un `401` limpia la sesión automáticamente.

## 2. Inicio

`InicioPantalla` (`/inicio`) es el *home*: descubrimiento por comunidad autónoma y accesos a
mapa, eventos y calendario. Desde aquí el usuario decide **cómo** crear su viaje: mediante el
**asistente conversacional** (`/chat`) o mediante el **formulario generador** (`/itinerarios/crear`).

## 3a. Vía asistente (chat)

El asistente captura los datos del viaje en pasos y los acumula en `useChatStore`:

| Paso | Pantalla | Escribe en `useChatStore` |
|------|----------|---------------------------|
| Destino | `ChatPantalla` / `SelectorDestino` | `setDestino` |
| Preferencias | `ChatPreferenciasPantalla` | `togglePreferencia` |
| Presupuesto | `ChatPresupuestoPantalla` | `setPresupuesto` |
| Intereses | `ChatInteresesPantalla` | `toggleInteres` |

Al confirmar, se navega a `/chat/cargando` (`CargandoItinerarioPantalla`), que muestra el
`LoadingJourney` de 5 pasos mientras el backend genera la propuesta, y luego a `/chat/resultado`.

## 3b. Vía formulario generador

`CreaItinerarioPantalla` (`/itinerarios/crear`) reúne todos los parámetros en un único formulario
(destino, base con selección en mapa Mapbox, fechas, ritmo, tipo de viaje, transporte, notas) y
llama al recomendador. El resultado también desemboca en el **detalle del itinerario**.

## 4. Generación (backend)

La creación/regeneración usa `regenerarItinerarioCompleto()` →
`POST /api/recomendador/generar` (servicio `itinerarios.ts`). La respuesta incluye el itinerario
persistido con su `ia_json` (que puede traer `decision_trace`, `schedule` y `quality_metrics`).

## 5. Resultado y detalle explicable

`DetalleItinerarioPantalla` (`/itinerarios/:itinerarioId`) carga el itinerario con
`getItinerarioDetalle(id)` y muestra:

1. **Cabecera** del viaje (destino, días, nº de POIs, presupuesto, base).
2. **`TrustPanel`** — "Por qué SpainWay te recomienda este viaje".
3. **`ItineraryInsightCard`** — métricas explicables (si hay `decision_trace`/`quality_metrics`).
4. Por cada día: **`ScheduleTimeline`** (plan horario) + tarjetas de POIs.

Acciones disponibles: marcar favoritos, eliminar/añadir POIs (`aplicarAccionManualItinerario`),
añadir eventos live y restauración, y **regenerar** el itinerario con nuevas preferencias sin
borrar la versión actual. Detalle en [ITINERARIO_EXPLICABLE.md](./ITINERARIO_EXPLICABLE.md).

## 6. Exploración cruzada

Desde el detalle, cada POI enlaza al **mapa** (`/mapa?poi=<id>` o `/mapa/poi`) o a Google Maps
para indicaciones. Los POIs guardados aparecen en **`FavoritosPantalla`** (`/favoritos`), también
con su vista de mapa.

## Manejo de itinerarios antiguos (retrocompatibilidad)

El flujo es **retrocompatible**: si un itinerario no tiene `decision_trace` (creado antes de la
explicabilidad), el detalle **oculta** la tarjeta de métricas y el plan horario, pero sigue
mostrando la ruta y el `TrustPanel`. Ningún dato técnico se muestra en crudo.

## Feedback transversal

Cualquier acción puede emitir un aviso con el sistema de toasts
(`toast.success/error/info`), renderizado por el `<Toaster/>` global montado en `App.tsx`.
Ver [ESTADOS_REACTIVOS.md](./ESTADOS_REACTIVOS.md).
