import { PickType } from "@nestjs/swagger";
import { TaskStatus } from "../entities/task_status.entity";

export class TaskStatusFindAllDto extends PickType(TaskStatus, [
    'id',
    'description',
    'identifier'
]) {
}