import type { Meta, StoryObj } from '@storybook/react-vite'
import { Select } from './Select'

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    children: { control: false },
  },
  args: {
    label: 'Role',
    placeholder: 'Choose a role',
    children: (
      <>
        <option value="admin">Admin</option>
        <option value="editor">Editor</option>
        <option value="viewer">Viewer</option>
      </>
    ),
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithHint: Story = {
  args: { hint: 'Your role controls what you can edit.' },
}

export const Required: Story = {
  args: { required: true },
}

export const ErrorState: Story = {
  name: 'Error',
  args: { required: true, error: 'Choose a role to continue.' },
}

export const Disabled: Story = {
  args: { defaultValue: 'viewer', disabled: true },
}
