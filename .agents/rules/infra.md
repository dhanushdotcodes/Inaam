---
trigger: always_on
---

# Infrastructure & Configuration Rules

## Environment Variables
- **Storage**: Store environment variables in `.env`.
- **Syncing Template**: You must update `_env.local` when you add or remove any variable in `.env`.
- **Access**: Access environment variables only through the centralized config; direct use of `.env` is strictly prohibited.

## Commands and Execution
- Create a `Makefile` in the root directory to manage and execute all project commands.
- Use Makefile commands for all terminal operations.
- Always add any new command to the `Makefile` before execution.
