# ── Stage 1: install ALL dependencies (dev included, needed for building) ────
FROM node:20-alpine AS deps

# better-sqlite3 compiles a native C++ addon
RUN apk add --no-cache python3 make g++

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ── Stage 2: install PRODUCTION dependencies only ────────────────────────────
FROM node:20-alpine AS prod-deps

RUN apk add --no-cache python3 make g++

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ── Stage 3: build the Next.js app ──────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN mkdir -p public && npm run build

# ── Stage 4: production runner ──────────────────────────────────────────────
FROM node:20-alpine AS runner

# better-sqlite3 needs libstdc++ at runtime
RUN apk add --no-cache libstdc++ wget

WORKDIR /app

# Run as non-root for least-privilege
RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# Production node_modules (all transitive deps resolved, native modules built)
COPY --from=prod-deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# Built Next.js output (.next contains compiled server + client bundles)
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

# Config files required by `next start`
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./
COPY --from=builder --chown=nextjs:nodejs /app/next.config.mjs ./

# Public assets
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Data directory for SQLite
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data
VOLUME /app/data

# Environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=7860

USER nextjs
EXPOSE 7860

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:7860/health || exit 1

CMD ["sh", "-c", "export FOUNDER_OS_ACCESS_TOKEN=\"${FOUNDER_OS_ACCESS_TOKEN:-${HF_TOKEN:-${SECRET_TOKEN:-founder_os_demo_access_token_hf_space}}}\" && exec ./node_modules/.bin/next start -H 0.0.0.0 -p 7860"]
