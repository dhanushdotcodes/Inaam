----
name: handle-db
description: Handles database creation, schema definition, and asynchronous migrations using SQLAlchemy 2.0 and Alembic.
----

# Skill: Handle Database Operations

## When to Use
Use this skill when:
- Creating, modifying, or deleting database tables or schemas.
- Working with SQLAlchemy 2.0 ORM models.
- Running, generating, or managing database migrations with Alembic.
- Designing or implementing asynchronous database operations.

Do NOT use when:
- Creating purely in-memory data structures.
- Interacting with APIs that don't involve the project's SQLAlchemy DB setup.

---

## Input
- Specific details on the required database schema (columns, types, relationships).
- `apps/api/models/*.py` files if working with existing tables.
- Migration history in `apps/server/alembic/versions/` to avoid conflicts.

---

## Constraints and Guidelines

* SQLAlchemy 2.0+ (Declarative Mapping) MUST be used for ORM.
* Alembic MUST be used for all database migrations.
* You MUST NOT re-write the versions inside the `alembic/versions` directory.
* Database operations MUST be asynchronous.
* ALL models MUST inherit from `server.models.base.Base`.
* ALL models MUST be imported in `apps/server/models/__init__.py` to be recognized by Alembic.
* Service methods MUST use `async with session.begin():` for atomic operations.
* NEVER call `.commit()` manually inside a service method.
* ALWAYS prefer SQLAlchemy 2.0 style queries (using `select()`, `execute()`) over the legacy `Query` API.
* NEVER perform destructive database actions without explicit confirmation.
* Alembic commands MUST be run from the `apps/server` directory using `PYTHONPATH=..:.:$PYTHONPATH uv run alembic`.

---

## Steps to Execute

1. **Understand Database Architecture and Conventions**
   - The framework is FastAPI with SQLAlchemy 2.0+ (Declarative Mapping).
   - All database operations **MUST** be asynchronous.
   - All models MUST inherit from `api.models.base.Base`.

2. **Create or Modify SQLAlchemy Models**
   - Add new or update existing model definitions inside `apps/api/models/`.
   - Ensure the models use SQLAlchemy 2.0 styling (e.g., `Mapped[int] = mapped_column(primary_key=True)`).
   - Check `api.models.base` for existing Enums before creating new ones.
   - **CRITICAL**: Import any new models in `apps/api/models/__init__.py` so Alembic can detect them for migrations (`Base.metadata`).
   - Provide corresponding Pydantic 'Read' and 'Write' schemas in `apps/api/schemas/` for the models.

3. **Handle Service Layer Operations**
   - Use asynchronous database queries (`select()`, `execute()`) over legacy `Query` API.
   - Service methods must use atomic transactions via `async with session.begin():` or inject `get_db` dependency properly.
   - **Never** call `.commit()` manually inside a service method.

4. **Manage Alembic Migrations**
   - Ensure you are in the `apps/api` directory before running Alembic.
   - To generate a new migration after updating models:
     ```bash
     cd apps/server
     PYTHONPATH=..:.:$PYTHONPATH uv run alembic revision --autogenerate -m "description_of_changes"
     ```
   - Review the generated script inside `alembic/versions/` to ensure accuracy.
   - Apply migrations to the database:
     ```bash
     cd apps/server
     PYTHONPATH=..:.:$PYTHONPATH uv run alembic upgrade head
     ```
   - **CRITICAL**: Strictly DO NOT manually update ANY files in `apps/server/alembic/versions/` (neither historical nor newly generated). If you encounter a situation where the migration script fails or is inaccurate (e.g., PostgreSQL Enum duplication or "Target database is not up to date"), YOU MUST NOT attempt to patch the script file manually. Instead, explain the situation clearly to the user, including exactly what is failing and why, and provide the user with the necessary technical context to decide how to proceed (e.g., dropping the database and recreating migrations from scratch). Only follow the traditional way of updating the DB schema: update SQLAlchemy models, create migrations with Alembic, and apply them to the head.

5. **Ensure Data Safety**
   - Do not drop tables or clear data unless explicitly requested by the user.
   - When altering columns, handle potential data migrations if needed.

6. **Update Documentation**
   - Whenever you add, modify, or remove models or columns, you MUST update `docs/DB_SCHEMA.md` and `.context/database.md` to reflect these changes.

---

## Build & Verify Commands

- **Generate a new migration (Autogenerate)**: Compares the current models to the database and generates a migration script.
  ```bash
  PYTHONPATH=..:.:$PYTHONPATH uv run alembic revision --autogenerate -m "description_of_changes"
  ```
- **Apply migrations**: Applies all pending migrations up to the latest head.
  ```bash
  PYTHONPATH=..:.:$PYTHONPATH uv run alembic upgrade head
  ```
- **Check for sync (Compare)**: Checks if the current local SQLAlchemy models perfectly match the database schema without generating a migration.
  ```bash
  PYTHONPATH=..:.:$PYTHONPATH uv run alembic check
  ```
- **Show current database revision**: Shows the migration revision currently applied to the database.
  ```bash
  PYTHONPATH=..:.:$PYTHONPATH uv run alembic current
  ```
- **Downgrade last migration**: Reverts the last applied migration.
  ```bash
  PYTHONPATH=..:.:$PYTHONPATH uv run alembic downgrade -1
  ```
- **Show migration history**: Lists all migrations in order.
  ```bash
  PYTHONPATH=..:.:$PYTHONPATH uv run alembic history --verbose
  ```

---

## Output Format
- SQLAlchemy model definitions updated in `apps/api/models/`.
- Pydantic schemas updated in `apps/api/schemas/`.
- Newly generated Alembic migration file inside `apps/server/alembic/versions/`.
- Updated `apps/api/models/__init__.py`.

---

## Checklist
- [ ] Model uses SQLAlchemy 2.0 Declarative Mapping.
- [ ] Model inherits from `api.models.base.Base`.
- [ ] Model is imported into `apps/api/models/__init__.py`.
- [ ] Database operations and service methods are fully asynchronous.
- [ ] No manual `.commit()` calls exist in service methods.
- [ ] Alembic migration has been successfully generated and reviewed.
- [ ] `uv run alembic upgrade head` has been run and validated.
- [ ] Database documentation (`docs/DB_SCHEMA.md` and `.context/database.md`) has been updated to reflect the schema changes.
