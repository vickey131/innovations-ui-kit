import { useId, useState } from 'react'
import type { ChangeEvent, ComponentPropsWithRef } from 'react'
import './TextField.css'

export interface TextFieldProps
  extends Omit<ComponentPropsWithRef<'input'>, 'size'> {
  /** Visible label, always shown above the input. Use sentence case. */
  label: string
  /** Helper text shown below the input. */
  hint?: string
  /** Error message that replaces the hint. Say what to do to fix it. */
  error?: string
  /** Marks the label with * and sets the native required attribute. */
  required?: boolean
  /** Maximum number of characters. Also used by the counter. */
  maxLength?: number
  /** Shows a "42 / 100" character counter. Requires `maxLength`. */
  showCounter?: boolean
}

export function TextField({
  label,
  hint,
  error,
  required,
  maxLength,
  showCounter,
  id,
  className,
  onChange,
  value,
  defaultValue,
  'aria-describedby': ariaDescribedBy,
  ...inputProps
}: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const message = error ?? hint
  const messageId = `${inputId}-${error ? 'error' : 'hint'}`
  const counterId = `${inputId}-counter`

  const [uncontrolledLength, setUncontrolledLength] = useState(
    String(defaultValue ?? '').length,
  )
  const length =
    value !== undefined ? String(value).length : uncontrolledLength
  const counterVisible = Boolean(showCounter && maxLength !== undefined)

  const describedBy =
    [
      ariaDescribedBy,
      message ? messageId : undefined,
      counterVisible ? counterId : undefined,
    ]
      .filter(Boolean)
      .join(' ') || undefined

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setUncontrolledLength(event.target.value.length)
    onChange?.(event)
  }

  return (
    <div className={['text-field', className].filter(Boolean).join(' ')}>
      <label className="text-field__label" htmlFor={inputId}>
        {label}
        {required ? (
          <span className="text-field__required" aria-hidden="true">
            {' '}
            *
          </span>
        ) : null}
      </label>
      <input
        className="text-field__input"
        id={inputId}
        required={required}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        {...inputProps}
      />
      {message || counterVisible ? (
        <div className="text-field__footer">
          {message ? (
            <span className="text-field__message" id={messageId}>
              {message}
            </span>
          ) : null}
          {counterVisible ? (
            <span className="text-field__counter" id={counterId}>
              {length} / {maxLength}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
