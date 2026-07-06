# Explicabilidad en el frontend de SpainWay

## 0. Separación entre trazabilidad técnica y comunicación al usuario

La aplicación no muestra al usuario mensajes internos sobre el papel del LLM.
La interfaz utiliza un lenguaje de producto centrado en calidad, preferencias,
distancia, contexto y planificación. La explicación técnica completa (por
qué el motor no es un wrapper de LLM, qué es `decision_trace`, etc.) queda
reservada para la documentación técnica, los tests y la auditoría — nunca se
traduce literalmente a copy de interfaz. Esta regla se aplica de forma
consistente en todo el frontend:

- Los tipos técnicos (`EngineMetadata`, `DecisionTrace`, `ScoreBreakdown`...)
  en `src/app/servicios/itinerarios.ts` sirven para tipar los datos, no como
  fuente de texto a mostrar tal cual.
- Cualquier campo libre que venga del backend (`selection_reasons`, motivos)
  pasa por una función de normalización antes de renderizarse.
- `scripts/check-forbidden-copy.mjs` (ver sección 6) verifica en CI/local que
  ninguna pantalla ni componente contenga términos como "LLM", "ChatGPT",
  "OpenAI", "tribunal", "TFG", "defensa" o frases tipo "no genera el
  itinerario" / "no inventa lugares".

## 1. Cómo se muestra la explicación

En `src/app/pantallas/itinerarios/DetalleItinerarioPantalla.tsx`, justo
después del header principal del itinerario, hay una sección desplegable
(reutilizando el componente `SeccionDesplegable` ya existente) titulada
**"Por qué SpainWay te recomienda este viaje"**. Muestra, en tarjetas legibles
(nunca JSON):

