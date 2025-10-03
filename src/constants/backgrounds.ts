import type { BackgroundTheme } from '../types'

export const backgroundThemes: BackgroundTheme[] = [
  {
    id: 'glacier-haze',
    name: 'Glacier Haze',
    description: 'Cool twilight gradient with crisp white typography.',
    gradientStops: [
      { offset: 0, color: '#0F5CCB' },
      { offset: 0.55, color: '#5AA7FF' },
      { offset: 1, color: '#F2FAFF' }
    ],
    accentColor: '#FFFFFF',
    textColor: '#FFFFFF',
    subTextColor: 'rgba(255, 255, 255, 0.82)',
    panelColor: '#FFFFFF',
    panelOpacity: 0.14
  },
  {
    id: 'ember-sky',
    name: 'Ember Sky',
    description: 'Vibrant sunset blend with warm contrast accents.',
    gradientStops: [
      { offset: 0, color: '#F5515F' },
      { offset: 0.5, color: '#F9834C' },
      { offset: 1, color: '#FFE29F' }
    ],
    accentColor: '#FFFFFF',
    textColor: '#FFFFFF',
    subTextColor: 'rgba(255, 255, 255, 0.85)',
    panelColor: '#FFFFFF',
    panelOpacity: 0.16
  },
  {
    id: 'midnight-frost',
    name: 'Midnight Frost',
    description: 'Deep navy gradient with mint highlights for contrast.',
    gradientStops: [
      { offset: 0, color: '#0B1F3A' },
      { offset: 0.5, color: '#123E62' },
      { offset: 1, color: '#6EC1E4' }
    ],
    accentColor: '#F2FDFF',
    textColor: '#F2FDFF',
    subTextColor: 'rgba(242, 253, 255, 0.78)',
    panelColor: '#0C2844',
    panelOpacity: 0.35
  },
  {
    id: 'sage-dawn',
    name: 'Sage Dawn',
    description: 'Soft greens with a bright clean finish and charcoal text.',
    gradientStops: [
      { offset: 0, color: '#2E8C6A' },
      { offset: 0.65, color: '#9EE6C2' },
      { offset: 1, color: '#F8FFF5' }
    ],
    accentColor: '#23312B',
    textColor: '#23312B',
    subTextColor: 'rgba(35, 49, 43, 0.72)',
    panelColor: '#FFFFFF',
    panelOpacity: 0.25
  },
  {
    id: 'royal-amethyst',
    name: 'Royal Amethyst',
    description: 'Rich purple gradient with elegant white typography.',
    gradientStops: [
      { offset: 0, color: '#5B247A' },
      { offset: 0.5, color: '#8E44AD' },
      { offset: 1, color: '#D5A6F5' }
    ],
    accentColor: '#FFFFFF',
    textColor: '#FFFFFF',
    subTextColor: 'rgba(255, 255, 255, 0.85)',
    panelColor: '#FFFFFF',
    panelOpacity: 0.18
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    description: 'Tranquil teal-to-cyan blend with crisp white text.',
    gradientStops: [
      { offset: 0, color: '#006B7D' },
      { offset: 0.55, color: '#17A2B8' },
      { offset: 1, color: '#A8E6F5' }
    ],
    accentColor: '#FFFFFF',
    textColor: '#FFFFFF',
    subTextColor: 'rgba(255, 255, 255, 0.80)',
    panelColor: '#FFFFFF',
    panelOpacity: 0.16
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    description: 'Warm amber glow with deep brown text for contrast.',
    gradientStops: [
      { offset: 0, color: '#D97706' },
      { offset: 0.6, color: '#F59E0B' },
      { offset: 1, color: '#FEF3C7' }
    ],
    accentColor: '#451A03',
    textColor: '#451A03',
    subTextColor: 'rgba(69, 26, 3, 0.75)',
    panelColor: '#FFFFFF',
    panelOpacity: 0.22
  },
  {
    id: 'slate-professional',
    name: 'Slate Professional',
    description: 'Corporate gray gradient with clean white typography.',
    gradientStops: [
      { offset: 0, color: '#1E293B' },
      { offset: 0.5, color: '#475569' },
      { offset: 1, color: '#CBD5E1' }
    ],
    accentColor: '#FFFFFF',
    textColor: '#FFFFFF',
    subTextColor: 'rgba(255, 255, 255, 0.82)',
    panelColor: '#FFFFFF',
    panelOpacity: 0.15
  }
]
