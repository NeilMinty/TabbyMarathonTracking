'use client'

import { useState } from 'react'
import WeatherCard from '@/components/WeatherCard'
import SummaryBar from '@/components/SummaryBar'
import CourseMap from '@/components/CourseMap'
import CheerPoints from '@/components/CheerPoints'
import RouteTimeline from '@/components/RouteTimeline'

export default function Home() {
  const [startTime, setStartTime] = useState('10:30')
  const [targetHours, setTargetHours] = useState(6)

  const minPerMile = (targetHours * 60) / 26.2

  const targetOptions = []
  for (let h = 3.5; h <= 7; h += 0.5) {
    targetOptions.push(h)
  }

  return (
    <main className="main">
      {/* Config card */}
      <div className="card config-card">
        <h2 className="config-title">Race Settings</h2>
        <div className="config-grid">
          <label className="config-label">
            Start time
            <input
              type="time"
              className="config-input"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </label>
          <label className="config-label">
            Target time
            <select
              className="config-input"
              value={targetHours}
              onChange={(e) => setTargetHours(Number(e.target.value))}
            >
              {targetOptions.map((h) => (
                <option key={h} value={h}>
                  {h % 1 === 0 ? `${h}h 00m` : `${Math.floor(h)}h 30m`}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <WeatherCard />

      <SummaryBar
        startTime={startTime}
        targetHours={targetHours}
        minPerMile={minPerMile}
      />

      <CourseMap startTime={startTime} targetHours={targetHours} />

      <CheerPoints startTime={startTime} minPerMile={minPerMile} />

      <RouteTimeline startTime={startTime} minPerMile={minPerMile} />

      <p className="disclaimer">
        Estimated times are based on a steady even pace of {Math.floor(minPerMile)}:{String(Math.round((minPerMile % 1) * 60)).padStart(2, '0')} min/mile.
        Actual splits will vary. Course map is schematic only.
      </p>
    </main>
  )
}
