export type PoiMapPayload = {
  id?: string | number | null;
  nombre: string;
  descripcion?: string | null;
  lat?: number | null;
  lon?: number | null;
  categoria?: string | null;
  direccion?: string | null;
};

export function buildPoiMapUrl(poi: PoiMapPayload): string {
  const params = new URLSearchParams();

  if (poi.id !== undefined && poi.id !== null) {
    params.set("poiId", String(poi.id));
  }

  params.set("nombre", poi.nombre);

  if (poi.descripcion) params.set("descripcion", poi.descripcion);
  if (poi.categoria) params.set("categoria", poi.categoria);
  if (poi.direccion) params.set("direccion", poi.direccion);
  if (typeof poi.lat === "number" && Number.isFinite(poi.lat)) {
    params.set("lat", String(poi.lat));
  }
  if (typeof poi.lon === "number" && Number.isFinite(poi.lon)) {
    params.set("lon", String(poi.lon));
  }

  params.set("focusPoi", "1");

  return `/mapa?${params.toString()}`;
}

export function buildGoogleMapsUrl(poi: PoiMapPayload): string {
  if (
    typeof poi.lat === "number" &&
    Number.isFinite(poi.lat) &&
    typeof poi.lon === "number" &&
    Number.isFinite(poi.lon)
  ) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${poi.lat},${poi.lon}`,
    )}`;
  }

  const texto = [poi.nombre, poi.direccion].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(texto)}`;
}

export function readPoiFromSearch(search: string): PoiMapPayload | null {
  const params = new URLSearchParams(search);

  if (params.get("focusPoi") !== "1") return null;

  const nombre = params.get("nombre")?.trim();
  if (!nombre) return null;

  const latRaw = params.get("lat");
  const lonRaw = params.get("lon");

  const lat = latRaw !== null ? Number(latRaw) : null;
  const lon = lonRaw !== null ? Number(lonRaw) : null;

  return {
    id: params.get("poiId"),
    nombre,
    descripcion: params.get("descripcion"),
    categoria: params.get("categoria"),
    direccion: params.get("direccion"),
    lat: typeof lat === "number" && Number.isFinite(lat) ? lat : null,
    lon: typeof lon === "number" && Number.isFinite(lon) ? lon : null,
  };
}