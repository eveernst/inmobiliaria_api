// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigService } from '@nestjs/config';
// import { DataSourceOptions } from 'typeorm';

// export const databaseProviders = [
//     TypeOrmModule.forRootAsync({
//         name: 'default',
//         inject: [ConfigService],

//         async useFactory() {
//             return {
//                 type: 'mysql' as const,
//                 host: process.env.DB_HOST,
//                 username: process.env.DB_USER,
//                 port: parseInt(process.env.DB_PORT),
//                 database: process.env.DB_NAME,
//                 password: process.env.DB_PASSWORD,
//                 entities: [
//                     __dirname + '/../**/*.entity.{js,ts}'
//                 ],
//                 synchronize: true, // ⚠️ solo en desarrollo
//                 logging: true,
//             } as DataSourceOptions;
//         },
//     })
// ];

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

export const databaseProviders = [
  TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const isProduction = configService.get('NODE_ENV') === 'production';

      return {
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/../**/*.entity.{js,ts}'],
        synchronize: !isProduction,
        logging: !isProduction,
        ssl: isProduction ? { rejectUnauthorized: false } : false,
        extra: isProduction
          ? {
              max: 10,
              idleTimeoutMillis: 30000,
              connectionTimeoutMillis: 2000,
            }
          : {},
      } as DataSourceOptions;
    },
  }),
];
