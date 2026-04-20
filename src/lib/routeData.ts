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

// Real GPS coordinates tracing the London Marathon route [lat, lng]
export const ROUTE_GPS: [number, number][] = [
  [51.4771,-0.0021],[51.4775,0.0012],[51.4782,0.0089],[51.4795,0.0210],
  [51.4834,0.0180],[51.4851,0.0050],[51.4834,-0.0098],[51.4791,-0.0213],
  [51.4756,-0.0423],[51.4775,-0.0502],[51.4850,-0.0538],[51.4941,-0.0571],
  [51.4985,-0.0560],[51.5020,-0.0647],[51.5055,-0.0754],[51.5075,-0.0600],
  [51.5065,-0.0423],[51.5034,-0.0290],[51.4993,-0.0139],[51.4930,-0.0065],
  [51.4893,0.0012],[51.4930,-0.0065],[51.4993,-0.0139],[51.5034,-0.0290],
  [51.5065,-0.0423],[51.5075,-0.0600],[51.5081,-0.0760],[51.5100,-0.0890],
  [51.5120,-0.1040],[51.5112,-0.1151],[51.5070,-0.1195],[51.5014,-0.1198],
  [51.5010,-0.1420],[51.5024,-0.1538],
]
