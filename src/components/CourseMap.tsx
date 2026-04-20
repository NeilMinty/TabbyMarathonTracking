'use client'

import { useEffect, useState } from 'react'
import { PATH_WAYPOINTS } from '@/lib/routeData'
import { getCurrentMile, interpolatePos } from '@/lib/utils'

const W = 560
const H = 260

interface Props {
  startTime: string
  targetHours: number
}

function buildPathD(): string {
  const pts = PATH_WAYPOINTS.map((p) => ({
    px: p.x * W,
    py: p.y * H,
  }))
  return pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.px.toFixed(1)} ${p.py.toFixed(1)}`)
    .join(' ')
}

const PATH_D = buildPathD()

// Approximate path length for stroke-dasharray (rough estimate based on waypoints)
function approxPathLength(): number {
  let len = 0
  for (let i = 1; i < PATH_WAYPOINTS.length; i++) {
    const dx = (PATH_WAYPOINTS[i].x - PATH_WAYPOINTS[i - 1].x) * W
    const dy = (PATH_WAYPOINTS[i].y - PATH_WAYPOINTS[i - 1].y) * H
    len += Math.sqrt(dx * dx + dy * dy)
  }
  return len
}

const TOTAL_PATH_LEN = approxPathLength()

export default function CourseMap({ startTime, targetHours }: Props) {
  const [mile, setMile] = useState(0)

  useEffect(() => {
    function update() {
      setMile(getCurrentMile(startTime, targetHours))
    }
    update()
    const id = setInterval(update, 30_000)
    return () => clearInterval(id)
  }, [startTime, targetHours])

  const pos = interpolatePos(mile)
  const px = pos.x * W
  const py = pos.y * H

  const progress = Math.min(mile / 26.2, 1)
  const dashOffset = TOTAL_PATH_LEN * (1 - progress)

  // Cheer point pixel positions
  const cp1 = { cx: PATH_WAYPOINTS[5].x * W, cy: PATH_WAYPOINTS[5].y * H } // mile 11
  const cp2 = { cx: PATH_WAYPOINTS[14].x * W, cy: PATH_WAYPOINTS[14].y * H } // mile 25
  const finish = { cx: PATH_WAYPOINTS[PATH_WAYPOINTS.length - 1].x * W, cy: PATH_WAYPOINTS[PATH_WAYPOINTS.length - 1].y * H }

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
          <rect width={W} height={H} fill="#ddeeff" rx="12" />

          {/* Thames waterway shape */}
          <path
            d={`M 0 ${H * 0.72} Q ${W * 0.15} ${H * 0.78} ${W * 0.3} ${H * 0.74} Q ${W * 0.45} ${H * 0.70} ${W * 0.55} ${H * 0.76} Q ${W * 0.7} ${H * 0.82} ${W} ${H * 0.78} L ${W} ${H} L 0 ${H} Z`}
            fill="#a8d4f5"
            opacity="0.5"
          />

          {/* Ghost route */}
          <path
            d={PATH_D}
            fill="none"
            stroke="#4a90d9"
            strokeWidth="3"
            strokeOpacity="0.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Progress route */}
          <path
            d={PATH_D}
            fill="none"
            stroke="#D6246E"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={TOTAL_PATH_LEN}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />

          {/* Cheer point 1 – mile 11 */}
          <circle cx={cp1.cx} cy={cp1.cy} r={7} fill="#D6246E" opacity="0.9" />
          <text x={cp1.cx + 9} y={cp1.cy + 4} fontSize="9" fill="#D6246E" fontWeight="bold">🫁 M11</text>

          {/* Cheer point 2 – mile 25 */}
          <circle cx={cp2.cx} cy={cp2.cy} r={7} fill="#D6246E" opacity="0.9" />
          <text x={cp2.cx + 9} y={cp2.cy + 4} fontSize="9" fill="#D6246E" fontWeight="bold">🫁 M25</text>

          {/* Finish */}
          <rect
            x={finish.cx - 16}
            y={finish.cy - 8}
            width={32}
            height={16}
            rx="3"
            fill="#00857A"
            opacity="0.9"
          />
          <text x={finish.cx} y={finish.cy + 4} fontSize="8" fill="white" textAnchor="middle" fontWeight="bold">FINISH</text>

          {/* Start label */}
          <text x={PATH_WAYPOINTS[0].x * W} y={PATH_WAYPOINTS[0].y * H - 10} fontSize="8" fill="#1a2535" textAnchor="middle">START</text>

          {/* Tabby avatar */}
          <defs>
            <filter id="avatar-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.3" />
            </filter>
          </defs>
          <image
            href="/tabby.jpg"
            x={px - 16}
            y={py - 40}
            width={32}
            height={32}
            preserveAspectRatio="xMidYMid meet"
            filter="url(#avatar-shadow)"
          />
          <line x1={px} y1={py - 8} x2={px} y2={py} stroke="#D6246E" strokeWidth="1.5" />
          <circle cx={px} cy={py} r={3} fill="#D6246E" />
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
