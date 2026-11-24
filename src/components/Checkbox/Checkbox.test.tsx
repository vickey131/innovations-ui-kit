// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expectNoAxeViolations } from '../../test/axe'
import { describe, expect, it } from 'vitest'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('links the label to the checkbox', () => {
    render(<Checkbox label="Email notifications" />)

    expect(
      screen.getByRole('checkbox', { name: 'Email notifications' }),
    ).not.toBeChecked()
  })

  it('toggles with a click and with Space', async () => {
    const user = userEvent.setup()
    render(<Checkbox label="Email notifications" />)

    const checkbox = screen.getByRole('checkbox', {
      name: 'Email notifications',
    })
    await user.click(checkbox)
    expect(checkbox).toBeChecked()

    await user.keyboard(' ')
    expect(checkbox).not.toBeChecked()
  })

  it('shows the indeterminate state', () => {
    render(<Checkbox label="Select all" indeterminate />)

    expect(screen.getByRole('checkbox', { name: 'Select all' })).toBePartiallyChecked()
  })

  it('links the error to the checkbox and marks it invalid', () => {
    render(<Checkbox label="Accept terms" error="Select this option to continue." />)

    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' })
    expect(checkbox).toBeInvalid()
    expect(checkbox).toHaveAccessibleDescription('Select this option to continue.')
  })

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup()
    render(<Checkbox label="Email notifications" disabled />)

    const checkbox = screen.getByRole('checkbox', {
      name: 'Email notifications',
    })
    await user.click(checkbox)

    expect(checkbox).toBeDisabled()
    expect(checkbox).not.toBeChecked()
  })

  it('has no accessibility violations', async () => {
    const { container, rerender } = render(<Checkbox label="Email notifications" />)

    await expectNoAxeViolations(container)

    rerender(<Checkbox label="Email notifications" error="Select this option to continue." />)
    await expectNoAxeViolations(container)

    rerender(<Checkbox label="Email notifications" disabled />)
    await expectNoAxeViolations(container)
  })
})
