# Pantallas principales

Las vistas viven en `src/app/pantallas/` organizadas por dominio:
`{inicio, chat, itinerarios, mapa, perfil, auth, onboarding}`. Cada pantalla es un componente
por defecto (`export default`) que el router monta bajo `LayoutAuth` o `LayoutPrincipal`.

## Onboarding y autenticación

| Pantalla | Ruta | Propósito |
|----------|------|-----------|
| `SplashPantalla` | `/` | Pantalla de arranque / decisión de sesión. |
| `OnboardingPantalla` | `/onboarding/:step` | Presentación por pasos del producto. |
| `LoginPantalla` | `/login` | Inicio de sesión. |
| `RegistroPantalla` | `/registro` | Alta de usuario. |
| `RecuperarContrasenaPantalla` | `/recuperar-contrasena` | Solicitud de recuperación. |
| `VerificacionOtpPantalla` | `/verificacion-otp` | Verificación por código OTP. |
| `NuevaContrasenaPantalla` / `ConfirmacionContrasenaPantalla` | `/nueva-contrasena`, `/confirmacion-contrasena` | Fijar y confirmar nueva contraseña. |

## Inicio y descubrimiento

| Pantalla | Ruta | Propósito |
|----------|------|-----------|
| `InicioPantalla` | `/inicio` | *Home*. Descubrimiento por comunidad autónoma, accesos a mapa/eventos/calendario y punto de entrada a la creación de viajes. |
| `SelectorDestinoPantalla` | `/destinos` | Selección del destino/punto de partida (alimenta `useDestinoStore`). |
| `TarjetaDestino` | — | Componente de tarjeta de destino reutilizado en Inicio. |

`InicioPantalla` presenta las comunidades con textos curados (Andalucía, Asturias, Baleares,
Canarias, Cantabria, Cataluña, Comunidad Valenciana, Madrid…) y abre modales de restauración
local, eventos en directo y calendario.

## Asistente (chat)

| Pantalla | Ruta | Propósito |
|----------|------|-----------|
| `ChatPantalla` | `/chat`, `/chat/destino` | Entrada del asistente: ejemplos de viaje (escapada urbana, cultural, naturaleza) y listado de conversaciones. |
| `ChatDetallePantalla` | `/chat/conversacion/:idConversacion` | Conversación concreta con el asistente. |
| `ChatPreferenciasPantalla` | `/chat/preferencias` | Captura de preferencias del viaje. |
| `ChatPresupuestoPantalla` | `/chat/presupuesto` | Captura de presupuesto. |
| `ChatInteresesPantalla` | `/chat/intereses` | Captura de intereses. |
| `CargandoItinerarioPantalla` | `/chat/cargando` | Estado de generación con `LoadingJourney` (5 pasos). |
| `ResultadoChatPantalla` | `/chat/resultado` | Propuesta resultante de la conversación. |

Detalle del flujo y microcopy en [CHAT_EXPERIENCE.md](./CHAT_EXPERIENCE.md).

## Itinerarios

| Pantalla | Ruta | Propósito |
|----------|------|-----------|
| `ListaItinerariosPantalla` | `/itinerarios` | Listado de viajes guardados del usuario. |
| `CreaItinerarioPantalla` | `/itinerarios/crear` | **Formulario generador** de itinerario (destino, base con mapa Mapbox, fechas, ritmo, transporte…). |
| `DetalleItinerarioPantalla` | `/itinerarios/:itinerarioId` | **Pantalla más rica**: cabecera del viaje, panel de confianza, tarjeta de métricas explicables, plan horario por día, POIs, favoritos, eventos live, regeneración. |
| `FavoritosPantalla` | `/favoritos` | POIs favoritos del usuario, con mapa Mapbox. |
| `CalendarioPantalla` | `/calendario` | Agenda y eventos sugeridos. |

`DetalleItinerarioPantalla` es la vista central de la explicabilidad. Deriva con `useMemo` el
objeto `insightItinerario` (desde `ia_json.decision_trace` + `quality_metrics`) y `scheduleByDay`
(mapa por número de día), y renderiza `TrustPanel`, `ItineraryInsightCard` y `ScheduleTimeline`.
La **fuente de verdad** de las paradas son las entidades de BD `Dia_Itinerario` +
`Elemento_Itinerario`; el `ia_json` actúa como apoyo. Ver [ITINERARIO_EXPLICABLE.md](./ITINERARIO_EXPLICABLE.md).

## Mapa

| Pantalla | Ruta | Propósito |
|----------|------|-----------|
| `MapaPantalla` | `/mapa` | Exploración de puntos de interés en el mapa del destino. |
| `DetallePoiPantalla` | `/poi/:poiId` | Ficha completa de un punto de interés. |
| `PoiEnMapaPantalla` | `/mapa/poi` | POI concreto situado en el mapa (deep-link desde el detalle del itinerario). |

Uso de Mapbox y estados de error en [MAPA_EXPERIENCE.md](./MAPA_EXPERIENCE.md).

## Perfil

| Pantalla | Ruta | Propósito |
|----------|------|-----------|
| `PerfilPantalla` | `/perfil` | Cuenta del usuario y accesos de gestión. |
| `EditarPerfilPantalla` | `/perfil/editar` | Edición de datos personales. |
| `EditarPreferenciasPantalla` | `/perfil/preferencias` | Edición de preferencias de viaje. |

## Cabeceras contextuales

`LayoutPrincipal` calcula título y subtítulo de la `BarraSuperior` según el `pathname`. Ejemplos:

| Prefijo de ruta | Título | Subtítulo |
|-----------------|--------|-----------|
| `/inicio` | SpainWay | Explora ciudades, descubre lugares únicos y crea viajes personalizados |
| `/mapa` | Mapa | Explora puntos de interés y lugares destacados |
| `/itinerarios/crear` | Crear itinerario | Prepara una nueva ruta personalizada |
| `/itinerarios/detalle` | Detalle del itinerario | Consulta y ajusta tu viaje guardado |
| `/chat` | Asistente | Crea tu viaje ideal paso a paso |
