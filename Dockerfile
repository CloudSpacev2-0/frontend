# ---- Stage 1: build the static React bundle ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Stage 2: serve it with nginx ----
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Scripts in /docker-entrypoint.d/ run automatically when the container starts.
# This one writes config.js from the PRODUCT_API_URL / ORDER_API_URL env vars,
# so the SAME image works locally and in any Azure environment.
COPY docker-entrypoint.sh /docker-entrypoint.d/40-write-config.sh
RUN chmod +x /docker-entrypoint.d/40-write-config.sh

EXPOSE 80
