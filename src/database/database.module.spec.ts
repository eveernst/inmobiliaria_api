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
});
