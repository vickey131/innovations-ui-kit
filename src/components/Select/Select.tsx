import { useId } from 'react'
import type { ComponentPropsWithRef, ReactNode } from 'react'
import '../TextField/TextField.css'

export interface SelectProps
  extends Omit<ComponentPropsWithRef<'select'>, 'size' | 'multiple'> {
  /** Visible label, always shown above the select. Use sentence case. */
  label: string
  /** Helper text shown below the select. */
  hint?: string
  /** Error message that replaces the hint. Say what to do to fix it. */
  error?: string
  /** Marks the label with * and sets the native required attribute. */
  required?: boolean
  /** Text for an empty first option, shown until the user chooses a value. */
  placeholder?: string
  /** The `<option>` elements to choose from. */
  children: ReactNode
}

export function Select({
  label,
  hint,
  error,
  required,
  placeholder,
  children,
  id,
  className,
  value,
  defaultValue,
  'aria-describedby': ariaDescribedBy,
  ...selectProps
}: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const message = error ?? hint
  const messageId = `${selectId}-${error ? 'error' : 'hint'}`

  const describedBy =
    [ariaDescribedBy, message ? messageId : undefined]
      .filter(Boolean)
      .join(' ') || undefined

  // Show the placeholder option until a value is chosen.
  const initialValue =
    placeholder && value === undefined && defaultValue === undefined
      ? ''
      : defaultValue

  return (
    <div className={['text-field', className].filter(Boolean).join(' ')}>
      <label className="text-field__label" htmlFor={selectId}>
        {label}
        {required ? (
          <span className="text-field__required" aria-hidden="true">
            {' '}
            *
          </span>
        ) : null}
      </label>
      <select
        className="text-field__input"
        id={selectId}
        required={required}
        value={value}
        defaultValue={initialValue}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        {...selectProps}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {children}
      </select>
      {message ? (
        <div className="text-field__footer">
          <span className="text-field__message" id={messageId}>
            {message}
          </span>
        </div>
      ) : null}
    </div>
  )
}
