import { ROUTE_GPS } from './routeData'

export interface WeatherData {
  icon: string
  description: string
  tempC: number
  windMph: number
  windDir: string
  windNote: string
}

// Parse "HH:MM" → total minutes since midnight
export function parseTimeToMins(str: string): number {
  const [h, m] = str.split(':').map(Number)
  return h * 60 + m
}

// Add minutes to "HH:MM" string → "HH:MM"
export function addMinsToTime(base: string, mins: number): string {
  const total = parseTimeToMins(base) + mins
  const h = Math.floor(total / 60) % 24
  const m = Math.round(total % 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

// Format elapsed minutes → "Xh YYm" or "YYm"
export function fmtElapsed(mins: number): string {
  const h = Math.floor(mins / 60)
  const m = Math.round(mins % 60)
  if (h === 0) return `${m}m`
  return `${h}h ${String(m).padStart(2, '0')}m`
}

// Format min/mile → "M:SS"
export function fmtPace(minPerMile: number): string {
  const m = Math.floor(minPerMile)
  const s = Math.round((minPerMile - m) * 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

// Current time as minutes since midnight
export function nowMins(): number {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60
}

// Projection constants derived from ROUTE_GPS for 800×380 viewBox
const _lats = ROUTE_GPS.map(p => p[0])
const _lngs = ROUTE_GPS.map(p => p[1])
const _minLat = Math.min(..._lats)
const _maxLat = Math.max(..._lats)
const _minLng = Math.min(..._lngs)
const _maxLng = Math.max(..._lngs)

function _project(lat: number, lng: number): { x: number; y: number } {
  return {
    x: (lng - _minLng) / (_maxLng - _minLng) * 780 + 10,
    y: (1 - (lat - _minLat) / (_maxLat - _minLat)) * 360 + 10,
  }
}

// Interpolate x/y SVG position on course for a given mile, using ROUTE_GPS
export function interpolatePos(mile: number): { x: number; y: number } {
  const n = ROUTE_GPS.length
  const fraction = Math.min(Math.max(mile / 26.2, 0), 1)
  const floatIndex = fraction * (n - 1)
  const i = Math.floor(floatIndex)
  const t = floatIndex - i
  if (i >= n - 1) return _project(ROUTE_GPS[n - 1][0], ROUTE_GPS[n - 1][1])
  const lat = ROUTE_GPS[i][0] + t * (ROUTE_GPS[i + 1][0] - ROUTE_GPS[i][0])
  const lng = ROUTE_GPS[i][1] + t * (ROUTE_GPS[i + 1][1] - ROUTE_GPS[i][1])
  return _project(lat, lng)
}

// Current mile based on wall clock vs start time
export function getCurrentMile(startTime: string, targetHours: number): number {
  const startMins = parseTimeToMins(startTime)
  const elapsed = nowMins() - startMins
  if (elapsed <= 0) return 0
  const totalRaceMins = targetHours * 60
  const mile = (elapsed / totalRaceMins) * 26.2
  return Math.min(Math.max(mile, 0), 26.2)
}

const WMO_ICONS: Record<number, { icon: string; description: string }> = {
  0:  { icon: '☀️', description: 'Clear sky' },
  1:  { icon: '🌤️', description: 'Mainly clear' },
  2:  { icon: '⛅', description: 'Partly cloudy' },
  3:  { icon: '☁️', description: 'Overcast' },
  45: { icon: '🌫️', description: 'Fog' },
  48: { icon: '🌫️', description: 'Icy fog' },
  51: { icon: '🌦️', description: 'Light drizzle' },
  53: { icon: '🌦️', description: 'Drizzle' },
  55: { icon: '🌧️', description: 'Heavy drizzle' },
  61: { icon: '🌧️', description: 'Light rain' },
  63: { icon: '🌧️', description: 'Rain' },
  65: { icon: '🌧️', description: 'Heavy rain' },
  71: { icon: '🌨️', description: 'Light snow' },
  73: { icon: '🌨️', description: 'Snow' },
  75: { icon: '❄️', description: 'Heavy snow' },
  80: { icon: '🌦️', description: 'Rain showers' },
  81: { icon: '🌧️', description: 'Heavy showers' },
  95: { icon: '⛈️', description: 'Thunderstorm' },
}

function degreesToCompass(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(deg / 45) % 8]
}

function windNote(dir: string): string {
  if (['E', 'NE', 'SE'].includes(dir)) {
    return 'Easterly wind — headwind early on; becomes a tailwind on the Embankment stretch.'
  }
  if (['W', 'NW', 'SW'].includes(dir)) {
    return 'Westerly wind — helpful in the first half; expect more resistance on the Embankment.'
  }
  if (dir === 'N') {
    return 'Northerly wind — crosswind for much of the route.'
  }
  if (dir === 'S') {
    return 'Southerly wind — mostly crosswind; slight tailwind through Canary Wharf.'
  }
  return 'Light variable winds — neutral conditions across the course.'
}

// Fetch race day weather from Open-Meteo for 2026-04-26, lat 51.478 lon 0.001
export async function fetchRaceDayWeather(): Promise<WeatherData> {
  const url =
    'https://api.open-meteo.com/v1/forecast?latitude=51.478&longitude=0.001' +
    '&daily=weathercode,temperature_2m_max,temperature_2m_min,windspeed_10m_max,winddirection_10m_dominant' +
    '&start_date=2026-04-26&end_date=2026-04-26&timezone=Europe%2FLondon'

  const res = await fetch(url)
  if (!res.ok) throw new Error('Weather fetch failed')
  const data = await res.json()

  const code: number = data.daily.weathercode[0]
  const tempMax: number = data.daily.temperature_2m_max[0]
  const tempMin: number = data.daily.temperature_2m_min[0]
  const windKph: number = data.daily.windspeed_10m_max[0]
  const windDeg: number = data.daily.winddirection_10m_dominant[0]

  const wmoEntry = WMO_ICONS[code] ?? { icon: '🌡️', description: 'Mixed conditions' }
  const dir = degreesToCompass(windDeg)
  const windMph = Math.round(windKph * 0.621371)
  const tempC = Math.round((tempMax + tempMin) / 2)

  return {
    icon: wmoEntry.icon,
    description: wmoEntry.description,
    tempC,
    windMph,
    windDir: dir,
    windNote: windNote(dir),
  }
}
