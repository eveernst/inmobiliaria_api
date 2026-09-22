# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**inmobiliaria_api** is the backend for a real-estate management system. It tracks properties
and everything attached to them over their lifecycle: installations, zoning/use classification,
rental contracts, insurance policies, deed records ("escrituras"), building plans, and the
notifications generated when a document or contract is about to expire.

Built with **NestJS** (TypeScript) + **TypeORM** over **PostgreSQL** (hosted on **Supabase**).
Auth is JWT-based with a role system (`UserRole.ADMIN`, `UserRole.VIEWER`, `UserRole.SUPERUSER`);
user/role management is superuser-only.

## Commands

```bash
npm install             # Install dependencies
npm run start           # Start the app (no watch)
npm run dev             # Start in watch mode
npm run start:debug     # Start in watch mode with the debugger attached
npm run start:prod      # Run the compiled build (dist/main)
npm run build           # Compile TypeScript (nest build)
npm run lint            # eslint --fix — auto-fixes in place, always exits 0
npm run lint:check      # eslint without --fix — actually fails on lint errors, use this to verify
npm run test            # Unit tests (jest) — no DB required
npm run test:watch      # Unit tests in watch mode
npm run test:cov        # Unit tests with coverage
npm run test:e2e        # e2e tests (jest -e2e config) — boots AppModule, needs Postgres
npm run precommit       # lint:check + build + test — run before committing/pushing
npm run seed:superuser  # Seed a superuser account (reads SUPERUSER_EMAIL/PASSWORD/NAME from env)
```

CI (`.github/workflows/ci.yml`) runs `npm ci`, `lint:check`, `build`, and `test` (unit only —
the e2e suite needs a live Postgres and isn't wired into the pipeline) on every PR and on every
push to `master`.

## Architecture

Each domain lives under `src/modules/<name>/` with the same shape — follow it for any new module:

```
<name>.module.ts
<name>.controller.ts
<name>.service.ts
dtos/create-<name>.dto.ts
dtos/read-<name>.dto.ts
entities/<name>.entity.ts
```

Current modules (`src/modules/`):

- **`auth/`** — login, JWT issuance (`jwt.strategy.ts` reads the user and sets `request.user`).
- **`users/`** — user accounts and roles. Create/update/delete is superuser-only.
- **`property/`** — the central entity. A property has one classification, one owning user,
  and many installations/plans/rented contracts/writings/insurances/notifications.
- **`installation/`** — installations attached to a property.
- **`classification/`** — zoning / allowed-use classification for a property.
- **`insurance-record/`** — insurance policies (ARM/ASE coverage, annual renewal forms).
- **`plan-record/`** — building plans (structure, gas, water, electrical, project, final).
- **`rented-record/`** — rental contracts.
- **`writing-record/`** — deed records ("escrituras"), JDAAC/JDUA board votes.
- **`notification/`** — system-generated warnings. Created on successful property/installation
  registration, and by a daily `@Cron` job that warns 7 days before a document/contract's end
  date (deduplicated: it checks for an existing notification for the same entity + due date
  before inserting).

Shared code lives in `src/shared/`:

- **`guards/`** — `JwtAuthGuard` (authentication) and `RolesGuard` (authorization).
- **`decorators/`** — `@Roles(...)` (metadata for `RolesGuard`), `@IsRequired()` (custom
  `class-validator` decorator, see below), `@IsAfterDate()` / `@IfAfterToday()` (date ordering
  validators).
- **`enums/user-role.enum.ts`** — `UserRole` (`ADMIN`, `VIEWER`, `SUPERUSER`).
- **`entities/base.entity.ts`** — common entity base (id, timestamps).
- **`generic-response.dto.ts`** — response envelope used by most controllers.

`src/database/database.module.ts` wires TypeORM via `ConfigService`. SSL is conditional on the
DB host: `ssl: isRemote ? { rejectUnauthorized: false } : false` — never hardcode SSL on for a
localhost/dev database. `synchronize` is enabled outside production only.

## Security Rules

These are enforced, not decorative — don't work around them, fix the DTO/controller instead.

1. **Guards on every controller that writes data.** Use
   `@UseGuards(JwtAuthGuard, RolesGuard)` at the controller level, plus `@Roles(UserRole.ADMIN)`
   (or `SUPERUSER`) on `POST`/`PUT`/`DELETE` handlers. `GET` handlers behind the class-level
   guard still require a valid JWT, just no specific role. See `users.controller.ts` and
   `property.controller.ts` for the reference pattern. Don't leave a controller unguarded
   because "it's simple."

2. **Responses are always mapped through a `Read*Dto`.** Use `plainToInstance(ReadXDto, entity,
   { excludeExtraneousValues: true })` and `@Expose()` on every field the DTO actually returns.
   `excludeExtraneousValues: true` is what makes this safe — without it, `class-transformer`
   copies every own-enumerable property of the entity, `@Expose()` or not. This is the pattern
   fixed into `users.controller.ts` (see git history: "stop leaking password hash from user DTO
   responses") — some older controllers (e.g. `property.controller.ts`) still use the looser
   `plainToClass` without `excludeExtraneousValues`; treat that as legacy to fix opportunistically,
   not as a second valid pattern.

3. **Never expose the password hash.** `ReadUserDto` only `@Expose()`s `name`, `email`, `role`.
   If you add a field to `ReadUserDto`, it must be something safe to return to a client — never
   copy `User` wholesale into a response.

4. **The global `ValidationPipe` (`main.ts`) is strict**: `whitelist: true`,
   `forbidNonWhitelisted: true`, `transform: true`, and — critically — no
   `skipMissingProperties`/`skipUndefinedProperties`. That means a bare type validator like
   `@IsString()` on a `field?: string` DTO property **rejects requests that omit the field**,
   because `undefined` isn't a string. Every optional DTO field needs `@IsOptional()` in addition
   to its type validator:

   ```ts
   @IsOptional()
   @IsString()
   insuranceLink?: string;
   ```

   This was a real bug (see `fix: add missing @IsOptional() on optional insurance DTO fields`) —
   several other `create-*.dto.ts` files have the same latent issue on their optional fields;
   check before adding new optional fields to any DTO, and fix the ones you touch.

5. **`@IsRequired()`** (`src/shared/decorators/is-required.decorator.ts`) is a custom
   `class-validator` decorator layered on top of the standard ones. For strings it rejects
   blank/whitespace-only values (`value.trim() !== ''`); for everything else it just rejects
   `null`/`undefined` — so it does **not** reject `false` or `0`, which makes it safe to stack
   on boolean/number fields alongside `@IsNotEmpty()` without breaking falsy-but-valid values.
   It's stricter than `@IsNotEmpty()` only for strings (whitespace-only fails `@IsRequired()`
   but passes `@IsNotEmpty()`).

## Database

- TypeORM `synchronize` is enabled outside production — don't hand-write migrations for schema
  changes in dev, but don't rely on `synchronize` being on in production either.
- Postgres runs on Supabase. SSL is conditional on host (see Architecture above) — never
  hardcode it on for local/dev.

## Hygiene

- Don't leave orphaned modules around after removing a feature — delete the whole
  `dtos/`/`entities/`/`controller`/`module`/`service` set together, and check for lingering
  imports in `app.module.ts` and elsewhere before considering a removal complete.
