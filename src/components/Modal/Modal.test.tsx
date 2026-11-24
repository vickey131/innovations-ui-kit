// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { useDisclosure } from '../../hooks/useDisclosure'
import { expectNoAxeViolations } from '../../test/axe'
import { Button } from '../Button'
import { Modal } from './Modal'

function Harness({ withFooter = true }: { withFooter?: boolean }) {
  const { isOpen, open, close } = useDisclosure()
  return (
    <>
      <button type="button" onClick={open}>
        Open modal
      </button>
      <Modal
        open={isOpen}
        onClose={close}
        title="Edit profile"
        footer={
          withFooter ? (
            <>
              <Button onClick={close}>Cancel</Button>
              <Button>Save</Button>
            </>
          ) : undefined
        }
      >
        <input aria-label="Display name" />
      </Modal>
    </>
  )
}

describe('Modal', () => {
  it('renders nothing when closed', () => {
    render(
      <Modal open={false} onClose={() => {}} title="Edit profile">
        Body
      </Modal>,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders a modal dialog named by its title', () => {
    render(
      <Modal open onClose={() => {}} title="Edit profile">
        Body
      </Modal>,
    )

    const dialog = screen.getByRole('dialog', { name: 'Edit profile' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveTextContent('Body')
  })

  it('moves focus to the dialog when opened', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.click(screen.getByRole('button', { name: 'Open modal' }))

    expect(screen.getByRole('dialog')).toHaveFocus()
  })

  it('keeps Tab inside the dialog and wraps from last to first', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByRole('button', { name: 'Open modal' }))

    const close = screen.getByRole('button', { name: 'Close' })
    const save = screen.getByRole('button', { name: 'Save' })

    save.focus()
    await user.tab()

    expect(close).toHaveFocus()
  })

  it('wraps Shift+Tab from first to last', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByRole('button', { name: 'Open modal' }))

    screen.getByRole('button', { name: 'Close' }).focus()
    await user.tab({ shift: true })

    expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus()
  })

  it('moves to the first focusable element with Tab from the container', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByRole('button', { name: 'Open modal' }))
    expect(screen.getByRole('dialog')).toHaveFocus()

    await user.tab()

    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus()
  })

  it('moves to the last focusable element with Shift+Tab from the container', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByRole('button', { name: 'Open modal' }))
    expect(screen.getByRole('dialog')).toHaveFocus()

    await user.tab({ shift: true })

    expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus()
  })

  it('keeps focus on the container when there is nothing focusable', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByRole('button', { name: 'Open modal' }))
    const dialog = screen.getByRole('dialog')
    // Remove every focusable control to exercise the empty case.
    dialog.querySelectorAll('button, input').forEach((node) => node.remove())
    dialog.focus()

    await user.tab()
    expect(dialog).toHaveFocus()

    await user.tab({ shift: true })
    expect(dialog).toHaveFocus()
  })

  it('calls onClose on Escape', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose} title="Edit profile">
        Body
      </Modal>,
    )

    await user.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose from the close button', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose} title="Edit profile" closeLabel="Close dialog">
        Body
      </Modal>,
    )

    await user.click(screen.getByRole('button', { name: 'Close dialog' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not close when the overlay is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose} title="Edit profile">
        Body
      </Modal>,
    )

    await user.click(screen.getByRole('dialog').parentElement as HTMLElement)

    expect(onClose).not.toHaveBeenCalled()
  })

  it('returns focus to the opener after Escape', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    const opener = screen.getByRole('button', { name: 'Open modal' })

    await user.click(opener)
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(opener).toHaveFocus()
  })

  it('returns focus to the opener after the close button', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    const opener = screen.getByRole('button', { name: 'Open modal' })

    await user.click(opener)
    await user.click(screen.getByRole('button', { name: 'Close' }))

    expect(opener).toHaveFocus()
  })

  it('has no accessibility violations', async () => {
    render(
      <Modal open onClose={() => {}} title="Edit profile" footer={<Button>Save</Button>}>
        Body
      </Modal>,
    )

    await expectNoAxeViolations(screen.getByRole('dialog'))
  })
})
