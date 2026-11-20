import type { HTMLAttributes, ReactNode } from 'react'
import './Badge.css'

export type BadgeTone = 'success' | 'warning' | 'danger'
export type BadgeSize = 'sm' | 'md'

export interface BadgeProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /**
   * Status tone. Required for now: neutral and info tones are not yet
   * specified by UX.
   */
  tone: BadgeTone
  /** Badge size. */
  size?: BadgeSize
  /** Badge text. */
  children: ReactNode
}

export function Badge({
  tone,
  size = 'md',
  children,
  className,
  ...spanProps
}: BadgeProps) {
  const classes = ['badge', `badge--${tone}`, `badge--${size}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes} {...spanProps}>
      {children}
    </span>
  )
}
