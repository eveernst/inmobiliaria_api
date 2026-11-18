# inmobiliaria_api

API REST del sistema de gestión de propiedades de la Asociación Argentina Central (AAC),
proyecto de Informática Aplicada (UAP). Administra propiedades, instalaciones y su documentación
(seguros, alquileres, planos y escrituras), usuarios con tres roles (usuario común,
administrador y superusuario) y los avisos de vencimiento. El frontend vive en
[eveernst/inmobiliaria](https://github.com/eveernst/inmobiliaria).

Stack: NestJS 10, TypeORM, PostgreSQL (Supabase), JWT, class-validator, Jest.

## Configuración local

```bash
npm install
cp .env.example .env   # y completá los valores (nunca subas .env al repo)
npm run dev
```

Variables de entorno (ver `.env.example`):

| Variable | Para qué sirve |
|---|---|
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Conexión a PostgreSQL. Si el host no es `localhost`/`127.0.0.1` se usa SSL |
| `DB_SCHEMA` | Esquema de la base (por defecto `public`); lo usan la app y el CLI de migraciones |
| `JWT_SECRET` | Secreto para firmar los tokens. Obligatorio: la app no arranca sin él |
| `FRONTEND_URL` | Origen del frontend permitido por CORS en producción |
| `PORT` | Puerto de la API (por defecto `3000`) |
| `NODE_ENV` | `development` o `production` |
| `ENABLE_SWAGGER` | En producción, `true` publica Swagger UI en `/api`; sin esto queda apagado |
| `SUPERUSER_EMAIL`, `SUPERUSER_PASSWORD`, `SUPERUSER_NAME` | Datos del primer superusuario para el seed |

Primer superusuario (una sola vez, con las variables `SUPERUSER_*` definidas):

```bash
npm run seed:superuser
```

## Comandos

```bash
npm run dev            # desarrollo con recarga
npm run build          # compila a dist/
npm run start:prod     # corre dist/main (producción)
npm run lint:check     # ESLint sin autocorrección
npm test               # pruebas unitarias (Jest, sin base de datos)
npm run precommit      # lint:check + build + test
```

La integración continua (`.github/workflows/ci.yml`) corre lint, build y pruebas en cada pull
request y en cada push a `master`.

## Database migrations

The API uses PostgreSQL and TypeORM migrations. Schema synchronization is disabled in every
environment. Pending migrations run automatically when the API starts (`migrationsRun: true`),
so a normal deploy needs no extra step. The CLI commands are for creating migrations and for
running or reverting them by hand:

```bash
# Generate a migration after changing an entity
npm run migration:generate -- src/database/migrations/describe-change

# Apply pending migrations
npm run migration:run

# Revert the latest migration when needed
npm run migration:revert
```

Run these commands with the database variables configured in `.env`. Do not enable
`synchronize` as a substitute for migrations.

**Catch-up vs. new migrations.** The first three migrations (`InitialSchema`,
`AddNotificationDueDateTracking`, `AddNotificationDueDateUniqueIndex`) are *catch-up* migrations:
the shared database was built by `synchronize` before migrations existed, so they are idempotent
(`IF NOT EXISTS`, guarded `ADD CONSTRAINT`). `src/database/migrations.spec.ts` checks those three
only.

**New migrations work the other way around:** they run on a known schema, so write them as plain
statements that fail loudly. A no-op `IF NOT EXISTS` still gets recorded as applied, so a schema
that doesn't match what you expected goes unnoticed until something breaks at runtime. Don't add
new migrations to `migrations.spec.ts`.

Keep specs and any other non-migration files out of `src/database/migrations/`, because every file
in that folder is loaded as a migration.

## Despliegue (Render)

- Build: `npm run build`. Start: `npm run start:prod` (Node.js 20).
- Al iniciar, la API aplica sola las migraciones pendientes.
- En el plan gratuito de Render el servicio se duerme tras un rato sin tráfico: la primera
  respuesta puede tardar entre 30 y 60 segundos (cold start), y el aviso diario de vencimientos
  (cron) no corre mientras el servicio está dormido.
- Swagger UI no se publica en producción salvo que se defina `ENABLE_SWAGGER=true`.
