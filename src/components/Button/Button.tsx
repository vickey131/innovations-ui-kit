import type { ButtonHTMLAttributes, ReactNode } from 'react'
import './Button.css'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /**
   * Visual variant. Only `primary` is styled today; styling for `secondary`,
   * `ghost` and `danger` is pending UX specification.
   */
  variant?: ButtonVariant
  /** Button height: small (32px), medium (40px), or large (48px). */
  size?: ButtonSize
  /** Optional icon displayed before the button label. */
  leadingIcon?: ReactNode
  /** Visible button label. */
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  leadingIcon,
  children,
  className,
  type = 'button',
  ...buttonProps
}: ButtonProps) {
  const classes = ['button', `button--${variant}`, `button--${size}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} type={type} {...buttonProps}>
      {leadingIcon ? <span className="button__icon" aria-hidden="true">{leadingIcon}</span> : null}
      <span>{children}</span>
    </button>
  )
}