- Un bloque "Sistema de recomendación: Motor SpainWay" con una frase de
  producto ("Recomendación personalizada basada en datos reales del
  destino"). No se menciona el papel del LLM ni se compara con un modelo de
  lenguaje.
- Lugares analizados / seleccionados para el viaje.
- Zonas usadas (cobertura territorial).
- Calidad media y nº de lugares con explicación.
- Si se usaron tus preferencias/favoritos y si se ajustó por el contexto
  meteorológico (chips verdes/azules si sí, grises si no — nunca oculta que
  faltan datos).
- Un mensaje de cierre fijo, definido en el propio componente: *"Las
  recomendaciones se basan en lugares reales registrados en SpainWay y se
  ordenan según criterios de relevancia, distancia y encaje con tu viaje."*
  Este texto **no** se lee de `decision_trace` — ver sección 5.

Toda la sección es opcional: si el itinerario se generó antes de esta versión
(sin `engine_metadata`/`decision_trace` en `ia_json`), la sección
simplemente no se renderiza — no rompe itinerarios antiguos.

## 2. Motivo de recomendación por POI

En cada tarjeta de POI dentro de un día, tras el motivo textual ya existente,
hay un `<details>` nativo ("Motivo de recomendación") con:

- Si es uno de los puntos destacados de la zona.
- Hasta 4 motivos, pasados por `normalizarMotivoUsuario()` (ver sección 4).
- Los 2 factores de `score_breakdown` con mayor peso, traducidos a español
  con lenguaje de producto (`topScoreFactors()` + `SCORE_FACTOR_LABELS`,
  p. ej. "Selección de calidad", "Variedad de zonas").
- El `final_score` como "Nivel de coincidencia" en porcentaje.

Se usa `<details>/<summary>` en vez de estado de React por POI para no añadir
complejidad de estado innecesaria: es un patrón de desplegable nativo,
accesible y ligero.

## 3. Plan horario estimado por día

Si `IaDayPlan.schedule` existe, cada día muestra un desplegable "Plan horario
estimado" con los tramos agrupados en **Mañana / Comida / Tarde / Noche**
(`groupScheduleByMoment()`), cada uno con hora de inicio/fin, lugar o tipo de
tramo (traslado, comida, descanso) y el motivo. Incluye siempre el aviso:
*"Horarios y desplazamientos estimados por el motor SpainWay. Pueden
ajustarse según ritmo real, tráfico o disponibilidad."*

## 4. Normalización de motivos (`normalizarMotivoUsuario`)

`selection_reasons` es un campo técnico pensado para auditoría/tests (ver
`SpainWay-IA2/app/recommenders/scoring.py::build_selection_reasons`), con
frases como *"Mantiene coherencia geográfica con la ruta y la ubicación base
del viaje"*. `normalizarMotivoUsuario()`
(`DetalleItinerarioPantalla.tsx`) traduce esas frases a lenguaje natural,
por ejemplo:

| Motivo técnico (contiene...) | Texto mostrado al usuario |
|---|---|
| "destacado" / "curad..." | "Es uno de los puntos destacados de la zona." |
| "calidad turística" / "filtros editoriales" | "Tiene buena relevancia turística dentro del destino." |
| "semánticamente" / "preferencias de viaje" / "intereses" | "Encaja con los intereses indicados para el viaje." |
| "coherencia geográfica" / "ruta" | "Ayuda a mantener una ruta equilibrada durante el día." |
| "favoritos" / "perfil" | "Coincide con tus preferencias guardadas." |
| "meteorológica" / "previsión" | "Es una buena opción según el contexto meteorológico." |

Es una **lista blanca**: cualquier motivo que no coincida con un patrón
conocido cae en un mensaje genérico seguro ("Encaja con el destino y el tipo
de viaje solicitado."), en vez de mostrarse tal cual. Así el texto que llega
a pantalla sale siempre de un conjunto controlado en el propio frontend, sin
necesidad de mantener una lista de palabras prohibidas (evita además falsos
positivos en las verificaciones de copy: una lista de "palabras a bloquear"
tendría que contener esas mismas palabras como dato).

## 5. Resultado del chat

En `src/app/pantallas/chat/ResultadoChatPantalla.tsx` hay una tarjeta
informativa ("Itinerario preparado por SpainWay", antes de los botones de
acción) con tres mensajes: lugares reales verificados, ruta planificada por
calidad/distancia/preferencias, y que la ruta se organiza según intereses,
ritmo, distancia y contexto del destino. Es texto fijo, discreto y sin
mención alguna a IA conversacional ni a modelos de lenguaje.

## 6. Cómo se evita mostrar JSON crudo o copy no apto

Todos los campos nuevos del motor (`engine_metadata`, `decision_trace`,
`score_breakdown`, `selection_reasons`, `schedule`, `route_metrics`) se
consumen a través de tipos TypeScript explícitos
(`src/app/servicios/itinerarios.ts`) y funciones de formateo/normalización
(`formatPercent`, `topScoreFactors`, `groupScheduleByMoment`,
`scheduleSlotLabel`, `normalizarMotivoUsuario`) que transforman los datos en
frases y chips de producto. En ningún punto se hace `JSON.stringify(ia_json)`
ni se renderiza un objeto crudo en pantalla, y ningún texto libre proveniente
del backend se muestra sin pasar antes por una de estas funciones.

Como red de seguridad adicional, `npm test` ejecuta
`scripts/check-forbidden-copy.mjs`: recorre `src/app/pantallas` y
`src/app/componentes` y falla si encuentra "LLM", "ChatGPT", "OpenAI",
"tribunal", "TFG", "defensa" o las frases "no genera el itinerario" / "no
inventa lugares" en cualquier archivo `.ts`/`.tsx`.

## 7. Cómo se mejora la confianza del usuario

El diseño mantiene el lenguaje visual ya existente en la app (fondo claro,
tarjetas blancas, acento coral `#ff5a36`, grises suaves) para que la
explicabilidad se perciba como parte natural del producto, no como un panel
técnico añadido. Los mensajes remarcan que los datos son reales ("lugares
reales verificados en SpainWay") y que la ruta se construye a partir de
criterios de calidad, preferencias y contexto — sin comparar la aplicación
con un asistente de IA genérico ni justificar su funcionamiento frente a esa
comparación.

## 8. Cómo se evidencia que el motor es propio (a nivel técnico)

`getEngineMetadata()`/`getDecisionTrace()` leen directamente del `ia_json`
persistido por el backend (que a su vez es la respuesta literal del motor
IA). Esta evidencia técnica completa (qué es un LLM, por qué no genera el
itinerario, cómo se pondera cada señal) se documenta en
`SpainWay-IA2/docs/TFG_EXPLAINABLE_ENGINE.md` y se verifica con tests — el
frontend consume esos mismos datos, pero únicamente para construir contadores,
chips y porcentajes con lenguaje de producto.
