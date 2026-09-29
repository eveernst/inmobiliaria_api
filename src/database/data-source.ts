import 'dotenv/config';
import { DataSource } from 'typeorm';

const dbHost = process.env.DB_HOST;
const isRemote = !['localhost', '127.0.0.1'].includes(dbHost ?? '');

export default new DataSource({
  type: 'postgres',
  host: dbHost,
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  schema: process.env.DB_SCHEMA,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  ssl: isRemote ? { rejectUnauthorized: false } : false,
});
