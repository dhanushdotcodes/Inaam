.PHONY: help dev-web typecheck-web build-web lint-web status add commit up down web-upgrade server-upgrade db-container-upgrade db-migrate db-upgrade dev-server test install-client

help:
	@echo "Inaam Project Command Registry"
	@echo "==============================="
	@echo "Usage: make [command]"
	@echo ""
	@echo "Available commands:"
	@echo "  help                  - Display this help menu"
	@echo "  dev-web               - Start Next.js client dev server using bun"
	@echo "  typecheck-web         - Run TypeScript type checks on the client"
	@echo "  build-web             - Compile Next.js client production build"
	@echo "  lint-web              - Run ESLint check on the client"
	@echo "  status                - Run git status"
	@echo "  add                   - Stage all current changes (git add .)"
	@echo "  commit m=\"msg\"         - Commit staged changes with message"
	@echo "  up                    - Build and start all Docker containers in background"
	@echo "  down                  - Stop and tear down all Docker containers"
	@echo "  teardown              - Stop and remove all containers, images, and volumes"
	@echo "  web-upgrade           - Rebuild and upgrade the client (web) container"
	@echo "  server-upgrade        - Rebuild and upgrade the FastAPI (server) container"
	@echo "  db-container-upgrade  - Upgrade/recreate the Postgres database container"
	@echo "  db-migrate m=\"msg\"     - Create a database migration revision using Alembic"
	@echo "  db-upgrade            - Run database Alembic migrations to head"
	@echo "  dev-server            - Start FastAPI backend dev server using uv"
	@echo "  test                  - Run backend pytest test suite"
	@echo "  install-client pkg=\"x\" - Install a client npm/bun package"
	@echo "  install-server pkg=\"x\" - Install a server python package via uv"
	@echo "  db-seed               - Run database seed script"
	@echo ""

dev-web:
	cd apps/client && bun run dev

typecheck-web:
	cd apps/client && bun x tsc --noEmit

build-web:
	cd apps/client && bun run build

lint-web:
	cd apps/client && bun run lint

status:
	git status

add:
	git add .

commit:
	git commit -m "$(m)"

# Docker commands
up:
	docker compose -f infra/docker-compose.local.yml up --build -d

down:
	docker compose -f infra/docker-compose.local.yml down

teardown:
	docker compose -f infra/docker-compose.local.yml down --rmi all --volumes --remove-orphans

web-upgrade:
	docker compose -f infra/docker-compose.local.yml up --build -d -V web

server-upgrade:
	docker compose -f infra/docker-compose.local.yml up --build -d -V server

db-container-upgrade:
	docker compose -f infra/docker-compose.local.yml up --build -d db

# Database commands
db-migrate:
	cd apps/server && PYTHONPATH=../..:.:$$PYTHONPATH uv run alembic revision --autogenerate -m "$(m)"

db-upgrade:
	cd apps/server && PYTHONPATH=../..:.:$$PYTHONPATH uv run alembic upgrade head

dev-server:
	cd apps/server && PYTHONPATH=../..:.:$$PYTHONPATH uv run fastapi dev main.py

test:
	cd apps/server && PYTHONPATH=../..:.:$$PYTHONPATH uv run pytest

install-client:
	cd apps/client && bun install $(pkg)

install-server:
	cd apps/server && uv add $(pkg)

db-seed:
	cd apps/server && PYTHONPATH=../..:.:$$PYTHONPATH uv run python -m scripts.seed_data
