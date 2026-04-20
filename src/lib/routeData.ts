export const TOTAL_MILES = 26.2

export const MILESTONES = [
  { mile: 0,    name: 'Start – Greenwich / Blackheath', area: 'Greenwich' },
  { mile: 3,    name: 'Routes merge', area: 'Charlton' },
  { mile: 6,    name: 'Cutty Sark', area: 'Greenwich' },
  { mile: 8,    name: 'Surrey Quays', area: 'Rotherhithe' },
  { mile: 10,   name: 'Jamaica Road', area: 'Bermondsey' },
  { mile: 11,   name: '🫁 Team Breathe Cheer Point 1', area: 'Rotherhithe', cheer: true },
  { mile: 12,   name: 'Tower Bridge', area: 'City of London' },
  { mile: 13.1, name: 'Halfway point', area: 'Wapping' },
  { mile: 16,   name: 'Isle of Dogs', area: 'Mudchute' },
  { mile: 18,   name: 'Canary Wharf loop', area: 'Canary Wharf' },
  { mile: 20,   name: 'Commercial Road', area: 'Limehouse' },
  { mile: 22,   name: 'Tower of London', area: 'City' },
  { mile: 23,   name: 'Blackfriars Underpass', area: 'Blackfriars' },
  { mile: 24,   name: 'Victoria Embankment', area: 'Embankment' },
  { mile: 25,   name: '🫁 Team Breathe Cheer Point 2 📸', area: 'Embankment', cheer: true },
  { mile: 25.5, name: 'Big Ben / Houses of Parliament', area: 'Westminster' },
  { mile: 26,   name: 'Buckingham Palace', area: 'Westminster' },
  { mile: 26.2, name: '🏅 FINISH – The Mall', area: 'Westminster', finish: true },
]

export const CHEER_POINTS = [
  {
    id: 1, mile: 11,
    name: 'Team Breathe Cheer Squad',
    location: 'Rotherhithe',
    description: 'The squad will be out in force giving Tabby the biggest cheer. About 42% through — a great energy boost before Tower Bridge.',
    photo: false,
  },
  {
    id: 2, mile: 25,
    name: 'Team Breathe Cheer Squad + Photographer',
    location: 'Victoria Embankment',
    description: 'Right hand side of the road. A photographer will be there to capture the moment — remember to smile! Big Ben just ahead, 1.2 miles to the finish.',
    photo: true,
  },
]

// x/y as fractions of a 560×260 SVG viewBox tracing the real route
export const PATH_WAYPOINTS = [
  { mile: 0,    x: 0.082, y: 0.300 },
  { mile: 3,    x: 0.270, y: 0.285 },
  { mile: 6,    x: 0.288, y: 0.385 },
  { mile: 8,    x: 0.208, y: 0.482 },
  { mile: 10,   x: 0.180, y: 0.592 },
  { mile: 11,   x: 0.152, y: 0.680 },
  { mile: 12,   x: 0.272, y: 0.645 },
  { mile: 13.1, x: 0.298, y: 0.595 },
  { mile: 16,   x: 0.382, y: 0.552 },
  { mile: 18,   x: 0.690, y: 0.568 },
  { mile: 20,   x: 0.800, y: 0.725 },
  { mile: 22,   x: 0.682, y: 0.838 },
  { mile: 23,   x: 0.597, y: 0.862 },
  { mile: 24,   x: 0.448, y: 0.880 },
  { mile: 25,   x: 0.362, y: 0.908 },
  { mile: 25.5, x: 0.295, y: 0.918 },
  { mile: 26,   x: 0.210, y: 0.922 },
  { mile: 26.2, x: 0.075, y: 0.922 },
]
