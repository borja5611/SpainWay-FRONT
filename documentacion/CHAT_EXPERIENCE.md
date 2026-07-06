# Experiencia de chat (asistente)

El asistente "SpainWay Assistant" (avatar *Rose*) guía al usuario en la creación de un viaje. La
mejora clave de esta iteración es sustituir los "Cargando..." de texto plano por una experiencia
de producto guiada mediante la primitiva **`LoadingJourney`**.

## Flujo del asistente

El chat vive en `src/app/pantallas/chat/`. Es un flujo por pasos que acumula datos en
`useChatStore` y termina disparando la generación del itinerario.

```
ChatPantalla (/chat)
   │  ejemplos: "Escapada urbana", "Viaje cultural", "Naturaleza y relax"
   ▼
Preferencias ▸ Presupuesto ▸ Intereses     (useChatStore: togglePreferencia / setPresupuesto / toggleInteres)
   │
   ▼
CargandoItinerarioPantalla (/chat/cargando)  ──▶  ResultadoChatPantalla (/chat/resultado)
```

`ChatPantalla` ofrece prompts de arranque con un tono realista y de producto, por ejemplo:

> "Quiero preparar una escapada urbana de 3 días con visitas imprescindibles y tiempo para
> comer bien."

## Pantalla de carga: `CargandoItinerarioPantalla`

`src/app/pantallas/chat/CargandoItinerarioPantalla.tsx` monta la experiencia de espera. Combina
una tarjeta de marca (avatar Rose + barras de progreso ilustrativas + "Qué estoy afinando
ahora") con la primitiva **`LoadingJourney`**, y transiciona al resultado tras un breve intervalo.

```tsx
import { LoadingJourney } from "@/components/ui/LoadingJourney";

// ...dentro del render:
<LoadingJourney className="mt-6" title="Preparando tu viaje" />
```

Microcopy de apoyo mostrado en la tarjeta ("Qué estoy afinando ahora"):

- Reparto de días con un ritmo más lógico
- Peso de patrimonio, gastronomía o naturaleza según tus intereses
- Equilibrio entre experiencia y presupuesto
- Base visual para un itinerario más usable

## `LoadingJourney`: los 5 pasos visibles

`src/components/ui/LoadingJourney.tsx` es un cargador premium por pasos. Muestra un título, una
barra de progreso coral, el indicador "Paso *n* de 5" y una lista de pasos donde el activo se
resalta y los completados se marcan con ✓. Los pasos por defecto son:

| # | Paso (microcopy de producto) |
|---|------------------------------|
| 1 | Leyendo tus preferencias |
| 2 | Consultando datos del destino |
| 3 | Seleccionando los mejores lugares |
| 4 | Trazando una ruta coherente |
| 5 | Preparando tu propuesta |

Estos textos son deliberadamente de **producto**: describen *qué* está haciendo el sistema para
el usuario, sin mencionar tecnología interna (ver [COPY_PRODUCTO.md](./COPY_PRODUCTO.md)).

### Modos de avance

`LoadingJourney` funciona de dos maneras:

- **Autónomo** (por defecto): si no se pasa `currentStep`, avanza solo cada 1,6 s en bucle,
  dando sensación de progreso mientras el backend trabaja.
- **Controlado**: si el consumidor pasa `currentStep`, la primitiva refleja exactamente ese paso
  (útil para sincronizarlo con fases reales de la petición).

```tsx
type LoadingJourneyProps = {
  steps?: string[];       // por defecto, los 5 pasos de arriba
  currentStep?: number;   // omitido → avance automático
  title?: string;         // por defecto "Preparando tu viaje"
  className?: string;
};
```

### Animación

Usa `motion` (spinner rotatorio, barra de progreso animada por `width` y transición de opacidad
del paso activo con `AnimatePresence`), coherente con el resto del sistema de diseño.

## Resultado

Tras la carga se llega a la propuesta (`ResultadoChatPantalla`) y, desde ahí, al **detalle del
itinerario**, donde entra en juego toda la capa de explicabilidad
([ITINERARIO_EXPLICABLE.md](./ITINERARIO_EXPLICABLE.md)).
