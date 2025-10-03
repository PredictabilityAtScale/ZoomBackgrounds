import type { City } from '../types'
import citiesRaw from '../assets/cities.csv?raw'

let cachedCities: City[] | null = null

/**
 * Parse the cities CSV and return an array of City objects.
 * Results are cached after first parse.
 */
export function parseCities(): City[] {
  if (cachedCities) {
    return cachedCities
  }

  const lines = citiesRaw.trim().split('\n')
  const cities: City[] = []

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (!line) continue

    // Parse CSV with support for quoted fields
    const fields = parseCSVLine(line)
    if (fields.length < 8) continue

    cities.push({
      city: fields[0],
      city_ascii: fields[1],
      lat: parseFloat(fields[2]),
      lng: parseFloat(fields[3]),
      country: fields[4],
      iso2: fields[5],
      iso3: fields[6],
      admin_name: fields[7]
    })
  }

  cachedCities = cities
  return cities
}

/**
 * Search cities by name or country with fuzzy matching.
 * Returns up to maxResults sorted by relevance.
 */
export function searchCities(
  query: string,
  maxResults = 10
): City[] {
  if (!query || query.trim().length === 0) {
    return []
  }

  const cities = parseCities()
  const normalizedQuery = query.toLowerCase().trim()
  const results: Array<{ city: City; score: number }> = []

  for (const city of cities) {
    const cityLower = city.city_ascii.toLowerCase()
    const countryLower = city.country.toLowerCase()
    const adminLower = city.admin_name.toLowerCase()

    let score = 0

    // Exact match gets highest priority
    if (cityLower === normalizedQuery) {
      score = 1000
    }
    // Starts with query
    else if (cityLower.startsWith(normalizedQuery)) {
      score = 500
    }
    // Contains query
    else if (cityLower.includes(normalizedQuery)) {
      score = 250
    }
    // Country or admin name match
    else if (
      countryLower.includes(normalizedQuery) ||
      adminLower.includes(normalizedQuery)
    ) {
      score = 100
    }

    if (score > 0) {
      results.push({ city, score })
    }
  }

  // Sort by score descending, then alphabetically
  results.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score
    }
    return a.city.city_ascii.localeCompare(b.city.city_ascii)
  })

  return results.slice(0, maxResults).map((r) => r.city)
}

/**
 * Get a city by exact name match (case-insensitive ASCII comparison).
 */
export function getCityByName(cityName: string): City | undefined {
  const cities = parseCities()
  const normalized = cityName.toLowerCase().trim()
  return cities.find((c) => c.city_ascii.toLowerCase() === normalized)
}

/**
 * Calculate an estimated timezone string from longitude.
 * This is a rough approximation - actual timezones have complex boundaries.
 * Returns format like "UTC+9" or "UTC-5".
 */
export function estimateTimezoneFromLongitude(lng: number): string {
  // Rough estimate: 15 degrees longitude ≈ 1 hour timezone offset
  const offset = Math.round(lng / 15)
  
  if (offset === 0) {
    return 'UTC'
  } else if (offset > 0) {
    return `UTC+${offset}`
  } else {
    return `UTC${offset}` // negative sign already included
  }
}

/**
 * Parse a single CSV line, handling quoted fields with commas.
 */
function parseCSVLine(line: string): string[] {
  const fields: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      fields.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  fields.push(current.trim())
  return fields
}
