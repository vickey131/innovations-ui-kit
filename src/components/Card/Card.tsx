import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from 'react'
import './Card.css'

interface CardSlots {
  /** Optional header content, such as a title. */
  header?: ReactNode
  /** Optional footer content. */
  footer?: ReactNode
  /** Card body. */
  children?: ReactNode
}

export interface StaticCardProps
  extends CardSlots,
    Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Actions shown at the end of the header, such as buttons. */
  headerActions?: ReactNode
  /** Not allowed on a static card. Pass `href` to make the card clickable. */
  href?: never
}

export interface LinkCardProps
  extends CardSlots,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  /**
   * Makes the whole card a link. Do not put buttons, links or other
   * interactive content in the card: nested actions are not specified by UX.
   */
  href: string
  /** Not allowed on a clickable card: the card is a single link. */
  headerActions?: never
}

export type CardProps = StaticCardProps | LinkCardProps

function renderHeader(header: ReactNode, actions: ReactNode) {
  if (!header && !actions) return null
  return (
    <div className="card__header">
      <div className="card__title">{header}</div>
      {actions ? <div className="card__actions">{actions}</div> : null}
    </div>
  )
}

export function Card(props: CardProps) {
  if (props.href !== undefined) {
    // headerActions is dropped: an anchor must not contain actions.
    const { header, footer, children, className, headerActions, ...anchorProps } =
      props
    void headerActions
    const classes = ['card', 'card--clickable', className]
      .filter(Boolean)
      .join(' ')
    return (
      <a className={classes} {...anchorProps}>
        {renderHeader(header, null)}
        <div className="card__body">{children}</div>
        {footer ? <div className="card__footer">{footer}</div> : null}
      </a>
    )
  }

  const { header, headerActions, footer, children, className, ...divProps } =
    props
  const classes = ['card', className].filter(Boolean).join(' ')
  return (
    <div className={classes} {...divProps}>
      {renderHeader(header, headerActions)}
      <div className="card__body">{children}</div>
      {footer ? <div className="card__footer">{footer}</div> : null}
    </div>
  )
}
