import { Robot } from "src/domain/robot/entities/robot.entity";
import { AggregateRoot } from "src/domain/shared/aggregate-root";
import { Column, Entity, ManyToMany } from "typeorm";

@Entity({name:"systems"})
export class System extends AggregateRoot{

    @Column({nullable:false})
    name:string;

    @Column({nullable:true})
    url:string;

    @ManyToMany(()=>Robot, (robot)=>robot.system)
    robot:Robot[]

}