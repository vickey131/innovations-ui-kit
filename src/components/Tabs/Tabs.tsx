import {
  createContext,
  useContext,
  useId,
  useEffect,
  useRef,
  useState,
} from 'react'
import type {
  HTMLAttributes,
  KeyboardEvent,
  ReactNode,
  RefObject,
} from 'react'
import './Tabs.css'

interface TabEntry {
  value: string
  disabled: boolean
}

interface TabsContextValue {
  baseId: string
  selectedId: string | undefined
  items: TabEntry[]
  select: (id: string) => void
  register: (entry: TabEntry) => () => void
  tabRefs: RefObject<Map<string, HTMLButtonElement>>
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const context = useContext(TabsContext)
  if (!context) throw new Error('Tabs parts must be rendered inside <Tabs>.')
  return context
}

export interface TabsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
  /** Selected tab value for controlled use. Pair with `onValueChange`. */
  value?: string
  /** Initially selected tab value for uncontrolled use. */
  defaultValue?: string
  /** Called with the tab value when the user selects a tab. */
  onValueChange?: (value: string) => void
  /** `Tabs.List` and `Tabs.Panel` parts. */
  children: ReactNode
}

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  /** Accessible name of the tab list. Provide this or `aria-labelledby`. */
  'aria-label'?: string
  /** `Tabs.Tab` parts. */
  children: ReactNode
}

export interface TabProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Unique value that links this tab to its `Tabs.Panel`. */
  value: string
  /** Visible tab label. */
  children: ReactNode
  /** Disables the tab: it cannot be selected or focused. */
  disabled?: boolean
}

export interface TabsPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Value of the `Tabs.Tab` that shows this panel. */
  value: string
  /** Content shown when the tab is selected. */
  children: ReactNode
}

/**
 * Resolve which tab is selected. The requested value wins if it matches an
 * enabled tab; otherwise the first enabled tab; otherwise none.
 */
function resolveSelectedId(items: TabEntry[], requested?: string) {
  const match = items.find((item) => item.value === requested && !item.disabled)
  return (match ?? items.find((item) => !item.disabled))?.value
}

export function Tabs({
  value,
  defaultValue,
  onValueChange,
  className,
  children,
  ...divProps
}: TabsProps) {
  const baseId = useId()
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [items, setItems] = useState<TabEntry[]>([])
  const tabRefs = useRef(new Map<string, HTMLButtonElement>())

  const isControlled = value !== undefined
  const selectedId = resolveSelectedId(items, isControlled ? value : internalValue)

  function select(id: string) {
    if (!isControlled) setInternalValue(id)
    onValueChange?.(id)
    tabRefs.current.get(id)?.focus()
  }

  function register(entry: TabEntry) {
    setItems((current) =>
      current.some((item) => item.value === entry.value)
        ? current.map((item) => (item.value === entry.value ? entry : item))
        : [...current, entry],
    )
    return () =>
      setItems((current) => current.filter((item) => item.value !== entry.value))
  }

  const classes = ['tabs', className].filter(Boolean).join(' ')

  return (
    <TabsContext.Provider
      value={{ baseId, selectedId, items, select, register, tabRefs }}
    >
      <div className={classes} {...divProps}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

function TabsList({ className, children, ...divProps }: TabsListProps) {
  const classes = ['tabs__list', className].filter(Boolean).join(' ')
  return (
    <div role="tablist" className={classes} {...divProps}>
      {children}
    </div>
  )
}

function Tab({
  value,
  disabled = false,
  className,
  children,
  onClick,
  onKeyDown,
  ...buttonProps
}: TabProps) {
  const { baseId, selectedId, items, select, register, tabRefs } = useTabsContext()
  const selected = value === selectedId

  useEffect(
    () => register({ value, disabled }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- register is stable in behavior
    [value, disabled],
  )

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    onKeyDown?.(event)
    if (event.defaultPrevented) return

    const enabled = items.filter((item) => !item.disabled)
    const current = enabled.findIndex((item) => item.value === value)
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
    select(enabled[next].value)
  }

  const classes = ['tabs__tab', selected && 'tabs__tab--selected', className]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      ref={(node) => {
        if (node) tabRefs.current.set(value, node)
        else tabRefs.current.delete(value)
      }}
      type="button"
      role="tab"
      id={`${baseId}-tab-${value}`}
      className={classes}
      aria-selected={selected}
      aria-controls={`${baseId}-panel-${value}`}
      tabIndex={selected ? 0 : -1}
      disabled={disabled}
      {...buttonProps}
      onClick={(event) => {
        onClick?.(event)
        select(value)
      }}
      onKeyDown={handleKeyDown}
    >
      {children}
    </button>
  )
}

function TabsPanel({ value, className, children, ...divProps }: TabsPanelProps) {
  const { baseId, selectedId } = useTabsContext()
  const selected = value === selectedId
  const classes = ['tabs__panel', className].filter(Boolean).join(' ')

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      className={classes}
      aria-labelledby={`${baseId}-tab-${value}`}
      hidden={!selected}
      tabIndex={0}
      {...divProps}
    >
      {selected ? children : null}
    </div>
  )
}

Tabs.List = TabsList
Tabs.Tab = Tab
Tabs.Panel = TabsPanel
