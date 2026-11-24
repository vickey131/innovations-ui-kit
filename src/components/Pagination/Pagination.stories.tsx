import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Pagination } from './Pagination'
import type { PaginationProps } from './Pagination'

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Controlled: pass `page` (1-based), `pageCount` and `onPageChange`. Only the Playground story keeps its own page state; the other stories are static. Open UX questions: hover and active styling (non-current pages have a transparent background, no border and no hover or active style), the Previous/Next icons (text glyphs for now), screen-reader handling of the ellipsis, and the label wording (fixed English strings).',
      },
    },
  },
  args: {
    page: 1,
    pageCount: 10,
    onPageChange: fn(),
  },
  argTypes: {
    page: { control: 'number' },
    pageCount: { control: 'number' },
    siblingCount: { control: 'number' },
    boundaryCount: { control: 'number' },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    disabled: { control: 'boolean' },
    onPageChange: { control: false },
  },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const FirstPage: Story = { args: { page: 1, pageCount: 10 } }

export const MiddlePage: Story = { args: { page: 5, pageCount: 10 } }

export const LastPage: Story = { args: { page: 10, pageCount: 10 } }

export const SinglePage: Story = { args: { page: 1, pageCount: 1 } }

export const ManyPages: Story = { args: { page: 50, pageCount: 100 } }

export const Small: Story = { args: { page: 5, pageCount: 10, size: 'sm' } }

export const Disabled: Story = { args: { page: 5, pageCount: 10, disabled: true } }

function PlaygroundDemo({ page: initialPage, onPageChange, ...args }: PaginationProps) {
  const [page, setPage] = useState(initialPage)
  return (
    <Pagination
      {...args}
      page={page}
      onPageChange={(next) => {
        setPage(next)
        onPageChange(next)
      }}
    />
  )
}

export const Playground: Story = {
  args: { page: 1, pageCount: 5 },
  render: (args) => <PlaygroundDemo {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Next page' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Next page' }))
    await expect(canvas.getByRole('button', { name: 'Page 3' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  },
}
