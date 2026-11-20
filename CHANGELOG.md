# Changelog

## Unreleased

### Added
- `Modal`: focus trap, focus restoration to the opener on close, Escape to close, sizes sm/md/lg, full-screen below 768px.
- `Tabs`: arrow-key, Home and End navigation with roving `tabIndex` and automatic activation. A missing or disabled value falls back to the first enabled tab. When every tab is disabled nothing is selected and no tab is focusable.
- `Alert`: success, warning and danger tones, optional title and dismiss button. `role` is `status` by default and `alert` for danger, and can be overridden.
- Token `--color-overlay-backdrop` (from the UX handoff) for the modal backdrop.

### Open UX questions
- Modal (Q7): overlay-click close (off), initial focus (dialog container), body scroll lock, animation, long footer on small screens, close button label.
- Modal stacking: no shared z-index scale exists. Modal uses a Modal-scoped `z-index: 1000`.
- Tabs (Q8): keyboard activation model, overflow, hover/focus/disabled styling, underline thickness.
- Alert (Q4, Q5): `info` tone and colours, auto-dismiss, placement and stacking, per-tone icons, role for post-action versus on-load alerts.
