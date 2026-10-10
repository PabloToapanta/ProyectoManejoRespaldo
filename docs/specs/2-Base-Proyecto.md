# FEAT-01: Base técnica del proyecto

- **Issue:** #1
- **Módulo:** `infra` (transversal)
- **Responsable:** Pablo
- **Estado:** Borrador 

## 1. Objetivo
Dejar lista la estructura técnica del proyecto para que los cinco integrantes implementen sus módulos en paralelo: backend, frontend, base de datos, migraciones, calidad de código y Docker. Al terminar, `docker compose up` levanta todo y `GET /api/v1/health` responde.

## 2. Reglas involucradas
- `docs/architecture.md`: estructura por módulos, capas y reglas de dependencia.
- ADR 0001, 0002 y 0003: arquitectura modular, multi-tenant y stack.
- RN-02 (multi-tenant): esta feature solo prepara la base; el filtro por `cooperative_id` llega con los módulos.

## 3. Alcance
**Incluye:** estructura de carpetas, backend mínimo con Express, calidad (ESLint, Prettier, Jest), configuración por entorno, logger, errores base, conexión a PostgreSQL, migraciones, Docker Compose, frontend mínimo con Bootstrap y README.

**No incluye (van en otras specs):**
- Autenticación, roles y multi-tenant (módulos `auth` y `tenants`).
- Cualquier módulo de negocio y sus tablas (cada feature trae su migración).
- Husky, commitlint y GitHub Actions (spec `2-calidad-y-ci`).
- Archivos de gobierno del repositorio: CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, LICENSE y plantillas `.github`.
- Datos de prueba (*seed*).

## 4. Decisiones técnicas (propuestas, a confirmar antes de implementar)
| Tema | Decisión | Motivo |
|---|---|---|
| Node.js | **24 (LTS)**, imagen `node:24-alpine` con versión exacta fijada | LTS activa y con soporte amplio de paquetes. Node 26 entra a LTS a fines de octubre de 2026; se puede migrar luego |
| Módulos JS (backend) | **CommonJS** | Jest funciona sin configuración experimental |
| Framework web | Express 5 | |
| PostgreSQL | **17**, imagen `postgres:17-alpine` con versión fijada | Versión madura y estable |
| Acceso a datos | `pg` (node-postgres) sin ORM | ADR 0003 |
| Migraciones | `node-pg-migrate` | ADR 0003 |
| Validación | `zod` (configuración ahora, entradas HTTP después) | |
| Logger | `pino` | Logs estructurados y rápidos |
| Pruebas | Jest + Supertest | |
| Lint y formato | ESLint (flat config) + Prettier | |
| Variables de entorno | `node --env-file`, sin `dotenv`; validadas con `zod` al arrancar | Una dependencia menos |
| Frontend | Bootstrap 5.3 instalado con npm, HTML y JS (módulos ES), servido por Nginx | ADR 0003 |
| Proxy | Nginx reenvía `/api/` al backend | Evita CORS en desarrollo y producción |
| Claves primarias | **UUID** generado por la base (`gen_random_uuid()`) | No enumerables y seguras entre cooperativas |
| Fechas y horas | `timestamptz` en UTC; hora de salida de frecuencia como `time`; presentación en `America/Guayaquil` | |
| Columnas comunes | `id`, `created_at`, `updated_at` | |

## 5. Estructura resultante
```
/
├── backend/
│   ├── src/
│   │   ├── modules/                    (vacía, con .gitkeep)
│   │   ├── shared/
│   │   │   ├── config/                 lectura y validación de variables
│   │   │   ├── db/                     pool de PostgreSQL
│   │   │   ├── errors/                 DomainError y errores base
│   │   │   ├── http/                   middleware de errores, rutas de salud
│   │   │   └── logger/
│   │   ├── app.js                      composición de Express
│   │   └── server.js                   arranque
│   ├── migrations/
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   ├── Dockerfile
│   ├── eslint.config.js
│   ├── .prettierrc
│   ├── jest.config.js
│   └── package.json
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── css/
│   │   └── js/
│   ├── nginx.conf
│   ├── Dockerfile
│   └── package.json
├── docker/
│   └── db/init/01-create-test-db.sql   crea la base de pruebas
├── docker-compose.yml
├── .env.example
├── .gitignore
├── .dockerignore
├── .editorconfig
└── README.md
```

## 6. Scripts del backend (`package.json`)
| Script | Función |
|---|---|
| `npm run dev` | Arranque en desarrollo con recarga |
| `npm start` | Arranque normal |
| `npm run lint` / `npm run lint:fix` | ESLint |
| `npm run format` | Prettier |
| `npm test` | Jest (unitarias e integración) |
| `npm run migrate:create <nombre>` | Crea una migración |
| `npm run migrate:up` / `npm run migrate:down` | Aplica o revierte migraciones |

## 7. Variables de entorno (`.env.example`)
```
NODE_ENV=development
PORT=3000
DB_HOST=db
DB_PORT=5432
DB_NAME=pasajes
DB_USER=pasajes
DB_PASSWORD=cambiar_esta_clave
DB_NAME_TEST=pasajes_test
LOG_LEVEL=info
```
Los secretos reales van en `.env` local, que no se versiona. Si falta o es inválida una variable obligatoria, el servidor **no arranca** y dice cuál.

