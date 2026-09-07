// Free Global Geocoding & City Auto-complete Service using Photon / OpenStreetMap API

// Popular fallback global travel hubs for instantaneous response
const POPULAR_HUBS = [
  { name: 'New Delhi', state: 'Delhi', country: 'India', countryCode: 'IN', display: 'New Delhi, India (DEL)' },
  { name: 'Mumbai', state: 'Maharashtra', country: 'India', countryCode: 'IN', display: 'Mumbai, India (BOM)' },
  { name: 'Bengaluru', state: 'Karnataka', country: 'India', countryCode: 'IN', display: 'Bengaluru, India (BLR)' },
  { name: 'Hyderabad', state: 'Telangana', country: 'India', countryCode: 'IN', display: 'Hyderabad, India (HYD)' },
  { name: 'Kolkata', state: 'West Bengal', country: 'India', countryCode: 'IN', display: 'Kolkata, India (CCU)' },
  { name: 'Chennai', state: 'Tamil Nadu', country: 'India', countryCode: 'IN', display: 'Chennai, India (MAA)' },
  { name: 'Ahmedabad', state: 'Gujarat', country: 'India', countryCode: 'IN', display: 'Ahmedabad, India (AMD)' },
  { name: 'Jaipur', state: 'Rajasthan', country: 'India', countryCode: 'IN', display: 'Jaipur, India (JAI)' },
  { name: 'Chandigarh', state: 'Punjab', country: 'India', countryCode: 'IN', display: 'Chandigarh, India (IXC)' },
  { name: 'Dubai', state: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', display: 'Dubai, UAE (DXB)' },
  { name: 'London', state: 'England', country: 'United Kingdom', countryCode: 'GB', display: 'London, UK (LHR)' },
  { name: 'New York', state: 'New York', country: 'United States', countryCode: 'US', display: 'New York, USA (JFK)' },
  { name: 'Paris', state: 'Île-de-France', country: 'France', countryCode: 'FR', display: 'Paris, France (CDG)' },
  { name: 'Singapore', state: 'Central', country: 'Singapore', countryCode: 'SG', display: 'Singapore (SIN)' },
  { name: 'Sydney', state: 'New South Wales', country: 'Australia', countryCode: 'AU', display: 'Sydney, Australia (SYD)' },
  { name: 'Tokyo', state: 'Kanto', country: 'Japan', countryCode: 'JP', display: 'Tokyo, Japan (HND/NRT)' },
  { name: 'Toronto', state: 'Ontario', country: 'Canada', countryCode: 'CA', display: 'Toronto, Canada (YYZ)' },
  { name: 'Frankfurt', state: 'Hesse', country: 'Germany', countryCode: 'DE', display: 'Frankfurt, Germany (FRA)' },
]

/**
 * Search cities and countries across the world using free geocoding API with local cache
 */
export const searchGlobalLocations = async (query) => {
  if (!query || query.trim().length < 2) {
    return POPULAR_HUBS.slice(0, 8)
  }

  const cleanQ = query.trim().toLowerCase()

  try {
    // 1. First try Photon OpenStreetMap Geocoding API (Fast, Free, No API key required)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3500)

    const response = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=7&osm_tag=place:city&osm_tag=place:town&osm_tag=place:country`,
      { signal: controller.signal }
    )
    clearTimeout(timeoutId)

    if (response.ok) {
      const data = await response.json()
      if (data.features && data.features.length > 0) {
        const results = data.features.map((f) => {
          const props = f.properties || {}
          const name = props.name || query
          const state = props.state || props.county || ''
          const country = props.country || ''
          const countryCode = props.countrycode || ''
          
          let display = name
          if (state && state !== name) display += `, ${state}`
          if (country) display += `, ${country}`

          return {
            name,
            state,
            country,
            countryCode,
            display,
            lat: f.geometry?.coordinates?.[1],
            lon: f.geometry?.coordinates?.[0],
          }
        })

        // De-duplicate by display string
        const uniqueResults = []
        const seen = new Set()
        for (const item of results) {
          if (!seen.has(item.display)) {
            seen.add(item.display)
            uniqueResults.push(item)
          }
        }
        if (uniqueResults.length > 0) return uniqueResults
      }
    }
  } catch (err) {
    // Graceful fallback on network error or abort
    console.warn('Live geocoding network notice, using local index:', err.message)
  }

  // Local fallback search if network API is unreachable
  return POPULAR_HUBS.filter(
    (hub) =>
      hub.name.toLowerCase().includes(cleanQ) ||
      hub.country.toLowerCase().includes(cleanQ) ||
      hub.display.toLowerCase().includes(cleanQ)
  )
}

/**
 * Helper to extract country name from departure location string
 */
export const extractCountry = (locationStr = '') => {
  if (!locationStr) return 'India'
  const str = locationStr.toLowerCase()

  if (str.includes('india') || str.includes('delhi') || str.includes('mumbai') || str.includes('bengaluru') || str.includes('jaipur') || str.includes('kolkata') || str.includes('chennai') || str.includes('hyderabad') || str.includes('ahmedabad') || str.includes('chandigarh')) {
    return 'India'
  }
  if (str.includes('united states') || str.includes('usa') || str.includes('new york') || str.includes('california') || str.includes('texas')) {
    return 'United States'
  }
  if (str.includes('united kingdom') || str.includes('uk') || str.includes('london') || str.includes('england') || str.includes('scotland')) {
    return 'United Kingdom'
  }
  if (str.includes('united arab emirates') || str.includes('uae') || str.includes('dubai') || str.includes('abu dhabi')) {
    return 'United Arab Emirates'
  }
  if (str.includes('france') || str.includes('paris')) return 'France'
  if (str.includes('switzerland') || str.includes('zurich') || str.includes('geneva')) return 'Switzerland'
  if (str.includes('singapore')) return 'Singapore'
  if (str.includes('australia') || str.includes('sydney') || str.includes('melbourne')) return 'Australia'
  if (str.includes('japan') || str.includes('tokyo') || str.includes('kyoto')) return 'Japan'
  if (str.includes('canada') || str.includes('toronto')) return 'Canada'
  if (str.includes('germany') || str.includes('berlin') || str.includes('frankfurt')) return 'Germany'
  if (str.includes('italy') || str.includes('rome') || str.includes('milan')) return 'Italy'
  if (str.includes('indonesia') || str.includes('bali')) return 'Indonesia'
  if (str.includes('maldives')) return 'Maldives'

  // Extract after last comma
  const parts = locationStr.split(',')
  if (parts.length > 1) {
    return parts[parts.length - 1].replace(/\(.*\)/, '').trim()
  }
  return locationStr.trim()
}
