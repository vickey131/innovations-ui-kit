export type SortDirection = 'ascending' | 'descending'

/** Compares two non-nullish underlying values. Negative: a first. */
export type CompareFn = (a: unknown, b: unknown) => number

/**
 * Default comparator. Supports two strings (`localeCompare`) or two numbers.
 * Any other pair is treated as equal, so those rows keep their original order.
 * Use a column `compare` for other value types such as dates.
 */
export function defaultCompare(a: unknown, b: unknown): number {
  if (typeof a === 'string' && typeof b === 'string') return a.localeCompare(b)
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return 0
}

/**
 * Returns a sorted copy of `rows` ordered by the underlying value `row[key]`.
 *
 * 1. `null` and `undefined` values go last in both directions.
 * 2. Otherwise the value comparison decides; descending negates only that.
 * 3. Equal values keep their original row order in both directions.
 */
export function sortRows<Row>(
  rows: readonly Row[],
  key: keyof Row,
  direction: SortDirection,
  compare: CompareFn = defaultCompare,
): Row[] {
  const entries = rows.map((row, index) => ({ row, index, value: row[key] }))

  entries.sort((x, y) => {
    const xEmpty = x.value == null
    const yEmpty = y.value == null
    if (xEmpty || yEmpty) {
      if (xEmpty && yEmpty) return x.index - y.index
      return xEmpty ? 1 : -1
    }

    const result = compare(x.value, y.value) || 0 // NaN counts as equal.
    const directed = direction === 'descending' ? -result : result
    return directed || x.index - y.index
  })

  return entries.map((entry) => entry.row)
}
