import { MILESTONES } from '@/lib/routeData'
import { addMinsToTime } from '@/lib/utils'

interface Props {
  startTime: string
  minPerMile: number
}

export default function RouteTimeline({ startTime, minPerMile }: Props) {
  return (
    <div className="timeline-section">
      <h2 className="section-title">Route Timeline</h2>
      <div className="timeline">
        {MILESTONES.map((m, i) => {
          const elapsedMins = m.mile * minPerMile
          const time = addMinsToTime(startTime, elapsedMins)
          const isCheer = 'cheer' in m && m.cheer
          const isFinish = 'finish' in m && m.finish

          return (
            <div
              key={i}
              className={`timeline-row${isCheer ? ' timeline-row--cheer' : ''}${isFinish ? ' timeline-row--finish' : ''}`}
            >
              <div className="timeline-dot-col">
                <div className={`timeline-dot${isCheer ? ' timeline-dot--cheer' : ''}${isFinish ? ' timeline-dot--finish' : ''}`} />
                {i < MILESTONES.length - 1 && <div className="timeline-line" />}
              </div>
              <div className="timeline-content">
                <div className="timeline-mile">
                  Mile {m.mile % 1 === 0 ? m.mile : m.mile.toFixed(1)}
                </div>
                <div className="timeline-name">{m.name}</div>
                <div className="timeline-area">{m.area}</div>
              </div>
              <div className="timeline-time">{time}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
