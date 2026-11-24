import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './Badge'

const guidance = [
  '## Usage guidelines',
  '',
  '- Use for a short status label next to other content, such as Resolved, Pending or Overdue.',
  '- Choose the tone that matches the meaning and the size (`sm` or `md`) that fits the surrounding text.',
  '',
  "## Do and don't",
  '',
  '- **Do:** use one or two words in sentence case.',
  '- **Do:** match the tone to the status: `success`, `warning` or `danger`.',
  "- **Don't:** use a Badge as a button or link: it renders a plain `span` with no interactive behaviour.",
  "- **Don't:** rely on colour alone: the text must state the status.",
  '',
  '## Accessibility',
  '',
  '- Renders a `span` with no role, so the badge text is read as part of the surrounding content.',
  '- The status is conveyed by the text. Colour is only a visual extra, and no icon is specified yet.',
].join('\n')

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: guidance } },
  },
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
