import { useState, useRef, useEffect, type ChangeEvent, type KeyboardEvent } from 'react'
import type { City } from '../types'
import { searchCities, estimateTimezoneFromLongitude } from '../utils/cityParser'
import './CitySearch.css'

interface CitySearchProps {
  value: string
  onChange: (location: string, cityData?: City, timezone?: string) => void
  placeholder?: string
}

export function CitySearch({ value, onChange, placeholder = 'Search for a city...' }: CitySearchProps) {
  const [query, setQuery] = useState(value)
  const [results, setResults] = useState<City[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Sync query with external value changes
  useEffect(() => {
    setQuery(value)
  }, [value])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value
    setQuery(newQuery)
    setSelectedIndex(-1)

    if (newQuery.trim().length > 0) {
      const searchResults = searchCities(newQuery, 10)
      setResults(searchResults)
      setIsOpen(searchResults.length > 0)
    } else {
      setResults([])
      setIsOpen(false)
      onChange('', undefined)
    }
  }

  const handleSelectCity = (city: City) => {
    const locationString = `${city.city}, ${city.country}`
    const estimatedTimezone = estimateTimezoneFromLongitude(city.lng)
    
    setQuery(locationString)
    
    console.log('🏙️ City selected:', {
      city: city.city,
      country: city.country,
      lat: city.lat,
      lng: city.lng,
      timezone: estimatedTimezone,
      cityData: city
    })
    
    // Pass location, cityData, AND timezone in a SINGLE onChange call
    // This ensures all updates happen atomically in one state change
    onChange(locationString, city, estimatedTimezone)
    
    setIsOpen(false)
    setResults([])
    setSelectedIndex(-1)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) return

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        event.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        event.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleSelectCity(results[selectedIndex])
        }
        break
      case 'Escape':
        event.preventDefault()
        setIsOpen(false)
        setSelectedIndex(-1)
        break
    }
  }

  return (
    <div className="city-search" ref={wrapperRef}>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (results.length > 0) {
            setIsOpen(true)
          }
        }}
        placeholder={placeholder}
        className="city-search__input"
        autoComplete="off"
      />
      
      {isOpen && results.length > 0 && (
        <ul className="city-search__dropdown">
          {results.map((city, index) => (
            <li
              key={`${city.lat}-${city.lng}`}
              className={`city-search__item ${index === selectedIndex ? 'city-search__item--selected' : ''}`}
              onClick={() => handleSelectCity(city)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="city-search__item-main">
                <span className="city-search__city">{city.city}</span>
                <span className="city-search__country">{city.country}</span>
              </div>
              {city.admin_name && city.admin_name !== city.city && (
                <div className="city-search__item-sub">
                  {city.admin_name}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
