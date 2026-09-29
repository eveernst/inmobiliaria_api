// import { Module } from '@nestjs/common';
// import { databaseProviders } from './database.service';

// @Module({
//     imports: [...databaseProviders],
//     exports: [...databaseProviders],
// })
// export class DatabaseModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function createDatabaseOptions(
  config: ConfigService,
): TypeOrmModuleOptions {
  const dbHost = config.get<string>('DB_HOST');
  const isRemote = !['localhost', '127.0.0.1'].includes(dbHost);

  return {
    type: 'postgres',
    host: dbHost,
    port: Number(config.get('DB_PORT')),
    username: config.get('DB_USER'),
    password: config.get('DB_PASSWORD'),
    database: config.get('DB_NAME'),
    autoLoadEntities: true,
    migrations: [__dirname + '/migrations/*{.js,.ts}'],
    synchronize: false,
    ssl: isRemote ? { rejectUnauthorized: false } : false,
  };
}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createDatabaseOptions,
    }),
  ],
})
export class DatabaseModule {}
