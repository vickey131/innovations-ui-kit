// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAxeViolations } from '../../test/axe'
import { Pagination } from './Pagination'
import { getPaginationRange } from './getPaginationRange'

function rendered(page: number, pageCount: number, siblingCount?: number, boundaryCount?: number) {
  return getPaginationRange(page, pageCount, siblingCount, boundaryCount)
    .items.map((item) => (item === 'ellipsis' ? '…' : String(item)))
    .join(' ')
}

describe('getPaginationRange', () => {
  it.each([
    [1, 1, '1'],
    [1, 3, '1 2 3'],
    [3, 5, '1 2 3 4 5'],
    [1, 5, '1 2 … 5'],
    [1, 10, '1 2 … 10'],
    [5, 10, '1 … 4 5 6 … 10'],
    [4, 10, '1 2 3 4 5 … 10'],
    [10, 10, '1 … 9 10'],
  ])('page %i of %i renders %s', (page, pageCount, expected) => {
    expect(rendered(page, pageCount)).toBe(expected)
  })

  it('honours siblingCount and boundaryCount', () => {
    expect(rendered(10, 20, 2, 2)).toBe('1 2 … 8 9 10 11 12 … 19 20')
    expect(rendered(5, 10, 0, 1)).toBe('1 … 5 … 10')
    expect(rendered(5, 10, 1, 0)).toBe('… 4 5 6 …')
  })

  it.each([
    ['pageCount 0', 1, 0],
    ['negative pageCount', 1, -3],
    ['NaN pageCount', 1, NaN],
    ['Infinity pageCount', 1, Infinity],
    ['pageCount below 1', 1, 0.5],
  ])('has nothing to render for %s', (_name, page, pageCount) => {
    expect(getPaginationRange(page, pageCount)).toEqual({ page: 1, pageCount: 0, items: [] })
  })

  it('floors pageCount', () => {
    expect(getPaginationRange(1, 3.9)).toMatchObject({ pageCount: 3, items: [1, 2, 3] })
  })

  it.each([
    ['above the range', 99, 10],
    ['below the range', -4, 1],
    ['zero', 0, 1],
    ['NaN', NaN, 1],
    ['Infinity', Infinity, 1],
    ['non-integer', 4.8, 4],
    ['non-integer above the range', 10.5, 10],
  ])('normalizes a page %s', (_name, page, expected) => {
    expect(getPaginationRange(page, 10).page).toBe(expected)
  })

  it('treats negative counts as 0, floors fractions and defaults non-finite counts to 1', () => {
    expect(rendered(5, 10, -2, -1)).toBe(rendered(5, 10, 0, 0))
    expect(rendered(5, 10, 1.9, 1.9)).toBe(rendered(5, 10, 1, 1))
    expect(rendered(5, 10, NaN, Infinity)).toBe(rendered(5, 10, 1, 1))
  })
})

