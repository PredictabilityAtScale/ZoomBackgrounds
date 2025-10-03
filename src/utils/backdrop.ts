import type { BackdropRenderInput, LogoAsset } from '../types'

const DEFAULT_RESOLUTION = {
  width: 1920,
  height: 1080
}

let worldMapImagePromise: Promise<HTMLImageElement> | null = null

function getWorldMapImage(): Promise<HTMLImageElement> {
  if (!worldMapImagePromise) {
    worldMapImagePromise = loadImage('/world.svg')
  }
  return worldMapImagePromise
}

export async function generateBackdropDataUrl(
  input: BackdropRenderInput
): Promise<string> {
  const { width, height } = {
    ...DEFAULT_RESOLUTION,
    ...input.resolution
  }
  const shouldMirror = input.mirror ?? true

  const baseCanvas = document.createElement('canvas')
  baseCanvas.width = width
  baseCanvas.height = height

  const baseCtx = baseCanvas.getContext('2d')
  if (!baseCtx) {
    throw new Error('Unable to access canvas context')
  }

  await ensureFontsReady()

  paintGradient(baseCtx, input.background, width, height)

  // Draw logo first if present
  let companyStartY = height * 0.045
  if (input.logo) {
    const logoBottom = await drawLogo(baseCtx, input.logo, input.logoScale ?? 1.0, width, height)
    companyStartY = logoBottom + 12 // Add gap after logo
  }

  // Always render with standard layout (mirror: false)
  const standardInput = { ...input, mirror: false }
  await drawTypography(baseCtx, standardInput, width, height, companyStartY)

  if (!shouldMirror) {
    return baseCanvas.toDataURL('image/png', 1)
  }

  // Flip the entire canvas for mirrored version
  const mirroredCanvas = document.createElement('canvas')
  mirroredCanvas.width = width
  mirroredCanvas.height = height
  const mirroredCtx = mirroredCanvas.getContext('2d')
  if (!mirroredCtx) {
    throw new Error('Unable to access mirrored canvas context')
  }

  mirroredCtx.translate(width, 0)
  mirroredCtx.scale(-1, 1)
  mirroredCtx.drawImage(baseCanvas, 0, 0)

  return mirroredCanvas.toDataURL('image/png', 1)
}

export async function generateBackdropBlob(
  input: BackdropRenderInput
): Promise<Blob> {
  const dataUrl = await generateBackdropDataUrl(input)
  const response = await fetch(dataUrl)
  return response.blob()
}

async function ensureFontsReady(): Promise<void> {
  if ('fonts' in document) {
    try {
      await (document as Document & { fonts: FontFaceSet }).fonts.ready
    } catch (error) {
      console.warn('Font loading warning:', error)
    }
  }
}

function paintGradient(
  ctx: CanvasRenderingContext2D,
  background: BackdropRenderInput['background'],
  width: number,
  height: number
): void {
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  background.gradientStops.forEach((stop) => {
    gradient.addColorStop(stop.offset, stop.color)
  })
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
}

async function drawLogo(
  ctx: CanvasRenderingContext2D,
  logo: LogoAsset,
  logoScale: number,
  width: number,
  height: number
): Promise<number> {
  const img = await loadImage(logo.dataUrl)
  const margin = height * 0.045
  
  // Apply logo scale - remove the Math.min(..., 1) to allow scaling up
  const baseMaxWidth = width * 0.22
  const baseMaxHeight = height * 0.18
  const maxWidth = baseMaxWidth * logoScale
  const maxHeight = baseMaxHeight * logoScale
  const scale = Math.min(maxWidth / img.width, maxHeight / img.height)
  const renderWidth = img.width * scale
  const renderHeight = img.height * scale

  const logoY = margin

  ctx.save()
  ctx.globalAlpha = 0.95
  ctx.drawImage(
    img,
    width - renderWidth - margin,
    logoY,
    renderWidth,
    renderHeight
  )
  ctx.restore()
  
  // Return the bottom position of the logo
  return logoY + renderHeight
}

