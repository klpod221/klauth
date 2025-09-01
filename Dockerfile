# ---- Stage 1: Build ----
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# ---- Stage 2: Production ----
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app ./

EXPOSE 3000

CMD ["node", "server.js"]
