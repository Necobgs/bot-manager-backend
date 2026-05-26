import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";
import { BaseEntity } from "./base-entity";


export abstract class AggregateRoot extends BaseEntity {

    @CreateDateColumn({
        name: 'created_at',
        type: 'time with time zone',
        default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'time with time zone',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP'
    })
    updatedAt: Date;

    @DeleteDateColumn({
        name: 'deleted_at',
        type: 'time with time zone',
    })
    deletedAt: Date;

}