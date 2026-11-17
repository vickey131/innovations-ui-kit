---
name: react-component-review
description: Review a React component (and its tests and stories) against this repository's documented standards for code quality, TypeScript, accessibility, design-token consistency and testing. Use when asked to review, audit or check a component. Reports findings only; never edits files.
---

# React component review

Review the component(s) the user names (a path, a component name, or the current diff if none is given). **Report findings only. Do not edit, create or delete any file**, and do not run formatters or auto-fix commands. Offer fixes as suggestions in the report.

## Before reviewing
Read these as the source of truth, and review only against what they confirm:
- `CLAUDE.md`
- `docs/ux-handoff.md` (component specs, tokens, shared rules, content rules, TBD items)
- `docs/user-stories.md` (acceptance criteria and Definition of Done), if the component maps to a story
- The component's sibling files (tests, stories, types) and nearby code, to judge consistency with existing conventions

Don't raise a finding for a requirement that isn't stated in those documents or the existing code. If something looks questionable but isn't documented, list it under "Questions", not as a defect.

## What to check

**1. Code quality**
- Function component, readable, no dead code or unrelated changes.
- Follows the existing code style and ESLint config (run `npm run lint` on the file only if the user allows running commands; reading the config is enough otherwise).
- Importable by name and tree-shakeable (no side-effect-heavy exports).

**2. TypeScript**
- Public props are fully typed; no `any` in public prop types.
- Passing a wrong prop type would produce a compile error.
- Icon-only usage requires an accessible name in the types.

**3. Accessibility**
- Keyboard operation works (e.g. Button fires on Enter and Space; Modal traps Tab, closes on Escape, returns focus to the opener, where the docs specify it).
- Inputs are programmatically linked to labels; error text is linked to the input (e.g. `aria-describedby`).
- Correct roles, names and states; icon-only controls have an accessible name.

**4. Design consistency**
- Uses semantic tokens only, with no primitive tokens and no hard-coded colors, spacing or radii.
- Token names and values match `docs/ux-handoff.md`.
- Matches the component's spec in the UX handoff (variants, sizes, states, shared focus and disabled rules).
- Content rules: sentence case for labels and buttons; error messages say what to do.
- Anything the UX handoff marks TBD must not be implemented as invented behavior. Flag it as an open question.

**5. Testing and Storybook**
- Unit tests (Vitest + Testing Library, user-event) cover the component's behavior: states, keyboard use, label and error association. Prefer role and label queries.
- An accessibility check (vitest-axe) exists and shows no new violations.
- Tests aren't weakened, skipped or deleted.
- A Storybook page exists with a live example, props table, working Controls and a story for every state in the component's props. If Storybook isn't present in the repo, say so as a note rather than a defect.

## Report format
Start with one line naming what was reviewed. Then:

- **Findings**, grouped by the five areas above. For each: severity (`High` = breaks a documented requirement or accessibility; `Medium` = deviates from a documented convention; `Low` = minor), `file:line`, what is wrong, which document or existing convention it violates, and a suggested fix.
- **Questions**: items that are undocumented, TBD in the UX handoff, or need a decision.
- **Passed**: a short list of areas checked with no issues.

If there are no findings, say so plainly. Don't pad the report, and don't invent findings to fill sections.
