FROM python:3.13-slim AS base

WORKDIR /app

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# --- Development ---
FROM base AS development

# Copy dependency files
COPY pyproject.toml uv.lock ./

# Install dependencies
RUN uv sync --frozen

# Copy the rest of the application
COPY . .

# Ensure script is executable
RUN chmod +x scripts/prestart.sh

EXPOSE 8000

# Start command
CMD ["sh", "-c", "./scripts/prestart.sh && uv run fastapi dev main.py --host 0.0.0.0 --port 8000"]
