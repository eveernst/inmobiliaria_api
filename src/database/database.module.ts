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
      useFactory: () => ({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'inmobiliaria',
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