## 8. Comportamiento esperado
- `GET /api/v1/health` responde `200` con `{ "status": "ok", "database": "up" }`. Si la base no responde, devuelve `503` con `"database": "down"`.
- Errores con formato único: `{ "error": { "code": "...", "message": "..." } }`.
- `DomainError` es la clase base. El middleware traduce los errores de dominio al código HTTP correspondiente y los errores inesperados a `500` sin exponer detalles internos.
- ESLint hace cumplir las reglas de capas de `docs/architecture.md`: `domain` no importa `express`, `pg` ni otras capas, y un módulo no importa las capas internas de otro.
- Las imágenes de Docker llevan versión fija, sin `latest`.
- Compose usa un volumen para los datos y un *healthcheck* en la base; el backend espera a que la base esté lista.
- Las migraciones **no** se ejecutan automáticamente al arrancar. Se aplican con `npm run migrate:up`, también dentro del contenedor.

## 9. Orden sugerido de tareas (commits atómicos)
| # | Tarea | Commit sugerido |
|---|---|---|
| 1 | Archivos base y carpetas: `.gitignore`, `.dockerignore`, `.editorconfig`, `.env.example`, estructura con `.gitkeep` | `chore(infra): agrega archivos base y estructura de carpetas` |
| 2 | Backend mínimo: `package.json`, Express 5, `app.js`, `server.js`, `/api/v1/health` sin base de datos | `feat(infra): agrega backend mínimo con endpoint de salud` |
| 3 | Calidad: ESLint con reglas de capas, Prettier, Jest y Supertest, scripts y una prueba del health | `chore(infra): configura lint, formato y pruebas` |
| 4 | Configuración validada con zod, logger y `DomainError` con su middleware, con pruebas | `feat(infra): agrega configuración, logger y manejo de errores` |
| 5 | Pool de PostgreSQL, health con estado de la base y `node-pg-migrate` con sus scripts | `feat(infra): agrega conexión a PostgreSQL y migraciones` |
| 6 | Dockerfile del backend, `docker-compose.yml` con `backend` y `db`, script que crea la base de pruebas | `build(infra): agrega docker compose con backend y PostgreSQL` |
| 7 | Frontend: `package.json` con Bootstrap, página inicial, script que copia Bootstrap a `public/`, `nginx.conf`, Dockerfile y servicio en Compose | `feat(infra): agrega frontend base con Bootstrap` |
| 8 | README con los pasos para levantar el proyecto y los comandos principales | `docs(infra): agrega README con instrucciones de arranque` |

Las tareas 2 y 3 van primero para que `npm run lint` y `npm test` existan desde temprano: el `implementer` los ejecuta al terminar cada tarea.

## 10. Criterios de aceptación
- [ ] Con `cp .env.example .env` y `docker compose up --build`, los tres servicios levantan sin errores.
- [ ] `curl http://localhost:3000/api/v1/health` devuelve `200` con `database: "up"`.
- [ ] Con la base detenida, el mismo endpoint devuelve `503` con `database: "down"`.
- [ ] El frontend abre en el navegador y muestra la página inicial con Bootstrap, sin depender de CDN.
- [ ] `npm run lint` y `npm test` pasan sin advertencias en el backend.
- [ ] Un archivo de prueba en `domain` que importe `express` hace fallar `npm run lint`.
- [ ] `npm run migrate:up` y `npm run migrate:down` se ejecutan sin error.
- [ ] Existe la base `pasajes_test` y las pruebas de integración se conectan a ella, no a `pasajes`.
- [ ] Si falta `DB_PASSWORD` en el entorno, el servidor no arranca e indica la variable.
- [ ] Ninguna imagen Docker usa `latest` y `.env` está ignorado por Git.
- [ ] El README permite a alguien nuevo levantar el proyecto en menos de 10 minutos.

## 11. Casos borde
- Puerto 3000 o 5432 ocupado en la máquina de alguien: el puerto expuesto debe poder cambiarse con variables.
- La base tarda en iniciar: el backend espera con *healthcheck* y no falla al primer intento.
- Windows y Linux: los scripts npm no deben depender de comandos específicos de un sistema (usar herramientas multiplataforma en el script que copia Bootstrap).
- Fin de línea: `.editorconfig` y Prettier fijan LF.

## 12. Pruebas esperadas
- Unitarias: validación de configuración (válida e inválida), `DomainError` y middleware de errores.
- Integración: `GET /api/v1/health` con base disponible y con base caída (simulada).

## 13. Preguntas abiertas
- ¿Confirmamos Node 24 y PostgreSQL 17, o se prefiere Node 26 (LTS desde fines de octubre) y PostgreSQL 18?
- ¿El equipo aprueba las claves primarias UUID? Si se aprueban, se agregan a `docs/conventions.md`.
- ¿Todos los integrantes tienen Docker instalado y funcionando en sus máquinas?
