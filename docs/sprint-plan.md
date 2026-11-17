# Sprint Plan: Innovations UI Kit (Days 7–8)

Based on the [product brief](product-brief.md), [user stories](user-stories.md) and [UX handoff review](ux-handoff.md).

**Capacity assumption:** the documents do not state team size. This plan assumes one developer at 8 hours a day, 16 hours in total, with little buffer. If the team is larger, the Could items can be pulled in.

## 1. Sprint goal

By the end of Day 8, a developer can install the UI Kit, import a first set of typed, keyboard-accessible components built on shared design tokens, and review each one in all its states in Storybook, with automated accessibility checks running in CI.

## 2. Sprint scope

**In scope**
- Package setup with strict TypeScript and tree-shakeable imports (US-01, US-02).
- Design tokens from the UX spec: colour, typography, spacing, radii, elevation, motion (US-08).
- Storybook with a page per delivered component: live example, props table, Controls, and a story for each state (US-03, US-04).
- Components, in priority order: Button, TextField, Checkbox, Badge, Modal, Select, Alert.
- Keyboard and screen reader behaviour for those components (US-05, US-06).
- Automated accessibility checks in Storybook and CI (US-07).
- Release notes for the user-visible changes (per the DoD).

**Not in this sprint**
- Tabs, Card and Table (Could). Table has the most open UX questions and is the largest component. Without it the Team table validation screen cannot be built; the Settings form screen can.
- Dark theme. UX delivers it on Day 8. Components will use semantic tokens only, so it can be added later without touching them.
- Anything TBD in the UX handoff is not implemented until UX answers (see section 5).

## 3. Prioritised backlog

| # | Task / user story | Priority | Estimate (h) | Planned day | Dependencies |
|---|---|---|---|---|---|
| 1 | Package setup: single-package imports, strict TypeScript, tree-shaking check, Storybook scaffold (US-01, US-02, US-03 AC1) | Must | 1.5 | Day 7 | None |
| 2 | Design tokens as CSS variables and typed exports; primitives plus semantic layer; tokens story (US-08) | Must | 1.5 | Day 7 | #1 |
| 3 | Button: 4 variants, 3 sizes, states, optional leading icon; stories per state; keyboard (US-02 to US-06) | Must | 1.5 | Day 7 | #2; UX Q1–3 for loading, icon-only and non-primary colours |
| 4 | TextField: label, hint, error linked via `aria-describedby`, read-only, disabled, counter, required marker (US-04 AC2, US-06 AC1–2) | Must | 2 | Day 7 | #2; UX Q6 for state colours |
| 5 | Checkbox: states, error, group wrapper (US-04, US-06) | Must | 1 | Day 7 | #2; error message placement is TBD |
| 6 | Badge: tones and sizes (success, warning, danger first) | Must | 0.5 | Day 7 | #2; UX Q4 for neutral and info colours |
| 7 | Modal: sizes, header, body, footer, Escape to close, focus trap, focus return, full-screen below `md` (US-05 AC2–3) | Must | 2 | Day 8 | #3; UX Q7 for overlay click and initial focus |
| 8 | Select: closed state matches TextField, listbox with max 8 visible options, keyboard use (US-05, US-06) | Should | 2 | Day 8 | #4; keyboard model is TBD |
| 9 | Alert: four tones, optional title, dismiss and action link; "Saved" use case for the Settings form | Should | 1 | Day 8 | #2; UX Q4 and Q5 |
| 10 | Automated accessibility checks on stories, CI failure on new violations, pass rate report (US-07) | Should | 1.5 | Day 8 | Stories from #3–#9 |
| 11 | Final pass: confirm every state in each component's props has a story (US-04 AC3), update release notes, fix review comments | Must | 1 | Day 8 | All of the above |
| 12 | Tabs | Could | 1.5 | Day 8 if time remains | #2; UX Q8 for overflow and keyboard model |
| 13 | Card, including clickable variant | Could | 1 | Day 8 if time remains | #2; focus and nested-action behaviour is TBD |
| 14 | Table with sorting, selection and empty state | Could | 3+ | Not planned | #3, #5, #6; UX Q9–10 |

**Totals:** Must 11.0 h, Should 4.5 h, planned 15.5 h of 16 h. That leaves about 0.5 h of buffer, so the Could items (Tabs, Card) only happen if work finishes early. Table is not planned.

Note that US-04's state stories and US-05/06 accessibility behaviour are built into each component task, not done as separate work.

