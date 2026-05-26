
import { Robot } from 'src/domain/robot/entities/robot.entity';
import { AggregateRoot } from 'src/domain/shared/aggregate-root';
import { Entity, Column, ManyToOne } from 'typeorm';


@Entity({ name: 'robot_columns' })
export class RobotColumn extends AggregateRoot {

    @Column()
    columnName: string;

    @Column()
    dataType: string;

    @Column({ nullable: true })
    columnAlias?: string;

    @Column({ default: false })
    isNullable: boolean;

    @Column({ type: 'smallint' })
    attnum: number;

    @Column({ default: false })
    isImportable: boolean;

    @Column({ nullable: true })
    headerImport?: string;

    @ManyToOne(() => Robot)
    robot: Robot;
}