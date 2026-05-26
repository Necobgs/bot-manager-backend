import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../shared/base-repository";
import { Task } from "./entities/task.entity";
import { DataSource } from "typeorm";


@Injectable()
export class TaskRepository extends BaseRepository<Task>{
    constructor(dataSource:DataSource){
        super(Task,dataSource)
    }
}