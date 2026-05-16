import { Cloud, CloudLightning, CloudRain, CloudSnow, Sun, Wind } from 'lucide-react'
import { darkMode } from '@/lib/design-tokens'

interface WeatherWidgetProps {
  latitude: number | null
  longitude: number | null
  location: string
}

interface OpenMeteoResponse {
  current: {
    temperature_2m: number
    weathercode: number
    windspeed_10m: number
  }
}

function getWeatherInfo(code: number): { label: string; Icon: React.ElementType } {
  if (code === 0) return { label: 'Clear sky', Icon: Sun }
  if (code <= 3) return { label: 'Partly cloudy', Icon: Cloud }
  if (code <= 48) return { label: 'Foggy', Icon: Cloud }
  if (code <= 67) return { label: 'Rainy', Icon: CloudRain }
  if (code <= 77) return { label: 'Snowy', Icon: CloudSnow }
  if (code <= 82) return { label: 'Rain showers', Icon: CloudRain }
  return { label: 'Thunderstorm', Icon: CloudLightning }
}

export default async function WeatherWidget({ latitude, longitude, location }: WeatherWidgetProps) {
  if (latitude === null || longitude === null) return null

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode,windspeed_10m&timezone=auto`
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) return null

    const data: OpenMeteoResponse = await res.json()
    const { temperature_2m, weathercode, windspeed_10m } = data.current
    const { label, Icon } = getWeatherInfo(weathercode)

    return (
      <div
        className={`${darkMode.bg.primary} rounded-lg shadow-lg p-6 ${darkMode.border.default} border-2`}
      >
        <div className="flex items-center mb-4">
          <Icon className={`w-5 h-5 ${darkMode.text.muted} mr-2`} />
          <h2 className={`text-xl font-semibold ${darkMode.text.primary}`}>Current Weather</h2>
        </div>

        <div className={`p-3 ${darkMode.bg.secondary} rounded-lg`}>
          <p className={`text-sm ${darkMode.text.muted} mb-2`}>{location}</p>
          <div className="flex items-end gap-4">
            <span className={`text-4xl font-bold ${darkMode.text.primary}`}>
              {Math.round(temperature_2m)}°C
            </span>
            <div className="pb-1">
              <p className={`text-sm font-medium ${darkMode.text.secondary}`}>{label}</p>
              <div className={`flex items-center gap-1 text-sm ${darkMode.text.muted}`}>
                <Wind className="w-3 h-3" />
                <span>{Math.round(windspeed_10m)} km/h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch {
    return null
  }
}
