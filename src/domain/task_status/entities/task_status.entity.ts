import { AggregateRoot } from "src/domain/shared/aggregate-root";
import { Column, Entity, } from "typeorm";

@Entity({name:'tasks_status'})
export class TaskStatus extends AggregateRoot {

    @Column({type:'varchar',length:50,nullable:false})
    description:string;

    @Column({type:'varchar',length:50,nullable:false})
    identifier:string;

}