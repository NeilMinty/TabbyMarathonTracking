'use client'

import { useEffect, useState } from 'react'
import { ROUTE_GPS } from '@/lib/routeData'
import { getCurrentMile, interpolatePos } from '@/lib/utils'

const W = 800
const H = 380

// ── Mercator-style projection onto the SVG viewBox ──────────────────────────
const _lats = ROUTE_GPS.map(p => p[0])
const _lngs = ROUTE_GPS.map(p => p[1])
const MIN_LAT = Math.min(..._lats)
const MAX_LAT = Math.max(..._lats)
const MIN_LNG = Math.min(..._lngs)
const MAX_LNG = Math.max(..._lngs)

function project(lat: number, lng: number): { x: number; y: number } {
  return {
    x: (lng - MIN_LNG) / (MAX_LNG - MIN_LNG) * 780 + 10,
    y: (1 - (lat - MIN_LAT) / (MAX_LAT - MIN_LAT)) * 360 + 10,
  }
}

// Pre-compute projected points
const PROJECTED = ROUTE_GPS.map(([lat, lng]) => project(lat, lng))
const POINTS_STR = PROJECTED.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')

// Total polyline length for strokeDasharray
const TOTAL_LEN = PROJECTED.reduce((sum, p, i) => {
  if (i === 0) return 0
  const dx = p.x - PROJECTED[i - 1].x
  const dy = p.y - PROJECTED[i - 1].y
  return sum + Math.sqrt(dx * dx + dy * dy)
}, 0)

// Named landmark positions
const PT_START  = PROJECTED[0]
const PT_CP1    = PROJECTED[12]   // mile 11 – Rotherhithe
const PT_CP2    = PROJECTED[30]   // mile 25 – Embankment
const PT_FINISH = PROJECTED[33]   // The Mall

// ────────────────────────────────────────────────────────────────────────────

interface Props {
  startTime: string
  targetHours: number
  isRaceStarted?: boolean
}

export default function CourseMap({ startTime, targetHours, isRaceStarted = false }: Props) {
  const [mile, setMile] = useState(0)

  useEffect(() => {
    function update() {
      setMile(isRaceStarted ? getCurrentMile(startTime, targetHours) : 0)
    }
    update()
    const id = setInterval(update, 30_000)
    return () => clearInterval(id)
  }, [startTime, targetHours, isRaceStarted])

  const pos = interpolatePos(mile)
  const dashOffset = TOTAL_LEN * (1 - Math.min(mile / 26.2, 1))

  return (
    <div className="map-section">
      <h2 className="section-title">Course Map</h2>
      <div className="map-container">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          className="course-svg"
          aria-label="London Marathon course map"
        >
          {/* Background */}
          <rect width={W} height={H} fill="#e8f2f8" rx="12" />

          {/* Ghost route – full distance, low opacity */}
          <polyline
            points={POINTS_STR}
            fill="none"
            stroke="#4a90d9"
            strokeWidth="3"
            strokeOpacity="0.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Progress route – pink, revealed by strokeDashoffset */}
          <polyline
            points={POINTS_STR}
            fill="none"
            stroke="#D6246E"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={TOTAL_LEN}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />

          {/* Cheer point 1 – mile 11 Rotherhithe */}
          <circle cx={PT_CP1.x} cy={PT_CP1.y} r={7} fill="#D6246E" opacity="0.95" />
          <text
            x={PT_CP1.x + 11}
            y={PT_CP1.y + 4}
            fontSize="9"
            fill="#D6246E"
            fontWeight="bold"
          >🫁 M11</text>

          {/* Cheer point 2 – mile 25 Embankment */}
          <circle cx={PT_CP2.x} cy={PT_CP2.y} r={7} fill="#D6246E" opacity="0.95" />
          <text
            x={PT_CP2.x + 11}
            y={PT_CP2.y - 4}
            fontSize="9"
            fill="#D6246E"
            fontWeight="bold"
          >🫁 M25</text>

          {/* Finish – The Mall */}
          <rect
            x={PT_FINISH.x + 4}
            y={PT_FINISH.y - 9}
            width={42}
            height={18}
            rx="3"
            fill="#00857A"
            opacity="0.95"
          />
          <text
            x={PT_FINISH.x + 25}
            y={PT_FINISH.y + 5}
            fontSize="8"
            fill="white"
            textAnchor="middle"
            fontWeight="bold"
          >FINISH</text>

          {/* Start label */}
          <text
            x={PT_START.x}
            y={PT_START.y - 12}
            fontSize="8"
            fill="#1a2535"
            textAnchor="middle"
          >START</text>

          {/* Drop-shadow filter for avatar */}
          <defs>
            <filter id="avatar-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* Tabby avatar – natural Memoji shape, no border-radius */}
          <image
            href="/tabby.png"
            x={pos.x - 16}
            y={pos.y - 44}
            width={32}
            height={32}
            preserveAspectRatio="xMidYMid meet"
            filter="url(#avatar-shadow)"
          />
          <line
            x1={pos.x}
            y1={pos.y - 12}
            x2={pos.x}
            y2={pos.y}
            stroke="#D6246E"
            strokeWidth="1.5"
          />
          <circle cx={pos.x} cy={pos.y} r={3} fill="#D6246E" />
        </svg>

        <div className="map-legend">
          <span className="legend-item"><span className="legend-dot legend-dot--pink" /> Cheer point</span>
          <span className="legend-item"><span className="legend-dot legend-dot--teal" /> Finish</span>
          <span className="legend-item"><span className="legend-dot legend-dot--blue" /> Route</span>
        </div>
      </div>
    </div>
  )
}
