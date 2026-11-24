# UI Kit UX Handoff Review

Source: Innovations UI Kit — UX handoff spec v0.9 (Innovations Lab UX). No Figma file was shared, so this review is based on the written spec only; visual details (exact icon sizes, illustration, per-state colours) are unverified.

Legend: **Confirmed** = stated in the spec. **TBD** = marked TBD, or missing from the spec. Nothing marked TBD has been assumed or invented here.

---

## 1. Components

### Shared rules (confirmed)
- Keyboard focus (focus-visible only, not on mouse click): 2px `color-focus-ring` outline, 2px offset.
- Disabled: 40% opacity, no pointer events.

### Button
| | |
| --- | --- |
| Variants | `primary`, `secondary` (outlined), `ghost`, `danger` |
| Sizes | `sm` 32px, `md` 40px, `lg` 48px (height) |
| States | default, hover, active, focus-visible, disabled, loading |
| Other | Optional leading icon |.

TBD:
- Loading: spinner replaces the label or sits beside it (spec says TBD).
- Icon-only buttons (used in the Table toolbar): accessible label not specified.
- Colour tokens for `secondary`, `ghost` and `danger` (only `color-action-primary` / `-hover` / `-active` exist).
- Icon-only button sizes and icon size.

### TextField
- Layout: label above, optional hint below; the error message replaces the hint.
- States: default, hover, focus, filled, error, disabled, read-only.
- Optional character counter ("42 / 100"), bottom-right.
- Required fields marked with `*`.

TBD: screen-reader text for the required `*`; border/background colours per state (error, read-only, disabled); placeholder style; counter behaviour at/over the limit.

### Select
- Closed state matches TextField; same states as TextField.
- Open state: listbox, max 8 visible options, then scrolls.

TBD: searchable or not (spec says not specified); option hover/selected/disabled styling; empty and multi-select behaviour; keyboard behaviour.

### Checkbox
- 20px box, label to the right.
- States: unchecked, checked, indeterminate, disabled, error.

TBD: hover/focus visuals per state; error message placement; behaviour of the Settings "Checkbox group" (group label, group-level error).

### Badge
- Tones: neutral, info, success, warning, danger. Sizes: sm, md. Pill radius. Text only.

TBD: colours for `neutral` and `info` (semantic tokens exist only for success, warning, danger); text truncation / max length.

### Modal
- Widths: sm 400, md 560, lg 800; full-screen below `md`.
- Header (title + close icon), scrolling body, footer with right-aligned actions, primary last.
- Overlay `rgba(20,23,28,.5)`; elevation `shadow-3`.
- Closes on Escape and the close icon.

TBD: close on overlay click (spec says TBD); focus trap and initial focus; focus return on close; body scroll lock; open/close animation; behaviour when the footer is long on small screens.

### Tabs
- Underline style; active tab uses `color-action-primary`; horizontal only.

TBD: overflow when tabs don't fit (scroll, wrap, or menu); hover/focus/disabled states; keyboard model (arrow keys, activation on focus vs. Enter); active underline thickness.

### Alert
- Tones: info, success, warning, danger.
- Optional title, body, dismiss button, optional action link.
- Some appear after a user action (e.g. "Saved"), some are present on page load.

TBD: `info` colours (no semantic token); auto-dismiss and timing; screen-reader announcement (live region role) for post-action vs. on-load alerts; placement/stacking of multiple alerts; icons per tone.

### Card
- Surface background, `radius-lg`, `shadow-1`, 24px padding.
- Optional header (with actions) and footer.
- Clickable variant: whole card navigates; hover raises to `shadow-2`.

TBD: focus, active and disabled states for the clickable card; how nested actions in a clickable card behave; header/footer divider and padding.

### Table
- Header row `font-label`, body `font-body`, row height 48px, zebra striping off.
- Sortable columns show an arrow; click cycles ascending → descending → (unsorted?).
- Row selection with checkboxes; the header checkbox selects the current page.
- Empty state: illustration + message.

TBD: whether the third sort click returns to unsorted; layout below `md` (horizontal scroll vs. stacked cards); empty-state illustration asset (not supplied); row hover/selected styling; sticky header; loading state; selected-count / bulk-action UI; indeterminate header checkbox; sort indicator for screen readers.

---

## 2. Design tokens

Names and values are as written in the spec.

### Colour — primitives
| Token | Hex |
| --- | --- |
| `blue-50` | `#EEF4FF` |
| `blue-100` | `#D9E6FF` |
| `blue-500` | `#2F6FED` |
| `blue-600` | `#2459C7` |
| `blue-700` | `#1B449B` |
| `gray-0` | `#FFFFFF` |
| `gray-50` | `#F7F8FA` |
| `gray-100` | `#EEF0F3` |
| `gray-300` | `#C9CED6` |
| `gray-500` | `#6B7380` |
| `gray-700` | `#3A404A` |
| `gray-900` | `#14171C` |
| `green-100` | `#DDF5E6` |
| `green-600` | `#1E7F45` |
| `amber-100` | `#FFF1D6` |
| `amber-600` | `#A35F00` |
| `red-100` | `#FDE2E1` |
| `red-600` | `#C4312A` |

