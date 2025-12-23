# --- STAGE 1: BUILD ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- STAGE 2: PRODUCTION ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3002
ENV HOSTNAME="0.0.0.0"

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set up directory structure with correct permissions
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy the standalone build to root
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Copy static assets to the correct .next subfolder
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3002

CMD ["node", "server.js"]
