import { useId } from 'react'
import type { ComponentPropsWithRef } from 'react'
import './Checkbox.css'

export interface CheckboxProps
  extends Omit<ComponentPropsWithRef<'input'>, 'type' | 'size'> {
  /** Visible label, shown to the right of the box. Use sentence case. */
  label: string
  /** Shows the mixed state. Visual only; it does not change `checked`. */
  indeterminate?: boolean
  /** Error message linked to the checkbox. Say what to do to fix it. */
  error?: string
}

export function Checkbox({
  label,
  indeterminate = false,
  error,
  id,
  className,
  ref,
  'aria-describedby': ariaDescribedBy,
  ...inputProps
}: CheckboxProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`

  const describedBy =
    [ariaDescribedBy, error ? errorId : undefined].filter(Boolean).join(' ') ||
    undefined

  function setRef(node: HTMLInputElement | null) {
    if (node) node.indeterminate = indeterminate
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }

  return (
    <div className={['checkbox', className].filter(Boolean).join(' ')}>
      <div className="checkbox__row">
        <input
          className="checkbox__input"
          type="checkbox"
          id={inputId}
          ref={setRef}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          {...inputProps}
        />
        <label className="checkbox__label" htmlFor={inputId}>
          {label}
        </label>
      </div>
      {error ? (
        <span className="checkbox__error" id={errorId}>
          {error}
        </span>
      ) : null}
    </div>
  )
}
