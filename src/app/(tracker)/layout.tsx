export default function TrackerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <div className="header-left">
            <img src="/tabby.png" alt="" className="header-avatar" />
            <div className="header-titles">
              <h1 className="header-title">Race Day Tracker</h1>
              <p className="header-subtitle">#TeamBreathe · Asthma + Lung UK</p>
            </div>
          </div>
          <div className="header-date">
            <span className="date-badge">26 April 2026</span>
          </div>
        </div>
      </header>
      {children}
    </>
  )
}
