import { backgroundThemes } from '../constants/backgrounds'

interface BackgroundSelectorProps {
  selectedId: string
  onChange: (themeId: string) => void
}

export function BackgroundSelector({
  selectedId,
  onChange
}: BackgroundSelectorProps) {
  return (
    <section className="panel">
      <header className="panel__header">
        <h2>Backdrop style</h2>
        <p>Select a gradient that matches your brand.</p>
      </header>
      <div className="background-picker">
        {backgroundThemes.map((theme) => {
          const gradient = theme.gradientStops
            .map((stop) => `${stop.color} ${stop.offset * 100}%`)
            .join(', ')
          const isActive = theme.id === selectedId
          return (
            <button
              type="button"
              key={theme.id}
              className={`background-picker__option${
                isActive ? ' background-picker__option--active' : ''
              }`}
              onClick={() => onChange(theme.id)}
              aria-pressed={isActive}
            >
              <span
                className="background-picker__swatch"
                style={{ background: `linear-gradient(135deg, ${gradient})` }}
              />
              <span className="background-picker__info">
                <strong>{theme.name}</strong>
                <small>{theme.description}</small>
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
