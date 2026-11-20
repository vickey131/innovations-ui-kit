import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './Badge'

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['success', 'warning', 'danger'],
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md'],
    },
  },
  args: { tone: 'success', children: 'Resolved' },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Success: Story = {
  args: { tone: 'success', children: 'Resolved' },
}

export const Warning: Story = {
  args: { tone: 'warning', children: 'Pending' },
}

export const Danger: Story = {
  args: { tone: 'danger', children: 'Overdue' },
}

export const Small: Story = {
  args: { tone: 'success', size: 'sm', children: 'Small' },
}

export const Medium: Story = {
  args: { tone: 'success', size: 'md', children: 'Medium' },
}
