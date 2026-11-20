// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAxeViolations } from '../../test/axe'
import { Tabs } from './Tabs'
import type { TabItem } from './Tabs'

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

describe('Tabs', () => {
  it('renders tab roles, selects the first tab and shows only its panel', () => {
    render(<Tabs tabs={tabs} aria-label="Settings" />)

    expect(screen.getByRole('tablist', { name: 'Settings' })).toBeInTheDocument()
    expect(screen.getAllByRole('tab')).toHaveLength(3)
    expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Billing' })).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByRole('tabpanel', { name: 'Profile' })).toHaveTextContent('Profile content')
    expect(screen.queryByText('Billing content')).not.toBeInTheDocument()
  })

  it('uses a roving tabIndex', () => {
    render(<Tabs tabs={tabs} aria-label="Settings" />)

    expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('tab', { name: 'Billing' })).toHaveAttribute('tabindex', '-1')
    expect(screen.getByRole('tab', { name: 'Team' })).toHaveAttribute('tabindex', '-1')
  })

  it('moves focus and selection with the arrow keys and wraps around', async () => {
    const user = userEvent.setup()
    render(<Tabs tabs={tabs} aria-label="Settings" />)

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
    render(<Tabs tabs={tabs} defaultValue="billing" aria-label="Settings" />)

    await user.tab()
    await user.keyboard('{End}')
    expect(screen.getByRole('tab', { name: 'Team' })).toHaveFocus()

    await user.keyboard('{Home}')
    expect(screen.getByRole('tab', { name: 'Profile' })).toHaveFocus()
  })

  it('selects a tab with a click', async () => {
    const user = userEvent.setup()
    render(<Tabs tabs={tabs} aria-label="Settings" />)

    await user.click(screen.getByRole('tab', { name: 'Team' }))

    expect(screen.getByRole('tabpanel')).toHaveTextContent('Team content')
  })

  it('skips disabled tabs with the keyboard', async () => {
    const user = userEvent.setup()
    render(<Tabs tabs={withDisabledMiddle} aria-label="Settings" />)

    await user.tab()
    await user.keyboard('{ArrowRight}')

    expect(screen.getByRole('tab', { name: 'Team' })).toHaveFocus()
    expect(screen.getByRole('tab', { name: 'Billing' })).toBeDisabled()
  })

  it('falls back to the first enabled tab when defaultValue is unknown', () => {
    render(<Tabs tabs={tabs} defaultValue="missing" aria-label="Settings" />)

    expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute('aria-selected', 'true')
  })

  it('falls back to the first enabled tab when the value is a disabled tab', () => {
    render(<Tabs tabs={withDisabledMiddle} value="billing" aria-label="Settings" />)

    expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute('tabindex', '0')
  })

  it('skips a disabled first tab when falling back', () => {
    const items = [{ ...tabs[0], disabled: true }, tabs[1]]
    render(<Tabs tabs={items} aria-label="Settings" />)

    expect(screen.getByRole('tab', { name: 'Billing' })).toHaveAttribute('aria-selected', 'true')
  })

  it('has no selected tab, panel or focus target when all tabs are disabled', async () => {
    const user = userEvent.setup()
    const items = tabs.map((tab) => ({ ...tab, disabled: true }))
    render(<Tabs tabs={items} aria-label="Settings" />)

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
    render(<Tabs tabs={[]} aria-label="Settings" />)

    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.queryByRole('tab')).not.toBeInTheDocument()
  })

  it('works controlled and only reports user selections', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    function Controlled() {
      const [value, setValue] = useState('profile')
      return (
        <Tabs
          tabs={tabs}
          value={value}
          onValueChange={(id) => {
            onValueChange(id)
            setValue(id)
          }}
          aria-label="Settings"
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
    render(<Tabs tabs={tabs} value="profile" onValueChange={onValueChange} aria-label="Settings" />)

    await user.click(screen.getByRole('tab', { name: 'Team' }))

    expect(onValueChange).toHaveBeenCalledWith('team')
    expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute('aria-selected', 'true')
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<Tabs tabs={withDisabledMiddle} aria-label="Settings" />)

    await expectNoAxeViolations(container)
  })
})
