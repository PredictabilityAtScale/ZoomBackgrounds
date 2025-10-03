import type { ChangeEvent } from 'react'
import { useMemo } from 'react'
import type { PersonRecord, SocialLink } from '../types'

interface PeopleEditorProps {
  value: PersonRecord[]
  onChange: (next: PersonRecord[]) => void
  selectedId: string
  onSelect: (id: string) => void
}

const baseFieldKeys: Array<keyof Omit<PersonRecord, 'id' | 'socialLinks'>> = [
  'fullName',
  'role',
  'email',
  'pronouns',
  'location',
  'timezone'
]

const fieldLabels: Record<(typeof baseFieldKeys)[number], string> = {
  fullName: 'Full name',
  role: 'Role / Title',
  email: 'Email',
  pronouns: 'Pronouns',
  location: 'Location',
  timezone: 'Timezone'
}

export function PeopleEditor({
  value,
  onChange,
  selectedId,
  onSelect
}: PeopleEditorProps) {
  const sortedPeople = useMemo(() => [...value], [value])

  const createId = () =>
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 10)

  const handleFieldChange = (
    personId: string,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value: fieldValue } = event.target
    onChange(
      value.map((person) =>
        person.id === personId ? { ...person, [name]: fieldValue } : person
      )
    )
  }

  const handleAddPerson = () => {
    const newPerson: PersonRecord = {
      id: createId(),
      fullName: 'New teammate',
      role: 'Role',
      email: '',
      pronouns: '',
      location: '',
      timezone: '',
      socialLinks: []
    }
    const next = [...value, newPerson]
    onChange(next)
    onSelect(newPerson.id)
  }

  const handleDuplicate = (person: PersonRecord) => {
    const duplicate: PersonRecord = {
      ...person,
      id: createId(),
      fullName: `${person.fullName} Copy`,
      socialLinks: person.socialLinks.map((link) => ({
        ...link,
        id: createId()
      }))
    }
    const index = value.findIndex((item) => item.id === person.id)
    const next = [...value]
    next.splice(index + 1, 0, duplicate)
    onChange(next)
    onSelect(duplicate.id)
  }

  const handleRemove = (personId: string) => {
    if (value.length === 1) return
    const next = value.filter((person) => person.id !== personId)
    onChange(next)
    if (selectedId === personId && next.length > 0) {
      onSelect(next[0].id)
    }
  }

  const handleSocialChange = (
    personId: string,
    linkId: string,
    field: keyof Omit<SocialLink, 'id'>,
    nextValue: string
  ) => {
    onChange(
      value.map((person) =>
        person.id === personId
          ? {
              ...person,
              socialLinks: person.socialLinks.map((link) =>
                link.id === linkId ? { ...link, [field]: nextValue } : link
              )
            }
          : person
      )
    )
  }

  const handleAddSocial = (personId: string) => {
    const newLink: SocialLink = {
      id: createId(),
      label: 'LinkedIn',
      url: ''
    }
    onChange(
      value.map((person) =>
        person.id === personId
          ? { ...person, socialLinks: [...person.socialLinks, newLink] }
          : person
      )
    )
  }

  const handleRemoveSocial = (personId: string, linkId: string) => {
    onChange(
      value.map((person) =>
        person.id === personId
          ? {
              ...person,
              socialLinks: person.socialLinks.filter((link) => link.id !== linkId)
            }
          : person
      )
    )
  }

  return (
    <section className="panel">
      <header className="panel__header">
        <h2>Team Members</h2>
        <p>Add each person you want to generate a backdrop for.</p>
        <button type="button" className="ghost" onClick={handleAddPerson}>
          + Add teammate
        </button>
      </header>
      <div className="people-grid">
        {sortedPeople.map((person) => {
          const isActive = person.id === selectedId
          return (
            <article
              key={person.id}
              className={`person-card${isActive ? ' person-card--active' : ''}`}
              onClick={() => onSelect(person.id)}
            >
              <div className="person-card__header">
                <h3>{person.fullName || 'Unnamed person'}</h3>
                <div className="person-card__actions">
                  <button
                    type="button"
                    className="ghost"
                    onClick={(event) => {
                      event.stopPropagation()
                      handleDuplicate(person)
                    }}
                  >
                    Duplicate
                  </button>
                  <button
                    type="button"
                    className="ghost danger"
                    onClick={(event) => {
                      event.stopPropagation()
                      handleRemove(person.id)
                    }}
                    disabled={value.length === 1}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="person-card__fields">
                {baseFieldKeys.map((key) => (
                  <label key={key} className="field">
                    <span>{fieldLabels[key]}</span>
                    <input
                      name={key}
                      value={person[key] ?? ''}
                      onChange={(event) => handleFieldChange(person.id, event)}
                      placeholder={fieldLabels[key]}
                    />
                  </label>
                ))}
              </div>
              <div
                className="person-card__social"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="person-card__social-header">
                  <span>Social links</span>
                  <button
                    type="button"
                    className="ghost"
                    onClick={() => handleAddSocial(person.id)}
                  >
                    + Add link
                  </button>
                </div>
                {person.socialLinks.length === 0 && (
                  <p className="help">No links yet. Add LinkedIn, website, or other profiles.</p>
                )}
                <div className="person-card__social-list">
                  {person.socialLinks.map((link) => (
                    <div key={link.id} className="social-row">
                      <input
                        className="social-row__label"
                        value={link.label}
                        onChange={(event) =>
                          handleSocialChange(
                            person.id,
                            link.id,
                            'label',
                            event.target.value
                          )
                        }
                        placeholder="Label"
                      />
                      <input
                        className="social-row__url"
                        value={link.url}
                        onChange={(event) =>
                          handleSocialChange(
                            person.id,
                            link.id,
                            'url',
                            event.target.value
                          )
                        }
                        placeholder="https://"
                      />
                      <button
                        type="button"
                        className="ghost danger"
                        onClick={() => handleRemoveSocial(person.id, link.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
