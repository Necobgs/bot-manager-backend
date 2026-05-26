import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertTaskStatus1753493718952 implements MigrationInterface {

    task_status = [
        'Nova tarefa',
        'Em Andamento',
        'Finalizada',
        'Cancelada',
        'Pausada'
    ]

    public async up(queryRunner: QueryRunner): Promise<void> {
        this.task_status.map(async (status)=>{
            const identifier = status.toLowerCase().replaceAll(' ','_');
            await queryRunner.query(`INSERT INTO tasks_status(description,identifier) VALUES('${status}','${identifier}');`)
        })
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.clearTable('task_status');
    }

}