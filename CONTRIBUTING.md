# Contributing

## Workflow
- Branch from `main`. Keep each PR small and tied to one story or task.
- Use short commit prefixes: `feat:`, `fix:`, `docs:`, `test:`.

## Standards
Follow `CLAUDE.md` and `docs/ux-handoff.md`. In short:
- Typed props, semantic tokens only, accessibility built in.
- Tests for new behavior, and a Storybook story for every state.
- Where the UX handoff says TBD, don't invent behavior. Log it as an open question.

## Before opening a PR
```
npm run lint
npm run typecheck
npm test
npm run build
npm run build-storybook -- --quiet
```
Update `CHANGELOG.md` for any user-visible or breaking change.

## Versioning
Semantic versioning: patch for fixes, minor for backward-compatible additions, major for breaking changes.

## Deprecation policy
1. Mark the API with `@deprecated` in JSDoc, say so on its Storybook page, and add a `Deprecated` entry to `CHANGELOG.md` naming the replacement.
2. Keep it working for at least one minor release.
3. Remove it only in the next major release, listed under `Breaking changes` with a migration snippet.

## Design and engineering sync
- `docs/ux-handoff.md` is the source of truth for tokens and component specs.
- Proposed cadence: design and engineering meet weekly to review new handoffs and open UX questions.
- Open questions are recorded under `Open UX questions` in `CHANGELOG.md` until design answers them.
- A token or spec change is agreed in the sync first. Then the handoff doc and the code are updated together.
