// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders a button with its label and default props', () => {
    render(<Button>Save changes</Button>)

    const button = screen.getByRole('button', { name: 'Save changes' })
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveClass('button', 'button--md')
  })

  it('applies the requested size and renders a leading icon', () => {
    render(
      <Button size="lg" leadingIcon={<span data-testid="icon">+</span>}>
        Add item
      </Button>,
    )

    expect(screen.getByRole('button', { name: 'Add item' })).toHaveClass(
      'button--lg',
    )
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Continue</Button>)

    await user.click(screen.getByRole('button', { name: 'Continue' }))

    expect(handleClick).toHaveBeenCalledOnce()
  })
})
