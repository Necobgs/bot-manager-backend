import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../shared/base-repository";
import { RobotColumn } from "../robot-column/entities/robot-column.entity"; 
import { DataSource } from "typeorm";


@Injectable()
export class RobotColumnRepository extends BaseRepository<RobotColumn>{
    constructor(dataSource:DataSource){
        super(RobotColumn,dataSource)
    }
}