import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import type { LogoAsset } from '../types'

interface LogoUploaderProps {
  value: LogoAsset | null
  onChange: (next: LogoAsset | null) => void
}

export function LogoUploader({ value, onChange }: LogoUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 4 * 1024 * 1024) {
      setError('Please choose a logo smaller than 4 MB.')
      return
    }

    try {
      const dataUrl = await readFileAsDataUrl(file)
      const image = await loadImage(dataUrl)
      onChange({
        dataUrl,
        width: image.width,
        height: image.height,
        name: file.name
      })
      setError(null)
    } catch (err) {
      console.error(err)
      setError('We could not read that logo. Try a different file?')
    }
  }

  const handleRemove = () => {
    onChange(null)
    setError(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <section className="panel">
      <header className="panel__header">
        <h2>Logo</h2>
        <p>Optional. PNG with a transparent background works best.</p>
      </header>
      <div className="logo-uploader">
        <label className="uploader">
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml"
            onChange={handleFileChange}
          />
          <span>Upload logo</span>
        </label>
        {value ? (
          <div className="logo-preview">
            <img src={value.dataUrl} alt="Uploaded logo preview" />
            <div className="logo-preview__meta">
              <strong>{value.name}</strong>
              <span>
                {value.width} × {value.height}px
              </span>
              <button type="button" className="ghost danger" onClick={handleRemove}>
                Remove logo
              </button>
            </div>
          </div>
        ) : (
          <p className="help">No logo uploaded yet.</p>
        )}
        {error && <p className="error-text">{error}</p>}
      </div>
    </section>
  )
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Unable to load image'))
    image.src = source
  })
}
