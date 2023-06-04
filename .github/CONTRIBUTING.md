# Contributing

Thank you for your interest in contributing to Blacksmith! Please review this document prior to opening a Pull Request.

## Getting Started

Before starting any substantial work please open an issue. This helps to avoid any duplication of effort.

## Code Quality

### Test Coverage

When implementing a new feature or resolving a bug please include comprehensive test coverage.

### Checks

Code Quality is enforced through GitHub Action, which runs the checks listed below.

- Commitlint (`pnpm commitlint`)
- Format (`pnpm format`)
- Lint (`pnpm lint`)
- Typecheck (`pnpm typecheck`)
- Test (`pnpm test`)

### Commit Messages

The project uses conventional commits. In the future, these will be used to generate automated versioning and changelogs. The formatting of conventional commits is as follows:

**Format**

`<type>: <description>`

**Example**

`feat: add contract address checksum`

The following conventional commit `type` options are allowed in the Blacksmith project.

- `build`
- `chore`
- `ci`
- `deps`
- `docs`
- `feat`
- `fix`
- `perf`
- `refactor`
- `revert`
- `style`
- `test`
