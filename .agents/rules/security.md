---
trigger: always_on
---

# Security & Authentication Rules

## Core Guidelines
- NEVER expose secrets, tokens, or connection strings in the codebase.
- OAuth2 with JWT tokens MUST be used for authentication.
- Password hashing MUST use `bcrypt`.
- ALL inputs MUST be validated and sanitized.
- The principle of least privilege MUST be followed.

## Security — NEVER
- Commit secrets, API keys, tokens, passwords, or `.env` files.
- Force-push to `main`, `master`, or any protected branch.
- Add new external dependencies without asking first.
- Log or print PII, credentials, or tokens.
- Build SQL queries or shell commands via string concatenation.

## Security — ASK FIRST
- Adding any new external dependency.
- Running database migrations.
- Deleting or renaming files.
- Modifying CI/CD configs or deployment definitions.
- Touching authentication or authorization logic.
