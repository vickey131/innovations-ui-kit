# Design system

This page names the layers of the Innovations UI Kit and describes how changes are made. It points to the existing docs instead of repeating them:

- [docs/ux-handoff.md](ux-handoff.md): component specs, tokens, shared rules
- [docs/user-stories.md](user-stories.md): stories, Definition of Ready, Definition of Done
- [docs/sprint-plan.md](sprint-plan.md): scope and priorities

## Layers

**Foundations**
Shared principles and rules that every component follows: focus, disabled state, content rules and breakpoints. See [docs/ux-handoff.md](ux-handoff.md).

**Tokens**
Named design values. Primitive tokens hold raw values. Semantic tokens give them meaning, such as `--color-action-primary`. Components use semantic tokens only, so themes can change without editing components. See `src/tokens/tokens.css`.

**Primitives**
Small, single-purpose building blocks that other components build on, such as Button.

**Components**
Reusable UI built from tokens and primitives. Each lives in `src/components/<Name>/` with its styles, tests and stories, and is exported by name from `src/index.ts`. Specs are in [docs/ux-handoff.md](ux-handoff.md).

**Patterns**
Recommended combinations of components for common tasks, such as the Settings form in the handoff.

**Documentation**
Storybook pages for every public component, and release notes for user-visible or breaking changes.

**Governance**
How changes are reviewed and accepted. See the contribution model below.

## How the layers relate

Each layer builds on the one before it: foundations shape the tokens, tokens style primitives and components, and patterns combine components. Components reach tokens only through semantic names. Documentation and governance apply to every layer.

## Contribution model

1. Pick a story that meets the Definition of Ready ([docs/user-stories.md](user-stories.md)).
2. Check the UX handoff. If something is marked TBD, flag it. Don't invent behavior.
3. Build to the Definition of Done: typed props, tests, a Storybook page and accessibility checks ([docs/user-stories.md](user-stories.md), `CLAUDE.md`).
4. Open a pull request from a feature branch. Get a peer review, and make sure lint, build and tests pass.
5. Update release notes if the change is user-visible or breaking.
