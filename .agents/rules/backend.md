---
trigger: model_decision
description: Standards for FastAPI, SQLAlchemy, and backend-specific naming/logic.
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
---

## Related Skills
- [fastapi-api](file:///Users/dhanush_d27/Dev/inaam/.agents/skills/fastapi-api/SKILL.md) — Building new FastAPI endpoints.
- [handle-db](file:///Users/dhanush_d27/Dev/inaam/.agents/skills/handle-db/SKILL.md) — Database migrations and schema changes.
- [fastapi-server-tests](file:///Users/dhanush_d27/Dev/inaam/.agents/skills/fastapi-server-tests/SKILL.md) — Writing integration tests.
