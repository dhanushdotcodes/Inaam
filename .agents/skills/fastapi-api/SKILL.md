----
name: fastapi-api
description: Build new FastAPI API endpoints following the project's layered architecture — route, schema, service — with proper validation, error handling, and dependency injection.
----

# Skill: Building FastAPI API Endpoints

## When to Use
Use this skill when:
- Creating a new API route, schema, or service for the FastAPI server.
- Adding CRUD operations for a new or existing resource.
- Wiring a new router into the main FastAPI application.
- Implementing request validation, response schemas, or error handling for an endpoint.
- Adding authentication or authorization guards to routes.

Do NOT use when:
- Creating or modifying database models or running migrations (use `handle-db` instead).
- Writing integration tests for the API (use `fastapi-server-tests` instead).
- Building the frontend or Next.js pages (use `next.js` instead).
- Doing infrastructure or Docker work (use `containerise-app` instead).

---

## Input
- Stack: FastAPI, Python 3.13+, Pydantic v2, SQLAlchemy 2.0+, `uv` package manager.
- Architecture: Route → Service → Database (via SQLAlchemy async sessions).
- Validation: Pydantic models for both request and response schemas.
- Auth: OAuth2 with JWT tokens, bcrypt password hashing.
- Entry point: `apps/server/main.py`.

---

## Constraints and Guidelines

### Naming Conventions
- Folders and files MUST use `snake_case`.
- Classes, Schemas, and Enums MUST use `PascalCase`.
- Functions and variables MUST use `snake_case`.
- Constants and env vars MUST use `UPPER_SNAKE_CASE`.
- Router instances MUST be named `router`.

### Architecture Rules
- Each resource gets its own directory under `apps/server/api/` containing `routes.py` and optionally `service.py`.
- Pydantic request/response schemas live in `apps/server/schemas/`.
- Shared business logic and external integrations live in `apps/server/services/`.
- Database session dependency (`get_db`) is injected via FastAPI's `Depends()`.
- ALL database operations MUST be asynchronous.
- NEVER call `.commit()` manually inside a service — use `async with session.begin():`.

### Error Handling
- Raise `HTTPException` with specific status codes at the route level.
- Service-layer errors should raise domain-specific exceptions that routes translate to HTTP responses.
- Error responses MUST include: status code, detail message, and relevant context.
- NEVER swallow exceptions silently.

### Security
- NEVER expose secrets, tokens, or connection strings in code.
- ALL user inputs MUST be validated via Pydantic schemas.
- Auth-protected routes MUST use a dependency that verifies the JWT token.
- Passwords MUST be hashed with bcrypt — never stored or compared in plaintext.

### Dependencies
- NEVER add a new external dependency without asking the user first.
- Access environment variables ONLY through the centralized config — never use `os.getenv()` directly.

---

## Project Structure

```text
apps/server/
├── main.py                     # FastAPI app entry point, router registration
├── api/
│   └── <resource>/
│       ├── routes.py           # Route definitions (router)
│       └── service.py          # Business logic for the resource
├── core/
│   ├── config.py               # Centralized env var access
│   └── database.py             # Async engine, session factory, get_db
├── models/
│   ├── base.py                 # Declarative Base
│   ├── __init__.py             # Model imports for Alembic discovery
│   └── <resource>.py           # SQLAlchemy model definitions
├── schemas/
│   └── <resource>.py           # Pydantic request/response schemas
├── services/
│   └── <shared_service>.py     # Cross-cutting services (auth, email, etc.)
└── tests/
    └── <resource>/
        └── test_<resource>.py  # Integration tests
```

---

## Steps to Execute

1. **Clarify the requirement**
   - Identify the resource name, HTTP methods, and expected request/response shapes.
   - Confirm whether the endpoint needs authentication.
   - Check if the corresponding database model and migration already exist (if not, defer to `handle-db`).

2. **Create or update Pydantic schemas**
   - Add request schemas (e.g., `CreateUserRequest`) and response schemas (e.g., `UserResponse`) in `apps/server/schemas/<resource>.py`.
   - Use Pydantic v2 conventions (`model_config = ConfigDict(from_attributes=True)`).
   - Define field constraints (e.g., `min_length`, `max_length`, `EmailStr`).

3. **Implement the service layer**
   - Create `apps/server/api/<resource>/service.py` for resource-specific business logic.
   - Inject the async database session via function parameter.
   - Use SQLAlchemy 2.0 style queries (`select()`, `execute()`).
   - Use `async with session.begin():` for atomic write operations.
   - Raise domain-specific exceptions for business rule violations.

4. **Define the route**
   - Create `apps/server/api/<resource>/routes.py`.
   - Instantiate `router = APIRouter(prefix="/<resource>", tags=["<Resource>"])`.
   - Define route handlers using `@router.get()`, `@router.post()`, etc.
   - Inject dependencies: `db: AsyncSession = Depends(get_db)`, auth guards as needed.
   - Map service exceptions to `HTTPException` with appropriate status codes.
   - Use Pydantic `response_model` for type-safe responses.

5. **Wire the router into the app**
   - In `apps/server/main.py`, import and include the new router:
     ```python
     from api.<resource>.routes import router as <resource>_router
     app.include_router(<resource>_router, prefix="/api/v1")
     ```

6. **Add CORS if needed**
   - Ensure `CORSMiddleware` is configured in `main.py` to allow the frontend origin.

7. **Validate**
   - Start the server: `cd apps/server && uv run fastapi dev main.py`
   - Verify the new endpoint appears in the auto-generated docs at `/docs`.
   - Test with a manual request or defer to `fastapi-server-tests`.

---

## Build & Verify Commands

- **Run the dev server**:
  ```bash
  cd apps/server
  uv run fastapi dev main.py
  ```
- **Check code style**:
  ```bash
  cd apps/server
  uv run ruff check .
  ```
- **Format code**:
  ```bash
  cd apps/server
  uv run ruff format .
  ```

---

## Output Format
- Pydantic schemas in `apps/server/schemas/<resource>.py`.
- Service logic in `apps/server/api/<resource>/service.py`.
- Route definitions in `apps/server/api/<resource>/routes.py`.
- Updated `apps/server/main.py` with the new router included.
- Brief explanation of design decisions and trade-offs.

---

## Suggested Next Skills
- `handle-db` — if a new model or migration is required.
- `fastapi-server-tests` — to write integration tests for the new endpoint.
- `execution` — if this is part of a larger implementation plan.

---

## Checklist
- [ ] Pydantic schemas are defined with proper field constraints
- [ ] Service layer uses async SQLAlchemy 2.0 queries
- [ ] No manual `.commit()` calls in service methods
- [ ] Route uses `Depends()` for DB session and auth injection
- [ ] Router is registered in `main.py` with the `/api/v1` prefix
- [ ] Error responses use specific status codes and descriptive messages
- [ ] No secrets or hardcoded config values in the codebase
- [ ] Naming conventions follow project rules (`snake_case` files, `PascalCase` classes)
- [ ] CORS is configured if the frontend needs to call this endpoint
- [ ] Endpoint is visible and functional in `/docs`
