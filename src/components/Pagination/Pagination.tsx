import type { HTMLAttributes } from 'react'
import { getPaginationRange } from './getPaginationRange'
import './Pagination.css'

export type PaginationSize = 'sm' | 'md'

export interface PaginationProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Current page, starting at 1. Out-of-range values are clamped for display. */
  page: number
  /** Total number of pages. A value below 1 renders nothing. */
  pageCount: number
  /** Called with the new page when the user picks a different page. */
  onPageChange: (page: number) => void
  /** Pages shown on each side of the current page. */
  siblingCount?: number
  /** Pages always shown at the start and at the end. */
  boundaryCount?: number
  /** Button height: small (32px) or medium (40px). */
  size?: PaginationSize
  /** Disables every button. */
  disabled?: boolean
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  size = 'md',
  disabled = false,
  className,
  ...navProps
}: PaginationProps) {
  const range = getPaginationRange(page, pageCount, siblingCount, boundaryCount)
  if (range.pageCount === 0) return null

  const { page: current, items } = range
  const classes = ['pagination', `pagination--${size}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <nav aria-label="Pagination" className={classes} {...navProps}>
      <ul className="pagination__list">
        <li>
          <button
            type="button"
            className="pagination__button"
            aria-label="Previous page"
            disabled={disabled || current <= 1}
            onClick={() => onPageChange(current - 1)}
          >
            <span aria-hidden="true">‹</span>
            <span className="pagination__text">Previous</span>
          </button>
        </li>
        {items.map((item, index) =>
          item === 'ellipsis' ? (
            <li key={`ellipsis-${index}`}>
              <span className="pagination__ellipsis" aria-hidden="true">
                …
              </span>
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                className={[
                  'pagination__button',
                  item === current && 'pagination__button--current',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-label={`Page ${item}`}
                aria-current={item === current ? 'page' : undefined}
                disabled={disabled}
                onClick={() => {
                  if (item !== current) onPageChange(item)
                }}
              >
                {item}
              </button>
            </li>
          ),
        )}
        <li>
          <button
            type="button"
            className="pagination__button"
            aria-label="Next page"
            disabled={disabled || current >= range.pageCount}
            onClick={() => onPageChange(current + 1)}
          >
            <span className="pagination__text">Next</span>
            <span aria-hidden="true">›</span>
          </button>
        </li>
      </ul>
    </nav>
  )
}
