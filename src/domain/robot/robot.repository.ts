import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../shared/base-repository";
import { Robot } from "./entities/robot.entity";
import { DataSource } from "typeorm";


@Injectable()
export class RobotRepository extends BaseRepository<Robot>{
    constructor(dataSource:DataSource){
        super(Robot,dataSource)
    }
}