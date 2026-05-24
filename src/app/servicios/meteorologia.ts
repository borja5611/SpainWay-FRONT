
import { apiGet } from "./api";

export interface WeatherDay {
  date: string;
  temp_min: number | null;
  temp_max: number | null;
  rain_probability: number | null;
  wind_max: number | null;
  weather_code: number | null;
  label: string;
  advice: string;
}

export interface WeatherForecastResponse {
  ok: boolean;
  provider: string;
  generated_at: string;
  reliable_for_trip: boolean;
  message: string;
  forecast_days: WeatherDay[];
  trip_days: WeatherDay[];
}

export function getForecastItinerario(params: {
  id_itinerario: number;
  start?: string | null;
  end?: string | null;
}) {
  const query = new URLSearchParams({ id_itinerario: String(params.id_itinerario) });
  if (params.start) query.set("start", params.start.slice(0, 10));
  if (params.end) query.set("end", params.end.slice(0, 10));
  return apiGet<WeatherForecastResponse>(`/api/meteorologia/forecast?${query.toString()}`);
}
