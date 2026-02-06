# 1. Base Image
FROM node:18-alpine AS base

# Install OpenSSL compatibility for Prisma and Chromium for Puppeteer
RUN apk add --no-cache openssl libc6-compat chromium nss freetype harfbuzz ca-certificates ttf-freefont dos2unix

# 2. Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
# Install dependencies (use ci for consistent installs)
RUN npm install

# 3. Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client during build
RUN npx prisma generate

# Build Next.js app
RUN npm run build

# 4. Runner (Production Image)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Copy Prisma generated client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

COPY --from=builder /app/docker-entrypoint.sh ./

# Fix line endings and permissions
USER root
RUN dos2unix ./docker-entrypoint.sh && chmod +x ./docker-entrypoint.sh
USER nextjs

ENV PORT=3000
# IMPORTANT: Hostname must be 0.0.0.0 to be accessible outside container
ENV HOSTNAME="0.0.0.0"

CMD ["/bin/sh", "./docker-entrypoint.sh"]
