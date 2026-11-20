import { useState } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'
import { Checkbox } from '../Checkbox'
import { sortRows } from './sortRows'
import type { CompareFn, SortDirection } from './sortRows'
import './Table.css'

export type { SortDirection }

export interface TableSort<Row> {
  /** Key of the column being sorted. */
  key: keyof Row & string
  direction: SortDirection
}

export interface TableColumn<Row> {
  /** Row field this column shows. Sorting reads `row[key]`, not the rendered cell. */
  key: keyof Row & string
  /** Visible column header. Use sentence case. */
  header: string
  /** Lets users sort by this column. */
  sortable?: boolean
  /** Custom cell content. Display only: it is never used for sorting. */
  render?: (row: Row) => ReactNode
  /**
   * Compares two underlying values (never null or undefined). Needed for
   * values other than strings and numbers, such as dates. Without it, such
   * rows keep their original order.
   */
  compare?: CompareFn
}

export interface TableProps<Row>
  extends Omit<HTMLAttributes<HTMLTableElement>, 'children' | 'defaultValue'> {
  /** Accessible name of the table, shown as its caption. */
  caption: string
  /** Column definitions, in display order. */
  columns: TableColumn<Row>[]
  /** Rows to show. */
  rows: Row[]
  /** Returns a unique, stable key for a row. */
  getRowKey: (row: Row) => string
  /**
   * Sort for controlled use, or `null` for no sort. Pair with
   * `onSortChange`. In controlled use the table does not reorder rows:
   * sort them yourself.
   */
  sort?: TableSort<Row> | null
  /** Initial sort for uncontrolled use. The table sorts the rows itself. */
  defaultSort?: TableSort<Row>
  /** Called when the user changes the sort. */
  onSortChange?: (sort: TableSort<Row>) => void
  /** Adds a checkbox column for row selection. */
  selectable?: boolean
  /** Selected row keys for controlled use. Pair with `onSelectionChange`. */
  selectedKeys?: string[]
  /** Initially selected row keys for uncontrolled use. */
  defaultSelectedKeys?: string[]
  /** Called with the selected row keys when the selection changes. */
  onSelectionChange?: (keys: string[]) => void
  /** Accessible label of a row's checkbox. Defaults to "Select row N". */
  getRowLabel?: (row: Row, index: number) => string
  /** Message shown when there are no rows. */
  emptyMessage?: string
  /** Optional illustration above the empty message. No asset is supplied by UX yet. */
  emptyIllustration?: ReactNode
}

const SORT_ARROWS: Record<SortDirection | 'none', string> = {
  ascending: '↑',
  descending: '↓',
  none: '↕',
}

export function Table<Row>({
  caption,
  columns,
  rows,
  getRowKey,
  sort,
  defaultSort,
  onSortChange,
  selectable = false,
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  getRowLabel,
  emptyMessage = 'No results found.',
  emptyIllustration,
  className,
  ...tableProps
}: TableProps<Row>) {
  const [internalSort, setInternalSort] = useState(defaultSort)
  const [internalSelected, setInternalSelected] = useState(
    defaultSelectedKeys ?? [],
  )

  const isSortControlled = sort !== undefined
  const activeSort = (isSortControlled ? sort : internalSort) ?? undefined
  const isSelectionControlled = selectedKeys !== undefined
  const selected = isSelectionControlled ? selectedKeys : internalSelected

  const sortColumn = activeSort
    ? columns.find((column) => column.key === activeSort.key)
    : undefined
  const visibleRows =
    activeSort && sortColumn && !isSortControlled
      ? sortRows(rows, activeSort.key, activeSort.direction, sortColumn.compare)
      : rows

  function toggleSort(key: keyof Row & string) {
    // Third click goes back to ascending: UX has not decided on "unsorted" (Q9).
    const direction: SortDirection =
      activeSort?.key === key && activeSort.direction === 'ascending'
        ? 'descending'
        : 'ascending'
    const next = { key, direction }
    if (!isSortControlled) setInternalSort(next)
    onSortChange?.(next)
  }

  function changeSelection(keys: string[]) {
    if (!isSelectionControlled) setInternalSelected(keys)
    onSelectionChange?.(keys)
  }

  function toggleRow(key: string) {
    changeSelection(
      selected.includes(key)
        ? selected.filter((item) => item !== key)
        : [...selected, key],
    )
  }

  const rowKeys = visibleRows.map(getRowKey)
  const selectedCount = rowKeys.filter((key) => selected.includes(key)).length
  const allSelected = rowKeys.length > 0 && selectedCount === rowKeys.length

  function toggleAll() {
    changeSelection(
      allSelected
        ? selected.filter((key) => !rowKeys.includes(key))
        : [...selected, ...rowKeys.filter((key) => !selected.includes(key))],
    )
  }

  const columnCount = columns.length + (selectable ? 1 : 0)
  const classes = ['table', className].filter(Boolean).join(' ')

  return (
    // The scroll region keeps wide tables usable on small screens (UX Q10 is open).
    <div className="table__scroll" role="region" aria-label={caption} tabIndex={0}>
      <table className={classes} {...tableProps}>
        <caption className="table__caption">{caption}</caption>
        <thead>
          <tr>
            {selectable ? (
              <th scope="col" className="table__select">
                <Checkbox
                  className="table__checkbox"
                  label="Select all rows"
                  checked={allSelected}
                  indeterminate={selectedCount > 0 && !allSelected}
                  disabled={rowKeys.length === 0}
                  onChange={toggleAll}
                />
              </th>
            ) : null}
            {columns.map((column) => {
              const isSorted = activeSort?.key === column.key
              return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={isSorted ? activeSort.direction : undefined}
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      className={[
                        'table__sort',
                        isSorted && 'table__sort--active',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => toggleSort(column.key)}
                    >
                      {column.header}
                      <span className="table__arrow" aria-hidden="true">
                        {SORT_ARROWS[isSorted ? activeSort.direction : 'none']}
                      </span>
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {visibleRows.length === 0 ? (
            <tr>
              <td className="table__empty" colSpan={columnCount}>
                {emptyIllustration}
                <p className="table__empty-message">{emptyMessage}</p>
              </td>
            </tr>
          ) : (
            visibleRows.map((row, index) => {
              const key = getRowKey(row)
              return (
                <tr key={key}>
                  {selectable ? (
                    <td className="table__select">
                      <Checkbox
                        className="table__checkbox"
                        label={getRowLabel?.(row, index) ?? `Select row ${index + 1}`}
                        checked={selected.includes(key)}
                        onChange={() => toggleRow(key)}
                      />
                    </td>
                  ) : null}
                  {columns.map((column) => {
                    const value = row[column.key]
                    return (
                      <td key={column.key}>
                        {column.render
                          ? column.render(row)
                          : value == null
                            ? ''
                            : String(value)}
                      </td>
                    )
                  })}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
