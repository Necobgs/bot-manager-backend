import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { RobotColumn } from "./entities/robot-column.entity";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { InformationSchemaColumnData, InformationSchemaTableName } from "../shared/interfaces/information_schema.interface";


@Injectable()
export class RobotColumnService {

    constructor(
        @InjectRepository(RobotColumn) private readonly repository: Repository<RobotColumn>,
        @InjectDataSource() private readonly dataSource: DataSource
    ) { }

    async findAllColumns(robotId: number) {
        return await this.repository.findBy({ robot: { id: robotId } })
    }

    async getColumnFromTable(tableName: string) {
        const resultSearchs = await this.dataSource.query<InformationSchemaColumnData[]>(`
            SELECT
                a.attname               AS "columnName",
                a.attnum                AS "attnum",
                t.typname               AS "dataType",
                NOT a.attnotnull        AS "isNullable"
            FROM pg_attribute a
            JOIN pg_class c       ON c.oid = a.attrelid
            JOIN pg_type t        ON t.oid = a.atttypid
            JOIN pg_namespace n   ON n.oid = c.relnamespace
            WHERE
                n.nspname = 'public'
                AND c.relname = $1
                AND a.attnum > 0
                AND NOT a.attisdropped
            ORDER BY a.attnum;`,
            [tableName])

        return resultSearchs.map(result => {
            const robotColumn = new RobotColumn()
            Object.assign(robotColumn, result)
            return robotColumn;
        })
    }

    async tableExists(tableName: string) {
        const resultSearchTable = await this.dataSource.query<InformationSchemaTableName[]>(`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public'
          AND table_name = $1;
          `,
            [tableName])

        return resultSearchTable.length >= 1 ? true : false
    }

}