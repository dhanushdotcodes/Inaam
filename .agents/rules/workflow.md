---
trigger: model_decision
description: Git workflow, conventional commits, and changelog management.
---

# Git & Workflow Rules

## Commit Message Format
- All commits MUST follow Conventional Commits format: `<type>(<scope>): <short description>`
- Scope is MANDATORY and must reflect the layer or module (e.g., `api`, `services`, `controllers`, `prisma`).
- Description: Max 72 characters, use present tense, no vague words.

## Commit Types
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code change without behavior change
- `test`: Adding or updating tests
- `docs`: Documentation changes
- `chore`: Maintenance (configs, deps)

## Change Tracking
- Always update the project's `CHANGELOG.md` on a daily basis or immediately after significant commits.
- Keep commits small and focused (<50 LOC preferred).
- One logical change per commit.

## Versioning Rules
The project adheres to Semantic Versioning (SemVer): `MAJOR.MINOR.PATCH`. Commits pushed or deployed in a single set belong to the same version, and that version's number is incremented based on the contents of that set:
- **MAJOR (X.0.0)**: Incremented when making incompatible API changes, major architectural overhauls, or breaking database schema shifts.
- **MINOR (x.Y.0)**: Incremented when adding new backward-compatible functionality or features (e.g. `feat` commits in the pushed set).
- **PATCH (x.y.Z)**: Incremented for backward-compatible bug fixes, refactoring, documentation, style adjustments, or chores (e.g. only `fix`, `refactor`, `style`, `docs`, `chore`, `test` commits in the set).