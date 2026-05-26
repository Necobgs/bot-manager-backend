import { DataSource } from "typeorm";
import * as dotenv from 'dotenv'

dotenv.config()

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_RPA_HOST!,
    port: +process.env.DB_RPA_PORT!,
    username: process.env.DB_RPA_USER!,
    password: process.env.DB_RPA_PASSW!,
    database: process.env.DB_RPA_DATABASE!,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.ts,.js}'],
    migrationsTableName: 'migrations',
})