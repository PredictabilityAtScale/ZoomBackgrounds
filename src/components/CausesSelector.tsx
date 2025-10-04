import { useMemo } from 'react'
import type { CauseInfo } from '../types'
import { popularCauses } from '../constants/causes'
import '../App.css'

export interface CausesSelectorProps {
  selected: string[]
  onChange: (ids: string[]) => void
  enabled: boolean
  onToggleEnabled: (value: boolean) => void
}

export function CausesSelector({ selected, onChange, enabled, onToggleEnabled }: CausesSelectorProps) {
  const list: CauseInfo[] = useMemo(() => popularCauses, [])

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter(s => s !== id))
    } else {
      onChange([...selected, id])
    }
  }

  return (
    <div className="panel">
      <div className="panel__header">
        <h2>Causes I Support</h2>
        <p>Select a few charities to subtly display (text-only) in the generated background.</p>
      </div>
      <label className="toggle" style={{ marginBottom: 8 }}>
        <input
          type="checkbox"
          checked={enabled}
          onChange={e => onToggleEnabled(e.target.checked)}
        />
        <span className="toggle__visual" />
        <span className="toggle__label">Show causes section</span>
      </label>
      {enabled && (
        <div className="causes-grid">
          {list.map(cause => {
            const isActive = selected.includes(cause.id)
            return (
              <button
                key={cause.id}
                type="button"
                className={`cause-pill ${isActive ? 'cause-pill--active' : ''}`}
                onClick={() => toggle(cause.id)}
                title={cause.name}
              >
                <span className="cause-pill__name">{cause.name}</span>
              </button>
            )
          })}
        </div>
      )}
      {enabled && selected.length > 0 && (
        <p style={{ margin: '4px 0 0', fontSize: '0.65rem', color: '#64748b' }}>
          Logos not shown; trademarks belong to respective owners. Text-only representation.
        </p>
      )}
    </div>
  )
}