async function drawTypography(
  ctx: CanvasRenderingContext2D,
  input: BackdropRenderInput,
  width: number,
  height: number,
  companyStartY: number
): Promise<void> {
  const { person, company, background } = input
  const fontScale = input.fontScale ?? 1.0
  const margin = height * 0.045
  const marginX = margin
  const marginY = margin
  const maxWidth = width * 0.62
  const topLimit = marginY + height * 0.34
  let currentY = marginY

  ctx.textBaseline = 'top'

  // Company info on RIGHT: Company Name, URL, then Tagline
  const rightX = width - margin
  const rightWidth = Math.max(width * 0.2, width * 0.24)
  let companyY = companyStartY
  
  ctx.save()
  ctx.textAlign = 'right'
  
  // Company Name
  const companyName = company.companyName.trim()
  if (companyName) {
    const companyFontSize = Math.round(36 * fontScale)
    const companyFont = `600 ${companyFontSize}px "Inter", "Segoe UI", sans-serif`
    ctx.fillStyle = background.textColor
    ctx.font = companyFont
    ctx.fillText(companyName, rightX, companyY)
    companyY += measureFontHeight(companyFont) + 4
  }
  
  // URL
  const website = company.website.trim()
  if (website) {
    const urlFontSize = Math.round(36 * fontScale)
    ctx.font = `400 ${urlFontSize}px "Inter", "Segoe UI", sans-serif`
    ctx.fillStyle = background.subTextColor
    ctx.fillText(stripProtocol(website), rightX, companyY)
    companyY += measureFontHeight(ctx.font) + 8
  }
  
  // Tagline
  const tagline = company.tagline.trim()
  if (tagline) {
    const taglineFontSize = Math.round(26 * fontScale)
    ctx.font = `400 ${taglineFontSize}px "Inter", "Segoe UI", sans-serif`
    ctx.fillStyle = background.subTextColor
    wrapTextRight(
      ctx,
      tagline,
      rightX,
      companyY,
      rightWidth,
      Math.round(32 * fontScale)
    )
  }
  
  ctx.restore()

  const nameText = person.fullName.trim() || 'Team Member'
  const nameFontSize = Math.round(78 * fontScale)
  const nameFont = fitText(
    ctx,
    nameText,
    `700 ${nameFontSize}px "Inter", "Segoe UI", sans-serif`,
    maxWidth
  )
  ctx.fillStyle = background.textColor
  ctx.font = nameFont
  ctx.fillText(nameText, marginX, currentY)
  const nameHeight = measureFontHeight(nameFont)
  const nameWidth = ctx.measureText(nameText).width

  const pronouns = person.pronouns.trim()
  if (pronouns) {
    const pronounFontSize = Math.round(30 * fontScale)
    const pronounFont = `500 ${pronounFontSize}px "Inter", "Segoe UI", sans-serif`
    const pronounGap = width * 0.012
    ctx.font = pronounFont
    ctx.fillStyle = background.subTextColor
    const pronounY = currentY + nameHeight - measureFontHeight(pronounFont)
    ctx.fillText(`(${pronouns})`, marginX + nameWidth + pronounGap, pronounY)
  }

  currentY += nameHeight + 10

  const roleFontSize = Math.round(36 * fontScale)
  const roleFont = fitText(
    ctx,
    person.role || '',
    `600 ${roleFontSize}px "Inter", "Segoe UI", sans-serif`,
    maxWidth
  )
  if (person.role) {
    ctx.fillStyle = background.subTextColor
    ctx.font = roleFont
    ctx.fillText(person.role, marginX, currentY)
    currentY += measureFontHeight(roleFont) + 8
  }

  const infoLines = buildInfoLines(person)
  const detailFontSize = Math.round(26 * fontScale)
  const detailFont = `500 ${detailFontSize}px "Inter", "Segoe UI", sans-serif`
  const detailLineHeight = measureFontHeight(detailFont) + 6
  const detailRenderables: InfoLine[] = []
  let previewY = currentY

  infoLines.forEach((line) => {
    if (previewY + detailLineHeight > topLimit) {
      return
    }
    detailRenderables.push(line)
    previewY += detailLineHeight
  })

  const socialLines = buildSocialLines(person)
  const socialFontSize = Math.round(24 * fontScale)
  const socialFont = `500 ${socialFontSize}px "Inter", "Segoe UI", sans-serif`
  const socialHeight = measureFontHeight(socialFont) + 6
  const socialRenderables: string[] = []
  if (socialLines.length > 0 && previewY < topLimit) {
    socialLines.forEach((line) => {
      if (previewY + socialHeight > topLimit) {
        return
      }
      socialRenderables.push(line)
      previewY += socialHeight
    })
  }

  ctx.font = detailFont
  ctx.fillStyle = background.textColor
  detailRenderables.forEach((line) => {
    ctx.fillText(line.text, marginX, currentY)
    currentY += detailLineHeight
  })

  if (socialRenderables.length > 0 && currentY < topLimit) {
    ctx.font = socialFont
    ctx.fillStyle = background.subTextColor
    socialRenderables.forEach((line) => {
      if (currentY + socialHeight > topLimit) {
        return
      }
      ctx.fillText(line, marginX, currentY)
      currentY += socialHeight
    })
  }

  const hasLocationDetail = Boolean(person.location.trim() || person.timezone.trim())
  if (hasLocationDetail) {
    const mapScale = input.mapScale ?? 1.0
    const globeGap = Math.max(detailLineHeight * 0.5, height * 0.02)
    const globeTop = currentY + globeGap
    // More flexible height limit - allow map to render below topLimit if needed
    const maxBottom = height * 0.65 // Allow map up to 65% of canvas height
    const availableHeight = maxBottom - globeTop
    const minMapHeight = height * 0.08 * mapScale // Minimum map height scaled
    
    if (availableHeight > minMapHeight && globeTop < maxBottom) {
      const baseHeight = Math.max(height * 0.14, Math.min(availableHeight, height * 0.28))
      const globeHeight = baseHeight * mapScale
      const globeWidth = maxWidth * mapScale
      await drawLocationBackdrop(
        ctx,
        {
          x: marginX,
          y: globeTop,
          width: globeWidth,
          height: globeHeight,
          dominantColor: background.textColor,
          accentColor: background.subTextColor,
          locationText: person.location,
          timezoneText: person.timezone,
          fontScale
        }
      )
    }
  }
}

