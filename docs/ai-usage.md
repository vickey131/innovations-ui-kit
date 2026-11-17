

# AI Usage

## Claude Code – Plan Mode

**Task:** Create a root-level `CLAUDE.md` for the Innovations UI Kit project.

Used Claude Code Plan Mode to review the repository and prepare a plan for creating the file using the existing project documentation and `package.json`.

## Accepted Suggestions

- Keep project overview and technology stack instructions.
- Refer to the product brief, user stories, UX handoff and sprint plan as project references.
- Include React and TypeScript conventions.
- Document accessibility, design token usage, testing and Storybook expectations.
- Include guidelines for keeping changes minimal and avoiding unnecessary dependencies.

## Rejected and Adjusted Suggestions

The initial plan included some instructions that were too specific or temporary for a permanent repository-level file.

- Removed sprint priorities, excluded features and current setup-status notes.
- Avoided adding requirements that were not confirmed in the project documentation.
- Removed mandatory TSDoc requirements for every public prop.
- Avoided treating WCAG 2.1 AA as a confirmed fixed target.
- Kept unresolved UX decisions open instead of prescribing implementation approaches.
- Restricted the task to creating only the root `CLAUDE.md`.

## Permissions

Reviewed the proposed changes before allowing Claude Code to proceed. No unrelated file changes were requested.

## Diff Review

Reviewed the plan to ensure that `CLAUDE.md` would contain permanent repository-level instructions rather than temporary sprint information.

The final scope was limited to the root `CLAUDE.md`, with no changes to existing project documentation or source files.

