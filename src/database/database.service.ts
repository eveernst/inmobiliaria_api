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

      console.log('DB_HOST:', configService.get('DB_HOST'));
      console.log('DB_USER:', configService.get('DB_USER'));
      console.log('DB_PASSWORD:', configService.get('DB_PASSWORD'));
      console.log('DB_NAME:', configService.get('DB_NAME'));

      return {
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/../**/*.entity.{js,ts}'],
        synchronize: true, // ⚠️ solo en desarrollo
        logging: true,
      } as DataSourceOptions;
    },
  }),
];
