#!/bin/bash

# Exit on error
set -e

echo "Running migrations..."
PYTHONPATH=.:$PYTHONPATH alembic upgrade head

echo "Migrations completed successfully."
