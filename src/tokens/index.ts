/**
 * Typed references to the CSS custom properties in `tokens.css`.
 * Values live in the CSS; these strings are `var(--token)` references.
 */

/** Primitive colors. Components must use the semantic `colors` instead. */
export const primitiveColors = {
  blue50: 'var(--blue-50)',
  blue100: 'var(--blue-100)',
  blue500: 'var(--blue-500)',
  blue600: 'var(--blue-600)',
  blue700: 'var(--blue-700)',
  gray0: 'var(--gray-0)',
  gray50: 'var(--gray-50)',
  gray100: 'var(--gray-100)',
  gray300: 'var(--gray-300)',
  gray500: 'var(--gray-500)',
  gray700: 'var(--gray-700)',
  gray900: 'var(--gray-900)',
  green100: 'var(--green-100)',
  green600: 'var(--green-600)',
  amber100: 'var(--amber-100)',
  amber600: 'var(--amber-600)',
  red100: 'var(--red-100)',
  red600: 'var(--red-600)',
} as const

export const colors = {
  bgCanvas: 'var(--color-bg-canvas)',
  bgSurface: 'var(--color-bg-surface)',
  textPrimary: 'var(--color-text-primary)',
  textSecondary: 'var(--color-text-secondary)',
  borderDefault: 'var(--color-border-default)',
  actionPrimary: 'var(--color-action-primary)',
  actionPrimaryHover: 'var(--color-action-primary-hover)',
  actionPrimaryActive: 'var(--color-action-primary-active)',
  focusRing: 'var(--color-focus-ring)',
  statusSuccessBg: 'var(--color-status-success-bg)',
  statusSuccessFg: 'var(--color-status-success-fg)',
  statusWarningBg: 'var(--color-status-warning-bg)',
  statusWarningFg: 'var(--color-status-warning-fg)',
  statusDangerBg: 'var(--color-status-danger-bg)',
  statusDangerFg: 'var(--color-status-danger-fg)',
} as const

export const typography = {
  fontFamilySans: 'var(--font-family-sans)',
  display: 'var(--font-display)',
  heading: 'var(--font-heading)',
  title: 'var(--font-title)',
  body: 'var(--font-body)',
  label: 'var(--font-label)',
  caption: 'var(--font-caption)',
} as const

export const spacing = {
  0: 'var(--space-0)',
  1: 'var(--space-1)',
  2: 'var(--space-2)',
  3: 'var(--space-3)',
  4: 'var(--space-4)',
  5: 'var(--space-5)',
  6: 'var(--space-6)',
  7: 'var(--space-7)',
  8: 'var(--space-8)',
} as const

export const radii = {
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  pill: 'var(--radius-pill)',
} as const

export const elevation = {
  1: 'var(--shadow-1)',
  2: 'var(--shadow-2)',
  3: 'var(--shadow-3)',
} as const

export const motion = {
  durationFast: 'var(--duration-fast)',
  durationBase: 'var(--duration-base)',
  easing: 'var(--motion-easing)',
} as const

export const tokens = {
  primitiveColors,
  colors,
  typography,
  spacing,
  radii,
  elevation,
  motion,
} as const

/** Any CSS variable reference exported by this module, e.g. `var(--space-2)`. */
export type TokenValue = {
  [Group in keyof typeof tokens]: (typeof tokens)[Group][keyof (typeof tokens)[Group]]
}[keyof typeof tokens]
