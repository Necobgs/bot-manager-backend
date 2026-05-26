import { AggregateRoot } from "src/domain/shared/aggregate-root";
import { Column, Entity } from "typeorm";


@Entity({name:'permissions'})
export class Permission extends AggregateRoot{

    @Column()
    resource: string;

    @Column()
    action: 'create' | 'read' | 'update' | 'delete';

}