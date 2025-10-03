import type { ChangeEvent } from 'react'
import type { CompanyInfo } from '../types'

interface CompanyFormProps {
  value: CompanyInfo
  onChange: (next: CompanyInfo) => void
}

export function CompanyForm({ value, onChange }: CompanyFormProps) {
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value: fieldValue } = event.target
    onChange({ ...value, [name]: fieldValue })
  }

  return (
    <section className="panel">
      <header className="panel__header">
        <h2>Company Profile</h2>
        <p>Short details shown on every backdrop. Keep it concise for the top third.</p>
      </header>
      <div className="form-grid">
        <label className="field">
          <span>Company name</span>
          <input
            name="companyName"
            value={value.companyName}
            onChange={handleChange}
            placeholder="Your company"
          />
        </label>
        <label className="field">
          <span>Website</span>
          <input
            name="website"
            value={value.website}
            onChange={handleChange}
            placeholder="usagetap.com"
          />
        </label>
        <label className="field field--wide">
          <span>Tagline</span>
          <textarea
            name="tagline"
            value={value.tagline}
            onChange={handleChange}
            rows={3}
            placeholder="A crisp statement that reinforces your brand"
          />
        </label>
      </div>
    </section>
  )
}
