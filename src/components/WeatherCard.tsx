'use client'

import { useEffect, useState } from 'react'
import { fetchRaceDayWeather, WeatherData } from '@/lib/utils'

export default function WeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    fetchRaceDayWeather()
      .then(setWeather)
      .catch(() => setFailed(true))
  }, [])

  if (failed || (!weather && !failed)) {
    return (
      <div className="weather-card">
        <div className="weather-card-inner">
          {failed ? (
            <>
              <span className="weather-icon">🌡️</span>
              <div className="weather-details">
                <p className="weather-desc">Typical April conditions</p>
                <p className="weather-fallback">10–15°C, light winds</p>
              </div>
            </>
          ) : (
            <p className="weather-loading">Loading race day forecast…</p>
          )}
        </div>
      </div>
    )
  }

  if (!weather) return null

  return (
    <div className="weather-card">
      <div className="weather-card-inner">
        <span className="weather-icon">{weather.icon}</span>
        <div className="weather-details">
          <p className="weather-desc">{weather.description} · {weather.tempC}°C</p>
          <p className="weather-wind">
            Wind: {weather.windMph} mph {weather.windDir}
          </p>
          <p className="weather-note">{weather.windNote}</p>
        </div>
      </div>
    </div>
  )
}
