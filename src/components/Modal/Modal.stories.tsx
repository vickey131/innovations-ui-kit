import type { Meta, StoryObj } from '@storybook/react-vite'
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

const meta = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Traps Tab inside the dialog, closes on Escape and returns focus to the opener. Open UX questions (Q7): closing on overlay click (off for now), initial focus (the dialog container for now), body scroll lock, open/close animation, and a long footer on small screens.',
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

export const Default: Story = {}

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
