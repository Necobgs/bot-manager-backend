import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../shared/base-repository";
import { System } from "./entities/system.entity";
import { DataSource } from "typeorm";


@Injectable()
export class SystemRepository extends BaseRepository<System>{
    constructor(dataSource:DataSource){
        super(System,dataSource)
    }
}