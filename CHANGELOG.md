# Changelog

## Unreleased

## 1.0.0 - 2026-11-24

### Breaking changes
- `Tabs`: now a compound component. The `tabs` prop and the `TabItem` type are removed. Build the tabs from `Tabs.List`, `Tabs.Tab` and `Tabs.Panel`, matched by `value`. `aria-label` moves from `Tabs` to `Tabs.List`. New exported types: `TabProps`, `TabsListProps`, `TabsPanelProps`.

  ```tsx
  // Before
  <Tabs tabs={[{ id: 'a', label: 'A', panel: 'Panel A' }]} aria-label="Settings" />

  // After
  <Tabs defaultValue="a">
    <Tabs.List aria-label="Settings"><Tabs.Tab value="a">A</Tabs.Tab></Tabs.List>
    <Tabs.Panel value="a">Panel A</Tabs.Panel>
  </Tabs>
  ```

### Added
- `Modal`: focus trap, focus restoration to the opener on close, Escape to close, sizes sm/md/lg, full-screen below 768px.
- `Tabs`: arrow-key, Home and End navigation with roving `tabIndex` and automatic activation. A missing or disabled value falls back to the first enabled tab. When every tab is disabled nothing is selected and no tab is focusable.
- `Alert`: success, warning and danger tones, optional title and dismiss button. `role` is `status` by default and `alert` for danger, and can be overridden.
- `Card`: surface with optional header, header actions and footer. Passing `href` makes the whole card a link; `href` and `headerActions` cannot be combined, and a clickable card must not contain interactive content.
- `Table`: sortable columns with `aria-sort` set only on the sorted header, sorting by the underlying `row[key]` value (strings and numbers by default, custom `compare` for other types, null and undefined last in both directions, ties keep original order), optional row selection with a select-all checkbox, empty state, and horizontal scroll on small screens.
- Token `--color-overlay-backdrop` (from the UX handoff) for the modal backdrop.
- `useDisclosure` hook (`isOpen`, `open`, `close`, `toggle`).
- Light and dark themes: semantic tokens are remapped under `prefers-color-scheme: dark` and `[data-theme='dark']`.
- Storybook play functions for the Button, Modal, Select and Tabs stories, and added axe checks in component tests.

### Open UX questions
- Modal (Q7): overlay-click close (off), initial focus (dialog container), body scroll lock, animation, long footer on small screens, close button label.
- Modal stacking: no shared z-index scale exists. Modal uses a Modal-scoped `z-index: 1000`.
- Tabs (Q8): keyboard activation model, overflow, hover/focus/disabled styling, underline thickness.
- Card: focus, active and disabled states of the clickable card, nested actions inside a clickable card, header and footer dividers and padding.
- Table (Q9, Q10): third sort click (today it returns to ascending, with no unsorted state), layout below 768px (today it scrolls horizontally), row hover and selected styling (no semantic tokens), header background, sticky header, loading state, bulk-action UI, pagination (select all applies to the rows shown), empty-state illustration asset, sort arrow glyphs and sort announcement beyond `aria-sort`.
- Alert (Q4, Q5): `info` tone and colours, auto-dismiss, placement and stacking, per-tone icons, role for post-action versus on-load alerts.