## 4. Day-wise plan

### Day 7: Foundation and form basics (8 h)
- Set up the package, strict TypeScript and Storybook (1.5 h).
- Build the tokens (1.5 h).
- Build Button, TextField, Checkbox and Badge, each with typed props, state stories and keyboard and label behaviour (5 h).
- Exit check: the project builds, a single import tree-shakes, and four components appear in Storybook with all states.

### Day 8: Overlay, selection, feedback and checks (8 h)
- Build Modal (2 h), then Select (2 h) and Alert (1 h).
- Add the accessibility checks to Storybook and CI (1.5 h).
- Do the final pass: state coverage, release notes, review fixes (1 h).
- Tabs or Card only if time remains.
- Exit check: Settings form pieces (TextField, Select, Checkbox group, Button, Alert) all exist and pass accessibility checks.

If Day 7 overruns, drop Alert and Select first (both Should), and keep Modal, since it covers the Must keyboard story's modal criteria.

## 5. Dependencies and risks

**Unresolved UX decisions** (from the TBD items in the UX handoff). Where UX has not answered, the plan implements only what the spec states and leaves the rest out rather than guessing.

| Risk | Affects | Mitigation |
|---|---|---|
| No colour tokens for `secondary`, `ghost`, `danger` buttons (Q3) | Button, #3 | Build `primary` fully and wire the others to placeholder semantic tokens that UX can fill in; raise with UX on Day 7. |
| Button loading behaviour and icon-only accessible name undefined (Q1–2) | Button, US-06 AC3 | Ship the loading state after UX answers; make the accessible name required in types for icon-only use, which US-06 AC3 already requires. |
| No tokens for `info` and `neutral` tones (Q4) | Badge, Alert | Implement success, warning and danger first; add the others once UX supplies values. |
| Form field state colours missing (Q6) | TextField, Select | Use existing semantic tokens only (`color-border-default`, danger status) until UX confirms. |
| Modal overlay click, initial focus, focus return not specified (Q7) | Modal | US-05 AC2–3 already requires a focus trap, Escape to close and focus return, so build those. Leave overlay click closing off until UX confirms. |
| Alert screen reader announcement not defined (Q5) | Alert, US-06 | Needs a decision before Alert is done; if still open on Day 8, Alert slips. |
| Select keyboard model and searchable behaviour not specified | Select | Support basic keyboard operation; no search. |
| Dark theme arrives from UX on Day 8 | Tokens | Not implemented this sprint. Use semantic tokens only in components so it can be added later. |
| Token units (px vs rem) not stated | Tokens, typography | Pick one and record it in the tokens story; confirm with UX. |
| Accessibility target is a proposal (WCAG 2.1 AA, at least 90% pass rate) | US-07 | Use these as the working targets. |
| No Figma file; visual details are unverified | All components | Treat the written spec as the source of truth and flag differences for UX review. |
| Estimates are untested and the team size is assumed | Whole plan | The buffer is small, so the Should items (Select, Alert, accessibility checks) are the first to slip; Table is deliberately excluded. |

## 6. Definition of Done

The sprint is done when the following are true. Each item is checkable.

**Per component** (follows the [user stories DoD](user-stories.md#definition-of-done-dod))
- Props are fully typed, and strict-mode type checking passes with no `any` in public prop types.
- Passing a wrong prop type produces a TypeScript error.
- A Storybook page exists with a live example, a props table and working Controls.
- Every state in the component's props (default, hover, focus, disabled, error where applicable) has a matching story.
- Interactive components work by keyboard alone: a focused Button fires on Enter and Space; Modal traps Tab, closes on Escape and returns focus to the opener.
- Inputs are linked to their labels, and error text is linked to the input.
- Unit tests cover the new behaviour and all tests pass.
- No new accessibility violations in Storybook or CI.
- Components read colours, spacing and radii from semantic tokens, with no hard-coded values or primitive tokens.

**For the sprint**
- Installing the package and importing one component by name builds without errors, and a production build excludes unused components.
- Changing one token value and rebuilding Storybook updates every component that uses it.
- Every delivered component is listed in the Storybook sidebar.
- CI runs the type check, tests and accessibility checks, and fails on a new violation.
- The accessibility pass rate across delivered components is reported as a percentage.
- Code is peer-reviewed and merged, and release notes are updated.
- Any component that still has an unresolved UX question lists it in its Storybook page or release notes.
