import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { useDisclosure } from '../../hooks/useDisclosure'
import { Button } from '../Button'
import { Modal } from './Modal'
import type { ModalProps } from './Modal'

function ModalDemo(args: ModalProps) {
  const { isOpen, open, close } = useDisclosure(args.open)
  return (
    <>
      <Button onClick={open}>Open modal</Button>
      <Modal {...args} open={isOpen} onClose={close} />
    </>
  )
}

const guidance = [
  '## Usage guidelines',
  '',
  '- Use for a focused task or confirmation that must interrupt the page. It is controlled: pass `open` and update it in `onClose`.',
  '- Put actions in `footer`, with the primary action last.',
  '',
  "## Do and don't",
  '',
  '- **Do:** give the modal a clear `title`: it is also the dialog name.',
  '- **Do:** close it in `onClose` so both Escape and the close button work.',
  "- **Don't:** use a Modal for passive messages: use an Alert.",
  "- **Don't:** rely on clicking the overlay to close it: that is off for now.",
  '',
  '## Accessibility',
  '',
  '- Renders `role="dialog"` with `aria-modal="true"`, named by the title through `aria-labelledby`.',
  '- Tab and Shift+Tab stay inside the dialog, and Escape calls `onClose`.',
  '- Focus moves to the dialog when it opens and returns to the opener when it closes. The close button is named by `closeLabel` (default "Close").',
].join('\n')

const meta = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Traps Tab inside the dialog, closes on Escape and returns focus to the opener. Open UX questions (Q7): closing on overlay click (off for now), initial focus (the dialog container for now), body scroll lock, open/close animation, and a long footer on small screens.\n\n' + guidance,
      },
    },
  },
  argTypes: {
    open: { control: 'boolean' },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    title: { control: 'text' },
    closeLabel: { control: 'text' },
  },
  args: {
    open: false,
    onClose: () => {},
    title: 'Edit profile',
    children: 'Update your display name and email address.',
  },
  render: (args) => <ModalDemo {...args} />,
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const opener = within(canvasElement).getByRole('button', { name: 'Open modal' })
    await userEvent.click(opener)
    const body = within(document.body)
    await expect(body.getByRole('dialog', { name: 'Edit profile' })).toHaveFocus()
    await userEvent.keyboard('{Escape}')
    await expect(body.queryByRole('dialog')).not.toBeInTheDocument()
    await expect(opener).toHaveFocus()
  },
}

export const Small: Story = { args: { size: 'sm' } }

export const Medium: Story = { args: { size: 'md' } }

export const Large: Story = { args: { size: 'lg' } }

export const WithFooter: Story = {
  args: {
    footer: (
      <>
        <Button>Cancel</Button>
        <Button>Save changes</Button>
      </>
    ),
  },
}

export const LongContent: Story = {
  args: {
    footer: <Button>Done</Button>,
    children: Array.from({ length: 30 }, (_, index) => (
      <p key={index}>Scrolling paragraph {index + 1}.</p>
    )),
  },
}
