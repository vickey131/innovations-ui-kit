import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs } from './Tabs'
import type { TabsProps } from './Tabs'

const tabs = [
  { id: 'profile', label: 'Profile', panel: 'Update your name and email.' },
  { id: 'billing', label: 'Billing', panel: 'Manage your plan and invoices.' },
  { id: 'team', label: 'Team', panel: 'Invite and manage teammates.' },
]

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Arrow keys, Home and End move between tabs and select them (automatic activation). Open UX questions (Q8): the keyboard activation model, overflow handling, hover/focus/disabled styling and underline thickness. A value that is missing or disabled falls back to the first enabled tab; if every tab is disabled nothing is selected and no tab is focusable.',
      },
    },
  },
  argTypes: {
    value: { control: 'text' },
    defaultValue: { control: 'text' },
    'aria-label': { control: 'text' },
  },
  args: { tabs, 'aria-label': 'Account settings' },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const DefaultSelection: Story = {
  args: { defaultValue: 'billing' },
}

export const DisabledTab: Story = {
  args: {
    tabs: [tabs[0], { ...tabs[1], disabled: true }, tabs[2]],
  },
}

export const AllDisabled: Story = {
  args: { tabs: tabs.map((tab) => ({ ...tab, disabled: true })) },
}

function ControlledDemo(args: TabsProps) {
  const [value, setValue] = useState('team')
  return <Tabs {...args} value={value} onValueChange={setValue} />
}

export const Controlled: Story = {
  render: (args) => <ControlledDemo {...args} />,
}
