import { DataSource } from "typeorm";
import { BaseRepository } from "../shared/base-repository";
import { Permission } from "./entities/permission.entity";
import { Injectable } from "@nestjs/common";


@Injectable()
export class PermissionRepository extends BaseRepository<Permission>{
    constructor(dataSource:DataSource){
        super(Permission,dataSource)
    }
}