import { useEffect, useMemo, useState } from 'react'
import './App.css'
import type { CompanyInfo, LogoAsset, PersonRecord } from './types'
import { defaultCompany, defaultPeople, loadDefaultLogo } from './constants/defaults'
import { backgroundThemes } from './constants/backgrounds'
import { CompanyForm } from './components/CompanyForm'
import { PeopleEditor } from './components/PeopleEditor'
import { LogoUploader } from './components/LogoUploader'
import { BackgroundSelector } from './components/BackgroundSelector'
import { BackdropPreview } from './components/BackdropPreview'
import { Instructions } from './components/Instructions'
import {
  generateBackdropBlob,
  generateBackdropDataUrl
} from './utils/backdrop'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

function App() {
  const [company, setCompany] = useState<CompanyInfo>(defaultCompany)
  const [people, setPeople] = useState<PersonRecord[]>(defaultPeople)
  const [selectedPersonId, setSelectedPersonId] = useState<string>(
    defaultPeople[0]?.id ?? createId()
  )
  const [logo, setLogo] = useState<LogoAsset | null>(null)
  const [backgroundId, setBackgroundId] = useState(
    backgroundThemes[0]?.id ?? ''
  )
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isRenderingPreview, setIsRenderingPreview] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isMirrored, setIsMirrored] = useState(false)
  const [fontScale, setFontScale] = useState(1.0)
  const [logoScale, setLogoScale] = useState(1.0)
  const [mapScale, setMapScale] = useState(1.0)

  // Load default logo on mount
  useEffect(() => {
    loadDefaultLogo().then((defaultLogo) => {
      if (defaultLogo) {
        setLogo(defaultLogo)
      }
    })
  }, [])

  const background = useMemo(
    () => backgroundThemes.find((theme) => theme.id === backgroundId),
    [backgroundId]
  ) ?? backgroundThemes[0]

  const selectedPerson = useMemo(() => {
    if (people.length === 0) return undefined
    const found = people.find((person) => person.id === selectedPersonId)
    return found ?? people[0]
  }, [people, selectedPersonId])

  useEffect(() => {
    if (!selectedPerson || !background) {
      setPreviewUrl(null)
      return
    }

    if (import.meta.env.DEV) {
      console.log('🔄 Preview useEffect triggered with person:', {
        name: selectedPerson.fullName,
        location: selectedPerson.location,
        hasCityData: !!selectedPerson.cityData,
        cityData: selectedPerson.cityData
      })
    }

    let cancelled = false
    setIsRenderingPreview(true)
    setErrorMessage(null)

    generateBackdropDataUrl({
      person: selectedPerson,
      company,
      background,
      logo,
      mirror: isMirrored,
      fontScale,
      logoScale,
      mapScale
    })
      .then((url) => {
        if (!cancelled) {
          setPreviewUrl(url)
        }
      })
      .catch((error) => {
        console.error('Backdrop preview failed', error)
        if (!cancelled) {
          setErrorMessage(
            'We hit a snag rendering the preview. Please check your inputs and try again.'
          )
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsRenderingPreview(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [selectedPerson, company, background, logo, isMirrored, fontScale, logoScale, mapScale])

  const handlePeopleChange = (next: PersonRecord[]) => {
    setPeople(next)
    if (
      next.length > 0 &&
      next.every((person) => person.id !== selectedPersonId)
    ) {
      setSelectedPersonId(next[0].id)
    }
  }

  const handleDownloadSelected = async () => {
    if (!selectedPerson || !background) return
    try {
      setIsDownloading(true)
      
      // Generate and save standard version
      const standardBlob = await generateBackdropBlob({
        person: selectedPerson,
        company,
        background,
        logo,
        mirror: false,
        fontScale,
        logoScale,
        mapScale
      })
      saveAs(
        standardBlob,
        buildFileName(selectedPerson, company, background.name, false)
      )
      
      // Generate and save mirrored version
      const mirroredBlob = await generateBackdropBlob({
        person: selectedPerson,
        company,
        background,
        logo,
        mirror: true,
        fontScale,
        logoScale,
        mapScale
      })
      saveAs(
        mirroredBlob,
        buildFileName(selectedPerson, company, background.name, true)
      )
    } catch (error) {
      console.error('Download failed', error)
      setErrorMessage(
        'We could not download that backdrop. Please try again.'
      )
    } finally {
      setIsDownloading(false)
    }
  }

  const handleDownloadAll = async () => {
    if (people.length === 0 || !background) return
    try {
      setIsDownloading(true)
      const zip = new JSZip()
      
      for (const person of people) {
        // Add standard version
        const standardBlob = await generateBackdropBlob({
          person,
          company,
          background,
          logo,
          mirror: false,
          fontScale,
          logoScale,
          mapScale
        })
        zip.file(
          buildFileName(person, company, background.name, false),
          standardBlob
        )
        
        // Add mirrored version
        const mirroredBlob = await generateBackdropBlob({
          person,
          company,
          background,
          logo,
          mirror: true,
          fontScale,
          logoScale,
          mapScale
        })
        zip.file(
          buildFileName(person, company, background.name, true),
          mirroredBlob
        )
      }
      
      const archive = await zip.generateAsync({ type: 'blob' })
      saveAs(
        archive,
        `${sanitize(company.companyName || 'company')}-backgrounds.zip`
      )
    } catch (error) {
      console.error('Zip download failed', error)
      setErrorMessage(
        'Something went wrong while packaging the backgrounds. Please try again.'
      )
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__main">
          <h1>Zoom Backgrounder</h1>
          <p>Create professional, mirrored backgrounds for your whole team in minutes.</p>
          <p className="app-header__github">
            <a href="https://github.com/PredictabilityAtScale/ZoomBackgrounds" target="_blank" rel="noopener noreferrer">
              ⭐ Open Source on GitHub
            </a>
          </p>
          <p className="app-header__survey">
            <a href="https://askpilot.io/s/eyJzdXJ2ZXlJZCI6ImU2YWUwMTk2LWI2ZmYtNDBiYi1iYTVlLWU5ZTI5MzQ3NjIwMSIsImV4cGlyZXNBdCI6MjA3NDg2NjM0ODQ2MiwiaXNzdWVyIjoiYXNrcGlsb3QiLCJwZXJtaXNzaW9ucyI6WyJyZWFkIiwicmVzcG9uZCJdLCJnZW5lcmF0ZWRBdCI6MTc1OTUwNjM0ODQ2Mn0" target="_blank" rel="noopener noreferrer">
              📋 Short Survey: How AI is going to be used, and challenges to going live
            </a>
          </p>
        </div>
        <div className="sponsor-panel">
          <p className="sponsor-panel__title">Consider checking out our products:</p>
          <div className="sponsor-panel__items">
            <a href="https://usagetap.com" target="_blank" rel="noopener noreferrer" className="sponsor-item">
              <img src="/usage-tap-logo.svg" alt="UsageTap" className="sponsor-item__logo" />
              <span className="sponsor-item__text">
                <strong>UsageTap.com</strong> Effortless analytics, usage base limits and billing for AI applications
              </span>
            </a>
            <a href="https://llmasaservice.io" target="_blank" rel="noopener noreferrer" className="sponsor-item">
              <img src="/android-chrome-192x192.png" alt="LLMAsAService" className="sponsor-item__logo" />
              <span className="sponsor-item__text">
                <strong>LLMAsAService.io</strong> Full LLM gateway. Add reliable, safe and interactive AI agents to your apps and websites with full conversation logging, PII redaction, safety and dozens of other features.
              </span>
            </a>
          </div>
        </div>
      </header>

      {/* Preview Section - Top */}
      <section className="preview-section">
        <div className="preview-section__left">
          <Instructions />
        </div>
        <div className="preview-section__right">
          <BackdropPreview
            dataUrl={previewUrl}
            isGenerating={isRenderingPreview}
            disableActions={isRenderingPreview || isDownloading}
            errorMessage={errorMessage}
            isMirrored={isMirrored}
            onToggleMirror={setIsMirrored}
            fontScale={fontScale}
            onFontScaleChange={setFontScale}
            logoScale={logoScale}
            onLogoScaleChange={setLogoScale}
            mapScale={mapScale}
            onMapScaleChange={setMapScale}
            selectedPersonLabel={selectedPerson?.fullName ?? 'Selected person'}
            onDownloadSelected={handleDownloadSelected}
            onDownloadAll={handleDownloadAll}
          />
        </div>
      </section>

      {/* Configuration Section - Bottom */}
      <main className="app-layout">
        <div className="app-layout__left">
          <CompanyForm value={company} onChange={setCompany} />
          <LogoUploader value={logo} onChange={setLogo} />
          <BackgroundSelector
            selectedId={background?.id ?? ''}
            onChange={setBackgroundId}
          />
        </div>
        <div className="app-layout__right">
          <PeopleEditor
            value={people}
            onChange={handlePeopleChange}
            selectedId={selectedPerson?.id ?? ''}
            onSelect={setSelectedPersonId}
          />
        </div>
      </main>

      <footer className="app-footer">
        <p>Tip: Downloads include both standard and mirrored versions. Use mirrored for Zoom/Teams so text appears correct when you see yourself.</p>
        <p className="app-footer__branding">
          <strong>zoombackgrounder.com</strong> - Create professional backgrounds for your team
        </p>
        <p className="app-footer__credits">
          Built by <strong>Predictability at Scale, Inc.</strong> Contact the authors:{' '}
          <a href="mailto:troy@predictabilityatscale.com">troy@predictabilityatscale.com</a> or{' '}
          <a href="mailto:chris@predictabilityatscale.com">chris@predictabilityatscale.com</a>
        </p>
        <a 
          href="https://founder.university/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="app-footer__founder-university"
        >
          <img 
            src="/Founder+University+Logo+(1500+x+450+px).webp" 
            alt="Founder University" 
            className="app-footer__founder-logo"
          />
          <p>Proudly part of Cohort 11 Founder University</p>
        </a>
      </footer>
    </div>
  )
}

function buildFileName(
  person: PersonRecord,
  company: CompanyInfo,
  themeName: string,
  isMirrored: boolean
): string {
  const base = `${company.companyName || 'company'}-${
    person.fullName || 'person'
  }-${themeName}-${isMirrored ? 'mirrored' : 'standard'}`
  return `${sanitize(base)}.png`
}

function sanitize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
}

function createId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10)
}

export default App