function measureFontHeight(font: string): number {
  const match = /\s(\d+)px/.exec(font)
  return match ? Number.parseInt(match[1], 10) : 48
}

function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  baseFont: string,
  maxWidth: number
): string {
  if (!text) return baseFont
  const fontParts = baseFont.split(' ')
  const sizeIndex = fontParts.findIndex((part) => part.endsWith('px'))
  if (sizeIndex === -1) {
    return baseFont
  }
  const sizePx = Number.parseInt(fontParts[sizeIndex], 10)
  let currentSize = sizePx
  ctx.font = baseFont
  while (ctx.measureText(text).width > maxWidth && currentSize > 32) {
    currentSize -= 2
    fontParts[sizeIndex] = `${currentSize}px`
    ctx.font = fontParts.join(' ')
  }
  return fontParts.join(' ')
}

interface InfoLine {
  text: string
}

function buildInfoLines(person: BackdropRenderInput['person']): InfoLine[] {
  const lines: InfoLine[] = []

  const email = person.email.trim()
  if (email) {
    lines.push({ text: email })
  }

  return lines.slice(0, 4)
}

function buildSocialLines(person: BackdropRenderInput['person']): string[] {
  return person.socialLinks
    .filter((link) => link.label.trim() || link.url.trim())
    .slice(0, 3)
    .map((link) => {
      const label = link.label.trim() || 'Link'
      const url = link.url.trim()
      return url ? `${label}: ${stripProtocol(url)}` : label
    })
}

interface LocationBackdropOptions {
  x: number
  y: number
  width: number
  height: number
  dominantColor: string
  accentColor: string
  locationText: string
  timezoneText: string
  fontScale: number
}

