# CLAUDE.md

## Project overview
- Innovations UI Kit: a reusable React + TypeScript component library that gives teams shared UI components for faster, more consistent interfaces. Each component is documented in Storybook with interactive examples.
- Goals: less duplicated work, consistent look, behavior and accessibility, and easy discovery and reuse.
- Users: frontend developers, UI/UX designers and product teams.
- Source of truth: `docs/product-brief.md`, `docs/user-stories.md`, `docs/ux-handoff.md`, `docs/sprint-plan.md`. Check them before building or changing a component.

## Tech stack and conventions
- React, TypeScript (strict), Vite, Vitest, Testing Library, vitest-axe, ESLint, and Storybook (per the docs). See `package.json` for versions.
- Scripts that exist in `package.json` today: `npm run dev | build | lint | preview`. `build` runs `tsc -b && vite build`, so it doubles as the typecheck.
- `typecheck`, `test`, `test:coverage` and Storybook scripts are NOT defined yet, and there is no Vitest config, `.storybook/` directory or test setup file (jsdom, jest-dom, vitest-axe matchers). The packages are installed. Adding the scripts and config is a tooling choice: ask first.
- Once Vitest is set up, run a single test file with `npx vitest run path/to/File.test.tsx`, or filter by name with `-t "name"`.
- Follow the existing code style and ESLint config. Before finishing, run `npm run lint` and `npm run build`, plus tests once they exist.
- Current state: `src/` is the unmodified Vite React template (`App.tsx`, `main.tsx`). No components, tokens or package entry point exist yet. The "single package, tree-shakeable" requirement means a library entry (e.g. `src/index.ts` with named exports) must be decided and added. The Vite config is currently app-mode only (`vite.config.ts` uses just the React plugin). Ask before choosing the library build setup.
- `README.md` is the stock Vite template text and not project documentation. `docs/ai-usage.md` records how this file was authored; don't treat it as a spec.
- `tsconfig.json` references `tsconfig.app.json` (src) and `tsconfig.node.json` (config files). Check strictness settings in `tsconfig.app.json` against the "strict" requirement below.
- If a technical choice isn't made in the docs or code, ask. Don't decide it silently.

## React and TypeScript
- Use function components with fully typed public props. Strict type checking must pass, with no `any` in public prop types.
- Components are importable by name from a single package and are tree-shakeable.
- Accessibility is part of each component: keyboard operation, inputs programmatically linked to their labels, error text linked to its input, correct roles, names and states, and an accessible name required for icon-only controls.

## Components and design tokens
- Token names and values come from `docs/ux-handoff.md`. Don't rename or change them.
- Components use semantic tokens only. Never use primitive tokens or hard-coded colors, spacing or radii, so themes can change without editing components.
- Follow the component specs and shared rules (focus, disabled) in the UX handoff.
- Content rules: sentence case for labels and buttons; error messages say what to do.
- Where the UX handoff marks something TBD or leaves it unspecified, don't invent behavior. Implement only what is specified and flag the open question.

## Testing
- Use Vitest and Testing Library (with user-event) to test behavior. Prefer role and label queries.
- Unit tests cover new behavior (states, keyboard use, label and error association). All existing tests must pass.
- Automated accessibility checks (vitest-axe) must show no new violations.
- Don't weaken or delete tests to get a passing run.

## Storybook and documentation
- Each public component has a Storybook page with a live example, a props table, working Controls, and a story for every state in its props.
- Update Storybook whenever a component changes.
- Update release notes for user-visible or breaking changes. Note unresolved UX questions on the component page or in the release notes.

## Change scope and dependencies
- Keep changes minimal and tied to the requested story or task. No unrelated refactors or reformatting.
- Don't add or upgrade dependencies without asking.
- Don't edit `docs/` unless asked. Flag conflicts between docs and code instead.
