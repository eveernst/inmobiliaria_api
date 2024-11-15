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
                // synchronize: true,
                logging: true,
            } as DataSourceOptions;
        },
    })
];
