import { hash } from 'bcrypt';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertAdminUser1760849999999 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const passwordHash = await hash('admin123', 10);

        const insertResult: any = await queryRunner.query(
            `INSERT INTO users(name, email, password, ad) VALUES($1,$2,$3,$4) RETURNING id;`,
            ['Admin', 'admin@local', passwordHash, 'admin']
        );

        const userId = insertResult && insertResult[0] ? insertResult[0].id : null;
        if (!userId) return;

        const permissions: Array<{ id: number }> = await queryRunner.query(
            `SELECT id FROM permissions WHERE deleted_at IS NULL;`
        );

        if (permissions && permissions.length > 0) {
            for (const p of permissions) {
                await queryRunner.query(
                    `INSERT INTO users_permissions(user_id, permission_id) VALUES($1,$2);`,
                    [userId, p.id]
                );
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM users_permissions WHERE user_id IN (SELECT id FROM users WHERE ad = $1);`, ['admin']);
        await queryRunner.query(`DELETE FROM users WHERE ad = $1;`, ['admin']);
    }

}
