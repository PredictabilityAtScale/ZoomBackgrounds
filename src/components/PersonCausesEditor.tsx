import { useState } from 'react'
import type { CauseInfo } from '../types'
import { popularCauses } from '../constants/causes'

interface PersonCausesEditorProps {
  value: CauseInfo[] | undefined
  onChange: (next: CauseInfo[]) => void
}

const MAX_CAUSES = 10

export function PersonCausesEditor({ value, onChange }: PersonCausesEditorProps) {
  const causes = value ?? []
  const [customName, setCustomName] = useState('')

  const togglePreset = (id: string) => {
    const preset = popularCauses.find(c => c.id === id)
    if (!preset) return
    if (causes.some(c => c.id === id)) {
      onChange(causes.filter(c => c.id !== id))
    } else if (causes.length < MAX_CAUSES) {
      onChange([...causes, { ...preset }])
    }
  }

  const remove = (id: string) => {
    onChange(causes.filter(c => c.id !== id))
  }

  const addCustom = () => {
    // Accept either a code or full name, prefer full name for display
    const name = customName.trim()
    if (!name) return
    if (causes.length >= MAX_CAUSES) return
    const id = `custom-${name.replace(/\s+/g,'-')}-${Math.random().toString(36).slice(2,8)}`
    onChange([...causes, { id, name }])
    setCustomName('')
  }

  return (
    <div className="person-causes" onClick={e => e.stopPropagation()}>
      <div className="person-causes__header">
        <span>Causes (optional)</span>
        <small>{causes.length}/{MAX_CAUSES}</small>
      </div>
      <div className="person-causes__selected">
        {causes.length === 0 && <p className="help" style={{margin:0}}>Add up to {MAX_CAUSES} causes.</p>}
        {causes.map(c => (
          <button
            key={c.id}
            type="button"
            className="cause-pill cause-pill--active"
            title={c.name}
            onClick={() => remove(c.id)}
          >
            <span className="cause-pill__name">{c.name}</span>
          </button>
        ))}
      </div>
      <details className="person-causes__presets">
        <summary>Select presets</summary>
        <div className="causes-grid" style={{marginTop:8}}>
          {popularCauses.map(c => {
            const active = causes.some(sel => sel.id === c.id)
            return (
              <button
                key={c.id}
                type="button"
                className={`cause-pill ${active ? 'cause-pill--active' : ''}`}
                onClick={() => togglePreset(c.id)}
                title={c.name}
              >
                <span className="cause-pill__name">{c.name}</span>
              </button>
            )
          })}
        </div>
      </details>
      <div className="person-causes__custom">
        <div className="person-causes__custom-row">
          <input
            placeholder="Cause name"
            value={customName}
            onChange={e => setCustomName(e.target.value)}
          />
          <button type="button" className="ghost" onClick={addCustom} disabled={!customName.trim() || causes.length>=MAX_CAUSES}>
            Add
          </button>
        </div>
        <p className="help" style={{margin:'4px 0 0', fontSize:'0.65rem'}}>Full names are shown on the image. Click a pill to remove.</p>
      </div>
    </div>
  )
}
