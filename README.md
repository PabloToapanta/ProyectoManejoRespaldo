# Sistema Centralizado de Gestión y Venta de Pasajes Interprovinciales

Plataforma web multi-tenant para buscar, comparar y comprar pasajes interprovinciales de varias
cooperativas de transporte (Ecuador), con boleto electrónico (QR) y gestión interna de flotas,
frecuencias y hojas de ruta.

Este repositorio contiene la **base técnica** del proyecto (FEAT-01): estructura por módulos,
backend mínimo, frontend mínimo, base de datos, migraciones, calidad de código y Docker. Los
módulos de negocio se implementan en features posteriores.

## Stack

- Node.js 24 (LTS) + Express 5 · CommonJS
- PostgreSQL 17 · `pg` (sin ORM) · `node-pg-migrate`
- `zod` (configuración) · `pino` (logs)
- Jest + Supertest · ESLint (flat config) + Prettier
- Frontend: Bootstrap 5.3 (instalado con npm) servido por Nginx, con proxy `/api/` al backend
- Docker y Docker Compose

## Requisitos previos

- **Docker** y **Docker Compose** (forma recomendada; no hace falta instalar nada más).
- Solo para desarrollo **sin** Docker: Node.js 24 LTS, npm y PostgreSQL 17.

## Arranque rápido con Docker

```bash
# 1. Crea tu archivo de entorno a partir del ejemplo
cp .env.example .env

# 2. Construye y levanta los tres servicios (backend, frontend y base de datos)
docker compose up --build
```

La primera vez descarga las imágenes y compila. Cuando termine:

| Servicio | URL |
|---|---|
| Frontend | http://localhost:8080 |
| API (salud) | http://localhost:3000/api/v1/health |
| PostgreSQL | `localhost:5432` |

Comprueba que la API responde:

```bash
curl http://localhost:3000/api/v1/health
# {"status":"ok","database":"up"}
```

Si la base de datos no responde, el endpoint devuelve `503` con `"database": "down"`.

Para detener:

```bash
docker compose down       # detiene y elimina los contenedores (conserva los datos)
docker compose down -v    # además elimina el volumen (borra la base de datos)
```

### Migraciones

Las migraciones **no** se ejecutan automáticamente al arrancar. Se aplican de forma manual, también
dentro del contenedor:

```bash
docker compose exec backend npm run migrate:up            # aplica las migraciones pendientes
docker compose exec backend npm run migrate:down          # revierte la última
docker compose exec backend npm run migrate:create <nombre>  # crea un archivo de migración
```

### Puertos configurables

Si el `3000`, el `5432` o el `8080` están ocupados en tu máquina, cámbialos al levantar sin tocar
`docker-compose.yml`:

```bash
BACKEND_HOST_PORT=3001 DB_HOST_PORT=5433 FRONTEND_HOST_PORT=8081 docker compose up
```

## Desarrollo local sin Docker

### Backend

```bash
cd backend
npm install

# El backend lee las variables desde backend/.env
cp ../.env.example .env
# Edita backend/.env y ajusta DB_HOST a localhost (con Docker se resuelve como "db")

# Crea las bases (una vez)
psql -U postgres -c "CREATE DATABASE pasajes;"
psql -U postgres -c "CREATE DATABASE pasajes_test;"

npm run dev     # arranque con recarga automática
npm start       # arranque normal
```

Si falta o es inválida una variable obligatoria, el servidor **no arranca** e indica cuál.

### Frontend

```bash
cd frontend
npm install
npm run copy:bootstrap   # copia Bootstrap desde node_modules a public/
```

El frontend está pensado para servirse con Nginx, que reenvía `/api/` al backend. Para ver la página
sin Docker puedes abrir `public/index.html` o servir la carpeta `public/`, pero el estado del
servicio (`/api/`) solo se resuelve con la configuración de Nginx (Docker).

## Pruebas y calidad

Todos los comandos se ejecutan dentro de `backend/`:

