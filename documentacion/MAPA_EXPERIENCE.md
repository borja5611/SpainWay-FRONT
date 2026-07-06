# Experiencia de mapa

## Implementación

Mapa con **`mapbox-gl` v3** (imperativo). El token se lee de
`VITE_MAPBOX_TOKEN`. Se usa en cuatro puntos independientes:

- `src/app/componentes/mapa/MapaInteractivo.tsx` (mapa reutilizable principal,
  usado por `MapaPantalla`).
- `src/app/pantallas/itinerarios/FavoritosPantalla.tsx` (mapa de favoritos).
- `src/app/pantallas/mapa/PoiEnMapaPantalla.tsx` (POI individual).
- `src/app/pantallas/itinerarios/CreaItinerarioPantalla.tsx` (selector de base).

> `react-map-gl` está instalado pero **no se usa** (dependencia muerta, candidata
> a eliminación futura).

## Estilo SpainWay

- Marcadores coral (`#ff5a36`).
- Popups con bordes redondeados y sombra suave (overrides en
  `src/styles/theme.css`, sección `.mapboxgl-*`).
- El mapa se integra con el token de diseño (radio 24px).

## Comportamiento

- Panel inferior con POIs seleccionables.
- Foco desde el itinerario: al abrir un POI en el mapa se guarda en
  `sessionStorage` y la pantalla de mapa centra ese POI.
- Botón para abrir en Google Maps (URL segura por POI, `google_search_url` /
  `google_maps_url`).

## Estados sin token / sin coordenadas

Cada instancia muestra un mensaje de fallback si falta `VITE_MAPBOX_TOKEN` o no
hay coordenadas, evitando pantallas en blanco.

## Mejora futura (documentada)

Consolidar la inicialización de Mapbox en un único hook/proveedor y unificar los
marcadores/popups (hoy replicados en 4 sitios). No se ha refactorizado en este
trabajo para **no arriesgar la funcionalidad de mapa existente**.

## Evidencia para la memoria

- Captura del mapa con marcadores coral y popup.
- Captura del foco de un POI desde el detalle del itinerario.
- Mensaje de fallback sin token (Anexo E / Capítulo 3).
