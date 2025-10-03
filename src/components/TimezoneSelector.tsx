import type { ChangeEvent } from 'react'

interface TimezoneSelectorProps {
  value: string
  onChange: (timezone: string) => void
}

// Comprehensive list of all UTC timezone offsets based on Wikipedia's official list
// Source: https://en.wikipedia.org/wiki/List_of_UTC_offsets
const TIMEZONES = [
  { value: 'UTC-12', label: 'UTC-12:00 (Baker Island, Howland Island)' },
  { value: 'UTC-11', label: 'UTC-11:00 (American Samoa, Niue)' },
  { value: 'UTC-10', label: 'UTC-10:00 (Hawaii, Cook Islands)' },
  { value: 'UTC-9:30', label: 'UTC-09:30 (Marquesas Islands)' },
  { value: 'UTC-9', label: 'UTC-09:00 (Alaska, Gambier Islands)' },
  { value: 'UTC-8', label: 'UTC-08:00 (Pacific Time - Los Angeles, Seattle, Vancouver)' },
  { value: 'UTC-7', label: 'UTC-07:00 (Mountain Time - Denver, Calgary, Phoenix)' },
  { value: 'UTC-6', label: 'UTC-06:00 (Central Time - Chicago, Mexico City, Winnipeg)' },
  { value: 'UTC-5', label: 'UTC-05:00 (Eastern Time - New York, Toronto, Lima, Bogotá)' },
  { value: 'UTC-4', label: 'UTC-04:00 (Atlantic Time - Halifax, Santiago, Caracas)' },
  { value: 'UTC-3:30', label: 'UTC-03:30 (Newfoundland)' },
  { value: 'UTC-3', label: 'UTC-03:00 (São Paulo, Buenos Aires, Montevideo)' },
  { value: 'UTC-2', label: 'UTC-02:00 (South Georgia, Fernando de Noronha)' },
  { value: 'UTC-1', label: 'UTC-01:00 (Azores, Cape Verde)' },
  { value: 'UTC', label: 'UTC±00:00 (London, Lisbon, Dublin, Accra, Reykjavik)' },
  { value: 'UTC+1', label: 'UTC+01:00 (Paris, Berlin, Rome, Madrid, Lagos, Casablanca)' },
  { value: 'UTC+2', label: 'UTC+02:00 (Cairo, Athens, Helsinki, Johannesburg, Kyiv)' },
  { value: 'UTC+3', label: 'UTC+03:00 (Moscow, Istanbul, Riyadh, Nairobi, Baghdad)' },
  { value: 'UTC+3:30', label: 'UTC+03:30 (Tehran)' },
  { value: 'UTC+4', label: 'UTC+04:00 (Dubai, Baku, Tbilisi, Samara)' },
  { value: 'UTC+4:30', label: 'UTC+04:30 (Kabul)' },
  { value: 'UTC+5', label: 'UTC+05:00 (Karachi, Tashkent, Yekaterinburg)' },
  { value: 'UTC+5:30', label: 'UTC+05:30 (India - Delhi, Mumbai, Bangalore, Colombo)' },
  { value: 'UTC+5:45', label: 'UTC+05:45 (Kathmandu)' },
  { value: 'UTC+6', label: 'UTC+06:00 (Dhaka, Almaty, Bishkek, Omsk)' },
  { value: 'UTC+6:30', label: 'UTC+06:30 (Yangon, Cocos Islands)' },
  { value: 'UTC+7', label: 'UTC+07:00 (Bangkok, Jakarta, Ho Chi Minh City, Krasnoyarsk)' },
  { value: 'UTC+8', label: 'UTC+08:00 (Singapore, Hong Kong, Beijing, Perth, Manila)' },
  { value: 'UTC+8:45', label: 'UTC+08:45 (Eucla)' },
  { value: 'UTC+9', label: 'UTC+09:00 (Tokyo, Seoul, Pyongyang)' },
  { value: 'UTC+9:30', label: 'UTC+09:30 (Adelaide, Darwin)' },
  { value: 'UTC+10', label: 'UTC+10:00 (Sydney, Melbourne, Brisbane, Vladivostok)' },
  { value: 'UTC+10:30', label: 'UTC+10:30 (Lord Howe Island)' },
  { value: 'UTC+11', label: 'UTC+11:00 (Solomon Islands, New Caledonia, Norfolk Island)' },
  { value: 'UTC+12', label: 'UTC+12:00 (Auckland, Fiji, Petropavlovsk-Kamchatsky)' },
  { value: 'UTC+12:45', label: 'UTC+12:45 (Chatham Islands)' },
  { value: 'UTC+13', label: 'UTC+13:00 (Tonga, Samoa, Tokelau)' },
  { value: 'UTC+14', label: 'UTC+14:00 (Kiribati Line Islands)' }
]

export function TimezoneSelector({ value, onChange }: TimezoneSelectorProps) {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value)
  }

  return (
    <select 
      value={value} 
      onChange={handleChange}
      className="timezone-selector"
    >
      <option value="">Select timezone...</option>
      {TIMEZONES.map((tz) => (
        <option key={tz.value} value={tz.value}>
          {tz.label}
        </option>
      ))}
    </select>
  )
}
