import type { Meta, StoryObj } from '@storybook/react-vite'
import { Alert } from './Alert'

const meta = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Open UX questions: the `info` tone (no colour token), auto-dismiss and timing, placement and stacking, per-tone icons, and whether post-action and on-load alerts should use different live-region roles. Until decided, `danger` defaults to `role="alert"` and other tones to `role="status"`; override with the `role` prop.',
      },
    },
  },
  argTypes: {
    tone: { control: 'inline-radio', options: ['success', 'warning', 'danger'] },
    role: { control: 'inline-radio', options: [undefined, 'alert', 'status'] },
    title: { control: 'text' },
    dismissLabel: { control: 'text' },
  },
  args: { tone: 'success', children: 'Your settings were saved.' },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Success: Story = {}

export const Warning: Story = {
  args: { tone: 'warning', children: 'Your session expires in 5 minutes.' },
}

export const Danger: Story = {
  args: { tone: 'danger', children: 'We could not save your settings. Check your connection and try again.' },
}

export const WithTitle: Story = {
  args: { title: 'Saved', children: 'Your changes are live.' },
}

export const Dismissible: Story = {
  args: { onDismiss: () => {} },
}

export const StatusRole: Story = {
  name: 'Role: status',
  args: { tone: 'warning', role: 'status' },
}

export const AlertRole: Story = {
  name: 'Role: alert',
  args: { tone: 'warning', role: 'alert' },
}
