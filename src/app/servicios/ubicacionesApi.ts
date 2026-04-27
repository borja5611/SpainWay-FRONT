const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export type UbicacionSugerida = {
  id: string;
  source: "poi" | "municipio";
  label: string;
  subtitle: string;
  address: string | null;
  lat: number;
  lon: number;
  tipo: string;
  categoria: string;
  distanciaKm: number | null;
};

export async function buscarUbicaciones(q: string): Promise<UbicacionSugerida[]> {
  const texto = q.trim();

  if (texto.length < 2) {
    return [];
  }

  const params = new URLSearchParams({
    q: texto,
    limit: "8",
  });

  const res = await fetch(`${API_URL}/ubicaciones/sugerencias?${params.toString()}`);

  if (!res.ok) {
    throw new Error("No se pudieron buscar ubicaciones");
  }

  return res.json();
}