async function drawLocationBackdrop(
  ctx: CanvasRenderingContext2D,
  {
    x,
    y,
    width,
    height,
    dominantColor,
    accentColor,
    locationText,
    timezoneText,
    fontScale
  }: LocationBackdropOptions
): Promise<void> {
  const hasLocation = locationText.trim() || timezoneText.trim()
  if (!hasLocation || width <= 0 || height <= 0) return

  const locationLabel = locationText.trim()
  const timezoneLabel = timezoneText.trim()
  const estimated = estimateCoordinates(locationText, timezoneText)

  const padding = Math.max(height * 0.1, 16)
  const innerWidth = Math.max(width - padding * 2, 180)
  const aspectRatio = 2.2

  let mapWidth = Math.min(innerWidth * 0.5, width * 0.38)
  let mapHeight = mapWidth / aspectRatio

  const textSpacing = Math.max(padding * 0.4, 12)
  const minTextBlock =
    (locationLabel ? 32 : 0) +
    (locationLabel && timezoneLabel ? 6 : 0) +
    (timezoneLabel ? 28 : 0)

  const panelWidth = Math.min(width, mapWidth + padding * 2)
  const panelHeight = mapHeight + textSpacing + minTextBlock + padding * 2
  const panelRadius = Math.min(panelHeight * 0.12, 16)
  const panelX = x
  const panelY = y

  drawRoundedPanel(
    ctx,
    panelX,
    panelY,
    panelWidth,
    panelHeight,
    panelRadius,
    applyOpacity(accentColor, 0.15),
    applyOpacity(dominantColor, 0.25)
  )

  const mapX = panelX + padding
  const mapY = panelY + padding
  const mapRect: MapRect = {
    x: mapX,
    y: mapY,
    width: mapWidth,
    height: mapHeight
  }

  const mapImage = await getWorldMapImage().catch(() => null)
  const mapRadius = Math.min(mapHeight * 0.18, 20)

  if (mapImage) {
    ctx.save()
    traceRoundedRect(ctx, mapRect.x, mapRect.y, mapRect.width, mapRect.height, mapRadius)
    ctx.clip()
    ctx.globalAlpha = 0.96
    ctx.drawImage(mapImage, mapRect.x, mapRect.y, mapRect.width, mapRect.height)
    ctx.restore()

    ctx.save()
    ctx.strokeStyle = applyOpacity(dominantColor, 0.35)
    ctx.lineWidth = Math.max(mapRect.height * 0.018, 1.4)
    traceRoundedRect(ctx, mapRect.x, mapRect.y, mapRect.width, mapRect.height, mapRadius)
    ctx.stroke()
    ctx.restore()
  } else {
    ctx.save()
    ctx.fillStyle = applyOpacity(accentColor, 0.25)
    traceRoundedRect(ctx, mapRect.x, mapRect.y, mapRect.width, mapRect.height, mapRadius)
    ctx.fill()
    ctx.restore()
  }

  if (estimated) {
    drawFlagMarker(
      ctx,
      mapRect,
      estimated
    )
  }

  const textCenter = mapRect.x + mapRect.width / 2
  let textY = mapRect.y + mapRect.height + textSpacing

  ctx.save()
  ctx.textAlign = 'center'
  ctx.fillStyle = dominantColor
  const locationFontSize = Math.round(24 * fontScale)
  ctx.font = `600 ${locationFontSize}px "Inter", "Segoe UI", sans-serif`

  if (locationLabel) {
    textY = wrapTextCentered(
      ctx,
      locationLabel,
      textCenter,
      textY,
      mapRect.width,
      30
    )
  }

  if (timezoneLabel) {
    const timezoneFontSize = Math.round(22 * fontScale)
    ctx.font = `500 ${timezoneFontSize}px "Inter", "Segoe UI", sans-serif`
    ctx.fillStyle = accentColor
    wrapTextCentered(
      ctx,
      timezoneLabel,
      textCenter,
      textY + (locationLabel ? 4 : 0),
      mapRect.width,
      28
    )
  }

  ctx.restore()
}

interface MapRect {
  x: number
  y: number
  width: number
  height: number
}

interface GeoPoint {
  lat: number
  lng: number
}

function traceRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  const r = Math.max(4, Math.min(radius, width / 2, height / 2))
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + width - r, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + r)
  ctx.lineTo(x + width, y + height - r)
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height)
  ctx.lineTo(x + r, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function drawRoundedPanel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fillStyle: string,
  strokeStyle: string
): void {
  ctx.save()
  ctx.fillStyle = fillStyle
  ctx.strokeStyle = strokeStyle
  ctx.lineWidth = Math.max(height * 0.015, 1.4)
  traceRoundedRect(ctx, x, y, width, height, radius)
  ctx.fill()
  ctx.stroke()
  ctx.restore()
}

