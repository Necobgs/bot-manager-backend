import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialRoles1768965018954 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        // 1. Buscar permissões
        const permissions: Array<{ id: number,resource:string,action:string }> =
            await queryRunner.query(`SELECT id,resource, action FROM permissions`);

        // 2. Criar role e pegar o ID
        const [roleDev]: Array<{ id: number }> =
            await queryRunner.query(
                `INSERT INTO roles(name) VALUES ($1) RETURNING id`,
                ['Dev']
            );

        const [roleUser]: Array<{ id: number }> =
            await queryRunner.query(
                `INSERT INTO roles(name) VALUES ($1) RETURNING id`,
                ['User']
            );

        // 3. Relacionar role x permissions
        await Promise.all(
            permissions.map( permission => {
                // Dev - todas as permissões
                queryRunner.query(
                    `INSERT INTO roles_permissions(role_id, permission_id)
                     VALUES ($1, $2)`,
                    [roleDev.id, permission.id]
                )

                // User - apenas ler tarefas
                if(permission.resource === 'tasks' && permission.action === 'read'){
                    queryRunner.query(
                        `INSERT INTO roles_permissions(role_id, permission_id)
                        VALUES ($1, $2)`,
                        [roleUser.id, permission.id]
                    )
                }
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM roles_permissions
            WHERE role_id = (SELECT id FROM roles WHERE name in ('Dev','User'))
        `);

        await queryRunner.query(`
            DELETE FROM roles WHERE name = 'Dev'
        `);
    }
}
