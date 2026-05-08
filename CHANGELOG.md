# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com),
and this project adheres to [Semantic Versioning](https://semver.org).

## [Unreleased]

## [0.1.0] - 2026-05-08

### Added
- Initial Docker infrastructure (`docker-compose.local.yml`, `Dockerfile`).
- SQLAlchemy 2.0 models for `Task` and `Reward`.
- Alembic migration system with asynchronous support.
- Root `Makefile` for project automation.
- Environment variable management system (`.env`, `_env.local`).
- Created core project structure following Senior Full Stack conventions.
- Implemented `POST /api/v1/auth/login` endpoint with SHA-256 key verification.
- Integrated JWT authentication for session management.
- Added integration testing suite with `pytest` and `TestClient`.
- Configured CORS middleware in FastAPI application.
