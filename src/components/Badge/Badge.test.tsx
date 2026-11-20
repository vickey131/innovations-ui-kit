// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { expectNoAxeViolations } from '../../test/axe'
import { describe, expect, it } from 'vitest'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders its text with the requested tone and default size', () => {
    render(<Badge tone="warning">Pending</Badge>)

    expect(screen.getByText('Pending')).toHaveClass('badge--warning', 'badge--md')
  })

  it('applies the requested size', () => {
    render(
      <Badge tone="danger" size="sm">
        Overdue
      </Badge>,
    )

    expect(screen.getByText('Overdue')).toHaveClass('badge--danger', 'badge--sm')
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<Badge tone="success">Resolved</Badge>)

    await expectNoAxeViolations(container)
  })
})
