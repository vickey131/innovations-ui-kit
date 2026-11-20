import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Card } from './Card'

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Open UX questions: focus, active and disabled states of the clickable card; nested actions inside a clickable card (not supported: `href` and `headerActions` cannot be combined); header and footer dividers and padding. Cards are fluid width: UX specifies no responsive behaviour.',
      },
    },
  },
  argTypes: {
    header: { control: 'text' },
    footer: { control: 'text' },
    children: { control: 'text' },
    headerActions: { control: false },
    href: { control: 'text' },
  },
  args: { children: 'Three tickets are waiting for a reply.' },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithHeader: Story = {
  args: { header: 'Open tickets' },
}

export const WithHeaderActions: Story = {
  args: {
    header: 'Open tickets',
    headerActions: <Button variant="primary">View all</Button>,
  },
}

export const WithFooter: Story = {
  args: { footer: 'Updated 5 minutes ago' },
}

export const Full: Story = {
  args: {
    header: 'Open tickets',
    headerActions: <Button variant="primary">View all</Button>,
    footer: 'Updated 5 minutes ago',
  },
}

export const Clickable: Story = {
  args: {
    href: '#tickets',
    header: 'Open tickets',
    footer: 'Updated 5 minutes ago',
  },
  parameters: {
    docs: {
      description: {
        story:
          'The whole card is one link. Do not add buttons or links inside it; header actions are not available on a clickable card.',
      },
    },
  },
}
