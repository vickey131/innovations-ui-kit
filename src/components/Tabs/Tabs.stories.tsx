import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Tabs } from './Tabs'
import type { TabsProps } from './Tabs'

const tabs = [
  { id: 'profile', label: 'Profile', panel: 'Update your name and email.', disabled: false },
  { id: 'billing', label: 'Billing', panel: 'Manage your plan and invoices.', disabled: false },
  { id: 'team', label: 'Team', panel: 'Invite and manage teammates.', disabled: false },
]

function TabsDemo({
  items = tabs,
  ...args
}: { items?: typeof tabs } & Omit<TabsProps, 'children'>) {
  return (
    <Tabs {...args}>
      <Tabs.List aria-label="Account settings">
        {items.map((item) => (
          <Tabs.Tab key={item.id} value={item.id} disabled={item.disabled}>
            {item.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {items.map((item) => (
        <Tabs.Panel key={item.id} value={item.id}>
          {item.panel}
        </Tabs.Panel>
      ))}
    </Tabs>
  )
}

const meta = {
  title: 'Components/Tabs',
  component: TabsDemo,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Compound API: `Tabs`, `Tabs.List`, `Tabs.Tab` and `Tabs.Panel`. Arrow keys, Home and End move between tabs and select them (automatic activation). Open UX questions (Q8): the keyboard activation model, overflow handling, hover/focus/disabled styling and underline thickness. A value that is missing or disabled falls back to the first enabled tab; if every tab is disabled nothing is selected and no tab is focusable.',
      },
    },
  },
  argTypes: {
    value: { control: 'text' },
    defaultValue: { control: 'text' },
  },
} satisfies Meta<typeof TabsDemo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('tab', { name: 'Profile' }))
    await userEvent.keyboard('{ArrowRight}')
    await expect(canvas.getByRole('tab', { name: 'Billing' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Manage your plan and invoices.')
  },
}

export const DefaultSelection: Story = {
  args: { defaultValue: 'billing' },
}

export const DisabledTab: Story = {
  args: {
    items: [tabs[0], { ...tabs[1], disabled: true }, tabs[2]],
  },
}

export const AllDisabled: Story = {
  args: { items: tabs.map((tab) => ({ ...tab, disabled: true })) },
}

function ControlledDemo(args: Omit<TabsProps, 'children'>) {
  const [value, setValue] = useState('team')
  return <TabsDemo {...args} value={value} onValueChange={setValue} />
}

export const Controlled: Story = {
  render: (args) => <ControlledDemo {...args} />,
}
