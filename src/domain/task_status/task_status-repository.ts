import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../shared/base-repository";
import { TaskStatus } from "./entities/task_status.entity";
import { DataSource } from "typeorm";


@Injectable()
export class TaskStatusRepository extends BaseRepository<TaskStatus>{
    constructor(dataSource:DataSource){
        super(TaskStatus,dataSource)
    }
}