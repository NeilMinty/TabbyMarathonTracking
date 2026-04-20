import { CHEER_POINTS } from '@/lib/routeData'
import { addMinsToTime, fmtElapsed } from '@/lib/utils'

interface Props {
  startTime: string
  minPerMile: number
  isRaceStarted: boolean
}

export default function CheerPoints({ startTime, minPerMile, isRaceStarted }: Props) {
  return (
    <div className="cheer-section">
      <h2 className="section-title">Cheer Points</h2>
      <div className="cheer-grid">
        {CHEER_POINTS.map((cp) => {
          const elapsedMins = cp.mile * minPerMile
          const arrivalTime = addMinsToTime(startTime, elapsedMins)
          return (
            <div key={cp.id} className="cheer-card">
              <div className="cheer-card-header">
                <span className="mile-badge">Mile {cp.mile}</span>
                {cp.photo && (
                  <span className="photo-badge">📸 Official photographer on site</span>
                )}
              </div>
              <h3 className="cheer-name">{cp.name}</h3>
              <p className="cheer-location">📍 {cp.location}</p>
              <p className="cheer-desc">{cp.description}</p>
              {isRaceStarted ? (
                <div className="cheer-arrival">
                  <span className="arrival-time">{arrivalTime}</span>
                  <span className="arrival-elapsed">({fmtElapsed(elapsedMins)} from start)</span>
                </div>
              ) : (
                <p className="cheer-waiting">Waiting for race start…</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
