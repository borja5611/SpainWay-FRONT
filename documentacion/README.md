# SpainWay Frontend — Documentación técnica

Documentación técnica del **frontend de SpainWay**, aplicación de planificación de
viajes por España. Este conjunto de documentos se elabora para su reutilización en la
memoria del Trabajo de Fin de Grado (TFG) de Ingeniería Informática.

SpainWay genera itinerarios turísticos personalizados y **explicables**: además de la
ruta, la interfaz muestra *por qué* se ha recomendado cada viaje (criterios, métricas y
plan horario) usando un lenguaje de producto, no técnico.

## Índice de la documentación

| Documento | Contenido |
|-----------|-----------|
| [ARQUITECTURA_FRONTEND.md](./ARQUITECTURA_FRONTEND.md) | Enrutado, stores, servicios, capas y alias. |
| [SISTEMA_DISENO.md](./SISTEMA_DISENO.md) | Tokens (coral, sombras, radios), fuentes y helper `cn()`. |
| [PANTALLAS_PRINCIPALES.md](./PANTALLAS_PRINCIPALES.md) | Catálogo de pantallas y su propósito. |
| [FLUJO_USUARIO.md](./FLUJO_USUARIO.md) | Recorrido onboarding → inicio → chat/crear → resultado → detalle. |
| [ITINERARIO_EXPLICABLE.md](./ITINERARIO_EXPLICABLE.md) | Cómo se surface la traza de decisión y el plan horario. |
| [CHAT_EXPERIENCE.md](./CHAT_EXPERIENCE.md) | Flujo del asistente y `LoadingJourney`. |
| [MAPA_EXPERIENCE.md](./MAPA_EXPERIENCE.md) | Uso de Mapbox, token, marcadores y estados. |
| [ESTADOS_REACTIVOS.md](./ESTADOS_REACTIVOS.md) | Loading / skeleton / empty / error / toast. |
| [COMPONENTES_UI.md](./COMPONENTES_UI.md) | Catálogo de primitivas con props y ejemplos. |
| [COPY_PRODUCTO.md](./COPY_PRODUCTO.md) | Copy permitido vs. prohibido y verificación. |
| [TESTS_FRONTEND.md](./TESTS_FRONTEND.md) | Vitest, cobertura y comandos. |
| [DESPLIEGUE_FRONTEND.md](./DESPLIEGUE_FRONTEND.md) | Despliegue en Vercel y variables de entorno. |
| [EVIDENCIAS_MEMORIA.md](./EVIDENCIAS_MEMORIA.md) | Capturas y tablas a incluir en la memoria del TFG. |

## Stack tecnológico

| Categoría | Tecnología | Versión |
|-----------|-----------|---------|
| Librería UI | React + React DOM | 19.2 |
| Lenguaje | TypeScript | 5.9 |
| Bundler / dev server | Vite | 8.0 |
| Estilos | Tailwind CSS v4 (`@tailwindcss/vite`) | 4.2 |
| Estado global | Zustand | 5.0 |
| Enrutado | react-router-dom | 7.13 |
| Mapas | mapbox-gl | 3.20 |
| Animación | `motion` (sucesor de framer-motion) | 12.38 |
| Utilidades clase | clsx + tailwind-merge | 2.1 / 3.5 |
| Envoltorio nativo | Capacitor (Android) | 8.3 |
| Tests | Vitest | 4.1 |

> No hay `tailwind.config.js`: Tailwind v4 se configura por CSS. Los tokens viven en
> `src/styles/theme.css` mediante `@theme inline`.
>
> `react-map-gl` está instalado pero **no se usa**; el mapa emplea `mapbox-gl` en crudo.

## Comandos

```bash
npm install          # instalar dependencias
npm run dev          # servidor de desarrollo (Vite)
npm run build        # comprobación de tipos + build de producción (tsc -b && vite build)
npm run preview      # servir el build de producción localmente
npm run lint         # ESLint sobre todo el proyecto
npm run test         # tests unitarios con Vitest (vitest run)
```

Definición real de scripts (`package.json`):

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "test": "vitest run",
  "preview": "vite preview"
}
```

## Variables de entorno

Se cargan mediante Vite (prefijo `VITE_`). Plantilla en `.env.example`:

| Variable | Uso | Consumida en |
|----------|-----|--------------|
| `VITE_API_URL` | URL base de la API REST (backend). Obligatoria: `api.ts` lanza error si falta. | `src/app/servicios/api.ts` |
| `VITE_MAPBOX_TOKEN` | Token de acceso de Mapbox GL. Sin él, el mapa muestra un estado de error con lista de POIs. | `MapaInteractivo` y pantallas de mapa |

## Mapa de carpetas

```
src/
  App.tsx                 # Raíz: NavegacionApp + <Toaster/> + warmup del servicio IA
  main.tsx                # Bootstrap React 19 (StrictMode), CSS de Mapbox y estilos globales
  app/
    navegacion/           # createBrowserRouter, LayoutAuth, LayoutPrincipal, rutas.tsx
    pantallas/            # Vistas por dominio: inicio, chat, itinerarios, mapa, perfil, auth, onboarding
    componentes/          # Componentes de dominio: layout, mapa, itinerarios, perfil, inicio
    servicios/            # Cliente REST tipado (api.ts) + un servicio por recurso
    store/                # Stores Zustand: useAuthStore, useChatStore, useDestinoStore, useToastStore
    utilidades/           # rutas.ts (constantes de rutas) y helpers
    datos/                # Mocks (destinos, itinerarios de ejemplo)
  components/ui/          # Sistema de diseño premium: primitivas reutilizables (barrel index.ts)
  lib/                    # cn() (clsx + tailwind-merge), insightLabels (+ test)
  styles/                # index.css, theme.css (tokens), fonts.css, tailwind.css
  assets/                # Imágenes por comunidad autónoma / pantalla
```

## Estado del proyecto

- `npm run build` pasa (comprobación de tipos con `tsc -b` + `vite build`).
- `npm run lint` con 0 errores (quedan 10 avisos preexistentes `react-hooks/exhaustive-deps`, no bloqueantes).
- `npm run test`: 6 tests en verde (`src/lib/insightLabels.test.ts`).
- Despliegue en Vercel intacto (SPA con *rewrite* a `index.html`); sin cambios que rompan navegación.
- **Limitación conocida**: varios PNG de eventos/hero son muy pesados (uno de ~96 MB).
  La optimización de imágenes queda como tarea futura de rendimiento.
