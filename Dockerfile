# syntax=docker/dockerfile:1

FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies with npm (uses registry.npmjs.org by default).
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . ./

# Vite env vars are injected at build-time.
# - VITE_BASE_PATH: where the app is hosted ("/" for Docker, "/menu-client/" for GitHub Pages)
# - VITE_API_BASE_URL: SoundFood API base URL
ARG VITE_BASE_PATH=/
ARG VITE_API_BASE_URL
ENV VITE_BASE_PATH=$VITE_BASE_PATH
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build


FROM nginx:1.25-alpine AS runner

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
