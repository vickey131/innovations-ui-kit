// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAxeViolations } from '../../test/axe'
import { Table } from './Table'
import type { TableColumn } from './Table'
import { sortRows } from './sortRows'

interface Person {
  id: string
  name: string | null | undefined
  age: number | null
  joined: Date
}

const people: Person[] = [
  { id: 'a', name: 'Bea', age: 10, joined: new Date('2024-03-01') },
  { id: 'b', name: 'Al', age: 2, joined: new Date('2024-01-01') },
  { id: 'c', name: null, age: 10, joined: new Date('2024-02-01') },
  { id: 'd', name: 'Cy', age: null, joined: new Date('2024-04-01') },
  { id: 'e', name: undefined, age: 2, joined: new Date('2024-05-01') },
]

const columns: TableColumn<Person>[] = [
  { key: 'name', header: 'Name', sortable: true },
  {
    key: 'age',
    header: 'Age',
    sortable: true,
    render: (row) => `${row.age ?? 'unknown'} years`,
  },
  {
    key: 'joined',
    header: 'Joined',
    sortable: true,
    compare: (a, b) => (a as Date).getTime() - (b as Date).getTime(),
    render: (row) => row.joined.getFullYear(),
  },
  { key: 'id', header: 'Id' },
]

function renderTable(props: Partial<Parameters<typeof Table<Person>>[0]> = {}) {
  return render(
    <Table
      caption="People"
      columns={columns}
      rows={people}
      getRowKey={(row) => row.id}
      {...props}
    />,
  )
}

/** Ids of the body rows in display order (last column). */
function bodyIds() {
  return screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell').at(-1)?.textContent)
}

function header(name: string) {
  return screen.getByRole('columnheader', { name })
}

describe('sortRows', () => {
  const rows = [
    { id: 'a', v: 2 as number | null },
    { id: 'b', v: null },
    { id: 'c', v: 1 },
    { id: 'd', v: 2 },
    { id: 'e', v: undefined as unknown as null },
  ]
  const ids = (sorted: typeof rows) => sorted.map((row) => row.id)

  it('sorts numbers numerically, nulls last, ties in original order', () => {
    expect(ids(sortRows(rows, 'v', 'ascending'))).toEqual(['c', 'a', 'd', 'b', 'e'])
  })

  it('reverses only the value order when descending', () => {
    // Nulls still last (b before e) and ties still in original order (a before d).
    expect(ids(sortRows(rows, 'v', 'descending'))).toEqual(['a', 'd', 'c', 'b', 'e'])
  })

  it('keeps equal rows in original order in both directions', () => {
    const equal = [{ id: 'a', v: 1 }, { id: 'b', v: 1 }, { id: 'c', v: 1 }]
    expect(ids(sortRows(equal, 'v', 'ascending') as typeof rows)).toEqual(['a', 'b', 'c'])
    expect(ids(sortRows(equal, 'v', 'descending') as typeof rows)).toEqual(['a', 'b', 'c'])
  })

  it('applies the same null and tie rules with a custom compare', () => {
    const compare = (a: unknown, b: unknown) => (b as number) - (a as number)
    // Custom compare is inverted, so ascending here is largest first.
    expect(ids(sortRows(rows, 'v', 'ascending', compare))).toEqual(['a', 'd', 'c', 'b', 'e'])
    expect(ids(sortRows(rows, 'v', 'descending', compare))).toEqual(['c', 'a', 'd', 'b', 'e'])
  })

  it('does not mutate the input', () => {
    const copy = [...rows]
    sortRows(rows, 'v', 'descending')
    expect(rows).toEqual(copy)
  })

  it('keeps original order for unsupported types without a compare', () => {
    const dates = [
      { id: 'a', v: new Date(3) },
      { id: 'b', v: new Date(1) },
    ]
    expect(sortRows(dates, 'v', 'ascending').map((row) => row.id)).toEqual(['a', 'b'])
  })
})

