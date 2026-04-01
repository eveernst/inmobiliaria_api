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

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProduction = config.get('NODE_ENV') === 'production';

        return {
          type: 'postgres',
          host: config.get('DB_HOST'),
          port: Number(config.get('DB_PORT')),
          username: config.get('DB_USER'),
          password: config.get('DB_PASSWORD'),
          database: config.get('DB_NAME'),
          autoLoadEntities: true,
          synchronize: !isProduction,
          ssl: { rejectUnauthorized: false },
        };
      },
    }),
  ],
})
export class DatabaseModule {}
