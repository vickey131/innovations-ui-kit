import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { Button } from './Button'

describe('Button', () => {
  it('renders its label as a button', () => {
    render(<Button>Save changes</Button>)

    expect(screen.getByRole('button', { name: 'Save changes' })).toBeInTheDocument()
  })

  it.each([
    ['sm', 'button--sm'],
    ['md', 'button--md'],
    ['lg', 'button--lg'],
  ] as const)('renders the %s size', (size, className) => {
    render(<Button size={size}>Continue</Button>)

    expect(screen.getByRole('button', { name: 'Continue' })).toHaveClass(className)
  })

  it('calls onClick when activated', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Continue</Button>)

    await user.click(screen.getByRole('button', { name: 'Continue' }))

    expect(onClick).toHaveBeenCalledOnce()
  })

  it.each(['{Enter}', ' '])('activates with keyboard input %s', async (key) => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Continue</Button>)

    await user.tab()
    await user.keyboard(key)

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('has no detectable accessibility violations', async () => {
    const { container } = render(<Button>Save changes</Button>)

    expect(await axe(container)).toHaveNoViolations()
  })

  it('does not activate when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button disabled onClick={onClick}>Continue</Button>)
    const button = screen.getByRole('button', { name: 'Continue' })

    expect(button).toBeDisabled()
    await user.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })
})
