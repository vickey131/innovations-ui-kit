import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Button } from './Button'

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
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

const pendingUx =
  'Styling pending UX specification: no colours are defined yet for this variant, so it currently renders with the primary appearance.'

export const Secondary: Story = {
  name: 'Secondary (styling pending UX)',
  parameters: { docs: { description: { story: pendingUx } } },
  args: {
    children: 'Cancel',
    variant: 'secondary',
  },
}

export const Ghost: Story = {
  name: 'Ghost (styling pending UX)',
  parameters: { docs: { description: { story: pendingUx } } },
  args: {
    children: 'Learn more',
    variant: 'ghost',
  },
}

export const Danger: Story = {
  name: 'Danger (styling pending UX)',
  parameters: { docs: { description: { story: pendingUx } } },
  args: {
    children: 'Delete item',
    variant: 'danger',
  },
}

export const WithLeadingIcon: Story = {
  args: {
    children: 'Add item',
    leadingIcon: '+',
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
