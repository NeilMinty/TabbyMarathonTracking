import type { Metadata } from 'next'
import { DM_Serif_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import { TABBY_B64 } from '@/lib/tabbyAvatar'

const dmSerifDisplay = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-serif',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: "Tabby's Race Day Tracker · Team Breathe",
  description: 'Track Tabby through the 2026 London Marathon for Asthma + Lung UK Team Breathe',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSerifDisplay.variable} ${dmSans.variable}`}>
      <body>
        <header className="site-header">
          <div className="header-inner">
            <div className="header-left">
              {TABBY_B64 ? (
                <img
                  src={`data:image/png;base64,${TABBY_B64}`}
                  alt="Tabby"
                  className="header-avatar"
                />
              ) : (
                <div className="header-avatar header-avatar--placeholder">T</div>
              )}
              <div className="header-titles">
                <h1 className="header-title">Tabby&rsquo;s Race Day Tracker</h1>
                <p className="header-subtitle">#TeamBreathe · Asthma + Lung UK</p>
              </div>
            </div>
            <div className="header-date">
              <span className="date-badge">26 April 2026</span>
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}
