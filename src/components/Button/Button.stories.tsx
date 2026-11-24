import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Button } from './Button'

const guidance = [
  '## Usage guidelines',
  '',
  '- Use for actions on the current page, such as saving or submitting. For navigation, use a link or a clickable Card.',
  '- Only `primary` is styled today. `secondary`, `ghost` and `danger` currently look like `primary` until UX specifies them.',
  '',
  "## Do and don't",
  '',
  '- **Do:** use a short verb label in sentence case, such as "Save changes".',
  '- **Do:** use `leadingIcon` to support the label, and `disabled` when the action is unavailable.',
  "- **Don't:** use a Button to navigate to another page.",
  "- **Don't:** rely on the `secondary`, `ghost` or `danger` look to show meaning yet.",
  '',
  '## Accessibility',
  '',
  '- Renders a native `button` with `type="button"` by default. Enter and Space activate it and it is in the Tab order.',
  '- `leadingIcon` is hidden from assistive technology, so the visible label is the accessible name. A label is always required.',
  '- A disabled button uses the native `disabled` attribute, so it is not focusable. The accessible name for icon-only buttons is an open UX question (Q2).',
].join('\n')

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: guidance } },
  },
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
