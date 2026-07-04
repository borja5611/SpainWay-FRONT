# Arquitectura del frontend

El frontend es una **SPA React 19 + TypeScript** empaquetada con **Vite 8** y envuelta con
**Capacitor** para generar la app Android. La arquitectura separa claramente cuatro capas:
**presentación** (pantallas y componentes), **estado** (stores Zustand), **acceso a datos**
(servicios REST tipados) y **sistema de diseño** (primitivas reutilizables).

## Bootstrap de la aplicación

`src/main.tsx` monta React en modo estricto e importa los estilos globales y el CSS de Mapbox:

```tsx
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

`src/App.tsx` es la raíz funcional: renderiza el router (`NavegacionApp`), monta el
`<Toaster/>` global **una sola vez** y mantiene "caliente" el servicio de IA del backend
(warm-up cada 4 minutos para evitar el primer fallo de arranque en frío de Render).

```tsx
function App() {
  useEffect(() => {
    void warmupIaService({ force: true, silent: true });
    const id = window.setInterval(() => void warmupIaService({ silent: true }), 4 * 60 * 1000);
    return () => window.clearInterval(id);
  }, []);
  return (<><NavegacionApp /><Toaster /></>);
}
```

`src/styles/index.css` orquesta el orden de importación: `fonts.css` → `tailwind.css` → `theme.css`.

## Enrutado (react-router-dom 7)

El router se define en `src/app/navegacion/rutas.tsx` con `createBrowserRouter`. Las rutas se
agrupan bajo **dos layouts** mediante rutas anidadas, y las constantes de path viven
centralizadas en `src/app/utilidades/rutas.ts` (`RUTAS_APP`).

| Grupo | Layout | Rutas (resumen) |
|-------|--------|-----------------|
| Autenticación | `LayoutAuth` | `/` (splash), `/onboarding/:step`, `/login`, `/registro`, `/recuperar-contrasena`, `/verificacion-otp`, `/nueva-contrasena`, `/confirmacion-contrasena` |
| Principal | `LayoutPrincipal` | `/inicio`, `/destinos`, `/mapa`, `/poi/:poiId`, `/itinerarios`, `/itinerarios/crear`, `/itinerarios/:itinerarioId`, `/favoritos`, `/calendario`, `/chat` (+ subrutas), `/perfil` (+ subrutas) |
| Fallback | — | `*` → `RutaNoEncontradaPantalla` |

Ambos grupos anteponen `<ScrollToTop />` para resetear el scroll al navegar. `LayoutPrincipal`
compone la estructura visible común: `BarraSuperior` (cabecera contextual por `pathname`) +
`<Outlet/>` + `NavegacionInferior` (tab bar) + `MenuConfiguracionGlobal` (menú lateral).

## Estado global (Zustand 5)

Cuatro stores ligeros, sin middleware pesado. La sesión se hidrata desde `localStorage`
mediante el servicio `auth`.

| Store | Estado | Acciones | Propósito |
|-------|--------|----------|-----------|
| `useAuthStore` | `token`, `usuario`, `isAuthenticated` | `setSesion`, `cerrarSesion` | Sesión del usuario (persistida). |
| `useChatStore` | `destino`, `preferencias[]`, `presupuesto`, `intereses[]` | `setDestino`, `togglePreferencia`, `setPresupuesto`, `toggleInteres`, `resetChat` | Datos que el usuario acumula en el asistente. |
| `useDestinoStore` | `destinoSeleccionado` | `setDestinoSeleccionado`, `limpiarDestinoSeleccionado` | Destino elegido en Inicio. |
| `useToastStore` | `toasts[]` | `push`, `dismiss` | Sistema de feedback (ver `ESTADOS_REACTIVOS.md`). |

## Capa de servicios (acceso a datos)

`src/app/servicios/api.ts` es el **cliente REST tipado** central. Expone `apiGet`, `apiPost`,
`apiPatch` y `apiDelete` sobre `fetch`, con estas responsabilidades:

- Prefija todas las URLs con `VITE_API_URL` (lanza error si no está definida).
- Inyecta la cabecera `Authorization: Bearer <token>` desde el token guardado.
- En `401` limpia la sesión local (evita seguir con un token roto).
- Normaliza errores del servidor (limpia HTML/502 de Render a mensajes legibles).

Cada recurso tiene su propio servicio que reutiliza ese cliente. Servicios presentes:
`auth`, `conversacion`, `eventosLive`, `favoritos`, `itinerarios`, `lugaresLocales`,
`meteorologia`, `pois`, `poisDestacados`, `preferencias`, `recomendador`, `restauracion`,
`territorio`, `ubicacionesApi`, `usuarios`, `iaWarmupService`.

El servicio **`itinerarios.ts`** es el más relevante: concentra los tipos del contrato de IA
(traza de decisión, plan horario, métricas) y los endpoints del recomendador. Ver detalle en
[ITINERARIO_EXPLICABLE.md](./ITINERARIO_EXPLICABLE.md).

| Función | Método / endpoint |
|---------|-------------------|
| `getItinerarioDetalle(id)` | `GET /api/itinerarios/detalle/:id` |
| `getItinerarioAuditoria(id)` | `GET /api/itinerarios/:id/auditoria` |
| `regenerarItinerarioCompleto(payload)` | `POST /api/recomendador/generar` |
| `aplicarAccionManualItinerario(id, accion)` | `POST /api/itinerarios/:id/acciones/manual` |
| `getItinerariosMapa(idUsuario)` | `GET /api/itinerarios/mapa/:idUsuario` |

## Alias de importación

Se define el alias `@/*` → `./src/*` en **dos** sitios que deben mantenerse sincronizados:

```ts
// vite.config.ts (resolución en runtime/build)
resolve: { alias: { "@": path.resolve(__dirname, "./src") } }
```

```jsonc
// tsconfig.app.json (resolución de tipos en el editor)
"paths": { "@/*": ["./src/*"] }
```

Esto permite imports estables como `import { cn } from "@/lib/cn"` o
`import { TrustPanel } from "@/components/ui"` sin rutas relativas frágiles.

## Diagrama de capas (resumen)

```
Pantallas (src/app/pantallas)  ──usa──▶  Componentes de dominio (src/app/componentes)
        │                                        │
        │ consume                                │ compone
        ▼                                        ▼
Stores Zustand (src/app/store)          Sistema de diseño (src/components/ui)
        │                                        │
        │ dispara                                │ usa cn() + tokens
        ▼                                        ▼
Servicios REST (src/app/servicios) ──fetch──▶ API backend (VITE_API_URL)
```
