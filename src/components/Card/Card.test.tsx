// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { expectNoAxeViolations } from '../../test/axe'
import { Card } from './Card'
import type { CardProps } from './Card'

describe('Card', () => {
  it('renders the body, header and footer', () => {
    render(
      <Card header="Open tickets" footer="Updated today">
        Body text
      </Card>,
    )

    expect(screen.getByText('Open tickets')).toBeInTheDocument()
    expect(screen.getByText('Body text')).toBeInTheDocument()
    expect(screen.getByText('Updated today')).toBeInTheDocument()
  })

  it('omits the header and footer when not provided', () => {
    const { container } = render(<Card>Body text</Card>)

    expect(container.querySelector('.card__header')).toBeNull()
    expect(container.querySelector('.card__footer')).toBeNull()
  })

  it('merges className and passes other props to the root', () => {
    render(
      <Card className="extra" data-testid="card">
        Body
      </Card>,
    )

    expect(screen.getByTestId('card')).toHaveClass('card', 'extra')
  })

  it('renders header actions on a static card', async () => {
    const user = userEvent.setup()
    render(
      <Card header="Team" headerActions={<button type="button">Edit</button>}>
        Body
      </Card>,
    )

    await user.tab()
    expect(screen.getByRole('button', { name: 'Edit' })).toHaveFocus()
  })

  it('renders a clickable card as a single link', () => {
    render(
      <Card href="/tickets/1" header="Ticket 1">
        Body
      </Card>,
    )

    const link = screen.getByRole('link', { name: /Ticket 1/ })
    expect(link).toHaveAttribute('href', '/tickets/1')
    expect(link).toHaveClass('card', 'card--clickable')
    expect(within(link).queryByRole('button')).toBeNull()
    expect(within(link).queryByRole('link')).toBeNull()
  })

  it('is reachable by keyboard when clickable', async () => {
    const user = userEvent.setup()
    render(<Card href="/tickets/1">Ticket 1</Card>)

    await user.tab()

    expect(screen.getByRole('link')).toHaveFocus()
  })

  it('does not render headerActions inside a clickable card', () => {
    // Untyped usage: the types forbid this combination.
    const props = {
      href: '/tickets/1',
      header: 'Ticket 1',
      headerActions: <button type="button">Edit</button>,
    } as unknown as CardProps
    render(<Card {...props}>Body</Card>)

    expect(screen.queryByRole('button', { name: 'Edit' })).toBeNull()
    expect(screen.getAllByRole('link')).toHaveLength(1)
  })

  it('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <Card header="Plain" footer="Footer">
          Body
        </Card>
        <Card
          header="With actions"
          headerActions={<button type="button">Edit</button>}
        >
          Body
        </Card>
        <Card href="/tickets/1" header="Clickable">
          Body
        </Card>
      </>,
    )

    await expectNoAxeViolations(container)
  })
})
