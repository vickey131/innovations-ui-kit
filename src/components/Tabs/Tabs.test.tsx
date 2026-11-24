// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAxeViolations } from '../../test/axe'
import { Tabs } from './Tabs'
import type { TabsProps } from './Tabs'

interface TabItem {
  id: string
  label: ReactNode
  panel: ReactNode
  disabled?: boolean
}

const tabs: TabItem[] = [
  { id: 'profile', label: 'Profile', panel: 'Profile content' },
  { id: 'billing', label: 'Billing', panel: 'Billing content' },
  { id: 'team', label: 'Team', panel: 'Team content' },
]

const withDisabledMiddle: TabItem[] = [
  tabs[0],
  { ...tabs[1], disabled: true },
  tabs[2],
]

function TabsFixture({
  items,
  ...props
}: { items: TabItem[] } & Omit<TabsProps, 'children'>) {
  return (
    <Tabs {...props}>
      <Tabs.List aria-label="Settings">
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

describe('Tabs', () => {
  it('renders tab roles, selects the first tab and shows only its panel', () => {
    render(<TabsFixture items={tabs} />)

    expect(screen.getByRole('tablist', { name: 'Settings' })).toBeInTheDocument()
    expect(screen.getAllByRole('tab')).toHaveLength(3)
    expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Billing' })).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByRole('tabpanel', { name: 'Profile' })).toHaveTextContent('Profile content')
    expect(screen.queryByText('Billing content')).not.toBeInTheDocument()
  })

  it('uses a roving tabIndex', () => {
    render(<TabsFixture items={tabs} />)

    expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('tab', { name: 'Billing' })).toHaveAttribute('tabindex', '-1')
    expect(screen.getByRole('tab', { name: 'Team' })).toHaveAttribute('tabindex', '-1')
  })

  it('moves focus and selection with the arrow keys and wraps around', async () => {
    const user = userEvent.setup()
    render(<TabsFixture items={tabs} />)

    await user.tab()
    expect(screen.getByRole('tab', { name: 'Profile' })).toHaveFocus()

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Billing' })).toHaveFocus()
    expect(screen.getByRole('tab', { name: 'Billing' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Billing' })).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute('tabindex', '-1')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Billing content')

    await user.keyboard('{ArrowRight}{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Profile' })).toHaveFocus()

    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('tab', { name: 'Team' })).toHaveFocus()
  })

  it('jumps to the first and last tab with Home and End', async () => {
    const user = userEvent.setup()
    render(<TabsFixture items={tabs} defaultValue="billing" />)

    await user.tab()
    await user.keyboard('{End}')
    expect(screen.getByRole('tab', { name: 'Team' })).toHaveFocus()

    await user.keyboard('{Home}')
    expect(screen.getByRole('tab', { name: 'Profile' })).toHaveFocus()
  })

  it('selects a tab with a click', async () => {
    const user = userEvent.setup()
    render(<TabsFixture items={tabs} />)

    await user.click(screen.getByRole('tab', { name: 'Team' }))

    expect(screen.getByRole('tabpanel')).toHaveTextContent('Team content')
  })

  it('skips disabled tabs with the keyboard', async () => {
    const user = userEvent.setup()
    render(<TabsFixture items={withDisabledMiddle} />)

    await user.tab()
    await user.keyboard('{ArrowRight}')

    expect(screen.getByRole('tab', { name: 'Team' })).toHaveFocus()
    expect(screen.getByRole('tab', { name: 'Billing' })).toBeDisabled()
  })

  it('falls back to the first enabled tab when defaultValue is unknown', () => {
    render(<TabsFixture items={tabs} defaultValue="missing" />)

    expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute('aria-selected', 'true')
  })

  it('falls back to the first enabled tab when the value is a disabled tab', () => {
    render(<TabsFixture items={withDisabledMiddle} value="billing" />)

    expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute('tabindex', '0')
  })

  it('skips a disabled first tab when falling back', () => {
    const items = [{ ...tabs[0], disabled: true }, tabs[1]]
    render(<TabsFixture items={items} />)

    expect(screen.getByRole('tab', { name: 'Billing' })).toHaveAttribute('aria-selected', 'true')
  })

  it('has no selected tab, panel or focus target when all tabs are disabled', async () => {
    const user = userEvent.setup()
    const items = tabs.map((tab) => ({ ...tab, disabled: true }))
    render(<TabsFixture items={items} />)

    for (const tab of screen.getAllByRole('tab')) {
      expect(tab).toBeDisabled()
      expect(tab).toHaveAttribute('aria-selected', 'false')
      expect(tab).toHaveAttribute('tabindex', '-1')
    }
    expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument()

    await user.tab()
    expect(document.body).toHaveFocus()
  })

  it('renders an empty tab list without tabs', () => {
    render(<TabsFixture items={[]} />)

    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.queryByRole('tab')).not.toBeInTheDocument()
  })

  it('works controlled and only reports user selections', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    function Controlled() {
      const [value, setValue] = useState('profile')
      return (
        <TabsFixture
          items={tabs}
          value={value}
          onValueChange={(id) => {
            onValueChange(id)
            setValue(id)
          }}
        />
      )
    }
    render(<Controlled />)
    expect(onValueChange).not.toHaveBeenCalled()

    await user.click(screen.getByRole('tab', { name: 'Billing' }))

    expect(onValueChange).toHaveBeenCalledWith('billing')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Billing content')
  })

  it('stays on the controlled value until the parent updates it', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<TabsFixture items={tabs} value="profile" onValueChange={onValueChange} />)

    await user.click(screen.getByRole('tab', { name: 'Team' }))

    expect(onValueChange).toHaveBeenCalledWith('team')
    expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute('aria-selected', 'true')
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<TabsFixture items={withDisabledMiddle} />)

    await expectNoAxeViolations(container)
  })
})
