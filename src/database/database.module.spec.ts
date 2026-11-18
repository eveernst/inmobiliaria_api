import { ConfigService } from '@nestjs/config';
import { createDatabaseOptions } from './database.module';

describe('createDatabaseOptions', () => {
  it.each(['production', 'development'])(
    'disables synchronize in %s',
    (nodeEnv) => {
      const config = new ConfigService({
        NODE_ENV: nodeEnv,
        DB_HOST: 'localhost',
        DB_PORT: '5432',
      });

      expect(createDatabaseOptions(config).synchronize).toBe(false);
    },
  );

  // With synchronize off, pending migrations are the only way schema changes
  // reach the database; a manual deploy step was never run (issue #23).
  it.each(['production', 'development'])(
    'runs pending migrations on startup in %s',
    (nodeEnv) => {
      const config = new ConfigService({
        NODE_ENV: nodeEnv,
        DB_HOST: 'localhost',
        DB_PORT: '5432',
      });

      expect(createDatabaseOptions(config).migrationsRun).toBe(true);
    },
  );

  // The app and the TypeORM CLI (data-source.ts) must target the same schema
  // or a migration can be applied to one while the app reads the other (#72).
  describe('schema', () => {
    const baseEnv = { DB_HOST: 'localhost', DB_PORT: '5432' };

    it('defaults to public when DB_SCHEMA is not set', () => {
      const config = new ConfigService({ ...baseEnv });

      expect(createDatabaseOptions(config)).toMatchObject({ schema: 'public' });
    });

    it('uses DB_SCHEMA when it is set', () => {
      const config = new ConfigService({ ...baseEnv, DB_SCHEMA: 'inmo' });

      expect(createDatabaseOptions(config)).toMatchObject({ schema: 'inmo' });
    });

    it.each([undefined, '', 'inmo'])(
      'resolves the same schema as the CLI data source (DB_SCHEMA=%p)',
      async (schema) => {
        const env: NodeJS.ProcessEnv = { ...process.env, ...baseEnv };
        delete env.DB_SCHEMA;
        if (schema !== undefined) env.DB_SCHEMA = schema;
        const saved = process.env;
        process.env = env;
        let cliSchema: unknown;
        try {
          await jest.isolateModulesAsync(async () => {
            const { default: dataSource } = await import('./data-source');
            cliSchema = (dataSource.options as { schema?: string }).schema;
          });
        } finally {
          process.env = saved;
        }
        const appSchema = (
          createDatabaseOptions(
            new ConfigService({ ...baseEnv, DB_SCHEMA: schema }),
          ) as { schema?: string }
        ).schema;

        expect(cliSchema).toBe(appSchema);
      },
    );
  });
});
