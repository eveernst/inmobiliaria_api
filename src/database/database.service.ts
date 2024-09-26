import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

export const databaseProviders = [
    TypeOrmModule.forRootAsync({
        name: 'default',
        async useFactory() {
            return {
                type: 'mysql' as const,
                host: process.env.DB_HOST,
                username: process.env.DB_USER,
                port: parseInt(process.env.DB_PORT),
                database: process.env.DB_NAME,
                password: process.env.DB_PASSWORD,
                entities: [
                    __dirname + '/../**/*.entity.{js,ts}'
                ],
                synchronize: true,
                cache: true,
            } as DataSourceOptions;
        },
    }),
    // TypeOrmModule.forRootAsync({
    //     name: 'fuxion',
    //     async useFactory() {
    //         return {
    //             type: 'postgres' as const,
    //             host: 'ec2-44-206-89-185.compute-1.amazonaws.com',
    //             username: 'qocxffjfrbvgce',
    //             port: 5432,
    //             database: 'd5hniptehrqe13',
    //             password: '96afeccc62cc6d94d992dcb751cc56d10e274c91bd8c7aca92691d34651e60d9',
    //             ssl: true,
    //             extra: {
    //                 ssl: {
    //                     rejectUnauthorized: false,
    //                 },
    //             },
    //             entities: [],
    //             synchronize: false,
    //         } as DataSourceOptions;
    //     },
    // }),

    // TypeOrmModule.forRootAsync({
    //     name: 'fuxion',
    //     async useFactory() {
    //         return {
    //             type: 'mysql' as const,
    //             host: process.env.DB_HOST,
    //             username: process.env.DB_USER,
    //             port: parseInt(process.env.DB_PORT),
    //             database: process.env.DB_NAME,
    //             password: process.env.DB_PASSWORD,
    //             entities: [__dirname + '/../**/*.entity.{js,ts}'],
    //             synchronize: true,
    //         } as DataSourceOptions;
    //     },
    // }),
];
