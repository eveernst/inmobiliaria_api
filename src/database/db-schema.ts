export const DEFAULT_DB_SCHEMA = 'public';

// One rule for the running app and the TypeORM CLI (data-source.ts), so a
// migration is never applied to a different schema than the app reads (#72).
export function resolveDbSchema(value?: string): string {
  return value?.trim() || DEFAULT_DB_SCHEMA;
}
