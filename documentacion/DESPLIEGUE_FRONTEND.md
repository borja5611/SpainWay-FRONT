# Despliegue del frontend

## Plataforma

- **Vercel** (SPA React/Vite). Configuración en `vercel.json`.
- Empaquetado también con **Capacitor** (Android) para la app móvil.

## Build

```bash
npm install
npm run build     # tsc -b && vite build → dist/
npm run preview   # sirve el build local
```

## Variables de entorno

| Variable | Uso |
|----------|-----|
| `VITE_API_URL` | Base de la API del backend. |
| `VITE_MAPBOX_TOKEN` | Token de Mapbox para los mapas. |

Se leen con `import.meta.env` (Vite las inyecta en build). `VITE_API_URL` es
obligatoria (el wrapper `api.ts` lanza error si falta).

## Integridad del despliegue

- No se han cambiado nombres de repos ni la configuración de Vercel.
- El build pasa (`tsc -b && vite build`, exit 0) tras todas las mejoras.
- Cambios retrocompatibles: los itinerarios antiguos (sin `decision_trace`) se
  renderizan sin errores (la explicabilidad se oculta de forma elegante).

## Rendimiento — nota honesta

El bundle JS es reducido (~76 KB gzip). Sin embargo, existen **assets PNG muy
grandes** (héroes y eventos por CCAA, algunos de varios MB, uno ~96 MB). Es la
principal deuda de rendimiento del frontend.

- Recomendación futura: comprimir/convertir a WebP y aplicar `loading="lazy"`.
- No se ha tocado en este trabajo para no arriesgar la parte visual existente,
  pero queda documentado como línea de mejora.

## Evidencia para la memoria

- Salida de `npm run build` con el tamaño del bundle.
- Tabla de variables de entorno (Anexo B).
- Nota de rendimiento sobre imágenes (Capítulo 4 / Capítulo 6).
