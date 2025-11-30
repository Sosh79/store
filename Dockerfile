# ============================
# 1) Base image فيها Node 20
# ============================
FROM node:20.12.2-alpine AS base
WORKDIR /app

# ============================
# 2) Install dependencies
# ============================
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm install --production=false

# ============================
# 3) Build stage
# ============================
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ============================
# 4) Production image
# ============================
FROM node:20.12.2-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# لا تنسخ dev deps
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]
