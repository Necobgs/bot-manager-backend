import { Permission } from "src/domain/permission/entities/permission.entity";
import { Robot } from "src/domain/robot/entities/robot.entity";
import { AggregateRoot } from "src/domain/shared/aggregate-root";
import { hashPassword } from "src/utils/hash-password";
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany } from "typeorm";

@Entity({ name: 'users' })
export class User extends AggregateRoot {

    @Column()
    name: string;

    @Column()
    email: string;

    @Column({ select: false })
    password: string;

    @Column()
    ad: string;

    @ManyToMany(() => Robot)
    @JoinTable({ name: 'users_robots' })
    robot: Robot[];

    @ManyToMany(() => Permission)
    @JoinTable({
        name: 'users_permissions',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'permission_id',
            referencedColumnName: 'id',
        }
    })
    permissions: Permission[];


    @BeforeInsert()
    async hashPassword() {
        this.password = await hashPassword(this.password)
    }

}
