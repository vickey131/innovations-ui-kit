import { useId, useRef, useState } from 'react'
import type { HTMLAttributes, KeyboardEvent, ReactNode } from 'react'
import './Tabs.css'

export interface TabItem {
  /** Unique id for the tab. */
  id: string
  /** Visible tab label. */
  label: ReactNode
  /** Content shown when the tab is selected. */
  panel: ReactNode
  /** Disables the tab: it cannot be selected or focused. */
  disabled?: boolean
}

export interface TabsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue'> {
  /** The tabs to render, in order. */
  tabs: TabItem[]
  /** Selected tab id for controlled use. Pair with `onValueChange`. */
  value?: string
  /** Initially selected tab id for uncontrolled use. */
  defaultValue?: string
  /** Called with the tab id when the user selects a tab. */
  onValueChange?: (id: string) => void
  /** Accessible name of the tab list. Provide this or `aria-labelledby`. */
  'aria-label'?: string
}

/**
 * Resolve which tab is selected. The requested id wins if it matches an
 * enabled tab; otherwise the first enabled tab; otherwise none.
 */
function resolveSelectedId(tabs: TabItem[], requested?: string) {
  const match = tabs.find((tab) => tab.id === requested && !tab.disabled)
  return (match ?? tabs.find((tab) => !tab.disabled))?.id
}

export function Tabs({
  tabs,
  value,
  defaultValue,
  onValueChange,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...divProps
}: TabsProps) {
  const baseId = useId()
  const [internalValue, setInternalValue] = useState(defaultValue)
  const tabRefs = useRef(new Map<string, HTMLButtonElement>())

  const isControlled = value !== undefined
  const selectedId = resolveSelectedId(tabs, isControlled ? value : internalValue)

  function select(id: string) {
    if (!isControlled) setInternalValue(id)
    onValueChange?.(id)
    tabRefs.current.get(id)?.focus()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, id: string) {
    const enabled = tabs.filter((tab) => !tab.disabled)
    const current = enabled.findIndex((tab) => tab.id === id)
    if (current === -1) return

    let next: number
    switch (event.key) {
      case 'ArrowRight':
        next = (current + 1) % enabled.length
        break
      case 'ArrowLeft':
        next = (current - 1 + enabled.length) % enabled.length
        break
      case 'Home':
        next = 0
        break
      case 'End':
        next = enabled.length - 1
        break
      default:
        return
    }
    event.preventDefault()
    select(enabled[next].id)
  }

  const classes = ['tabs', className].filter(Boolean).join(' ')

  return (
    <div className={classes} {...divProps}>
      <div
        role="tablist"
        className="tabs__list"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
      >
        {tabs.map((tab) => {
          const selected = tab.id === selectedId
          return (
            <button
              key={tab.id}
              ref={(node) => {
                if (node) tabRefs.current.set(tab.id, node)
                else tabRefs.current.delete(tab.id)
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              className={['tabs__tab', selected && 'tabs__tab--selected']
                .filter(Boolean)
                .join(' ')}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => select(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, tab.id)}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-panel-${tab.id}`}
          className="tabs__panel"
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          hidden={tab.id !== selectedId}
          tabIndex={0}
        >
          {tab.id === selectedId ? tab.panel : null}
        </div>
      ))}
    </div>
  )
}
