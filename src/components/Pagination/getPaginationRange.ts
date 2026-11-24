/** A page number, or `'ellipsis'` where two or more pages are skipped. */
export type PaginationItem = number | 'ellipsis'

export interface PaginationRange {
  /** Current page after normalizing: an integer in `[1, pageCount]`. */
  page: number
  /** Page count after normalizing. 0 means there is nothing to render. */
  pageCount: number
  /** Items to render, in order. */
  items: PaginationItem[]
}

function normalizeCount(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 1
}

/**
 * Normalizes the inputs and returns the items to show.
 *
 * - `pageCount`: non-finite or below 1 gives 0 (nothing to render); otherwise floored.
 * - `page`: non-finite gives 1; otherwise floored, then clamped to `[1, pageCount]`.
 * - `siblingCount` and `boundaryCount`: non-finite gives 1; otherwise floored, minimum 0.
 *
 * Shows the first and last `boundaryCount` pages, the current page and
 * `siblingCount` pages either side. A gap of one page shows that page; a gap
 * of two or more becomes an ellipsis.
 */
export function getPaginationRange(
  page: number,
  pageCount: number,
  siblingCount = 1,
  boundaryCount = 1,
): PaginationRange {
  const total = Number.isFinite(pageCount) ? Math.max(0, Math.floor(pageCount)) : 0
  if (total === 0) return { page: 1, pageCount: 0, items: [] }

  const current = Number.isFinite(page)
    ? Math.min(Math.max(Math.floor(page), 1), total)
    : 1
  const siblings = normalizeCount(siblingCount)
  const boundaries = normalizeCount(boundaryCount)

  const shown = new Set<number>()
  for (let n = 1; n <= Math.min(boundaries, total); n++) shown.add(n)
  for (let n = Math.max(total - boundaries + 1, 1); n <= total; n++) shown.add(n)
  for (
    let n = Math.max(current - siblings, 1);
    n <= Math.min(current + siblings, total);
    n++
  ) {
    shown.add(n)
  }

  const items: PaginationItem[] = []
  let previous = 0
  // `total + 1` closes the walk so a trailing gap is handled like any other.
  for (const n of [...[...shown].sort((a, b) => a - b), total + 1]) {
    const gap = n - previous - 1
    if (gap === 1) items.push(previous + 1)
    else if (gap > 1) items.push('ellipsis')
    if (n <= total) items.push(n)
    previous = n
  }

  return { page: current, pageCount: total, items }
}
