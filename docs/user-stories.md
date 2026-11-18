# User Stories: Innovations UI Kit

Stories follow the personas in the [product brief](product-brief.md). Each story has an ID, a priority (MoSCoW) and Given/When/Then acceptance criteria (AC). Component names are used only as examples; the final component list is defined in later phases.

## Stories

### US-01: Install and import components
**As a** Frontend Developer, **I want** to install the UI Kit and import components from a single package, **so that** I can start using shared components without copying code between projects.

**Priority:** Must

- **AC1** Given a React + TypeScript project, when I install the package and import a component by name, then the project builds without errors.
- **AC2** Given I import only one component, when I build for production, then unused Kit components are excluded from the bundle (tree-shaking).

### US-02: Typed component props
As a Frontend Developer, I want every public component to have fully typed props, **so that** I get autocomplete and compile-time errors instead of runtime surprises.

**Priority:** Must

- **AC1** Given a public component, when I hover over its props in an editor, then each prop shows its type and a short description.
- **AC2** Given I pass a prop with the wrong type, when I run the TypeScript compiler, then it reports an error.
- **AC3** Given the Kit's source, when type checking runs in strict mode, then it passes with no `any` in public prop types.

### US-03: Browse components in Storybook
As a Frontend Developer, I want a Storybook page for each component, **so that** I can find a component and see how to use it in under 15 minutes.

**Priority:** Must

- **AC1** Given the Storybook site is running, when I open the sidebar, then every public component is listed.
- **AC2** Given a component page, when I open it, then it shows at least one live example and a table of its props.
- **AC3** Given an example, when I change a prop in the Controls panel, then the rendered component updates immediately.

### US-04: Review component states
As a UI/UX Designer, I want to see each component in all its states (default, hover, focus, disabled, error), **so that** I can check the implementation against the design without running the app.

**Priority:** Must

- **AC1** Given a component with a disabled state, when I open its Storybook page, then a story for the disabled state is available.
- **AC2** Given a form-input component, when I open its stories, then a story shows its error state with a visible error message.
- **AC3** Given any component page, when I view it, then every state listed in the component's props has a matching story.

### US-05: Keyboard operation
As a user of an application built with the Kit, I want interactive components to work with the keyboard alone, **so that** I can use the interface without a mouse.

**Priority:** Must

*Split from the larger story "Components meet accessibility standards" (see [Story splitting](#story-splitting)).*

- **AC1** Given a button is focused, when I press Enter or Space, then its click action fires.
- **AC2** Given a modal is open, when I press Tab repeatedly, then focus stays inside the modal and does not reach the page behind it.
- **AC3** Given a modal is open, when I press Escape, then the modal closes and focus returns to the element that opened it.

### US-06: Screen reader support
As a screen reader user, I want components to expose correct roles, names and states, **so that** I understand what each control does.

**Priority:** Must

*Split from the same accessibility story as US-05.*

- **AC1** Given a text input with a label prop, when I inspect the DOM, then the input is programmatically associated with its label.
- **AC2** Given an input in an error state, when the error appears, then the error text is linked to the input (for example via `aria-describedby`).
- **AC3** Given an icon-only button, when it is rendered without an accessible name, then the TypeScript types or a dev warning flags the missing name.

### US-07: Automated accessibility checks
As a Product Team member, I want accessibility checks to run automatically on every component, **so that** we keep the target of at least 90% of components passing.

**Priority:** Should

- **AC1** Given a component with a Storybook story, when the accessibility check runs, then it reports any WCAG 2.1 AA violations for that story.
- **AC2** Given a pull request that introduces a new violation, when CI runs, then the build fails and shows the violation.
- **AC3** Given all public components, when the check completes, then the pass rate is reported as a percentage.

### US-08: Consistent styling through shared tokens
As a UI/UX Designer, I want components to use shared design tokens (colors, spacing, typography), **so that** the shipped UI stays consistent with the design.

**Priority:** Should

- **AC1** Given two different components, when both use a primary color, then both read it from the same token and render the same value.
- **AC2** Given I change a token value, when I rebuild Storybook, then every component using that token reflects the change with no per-component edits.

## Story splitting

Two stories were too large for one sprint and were split.

**Epic story (too large):** *As a user, I want components to meet accessibility standards, so that everyone can use applications built with the Kit.*
Problems: not estimable, not testable as written ("standards" is vague), and it mixes different users and work.

Split by user need and by workflow step:

| Original | Split into | Reason |
|---|---|---|
| Components meet accessibility standards | US-05 Keyboard operation | Independent, testable by keyboard only |
| | US-06 Screen reader support | Independent, testable by DOM and assistive tech |
| | US-07 Automated accessibility checks | Separate process work for the team, not user-facing behavior |

**Epic story (too large):** *As a Frontend Developer, I want complete documentation for the Kit.*
Split into US-03 (browse and find components) and US-04 (review states). Further splits, such as per-component stories, are added only when a component is planned.

## Definition of Ready (DoR)

A story can enter a sprint when:

- It uses the "As a / I want / so that" format and names one persona from the product brief.
- It meets INVEST: Independent, Negotiable, Valuable, Estimable, Small (fits in one sprint), Testable.
- It has at least two acceptance criteria in Given/When/Then format.
- It has a priority and an estimate agreed by the team.
- Dependencies on other stories, designs or tokens are identified and not blocking.
- Open questions are answered, and scope is confirmed as inside the UI Kit.

## Definition of Done (DoD)

A story is done when:

- All acceptance criteria are verified and pass.
- Code is written in TypeScript with fully typed public props and no type errors.
- Unit tests cover the new behavior, and all existing tests pass.
- A Storybook page with examples exists or is updated for affected components.
- Automated accessibility checks pass with no new violations.
- Code is peer-reviewed and merged to the main branch, and CI passes.
- Release notes are updated if the change is user-visible or breaking.
