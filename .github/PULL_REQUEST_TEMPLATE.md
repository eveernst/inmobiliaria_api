## Qué cambia
<!-- breve descripción del cambio -->

## Issue
Closes #

## Checklist
- [ ] `npm run precommit` corre limpio (lint:check + build + test)
- [ ] Tests nuevos/actualizados si el cambio lo amerita
- [ ] Si agregaste un campo opcional a un DTO: tiene `@IsOptional()` además del validador de tipo (ver CLAUDE.md § Security Rules)
- [ ] Si el endpoint escribe datos: tiene `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(...)` correspondiente
- [ ] Si el endpoint devuelve una entidad: la respuesta pasa por un `Read*Dto` con `plainToInstance(..., { excludeExtraneousValues: true })`, no la entidad cruda
- [ ] Self-review del diff antes de pedir review

## Notas para el reviewer
<!-- contexto adicional, decisiones que tomé, cosas que mirar con lupa -->

## Screenshots / logs
<!-- si aplica -->
