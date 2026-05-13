---
trigger: always_on
---

# FastAPI Backend Rules

## Naming Conventions
- Folders & files MUST use `snake_case`.
- Classes, Schemas, and Enums MUST use `PascalCase`.
- Functions & Variables MUST use `snake_case`.
- Constants & Env vars MUST use `UPPER_SNAKE_CASE`.
- Router instances MUST be named `router`.

## Best Practices
- All functions MUST have docstrings.
- Raise errors explicitly at the point of failure; never swallow exceptions silently.
- Use specific error types; avoid generic catch-alls that hide root causes.
- Error messages must include: request params, response body, status codes, correlation IDs.
- Use structured logging fields — do not interpolate dynamic values into message strings.
