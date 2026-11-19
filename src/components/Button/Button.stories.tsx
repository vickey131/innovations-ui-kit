import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Button } from './Button'

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    leadingIcon: { control: false },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    children: 'Save changes',
    size: 'md',
  },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Save changes' })
    await userEvent.tab()
    await expect(button).toHaveFocus()
  },
}

export const Small: Story = {
  args: {
    children: 'Small button',
    size: 'sm',
  },
}

export const Medium: Story = {
  args: {
    children: 'Medium button',
    size: 'md',
  },
}

export const Large: Story = {
  args: {
    children: 'Large button',
    size: 'lg',
  },
}

export const Disabled: Story = {
  args: {
    children: 'Disabled button',
    size: 'md',
    disabled: true,
  },
}