function drawFlagMarker(
  ctx: CanvasRenderingContext2D,
  rect: MapRect,
  point: GeoPoint
): void {
  const projected = projectFlatPoint(point.lat, point.lng, rect)
  const baseRadius = Math.max(rect.width * 0.01, 3.5)
  const poleHeight = Math.max(rect.height * 0.22, 18)
  const flagWidth = Math.max(rect.width * 0.035, 12)
  const flagHeight = Math.max(flagWidth * 0.6, 8)

  ctx.save()
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  // base halo for visibility
  ctx.beginPath()
  ctx.arc(projected.x, projected.y, baseRadius * 3.5, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
  ctx.shadowBlur = baseRadius * 2
  ctx.fill()

  // pole
  ctx.shadowBlur = 0
  ctx.strokeStyle = '#1a1a1a'
  ctx.lineWidth = Math.max(rect.width * 0.003, 2)
  ctx.beginPath()
  ctx.moveTo(projected.x, projected.y)
  ctx.lineTo(projected.x, projected.y - poleHeight)
  ctx.stroke()

  // flag body - bright red
  const flagTop = projected.y - poleHeight
  ctx.fillStyle = '#FF3B30'
  ctx.strokeStyle = '#8B0000'
  ctx.lineWidth = Math.max(rect.width * 0.002, 1.5)
  ctx.beginPath()
  ctx.moveTo(projected.x, flagTop)
  ctx.lineTo(projected.x + flagWidth, flagTop + flagHeight * 0.5)
  ctx.lineTo(projected.x, flagTop + flagHeight)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // base pin
  ctx.beginPath()
  ctx.arc(projected.x, projected.y, baseRadius * 1.2, 0, Math.PI * 2)
  ctx.fillStyle = '#1a1a1a'
  ctx.fill()
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = Math.max(rect.width * 0.002, 1.2)
  ctx.stroke()

  ctx.restore()
}

function projectFlatPoint(lat: number, lng: number, rect: MapRect): { x: number; y: number } {
  const clampedLat = Math.max(-85, Math.min(85, lat))
  const normalizedLng = ((lng + 180) % 360 + 360) % 360 - 180
  const xRatio = (normalizedLng + 180) / 360
  const yRatio = (90 - clampedLat) / 180
  return {
    x: rect.x + xRatio * rect.width,
    y: rect.y + yRatio * rect.height
  }
}

function estimateCoordinates(
  locationText: string,
  timezoneText: string
): GeoPoint | null {
  const location = locationText.trim()
  const timezone = timezoneText.trim()
  if (!location && !timezone) {
    return null
  }

  const coordinateMatch = location.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/)
  if (coordinateMatch) {
    return {
      lat: Number.parseFloat(coordinateMatch[1]!),
      lng: Number.parseFloat(coordinateMatch[2]!)
    }
  }

  const normalized = location.toLowerCase()
  let lat: number | null = null
  let lng: number | null = null

  // First try to match specific cities
  for (const entry of PLACE_COORDINATES) {
    if (entry.keywords.some((keyword) => normalized.includes(keyword))) {
      lat = entry.lat
      lng = entry.lng
      break
    }
  }

  // If no city match, try to match countries
  if (lat === null || lng === null) {
    for (const country of COUNTRY_COORDINATES) {
      if (country.keywords.some((keyword) => normalized.includes(keyword))) {
        lat = country.lat
        lng = country.lng
        break
      }
    }
  }

  // If still no match, use timezone to estimate longitude
  if (lng === null) {
    const tzOffset = parseTimezoneOffset(timezone)
    if (tzOffset !== null) {
      lng = tzOffset * 15
    }
  }

  // Default to center of map if all else fails
  if (lat === null) lat = 0
  if (lng === null) lng = 0

  return { lat, lng }
}

function parseTimezoneOffset(timezone: string): number | null {
  const match = timezone.match(/(?:UTC|GMT)\s*([+-])\s*(\d{1,2})(?::(\d{2}))?/i)
  if (!match) return null
  const sign = match[1] === '-' ? -1 : 1
  const hours = Number.parseInt(match[2] ?? '0', 10)
  const minutes = Number.parseInt(match[3] ?? '0', 10)
  const offset = hours + minutes / 60
  return sign * offset
}

function applyOpacity(color: string, alpha: number): string {
  const hex = color.trim()
  if (hex.startsWith('#')) {
    const value = hex.slice(1)
    const bigint = Number.parseInt(value.length === 3 ? value.repeat(2) : value, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }
  if (hex.startsWith('rgb')) {
    return hex.replace(/rgba?\(([^)]+)\)/, (_match, contents) => {
      const parts = contents.split(',').map((part: string) => part.trim())
      const [r, g, b] = parts
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    })
  }
  return `rgba(255, 255, 255, ${alpha})`
}

