# syntax=docker/dockerfile:1

# Versión fija (sin `latest`): Node 24 es la LTS activa (ver docs/specs/2-Base-Proyecto.md).
FROM node:24.21.0-alpine

WORKDIR /app

# Manifiestos primero para aprovechar la caché de capas.
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev

# Código del backend, migraciones y su configuración.
COPY backend/src ./src
COPY backend/migrations ./migrations
COPY backend/migrations.config.js ./

EXPOSE 3000

# Usuario sin privilegios que ya trae la imagen oficial.
USER node

CMD ["npm", "start"]
