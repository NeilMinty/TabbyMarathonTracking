'use client'

import { useState, useEffect } from 'react'
import WeatherCard from '@/components/WeatherCard'
import SummaryBar from '@/components/SummaryBar'
import CourseMap from '@/components/CourseMap'
import CheerPoints from '@/components/CheerPoints'
import RouteTimeline from '@/components/RouteTimeline'

interface Countdown {
  days: number
  hours: number
  mins: number
  secs: number
}

// 10:30 BST = 09:30 UTC on 26 April 2026
const RACE_DATETIME_UTC = new Date('2026-04-26T09:30:00Z')

export default function Home() {
  const [startTime, setStartTime] = useState('10:30')
  const [targetHours, setTargetHours] = useState(6)
  const [isRaceStarted, setIsRaceStarted] = useState(false)
  const [startTimeLocked, setStartTimeLocked] = useState(false)
  const [isRaceDay, setIsRaceDay] = useState(false)
  const [countdown, setCountdown] = useState<Countdown | null>(null)

  useEffect(() => {
    function tick() {
      const now = new Date()
      // Race day = on or after midnight local time on 26 April 2026
      setIsRaceDay(now >= new Date(2026, 3, 26))
      const diff = RACE_DATETIME_UTC.getTime() - now.getTime()
      if (diff > 0) {
        setCountdown({
          days:  Math.floor(diff / 86400000),
          hours: Math.floor((diff % 86400000) / 3600000),
          mins:  Math.floor((diff % 3600000) / 60000),
          secs:  Math.floor((diff % 60000) / 1000),
        })
      } else {
        setCountdown(null)
      }
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  function handleStartRace() {
    const now = new Date()
    const h = String(now.getHours()).padStart(2, '0')
    const m = String(now.getMinutes()).padStart(2, '0')
    setStartTime(`${h}:${m}`)
    setIsRaceStarted(true)
    setStartTimeLocked(true)
  }

  function handleReset() {
    setIsRaceStarted(false)
    setStartTimeLocked(false)
  }

  const minPerMile = (targetHours * 60) / 26.2

  const targetOptions: number[] = []
  for (let h = 3.5; h <= 7; h += 0.5) targetOptions.push(h)

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
              disabled={startTimeLocked}
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

      {/* Countdown (pre-race) or Start Race button (race day) */}
      {isRaceDay ? (
        <div className="start-race-section">
          {isRaceStarted ? (
            <button className="btn-reset" onClick={handleReset}>Reset</button>
          ) : (
            <button className="btn-start-race" onClick={handleStartRace}>
              🏃 Start Race
            </button>
          )}
        </div>
      ) : (
        countdown && (
          <div className="countdown-card">
            <p className="countdown-label">Race day countdown</p>
            <div className="countdown-values">
              <div className="countdown-unit">
                <span className="countdown-num">{String(countdown.days).padStart(2, '0')}</span>
                <label className="countdown-lbl">days</label>
              </div>
              <span className="countdown-sep">:</span>
              <div className="countdown-unit">
                <span className="countdown-num">{String(countdown.hours).padStart(2, '0')}</span>
                <label className="countdown-lbl">hours</label>
              </div>
              <span className="countdown-sep">:</span>
              <div className="countdown-unit">
                <span className="countdown-num">{String(countdown.mins).padStart(2, '0')}</span>
                <label className="countdown-lbl">mins</label>
              </div>
              <span className="countdown-sep">:</span>
              <div className="countdown-unit">
                <span className="countdown-num">{String(countdown.secs).padStart(2, '0')}</span>
                <label className="countdown-lbl">secs</label>
              </div>
            </div>
          </div>
        )
      )}

      <WeatherCard />

      <SummaryBar
        startTime={startTime}
        targetHours={targetHours}
        minPerMile={minPerMile}
      />

      <CourseMap
        startTime={startTime}
        targetHours={targetHours}
        isRaceStarted={isRaceStarted}
      />

      <CheerPoints
        startTime={startTime}
        minPerMile={minPerMile}
        isRaceStarted={isRaceStarted}
      />

      <RouteTimeline startTime={startTime} minPerMile={minPerMile} />

      <p className="disclaimer">
        Estimated times are based on a steady even pace of {Math.floor(minPerMile)}:{String(Math.round((minPerMile % 1) * 60)).padStart(2, '0')} min/mile.
        Actual splits will vary. Course map uses projected GPS coordinates.
      </p>
    </main>
  )
}
