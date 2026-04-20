import { addMinsToTime, fmtElapsed, fmtPace } from '@/lib/utils'

interface Props {
  startTime: string
  targetHours: number
  minPerMile: number
}

export default function SummaryBar({ startTime, targetHours, minPerMile }: Props) {
  const totalMins = targetHours * 60
  const finishTime = addMinsToTime(startTime, totalMins)

  return (
    <div className="summary-bar">
      <div className="summary-item">
        <span className="summary-label">Start</span>
        <span className="summary-value">{startTime}</span>
      </div>
      <div className="summary-divider" />
      <div className="summary-item">
        <span className="summary-label">Pace</span>
        <span className="summary-value">{fmtPace(minPerMile)}/mi</span>
      </div>
      <div className="summary-divider" />
      <div className="summary-item">
        <span className="summary-label">Target</span>
        <span className="summary-value">{fmtElapsed(totalMins)}</span>
      </div>
      <div className="summary-divider" />
      <div className="summary-item">
        <span className="summary-label">Est. Finish</span>
        <span className="summary-value">{finishTime}</span>
      </div>
    </div>
  )
}
