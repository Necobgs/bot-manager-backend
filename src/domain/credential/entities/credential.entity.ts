import { Robot } from "src/domain/robot/entities/robot.entity";
import { AggregateRoot } from "src/domain/shared/aggregate-root";
import { Column, Entity, ManyToMany } from "typeorm";


@Entity({ name: "credentials" })
export class Credential extends AggregateRoot {

    @Column({ nullable: true })
    user: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: true })
    extraField: string;

    @Column({ default: true })
    activated: boolean;

    @Column({
        type: 'time with time zone',
        nullable: true
    })
    lastUsedDate: Date

    @ManyToMany(() => Robot, (robot) => robot.credential)
    robot: Robot[]

}