### Colour — semantic (light theme)
| Token | Maps to |
| --- | --- |
| `color-bg-canvas` | `gray-50` |
| `color-bg-surface` | `gray-0` |
| `color-text-primary` | `gray-900` |
| `color-text-secondary` | `gray-500` |
| `color-border-default` | `gray-300` |
| `color-action-primary` | `blue-500` |
| `color-action-primary-hover` | `blue-600` |
| `color-action-primary-active` | `blue-700` |
| `color-focus-ring` | `blue-500` |
| `color-status-success-bg` / `-fg` | `green-100` / `green-600` |
| `color-status-warning-bg` / `-fg` | `amber-100` / `amber-600` |
| `color-status-danger-bg` / `-fg` | `red-100` / `red-600` |

Unused by any semantic token so far: `blue-50`, `blue-100`, `gray-100`, `gray-700`.

### Dark theme
**TBD** — UX delivers on Day 8. Engineering requirement: it must be possible to add without touching components (so components should reference semantic tokens only, never primitives).

### Typography
Font: Inter, fallback `system-ui`. Values are size / line-height / weight.

| Token | Value |
| --- | --- |
| `font-display` | 32 / 40 / 600 |
| `font-heading` | 24 / 32 / 600 |
| `font-title` | 18 / 26 / 600 |
| `font-body` | 16 / 24 / 400 |
| `font-label` | 14 / 20 / 500 |
| `font-caption` | 12 / 16 / 400 |

Units (px vs. rem) are not stated; see questions.

### Spacing
Scale in px: 0, 4, 8, 12, 16, 24, 32, 48, 64 → `space-0` … `space-8`.

### Radii
| Token | Value |
| --- | --- |
| `radius-sm` | 4 |
| `radius-md` | 8 |
| `radius-lg` | 12 |
| `radius-pill` | 999 |

### Elevation
| Token | Value |
| --- | --- |
| `shadow-1` | `0 1px 2px rgba(20,23,28,.08)` |
| `shadow-2` | `0 4px 12px rgba(20,23,28,.12)` |
| `shadow-3` | `0 12px 32px rgba(20,23,28,.18)` (modals) |

### Motion
| Token | Value |
| --- | --- |
| `duration-fast` | 120ms |
| `duration-base` | 200ms |
| easing | `cubic-bezier(.2,0,0,1)` |

Reduced motion must be respected (details TBD).

---

## 3. Responsive breakpoints

| Name | Min width | Grid columns | Gutter |
| --- | --- | --- | --- |
| `sm` | 0 | 4 | 16 |
| `md` | 768 | 8 | 24 |
| `lg` | 1024 | 12 | 24 |
| `xl` | 1440 | 12 | 24 |

The spec says "12 (lg+)" and gives gutters as "16 / 24 / 24", which I read as sm / md / lg+. Confirming that reading is part of the questions below.

### Component behaviour at breakpoints
- **Modal:** full-screen below `md`; fixed widths (400 / 560 / 800) otherwise.
- **Table:** below `md` is **TBD** (horizontal scroll vs. stacked cards).
- **Tabs:** overflow when tabs don't fit is **TBD**.
- Other components: no responsive behaviour specified.

---

## 4. Screens used to validate the kit

1. **Settings form:** profile name (TextField), email (TextField, read-only), role (Select), notifications (Checkbox group), Save (primary) and Cancel (secondary), success Alert after save.
2. **Team table:** Name, Role, Status (Badge), Last active; sortable by Name and Last active; paginated, 10 per page.

Content rules: sentence case for labels and buttons; error messages say what to do ("Enter at least 3 characters").

---

## 5. Clarifying questions for UX

1. **Button loading:** does the spinner replace the label or sit beside it? Does the button keep its width while loading, and is it still clickable?
2. **Icon-only buttons:** what are the accessible labels for the Table toolbar's icon-only buttons, and do they get tooltips? What are the icon and hit-target sizes?
3. **Button colours:** which tokens should `secondary`, `ghost` and `danger` use for default, hover and active? Only `color-action-primary*` is defined, and there is no danger action token.
4. **Info and neutral tones:** Badge and Alert `info`, and Badge `neutral`, have no `color-status-*` tokens. Which primitives should they use?
5. **Alert behaviour:** should Alerts be announced to screen readers (`role="status"` vs. `role="alert"`), and does the post-action "Saved" Alert differ from on-load ones? Does it auto-dismiss, and where do multiple Alerts stack?
6. **Form field states:** what colours and borders apply to TextField and Select in hover, focus, error, read-only and disabled? Does the error state add an icon besides the colour?
7. **Modal dismissal and focus:** does clicking the overlay close the Modal? Where does focus land on open, is it trapped, and where does it return on close?
8. **Tabs:** what happens when tabs overflow (scroll, wrap or menu)? Do arrow keys move and activate tabs, or does activation need Enter/Space?
9. **Table sorting:** does a third click on a sortable header return to unsorted, or cycle only between ascending and descending? How is sort state conveyed beyond the arrow?
10. **Table below `md`:** does it scroll horizontally or reflow into stacked cards? If stacked, how do row selection and sorting work?
  