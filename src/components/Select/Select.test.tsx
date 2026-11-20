// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expectNoAxeViolations } from '../../test/axe'
import { describe, expect, it } from 'vitest'
import { Select } from './Select'

const options = (
  <>
    <option value="admin">Admin</option>
    <option value="viewer">Viewer</option>
  </>
)

describe('Select', () => {
  it('links the label to the select', () => {
    render(<Select label="Role">{options}</Select>)

    expect(screen.getByRole('combobox', { name: 'Role' })).toBeInTheDocument()
  })

  it('lets the user choose an option', async () => {
    const user = userEvent.setup()
    render(
      <Select label="Role" placeholder="Choose a role">
        {options}
      </Select>,
    )

    const select = screen.getByRole('combobox', { name: 'Role' })
    expect(select).toHaveValue('')
    await user.selectOptions(select, 'Viewer')

    expect(select).toHaveValue('viewer')
  })

  it('links the error to the select and marks it invalid', () => {
    render(
      <Select label="Role" error="Choose a role to continue.">
        {options}
      </Select>,
    )

    const select = screen.getByRole('combobox', { name: 'Role' })
    expect(select).toBeInvalid()
    expect(select).toHaveAccessibleDescription('Choose a role to continue.')
  })

  it('supports disabled', () => {
    render(
      <Select label="Role" disabled>
        {options}
      </Select>,
    )

    expect(screen.getByRole('combobox', { name: 'Role' })).toBeDisabled()
  })

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Select label="Role" hint="Controls what you can edit.">
        {options}
      </Select>,
    )

    await expectNoAxeViolations(container)
  })
})
