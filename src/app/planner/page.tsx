'use client'

import { useState, useEffect } from 'react'
import { MILESTONES } from '@/lib/routeData'
import { addMinsToTime, fmtPace } from '@/lib/utils'

const TARGET_OPTIONS = [3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7]

function fmtTarget(h: number): string {
  const hrs = Math.floor(h)
  const mins = Math.round((h - hrs) * 60)
  return mins === 0 ? `${hrs}h` : `${hrs}h ${mins}m`
}

interface Row {
  mile: number
  name: string
  area: string
  time: string
  isCheer: boolean
  isFinish: boolean
  hasPhotographer: boolean
}

function buildRows(startTime: string, targetHours: number): Row[] {
  const minPerMile = (targetHours * 60) / 26.2
  return MILESTONES.map((m) => {
    const ms = m as { mile: number; name: string; area: string; cheer?: boolean; finish?: boolean }
    return {
      mile: ms.mile,
      name: ms.name,
      area: ms.area,
      time: addMinsToTime(startTime, minPerMile * ms.mile),
      isCheer: !!ms.cheer,
      isFinish: !!ms.finish,
      hasPhotographer: ms.mile === 25,
    }
  })
}

// PDF component — loaded dynamically to avoid SSR issues
type PdfProps = { rows: Row[]; startTime: string; targetHours: number }

function PdfDownloadButton({ rows, startTime, targetHours }: PdfProps) {
  const [PdfLink, setPdfLink] = useState<React.ComponentType<{ rows: Row[]; startTime: string; targetHours: number }> | null>(null)

  useEffect(() => {
    import('./PlannerPdf').then((mod) => {
      setPdfLink(() => mod.default)
    })
  }, [])

  if (!PdfLink) {
    return (
      <button style={btnStyle} disabled>
        Preparing PDF…
      </button>
    )
  }

  return <PdfLink rows={rows} startTime={startTime} targetHours={targetHours} />
}

const btnStyle: React.CSSProperties = {
  display: 'inline-block',
  background: '#D6246E',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  padding: '14px 32px',
  fontSize: '1rem',
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
  opacity: 0.7,
}

export default function PlannerPage() {
  const [startTime, setStartTime] = useState('10:30')
  const [targetHours, setTargetHours] = useState(6)

  const minPerMile = (targetHours * 60) / 26.2
  const pace = fmtPace(minPerMile)
  const rows = buildRows(startTime, targetHours)

  return (
    <main style={{ minHeight: '100vh', background: '#f4f6fa', padding: '32px 16px 64px', fontFamily: 'var(--font-sans, DM Sans, sans-serif)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-serif, DM Serif Display, serif)', fontSize: '1.8rem', color: '#1a2535', lineHeight: 1.2, marginBottom: 6 }}>
            London Marathon 2026 — Race Planner
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: 6 }}>
            TCS London Marathon · 26 April 2026
          </p>
          <p style={{ fontSize: '0.82rem', color: '#D6246E', fontWeight: 600 }}>
            In support of Asthma + Lung UK · #TeamBreathe
          </p>
        </div>

        {/* Inputs */}
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: '20px 24px', marginBottom: 24, display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <label style={labelStyle}>
            Start Time
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              style={inputStyle}
            />
          </label>
          <label style={labelStyle}>
            Target Finish
            <select
              value={targetHours}
              onChange={(e) => setTargetHours(Number(e.target.value))}
              style={inputStyle}
            >
              {TARGET_OPTIONS.map((h) => (
                <option key={h} value={h}>{fmtTarget(h)}</option>
              ))}
            </select>
          </label>
          <div style={{ fontSize: '0.85rem', color: '#64748b', paddingBottom: 8 }}>
            Pace: <strong style={{ color: '#1a2535' }}>{pace}/mile</strong>
          </div>
        </div>

        {/* Results table */}
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: 24 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#1a2535', color: 'white' }}>
                <th style={thStyle}>Mile</th>
                <th style={{ ...thStyle, textAlign: 'left' }}>Landmark</th>
                <th style={{ ...thStyle, textAlign: 'left' }}>Area</th>
                <th style={thStyle}>Est. Time</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const bg = row.isFinish ? '#e6f5f4' : row.isCheer ? '#fff0f6' : 'white'
                const fw = row.isFinish || row.isCheer ? 700 : 400
                const color = row.isFinish ? '#00857A' : row.isCheer ? '#D6246E' : '#1a2535'
                return (
                  <tr key={row.mile} style={{ background: bg, borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ ...tdStyle, textAlign: 'center', fontWeight: fw, color }}>{row.mile}</td>
                    <td style={{ ...tdStyle, fontWeight: fw, color }}>{row.name}</td>
                    <td style={{ ...tdStyle, color: '#64748b' }}>{row.area}</td>
                    <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 700, color, fontFamily: 'var(--font-serif, DM Serif Display, serif)', fontSize: '1rem' }}>{row.time}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Download button */}
        <div style={{ textAlign: 'center' }}>
          <PdfDownloadButton rows={rows} startTime={startTime} targetHours={targetHours} />
        </div>
      </div>
    </main>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  fontSize: '0.78rem',
  fontWeight: 600,
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

const inputStyle: React.CSSProperties = {
  fontFamily: 'inherit',
  fontSize: '1rem',
  padding: '8px 12px',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  color: '#1a2535',
  background: '#f8fafc',
  cursor: 'pointer',
}

const thStyle: React.CSSProperties = {
  padding: '12px 16px',
  fontWeight: 600,
  fontSize: '0.78rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  textAlign: 'center',
}

const tdStyle: React.CSSProperties = {
  padding: '10px 16px',
}
