import { Credential } from "src/domain/credential/entities/credential.entity";
import { RobotColumn } from "src/domain/robot-column/entities/robot-column.entity";
import { AggregateRoot } from "src/domain/shared/aggregate-root";
import { System } from "src/domain/system/entities/system.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";

@Entity({ name: "robots" })
export class Robot extends AggregateRoot {

    @Column()
    name: string;

    @Column({ nullable: true })
    repositoryUrl: string;

    @Column({ nullable: true })
    documentationUrl: string;

    @Column({ nullable: true })
    tableName: string;

    @Column()
    objective: string;

    @Column({ default: false })
    activated: boolean;

    @Column({ nullable: true })
    exampleWorkbook: string;

    @OneToMany(
        () => RobotColumn,
        (field) => field.robot, {
        cascade: true,
        orphanedRowAction: 'delete'
    })
    columns?: RobotColumn[];

    @ManyToMany(
        () => System,
        (system) => system.robot, {
        cascade: ['insert', 'update'],
    })
    @JoinTable({ name: 'robots_systems' })
    system: System[];

    @ManyToMany(
        () => Credential,
        (credential) => credential.robot, {
        cascade: ['insert', 'update']
    })
    @JoinTable({ name: 'robots_credentials' })
    credential: Credential[]

}