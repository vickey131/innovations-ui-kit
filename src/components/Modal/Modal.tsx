import { useEffect, useId, useRef } from 'react'
import type { HTMLAttributes, KeyboardEvent, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import './Modal.css'

export type ModalSize = 'sm' | 'md' | 'lg'

export interface ModalProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /** Whether the modal is shown. */
  open: boolean
  /** Called when the user asks to close: Escape or the close button. */
  onClose: () => void
  /** Modal title. Also the accessible name of the dialog. */
  title: string
  /** Modal width: small (400px), medium (560px) or large (800px). Full-screen below 768px. */
  size?: ModalSize
  /** Modal body. Scrolls when it is taller than the viewport. */
  children: ReactNode
  /** Footer content, usually actions with the primary action last. */
  footer?: ReactNode
  /** Accessible name of the close button. */
  closeLabel?: string
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export function Modal({
  open,
  onClose,
  title,
  size = 'md',
  children,
  footer,
  closeLabel = 'Close',
  className,
  onKeyDown,
  ...divProps
}: ModalProps) {
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)

  // Move focus into the dialog on open and return it to the opener on close.
  useEffect(() => {
    if (!open) return
    const opener = document.activeElement
    dialogRef.current?.focus()

    return () => {
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus()
    }
  }, [open])

  if (!open) return null

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event)
    if (event.defaultPrevented) return

    if (event.key === 'Escape') {
      event.stopPropagation()
      onClose()
      return
    }
    if (event.key !== 'Tab') return

    const dialog = dialogRef.current
    if (!dialog) return
    const focusable = Array.from(
      dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    )
    if (focusable.length === 0) {
      event.preventDefault()
      dialog.focus()
      return
    }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const active = document.activeElement

    if (active === dialog) {
      event.preventDefault()
      ;(event.shiftKey ? last : first).focus()
    } else if (event.shiftKey && active === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const classes = ['modal', `modal--${size}`, className].filter(Boolean).join(' ')

  return createPortal(
    <div className="modal__overlay">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={classes}
        {...divProps}
        onKeyDown={handleKeyDown}
      >
        <div className="modal__header">
          <h2 id={titleId} className="modal__title">
            {title}
          </h2>
          <button
            type="button"
            className="modal__close"
            aria-label={closeLabel}
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="modal__body">{children}</div>
        {footer ? <div className="modal__footer">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  )
}
