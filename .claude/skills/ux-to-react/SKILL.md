---
name: ux-to-react
description: Turn a UX specification into a minimal React + TypeScript implementation plan that follows this repository's conventions. Use when asked to plan or implement a component from a UX spec. Plans first; does not edit files until the plan is approved.
---

# UX to React

Translate the UX spec the user names (a path or pasted text) into an implementation plan. **Produce the plan only. Do not create or edit any file until the user approves it.**

## Before planning
- Read the whole spec. Note every stated requirement, state, interaction and content rule.
- Read the project sources of truth: `CLAUDE.md`, `docs/ux-handoff.md` (tokens, shared rules, TBD items), `docs/component-apis.md`, `docs/user-stories.md`.
- Inspect existing components, tests, stories and the library entry to learn current conventions (file layout, prop naming, token usage, test and story patterns). Reuse existing code and patterns before proposing new ones.
- Plan only against what the spec, the docs or the existing code confirm.

## Plan contents
Present these in order, concisely:
1. **Summary**: what the spec asks for, in a few sentences.
2. **Component API**: props with types and defaults, controlled or uncontrolled use, events. No `any` in public props.
3. **Behavior and states**: every state and variant the spec names, and keyboard interaction.
4. **Accessibility**: roles, accessible names, states, focus handling, and label or error linking, as the spec and `CLAUDE.md` require.
5. **Design**: semantic tokens only (never primitives or hard-coded values), shared focus and disabled rules, content rules.
6. **Ambiguities and assumptions**: list every gap, conflict or TBD. For each, either state the assumption you propose or mark it as a question for the user. Flag conflicts between the spec, docs and code rather than resolving them silently.
7. **Traceability**: a table mapping each requirement to its implementation point and its test case (and Storybook story where the repo requires one).
8. **Files**: the minimal set of files to add or change.

## Rules
- Don't invent requirements, props, variants or behavior. Anything unspecified is an open question, not a feature.
- Where the spec or UX handoff marks something TBD, don't implement it; flag it.
- If a technical choice isn't settled by the spec, docs or code, ask. Don't decide it silently.
- Keep the plan minimal: no extra functionality, no unrelated refactors, no new dependencies without asking.
- End by asking for approval, and wait for it before implementing.
