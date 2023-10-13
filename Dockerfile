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
# TODO: (@razzle) change this to the actual origin / domain (or expose as env var)
# as sveltekit will deny requests from other origins unless we disable CRSF (def not)
ENV ORIGIN=http://localhost:3000
CMD ["-r", "dotenv/config", "build"]
