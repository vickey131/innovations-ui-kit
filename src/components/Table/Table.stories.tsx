import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '../Badge'
import { Table } from './Table'
import type { TableColumn, TableProps, TableSort } from './Table'
import { sortRows } from './sortRows'

interface Member {
  id: string
  name: string
  role: string
  status: 'Active' | 'Pending'
  lastActive: Date
}

const members: Member[] = [
  { id: '1', name: 'Priya Nair', role: 'Admin', status: 'Active', lastActive: new Date('2026-11-18') },
  { id: '2', name: 'Alex Chen', role: 'Agent', status: 'Active', lastActive: new Date('2026-11-20') },
  { id: '3', name: 'Sam Rivera', role: 'Agent', status: 'Pending', lastActive: new Date('2026-10-02') },
  { id: '4', name: 'Dana Okafor', role: 'Viewer', status: 'Active', lastActive: new Date('2026-11-12') },
]

const dateFormat = new Intl.DateTimeFormat('en', { dateStyle: 'medium' })

const columns: TableColumn<Member>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'role', header: 'Role' },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <Badge tone={row.status === 'Active' ? 'success' : 'warning'}>
        {row.status}
      </Badge>
    ),
  },
  {
    key: 'lastActive',
    header: 'Last active',
    sortable: true,
    compare: (a, b) => (a as Date).getTime() - (b as Date).getTime(),
    render: (row) => dateFormat.format(row.lastActive),
  },
]

const guidance = [
  '## Usage guidelines',
  '',
  '- Use for tabular data with optional sorting and row selection. A `caption` and a unique `getRowKey` are required.',
  '- Sort is uncontrolled by default. If you pass `sort`, you must sort the rows yourself.',
  '',
  "## Do and don't",
  '',
  '- **Do:** give the table a `caption`: it is its accessible name.',
  '- **Do:** set `compare` on columns with dates or other non-string values, and `getRowLabel` to name each row checkbox.',
  "- **Don't:** expect sorting to use the rendered cell: it reads `row[key]`, not `render`.",
  "- **Don't:** pass a controlled `sort` without sorting the rows: the table will not reorder them.",
  '',
  '## Accessibility',
  '',
  '- Renders a real `table` with a caption and `scope="col"` headers. Sortable headers are buttons, and the sorted column has `aria-sort`.',
  '- The wrapper is a focusable region named by the caption, so keyboard users can scroll a wide table.',
  '- With `selectable`, each row checkbox is named "Select row N" unless you set `getRowLabel`. The header checkbox "Select all rows" covers the rows shown and shows a mixed state.',
].join('\n')

const meta = {
  title: 'Components/Table',
  component: Table<Member>,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Open UX questions: whether a third sort click returns to unsorted (Q9, today it returns to ascending); layout below 768px (Q10, today the table scrolls horizontally); row hover and selected styling (no semantic tokens); header background, sticky header, loading state, bulk-action UI; pagination (select all applies to the rows shown); empty-state illustration asset; arrow glyphs; how sort is announced beyond `aria-sort`.\n\n' + guidance,
      },
    },
  },
  argTypes: {
    caption: { control: 'text' },
    selectable: { control: 'boolean' },
    emptyMessage: { control: 'text' },
    columns: { control: false },
    rows: { control: false },
    getRowKey: { control: false },
    sort: { control: false },
    defaultSort: { control: false },
    emptyIllustration: { control: false },
  },
  args: {
    caption: 'Team members',
    columns,
    rows: members,
    getRowKey: (row: Member) => row.id,
  },
} satisfies Meta<typeof Table<Member>>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SortedAscending: Story = {
  args: { defaultSort: { key: 'name', direction: 'ascending' } },
}

export const SortedDescending: Story = {
  args: { defaultSort: { key: 'lastActive', direction: 'descending' } },
}

export const Selectable: Story = {
  args: { selectable: true, defaultSelectedKeys: ['2'] },
}

export const Empty: Story = {
  args: { rows: [], selectable: true, emptyMessage: 'No team members yet. Invite someone to get started.' },
}

function ControlledSortDemo(args: TableProps<Member>) {
  const [sort, setSort] = useState<TableSort<Member>>({
    key: 'name',
    direction: 'ascending',
  })
  const column = columns.find((item) => item.key === sort.key)
  const rows = sortRows(members, sort.key, sort.direction, column?.compare)
  return <Table {...args} rows={rows} sort={sort} onSortChange={setSort} />
}

export const Controlled: Story = {
  render: (args) => <ControlledSortDemo {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          'Controlled sort: the table shows `aria-sort` and reports clicks, and the caller sorts the rows (for example on a server).',
      },
    },
  },
}

export const NarrowViewport: Story = {
  args: { selectable: true },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  parameters: {
    docs: {
      description: {
        story:
          'Below 768px the table scrolls horizontally inside a focusable region. Stacked cards are not built: UX Q10 is open.',
      },
    },
  },
}
