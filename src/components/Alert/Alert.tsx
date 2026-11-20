import type { HTMLAttributes, ReactNode } from 'react'
import './Alert.css'

export type AlertTone = 'success' | 'warning' | 'danger'
export type AlertRole = 'alert' | 'status'

export interface AlertProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title' | 'role'> {
  /**
   * Status tone. Required for now: the info tone is not yet specified by UX
   * (no colour token).
   */
  tone: AlertTone
  /** Optional short title shown above the message. */
  title?: ReactNode
  /** Alert message. */
  children: ReactNode
  /**
   * Live-region role. `alert` interrupts assistive technology and suits urgent
   * messages; `status` is announced politely. Defaults to `alert` for the
   * `danger` tone and `status` otherwise. UX has not yet decided whether
   * post-action and on-load alerts differ.
   */
  role?: AlertRole
  /** When set, shows a dismiss button that calls this handler. */
  onDismiss?: () => void
  /** Accessible name of the dismiss button. */
  dismissLabel?: string
}

export function Alert({
  tone,
  title,
  children,
  role,
  onDismiss,
  dismissLabel = 'Dismiss',
  className,
  ...divProps
}: AlertProps) {
  const resolvedRole: AlertRole = role ?? (tone === 'danger' ? 'alert' : 'status')
  const classes = ['alert', `alert--${tone}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} role={resolvedRole} {...divProps}>
      <div className="alert__content">
        {title ? <p className="alert__title">{title}</p> : null}
        <div className="alert__message">{children}</div>
      </div>
      {onDismiss ? (
        <button
          type="button"
          className="alert__dismiss"
          aria-label={dismissLabel}
          onClick={onDismiss}
        >
          <span aria-hidden="true">×</span>
        </button>
      ) : null}
    </div>
  )
}
