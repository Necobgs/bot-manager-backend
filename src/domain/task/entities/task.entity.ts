import { Robot } from "src/domain/robot/entities/robot.entity";
import { AggregateRoot } from "src/domain/shared/aggregate-root";
import { TaskStatus } from "src/domain/task_status/entities/task_status.entity";
import { User } from "src/domain/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity({ name: 'tasks' })
export class Task extends AggregateRoot {

    @Column({ name: 'started_at', nullable: true })
    startedAt: Date;

    @Column({ nullable: true })
    response: string;

    @Column({ nullable: true })
    observation: string;

    @Column({ name: 'schedule_init', nullable: true })
    scheduleInit: Date;

    @Column({ name: 'ended_at', nullable: true })
    endedAt: Date;

    @Column({ name: 'qty_total', nullable: false })
    qtyTotal: number;

    @Column({ name: 'qty_error', nullable: false, default: 0 })
    qtyError: number;

    @Column({ name: 'qty_success', nullable: false, default: 0 })
    qtySuccess: number;

    @Column({ name: 'qty_done', nullable: false, default: 0 })
    qtyDone: number;

    @ManyToOne(() => TaskStatus)
    @JoinColumn({ name: 'id_task_status' })
    taskStatus: TaskStatus;

    @ManyToOne(() => Robot)
    @JoinColumn({ name: 'id_robot' })
    robot: Robot;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'id_imported_by' })
    importedBy: User;
}