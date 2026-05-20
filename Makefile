.PHONY: commit add status up down db-migrate db-upgrade dev-server dev-web build-web typecheck-web test

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
