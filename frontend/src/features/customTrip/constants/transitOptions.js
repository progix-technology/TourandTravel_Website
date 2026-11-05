// Bus Category Options (for 200 - 300 km routes)
export const BUS_OPTIONS = [
  { id: 'volvo_ac_sleeper', name: 'Volvo Multi-Axle AC Sleeper', farePerPerson: 1400, desc: 'Luxury Reclining Sleepers with USB & Blanket' },
  { id: 'bharatbenz_semi', name: 'BharatBenz AC Semi-Sleeper', farePerPerson: 1100, desc: 'Ergonomic seating with push-back calf support' },
  { id: 'scania_seater', name: 'Scania Executive AC Seater', farePerPerson: 950, desc: 'Express highway transit with air-suspension' },
  { id: 'state_superfast', name: 'State Deluxe AC Express', farePerPerson: 750, desc: 'Direct state highways intercity link' },
]

// Train Category Options (for > 300 km routes)
export const TRAIN_OPTIONS = [
  { id: 'train_1ac', name: '1st AC (First Class Sleeper / Coupe)', farePerPerson: 3600, desc: 'Private lockable cabin, VIP gourmet bedding' },
  { id: 'train_2ac', name: '2nd AC (Two-Tier Sleeper)', farePerPerson: 2200, desc: 'Spacious berths with privacy curtains & charging' },
  { id: 'train_3ac', name: '3rd AC (Three-Tier Comfort)', farePerPerson: 1550, desc: 'Standard central AC sleeper with clean linen' },
  { id: 'train_sleeper', name: 'Sleeper Class (SL Non-AC)', farePerPerson: 750, desc: 'Classic scenic open-window budget travel' },
  { id: 'train_vande_bharat', name: 'Vande Bharat / Tejas Chair Car', farePerPerson: 2600, desc: 'High-speed 160 km/h executive chair car with meals' },
]

// Airplane Flight Options (for > 300 km routes)
export const FLIGHT_OPTIONS = [
  { id: 'flight_economy', name: 'Domestic / International Economy', farePerPerson: 5400, desc: 'Direct flight with 15kg check-in & 7kg cabin baggage' },
  { id: 'flight_business', name: 'Business Class / Fast-Track VIP', farePerPerson: 14500, desc: 'Priority boarding, airport lounge access & lie-flat seat' },
]

export const DURATION_OPTIONS = [
  '3–5 Days',
  '6–8 Days',
  '9–12 Days',
  '14+ Days'
]

