import { useEffect, useRef, useState } from "react";
import {
  buscarUbicaciones,
  type UbicacionSugerida,
} from "@/app/servicios/ubicacionesApi";

type Props = {
  value: UbicacionSugerida | null;
  onChange: (value: UbicacionSugerida | null) => void;
};

export default function CampoUbicacionBase({ value, onChange }: Props) {
  const [texto, setTexto] = useState(value?.label ?? "");
  const [resultados, setResultados] = useState<UbicacionSugerida[]>([]);
  const [cargando, setCargando] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (value?.label && value.label !== texto) {
      setTexto(value.label);
    }
  }, [value]);

  useEffect(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    const limpio = texto.trim();

    if (limpio.length < 2) {
      setResultados([]);
      setAbierto(false);
      return;
    }

    timeoutRef.current = window.setTimeout(async () => {
      try {
        setCargando(true);
        const data = await buscarUbicaciones(limpio);
        setResultados(data);
        setAbierto(true);
      } catch {
        setResultados([]);
        setAbierto(false);
      } finally {
        setCargando(false);
      }
    }, 250);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [texto]);

  return (
    <div className="relative">
      <label className="mb-1 block text-[11px] font-semibold text-slate-700">
        Zona o alojamiento base
      </label>

      <input
        value={texto}
        onChange={(e) => {
          setTexto(e.target.value);
          onChange(null);
        }}
        onFocus={() => {
          if (resultados.length > 0) setAbierto(true);
        }}
        placeholder="Ej. Bernabéu, Gran Vía, Retiro, hotel..."
        className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
      />

      {cargando && (
        <p className="mt-1 text-[11px] text-slate-400">Buscando zona...</p>
      )}

      {abierto && resultados.length > 0 && (
        <div className="absolute z-50 mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
          {resultados.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setTexto(item.label);
                setResultados([]);
                setAbierto(false);
                onChange(item);
              }}
              className="block w-full border-b border-slate-100 px-4 py-3 text-left hover:bg-orange-50"
            >
              <p className="text-sm font-semibold text-slate-800">
                {item.label}
              </p>

              {item.subtitle && (
                <p className="text-xs text-slate-500">{item.subtitle}</p>
              )}

              {item.address && (
                <p className="mt-0.5 text-[11px] text-slate-400">
                  {item.address}
                </p>
              )}

              {typeof item.distanciaKm === "number" && (
                <p className="mt-1 text-[11px] font-medium text-orange-500">
                  A {item.distanciaKm.toFixed(1)} km
                </p>
              )}
            </button>
          ))}
        </div>
      )}

      {texto.trim().length >= 2 && !cargando && abierto && resultados.length === 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 shadow-xl">
          No se encontraron coincidencias.
        </div>
      )}
    </div>
  );
}