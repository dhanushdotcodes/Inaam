---
name: containerise-app
description: This skill containerises an app for local development environment, It can handle creating images as well as creating a docker-compose file to run the app locally.
---

## When to Use
Use this skill when:
- Trigger when the user asks to containerise an app for local development environment.
- Trigger when the user asks to create a dockerfile or docker-compose file for an app.

## Inputs
- `./src`: Path to the application code
- `3000`: Port on which the application runs

## Steps
1. **Analyze the Application Tech Stack**: Identify the languages, frameworks, runtime (e.g., Bun, Node, Python), and services (e.g., PostgreSQL, Redis) the application uses.
2. **Find a Suitable Lightweight Base Image**: Look for official `alpine` or minimal variants of base images (e.g., `oven/bun:1-alpine`, `node:20-alpine`, `python:3.11-alpine`) to keep the container footprint small.
3. **Establish a Multi-Stage Build Strategy**: Define separate build targets for `development` and `production` environments to avoid leaking development dependencies or tools into production images.
4. **Create the Dockerfile**:
    - Set the working directory (`WORKDIR`).
    - Cache dependencies via multi-stage mounts (`--mount=type=cache`) or separate lock-file layers.
    - Copy application files and scripts, making sure to adjust file permissions if required.
    - Expose the necessary application ports using `EXPOSE`.
    - Define the startup command using `CMD`.
5. **Configure the Orchestration (docker-compose.yaml)**:
    - Create a `docker-compose.yaml` file to define your multi-container environment.
    - Reference service dependencies using lightweight alpine versions; specifically, the PostgreSQL database image should ALWAYS be `postgres:alpine`.
    - Define volumes for persistent storage and hot-reloading development code.
    - Define local network paths and environment variables required for service-to-service communication.

## Examples

- Below is the example of docker-compose.yaml of an app.
```yaml
name: "trackly"
services:
  db:
    image: postgres:alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  server:
    build:
      context: ../apps/server
      target: development
    ports:
      - "8000:8000"
    volumes:
      - ../apps/server:/app/server
    environment:
      - DATABASE_URL=postgresql+psycopg://postgres:password@db:5432/postgres
    depends_on:
      - db

  web:
    build:
      context: ../apps/web
      target: development
    ports:
      - "3000:3000"
    volumes:
      - ../apps/web:/usr/src/app
      - /usr/src/app/node_modules
      - /usr/src/app/.next
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
      - INTERNAL_API_URL=http://server:8000/api/v1
    depends_on:
      - server

volumes:
  postgres_data:
```

- Below is the example of Dockerfile of a bun app.
```dockerfile
# --- Base ---
FROM oven/bun:1.2-alpine AS base
WORKDIR /app

# --- Development ---
FROM base AS development
# Install dependencies using cache mounts for speed
RUN --mount=type=cache,target=/root/.bun/install/cache \
    --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=bun.lockb,target=bun.lockb \
    bun install --frozen-lockfile

COPY . /app/server
# Ensure scripts are executable
RUN chmod +x /app/server/scripts/prestart.sh

EXPOSE 3000
# Run migrations/setup then start the server in dev mode
CMD ["sh", "-c", "/app/server/scripts/prestart.sh && bun run --hot server/main.ts"]

# --- Production Builder ---
FROM base AS builder
RUN --mount=type=cache,target=/root/.bun/install/cache \
    --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=bun.lockb,target=bun.lockb \
    bun install --frozen-lockfile --production

# --- Production Final ---
FROM oven/bun:1.2-alpine AS production
WORKDIR /app

# Copy node_modules from builder
COPY --from=builder /app/node_modules /app/node_modules
COPY . /app/server

RUN chmod +x /app/server/scripts/prestart.sh

EXPOSE 3000
# Run migrations then start the server in prod mode
CMD ["sh", "-c", "/app/server/scripts/prestart.sh && bun run server/main.ts"]
```