describe('Table', () => {
  it('renders a table named by its caption with column headers', () => {
    renderTable()

    expect(screen.getByRole('table', { name: 'People' })).toBeInTheDocument()
    expect(screen.getAllByRole('columnheader')).toHaveLength(4)
    expect(screen.getAllByRole('row')).toHaveLength(people.length + 1)
  })

  it('has no aria-sort on any header before sorting', () => {
    renderTable()

    for (const th of screen.getAllByRole('columnheader')) {
      expect(th).not.toHaveAttribute('aria-sort')
    }
  })

  it('cycles ascending, descending, ascending on repeated clicks', async () => {
    const user = userEvent.setup()
    renderTable()
    const button = screen.getByRole('button', { name: /Name/ })

    await user.click(button)
    expect(header('Name')).toHaveAttribute('aria-sort', 'ascending')
    await user.click(button)
    expect(header('Name')).toHaveAttribute('aria-sort', 'descending')
    await user.click(button)
    expect(header('Name')).toHaveAttribute('aria-sort', 'ascending')
  })

  it('sets aria-sort only on the sorted column', async () => {
    const user = userEvent.setup()
    renderTable()

    await user.click(screen.getByRole('button', { name: /Age/ }))

    const headers = screen.getAllByRole('columnheader')
    const sorted = headers.filter((th) => th.hasAttribute('aria-sort'))
    expect(sorted).toHaveLength(1)
    expect(sorted[0]).toHaveTextContent('Age')
    expect(headers.filter((th) => !th.hasAttribute('aria-sort'))).toHaveLength(3)
  })

  it('moves aria-sort when another column is sorted', async () => {
    const user = userEvent.setup()
    renderTable()

    await user.click(screen.getByRole('button', { name: /Name/ }))
    await user.click(screen.getByRole('button', { name: /Age/ }))

    expect(screen.getByRole('columnheader', { name: /Name/ })).not.toHaveAttribute('aria-sort')
    expect(screen.getByRole('columnheader', { name: /Age/ })).toHaveAttribute('aria-sort', 'ascending')
  })

  it('sorts with the keyboard', async () => {
    const user = userEvent.setup()
    renderTable()

    await user.tab()
    await user.tab()
    expect(screen.getByRole('button', { name: /Name/ })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute('aria-sort', 'ascending')
    await user.keyboard(' ')
    expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute('aria-sort', 'descending')
  })

  it('sorts by the underlying value, not the rendered cell', async () => {
    const user = userEvent.setup()
    renderTable()

    // Rendered "10 years" would sort before "2 years" as text; the numbers must win.
    await user.click(screen.getByRole('button', { name: /Age/ }))
    // 2 (b, e), 10 (a, c), null last (d); ties in original order.
    expect(bodyIds()).toEqual(['b', 'e', 'a', 'c', 'd'])
  })

  it('puts null and undefined last in both directions, ties in original order', async () => {
    const user = userEvent.setup()
    renderTable()
    const button = screen.getByRole('button', { name: /Name/ })

    await user.click(button)
    expect(bodyIds()).toEqual(['b', 'a', 'd', 'c', 'e'])
    await user.click(button)
    expect(bodyIds()).toEqual(['d', 'a', 'b', 'c', 'e'])
  })

  it('keeps equal values in original order when descending', async () => {
    const user = userEvent.setup()
    renderTable()
    const button = screen.getByRole('button', { name: /Age/ })

    await user.click(button)
    await user.click(button)
    // 10 (a, c) before 2 (b, e); each pair keeps input order; null last.
    expect(bodyIds()).toEqual(['a', 'c', 'b', 'e', 'd'])
  })

  it('uses a custom compare for dates', async () => {
    const user = userEvent.setup()
    renderTable()

    await user.click(screen.getByRole('button', { name: /Joined/ }))

    expect(bodyIds()).toEqual(['b', 'c', 'a', 'd', 'e'])
  })

  it('does not mutate the rows prop', async () => {
    const user = userEvent.setup()
    const rows = [...people]
    renderTable({ rows })

    await user.click(screen.getByRole('button', { name: /Age/ }))

    expect(rows).toEqual(people)
  })

  it('supports an initial sort for uncontrolled use', () => {
    renderTable({ defaultSort: { key: 'age', direction: 'descending' } })

    expect(screen.getByRole('columnheader', { name: /Age/ })).toHaveAttribute('aria-sort', 'descending')
    expect(bodyIds()).toEqual(['a', 'c', 'b', 'e', 'd'])
  })

  it('shows controlled sort and leaves row order to the caller', async () => {
    const user = userEvent.setup()
    const onSortChange = vi.fn()
    renderTable({ sort: { key: 'name', direction: 'ascending' }, onSortChange })

    expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute('aria-sort', 'ascending')
    expect(bodyIds()).toEqual(['a', 'b', 'c', 'd', 'e'])

    await user.click(screen.getByRole('button', { name: /Name/ }))

    expect(onSortChange).toHaveBeenCalledWith({ key: 'name', direction: 'descending' })
    expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute('aria-sort', 'ascending')
  })

  it('selects rows and reflects the header checkbox state', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    renderTable({ selectable: true, onSelectionChange })
    const all = screen.getByRole('checkbox', { name: 'Select all rows' })

    await user.click(screen.getByRole('checkbox', { name: 'Select row 1' }))
    expect(onSelectionChange).toHaveBeenLastCalledWith(['a'])
    expect(all).toBePartiallyChecked()

    await user.click(all)
    expect(onSelectionChange).toHaveBeenLastCalledWith(['a', 'b', 'c', 'd', 'e'])
    expect(all).toBeChecked()

    await user.click(all)
    expect(onSelectionChange).toHaveBeenLastCalledWith([])
    expect(all).not.toBeChecked()
  })

  it('supports controlled selection and custom row labels', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    renderTable({
      selectable: true,
      selectedKeys: ['b'],
      onSelectionChange,
      getRowLabel: (row) => `Select ${row.id}`,
    })

    expect(screen.getByRole('checkbox', { name: 'Select b' })).toBeChecked()
    await user.click(screen.getByRole('checkbox', { name: 'Select a' }))

    expect(onSelectionChange).toHaveBeenCalledWith(['b', 'a'])
    expect(screen.getByRole('checkbox', { name: 'Select a' })).not.toBeChecked()
  })

  it('shows the empty message and disables select all', () => {
    renderTable({ rows: [], selectable: true, emptyMessage: 'No people yet.' })

    expect(screen.getByText('No people yet.')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Select all rows' })).toBeDisabled()
  })

  it('has no accessibility violations', async () => {
    const { container, rerender } = renderTable()
    await expectNoAxeViolations(container)

    rerender(
      <Table
        caption="People"
        columns={columns}
        rows={people}
        getRowKey={(row) => row.id}
        defaultSort={{ key: 'name', direction: 'descending' }}
        selectable
        defaultSelectedKeys={['a']}
      />,
    )
    await expectNoAxeViolations(container)

    rerender(
      <Table
        caption="People"
        columns={columns}
        rows={[]}
        getRowKey={(row: Person) => row.id}
        selectable
      />,
    )
    await expectNoAxeViolations(container)
  })
})
