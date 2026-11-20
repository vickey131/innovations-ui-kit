import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextField } from './TextField'

const meta = {
  title: 'Components/TextField',
  component: TextField,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
    showCounter: { control: 'boolean' },
    maxLength: { control: 'number' },
  },
  args: {
    label: 'Profile name',
  },
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { placeholder: 'Enter your name' },
}

export const WithHint: Story = {
  args: { hint: 'This name is shown on your profile.' },
}

export const Required: Story = {
  args: { required: true },
}

export const Filled: Story = {
  args: { defaultValue: 'Alex Morgan' },
}

export const ErrorState: Story = {
  name: 'Error',
  args: {
    defaultValue: 'Al',
    error: 'Enter at least 3 characters.',
  },
}

export const Disabled: Story = {
  args: { defaultValue: 'Alex Morgan', disabled: true },
}

export const ReadOnly: Story = {
  args: { label: 'Email', defaultValue: 'alex@example.com', readOnly: true },
}

export const WithCounter: Story = {
  args: { defaultValue: 'Alex', maxLength: 100, showCounter: true },
}
