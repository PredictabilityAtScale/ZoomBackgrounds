export interface CompanyInfo {
  companyName: string
  tagline: string
  website: string
}

export interface SocialLink {
  id: string
  label: string
  url: string
}

export interface City {
  city: string
  city_ascii: string
  lat: number
  lng: number
  country: string
  iso2: string
  iso3: string
  admin_name: string
}

export interface PersonRecord {
  id: string
  fullName: string
  role: string
  email: string
  pronouns: string
  location: string
  timezone: string
  socialLinks: SocialLink[]
  // Optional: selected city data for location-based features
  cityData?: City
}

export interface LogoAsset {
  dataUrl: string
  width: number
  height: number
  name: string
}

export interface GradientStop {
  offset: number
  color: string
}

export interface BackgroundTheme {
  id: string
  name: string
  description: string
  gradientStops: GradientStop[]
  accentColor: string
  textColor: string
  subTextColor: string
  panelColor: string
  panelOpacity: number
}

export interface BackdropRenderInput {
  person: PersonRecord
  company: CompanyInfo
  background: BackgroundTheme
  logo?: LogoAsset | null
  resolution?: {
    width: number
    height: number
  }
  mirror?: boolean
  fontScale?: number
  logoScale?: number
  mapScale?: number
}
