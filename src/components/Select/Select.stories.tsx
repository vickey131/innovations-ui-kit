import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Select } from './Select'

const guidance = [
  '## Usage guidelines',
  '',
  '- Use to choose one value from a short list of options. It wraps a native select; multiple selection is not supported.',
  '- Use `placeholder` for an empty first option shown until the user chooses.',
  '',
  "## Do and don't",
  '',
  '- **Do:** always set a `label` in sentence case.',
  '- **Do:** make an `error` say what to do, such as "Choose a role."',
  "- **Don't:** use the `placeholder` as a replacement for the label.",
  "- **Don't:** use it for a yes or no choice: use a Checkbox.",
  '',
  '## Accessibility',
  '',
  "- Renders a native select (combobox) linked to its visible label. Keyboard use follows the browser's native behaviour.",
  '- `hint` or `error` is linked with `aria-describedby`. An `error` replaces the hint and sets `aria-invalid`.',
  '- `required` sets the native attribute. The * in the label is hidden from assistive technology.',
].join('\n')

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: guidance } },
  },
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

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const select = within(canvasElement).getByRole('combobox', { name: 'Role' })
    await userEvent.selectOptions(select, 'editor')
    await expect(select).toHaveValue('editor')
  },
}

export const WithHint: Story = {
  args: { hint: 'Your role controls what you can edit.' },
}

export const Required: Story = {
  args: { required: true },
}

export const ErrorState: Story = {
  name: 'Error',
  args: { required: true, error: 'Choose a role to continue.' },
  play: async ({ canvasElement }) => {
    const select = within(canvasElement).getByRole('combobox', { name: /Role/ })
    await expect(select).toHaveAttribute('aria-invalid', 'true')
    await expect(select).toHaveAccessibleDescription('Choose a role to continue.')
  },
}

export const Disabled: Story = {
  args: { defaultValue: 'viewer', disabled: true },
}
