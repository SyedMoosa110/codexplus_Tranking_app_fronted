FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY packages/contracts/package*.json ./packages/contracts/
COPY apps/admin-web/package*.json ./apps/admin-web/

RUN npm install

COPY packages/contracts ./packages/contracts
COPY apps/admin-web ./apps/admin-web

RUN npm run build:contracts
RUN npm run --workspace=apps/admin-web build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/admin-web/.next ./apps/admin-web/.next
COPY --from=builder /app/apps/admin-web/public ./apps/admin-web/public
COPY --from=builder /app/apps/admin-web/package*.json ./apps/admin-web/

EXPOSE 3000
CMD ["npm", "run", "--workspace=apps/admin-web", "start"]
