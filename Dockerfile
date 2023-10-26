FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build
# RUN npm prune --production

FROM cgr.dev/chainguard/node:latest

WORKDIR /app
COPY --chown=node:node --from=builder /app/build build/
COPY --chown=node:node --from=builder /app/node_modules node_modules/
COPY --chown=node:node package.json .
EXPOSE 3000
ENV NODE_ENV=production
# 500MB request size limit
ENV BODY_SIZE_LIMIT=65540000
ENV PROTOCOL_HEADER=x-forwarded-proto 
ENV HOST_HEADER=x-forwarded-host
CMD ["build"]
