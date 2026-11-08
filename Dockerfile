# Stage 1: Build
FROM node:24-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json prisma.config.ts ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Runner
FROM node:24-alpine AS runner
WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json /app/prisma.config.ts ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/seed.js ./seed.js
COPY --from=builder /app/dist ./dist

CMD ["npm", "run", "deploy"]
