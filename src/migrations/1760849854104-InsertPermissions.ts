import { Actions } from "src/consts/actions";
import { Resources } from "src/consts/resources";
import { MigrationInterface, QueryRunner } from "typeorm";


export class InsertPermissions1760849854104 implements MigrationInterface {

    resourcesKeys = Object.keys(Resources);
    actionsKeys = Object.keys(Actions);

    public async up(queryRunner: QueryRunner): Promise<void> {

        this.resourcesKeys.map(async (resourceKey) => {
            this.actionsKeys.map(async (actionKey) => {
                await queryRunner.query(`INSERT INTO permissions(resource,action) 
                                    VALUES('${resourceKey}','${actionKey}');`)
            })
        });
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.clearTable('permissions')
    }
}