interface PlaceCoordinate {
  keywords: string[]
  lat: number
  lng: number
}

const PLACE_COORDINATES: PlaceCoordinate[] = [
  // North America
  { keywords: ['seattle', 'washington'], lat: 47.61, lng: -122.33 },
  { keywords: ['san francisco', 'bay area'], lat: 37.77, lng: -122.42 },
  { keywords: ['san diego'], lat: 32.72, lng: -117.16 },
  { keywords: ['los angeles', 'la'], lat: 34.05, lng: -118.24 },
  { keywords: ['portland', 'oregon'], lat: 45.52, lng: -122.68 },
  { keywords: ['denver', 'colorado'], lat: 39.74, lng: -104.99 },
  { keywords: ['austin', 'texas'], lat: 30.27, lng: -97.74 },
  { keywords: ['dallas', 'texas'], lat: 32.78, lng: -96.80 },
  { keywords: ['houston', 'texas'], lat: 29.76, lng: -95.37 },
  { keywords: ['chicago', 'illinois'], lat: 41.88, lng: -87.63 },
  { keywords: ['new york', 'nyc'], lat: 40.71, lng: -74.01 },
  { keywords: ['boston', 'massachusetts'], lat: 42.36, lng: -71.06 },
  { keywords: ['miami', 'florida'], lat: 25.76, lng: -80.19 },
  { keywords: ['atlanta', 'georgia'], lat: 33.75, lng: -84.39 },
  { keywords: ['toronto', 'canada'], lat: 43.65, lng: -79.38 },
  { keywords: ['vancouver', 'canada'], lat: 49.28, lng: -123.12 },
  { keywords: ['montreal', 'canada'], lat: 45.50, lng: -73.57 },
  // Europe
  { keywords: ['london', 'uk', 'united kingdom'], lat: 51.51, lng: -0.13 },
  { keywords: ['berlin', 'germany'], lat: 52.52, lng: 13.405 },
  { keywords: ['paris', 'france'], lat: 48.86, lng: 2.35 },
  { keywords: ['amsterdam', 'netherlands'], lat: 52.37, lng: 4.89 },
  { keywords: ['dublin', 'ireland'], lat: 53.35, lng: -6.26 },
  { keywords: ['madrid', 'spain'], lat: 40.42, lng: -3.70 },
  { keywords: ['barcelona', 'spain'], lat: 41.39, lng: 2.16 },
  { keywords: ['rome', 'italy'], lat: 41.90, lng: 12.50 },
  { keywords: ['stockholm', 'sweden'], lat: 59.33, lng: 18.07 },
  // Asia Pacific
  { keywords: ['sydney', 'australia'], lat: -33.87, lng: 151.21 },
  { keywords: ['melbourne', 'australia'], lat: -37.81, lng: 144.96 },
  { keywords: ['singapore'], lat: 1.35, lng: 103.82 },
  { keywords: ['tokyo', 'japan'], lat: 35.68, lng: 139.65 },
  { keywords: ['hong kong'], lat: 22.32, lng: 114.17 },
  { keywords: ['seoul', 'korea'], lat: 37.57, lng: 126.98 },
  { keywords: ['bangalore', 'bengaluru', 'india'], lat: 12.97, lng: 77.59 },
  { keywords: ['mumbai', 'india'], lat: 19.08, lng: 72.88 },
  { keywords: ['delhi', 'india'], lat: 28.61, lng: 77.21 }
]

