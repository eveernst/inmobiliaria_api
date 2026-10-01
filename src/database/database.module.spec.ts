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
});
