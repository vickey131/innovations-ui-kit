import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Card } from './Card'

const guidance = [
  '## Usage guidelines',
  '',
  '- Use to group related content with an optional header, footer and, on a static card, `headerActions`.',
  '- Pass `href` to make the whole card one link.',
  '',
  "## Do and don't",
  '',
  '- **Do:** use `headerActions` for buttons on a static card.',
  '- **Do:** keep a clickable card to plain text and static content.',
  "- **Don't:** put buttons or links inside a clickable card.",
  "- **Don't:** combine `href` with `headerActions`: the types forbid it and the actions are dropped.",
  '',
  '## Accessibility',
  '',
  '- A static card is a plain `div` with no role. A clickable card is a single `a` element.',
  '- The accessible name of a clickable card is its text content, so write the header and body to make sense as a link.',
  '- The header is a `div`, not a heading. Add a heading inside it if the page structure needs one.',
].join('\n')

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Open UX questions: focus, active and disabled states of the clickable card; nested actions inside a clickable card (not supported: `href` and `headerActions` cannot be combined); header and footer dividers and padding. Cards are fluid width: UX specifies no responsive behaviour.\n\n' + guidance,
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
