import { MigrationInterface, QueryRunner } from 'typeorm';
import { InitialSchema1790645605325 } from './migrations/1790645605325-InitialSchema';
import { AddNotificationDueDateTracking1790646760921 } from './migrations/1790646760921-AddNotificationDueDateTracking';
import { AddNotificationDueDateUniqueIndex1790647000000 } from './migrations/1790647000000-AddNotificationDueDateUniqueIndex';

// This spec lives outside migrations/ on purpose: the migration globs in
// data-source.ts and database.module.ts load every file in that folder, and
// the CLI would try to run this spec as a migration.
//
// Catch-up migrations only (issue #23). The shared database was built by
// `synchronize` before migrations existed, so these three must be safe to run
// on a database that already has (part of) the schema. The checks below fail
// if a regenerated version loses its guards.
//
// Do NOT add new migrations to this list. New migrations run on a known schema
// and must be plain statements that fail loudly: a no-op `IF NOT EXISTS` is
// still recorded as applied, which would hide a schema mismatch.
const catchUpMigrations: MigrationInterface[] = [
  new InitialSchema1790645605325(),
  new AddNotificationDueDateTracking1790646760921(),
  new AddNotificationDueDateUniqueIndex1790647000000(),
];

const upStatements = async (migration: MigrationInterface) => {
  const query = jest.fn().mockResolvedValue(undefined);
  const queryRunner = {
    connection: { options: {} },
    query,
  } as unknown as QueryRunner;

  await migration.up(queryRunner);

  return query.mock.calls.map(([sql]: [string]) => sql);
};

describe.each(
  catchUpMigrations.map((migration) => [migration.name, migration]),
)('catch-up migration %s', (_name, migration) => {
  it('only creates tables that do not exist yet', async () => {
    const statements = await upStatements(migration as MigrationInterface);

    statements
      .filter((sql) => /CREATE TABLE/i.test(sql))
      .forEach((sql) => expect(sql).toMatch(/CREATE TABLE IF NOT EXISTS/i));
  });

  it('only adds columns that do not exist yet', async () => {
    const statements = await upStatements(migration as MigrationInterface);

    statements
      .filter((sql) => /ALTER TABLE .* ADD "/i.test(sql))
      .forEach((sql) => expect(sql).toMatch(/ADD COLUMN IF NOT EXISTS/i));
  });

  it('only creates indexes that do not exist yet', async () => {
    const statements = await upStatements(migration as MigrationInterface);

    statements
      .filter((sql) => /CREATE (UNIQUE )?INDEX/i.test(sql))
      .forEach((sql) => expect(sql).toMatch(/INDEX IF NOT EXISTS/i));
  });

  it('only adds constraints that do not exist yet', async () => {
    const statements = await upStatements(migration as MigrationInterface);

    statements
      .filter((sql) => /ADD CONSTRAINT/i.test(sql))
      .forEach((sql) => {
        const name = /ADD CONSTRAINT "([^"]+)"/i.exec(sql)?.[1];

        expect(sql).toMatch(/IF NOT EXISTS \(\s*SELECT 1 FROM pg_constraint/i);
        expect(sql).toContain(`conname = '${name}'`);
      });
  });
});
