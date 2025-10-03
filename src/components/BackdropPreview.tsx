interface BackdropPreviewProps {
  dataUrl: string | null
  isGenerating: boolean
  disableActions: boolean
  errorMessage?: string | null
  isMirrored: boolean
  onToggleMirror: (next: boolean) => void
  fontScale: number
  onFontScaleChange: (scale: number) => void
  logoScale: number
  onLogoScaleChange: (scale: number) => void
  mapScale: number
  onMapScaleChange: (scale: number) => void
  selectedPersonLabel: string
  onDownloadSelected: () => Promise<void>
  onDownloadAll: () => Promise<void>
}

export function BackdropPreview({
  dataUrl,
  isGenerating,
  disableActions,
  errorMessage,
  isMirrored,
  onToggleMirror,
  fontScale,
  onFontScaleChange,
  logoScale,
  onLogoScaleChange,
  mapScale,
  onMapScaleChange,
  selectedPersonLabel,
  onDownloadSelected,
  onDownloadAll
}: BackdropPreviewProps) {
  return (
    <section className="panel preview-panel">
      <header className="panel__header">
        <h2>Preview</h2>
        <p>Toggle between mirrored and standard views to debug layout.</p>
      </header>
      <div className="preview-controls">
        <label className="toggle">
          <input
            type="checkbox"
            checked={isMirrored}
            onChange={(event) => onToggleMirror(event.target.checked)}
          />
          <span className="toggle__visual" />
          <span className="toggle__label">
            {isMirrored ? 'Showing mirrored view' : 'Showing standard view'}
          </span>
        </label>
        <div className="scale-controls">
          <div className="scale-control">
            <label htmlFor="font-scale">Font Size: {Math.round(fontScale * 100)}%</label>
            <input
              id="font-scale"
              type="range"
              min="0.7"
              max="1.3"
              step="0.05"
              value={fontScale}
              onChange={(event) => onFontScaleChange(Number(event.target.value))}
            />
          </div>
          <div className="scale-control">
            <label htmlFor="logo-scale">Logo Size: {Math.round(logoScale * 100)}%</label>
            <input
              id="logo-scale"
              type="range"
              min="0.5"
              max="1.5"
              step="0.05"
              value={logoScale}
              onChange={(event) => onLogoScaleChange(Number(event.target.value))}
            />
          </div>
          <div className="scale-control">
            <label htmlFor="map-scale">Map Size: {Math.round(mapScale * 100)}%</label>
            <input
              id="map-scale"
              type="range"
              min="0.5"
              max="1.5"
              step="0.05"
              value={mapScale}
              onChange={(event) => onMapScaleChange(Number(event.target.value))}
            />
          </div>
        </div>
      </div>
      <div className="preview-area">
        {isGenerating ? (
          <div className="preview-placeholder">
            <span className="spinner" aria-hidden />
            <p>Rendering backdrop…</p>
          </div>
        ) : dataUrl ? (
          <>
            <img src={dataUrl} alt="Mirrored background preview" />
            <span className="preview-ghost" aria-hidden />
          </>
        ) : (
          <div className="preview-placeholder">
            <p>Add company details and teammates to see a preview.</p>
          </div>
        )}
        {errorMessage && <p className="error-text">{errorMessage}</p>}
      </div>
      {dataUrl && (
        <p className="preview-disclaimer">
          Person image shown for reference only; it won't be on your final image.
        </p>
      )}
      <div className="preview-actions">
        <button
          type="button"
          className="primary"
          onClick={onDownloadSelected}
          disabled={!dataUrl || disableActions}
        >
          Download for {selectedPersonLabel} (2 versions)
        </button>
        <button
          type="button"
          className="ghost"
          onClick={onDownloadAll}
          disabled={disableActions}
        >
          Download all backgrounds (.zip)
        </button>
      </div>
    </section>
  )
}
