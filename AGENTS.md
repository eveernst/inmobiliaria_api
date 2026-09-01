# AGENTS.md — inmobiliaria_api (backend)

Coding standards and conventions for this repo (NestJS, TypeORM, PostgreSQL). Written from the
codebase's own established patterns — match these rather than introducing new ones.

## Module structure

Each domain lives under `src/modules/<name>/` with the same shape:

```
<name>.module.ts
<name>.controller.ts
<name>.service.ts
dtos/create-<name>.dto.ts
dtos/read-<name>.dto.ts
entities/<name>.entity.ts
```

Follow this layout for any new domain module rather than inventing a different one.

## Auth and roles

- Roles are defined in `src/shared/enums/user-role.enum.ts` (`UserRole`). Protect endpoints with
  `@UseGuards(JwtAuthGuard, RolesGuard)` plus `@Roles(UserRole.ADMIN, UserRole.SUPERUSER)` (see
  `property.controller.ts` for the reference implementation) — don't leave a controller
  unguarded because "it's simple."
- `RolesGuard` compares `user.role` from the JWT (set in `auth/jwt.strategy.ts`) — don't
  duplicate that logic elsewhere.
- User management (create/update/delete users, assign roles) is superuser-only.

## Validation

- `main.ts` registers a global `ValidationPipe` (`whitelist`, `forbidNonWhitelisted`,
  `transform: true`). DTOs must carry real `class-validator` decorators — they're actually
  enforced, not decorative.
- Don't accept looser payloads than the DTO declares; rely on the pipe rather than manual
  `if` checks for required-field validation.

## Database

- TypeORM `synchronize` is enabled outside production — don't hand-write migrations for schema
  changes in dev, but don't rely on `synchronize` being on in production either.
- SSL is conditional on the DB host: `ssl: isRemote ? { rejectUnauthorized: false } : false`
  (`database.module.ts`) — never hardcode SSL on for a localhost/dev database.

## Notifications

- Notifications are system-triggered, not manually created through public CRUD endpoints:
  on successful property/installation registration, and via a daily scheduled job
  (`@nestjs/schedule` `@Cron`) that warns 7 days before a document/contract's end date. Guard
  against creating duplicate notices on repeated cron runs (check for an existing notification
  for the same entity + due date before inserting).

## Hygiene

- Don't leave orphaned modules around after removing a feature — delete the whole
  `dtos/`/`entities/`/`controller`/`module`/`service` set together, and check for lingering
  imports in `app.module.ts` and elsewhere before considering a removal complete.