```bash
cd backend
npm run lint             # ESLint (incluye reglas de capas)
npm test                 # pruebas unitarias (no requieren base de datos)
npm run test:integration # pruebas de integración
npm run format           # formatea con Prettier
```

> `npm test` ejecuta únicamente las pruebas unitarias; las de integración van aparte con
> `npm run test:integration`.

## Variables de entorno

Se definen en `.env` (a partir de `.env.example`); **el `.env` no se versiona**.

| Variable | Descripción | Ejemplo |
|---|---|---|
| `NODE_ENV` | Entorno de ejecución (`development`, `test`, `production`) | `development` |
| `PORT` | Puerto del backend dentro del contenedor | `3000` |
| `DB_HOST` | Host de PostgreSQL (`db` con Docker, `localhost` en local) | `db` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_NAME` | Nombre de la base | `pasajes` |
| `DB_USER` | Usuario de la base | `pasajes` |
| `DB_PASSWORD` | Contraseña de la base | `cambiar_esta_clave` |
| `DB_NAME_TEST` | Base para pruebas de integración | `pasajes_test` |
| `LOG_LEVEL` | Nivel de logs de `pino` | `info` |
| `BACKEND_HOST_PORT` | (Compose) puerto del backend en el host | `3000` |
| `DB_HOST_PORT` | (Compose) puerto de PostgreSQL en el host | `5432` |
| `FRONTEND_HOST_PORT` | (Compose) puerto del frontend en el host | `8080` |

## Comandos principales

**Backend** (`backend/`):

| Comando | Función |
|---|---|
| `npm start` | Arranque normal |
| `npm run dev` | Arranque en desarrollo con recarga |
| `npm run lint` / `npm run lint:fix` | ESLint |
| `npm run format` / `npm run format:check` | Prettier |
| `npm test` / `npm run test:unit` | Pruebas unitarias |
| `npm run test:integration` | Pruebas de integración |
| `npm run migrate:create <nombre>` | Crea una migración |
| `npm run migrate:up` / `npm run migrate:down` | Aplica o revierte migraciones |

**Frontend** (`frontend/`):

| Comando | Función |
|---|---|
| `npm install` | Instala Bootstrap |
| `npm run copy:bootstrap` | Copia Bootstrap a `public/` |

## Estructura del proyecto

```
/
├── backend/
│   ├── src/
│   │   ├── modules/            módulos de negocio (vacío por ahora)
│   │   ├── shared/             config, db, errors, http, logger
│   │   ├── app.js              composición de Express
│   │   └── server.js           arranque
│   ├── migrations/
│   ├── tests/unit y tests/integration
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── public/                 index.html, css/, js/
│   ├── nginx.conf
│   ├── Dockerfile
│   └── package.json
├── docker/db/init/             script que crea la base de pruebas
├── docs/                       reglas de negocio, arquitectura, convenciones y specs
├── docker-compose.yml
├── .env.example
└── README.md
```

## Documentación y convenciones

- `docs/business-rules.md`: reglas de negocio (RN-xx), fuente de verdad funcional.
- `docs/architecture.md`: capas, estructura de carpetas y reglas de dependencia.
- `docs/conventions.md`: nombres, errores, pruebas, ramas y commits.
- `docs/adr/`: decisiones de arquitectura (0001 limpia modular, 0002 multi-tenant, 0003 stack).
- `docs/specs/`: especificaciones por feature.

## Problemas comunes

- **El servidor no arranca y nombra una variable**: falta esa variable en tu `.env`.
- **`docker compose up` falla al inicio**: la primera vez puede tardar en descargar imágenes; el
  backend espera al *healthcheck* de la base.
- **Un puerto está ocupado**: usa `BACKEND_HOST_PORT`, `DB_HOST_PORT` o `FRONTEND_HOST_PORT`.
- **Los archivos de Bootstrap no aparecen**: ejecuta `npm run copy:bootstrap` (o construye con Docker).
