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

COPY . .

EXPOSE 3000

# Next.js dev server
CMD ["bun", "run", "dev"]

# --- Production Builder ---
FROM base AS builder
RUN --mount=type=cache,target=/root/.bun/install/cache \
    --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=bun.lockb,target=bun.lockb \
    bun install --frozen-lockfile

COPY . .
RUN bun run build

# --- Production Final ---
FROM oven/bun:1.2-alpine AS production
WORKDIR /app

# Copy production dependencies and build artifacts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000

CMD ["bun", "run", "start"]
