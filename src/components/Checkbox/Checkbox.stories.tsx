import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from './Checkbox'

const guidance = [
  '## Usage guidelines',
  '',
  '- Use to turn an independent option on or off. Use `indeterminate` for a mixed state, such as a parent of partly selected items.',
  '- To choose one value from several, use a Select.',
  '',
  "## Do and don't",
  '',
  '- **Do:** write the label in sentence case so it describes the option.',
  '- **Do:** make an `error` say what to do, such as "Select this option to continue."',
  "- **Don't:** leave out the label: it is required.",
  "- **Don't:** treat `indeterminate` as a stored value: it is visual only and does not change `checked`.",
  '',
  '## Accessibility',
  '',
  '- Renders a native checkbox linked to its visible label, so clicking the label toggles it and Space toggles it from the keyboard.',
  '- `indeterminate` is set on the input itself, so assistive technology announces it as mixed.',
  '- An `error` is linked with `aria-describedby` and sets `aria-invalid`. Error placement and group behaviour are open UX questions.',
].join('\n')

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: guidance } },
  },
  argTypes: {
    checked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { label: 'Email notifications' },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Unchecked: Story = {}

export const Checked: Story = {
  args: { defaultChecked: true },
}

export const Indeterminate: Story = {
  args: { indeterminate: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const ErrorState: Story = {
  name: 'Error',
  args: { error: 'Select this option to continue.' },
}