describe('Pagination', () => {
  it('renders a labelled navigation landmark that can be overridden', () => {
    const { rerender } = render(<Pagination page={1} pageCount={5} onPageChange={vi.fn()} />)
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument()

    rerender(<Pagination page={1} pageCount={5} onPageChange={vi.fn()} aria-label="Case pages" />)
    expect(screen.getByRole('navigation', { name: 'Case pages' })).toBeInTheDocument()
  })

  it('names the buttons and shows the visible Previous and Next text', () => {
    render(<Pagination page={5} pageCount={10} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Previous page' })).toHaveTextContent('Previous')
    expect(screen.getByRole('button', { name: 'Next page' })).toHaveTextContent('Next')
    expect(screen.getByRole('button', { name: 'Page 4' })).toHaveTextContent('4')
  })

  it('shows the pages and non-interactive ellipses for 5 of 10', () => {
    render(<Pagination page={5} pageCount={10} onPageChange={vi.fn()} />)

    const pages = screen
      .getAllByRole('button', { name: /^Page / })
      .map((button) => button.textContent)
    expect(pages).toEqual(['1', '4', '5', '6', '10'])
    expect(screen.getAllByText('…')).toHaveLength(2)
    expect(screen.getAllByRole('button')).toHaveLength(7)
  })

  it('marks only the current page with aria-current', () => {
    render(<Pagination page={4} pageCount={10} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Page 4' })).toHaveAttribute('aria-current', 'page')
    expect(document.querySelectorAll('[aria-current]')).toHaveLength(1)
  })

  it('uses the md size by default and supports sm', () => {
    const { rerender } = render(<Pagination page={1} pageCount={3} onPageChange={vi.fn()} />)
    expect(screen.getByRole('navigation')).toHaveClass('pagination--md')

    rerender(<Pagination page={1} pageCount={3} size="sm" onPageChange={vi.fn()} />)
    expect(screen.getByRole('navigation')).toHaveClass('pagination--sm')
  })

  it('disables Previous on the first page and Next on the last page', () => {
    const { rerender } = render(<Pagination page={1} pageCount={5} onPageChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next page' })).toBeEnabled()

    rerender(<Pagination page={5} pageCount={5} onPageChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled()

    rerender(<Pagination page={3} pageCount={5} onPageChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Next page' })).toBeEnabled()
  })

  it('disables both Previous and Next for a single page', () => {
    render(<Pagination page={1} pageCount={1} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page')
  })

  it('calls onPageChange with the clicked page', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination page={5} pageCount={10} onPageChange={onPageChange} />)

    await user.click(screen.getByRole('button', { name: 'Page 6' }))

    expect(onPageChange).toHaveBeenCalledTimes(1)
    expect(onPageChange).toHaveBeenCalledWith(6)
  })

  it('does nothing when the current page is clicked', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination page={5} pageCount={10} onPageChange={onPageChange} />)

    await user.click(screen.getByRole('button', { name: 'Page 5' }))

    expect(onPageChange).not.toHaveBeenCalled()
  })

  it('calls onPageChange with the previous and next page', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination page={5} pageCount={10} onPageChange={onPageChange} />)

    await user.click(screen.getByRole('button', { name: 'Previous page' }))
    await user.click(screen.getByRole('button', { name: 'Next page' }))

    expect(onPageChange).toHaveBeenNthCalledWith(1, 4)
    expect(onPageChange).toHaveBeenNthCalledWith(2, 6)
  })

  it('stays on the controlled page until the parent updates it', async () => {
    const user = userEvent.setup()
    render(<Pagination page={2} pageCount={5} onPageChange={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Next page' }))

    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page')
  })

  it('is operable with Tab, Enter and Space', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination page={1} pageCount={5} onPageChange={onPageChange} />)

    await user.tab()
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveFocus()

    await user.tab()
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(onPageChange).toHaveBeenLastCalledWith(2)

    await user.keyboard(' ')
    expect(onPageChange).toHaveBeenCalledTimes(2)
  })

  it.each([
    ['0', 0],
    ['negative', -2],
    ['NaN', NaN],
    ['Infinity', Infinity],
  ])('renders nothing when pageCount is %s', (_name, pageCount) => {
    const { container } = render(
      <Pagination page={1} pageCount={pageCount} onPageChange={vi.fn()} />,
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('clamps an out-of-range page without calling onPageChange', () => {
    const onPageChange = vi.fn()
    const { rerender } = render(<Pagination page={99} pageCount={10} onPageChange={onPageChange} />)
    expect(screen.getByRole('button', { name: 'Page 10' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled()

    rerender(<Pagination page={0} pageCount={10} onPageChange={onPageChange} />)
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled()

    rerender(<Pagination page={NaN} pageCount={10} onPageChange={onPageChange} />)
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page')

    expect(onPageChange).not.toHaveBeenCalled()
  })

  it('moves relative to the clamped page', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination page={99} pageCount={10} onPageChange={onPageChange} />)

    await user.click(screen.getByRole('button', { name: 'Previous page' }))

    expect(onPageChange).toHaveBeenCalledWith(9)
  })

  it('disables every button and ignores clicks when disabled', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination page={5} pageCount={10} disabled onPageChange={onPageChange} />)

    for (const button of screen.getAllByRole('button')) {
      expect(button).toBeDisabled()
    }
    expect(screen.getByRole('button', { name: 'Page 5' })).toHaveAttribute('aria-current', 'page')

    await user.click(screen.getByRole('button', { name: 'Page 6' }))
    expect(onPageChange).not.toHaveBeenCalled()
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<Pagination page={5} pageCount={10} onPageChange={vi.fn()} />)

    await expectNoAxeViolations(container)
  })

  it('has no accessibility violations when disabled', async () => {
    const { container } = render(
      <Pagination page={5} pageCount={10} disabled onPageChange={vi.fn()} />,
    )

    await expectNoAxeViolations(container)
  })
})
