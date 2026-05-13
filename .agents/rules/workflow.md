---
trigger: always_on
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
