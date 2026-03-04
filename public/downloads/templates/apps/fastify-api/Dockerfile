FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g pnpm turbo
COPY . .
RUN turbo prune fastify-api --docker
FROM node:20-alpine AS runner
WORKDIR /app
RUN npm install -g pnpm
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile
COPY --from=builder /app/out/full/ .
RUN npx turbo run db:generate
RUN npx turbo run build --filter=fastify-api
EXPOSE 3005
CMD ["node", "apps/fastify-api/dist/index.js"]
