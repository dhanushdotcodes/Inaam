----
name: fastapi-server-tests
description: Write integration pytest tests for FastAPI server APIs using a real database connection to ensure full-stack reliability.
----

# Skill: Writing API integration tests for our server

## When to Use
Use this skill when:
- Explicitly asked to write tests for server APIs.
- A new API route has been added and tests are required to verify success cases, failure cases, and edge cases.
- Validating the full interaction between the API, Service, and Database layers.
- Ensuring that database constraints and real queries are working as expected.

Do NOT use when:
- In the middle of building a new feature or implementing an API and testing has not been requested yet.
- The task is about writing business logic, validation models, or database code instead of tests.
- Testing pure data-transformation functions (use unit tests instead).

---

## Input
- Stack: FastAPI, Python, Pydantic, pytest, SQLAlchemy.
- Architecture: API -> service -> real DB.
- Validation: Pydantic models.
- Testing style: `pytest` with `TestClient` and a real database connection.
- Goal: keep tests reliable and realistic by exercising the actual database boundary.

---

## Steps to Execute

1. Understand requirement
   - Identify the API route, service method, and entity involved.
   - Define the request input, expected response output, and failure scenarios.
   - Ensure a local database is running and accessible.

2. Design test structure
   - Focus on API-level integration tests.
   - Verify status code, response body, and error responses.
   - Ensure each test handles its own data setup and cleanup (or uses appropriate fixtures).

3. Define test data
   - Create clear request payloads and expected outputs.
   - Use realistic Pydantic-compatible test data.
   - Use fixtures in `conftest.py` for shared resources.

4. Database Interaction
   - Do NOT mock database calls.
   - Allow the application to connect to the database specified in the environment.
   - If tests fail due to connection issues, report the error clearly.

5. Write implementation
   - Use `pytest` for all test cases.
   - Cover success case, validation failures, not-found cases, and edge cases.
   - Keep each test focused on one user-facing behavior.

6. Error handling
   - Verify consistent error responses for expected failures.
   - Test edge cases like duplicate records or invalid state transitions.

7. Final check
   - Ensure `ruff` passes for test files.
   - Ensure tests are readable and consistently named.
   - Verify that tests actually hit the database and respect constraints.

---

## Output Format
- Provide code in:
  - API integration test
  - Necessary fixtures or setup
- Include brief explanation of testing decisions
- Keep examples aligned with FastAPI and pytest

---

## Checklist
- [ ] Test target is clearly identified
- [ ] No database mocking is used
- [ ] Success case is covered
- [ ] Failure or edge cases are covered
- [ ] Error handling is asserted
- [ ] Test names follow naming conventions
- [ ] Tests are readable and isolated