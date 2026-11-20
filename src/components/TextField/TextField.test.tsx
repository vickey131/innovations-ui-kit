// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expectNoAxeViolations } from '../../test/axe'
import { describe, expect, it } from 'vitest'
import { TextField } from './TextField'

describe('TextField', () => {
  it('links the label to the input', () => {
    render(<TextField label="Profile name" />)

    expect(screen.getByLabelText('Profile name')).toBeInTheDocument()
  })

  it('links the hint to the input', () => {
    render(<TextField label="Profile name" hint="Shown on your profile." />)

    expect(screen.getByLabelText('Profile name')).toHaveAccessibleDescription(
      'Shown on your profile.',
    )
  })

  it('shows the error instead of the hint and marks the input invalid', () => {
    render(
      <TextField
        label="Profile name"
        hint="Shown on your profile."
        error="Enter at least 3 characters."
      />,
    )

    const input = screen.getByLabelText('Profile name')
    expect(input).toBeInvalid()
    expect(input).toHaveAccessibleDescription('Enter at least 3 characters.')
    expect(screen.queryByText('Shown on your profile.')).not.toBeInTheDocument()
  })

  it('marks the input as required', () => {
    render(<TextField label="Profile name" required />)

    expect(screen.getByLabelText(/Profile name/)).toBeRequired()
  })

  it('updates the counter as the user types', async () => {
    const user = userEvent.setup()
    render(<TextField label="Bio" maxLength={10} showCounter />)

    expect(screen.getByText('0 / 10')).toBeInTheDocument()
    await user.type(screen.getByLabelText('Bio'), 'abc')

    expect(screen.getByText('3 / 10')).toBeInTheDocument()
  })

  it('supports disabled and read-only', () => {
    render(
      <>
        <TextField label="Disabled field" disabled />
        <TextField label="Read-only field" readOnly />
      </>,
    )

    expect(screen.getByLabelText('Disabled field')).toBeDisabled()
    expect(screen.getByLabelText('Read-only field')).toHaveAttribute('readonly')
  })

  it('has no accessibility violations', async () => {
    const { container } = render(
      <TextField label="Profile name" hint="Shown on your profile." />,
    )

    await expectNoAxeViolations(container)
  })
})