// Country-level coordinates (capital cities or geographic centers)
const COUNTRY_COORDINATES: PlaceCoordinate[] = [
  // North America
  { keywords: ['united states', 'usa', 'u.s.', 'america'], lat: 39.83, lng: -98.58 },
  { keywords: ['canada'], lat: 56.13, lng: -106.35 },
  { keywords: ['mexico'], lat: 23.63, lng: -102.55 },
  // South America
  { keywords: ['brazil'], lat: -14.24, lng: -51.93 },
  { keywords: ['argentina'], lat: -38.42, lng: -63.62 },
  { keywords: ['chile'], lat: -35.68, lng: -71.54 },
  { keywords: ['colombia'], lat: 4.57, lng: -74.30 },
  { keywords: ['peru'], lat: -9.19, lng: -75.02 },
  // Europe
  { keywords: ['united kingdom', 'uk', 'great britain'], lat: 55.38, lng: -3.44 },
  { keywords: ['germany'], lat: 51.17, lng: 10.45 },
  { keywords: ['france'], lat: 46.23, lng: 2.21 },
  { keywords: ['spain'], lat: 40.46, lng: -3.75 },
  { keywords: ['italy'], lat: 41.87, lng: 12.57 },
  { keywords: ['netherlands'], lat: 52.13, lng: 5.29 },
  { keywords: ['belgium'], lat: 50.50, lng: 4.48 },
  { keywords: ['switzerland'], lat: 46.82, lng: 8.23 },
  { keywords: ['austria'], lat: 47.52, lng: 14.55 },
  { keywords: ['sweden'], lat: 60.13, lng: 18.64 },
  { keywords: ['norway'], lat: 60.47, lng: 8.47 },
  { keywords: ['denmark'], lat: 56.26, lng: 9.50 },
  { keywords: ['finland'], lat: 61.92, lng: 25.75 },
  { keywords: ['poland'], lat: 51.92, lng: 19.15 },
  { keywords: ['portugal'], lat: 39.40, lng: -8.22 },
  { keywords: ['ireland'], lat: 53.41, lng: -8.24 },
  // Asia
  { keywords: ['china'], lat: 35.86, lng: 104.20 },
  { keywords: ['japan'], lat: 36.20, lng: 138.25 },
  { keywords: ['south korea', 'korea'], lat: 35.91, lng: 127.77 },
  { keywords: ['india'], lat: 20.59, lng: 78.96 },
  { keywords: ['thailand'], lat: 15.87, lng: 100.99 },
  { keywords: ['vietnam'], lat: 14.06, lng: 108.28 },
  { keywords: ['indonesia'], lat: -0.79, lng: 113.92 },
  { keywords: ['malaysia'], lat: 4.21, lng: 101.98 },
  { keywords: ['philippines'], lat: 12.88, lng: 121.77 },
  { keywords: ['pakistan'], lat: 30.38, lng: 69.35 },
  { keywords: ['bangladesh'], lat: 23.68, lng: 90.36 },
  // Middle East
  { keywords: ['israel'], lat: 31.05, lng: 34.85 },
  { keywords: ['united arab emirates', 'uae', 'emirates'], lat: 23.42, lng: 53.85 },
  { keywords: ['saudi arabia'], lat: 23.89, lng: 45.08 },
  // Africa
  { keywords: ['south africa'], lat: -30.56, lng: 22.94 },
  { keywords: ['egypt'], lat: 26.82, lng: 30.80 },
  { keywords: ['nigeria'], lat: 9.08, lng: 8.68 },
  { keywords: ['kenya'], lat: -0.02, lng: 37.91 },
  // Oceania
  { keywords: ['australia'], lat: -25.27, lng: 133.78 },
  { keywords: ['new zealand'], lat: -40.90, lng: 174.89 }
]

function stripProtocol(url: string): string {
  return url.replace(/^https?:\/\//i, '')
}

function wrapTextRight(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(' ')
  let line = ''
  let currentY = y

  ctx.save()
  ctx.textAlign = 'right'

  words.forEach((word, index) => {
    const testLine = line ? `${line} ${word}` : word
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && index > 0) {
      ctx.fillText(line, x, currentY)
      line = word
      currentY += lineHeight
    } else {
      line = testLine
    }
  })

  if (line) {
    ctx.fillText(line, x, currentY)
  }

  ctx.restore()
  ctx.textAlign = 'left'
  return currentY + lineHeight
}

function wrapTextCentered(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(' ')
  let line = ''
  let currentY = y

  words.forEach((word, index) => {
    const testLine = line ? `${line} ${word}` : word
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && index > 0) {
      ctx.fillText(line, centerX, currentY)
      line = word
      currentY += lineHeight
    } else {
      line = testLine
    }
  })

  if (line) {
    ctx.fillText(line, centerX, currentY)
  }

  return currentY + lineHeight
}

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to load image asset'))
    img.src = source
  })
}
