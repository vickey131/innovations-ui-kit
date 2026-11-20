// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAxeViolations } from '../../test/axe'
import { Alert } from './Alert'

describe('Alert', () => {
  it('uses the status role by default', () => {
    render(<Alert tone="success">Settings saved.</Alert>)

    expect(screen.getByRole('status')).toHaveTextContent('Settings saved.')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('uses the alert role for the danger tone', () => {
    render(<Alert tone="danger">Could not save. Try again.</Alert>)

    expect(screen.getByRole('alert')).toHaveTextContent('Could not save. Try again.')
  })

  it('uses status for warning by default', () => {
    render(<Alert tone="warning">Your session expires soon.</Alert>)

    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('lets the role be overridden', () => {
    render(
      <Alert tone="danger" role="status">
        Upload failed.
      </Alert>,
    )

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('renders the title', () => {
    render(
      <Alert tone="success" title="Saved">
        Your changes are live.
      </Alert>,
    )

    expect(screen.getByText('Saved')).toBeInTheDocument()
  })

  it('does not render a dismiss button without onDismiss', () => {
    render(<Alert tone="success">Settings saved.</Alert>)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('calls onDismiss from a named dismiss button', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(
      <Alert tone="success" onDismiss={onDismiss}>
        Settings saved.
      </Alert>,
    )

    await user.click(screen.getByRole('button', { name: 'Dismiss' }))

    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Alert tone="warning" title="Heads up" onDismiss={() => {}}>
        Your session expires soon.
      </Alert>,
    )

    await expectNoAxeViolations(container)
  })
})
