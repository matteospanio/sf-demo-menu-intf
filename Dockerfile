# syntax=docker/dockerfile:1

FROM node:20-alpine AS builder

WORKDIR /app

# This repo uses a classic yarn.lock without a `packageManager` field.
# Installing Yarn v1 avoids Corepack picking Yarn Berry by default.
RUN npm i -g yarn@1.22.22

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . ./

# Vite env vars are injected at build-time.
# - VITE_BASE_PATH: where the app is hosted ("/" for Docker, "/sf-demo-menu-intf/" for GitHub Pages)
# - VITE_API_BASE_URL: SoundFood API base URL
ARG VITE_BASE_PATH=/
ARG VITE_API_BASE_URL
ENV VITE_BASE_PATH=$VITE_BASE_PATH
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN yarn build


FROM nginx:1.25-alpine AS runner

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
