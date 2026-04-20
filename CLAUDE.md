# Tabby Marathon Tracker

## What this is
A Next.js 14 race day tracker for Tabby running the **2026 London Marathon (26 April)** for **Asthma + Lung UK Team Breathe**. Deployed on Vercel.

GitHub: https://github.com/NeilMinty/TabbyMarathonTracking

## Stack
- Next.js 14.2.3, React 18.3.1, TypeScript — `src/app/` router
- No external UI library — all styles in `src/app/globals.css`
- Fonts: DM Serif Display (headings/values) + DM Sans (body) via `next/font/google`
- Weather: Open-Meteo free API (no key needed)

## Key files
| File | Purpose |
|------|---------|
| `src/lib/routeData.ts` | MILESTONES, CHEER_POINTS, PATH_WAYPOINTS constants |
| `src/lib/utils.ts` | Time helpers, pace formatting, interpolation, weather fetch |
| `src/lib/tabbyAvatar.ts` | `TABBY_B64` — base64 PNG of Tabby's Memoji |
| `src/app/page.tsx` | Root client component; holds startTime + targetHours state |
| `src/app/globals.css` | Full design system — edit here for visual changes |

## Design tokens (globals.css)
```
--pink:  #D6246E   (primary, cheer points, progress path)
--teal:  #00857A   (finish line)
--amber: #C2610C
--slate: #1a2535   (text)
```

## How the map works
- `CourseMap.tsx` renders a 560×260 SVG with a schematic route
- `PATH_WAYPOINTS` in `routeData.ts` are x/y fractions of that viewBox
- `interpolatePos(mile)` in `utils.ts` gives pixel position for any mile
- Avatar updates every 30 seconds via `getCurrentMile(startTime, targetHours)`
- `TABBY_B64` drives both the header avatar and the SVG `<image>` pin

## Tabby's avatar
Stored as a base64 PNG constant in `src/lib/tabbyAvatar.ts`. To update:
replace the string value of `TABBY_B64` — no other changes needed.
When `TABBY_B64` is empty the header shows a pink "T" placeholder and
the map shows a pink circle pin instead.

## Cheer points
- Mile 11 — Rotherhithe (before Tower Bridge)
- Mile 25 — Victoria Embankment (official photographer present, right-hand side)

## Config defaults
startTime: `10:30`, targetHours: `6` (selectable 3.5–7 in 0.5 increments)
