# syntax=docker/dockerfile:1

# Etapa 1: instala Bootstrap y lo copia a public/.
FROM node:24.21.0-alpine AS build

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/scripts ./scripts
COPY frontend/public ./public

RUN npm run copy:bootstrap

# Etapa 2: sirve los archivos estáticos con Nginx (versión fija).
FROM nginx:1.30.5-alpine

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/public /usr/share/nginx/html

EXPOSE 80
